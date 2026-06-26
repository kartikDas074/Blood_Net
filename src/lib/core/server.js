import { token } from "./session";

const authHeader = async () => {
  const getToken = await token();
  return getToken ? { authorization: `Bearer ${getToken}` } : {};
};

export const serverPost = async (path, data) => {
  try {
    console.log(path, data);
    const result = await fetch(`${process.env.SERVER_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        ...(await authHeader()),
      },
      body: JSON.stringify(data),
    });
    console.log(result);
    return await handleResult(result);
  } catch (error) {
    console.error("Network Error in serverPost:", error);
    return {
      success: false,
      message: "Network error! Failed to connect to server.",
    };
  }
};

export const serverGet = async (path) => {
  const url = `${process.env.SERVER_URL}${path}`;
  console.log(url);

  const result = await fetch(url,{
    headers:{
        ... await authHeader()
    }
  });
  console.log(result);
  return result.json();
 
};

export const serverPatch =async (path,data)=>{
    const result=await fetch(`${process.env.SERVER_URL}${path}`,{
        method:'PATCH',
        headers:{
            'Content-type':'application/json',
            ... await authHeader()
        },
        body:JSON.stringify(data)
    })
    return result.json();
}

export const serverDelete=async(path)=>{
    const result = await fetch(`${process.env.SERVER_URL}${path}`,{
        method:'DELETE',
        headers:{
            ... await authHeader()
        }
    })
    return result.json();
}
const handleResult = async (result) => {
  try {
    const responseData = await result.json();

    // যদি রেসপন্স ঠিক থাকে
    if (result.ok && responseData.success) {
      return responseData;
    }

    // টোকেন এক্সপায়ার বা অন্য কোনো এরর হলে জাস্ট অবজেক্ট রিটার্ন করো
    return {
      success: false,
      status: result.status,
      message:
        responseData.message || "Something went wrong. Please try again.",
    };
  } catch (error) {
    console.error("Error parsing response:", error);
    return { success: false, message: "Failed to parse server response." };
  }
};

