import { headers } from "next/headers"
import { auth } from "../auth"

export const userInfo=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })
    return session;
}

export const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };