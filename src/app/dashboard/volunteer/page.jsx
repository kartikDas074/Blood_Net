import { allInfo, getTotalFunding, latestRequest } from "@/lib/api/FindData";
import { userInfo } from "@/lib/core/session";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  HeartHandshake,
  ShieldAlert,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Plus
} from "lucide-react";
import LatestRequest from "../Common/LatestReqest";

const VolunteerPage = async () => {

  const Info = await allInfo();
  const result = await latestRequest();
  const stat = Info?.statistics;
  const session = await userInfo();
  const user = session?.user;

  const userId = user?._id?.toString() || user?.id;

  
  const totalUsers = stat?.totalUsers || 0;
  const totalDonations = stat?.totalDonations || 0;
  const totalDonors = stat?.totalDonors || 0;
  const totalVolunteers = stat?.totalVolunteers || 0;
  const totalAdmins = stat?.totalAdmins || 0;
  const totalActive = stat?.totalActive || 0;
  const totalBlocked = stat?.totalBlocked || 0; 

 
  const weeklyRequests = [
    { day: "MON", value: 40 },
    { day: "TUE", value: 65 },
    { day: "WED", value: 85 },
    { day: "THU", value: 50 },
    { day: "FRI", value: 75 },
    { day: "SAT", value: 90 },
    { day: "SUN", value: 35 },
  ];
   
  const Founding=await getTotalFunding();
  const total=Founding.totalAmount;
  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans">
      
     
      <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -z-10"></div>
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <Image
              src={user?.image || "/avatar.png"}
              alt={user?.name || "Admin"}
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-indigo-500 border-4 border-white animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                Welcome back, {user?.name || "Administrator"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-red-500 text-white shadow-sm shadow-red-500/20">
                System Live
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              System Operations Hub. You have full oversight of members, emergency broadcasts, and network statistics.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <Link
            href="/dashboard/admin/campaigns"
            className="group flex-1 lg:flex-none justify-center inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> Launch Campaign
          </Link>
        </div>
      </div>

      {/* ================= 📈 ROW 1: CORE METRICS ================= */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-6">
        
        {/* Total Users */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex justify-between items-center shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500"></div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Total Network Members</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900 tracking-tight">
              {String(totalUsers).padStart(2, "0")}
            </h2>
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mt-2 inline-block">
              ⚡ Live Synchronized
            </span>
          </div>
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 transition-transform duration-300 group-hover:scale-110">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Donations */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex justify-between items-center shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-rose-500"></div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Successful Donations</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900 tracking-tight">
              {String(totalDonations).padStart(2, "0")}
            </h2>
            <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mt-2 inline-block">
              🩸 Bags Distributed
            </span>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4 text-rose-500 transition-transform duration-300 group-hover:scale-110">
            <HeartHandshake className="h-6 w-6" />
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex justify-between items-center shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Total Funding</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900 tracking-tight">
              {total}$
            </h2>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-block">
              🟢 Verified & Verified Active
            </span>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
            <Activity className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* ================= 🛡️ ROW 2: SUB-ROLES & MANAGEMENT STATS ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        
        {/* Donors Segment */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl"><UserCheck className="h-5 w-5" /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Donors</p>
            <h4 className="text-xl font-extrabold text-slate-800">{totalDonors} Members</h4>
          </div>
        </div>

        {/* Volunteers Segment */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><Activity className="h-5 w-5" /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Volunteers</p>
            <h4 className="text-xl font-extrabold text-slate-800">{totalVolunteers} Agents</h4>
          </div>
        </div>

        {/* Admins Segment */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><TrendingUp className="h-5 w-5" /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">System Admins</p>
            <h4 className="text-xl font-extrabold text-slate-800">{totalAdmins} Operators</h4>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl"><UserX className="h-5 w-5" /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Restricted Accounts</p>
            <h4 className="text-xl font-extrabold text-slate-600">{totalBlocked} Blocked</h4>
          </div>
        </div>

      </div>

      {/* ================= 📊 ROW 3: VISUALIZATION & DATA TABLES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* 🔴 বামে ২ কলাম জুড়ে মেইন রিকোয়েস্ট টেবিল */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-1">
            <LatestRequest data={result?.data} userId={userId} userRole={user?.role} />
          </div>
        </div>

        {/* 📊 ডানে কাস্টম উইকলি ট্র্যাকার বার চার্ট */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Request Volume</h3>
              <p className="text-xs text-slate-400">Total frequency over last 7 days</p>
            </div>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="h-5 w-5" />
            </span>
          </div>

          {/* কাস্টম পিউর সিএসএস বার চার্ট কন্টেইনার */}
          <div className="flex items-end justify-between h-48 pt-4 px-2 bg-slate-50/50 rounded-xl border border-slate-100">
            {weeklyRequests.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group cursor-pointer">
                
                {/* হোভার টুলটিপ */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 absolute transform -translate-y-12 shadow-sm">
                  {item.value} reqs
                </span>
                
                {/* ডাইনামিক বার */}
                <div 
                  style={{ height: `${item.value}%` }} 
                  className="w-3.5 bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-md group-hover:from-rose-600 group-hover:to-pink-600 transition-all duration-300 shadow-sm"
                ></div>
                
                {/* বারের নিচের বারের নাম */}
                <span className="text-[10px] font-bold text-slate-400 mt-2 tracking-tighter mb-1">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          {/* চার্ট ফুটার মেটা ডাটা */}
          <div className="mt-5 space-y-2 text-xs font-semibold text-slate-500">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span>Peak Demand Day</span>
              <span className="text-rose-600 font-extrabold">Saturday (90%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default VolunteerPage;