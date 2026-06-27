import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { userInfo } from "@/lib/core/session"; 

import {
  CheckCircle2,
  XCircle, // 👈 ইরর এর জন্য আইকন অ্যাড করলাম
  HeartHandshake,
  CreditCard,
  Mail,
  LayoutDashboard,
  BadgeDollarSign,
} from "lucide-react";

import { Fund } from "@/lib/action/funding";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Invalid payment session.");
  }

  // ১. স্ট্রাইপ থেকে সরাসরি সেশন ডেটা রিট্রিভ করো
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["payment_intent", "line_items"],
  });

  if (session.status === "open") {
    redirect("/");
  }

  // ২. কারেন্টলি লগইন করা ইউজারের ইনফো
  const userSession = await userInfo();
  const user = userSession?.user;

  // ৩. স্ট্রাইপ ভেরিফিকেশন এবং সিকিউরিটি ক্রস-চেক
  const isPaid = session.payment_status === "paid" && session.status === "complete";
  const isUserMatched = session.metadata?.userId === user?.id;

  let backendSaved = false;
  let backendMessage = "";

  if (isPaid && isUserMatched) {
    // ৪. সব সিকিউরিটি ম্যাচ করলে তোর Express ব্যাকএন্ডের ফাংশনে হিট করো
    const response = await Fund({ session_id: session_id });
    
    if (response?.success) {
      backendSaved = true;
    } else {
      backendMessage = response?.message || "Failed to sync with backend database.";
    }
  }

  const amount = session.amount_total / 100;
  const currency = session.currency?.toUpperCase();
  const email = session.customer_details?.email;
  const paymentIntent = session.payment_intent?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="rounded-3xl bg-white shadow-2xl border border-rose-100 overflow-hidden">
          
          {/* Top banner - ডায়নামিক কালার চয়েস (সফল হলে রোজ/রেড, ফেইল হলে গ্রে/অ্যাম্বার) */}
          <div className={`relative overflow-hidden px-8 py-14 text-center transition-all bg-gradient-to-r ${
            isPaid && backendSaved ? "from-rose-600 to-red-500" : "from-slate-700 to-slate-600"
          }`}>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_45%)]" />
            <div className="relative">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
                {isPaid && backendSaved ? (
                  <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                ) : (
                  <XCircle className="h-14 w-14 text-rose-500 animate-pulse" />
                )}
              </div>

              <h1 className="mt-6 text-4xl font-black text-white">
                {isPaid && backendSaved ? "Payment Successful 🎉" : "Verification Failed"}
              </h1>

              <p className="mt-3 text-rose-100 max-w-xl mx-auto">
                {backendSaved 
                  ? "Thanks for your Donation! It is what helping us to grow and save lives across the community."
                  : backendMessage || "Something went wrong while verifying with our database. Please contact support if your money was deducted."}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Payment Info */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border p-4">
                  <BadgeDollarSign className="text-emerald-600" />
                  <div>
                    <p className="text-xs text-slate-500">Amount</p>
                    <h3 className="font-bold text-lg">{amount} {currency}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border p-4">
                  <Mail className="text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-500">Confirmation Email</p>
                    <h3 className="font-semibold break-all">{email}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border p-4">
                  <CreditCard className="text-rose-600" />
                  <div>
                    <p className="text-xs text-slate-500">Transaction ID</p>
                    <h3 className="font-mono text-sm break-all">{paymentIntent}</h3>
                  </div>
                </div>

                {/* DB Sync Status Indicator */}
                <div className={`p-3 rounded-xl text-xs font-semibold border ${
                  backendSaved ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  Database Status: {backendSaved ? "Synced & Secured 🔒" : "Sync Failed ❌"}
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 p-6">
              <HeartHandshake className="h-12 w-12 text-rose-600" />
              <h2 className="mt-5 text-2xl font-black text-slate-900">Your Donation Makes a Difference ❤️</h2>
              <p className="mt-3 text-slate-600 leading-7">
                Every contribution helps organize emergency blood transportation, patient support, awareness campaigns, volunteer activities and life-saving blood donation events across the country.
              </p>

              <div className="mt-8 rounded-2xl bg-white p-5 shadow">
                <p className="text-sm text-slate-500">Because of supporters like you,</p>
                <h3 className="mt-2 text-3xl font-black text-rose-600">More Lives Can Be Saved</h3>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-slate-50 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/funding"
              className="rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-3 text-white font-bold flex items-center justify-center gap-2 transition"
            >
              <HeartHandshake size={18} />
              Donate Again
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-6 py-3 font-bold text-slate-700 flex items-center justify-center gap-2 transition"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}