'use server'

import { serverPost } from "../core/server"

export const Fund=async(data)=>{
    const result=await serverPost(`/api/verify-payment`,data);
    return result;
}