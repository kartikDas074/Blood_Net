import React from 'react';
import Link from 'next/link';
import { Share2, Globe, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#032336] text-white pt-16 pb-8 border-t border-[#04334e]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* মেইন গ্রিড লেআউট */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-12 mb-16">
          
          {/* ১. ব্র্যান্ড লোগো এবং পরিচিতি */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {/* ব্লাড ড্রপ লোগো আইকন */}
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1">
                <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                  +
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white">BloodNet</span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              A global network dedicated to making blood donation simple, fast, and accessible for everyone. Registered 501(c)(3) organization.
            </p>
            
            {/* সোশ্যাল আইকন গ্রুপ */}
            <div className="flex items-center gap-2.5 pt-2">
              <Link href="#" className="p-2.5 bg-[#04334e]/50 hover:bg-[#04334e] text-slate-300 hover:text-white rounded-xl border border-[#054366]/40 transition-all duration-200">
                <Share2 size={16} />
              </Link>
              <Link href="#" className="p-2.5 bg-[#04334e]/50 hover:bg-[#04334e] text-slate-300 hover:text-white rounded-xl border border-[#054366]/40 transition-all duration-200">
                <Globe size={16} />
              </Link>
              <Link href="#" className="p-2.5 bg-[#04334e]/50 hover:bg-[#04334e] text-slate-300 hover:text-white rounded-xl border border-[#054366]/40 transition-all duration-200">
                <Users size={16} />
              </Link>
            </div>
          </div>

          {/* ২. এক্সপ্লোর লিংক গ্রুপ */}
          <div className="space-y-5 lg:pl-4">
            <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Emergency Requests
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Mobile Clinics
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Donor Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* ৩. রিসোর্স লিংক গ্রুপ */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Medical Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  FAQ for Hospitals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Privacy Protocol
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200 block">
                  Impact Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* ৪. ট্রান্সপারেন্সি এবং সিস্টেম স্ট্যাটাস */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Transparency</h4>
            
            <div className="bg-[#021826]/60 border border-[#04334e]/50 rounded-2xl p-4 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Current System Status:</p>
              <div className="flex items-center gap-2">
                {/* ব্লিংকিং ডট ইফেক্ট */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-extrabold text-white">All Networks Operational</span>
              </div>
            </div>
          </div>

        </div>

        {/* বটম সেকশন (কপিরাইট এবং টার্মস) */}
        <div className="pt-8 border-t border-[#04334e]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>© 2026 BloodNet International. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Data Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;