import { getAllRequest } from '@/lib/api/FindData';
import React from 'react';
import GetAllRequest from '../../Common/GetAllRequest';
import { userInfo } from '@/lib/core/session';
// তোর getAllRequest ফাংশনটার সঠিক পাথ দিবি এখানে


const AllBloodRequestManage = async ({ searchParams }) => {
  // ১. URL এর searchParams থেকে কারেন্ট কুয়েরিগুলো রিসিভ করা হচ্ছে (ভ্যালু না থাকলে ডিফল্ট সেট হবে)
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const status = resolvedSearchParams?.status || "";
  const search = resolvedSearchParams?.search || "";
  const limit = 10; // তুই তোর সুবিধা মতো লিমিট সেট করতে পারিস

  // ২. তোর দেওয়া এপিআই বা অ্যাকশন ফাংশনটা কল করে ডাটা ফেচ করা হচ্ছে
  const response = await getAllRequest(page, limit, status, search);

  // ৩. ডাটা স্ট্রাকচার সেফটি চেক (যদি এপিআই ফেইল করে বা ডাটা না থাকে)
  const initialRequests = response?.data || [];
  const statistics = response?.statistics || {
    totalRequests: 0,
    pendingRequests: 0,
    inprogressRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
  };
  const pagination = response?.pagination || {
    page: 1,
    limit: limit,
    total: 0,
    totalPages: 1,
  };
  
  const session=await userInfo();
  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      {/* হেডার সেকশন */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-950 tracking-tight sm:text-2xl">
          Blood Donation Networks
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Review, manage, and track real-time emergency blood requests across hospitals.
        </p>
      </div>

      {/* ৪. ক্লায়েন্ট টেবিল কম্পোনেন্টে প্রপস হিসেবে ডাটা পাস করে দেওয়া হলো */}
      <GetAllRequest
        userId={session?.user?.id}
        initialRequests={initialRequests}
        statistics={statistics}
        pagination={pagination}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  );
};

export default AllBloodRequestManage;