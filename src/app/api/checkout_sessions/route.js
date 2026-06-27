import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";
import { userInfo } from "@/lib/core/session";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const userSession = await userInfo();
    const user = userSession?.user;

    const formData = await request.formData();
    const donation = formData.get("donation");
    
    // ইউজারের নাম না থাকলে গেস্ট বা ডিফল্ট নাম হ্যান্ডেল করার জন্য
    const userName = user?.name || "Anonymous Donor";
    const userId = user?.id || "guest";
    const userEmail = user?.email || null; // ইমেইলটি বের করে নেওয়া হলো

    // স্ট্রাইপ সেশনের কনফিগারেশন অবজেক্ট
    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(donation) * 100, // সেন্টে কনভার্ট করার জন্য
            product_data: {
              name: `Donation by ${userName}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      metadata: {
        userId: userId,
        amount: donation,
      },
    };

    // 🔥 যদি ইউজারের ইমেইল সেশনে পাওয়া যায়, তবেই কেবল customer_email সেট হবে
    if (userEmail) {
      sessionConfig.customer_email = userEmail;
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // JSON রেসপন্সে ইউআরএল পাঠানো হচ্ছে
    return NextResponse.json({ url: session.url });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}