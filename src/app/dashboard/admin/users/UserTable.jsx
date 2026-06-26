"use client";
import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  Users, CheckCircle2, Ban, Shield, UserCheck, 
  MoreVertical, Search, ShieldAlert, UserPlus,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { userUpdate } from "@/lib/action/statusUpdate";

const UsersTableClient = ({ initialUsers, statistics, pagination, currentStatus, currentSearch }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchVal, setSearchVal] = useState(currentSearch);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [modalType, setModalType] = useState(null); 
  const [targetUser, setTargetUser] = useState(null);
  const [isPending, setIsPending] = useState(false); // ⏳ এপিআই লোডিং স্টেট

  const updateQueries = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusFilter = (status) => {
    updateQueries({ status, page: 1 });
  };

  const handlePageChange = (pageTarget) => {
    if (pageTarget >= 1 && pageTarget <= pagination.totalPages) {
      updateQueries({ page: pageTarget });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueries({ search: searchVal, page: 1 });
  };

  const openActionModal = (type, user) => {
    setTargetUser(user);
    setModalType(type);
    setActiveMenuId(null); 
  };
  
  // ⚡ এপিআই দিয়ে ডাটা আপডেট করার মেইন ফাংশন
  const handleExecuteAction = async () => {
    if (!targetUser || !modalType) return;
    const req_id = targetUser._id?.$oid || targetUser._id;
    
    // মোডাল টাইপ অনুযায়ী ডাইনামিক ডাটা অবজেক্ট তৈরি
    let updateData = {};
    if (modalType === "block") updateData = { status: "blocked" };
    else if (modalType === "unblock") updateData = { status: "active" };
    else if (modalType === "volunteer") updateData = { role: "volunteer" };
    else if (modalType === "admin") updateData = { role: "admin" };

    try {
      setIsPending(true);
      
      // তোর অ্যাকশন বা এপিআই রুট কল
      const response = await userUpdate(req_id, updateData);
      
      // যদি রেসপন্স নেক্সট জেএস সার্ভার অ্যাকশন বা এক্সিওস থেকে ডিরেক্ট আসে
      // অনেক সময় ডাটা .json() করা লাগে বা সরাসরি অবজেক্ট থাকে, তোর এপিআই ফরম্যাট অনুযায়ী চেক:
      if (response?.success || response?.status === 200) {
        console.log("Success:", response.message || "User updated successfully");
        setModalType(null);
        setTargetUser(null);
        router.refresh(); // নতুন ডাটা সার্ভার থেকে ফেচ করার জন্য
      } else {
        console.error("Failed to update user status/role");
      }
    } catch (error) {
      console.error("Error executing user update operation:", error);
    } finally {
      setIsPending(false);
    }
  };

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      
      {/* ================= STATISTICS CARDS ================= */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Total Users", count: statistics.totalUsers, icon: Users, color: "text-slate-600 bg-slate-100" },
          { label: "Active Network", count: statistics.activeUsers, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Blocked Pool", count: statistics.blockedUsers, icon: Ban, color: "text-rose-600 bg-rose-50" },
          { label: "Volunteers", count: statistics.volunteerUsers, icon: UserCheck, color: "text-blue-600 bg-blue-50" },
          { label: "System Admins", count: statistics.adminUsers, icon: Shield, color: "text-purple-600 bg-purple-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/70 rounded-2xl p-5 flex justify-between items-center shadow-xs transition-all duration-200 hover:shadow-md">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{item.label}</p>
              <h3 className="mt-1.5 text-2xl font-black text-slate-800 tracking-tight">{item.count.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-xl ${item.color} shadow-2xs`}>
              <item.icon size={20} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= SEARCH & FILTERING TABS ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
          />
          <Search size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
        </form>

        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">
          {[
            { id: "all", label: "All Members" },
            { id: "active", label: "Active" },
            { id: "blocked", label: "Blocked" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentStatus === tab.id 
                  ? "bg-white text-slate-900 shadow-md font-extrabold scale-[1.02]" 
                  : "hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN USERS TABLE ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-visible pb-24 sm:pb-20">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">User Profile</th>
                <th className="p-4">Authority Role</th>
                <th className="p-4">Network Status</th>
                <th className="p-4 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {initialUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-xs font-bold text-slate-400">
                    No matching users discovered in the network database.
                  </td>
                </tr>
              ) : (
                initialUsers.map((user, index) => {
                  const uId = user._id?.$oid || user._id;
                  const isLastRows = initialUsers.length > 3 && index >= initialUsers.length - 3;

                  return (
                    <tr key={uId} className="hover:bg-slate-50/40 transition-colors duration-150">
                      <td className="p-4 pl-6 flex items-center gap-3.5">
                        <Image
                          src={user.image || "/avatar.png"}
                          alt={user.name || "User Avatar"}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium block mt-0.5">{user.email}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                          user.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          user.role === "volunteer" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                          user.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          "bg-rose-50 text-rose-600 border-rose-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {user.status}
                        </span>
                      </td>

                      <td className="p-4 pr-8 text-right relative overflow-visible">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === uId ? null : uId)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            activeMenuId === uId 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "border-slate-200/80 hover:bg-slate-50 text-slate-500"
                          }`}
                        >
                          <MoreVertical size={14} strokeWidth={2.5} />
                        </button>

                        {activeMenuId === uId && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                        
                            <div className={`absolute right-8 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30 text-left text-slate-600 font-bold text-[11px] animate-in fade-in duration-100 ${
                              isLastRows ? "bottom-full mb-1 origin-bottom" : "top-full mt-1 origin-top"
                            }`}>
                              {user.status === "active" ? (
                                <button onClick={() => openActionModal("block", user)} className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
                                  <Ban size={12} /> Block Member
                                </button>
                              ) : (
                                <button onClick={() => openActionModal("unblock", user)} className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors">
                                  <CheckCircle2 size={12} /> Unblock Member
                                </button>
                              )}
                              
                              {user.role === "donor" && (
                                <button onClick={() => openActionModal("volunteer", user)} className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100 transition-colors">
                                  <UserPlus size={12} className="text-blue-500" /> Make Volunteer
                                </button>
                              )}

                              {user.role !== "admin" && (
                                <button onClick={() => openActionModal("admin", user)} className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                  <Shield size={12} className="text-purple-500" /> Appoint Admin
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PREMIUM PAGINATION CONTROLS ================= */}
        {pagination.totalPages > 1 && (
          <div className="mx-4 p-4 bg-slate-50/90 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 rounded-2xl shadow-2xs">
            <span className="text-slate-400 font-medium">
              Showing Page <span className="text-slate-700 font-extrabold">{pagination.page}</span> of <span className="text-slate-700 font-extrabold">{pagination.totalPages}</span> total pages
            </span>
            
            <div className="flex items-center gap-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-2 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition disabled:opacity-40"
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>

              {getPageNumbers().map((pageNum, idx) => (
                <button
                  key={idx}
                  disabled={pageNum === "..."}
                  onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
                  className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-black transition-all duration-150 ${
                    pageNum === "..." ? "cursor-default text-slate-400" :
                    pagination.page === pageNum 
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-[1.05]" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-2 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition disabled:opacity-40"
              >
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= CONFIRMATION MODALS ================= */}
      {modalType && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              modalType === "block" ? "bg-rose-50 text-rose-600" :
              modalType === "unblock" ? "bg-emerald-50 text-emerald-600" :
              modalType === "volunteer" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
            }`}>
              {isPending ? (
                <Loader2 size={26} className="animate-spin text-slate-500" />
              ) : modalType === "block" ? (
                <ShieldAlert size={26} />
              ) : modalType === "unblock" ? (
                <CheckCircle2 size={26} />
              ) : modalType === "volunteer" ? (
                <UserPlus size={26} />
              ) : (
                <Shield size={26} />
              )}
            </div>

            <h3 className="text-base font-black text-slate-900 capitalize tracking-tight">
              {modalType === "block" ? "Restrict System Access?" :
               modalType === "unblock" ? "Restore System Access?" :
               modalType === "volunteer" ? "Promote to Volunteer?" : "Appoint Admin Rights?"}
            </h3>
            
            <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-relaxed px-2">
              Are you absolute sure you want to initialize this action sequence on <span className="font-bold text-slate-700">{targetUser.name}</span>?
            </p>

            <div className="flex gap-2.5 justify-center mt-6 text-xs font-bold">
              <button 
                disabled={isPending}
                onClick={() => { setModalType(null); setTargetUser(null); }} 
                className="px-4 py-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition disabled:opacity-50"
              >
                Cancel Process
              </button>
              <button 
                disabled={isPending}
                onClick={handleExecuteAction} 
                className={`px-5 py-2.5 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                  modalType === "block" ? "bg-rose-600 hover:bg-rose-700" :
                  modalType === "unblock" ? "bg-emerald-600 hover:bg-emerald-700" :
                  modalType === "volunteer" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"
                } disabled:opacity-60`}
              >
                {isPending && <Loader2 size={12} className="animate-spin" />}
                {isPending ? "Applying..." : "Confirm & Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersTableClient;