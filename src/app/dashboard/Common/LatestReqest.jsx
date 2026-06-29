"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import { statusRequest } from "@/lib/action/statusUpdate";
import { deleteRequest } from "@/lib/action/DeleteRequest";
import { UpdateRequest } from "@/lib/action/requestUpdate";
import Link from "next/link";

const LatestRequest = ({ data = [], userId,userRole='donor' }) => {
  const router = useRouter();
  
  // মোডাল স্টেটসমূহ
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // স্ট্যাটাস চেঞ্জের জন্য স্টেট (Done/Cancel)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({ id: "", nextStatus: "" });

  const executeDelete = async () => {
    if (!selectedRequest) return; // সেফটি চেক
    const requestId = selectedRequest._id?.$oid || selectedRequest._id;
    const result = await deleteRequest(requestId, userId);

    if (result.success) {
      toast.success("Request successfully deleted!");
      setIsDeleteOpen(false);
      setSelectedRequest(null);
      router.refresh();
    } else {
      toast.error("Something went wrong. Try again later.");
    }
  };

  const triggerStatusModal = (id, nextStatus) => {
    setPendingStatusUpdate({ id, nextStatus });
    setIsStatusModalOpen(true);
  };

  const executeStatusUpdate = async () => {
    const { id, nextStatus } = pendingStatusUpdate;
    const updateData = { status: nextStatus };

    const result = await statusRequest(updateData, id, userId);
    if (result.success) {
      toast.success(`Status updated to ${nextStatus}`);
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
    setIsStatusModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return; // সেফটি চেক
    
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
    const result = await UpdateRequest(updatedData, requestId, userId);
    if (result.success) {
      toast.success("Successfully updated!");
      setIsEditOpen(false);
      setSelectedRequest(null);
      router.refresh();
    } else {
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="space-y-4 mt-8">
      {/* হেডার সেকশন */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-slate-800">Recent Donation Requests</h2>
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/${userRole}/create-donation-request`} 
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            <Plus size={14} strokeWidth={2.5} /> New Request
          </Link>
          <Link 
            href={`/dashboard/${userRole}/my-donation-requests`}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition"
          >
            View My All Requests
          </Link>
        </div>
      </div>

      {/* মেইন টেবিল কার্ড */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {data.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-xs font-semibold text-slate-400">
              You haven't posted any blood donation requests yet.
            </p>
            <Link href={`/dashboard/${userRole}/create-donation-request`}>
              <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition mt-2">
                <Plus size={14} strokeWidth={2.5} /> Create First Request
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Location & Hospital</th>
                  <th className="p-4 text-center">Blood Group</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Date/Time</th>
                  <th className="p-4 text-center">Donor</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {data.map((req) => {
                  const reqId = req._id?.$oid || req._id;
                  const isClosed = req.status === "done" || req.status === "canceled";

                  return (
                    <tr key={reqId} className="hover:bg-slate-50/40 transition">
                      <td className="p-4 font-bold text-slate-900">{req.recipient_name}</td>
                      <td className="p-4">
                        <span className="block text-slate-700 font-medium">{req.hospital_name}</span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          {req.upazila}, {req.district}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-600 font-black border border-rose-100 text-[10px]">
                          {req.blood_group}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                          req.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                          req.status === "inprogress" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                          req.status === "done" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                          "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          • {req.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="block text-slate-700 font-medium text-center">{req.donation_date}</span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5 text-center">
                         {req.donation_time}
                        </span>
                      </td>
                       <td className="p-4">
                        <span className="block text-slate-700 font-medium text-center">{req.donor_name||"---"}</span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5 text-center">
                         {req.donor_email}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/dashboard/Common/${reqId}`}>
                          <button
                            
                            className="cursor-pointer p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
                          >
                            <Eye size={13} strokeWidth={2.5} />
                          </button>
                          </Link>

                          {!isClosed && (
                            <>
                              {req.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => { setSelectedRequest(req); setIsEditOpen(true); }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-blue-600 transition"
                                  >
                                    <Edit2 size={13} strokeWidth={2.5} />
                                  </button>
                                  <button
                                    onClick={() => { setSelectedRequest(req); setIsDeleteOpen(true); }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-rose-600 transition"
                                  >
                                    <Trash2 size={13} strokeWidth={2.5} />
                                  </button>
                                </>
                              )}

                              {req.status === "inprogress" && (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => triggerStatusModal(reqId, "done")}
                                    className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-emerald-700 transition"
                                  >
                                    Done
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
      </div>

      {/* 🛑 STATUS CONFIRMATION MODAL */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 text-center shadow-xl border border-slate-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${pendingStatusUpdate.nextStatus === "done" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-sm font-black text-slate-800 capitalize">Change Status to {pendingStatusUpdate.nextStatus}?</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Are you sure? একবার আপডেট করলে এটি আর পরিবর্তন করা যাবে না।</p>
            <div className="flex gap-2 justify-center mt-4 text-xs font-bold">
              <button onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition">Dismiss</button>
              <button onClick={executeStatusUpdate} className={`px-4 py-2 text-white rounded-lg transition ${pendingStatusUpdate.nextStatus === "done" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}>Confirm</button>
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
            <p className="text-[11px] text-slate-400 font-medium mt-1">This will permanently remove the request for <span className="font-bold text-slate-700">{selectedRequest.recipient_name}</span>.</p>
            <div className="flex gap-2 justify-center mt-4 text-xs font-bold">
              <button onClick={() => { setIsDeleteOpen(false); setSelectedRequest(null); }} className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition">Cancel</button>
              <button onClick={executeDelete} className="px-4 py-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ VIEW DETAILS MODAL */}
      {isViewOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-3.5 shadow-xl text-xs font-semibold text-slate-600">
            <h2 className="text-sm font-black text-slate-900 border-b pb-2 flex items-center gap-1.5"><Eye size={16} className="text-rose-600" /> Request Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <p><span className="text-[10px] text-slate-400 block font-bold uppercase">Recipient</span>{selectedRequest.recipient_name}</p>
              <p><span className="text-[10px] text-slate-400 block font-bold uppercase">Blood Group</span><span className="text-rose-600 font-black">{selectedRequest.blood_group}</span></p>
              <p><span className="text-[10px] text-slate-400 block font-bold uppercase">Hospital</span>{selectedRequest.hospital_name}</p>
              <p><span className="text-[10px] text-slate-400 block font-bold uppercase">Location</span>{selectedRequest.upazila}, {selectedRequest.district}</p>
              <p className="col-span-2"><span className="text-[10px] text-slate-400 block font-bold uppercase">Full Address</span>{selectedRequest.full_address}</p>
              <p><span className="text-[10px] text-slate-400 block font-bold uppercase">Schedule</span>{selectedRequest.donation_date} ({selectedRequest.donation_time})</p>
              <p><span className="text-[10px] text-slate-400 block font-bold uppercase">Status</span><span className="capitalize font-bold text-slate-800">{selectedRequest.status}</span></p>
            </div>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span className="text-[10px] text-slate-400 block font-bold uppercase mb-0.5">Message</span>{selectedRequest.request_message}</p>
            <div className="text-right pt-1.5">
              <button onClick={() => { setIsViewOpen(false); setSelectedRequest(null); }} className="px-4 py-1.5 bg-rose-600 text-white rounded-md text-xs font-bold hover:bg-rose-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 EDIT MODAL */}
      {isEditOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl max-h-[85vh] overflow-y-auto space-y-4">
            <h2 className="text-sm font-black text-slate-900 border-b pb-2 flex items-center gap-1.5"><Edit2 size={16} className="text-rose-600" /> Modify Request Form</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-0.5">Recipient Name</label>
                <input type="text" name="recipient_name" required defaultValue={selectedRequest.recipient_name} className="w-full p-2 border rounded-lg focus:outline-none focus:border-rose-600" />
              </div>
              
              <div>
                <label className="block mb-0.5">Full Address</label>
                <input type="text" name="full_address" required defaultValue={selectedRequest.full_address} className="w-full p-2 border rounded-lg focus:outline-none focus:border-rose-600" />
              </div>
              <div>
                <label className="block mb-0.5">Hospital Name</label>
                <input type="text" name="hospital_name" required defaultValue={selectedRequest.hospital_name} className="w-full p-2 border rounded-lg focus:outline-none focus:border-rose-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-0.5">Donation Date</label>
                  <input type="date" name="donation_date" required min={new Date().toISOString().split("T")[0]} defaultValue={selectedRequest.donation_date} className="w-full p-2 border rounded-lg focus:outline-none focus:border-rose-600" />
                </div>
                <div>
                  <label className="block mb-0.5">Preferred Time</label>
                  <input type="time" name="donation_time" required defaultValue={selectedRequest.donation_time} className="w-full p-2 border rounded-lg focus:outline-none focus:border-rose-600" />
                </div>
              </div>
              <div>
                <label className="block mb-0.5">Request Message</label>
                <textarea rows={2.5} name="request_message" required defaultValue={selectedRequest.request_message} className="w-full p-2 border rounded-lg focus:outline-none focus:border-rose-600" />
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button type="button" onClick={() => { setIsEditOpen(false); setSelectedRequest(null); }} className="px-4 py-1.5 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200 transition">Dismiss</button>
                <button type="submit" className="px-4 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition">Save Adjustments</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestRequest;