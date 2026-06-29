"use client";
import React, { useState, useEffect } from "react";
import { getAllRequest } from "@/lib/api/FindData";
import {
  Eye,
  Edit2,
  Trash2,
  CheckSquare,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { statusRequest } from "@/lib/action/statusUpdate";
import { deleteRequest } from "@/lib/action/DeleteRequest";
import { UpdateRequest } from "@/lib/action/requestUpdate";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// 📊 স্ট্যাটাস কার্ড উপাদান
const StatCard = ({ title, count, icon: Icon, bgIcon }) => (
  <div className="p-5 bg-white rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-2xl font-black text-slate-800 mt-0.5">{count}</h3>
    </div>
    <div className={`p-2.5 rounded-lg ${bgIcon}`}>
      <Icon size={18} className="opacity-80" />
    </div>
  </div>
);

export default function GetAllRequest({
  userId,
  initialRequests = [],
  statistics: initialStatistics = {},
  pagination: initialPagination = { page: 1, totalPages: 1, total: 0 },
  currentStatus = "",
  currentSearch = "",
}) {

  const {data:session}=authClient.useSession();
  const user=session?.user;
 
  const [requests, setRequests] = useState(initialRequests);
  const [pagination, setPagination] = useState(initialPagination);
  const [statistics, setStatistics] = useState(initialStatistics);
  const [loading, setLoading] = useState(false);

  // ফিল্টার এবং সার্চ স্টেট
  const [status, setStatus] = useState(currentStatus);
  const [search, setSearch] = useState(currentSearch);
  const [page, setPage] = useState(1);

  // মোডাল স্টেটসমূহ
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({
    id: "",
    nextStatus: "",
  });

  // 📋 গ্লোবাল ডাটা ফেচ ও রিফ্রেশ ফাংশন (সব জায়গায় একই লজিক কাজ করবে)
  // 🔄 অ্যাকশন (Delete, Edit, Status) শেষে রিয়াল-টাইম রিফ্রেশের জন্য কাস্টম ফাংশন
  const refreshData = async (
    targetPage = page,
    targetStatus = status,
    targetSearch = search,
  ) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getAllRequest(
        userId,
        targetPage,
        10,
        targetStatus,
        targetSearch,
      );
      if (res.success) {
        setRequests(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
        if (res.statistics) setStatistics(res.statistics);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (error) {
      console.error("Fetch Error Detail:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const startFetching = async () => {
      // সিঙ্ক্রোনাসলি setState কল এড়াতে এটাকে async ফাংশনের ভেতরে রাখা হয়েছে
      setLoading(true);
      try {
        const res = await getAllRequest(userId, page, 10, status, search);
        if (isMounted && res.success) {
          setRequests(res.data || []);
          setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
          if (res.statistics) setStatistics(res.statistics);
        }
      } catch (error) {
        console.error("Effect Fetch Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    startFetching();

    return () => {
      isMounted = false; // রেস কন্ডিশন হ্যান্ডেল করার জন্য
    };
  }, [userId, page, status, search]);
  // সার্চ সাবমিট হ্যান্ডলার
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    refreshData(1, status, search);
  };

  // 🗑️ ডিলিট রিকোয়েস্ট এক্সিকিউট
  const executeDelete = async () => {
    if (!selectedRequest) return;
    const requestId = selectedRequest._id?.$oid || selectedRequest._id;

    try {
      const result = await deleteRequest(requestId, userId);
      if (result.success) {
        toast.success("Request successfully deleted!");
        setIsDeleteOpen(false);
        setSelectedRequest(null);
        refreshData(page, status, search); // রিয়েল-টাইম ডাটা ও কাউন্ট আপডেট
      } else {
        toast.error(result.message || "Something went wrong, try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }
  };

  // 🔄 স্ট্যাটাস চেঞ্জ মোডাল ট্রিগার
  const triggerStatusModal = (id, nextStatus) => {
    setPendingStatusUpdate({ id, nextStatus });
    setIsStatusModalOpen(true);
  };

  // ⚡ স্ট্যাটাস চেঞ্জ এক্সিকিউট (Done / Canceled)
  const executeStatusUpdate = async () => {
    const { id, nextStatus } = pendingStatusUpdate;
    const data = { status: nextStatus };

    try {
      const result = await statusRequest(data, id, userId);
      if (result.success) {
        toast.success(`Status updated to ${nextStatus}`);
        setIsStatusModalOpen(false);
        refreshData(page, status, search); // রিয়েল-টাইম ডাটা ও কাউন্ট আপডেট
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }
  };

  // 📝 এডিট রিকোয়েস্ট সাবমিট
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedData = {
      recipient_name: formData.get("recipient_name"),
      hospital_name: formData.get("hospital_name"),
      district: formData.get("district"),
      upazila: formData.get("upazila"),
      full_address: formData.get("full_address"),
      donation_date: formData.get("donation_date"),
      donation_time: formData.get("donation_time"),
      request_message: formData.get("request_message"),
    };

    const requestId = selectedRequest._id?.$oid || selectedRequest._id;

    try {
      const result = await UpdateRequest(updatedData, requestId, userId);
      if (result.success) {
        toast.success("Successfully updated!");
        setIsEditOpen(false);
        setSelectedRequest(null);
        refreshData(page, status, search); // আপডেট শেষে টেবিল রিফ্রেশ
      } else {
        toast.error("Something went wrong. Try again later");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Requests"
          count={statistics.totalRequests || 0}
          icon={FileText}
          bgIcon="bg-slate-50 text-slate-500"
        />
        <StatCard
          title="Pending"
          count={statistics.pendingRequests || 0}
          icon={Clock}
          bgIcon="bg-amber-50 text-amber-500"
        />
        <StatCard
          title="In Progress"
          count={statistics.inprogressRequests || 0}
          icon={AlertTriangle}
          bgIcon="bg-blue-50 text-blue-500"
        />
        <StatCard
          title="Completed"
          count={statistics.completedRequests || 0}
          icon={CheckSquare}
          bgIcon="bg-emerald-50 text-emerald-500"
        />
        <StatCard
          title="Canceled"
          count={statistics.cancelledRequests || 0}
          icon={XCircle}
          bgIcon="bg-rose-50 text-rose-500"
        />
      </div>

      {/* 🔍 সার্চ এবং কাস্টম ট্যাব ফিল্টার */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Recipient or Hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#E11D48]"
          />
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </form>

        <div className="flex bg-slate-100 p-1 rounded-lg self-stretch md:self-auto overflow-x-auto text-[11px] font-bold">
          {[
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            { label: "In Progress", value: "inprogress" },
            { label: "Done", value: "done" },
            { label: "Canceled", value: "canceled" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                status === tab.value
                  ? "bg-[#991B1B] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

   
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col justify-center items-center gap-2 text-slate-400 font-bold text-xs">
            <Loader2 className="animate-spin text-[#991B1B]" size={24} />{" "}
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-bold text-xs space-y-2">
            <p>No donation requests found for the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Recipient & Location</th>
                  <th className="p-4 text-center">Blood Group</th>
                  <th className="p-4">Date / Time</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Donor</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {requests.map((req) => {
                  const reqId = req._id?.$oid || req._id;
                  const isClosed =
                    req.status === "done" || req.status === "canceled";

                  return (
                    <tr key={reqId} className="hover:bg-slate-50/40 transition">
                      <td className="p-4">
                        <span className="block font-bold text-slate-900">
                          {req.recipient_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          {req.hospital_name}, {req.upazila}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-600 font-black border border-rose-100 text-[10px]">
                          {req.blood_group}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-medium text-[11px]">
                        <span className="block font-bold text-slate-700">
                          {req.donation_date}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {req.donation_time}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            req.status === "pending"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : req.status === "inprogress"
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : req.status === "done"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          • {req.status}
                        </span>
                      </td>
                       <td className="p-4 text-slate-500 font-medium text-[11px]">
                        <span className="block font-bold text-slate-700 text-center">
                          {req.donor_name||"---"}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-bold text-center uppercase">
                          {req.donor_email||""}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/dashboard/Common/${reqId}`}>
                            <button
                              className="p-1.5 cursor-pointer rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
                              title="View"
                            >
                              <Eye size={13} strokeWidth={2.5} />
                            </button>
                          </Link>

                          {!isClosed && (
                            <>
                              {req.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setIsEditOpen(true);
                                    }}
                                    className={`${user.role==='admin'?'flex':'hidden'} p-1.5 cursor-pointer rounded-lg border border-slate-200 hover:bg-slate-50 text-blue-600 transition`}
                                    title="Edit"
                                  >
                                    <Edit2 size={13} strokeWidth={2.5} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setIsDeleteOpen(true);
                                    }}
                                    className={`${user.role==='admin'?'flex':'hidden'} p-1.5 cursor-pointer rounded-lg border border-slate-200 hover:bg-slate-50 text-rose-600 transition`}
                                    title="Delete"
                                  >
                                    <Trash2 size={13} strokeWidth={2.5} />
                                  </button>
                                </>
                              )}

                              {req.status === "inprogress" && (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() =>
                                      triggerStatusModal(reqId, "done")
                                    }
                                    className="bg-[#991B1B] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-red-900 transition cursor-pointer"
                                  >
                                    Mark as Done
                                  </button>
                                  <button
                                    onClick={() =>
                                      triggerStatusModal(reqId, "canceled")
                                    }
                                    className="border border-slate-200 text-slate-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔢 পেজিনেশন */}
        {!loading && pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400">
            <div>
              Showing{" "}
              <span className="text-slate-700">
                {(page - 1) * 10 + 1}-{Math.min(page * 10, pagination.total)}
              </span>{" "}
              of <span className="text-slate-700">{pagination.total}</span>{" "}
              requests.
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft size={12} strokeWidth={3} />
              </button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition-all cursor-pointer ${
                    page === p
                      ? "bg-[#991B1B] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔄 ১. স্ট্যাটাস আপডেট কনফার্মেশন মোডাল */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-sm font-bold text-slate-800">
              Change Status Confirmation
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to change this request status to{" "}
              <span className="font-bold text-slate-800 uppercase">
                {pendingStatusUpdate.nextStatus}
              </span>
              ? This action is irreversible.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={executeStatusUpdate}
                className="px-3 py-1.5 rounded-lg bg-[#991B1B] text-white text-xs font-bold hover:bg-red-900 transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ ২. ডিলিট কনফার্মেশন মোডাল */}
      {isDeleteOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-sm font-bold text-slate-800">Delete Request</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to delete the donation request for{" "}
              <span className="font-bold text-slate-800">
                {selectedRequest.recipient_name}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedRequest(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 ৩. এডিট মোডাল */}
      {isEditOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs overflow-y-auto p-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl max-w-lg w-full my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Edit Donation Request
              </h3>
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedRequest(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="space-y-4 text-xs font-semibold text-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    name="recipient_name"
                    defaultValue={selectedRequest.recipient_name}
                    required
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospital_name"
                    defaultValue={selectedRequest.hospital_name}
                    required
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

            

              <div>
                <label className="block mb-1 text-slate-500">
                  Full Address
                </label>
                <input
                  type="text"
                  name="full_address"
                  defaultValue={selectedRequest.full_address}
                  required
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500">
                    Donation Date
                  </label>
                  <input
                    type="date"
                    name="donation_date"
                    defaultValue={selectedRequest.donation_date}
                    required
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500">
                    Donation Time
                  </label>
                  <input
                    type="text"
                    name="donation_time"
                    defaultValue={selectedRequest.donation_time}
                    placeholder="e.g. 11:30 AM"
                    required
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-500">
                  Request Message
                </label>
                <textarea
                  name="request_message"
                  defaultValue={selectedRequest.request_message}
                  rows={3}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#E11D48] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#991B1B] text-white font-bold hover:bg-red-900 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
