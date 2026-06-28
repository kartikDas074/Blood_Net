"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; 

export default function SignInform() {
  const search = useSearchParams();
  const pathUrl = search.get("redirect") || "/";
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
       
      });

      if (error) {
        toast.error(error.message || "Invalid email or password!");
      } else {
        toast.success("Welcome back! Login successful.");
        router.push(pathUrl);
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFC] font-sans">
     
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/Assets/sign_in_bg.webp')" }}
      >
       
        <div className="absolute inset-0 bg-gradient-to-b from-[#E11D48]/80 to-[#0B1528]/90 z-0"></div>

     
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            BloodNet
          </h1>
          <p className="mt-4 text-sm text-slate-200 max-w-sm leading-relaxed font-medium">
            Saving lives through a digital network of trust and clinical
            excellence. Join Bangladesh's premier medical blood platform.
          </p>
        </div>

      
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-xl border border-white/10 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold">Secure Records</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                HIPAA compliant data storage
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-xl border border-white/10 mt-0.5">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold">Urgent Response</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Connecting donors in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 relative bg-white">
       
        <div className="absolute right-8 bottom-8 opacity-[0.03] text-[#E11D48] pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>

        <div className="w-full max-w-md space-y-8">
         
          <div>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[#64748B] font-medium">
              Please enter your medical credentials
            </p>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-6">
          
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94A3B8]">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@medical-net.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#E2E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] text-sm text-[#0F172A] font-semibold placeholder-[#94A3B8] transition-all"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94A3B8]">
                  <Lock size={18} />
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-[#E2E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] text-sm text-[#0F172A] font-semibold placeholder-[#94A3B8] transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B] hover:text-[#0F172A]"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

           
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#475569] font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
                />
                Remember Me
              </label>
              <Link
                href="/forgot-password"
                className="text-[#E11D48] hover:text-[#BE123C] font-bold transition"
              >
                Forgot password?
              </Link>
            </div>

            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E11D48]/10 active:scale-[0.99] text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Securing Session..." : "Secure Login"}
              </button>
            </div>
          </form>

          
          <p className="text-sm text-center text-[#475569] font-semibold pt-2">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#E11D48] hover:text-[#BE123C] font-extrabold underline pl-0.5 transition"
            >
              Register
            </Link>
          </p>

          
          <div className="flex items-center justify-center gap-6 pt-6 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">🔒 SSL Encrypted</span>
            <span className="flex items-center gap-1.5">🛡️ GDPR Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
