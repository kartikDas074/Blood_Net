'use server'

import { serverGet } from "../core/server";



export const getMyRequest=async(userId,page=1,limit=10,status="",search="")=>{

    const query=new URLSearchParams(
        {
            id:userId,
            page:page,
            limit:limit
        }
    );
    if(status!=""){
        query.append('status',status);
    }
    if(search.trim()){
        query.append('search',search.trim());
    }
    const params=query.toString();
    console.log('i am love with a fariytale',params);
    const result= await serverGet(`/api/my-request?${params}`);
    console.log(result);
    return result;
}

