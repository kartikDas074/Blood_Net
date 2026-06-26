"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-toastify";
import { 
  User, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Loader2, 
  Camera,
  Mail,
  Edit2,
  CheckCircle,
  XCircle,
  Activity,
  Calendar,
  Award
} from "lucide-react";

import districtData from "../../../Constants/District.json";
import upazilaData from "../../../Constants/Upazila.json";
import { profileUpdata } from '@/lib/action/profile';
import { useRouter } from 'next/navigation';

const Myprofile = ({ user }) => {
  const router = useRouter();
  const {
    _id,
    name,
    email,
    emailVerified,
    image,
    role,
    status,
    blood_group,
    district,
    upazila,
    createdAt
  } = user || {};

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // JSON ডাটা সোর্স
  const districtsList = districtData[0]?.data || [];
  const allUpazilasList = upazilaData[0]?.data || [];

  // 🛠️ নিখুঁত ডাটা ম্যাপিং: ডাটাবেজে নাম বা আইডি যাই থাকুক, ড্রপডাউন যেন ব্রেক না করে
  const findDistrictId = (nameOrId) => {
    const match = districtsList.find(d => d.id === nameOrId || d.name.toLowerCase() === nameOrId?.toLowerCase());
    return match ? match.id : "";
  };

  const findUpazilaId = (nameOrId) => {
    const match = allUpazilasList.find(u => u.id === nameOrId || u.name.toLowerCase() === nameOrId?.toLowerCase());
    return match ? match.id : "";
  };

  // ফর্ম স্টেট ইনিশিয়ালাইজেশন (phone বাদ দিয়ে status রাখা হয়েছে)
  const [formData, setFormData] = useState({
    name: name || '',
    blood_group: blood_group || '',
    district: findDistrictId(district),
    upazila: findUpazilaId(upazila),
  });

  const [avatarPreview, setAvatarPreview] = useState(image || "");
  const [avatarUrl, setAvatarUrl] = useState(image || "");

  // ডিস্ট্রিক্ট অনুযায়ী উপজেলা ফিল্টারিং
  const availableUpazilas = formData.district
    ? allUpazilasList.filter((u) => u.district_id === formData.district)
    : allUpazilasList;

  // ডিস্ট্রিক্ট চেঞ্জ হলে উপজেলা অটো রিসেট হবে
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));
  };

  // 📷 ক্লাউডিনারি ইমেজ আপলোড
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", `${process.env.NEXT_PUBLIC_UPLOAD_PRESET}`);
    data.append("cloud_name", `${process.env.NEXT_PUBLIC_CLOUD_NAME}`);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const resData = await res.json();

      if (resData.secure_url) {
        setAvatarUrl(resData.secure_url);
        toast.success("Profile picture updated!");
        
        // Better-Auth কোর ইমেজ সিঙ্ক
        await authClient.updateUser({ image: resData.secure_url });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
      setAvatarPreview(avatarUrl);
    } finally {
      setUploading(false);
    }
  };

  // 🛡️ ফুলপ্রুফ প্রোফাইল আপডেট (Better-Auth + ডিরেক্ট ডাটাবেজ ব্যাকআপ সেভ)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    loading(true);

    // সেভ করার আগে আইডি থেকে নাম কনভার্ট করে নিচ্ছি যেন ডাটাবেজে সুন্দর দেখায়
    const finalDistrictName = districtsList.find(d => d.id === formData.district)?.name || formData.district;
    const finalUpazilaName = allUpazilasList.find(u => u.id === formData.upazila)?.name || formData.upazila;

    try {
      // ১. Better-Auth সেশন আপডেট
      await authClient.updateUser({
        name: formData.name,
        image: avatarUrl,
      });

      // ২. 🚀 ডিরেক্ট ডাটাবেজ এপিআই কল
      const res = await profileUpdata({
        name: formData.name,
        image: avatarUrl,
        blood_group: formData.blood_group,
        district: finalDistrictName,
        upazila: finalUpazilaName,
      });

      if (!res.success) throw new Error("Database sync failed");

      toast.success("Profile permanently updated!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to sync profile changes.");
    } finally {
      setLoading(false);
    }
  };

  const getDistrictName = (id) => districtsList.find(d => d.id === id || d.name === id)?.name || id || "Not Set";
  const getUpazilaName = (id) => allUpazilasList.find(u => u.id === id || u.name === id)?.name || id || "Not Set";

  const memberSince = createdAt?.$date 
    ? new Date(createdAt.$date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'June 2026';

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-4 md:p-8 font-sans text-slate-800">
      
      {/* 🛑 ১. টপ প্রোফাইল ব্যানার */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
          
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-rose-50 shadow-md bg-slate-100 flex items-center justify-center relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14 text-slate-300" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl shadow-lg cursor-pointer transition-all duration-200 hover:scale-105">
              <Camera className="w-4 h-4" />
              <input type="file" id="avatar-upload" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{formData.name || "User Name"}</h2>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 font-extrabold text-xs rounded-full border border-rose-100 shadow-sm">
                {formData.blood_group || "B+"}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs uppercase rounded-full border border-blue-100">
                {role || "donor"}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-3">Lifestream Blood Network Platform</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-400">
              <span>📅 Joined {memberSince}</span>
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-slate-500 border border-slate-100">
                <MapPin className="w-3 h-3 text-rose-500" /> 
                {getUpazilaName(formData.upazila)}, {getDistrictName(formData.district)}
              </span>
            </div>
          </div>
        </div>

        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all normal-case text-sm"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      {/* 📋 ২. কালারাইজড প্রিমিয়াম ফর্ম গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ফর্ম কন্টেইনারカード */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-lg">
              <span className="p-2 bg-rose-50 rounded-xl text-rose-600"><User className="w-5 h-5" /></span>
              Personal Profile Information
            </h3>
            {!isEditing && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                🔒 Protected Mode
              </span>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* ফুল নেম */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-sm font-semibold rounded-xl h-12 px-4 border transition-all duration-200 focus:outline-none ${
                    !isEditing 
                      ? 'bg-slate-50/70 text-slate-600 border-slate-200/60 cursor-not-allowed shadow-inner' 
                      : 'bg-white text-slate-800 border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 shadow-sm'
                  }`}
                  required
                />
              </div>

              {/* ইমেইল */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <input 
                    type="email"
                    value={email}
                    disabled
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 bg-slate-50 text-slate-400 border border-slate-200/60 cursor-not-allowed shadow-inner pr-12"
                  />
                  {emailVerified && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                  )}
                </div>
              </div>

              {/* ব্লাড গ্রুপ */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Group</label>
                {isEditing ? (
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleInputChange}
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 border border-rose-200 bg-white text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                    <option value="O+">O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                  </select>
                ) : (
                  <input 
                    type="text"
                    value={formData.blood_group ? `${formData.blood_group} (Rh+ Dynamic)` : "Not Specified"}
                    disabled
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 bg-slate-50 text-slate-600 border-slate-200/60 cursor-not-allowed shadow-inner"
                  />
                )}
              </div>

              {/* 🔄 স্ট্যাটাস ফিল্ড (ফোন সরিয়ে এটি দেওয়া হয়েছে, এডিট করা যাবে না) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Status</label>
                <input 
                  type="text"
                  value={status ? status.toUpperCase() : "ACTIVE"}
                  disabled
                  className="w-full text-sm font-bold rounded-xl h-12 px-4 bg-slate-50 text-emerald-600 border border-slate-200/60 cursor-not-allowed shadow-inner uppercase tracking-wide"
                />
              </div>

              {/* জেলা ড্রপডাউন */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">District</label>
                {isEditing ? (
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 border border-rose-200 bg-white text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                    required
                  >
                    <option value="">Select District</option>
                    {districtsList.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text"
                    value={getDistrictName(formData.district)}
                    disabled
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 bg-slate-50 text-slate-600 border-slate-200/60 cursor-not-allowed shadow-inner"
                  />
                )}
              </div>

              {/* উপজেলা ড্রপডাউন */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upazila / Area</label>
                {isEditing ? (
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 border border-rose-200 bg-white text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select Upazila</option>
                    {availableUpazilas.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text"
                    value={getUpazilaName(formData.upazila)}
                    disabled
                    className="w-full text-sm font-semibold rounded-xl h-12 px-4 bg-slate-50 text-slate-600 border-slate-200/60 cursor-not-allowed shadow-inner"
                  />
                )}
              </div>

            </div>

            {/* অ্যাকশন কন্ট্রোল বাটন সমূহ */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name,
                      blood_group,
                      district: findDistrictId(district),
                      upazila: findUpazilaId(upazila),
                    });
                    setAvatarPreview(image || "");
                  }}
                  className="flex items-center gap-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 h-10 px-5 rounded-xl text-sm font-semibold transition-all"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white h-10 px-6 rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Save Configuration</>}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ডানের সাইড প্যানেল (এখানে ৩টি নতুন স্ট্যাটিক ফিল্ড কার্ড যোগ করা হয়েছে) */}
        <div className="space-y-6">
          
          {/* নতুন স্ট্যাটিক ইনফো কার্ড */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-rose-500 rounded-full"></span> Donation Summary
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><Award className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Donations</p>
                  <p className="text-sm font-extrabold text-slate-700">0 Blocks</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Calendar className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Last Donation Date</p>
                  <p className="text-sm font-extrabold text-slate-700">None Recorded</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500"><Activity className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Availability</p>
                  <p className="text-sm font-extrabold text-emerald-600">Available to Donate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-blue-500 rounded-full"></span> Account Meta Status
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400">System Role</span>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase">
                  {role || "Donor"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400">Verification</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border uppercase ${emailVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Myprofile;