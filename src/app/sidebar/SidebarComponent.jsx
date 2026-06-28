"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  User,
  PlusCircle,
  History,
  DollarSign,
  LogOut,
  ShieldCheck,
  Users,
  Building2,
  X,
  Sidebar,
} from "lucide-react";

const SidebarComponent = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const currentRole = user?.role?.toLowerCase() || "donor";

  // ডোনরের বেস অপশনস
  const donorItems = [
    { name: "Dashboard", path: "/dashboard/donor", icon: LayoutDashboard },
    { name: "My Profile", path: "/dashboard/donor/profile", icon: User },
    {
      name: "Create Donation Request",
      path: "/dashboard/donor/create-donation-request",
      icon: PlusCircle,
    },
    {
      name: "My Donation Requests",
      path: "/dashboard/donor/my-donation-requests",
      icon: History,
    },
  ];

  // রোল অনুযায়ী অপশন কম্বাইন করার ম্যাপার
  const getMenuItems = () => {
    if (currentRole === "admin") {
      return [
        { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
        { name: "My Profile", path: "/dashboard/admin/profile", icon: User },
        {
          name: "Create Donation Request",
          path: "/dashboard/admin/create-donation-request",
          icon: PlusCircle,
        },
        {
          name: "My Donation Requests",
          path: "/dashboard/admin/my-donation-requests",
          icon: History,
        },
        {
          name: "Manage Requests",
          path: "/dashboard/admin/all-request",
          icon: ShieldCheck,
        },
        { name: "Manage Users", path: "/dashboard/admin/users", icon: Users },
       
      ];
    }

    if (currentRole === "volunteer") {
      return [
        {
          name: "Dashboard",
          path: "/dashboard/volunteer",
          icon: LayoutDashboard,
        },
        {
          name: "My Profile",
          path: "/dashboard/volunteer/profile",
          icon: User,
        },
        {
          name: "Create Donation Request",
          path: "/dashboard/volunteer/create-donation-request",
          icon: PlusCircle,
        },
        {
          name: "My Donation Requests",
          path: "/dashboard/volunteer/my-donation-requests",
          icon: History,
        },
        {
          name: "Manage Requests",
          path: "/dashboard/volunteer/all-request",
          icon: ShieldCheck,
        },
      ];
    }

    return donorItems;
  };

  const menuItems = getMenuItems();
  const isActive = (path) => pathname === path;

  // কোর সাইডবার লেআউট স্ট্রাকচার
  const sidebarContentLayout = (
    <div className="flex flex-col h-full bg-[#F0F7FF] text-slate-800 font-sans select-none">
      {/* স্ক্রলযোগ্য টপ পার্ট */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
        {/* Title */}
        <div>
          <h2 className="text-lg font-black text-[#E11D48] tracking-tight leading-none">
            LifeStream
          </h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Management Portal
          </p>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 border border-slate-100 flex-shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-slate-500 bg-slate-200">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-slate-800 truncate leading-tight uppercase tracking-wide">
              {currentRole} Portal
            </h4>
            <p className="text-xs text-slate-400 font-bold truncate mt-0.5">
              {user?.name || "LifeStream Member"}
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        {/* space-y-1 দিয়ে লিংকগুলোর মাঝের ডিসট্যান্স কমানো হয়েছে */}
        <nav className="space-y-1 pt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#D6E8FF] text-[#1E40AF] shadow-sm shadow-blue-100/50"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? "text-[#1E40AF]" : "text-slate-500"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ফিক্সড বটম পার্ট */}
      <div className="p-6 border-t border-slate-200/60 bg-[#F0F7FF]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
        >
          <LogOut size={16} strokeWidth={2.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 📱 Mobile Bottom Center Menu Button */}
      <div
        className={`md:hidden fixed rounded-[8px] bg-[#886565] bottom-6 z-50 transition-all duration-300 ${
          mobileSidebarOpen ? "left-1/2 -translate-x-1/2" : ""
        }`}
      >
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className={`px-5 py-3 text-white rounded-full shadow-2xl border border-red-500/20 active:scale-95 transition-all flex gap-2 font-bold text-sm backdrop-blur-xs bg-opacity-95 ${
            mobileSidebarOpen
              ? "items-center justify-center w-full"
              : "items-start justify-start"
          }`}
        >
          {mobileSidebarOpen ? (
            <>
              <X size={18} className="text-[red]" strokeWidth={2.5} />
            </>
          ) : (
            <>
              <Sidebar size={18} className="text-[blue]" strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

      {/* 💻 Desktop View (Static Left Sidebar) */}
      <div className="hidden md:block w-64 border-r border-slate-200/80 h-full flex-shrink-0">
        {sidebarContentLayout}
      </div>

      {/* 📱 Mobile Backdrop Screen Overlay & Drawer Panel */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* ব্লার ব্যাকড্রপ শেডিং */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* স্লাইডিং মেইন সাইডবার বডি */}
          <div className="relative w-64 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 z-50">
            {sidebarContentLayout}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarComponent;
