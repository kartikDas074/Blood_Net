"use client";
import React, { useState } from "react";
import { Search, MapPin, Droplet, Mail, Calendar, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// 🌍 আসল JSON ফাইল ইম্পোর্ট
import DistrictData from "../../Constants/District.json";
import UpazilaData from "../../Constants/Upazila.json";

// 📞 তোমার ইম্পোর্ট করা আসল API ফাংশন
import { getDonar } from "@/lib/api/FindData";

export default function DonorSearchPage() {
  // ফর্ম স্টেটসমূহ
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  // ডাটা ও হ্যান্ডলিং স্টেট
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 এই যে এখানে পারফেক্টলি আছে

  // টপ-লেভেল অ্যারে থেকে সেফলি মূল ডাটা লিস্ট বের করে আনা [Index 0]
  const districtsList = DistrictData[0]?.data || [];
  const upazilasList = UpazilaData[0]?.data || [];

  // ✨ রেন্ডার টাইমে জাস্ট-ইন-টাইম উপজেলা ফিল্টারিং
  let filteredUpazilas = [];
  if (selectedDistrict) {
    const districtObj = districtsList.find(
      (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
    );
    
    if (districtObj) {
      filteredUpazilas = upazilasList.filter(
        (u) => u.district_id === districtObj.id
      );
    }
  }

  // ডিস্ট্রিক্ট চেঞ্জ হ্যান্ডলার
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedUpazila(""); // জেলা পাল্টালে উপজেলা রিসেট
  };

  // সার্চ সাবমিট হ্যান্ডলার
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!bloodGroup || !selectedDistrict || !selectedUpazila) {
      toast.error("Please select Blood Group, District, and Upazila!");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await getDonar(bloodGroup, selectedDistrict, selectedUpazila);
      if (res.success) {
        setDonors(res.data || []);
      } else {
        toast.error(res.message || "Failed to fetch donors.");
        setDonors([]);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("An error occurred while fetching donor data.");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 📋 হেডার সেকশন */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex p-2 bg-rose-50 rounded-xl text-[#991B1B]">
            <Droplet size={28} className="fill-current animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Find Life-Saving Donors
          </h1>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Search for active blood donors in your specific region instantly. Select your required group and location below.
          </p>
        </div>

        {/* 🔍 সার্চ ফর্ম কার্ড */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs font-bold text-slate-700">
            
            {/* ১. ব্লাড গ্রুপ সিলেক্টর */}
            <div className="space-y-1.5">
              <label className="text-slate-500 block">Blood Group <span className="text-rose-600">*</span></label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#991B1B] text-xs font-bold cursor-pointer"
              >
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((grp) => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>
            </div>

            {/* ২. ডিস্ট্রিক্ট সিলেক্টর */}
            <div className="space-y-1.5">
              <label className="text-slate-500 block">District <span className="text-rose-600">*</span></label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#991B1B] text-xs font-bold cursor-pointer"
              >
                <option value="">Select District</option>
                {districtsList.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* ৩. উপজেলা সিলেক্টর */}
            <div className="space-y-1.5">
              <label className="text-slate-500 block">Upazila <span className="text-rose-600">*</span></label>
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                disabled={!selectedDistrict}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#991B1B] text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* ৪. সার্চ বাটন */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 h-[38px] rounded-xl bg-[#991B1B] text-white text-xs font-bold hover:bg-red-900 shadow-xs transition-all disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Search size={14} strokeWidth={2.5} />
                )}
                Search Donors
              </button>
            </div>

          </form>
        </div>

        {/* 📊 ডোনর লিস্ট রেজাল্ট সেকশন */}
        <div className="space-y-4">
          {!hasSearched ? (
            <div className="p-16 text-center max-w-sm mx-auto border border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
              <p className="text-xs font-bold text-slate-400">
                Fill all the fields above and click search to view potential blood donors.
              </p>
            </div>
          ) : loading ? (
            <div className="p-16 flex flex-col justify-center items-center gap-2 text-slate-400 font-bold text-xs">
              <Loader2 className="animate-spin text-[#991B1B]" size={24} />
              Searching database...
            </div>
          ) : donors.length === 0 ? (
            <div className="p-16 text-center max-w-sm mx-auto border border-slate-200 rounded-2xl bg-white space-y-2">
              <p className="text-xs font-black text-slate-700">No Donors Found</p>
              <p className="text-[11px] font-medium text-slate-400">
                We couldn't find any donors matching your criteria. Try expanding your search area.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center max-w-4xl mx-auto px-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Search Results ({donors.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {donors.map((donor) => {
                  const donorId = donor._id?.$oid || donor._id;
                  return (
                    <div
                      key={donorId}
                      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-4 right-4 bg-rose-50 text-[#991B1B] font-black px-2.5 py-1 rounded-lg border border-rose-100 text-xs">
                        {donor.blood_group}
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {donor.image ? (
                            <img
                              src={donor.image}
                              alt={donor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-sm">
                              {donor.name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 pr-12">
                          <h3 className="text-sm font-black text-slate-800 leading-tight">
                            {donor.name}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                            <MapPin size={12} className="text-slate-400" />
                            <span>{donor.upazila}, {donor.district}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 gap-2 text-[11px] font-semibold text-slate-500">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate">{donor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-slate-400" />
                          <span>Joined: {new Date(donor.createdAt?.$date || donor.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-1">
                        <button className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-[#991B1B] hover:text-white transition-all cursor-pointer">
                          Contact Donor
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}