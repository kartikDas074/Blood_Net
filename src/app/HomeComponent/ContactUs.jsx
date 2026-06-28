'use client'
import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupportSection = () => {
  // ফর্ম স্টেট হ্যান্ডলিং
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Hospital Partnership Request',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ভ্যালিডেশন চেক (বেসিক)
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error('Please fill in all the required fields!', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    // সাকসেস টোস্ট মেসেজ শো করা
    toast.success('Message sent successfully! We will get back to you soon.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

    // ফর্ম ক্লিয়ার করা
    setFormData({
      fullName: '',
      email: '',
      subject: 'Hospital Partnership Request',
      message: ''
    });
  };

  return (
    <section className="w-full py-20 bg-[#F8FAFC] text-[#090d16] flex items-center justify-center">
      {/* react-toastify এর কন্টেইনার (টপ প্যারেন্টে একবার রাখলেই হয়) */}
      <ToastContainer />

      <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* বাম পাশের কন্টেন্ট এরিয়া */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-[#090d16]">
              Need Immediate Support?
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-md font-medium">
              Our medical coordination team is available 24/7 for emergency blood logistics and hospital partnerships.
            </p>
          </div>

          {/* কন্ট্যাক্ট ইনফো গ্রুপ */}
          <div className="space-y-4">
            {/* হেল্পলাইন */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100/50 shadow-sm">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Emergency Hotline</p>
                <p className="text-lg font-extrabold text-[#090d16]">+1 (800) BLOOD-NET</p>
              </div>
            </div>

            {/* ইমেইল */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100/50 shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Partnerships & Support</p>
                <p className="text-lg font-extrabold text-[#090d16]">support@bloodnet.org</p>
              </div>
            </div>
          </div>
        </div>

        {/* ডান পাশের ফর্ম এরিয়া */}
        <div className="bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* নাম ও ইমেইল (গ্রিড লেআউট) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-[#090d16]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-[#090d16]"
                />
              </div>
            </div>

            {/* সাবজেক্ট সিলেক্ট ড্রপডাউন */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
              <div className="relative">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200/60 rounded-xl text-sm font-bold text-[#090d16] focus:outline-none focus:border-slate-300 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Hospital Partnership Request">Hospital Partnership Request</option>
                  <option value="General Support">General Support</option>
                  <option value="Donor Discrepancy">Donor Discrepancy</option>
                  <option value="Urgent Blood Logistics">Urgent Blood Logistics</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* মেসেজ টেক্সট এরিয়া */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="How can we help you?"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-[#090d16] resize-none"
              />
            </div>

            {/* সাবমিট বাটন */}
            <button
              type="submit"
              className="w-full py-4 bg-[#475E80] hover:bg-[#384B66] text-white font-extrabold text-sm rounded-xl transition-all duration-300 shadow-md tracking-wider uppercase"
            >
              Send Message
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default SupportSection;