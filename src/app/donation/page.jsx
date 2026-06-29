"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
  HeartHandshake,
  MessageSquare,
} from "lucide-react";
import { getAllPending } from "@/lib/api/FindData";
import DistrictList from '../../Constants/District.json'
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS =DistrictList[0].data;

export default function ActiveDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ফিল্টার স্টেট
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllPending(
          currentPage,
          6,
          search,
          bloodGroup,
          district,
        );

        if (isMounted) {
          if (response?.success) {
            setRequests(response.data || []);
            setPagination(
              response.pagination || { page: 1, totalPages: 1, total: 0 },
            );
          } else {
            setError(response?.message || "Failed to fetch requests.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Something went wrong. Please try again later.");
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [currentPage, search, bloodGroup, district]);

  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === "search") setSearch(value);
    if (type === "blood") setBloodGroup(value === bloodGroup ? "" : value);
    if (type === "district") setDistrict(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* ব্যাকগ্রাউন্ড সাবটল গ্লো */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-rose-50/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-10">
        {/* মডার্ন হেডার */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
              <Sparkles size={12} /> Live SOS Emergency
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Active Donation Requests 🩸
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed">
              Browse through real-time pending blood requests. Filter by your
              targeted blood group or current district to quickly extend a
              life-saving hand.
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 self-start md:self-auto">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <div className="text-sm">
              <span className="font-black text-slate-900 text-base">
                {pagination.total}
              </span>
              <span className="text-slate-500 font-semibold ml-1">
                Requests Pending
              </span>
            </div>
          </div>
        </div>

        {/* ফিল্টার কন্ট্রোল */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by recipient name, hospital, or specific conditions..."
                value={search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-sm shadow-sm font-medium placeholder-slate-400"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <select
                value={district}
                onChange={(e) => handleFilterChange("district", e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-sm shadow-sm appearance-none font-semibold cursor-pointer text-slate-700"
              >
                <option value="">All Over Bangladesh</option>
                {DISTRICTS.map((dist) => (
                  <option key={dist.id} value={dist.name}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ব্লাড চিপস */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center gap-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              Select Blood Group:
            </span>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = bloodGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => handleFilterChange("blood", bg)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 ${
                      isSelected
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30 scale-105"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* কন্টেন্ট এরিয়া */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
            <p className="text-slate-400 font-semibold text-sm tracking-wide">
              Fetching direct hospital requests...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-red-100 max-w-md mx-auto p-8 text-center shadow-sm">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-base font-bold text-slate-800">Sync Error</h3>
            <p className="text-slate-400 text-xs mt-1">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 text-center p-8 shadow-sm max-w-lg mx-auto">
            <span className="text-4xl mb-3">🩸</span>
            <h3 className="text-lg font-bold text-slate-800">
              No Matching Emergency Requests
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs leading-relaxed">
              We could not find any critical requests matching your filters right
              now.
            </p>
          </div>
        ) : (
          /* রেসপন্সিভ রিফাইন্ড কার্ড গ্রিড */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((item) => {
              // মঙ্গোডিবি অবজেক্ট আইডি সেফ এক্সট্রাকশন
              const requestId = item._id?.$oid || item._id;

              return (
                <div
                  key={requestId}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-red-500/40 shadow-sm hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
                >
                  {/* থিন সোবার টপ ইমার্জেন্সি বার */}
                  <div className="h-1 w-full bg-red-500" />

                  <div className="p-6 space-y-5">
                    {/* কার্ড টপ সেকশন */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        {/* ব্লাড গ্রুপ ড্রপলেট থিম */}
                        <div className="h-12 w-12 rounded-xl bg-red-50 group-hover:bg-red-600 text-red-600 group-hover:text-white flex flex-col items-center justify-center font-black text-sm border border-red-100 group-hover:border-red-600 transition-all duration-300 shadow-sm shrink-0">
                          {item.blood_group}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-red-600 transition-colors line-clamp-1">
                            {item.recipient_name}
                          </h3>
                          <div className="text-slate-400 text-xs font-semibold mt-0.5">
                            By: {item.requesterName || "Volunteer"}
                          </div>
                        </div>
                      </div>

                      {/* টাইম ব্যাজ */}
                      <div className="flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-lg shrink-0">
                        <Clock size={12} className="text-slate-400" />
                        <span>{item.donation_time}</span>
                      </div>
                    </div>

                    {/* মিডেল ইনফরমেশন বডি */}
                    <div className="space-y-3.5 border-t border-slate-100 pt-4">
                      {/* লোকেশন ও হসপিটাল */}
                      <div className="flex items-start gap-3">
                        <MapPin className="text-red-500 h-4 w-4 mt-0.5 shrink-0" />
                        <div className="text-xs">
                          <p className="font-extrabold text-slate-800 line-clamp-1">
                            {item.hospital_name}
                          </p>
                          <p className="text-slate-400 mt-0.5 font-semibold line-clamp-1">
                            {item.full_address ||
                              `${item.upazila}, ${item.district}`}
                          </p>
                        </div>
                      </div>

                      {/* ডেট ট্যাগ */}
                      <div className="flex items-center gap-3">
                        <Calendar className="text-slate-400 h-4 w-4 shrink-0" />
                        <p className="text-xs font-bold text-slate-600">
                          Required Date:{" "}
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-mono text-[11px] ml-1">
                            {item.donation_date}
                          </span>
                        </p>
                      </div>

                      {/* কাস্টম রিকোয়েস্ট মেসেজ বক্স */}
                      {item.request_message && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2.5 items-start">
                          <MessageSquare
                            size={14}
                            className="text-slate-400 shrink-0 mt-0.5"
                          />
                          <p className="text-xs font-medium text-slate-600 italic line-clamp-2 leading-relaxed">
                            {item.request_message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ফুটার অ্যাকশন জোন (Donate Now বাটন লিঙ্কসহ) */}
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 flex items-center gap-2">
                    <Link
                      href={`/dashboard/Common/${requestId}`}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-sm shadow-red-600/10 flex items-center justify-center gap-1.5"
                    >
                      <HeartHandshake size={14} /> Donate Now
                    </Link>
                    <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* পেজিনেশন প্যানেল */}
        {!loading && requests.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold tracking-wide">
              PAGE{" "}
              <span className="text-slate-800 font-extrabold">
                {pagination.page}
              </span>{" "}
              OF{" "}
              <span className="text-slate-800 font-extrabold">
                {pagination.totalPages}
              </span>{" "}
              — TOTAL {pagination.total} CASES
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center gap-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                <ChevronLeft size={14} /> Prev
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-bold">Go:</span>
                <input
                  type="number"
                  min="1"
                  max={pagination.totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= pagination.totalPages) {
                      setCurrentPage(val);
                    }
                  }}
                  className="w-12 text-center py-1.5 border border-slate-200 rounded-lg text-xs font-extrabold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <button
                disabled={!pagination.hasNext}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages),
                  )
                }
                className="flex items-center gap-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
