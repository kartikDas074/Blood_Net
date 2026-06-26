'use server'
import { serverPost } from "../core/server"

export const CreateDonationRequest=async(data)=>{
   const result=await serverPost(`/donation-request`,data);
   return result;
}