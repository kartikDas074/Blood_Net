'use server'

import { serverPatch } from "../core/server"

export const profileUpdata=async(data)=>{
    const result=await serverPatch(`/api/profile`,data);
    return result;
}