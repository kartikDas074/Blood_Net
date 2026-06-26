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
  const result =await serverGet(`/allusers?${params}`);
  return result;
};
