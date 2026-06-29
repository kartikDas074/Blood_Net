"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import { authClient } from "@/lib/auth-client"; 
import { LayoutDashboard, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = session?.user;

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  
  const isActive = (path) => pathname === path;

  return (
    <nav className="w-full bg-[#F4F9FF] border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
       
        <Link href="/" className="flex items-center gap-2 select-none">
          <img 
            src="/Assets/logo.png" 
            alt="BloodNet Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-black text-[#E11D48] tracking-tight">
            BloodNet
          </span>
        </Link>

        {/* 🔗 Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          <Link 
            href="/" 
            className={`transition ${isActive("/") ? "text-[#E11D48]" : "text-slate-700 hover:text-[#E11D48]"}`}
          >
            Home
          </Link>
          <Link 
            href="/donation" 
            className={`transition ${isActive("/donation-request") ? "text-[#E11D48]" : "text-slate-700 hover:text-[#E11D48]"}`}
          >
            Donation Request
          </Link>
          
          
          {user && (
            <Link 
              href="/funding" 
              className={`transition ${isActive("/funding") ? "text-[#E11D48]" : "text-slate-700 hover:text-[#E11D48]"}`}
            >
              Funding
            </Link>
          )}
        </div>

       
        <div className="hidden md:flex items-center gap-4">
          {!isPending && (
            <>
              {!user ? (
                <>
                  <Link 
                    href="/signin" 
                    className="text-sm font-bold text-slate-700 hover:text-[#E11D48] transition px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                 
                  <Link 
                    href="/funding" 
                    className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-black px-5 py-2.5 rounded-full tracking-wide transition shadow-md shadow-red-100 uppercase"
                  >
                    Donate Now
                  </Link>

                 
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#E11D48]/30 hover:border-[#E11D48] focus:outline-none transition-all flex items-center justify-center bg-slate-200 shadow-sm"
                    >
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || "User"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-black text-slate-600">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </button>

                   
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                       
                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                          <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                          
                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#E11D48]/10 text-[#E11D48] text-[10px] font-black uppercase tracking-wider rounded-md">
                            <ShieldAlert size={10} />
                            {user.role || "Donor"} 
                          </div>
                        </div>
                        
                        <Link
                          href={`/dashboard/${user.role}`}
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#E11D48] transition"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition border-t border-slate-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

     
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-700 focus:outline-none p-1 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 flex flex-col pb-2 animate-in fade-in duration-200">
          <Link 
            href="/" 
            className={`text-sm font-bold px-2 py-1 rounded-lg ${isActive("/") ? "text-[#E11D48] bg-red-50/50" : "text-slate-700"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/donation" 
            className={`text-sm font-bold px-2 py-1 rounded-lg ${isActive("/donation-request") ? "text-[#E11D48] bg-red-50/50" : "text-slate-700"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Donation Request
          </Link>
          {user && (
            <Link 
              href="/funding" 
              className={`text-sm font-bold px-2 py-1 rounded-lg ${isActive("/funding") ? "text-[#E11D48] bg-red-50/50" : "text-slate-700"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Funding
            </Link>
          )}
          
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {!user ? (
              <>
                <Link href="/signin" className="text-center text-sm font-bold text-slate-700 py-2 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/signup" className="text-center bg-[#E11D48] text-white text-sm font-bold py-2.5 rounded-xl shadow-sm" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
               
                <div className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-xl mb-1 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700">{user.name}</span>
                  <span className="text-[9px] font-extrabold bg-[#E11D48]/10 text-[#E11D48] px-2 py-0.5 rounded uppercase tracking-wider">
                    {user.role || "Donor"}
                  </span>
                </div>
                <Link href="/funding" className="text-center bg-[#E11D48] text-white text-sm font-bold py-2.5 rounded-xl uppercase tracking-wide" onClick={() => setMobileMenuOpen(false)}>Donate Now</Link>
                <Link href={`/dashboard/${user.role}`} className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700 py-2 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 text-sm font-bold text-rose-600 py-2 hover:bg-rose-50 rounded-xl w-full">
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}