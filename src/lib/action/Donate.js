'use server'

import { serverPatch } from "../core/server"

export const donateBlood=async(id)=>{
     const result=await serverPatch(`/api/donate/${id}`,{});
     return result;
}