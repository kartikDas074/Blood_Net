'use server'

import { serverPatch } from "../core/server"

export const UpdateRequest=async(data,requestId,userId)=>{
   const result=await serverPatch(`/api/my-request/${requestId}?id=${userId}`,data);
   return result;
}