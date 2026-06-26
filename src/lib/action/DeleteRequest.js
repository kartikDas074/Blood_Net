'use server'

import { serverDelete } from "../core/server"

export const deleteRequest=async(requestId,userId)=>{
    const result =await serverDelete(`/api/deleteRequest/${requestId}?id=${userId}`);
    return result;
}

