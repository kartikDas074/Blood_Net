"use client";
import React, { useState } from "react";
import {
  User,
  MapPin,
  Building2,
  Droplet,
  Calendar,
  Clock,
  MessageSquare,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-toastify";


import districtData from "../../../Constants/District.json";
import upazilaData from "../../../Constants/Upazila.json";
import { CreateDonationRequest } from "@/lib/action/DonationRequestCreate";


export default function CreateRequest({ user }) {
 
  const loggedInUser = user;
  console.log(loggedInUser);
  const [formData, setFormData] = useState({
    recipientName: "",
    districtId: "", 
    districtName: "",
    upazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  const districtsList = districtData[0]?.data || [];
  const allUpazilasList = upazilaData[0]?.data || [];

 
  const availableUpazilas = formData.districtId
    ? allUpazilasList.filter((u) => u.district_id === formData.districtId)
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedId = e.target.value;
    const selectedDistrictObj = districtsList.find((d) => d.id === selectedId);

    setFormData((prev) => ({
      ...prev,
      districtId: selectedId,
      districtName: selectedDistrictObj ? selectedDistrictObj.name : "",
      upazila: "", 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const finalSubmissionData = {
      requester_id:loggedInUser.id,
      requesterName: loggedInUser.name,
      requesterEmail: loggedInUser.email,
      recipient_name: formData.recipientName,
      district: formData.districtName, 
      upazila: formData.upazila,
      hospital_name: formData.hospitalName,
      full_address: formData.fullAddress,
      blood_group: formData.bloodGroup,
      donation_date: formData.donationDate,
      donation_time: formData.donationTime,
      request_message: formData.requestMessage,
      status: "pending", 
    };
    console.log(finalSubmissionData);

    const result=await CreateDonationRequest(finalSubmissionData);
    console.log(result);
    if(result.insertedId){
      toast.success('Your donation-request Creat successfully');
    }

    
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 font-sans select-none animate-in fade-in duration-300">
     
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <PlusCircle
              className="text-[#E11D48]"
              size={26}
              strokeWidth={2.5}
            />
            Create Donation Request
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Fill out the details below to request a life-saving blood donation.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
            Active Session
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-t-4 border-[#E11D48] rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-6"
      >
       
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#E11D48] font-black text-sm uppercase tracking-wider">
            <User size={18} strokeWidth={2.5} />
            <h2>Requester Info</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                readOnly
                value={loggedInUser.name}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Email
              </label>
              <input
                type="text"
                readOnly
                value={loggedInUser.email}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-[#E11D48] font-black text-sm uppercase tracking-wider">
            <MapPin size={18} strokeWidth={2.5} />
            <h2>Recipient Details & Location</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                name="recipientName"
                required
                placeholder="Enter full name"
                value={formData.recipientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition"
              />
            </div>

          
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                District
              </label>
              <select
                name="district"
                required
                value={formData.districtId}
                onChange={handleDistrictChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition"
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Upazila
              </label>
              <select
                name="upazila"
                required
                value={formData.upazila}
                disabled={!formData.districtId}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition"
              >
                <option value="">
                  {formData.districtId
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

        
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-[#E11D48] font-black text-sm uppercase tracking-wider">
            <Building2 size={18} strokeWidth={2.5} />
            <h2>Donation Location</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hospital Name
              </label>
              <input
                type="text"
                name="hospitalName"
                required
                placeholder="e.g. Dhaka Medical College Hospital"
                value={formData.hospitalName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Address Line
              </label>
              <input
                type="text"
                name="fullAddress"
                required
                placeholder="e.g. Zahir Raihan Rd, Dhaka"
                value={formData.fullAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition"
              />
            </div>
          </div>
        </div>

       
       
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-[#E11D48] font-black text-sm uppercase tracking-wider">
            <Droplet size={18} strokeWidth={2.5} />
            <h2>Blood & Schedule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Group Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Blood Group Required
              </label>
              <select
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition cursor-pointer"
              >
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ),
                )}
              </select>
            </div>

            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Donation Date
              </label>
              <div className="relative group">
                <input
                  type="date"
                  name="donationDate"
                  required
                 
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.donationDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition cursor-pointer custom-date-input"
                />
                <Calendar
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] pointer-events-none transition-colors"
                />
              </div>
            </div>

           
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Preferred Time
              </label>
              <div className="relative group">
                <input
                  type="time"
                  name="donationTime"
                  required
                  value={formData.donationTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition cursor-pointer custom-time-input"
                />
                <Clock
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] pointer-events-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
       
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-[#E11D48] font-black text-sm uppercase tracking-wider">
            <MessageSquare size={18} strokeWidth={2.5} />
            <h2>Request Message</h2>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Additional Instructions / Urgency Reason
            </label>
            <textarea
              name="requestMessage"
              required
              rows={4}
              maxLength={500}
              placeholder="Describe the urgency or specific instructions for the donor..."
              value={formData.requestMessage}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/10 transition resize-none"
            />
            <div className="text-right text-[10px] text-slate-400 font-bold mt-1">
              {formData.requestMessage.length}/500 characters
            </div>
          </div>
        </div>

       
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 bg-[#E11D48] text-white rounded-xl shadow-lg hover:bg-[#BE123C] active:scale-[0.99] font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            Request Blood Donation 🩸
          </button>
          <p className="text-center text-[11px] text-slate-400 font-bold mt-2.5">
            By submitting this request, your information will be shared with
            potential donors in your area.
          </p>
        </div>
      </form>
    </div>
  );
}
