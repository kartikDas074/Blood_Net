'use server'

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const userInfo = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};



export const checkAccess = async (session, role) => {
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== role) {
    redirect("/unauthorized");
  }
};


export const token=async()=>{
    const session=await userInfo();
    const token=session?.session?.token||null;
    return token;
}