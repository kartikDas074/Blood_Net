"use client";
import React, { useState, useEffect } from "react";
import { getMyRequest } from "@/lib/api/FindData";
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
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

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

export default function GetMyRequest({ userId }) {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং সার্চ স্টেট
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // মোডাল স্টেটসমূহ
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // 🆕 স্ট্যাটাস চেঞ্জের জন্য নতুন স্টেট (Done/Cancel Confirmation)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({ id: "", nextStatus: "" });

  // 📋 ডেটা ফেচিং ইফেক্ট
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getMyRequest(userId, page, 10, status, search);
        if (isMounted) {
          if (res.success) {
            setRequests(res.data);
            setPagination(res.pagination);
          } else {
            toast.error("Failed to load requests.");
          }
        }
      } catch (error) {
        console.error("Fetch Error Detail:", error);
        if (isMounted) toast.error("An error occurred while fetching data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId, page, status]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setPage(1);

    if (!userId) return;
    setLoading(true);
    try {
      const res = await getMyRequest(userId, 1, 10, status, search);
      if (res.success) {
        setRequests(res.data);
        setPagination(res.pagination);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!userId) return;
    try {
      const res = await getMyRequest(userId, page, 10, status, search);
      if (res.success) {
        setRequests(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const executeDelete = async () => {
    toast.success("Request successfully deleted!");
    setIsDeleteOpen(false);
    refreshData();
  };

  // 🆕 মোডাল ওপেন করার হ্যান্ডলার
  const triggerStatusModal = (id, nextStatus) => {
    setPendingStatusUpdate({ id, nextStatus });
    setIsStatusModalOpen(true);
  };

  // 🆕 মোডাল থেকে কনফার্ম করলে এই ফাংশন রান হবে
  const executeStatusUpdate = async () => {
    const { id, nextStatus } = pendingStatusUpdate;
    // এখানে তোর ব্যাকএন্ড এপিআই কল হবে (যেমন: axios.patch বা fetch)
    // আপাতত টোস্ট এবং রিফ্রেশ দিয়ে হ্যান্ডেল করা হলো
    toast.success(`Status updated to ${nextStatus}`);
    setIsStatusModalOpen(false);
    refreshData();
  };

  // 🆕 এডিট ফর্ম সাবমিট হ্যান্ডলার (সব ডেটা কালেক্ট করার জন্য)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // 📋 সব ইনপুট ডেটা অবজেক্ট আকারে কালেক্ট করা হলো
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

    console.log("Collected Edited Data:", updatedData);
    
    // এখানে তোর এপিআই কল করবি ব্যাকএন্ডে আপডেট করার জন্য:
    // const res = await updateRequestDetails(selectedRequest._id, updatedData);

    toast.success("Successfully updated!");
    setIsEditOpen(false);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* 📊 ৪টি ডাইমানিক রিইউজেবল স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          count={pagination.total || 0}
          icon={FileText}
          bgIcon="bg-slate-50 text-slate-500"
        />
        <StatCard
          title="Pending"
          count={requests.filter((r) => r.status === "pending").length}
          icon={XCircle}
          bgIcon="bg-amber-50 text-amber-500"
        />
        <StatCard
          title="Completed"
          count={requests.filter((r) => r.status === "done").length}
          icon={CheckSquare}
          bgIcon="bg-emerald-50 text-emerald-500"
        />
        <StatCard
          title="Canceled"
          count={requests.filter((r) => r.status === "canceled").length}
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
              className={`px-4 py-1.5 rounded-md transition-all ${
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

      {/* 📋 মেইন ডেটা টেবিল */}
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
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {requests.map((req) => {
                  const reqId = req._id?.$oid || req._id;
                  const isClosed = req.status === "done" || req.status === "canceled";

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
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* View বাটন সবসময় থাকবে */}
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsViewOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
                            title="View"
                          >
                            <Eye size={13} strokeWidth={2.5} />
                          </button>

                          {/* 🔒 যদি done বা canceled (isClosed) না হয়, তবেই বাকি অ্যাকশন দেখাবে */}
                          {!isClosed && (
                            <>
                              {req.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setIsEditOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-blue-600 transition"
                                    title="Edit"
                                  >
                                    <Edit2 size={13} strokeWidth={2.5} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setIsDeleteOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-rose-600 transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} strokeWidth={2.5} />
                                  </button>
                                </>
                              )}

                              {req.status === "inprogress" && (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => triggerStatusModal(reqId, "done")}
                                    className="bg-[#991B1B] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-red-900 transition"
                                  >
                                    Mark as Done
                                  </button>
                                  <button
                                    onClick={() => triggerStatusModal(reqId, "canceled")}
                                    className="border border-slate-200 text-slate-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-slate-50 transition"
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
              Showing <span className="text-slate-700">{(page - 1) * 10 + 1}-{Math.min(page * 10, pagination.total)}</span> of <span className="text-slate-700">{pagination.total}</span> requests.
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40 transition"
              >
                <ChevronLeft size={12} strokeWidth={3} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition-all ${
                    page === p ? "bg-[#991B1B] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40 transition"
              >
                <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🆕 🛑 DONE / CANCEL STATUS CONFIRMATION MODAL */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 text-center shadow-xl border border-slate-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${pendingStatusUpdate.nextStatus === 'done' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-sm font-black text-slate-800 capitalize">
              Change Status to {pendingStatusUpdate.nextStatus}?
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Are you sure you want to mark this request as <span className="font-bold text-slate-700">{pendingStatusUpdate.nextStatus}</span>? 
              <br />একবার আপডেট করলে এটি আর পরিবর্তন করা যাবে না।
            </p>
            <div className="flex gap-2 justify-center mt-4 text-xs font-bold">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition"
              >
                Dismiss
              </button>
              <button
                onClick={executeStatusUpdate}
                className={`px-4 py-2 text-white rounded-lg transition ${pendingStatusUpdate.nextStatus === 'done' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 text-center shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-sm font-black text-slate-800">Delete Blood Request?</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              This will permanently remove the donation request for <span className="font-bold text-slate-700">{selectedRequest.recipient_name}</span>.
            </p>
            <div className="flex gap-2 justify-center mt-4 text-xs font-bold">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition">Cancel</button>
              <button onClick={executeDelete} className="px-4 py-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ VIEW DETAILS MODAL */}
      {isViewOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-3.5 shadow-xl text-xs font-semibold text-slate-600">
            <h2 className="text-sm font-black text-slate-900 border-b pb-2 flex items-center gap-1.5">
              <Eye size={16} className="text-[#991B1B]" /> Full Request Specifications
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <p>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Recipient</span>
                {selectedRequest.recipient_name}
              </p>
              <p>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Blood Group</span>
                <span className="text-rose-600 font-black">{selectedRequest.blood_group}</span>
              </p>
              <p>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Hospital</span>
                {selectedRequest.hospital_name}
              </p>
              <p>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">District & Upazila</span>
                {selectedRequest.upazila}, {selectedRequest.district} {/* 👈 এখানে Upazila এবং District শো করা হলো */}
              </p>
              <p className="col-span-2">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Full Address</span>
                {selectedRequest.full_address || `${selectedRequest.upazila}, ${selectedRequest.district}`}
              </p>
              <p>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Schedule</span>
                {selectedRequest.donation_date} ({selectedRequest.donation_time})
              </p>
              <p>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Status</span>
                <span className="capitalize font-bold text-slate-800">{selectedRequest.status}</span>
              </p>
            </div>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold uppercase mb-0.5">Message</span>
              {selectedRequest.request_message}
            </p>
            <div className="text-right pt-1.5">
              <button onClick={() => setIsViewOpen(false)} className="px-4 py-1.5 bg-[#991B1B] text-white rounded-md text-xs font-bold hover:bg-red-900 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 EDIT MODAL */}
      {isEditOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl max-h-[85vh] overflow-y-auto space-y-4">
            <h2 className="text-sm font-black text-slate-900 border-b pb-2 flex items-center gap-1.5">
              <Edit2 size={16} className="text-[#991B1B]" /> Modify Request Form
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg text-[11px]">
                <div>
                  <label className="text-slate-400 block mb-0.5">Requester Name</label>
                  <input type="text" readOnly value={selectedRequest.requesterName} className="w-full bg-slate-100 p-2 border rounded-md cursor-not-allowed text-slate-400" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">Requester Email</label>
                  <input type="text" readOnly value={selectedRequest.requesterEmail} className="w-full bg-slate-100 p-2 border rounded-md cursor-not-allowed text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block mb-0.5">Recipient Name</label>
                <input type="text" name="recipient_name" required defaultValue={selectedRequest.recipient_name} className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
              </div>

              {/* 🆕 District & Upazila ইনপুট ফিল্ড গ্রুপ */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-0.5">District</label>
                  <input type="text" name="district" required defaultValue={selectedRequest.district} placeholder="e.g. Chattogram" className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
                </div>
                <div>
                  <label className="block mb-0.5">Upazila</label>
                  <input type="text" name="upazila" required defaultValue={selectedRequest.upazila} placeholder="e.g. Panchlaish" className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
                </div>
              </div>

              {/* 🆕 Full Address ইনপুট ফিল্ড */}
              <div>
                <label className="block mb-0.5">Full Address</label>
                <input type="text" name="full_address" required defaultValue={selectedRequest.full_address} placeholder="e.g. House 12, Road 5, Panchlaish" className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
              </div>

              <div>
                <label className="block mb-0.5">Hospital Name</label>
                <input type="text" name="hospital_name" required defaultValue={selectedRequest.hospital_name} className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-0.5">Donation Date</label>
                  <input type="date" name="donation_date" required min={new Date().toISOString().split("T")[0]} defaultValue={selectedRequest.donation_date} className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
                </div>
                <div>
                  <label className="block mb-0.5">Preferred Time</label>
                  <input type="time" name="donation_time" required defaultValue={selectedRequest.donation_time} className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B]" />
                </div>
              </div>

              <div>
                <label className="block mb-0.5">Request Message</label>
                <textarea rows={2.5} name="request_message" required defaultValue={selectedRequest.request_message} className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#991B1B] resize-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-1.5 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200 transition">Dismiss</button>
                <button type="submit" className="px-4 py-1.5 bg-[#991B1B] text-white rounded-md hover:bg-red-900 transition">Save Adjustments</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}