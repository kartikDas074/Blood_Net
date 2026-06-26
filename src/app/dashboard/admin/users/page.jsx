import React from "react";
// 👈 তোর src/lib বা যেখানে অ্যাকশনটা রাখছিস সেই পাথ অনুযায়ী ইম্পোর্ট করবি
import UsersTableClient from "./UserTable";
import { UserList } from "@/lib/api/FindData";


const AllUsersPage = async ({ searchParams }) => {
  // Next.js ১৬+ অনুযায়ী searchParams কে await করে নিতে হবে
  const resolvedParams = await searchParams;
  
  // কুয়েরি প্যারামিটার থেকে ভ্যালুগুলো রিসিভ করা হচ্ছে (ডিফল্ট ভ্যালুসহ)
  const page = Math.max(Number(resolvedParams?.page) || 1, 1);
  const status = resolvedParams?.status || "all";
  const search = resolvedParams?.search || "";
  const limit = 10;

  // তোর UserList ফাংশন দিয়ে ব্যাকএন্ড থেকে ডেটা ফেচ করা হচ্ছে
  // যদি status "all" হয়, তবে এপিআই-তে ফাঁকা স্ট্রিং পাঠানো হচ্ছে যাতে ব্যাকএন্ড সব ইউজার রিটার্ন করে
  const apiResponse = await UserList(
    page, 
    limit, 
    status === "all" ? "" : status, 
    search
  );
  console.log(apiResponse);
  // এপিআই রেসপন্স থেকে ডেটা আলাদা করা হচ্ছে
  const users = apiResponse?.data || [];
  const statistics = apiResponse?.statistics || {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    volunteerUsers: 0,
    adminUsers: 0,
  };
  const pagination = apiResponse?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      {/* হেডার সেকশন */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Network Management</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Managing {statistics.totalUsers.toLocaleString()} members in the network
        </p>
      </div>

      {/* ক্লায়েন্ট টেবিল কম্পোনেন্ট */}
      <UsersTableClient 
        initialUsers={users} 
        statistics={statistics} 
        pagination={pagination}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  );
};

export default AllUsersPage;