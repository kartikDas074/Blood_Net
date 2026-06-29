"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoveLeft, Home, HeartPulse } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-6">
        
     
        <div className="relative w-full h-64 md:h-72 mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white p-2">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/Assets/urgent_need.jpg"
              alt="Urgent Blood Need / Page Not Found"
              fill
              priority
              className="object-cover opacity-85 filter grayscale-[20%] contrast-115"
            />
           
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6">
              <h1 className="text-7xl font-black text-white/90 tracking-widest font-mono drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] select-none">
                404
              </h1>
            </div>
          </div>
        </div>

       
        <div className="space-y-2 px-2">
          <div className="flex items-center justify-center gap-1.5 text-[#991B1B]">
            <HeartPulse size={18} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">
              Connection Interrupted
            </span>
          </div>
          
          <h2 className="text-xl font-black text-slate-800">
            Blood Request or Page Not Found!
          </h2>
          
          <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
            The link might be broken, or the patient has already found a donor and the urgent blood request has been removed.
          </p>
        </div>

      
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
         
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-xs transition-all group cursor-pointer"
          >
            <MoveLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Go Back
          </button>

        
          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs font-bold hover:bg-red-900 shadow-xs hover:shadow-md transition-all group cursor-pointer">
              <Home size={14} />
              Back to Home
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}