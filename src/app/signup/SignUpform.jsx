"use client";
import { authClient } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  Heart,
  ImageIcon,
  Loader2,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";


import districtData from "../../Constants/District.json";
import upazilaData from "../../Constants/Upazila.json"; 
export default function SignUpform() {
  const search = useSearchParams();
  const pathUrl = search.get("redirect") || "/";
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "", 
    upazila: "", 
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const districtsList = districtData[0]?.data || [];
  const allUpazilasList = upazilaData[0]?.data || [];

  
  const availableUpazilas = formData.district
    ? allUpazilasList.filter((u) => u.district_id === formData.district)
    : allUpazilasList;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        { method: "POST", body: data },
      );
      const resData = await res.json();

      if (resData.secure_url) {
        setAvatar(resData.secure_url);
        toast.success("Avatar uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("There is a problem in uploading the image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("The password and confirm password do not match");
      return;
    }
    if (!avatar) {
      toast.error("Please upload a profile picture");
      return;
    }

    const finalUserData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: avatar,
      blood_group: formData.bloodGroup,
      district: formData.district,
      upazila: formData.upazila,
      role: "donor",
      status: "active",
    };

    const { data, error } = await authClient.signUp.email({
      ...finalUserData,
    });
    if (error) {
      toast.error(error.message || "Sign up failed!");
    } else {
      toast.success("Account created successfully!");
      router.refresh();
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-4 right-10 opacity-10 text-[#E11D48] hidden lg:block">
        <Heart size={300} strokeWidth={1} />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Join the Lifesaver Community
            </h1>
            <p className="mt-2 text-sm text-[#475569] font-medium">
              Complete your profile to start donating or requesting blood. Your
              small contribution can save a life today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-sm">
              <div className="flex items-center gap-2 text-[#E11D48] font-bold mb-6 text-base">
                <User size={18} strokeWidth={2.5} />
                <h2>Account & Profile</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Arif Ahmed"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] text-sm text-[#0F172A] font-semibold placeholder-[#64748B]"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="arif.ahmed@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] text-sm text-[#0F172A] font-semibold placeholder-[#64748B]"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <label className="w-full h-full min-h-[160px] border-2 border-dashed border-[#64748B] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F1F5F9] transition p-4 relative overflow-hidden bg-[#F8FAFC]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="p-3 bg-[#EFF6FF] text-[#3B82F6] rounded-full inline-block">
                          <ImageIcon size={24} />
                        </div>
                        <p className="text-sm font-bold text-[#0F172A]">
                          Upload Avatar
                        </p>
                        <p className="text-xs text-[#475569] font-medium">
                          PNG, JPG up to 3MB
                        </p>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                        <Loader2
                          className="animate-spin text-[#E11D48]"
                          size={28}
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#E11D48] font-bold mb-6 text-base">
                    <Heart size={18} strokeWidth={2.5} />
                    <h2>Medical Info</h2>
                  </div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white text-sm text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]"
                    onChange={handleInputChange}
                  >
                    <option value="" className="text-[#64748B]">
                      Select your group
                    </option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <p className="text-xs text-[#0F172A] font-bold italic mt-4 bg-rose-50 p-2 rounded-lg border border-rose-100">
                  * Ensure this is accurate from a recent clinical test.
                </p>
              </div>

              {/* Location Info */}
              {/* Location Info */}
              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#E11D48] font-bold mb-2 text-base">
                  <MapPin size={18} strokeWidth={2.5} />
                  <h2>Location Info</h2>
                </div>

                {/* District Select */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    District
                  </label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white text-sm text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        district: e.target.value,
                        upazila: "", 
                      });
                    }}
                  >
                    <option value="">Select District</option>
                    {districtsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

              
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Upazila
                  </label>
                  <select
                    name="upazila"
                    required
                    value={formData.upazila}
                    
                    disabled={!formData.district}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white text-sm text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] disabled:bg-slate-100 disabled:cursor-not-allowed"
                    onChange={handleInputChange}
                  >
                    <option value="">
                      {formData.district
                        ? "Select Upazila"
                        : "First select a district"}
                    </option>
                   
                    {availableUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-sm">
              <div className="flex items-center gap-2 text-[#E11D48] font-bold mb-6 text-base">
                <ShieldCheck size={18} strokeWidth={2.5} />
                <h2>Security</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white text-sm text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]"
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-[#475569] hover:text-[#0F172A]"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#94A3B8] bg-white text-sm text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]"
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-[#475569] hover:text-[#0F172A]"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E11D48]/20 active:scale-[0.99] text-base disabled:opacity-50"
              >
                {uploading ? "Uploading Avatar..." : "Register Now"}
              </button>

              <p className="text-sm text-center text-[#0F172A] font-bold">
                Don't have an account?{" "}
                <Link
                  href="/signin"
                  className="text-[#E11D48] hover:text-[#BE123C] font-extrabold underline transition pl-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="space-y-6 lg:mt-[76px]">
          <div className="bg-[#0B1528] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>⚡</span> Emergency Network
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-medium">
                By completing this registration, your secure profile will match
                with real-time blood seekers in your area. Keep your location
                details updated to ensure local tracking works correctly.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-[#E11D48] font-bold">✓</span>
                  <span>Verified Medical Records Privacy</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-[#E11D48] font-bold">✓</span>
                  <span>Instant SMS/Email alerts on local requests</span>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#E11D48]/10 rounded-full blur-xl"></div>
          </div>

          <div className="bg-white border border-[#CBD5E1] p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <span>👥</span>
              <h3>Community Reach</h3>
            </div>
            <p className="text-xs text-[#475569] text-left font-semibold">
              Join 50,000+ registered donors across Bangladesh.
            </p>

            <div className="bg-gradient-to-br from-rose-50 to-orange-50 h-32 rounded-xl flex items-center justify-center border border-[#E2E8F0]">
              <span className="text-4xl animate-pulse">🩸🤝❤️</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-center">
              <div>
                <p className="text-sm font-extrabold text-[#0F172A]">12k+</p>
                <p className="text-[10px] text-[#475569] font-bold uppercase">
                  Lives Saved
                </p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#0F172A]">64</p>
                <p className="text-[10px] text-[#475569] font-bold uppercase">
                  Districts
                </p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#0F172A]">24/7</p>
                <p className="text-[10px] text-[#475569] font-bold uppercase">
                  Support
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#475569] font-bold">
            <span className="flex items-center gap-1">🛡️ Data Privacy</span>
            <span className="flex items-center gap-1">🔒 Secure SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
