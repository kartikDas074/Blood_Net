'use server'

import { serverPatch } from "../core/server"

export const statusRequest=async(data,requestId,userId)=>{
   const result=await serverPatch(`/api/statusUpdate/${requestId}?id=${userId}`,data);
   return result;
}