"use client";
import React, { useState } from "react";
import Mytransaction from "./Mytransaction";
import {
  HeartHandshake,
  Target,
  Sparkles,
  X,
  Heart,
  TrendingUp,
  BadgeAlert,
  Info,
} from "lucide-react";

export default function FundingPage({ data, total = 0 }) {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const finalAmount = customAmount ? customAmount : selectedAmount;
  const [isOpen, setIsOpen] = useState(false);
  const monthlyGoal = 15000;
  // Dynamic percentage calculation
  const progressPercentage = Math.min(
    Math.round((total / monthlyGoal) * 100),
    100,
  );
  // Calculating remaining amount left to reach goal
  const remainingAmount = Math.max(monthlyGoal - total, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("donation", finalAmount);

      // Endpoint pointing to Stripe sessions
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (resData.url) {
        // Redirection to stripe checkout
        window.location.href = resData.url;
      } else if (resData.error) {
        alert(`Stripe Error: ${resData.error}`);
      } else {
        alert("Failed to initiate checkout.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- Hero Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-rose-100">
                <Sparkles size={12} className="animate-pulse" /> Save Lives
              </span>
              <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-sky-100">
                ⚡ Emergency Support
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Support Our Blood <br className="hidden md:inline" />
              Donation Mission <span className="text-rose-500">❤️</span>
            </h1>
            <p className="text-slate-500 leading-relaxed max-w-xl text-sm md:text-base font-medium">
              Your financial contributions fuel our mission to bridge the gap
              between donors and patients.
            </p>

            <div>
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
                className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 
               bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white 
               text-sm font-black uppercase tracking-wider rounded-xl 
               shadow-[0_4px_14px_0_rgba(225,29,72,0.4)] 
               hover:shadow-[0_6px_20px_rgba(225,29,72,0.6)] 
               hover:scale-[1.02] active:scale-[0.98] 
               transition-all duration-300 ease-out select-none cursor-pointer group"
              >
                {/* হোভার করলে আইকনটা হালকা পালস করবে */}
                <HeartHandshake
                  size={16}
                  strokeWidth={2.5}
                  className="group-hover:animate-pulse transition-transform"
                />
                <span>Give Fund</span>

                {/* হালকা একটা শাইন ইফেক্ট */}
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-slate-200">
              <img
                src="/Assets/funding.jpg"
                alt="Blood Donation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- Lower Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ================= ⚡ PREMIUM GOAL PROGRESS CARD ================= */}
          {}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between space-y-6">
            <div className="space-y-1">
              <div className="text-rose-600 font-extrabold tracking-widest text-xs uppercase flex items-center gap-1.5">
                <Target size={14} /> Monthly Goal Progress
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Fundraising Milestone
              </h3>
            </div>

            {/* Stats Breakdown Widgets */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Raised
                </p>
                <p className="text-lg font-black text-emerald-600 font-mono">
                  {total.toLocaleString()}$
                </p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target
                </p>
                <p className="text-lg font-black text-slate-800 font-mono">
                  {monthlyGoal.toLocaleString()}$
                </p>
              </div>
              <div className="space-y-1 border-l border-slate-100 pl-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Remaining
                </p>
                <p className="text-lg font-black text-rose-500 font-mono">
                  {remainingAmount.toLocaleString()}$
                </p>
              </div>
            </div>

            {/* Visual Custom Progress Bar with Glassy Shine overlay */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Current Progress</span>
                <span className="text-rose-600 font-mono">
                  {progressPercentage}% reached
                </span>
              </div>

              <div className="w-full bg-slate-100 h-4 rounded-full p-0.5 overflow-hidden border border-slate-200/50 relative shadow-inner">
                <div
                  className="bg-gradient-to-r from-red-500 via-rose-600 to-red-700 h-full rounded-full transition-all duration-1000 ease-out shadow-md relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {/* Glowing overlay strip inside progress bar */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
                </div>
              </div>
            </div>

            {/* Subtitle Motivator Info Box */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600 mt-0.5 shrink-0">
                <HeartHandshake size={16} />
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {progressPercentage >= 100
                  ? "Incredible! We have successfully completed our target milestone for this month. Thank you for making a difference!"
                  : `We are just  ${remainingAmount.toLocaleString()}$ away from our monthly target. Your small help will ensure emergency logistics continuity.`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-rose-100/70 flex flex-col justify-between space-y-6">
            <h3 className="text-lg font-black text-slate-900">
              Choose Your Contribution
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[100, 200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`py-3 px-4 rounded-xl font-bold border text-sm transition-all duration-200 ${
                    selectedAmount === amount && !customAmount
                      ? "border-rose-200 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {amount}$
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
              />
            </div>

            {/* Form Submit wrapper */}
            <form onSubmit={handleCheckout}>
              <button
                type="submit"
                disabled={!finalAmount || finalAmount <= 0 || isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white font-black py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md shadow-red-600/10 cursor-pointer disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>Continue with Stripe ({finalAmount || 0}$)</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* --- Transactions History List --- */}
        <Mytransaction data={data} />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* ১. ব্যাকড্রপ ওভারলে (বাইরে ক্লিক করলে মডাল বন্ধ হবে) */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* ২. মডাল কন্টেন্ট বক্স (তোর দেওয়া ফর্ম ডিজাইন) */}
          <div className="relative w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-rose-100/70 flex flex-col justify-between space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* ❌ মডাল বন্ধ করার জন্য টপ-রাইট ক্লোজ বাটন */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <h3 className="text-lg font-black text-slate-900">
              Choose Your Contribution
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[100, 200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`py-3 px-4 rounded-xl font-bold border text-sm transition-all duration-200 ${
                    selectedAmount === amount && !customAmount
                      ? "border-rose-200 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {amount}$
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
              />
            </div>

            {/* Form Submit wrapper */}
            <form
              onSubmit={(e) => {
                handleCheckout(e);
                // যদি সাকসেসফুলি সাবমিট হওয়ার পর মডাল আটোমেটিক বন্ধ করতে চাস, তাহলে এখানে setIsOpen(false) দিতে পারিস
              }}
            >
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!finalAmount || finalAmount <= 0 || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white font-black py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md shadow-red-600/10 cursor-pointer disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  ) : (
                    <>Continue with Stripe ({finalAmount || 0}$)</>
                  )}
                </button>

                {/* ↩️ নিচের ক্যান্সেল বাটন */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
