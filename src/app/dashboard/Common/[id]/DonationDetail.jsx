"use client";

import { donateBlood } from "@/lib/action/Donate";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const DonationDetail = ({ request, user }) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ডাটা ডেস্ট্রাকচারিং এবং সেফটি চেক
  const {
    _id,
    requesterName,
    requesterEmail,
    recipient_name,
    district,
    upazila,
    hospital_name,
    full_address,
    blood_group,
    donation_date,
    donation_time,
    request_message,
    status,
  } = request || {};

  const requestId = _id?.$oid || _id;
  const router= useRouter();
  // 🤝 ডোনেশন কনফার্ম করার সাবমিট হ্যান্ডলার
  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await donateBlood(request._id.toString());

      if (result.success) {
        toast.success("Thank you for stepping forward to donate blood.");
        // Optional:
        router.refresh();
        // router.push("/dashboard");
      } else {
        toast.error(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
       setIsDonateModalOpen(false);
    }
  };
  return (
    <div className="w-full bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
      {/* 🧭 ব্রেডক্রাম্ব */}
      <div className="text-xs text-slate-400 mb-3">
        Dashboard &gt; Common &gt; Details
      </div>

      <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
        Donation Request Details
      </h1>

      {/* 🔴 প্রধান হেডার সেকশন */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md shadow-rose-100">
            {blood_group}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-warning badge-sm capitalize font-medium text-amber-800 px-2.5 py-1 bg-amber-100 border-none">
                {status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
              <span>📅 {donation_date}</span>
              <span>⏰ {donation_time}</span>
            </div>
          </div>
        </div>

        {/* 🔘 হেডার ডোনেট বাটন */}
        {status === "pending" ? (
          <button
            onClick={() => setIsDonateModalOpen(true)}
            className="btn bg-rose-600 hover:bg-rose-700 text-white border-none px-6 rounded-lg shadow-sm w-full sm:w-auto"
          >
            Donate Now
          </button>
        ) : (
          <button
            className="btn btn-disabled px-6 rounded-lg w-full sm:w-auto"
            disabled
          >
            Already {status}
          </button>
        )}
      </div>

      {/* 📋 ৪টি ইনফরমেশন কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1.5">
            👤 Requester Info
          </div>
          <div className="font-bold text-slate-800 text-sm">
            {requesterName}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            {requesterEmail}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1.5">
            🏥 Recipient Info
          </div>
          <div className="font-bold text-slate-800 text-sm">
            {recipient_name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Patient</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1.5">
            📍 Location
          </div>
          <div className="font-bold text-slate-800 text-sm truncate">
            {hospital_name}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            {full_address}, {upazila}, {district}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1.5">
            🩸 Donation Brief
          </div>
          <div className="font-bold text-slate-800 text-sm">
            {blood_group} Required
          </div>
          <div className="text-xs text-rose-600 font-medium mt-0.5">
            Priority: Emergency
          </div>
        </div>
      </div>

      {/* 💬 মেসেজ সেকশন */}
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 mb-5">
        <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1.5">
          Request Message
        </div>
        <p className="text-sm text-slate-700 italic font-medium">
          {request_message}
        </p>
      </div>

      {/* 🖼️ রিকোয়েস্ট ভেরিফাইড ব্যানার */}
      <div
        className="relative w-full h-32 md:h-36 rounded-xl overflow-hidden bg-cover bg-center mb-5 flex items-center justify-center shadow-inner"
        style={{ backgroundImage: `url('/Assets/animation_blood.webp')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        <div className="relative z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-md">
          <span className="text-emerald-600 text-base">🛡️</span>
          <span className="text-xs font-bold text-slate-800 tracking-wide">
            Verified Request by Medical Staff
          </span>
        </div>
      </div>

      {/* 🛒 বটম স্ট্যাটিক অ্যাকশন বার (কোনো fixed পজিশন নাই, সাইডবারের ওপর উঠবে না) */}
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
        <div className="text-xs md:text-sm">
          <span className="text-slate-400">Confirming donation for:</span>{" "}
          <span className="font-bold text-rose-600">
            {recipient_name} • {blood_group} Blood
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button className="btn btn-outline border-slate-200 text-slate-600 btn-sm rounded-lg normal-case font-medium">
            Save for Later
          </button>
          {status === "pending" && (
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="btn bg-rose-600 hover:bg-rose-700 text-white border-none btn-sm rounded-lg normal-case font-medium px-5 shadow-sm"
            >
              Donate Now
            </button>
          )}
        </div>
      </div>

      {/* 🧾 ----------------- DONATE MODAL ----------------- */}
      {isDonateModalOpen && (
        <div className="modal modal-open backdrop-blur-sm z-50">
          <div className="modal-box max-w-md bg-white rounded-xl p-6 border border-slate-100 shadow-xl relative">
            <button
              onClick={() => setIsDonateModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              Confirm Your Donation
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              You are volunteering to donate blood for{" "}
              <span className="font-semibold text-rose-600">
                {recipient_name}
              </span>
              . Please review your details.
            </p>

            <form onSubmit={handleConfirmDonation} className="space-y-4">
              {/* ডোনার নাম (Read Only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || user?.name || "Logged In User"}
                  readOnly
                  className="input input-bordered w-full bg-slate-50 text-slate-600 cursor-not-allowed font-medium focus:outline-none text-sm rounded-lg border-slate-200"
                />
              </div>

              {/* ডোনার ইমেইল (Read Only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={user?.email || "user@example.com"}
                  readOnly
                  className="input input-bordered w-full bg-slate-50 text-slate-600 cursor-not-allowed font-medium focus:outline-none text-sm rounded-lg border-slate-200"
                />
              </div>

              {/* অ্যাকশন বাটনস */}
              <div className="modal-action gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsDonateModalOpen(false)}
                  className="btn btn-outline border-slate-200 text-slate-500 hover:bg-slate-50 normal-case font-medium rounded-lg flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn bg-rose-600 hover:bg-rose-700 text-white border-none normal-case font-medium rounded-lg flex-1 shadow-sm"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Confirm Donation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetail;
