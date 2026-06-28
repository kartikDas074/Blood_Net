"use server";

import { serverGet } from "../core/server";

export const getMyRequest = async (
  userId,
  page = 1,
  limit = 10,
  status = "",
  search = "",
) => {
  const query = new URLSearchParams({
    id: userId,
    page: page,
    limit: limit,
  });
  if (status != "") {
    query.append("status", status);
  }
  if (search.trim()) {
    query.append("search", search.trim());
  }
  const params = query.toString();

  const result = await serverGet(`/api/my-request?${params}`);

  return result;
};

export const getDonateDetail = async (id) => {
  const result = await serverGet(`/api/donationRequest/${id}`);
  return result;
};

export const latestRequest = async () => {
  const result = serverGet("/api/my-request/latest");
  return result;
};

export const UserList = async (
  page = 1,
  limit = 10,
  status = "all",
  search = "",
) => {
  const query = new URLSearchParams({
    page: page,
    limit: limit,
  });

  if (status != "") {
    query.append("status", status);
  }
  if (search.trim()) {
    query.append("search", search.trim());
  }
  const params = query.toString();
  console.log(params);
  const result = await serverGet(`/allusers?${params}`);
  return result;
};

export const getAllRequest = async (
  userId, // 👈 userId প্যারামিটার যুক্ত করা হলো
  page = 1,
  limit = 10,
  status = "",
  search = "",
) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  // userId থাকলে কুয়েরিতে যোগ করবে (ব্যাকএন্ডে req.query.id হিসেবে পাবে)
  if (userId) {
    query.append("id", userId);
  }

  // status খালি না হলে কুয়েরিতে যোগ করবে
  if (status && status !== "all") {
    query.append("status", status);
  }

  // search ভ্যালু থাকলে যোগ করবে
  if (search.trim()) {
    query.append("search", search.trim());
  }

  const params = query.toString();
  const result = await serverGet(`/api/get-request?${params}`);
  console.log(result);
  return result;
};

export const allInfo = async () => {
  const result = await serverGet(`/api/allinfo`);
  return result;
};

export const getAllPending = async (
  page = 1,
  limit = 10,
  search = "",
  blood_group = "",
  district = "",
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (blood_group?.trim()) {
    params.set("blood_group", blood_group.trim());
  }

  if (district?.trim()) {
    params.set("district", district.trim());
  }

  return await serverGet(`/api/pending-request?${params.toString()}`);
};


export const getFunding=async(status=0)=>{
  
  const result=await serverGet(`/api/my_funding?status=${status}`);
  return result;
}

export const getTotalFunding=async()=>{
  const result=await serverGet('/api/total_funding');
  return result;
}