import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  UserCheck, 
  Activity, 
  DollarSign, 
  Search,
  UserPlus
} from 'lucide-react';
import { getTotalFunding } from '@/lib/api/FindData';

const HeroSection = async ({ stat = {} }) => {
  const {
    totalUsers = 0,
    totalDonations = 0,
    totalAdmins = 0,
    totalVolunteers = 0,
    totalDonors = 0,
    totalActive = 0,
    totalBlocked = 0,
  } = stat;

  const Funding = await getTotalFunding();
  const totalFunding=Funding.totalAmount;

  return (
    // aspect-[3/1] বা aspect-video স্ক্রিনের সাথে ইমেজ রেশিও ঠিক রাখবে, কোনো কিছু কাটবে না
    <div className="relative w-full aspect-[3/1] min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center justify-center bg-[#090d16]">
      
      {/* ================= BACKGROUND IMAGE & FILTERS ================= */}
      {/* object-contain দেওয়ায় ইমেজের ১ পিক্সেলও কাটবে না, পুরো ব্যানারটা শো করবে */}
      <img
        src="/Assets/banner.png"
        alt="Blood Donation Banner"
        className="absolute inset-0 w-full h-full object-contain object-center scale-110 brightness-[0.45] contrast-125 saturate-125"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Red Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/60 via-transparent to-slate-950/70" />

      {/* Top Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      {/* Radial Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_65%)]" />

      {/* Bottom Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#090d16] via-[#090d16]/60 to-transparent" />
      {/* ============================================================== */}
      
      {/* বাম কোণার টপ ব্যাজ */}
      <div className="absolute top-6 left-6 flex flex-col sm:flex-row gap-3 z-20">
        <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-md backdrop-blur-sm">
          <div className="p-1.5 bg-red-500/10 rounded-lg text-red-500">
            <Users size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <p className="text-sm font-black text-white font-mono">{totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-md backdrop-blur-sm">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
            <DollarSign size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Funding</p>
            <p className="text-sm font-black text-emerald-400 font-mono">${totalFunding.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ডান কোণার টপ ব্যাজ গ্রিড */}
      <div className="absolute top-6 right-6 hidden lg:grid grid-cols-2 gap-2.5 z-20 max-w-xs">
        <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md backdrop-blur-sm">
          <Activity size={14} className="text-rose-500" />
          <span className="text-[11px] font-bold text-slate-300">Active: <strong className="text-white font-mono">{totalActive}</strong></span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md backdrop-blur-sm">
          <HeartHandshake size={14} className="text-red-400" />
          <span className="text-[11px] font-bold text-slate-300">Donations: <strong className="text-white font-mono">{totalDonations}</strong></span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md backdrop-blur-sm">
          <UserCheck size={14} className="text-blue-400" />
          <span className="text-[11px] font-bold text-slate-300">Donors: <strong className="text-white font-mono">{totalDonors}</strong></span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md backdrop-blur-sm">
          <ShieldCheck size={14} className="text-purple-400" />
          <span className="text-[11px] font-bold text-slate-300">Volunteers: <strong className="text-white font-mono">{totalVolunteers}</strong></span>
        </div>
      </div>

      {/* মেইন কন্টেন্ট এরিয়া */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-20 sm:py-28 lg:py-36 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Every Blood Donor is a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              Life Saver Hero
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Your small contribution can breathe new life into someone's world. Join our automated platform to easily track, request, or volunteer for emergency cases.
          </p>
        </div>

        {/* অ্যাকশন বাটন গ্রুপ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-red-600/10 flex items-center justify-center gap-2 tracking-wide uppercase"
          >
            <UserPlus size={16} /> Join as a donor
          </Link>
          
          <Link 
            href="/search" 
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-extrabold text-sm rounded-xl transition-all duration-300 border border-slate-700/50 flex items-center justify-center gap-2 tracking-wide uppercase"
          >
            <Search size={16} /> Search Donors
          </Link>
        </div>

        {/* মোবাইল ভিউ ব্যাজ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/40 lg:hidden">
          <div className="text-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Donations</p>
            <p className="text-base font-black text-white mt-0.5 font-mono">{totalDonations}</p>
          </div>
          <div className="text-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Donors</p>
            <p className="text-base font-black text-white mt-0.5 font-mono">{totalDonors}</p>
          </div>
          <div className="text-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Active SOS</p>
            <p className="text-base font-black text-rose-500 mt-0.5 font-mono">{totalActive}</p>
          </div>
          <div className="text-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Blocked</p>
            <p className="text-base font-black text-amber-600 mt-0.5 font-mono">{totalBlocked}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;