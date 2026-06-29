import { getFunding, latestRequest } from "@/lib/api/FindData";
import { userInfo } from "@/lib/core/session";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  Heart,
  DollarSign,
} from "lucide-react";
import LatestRequest from "../Common/LatestReqest";

const Page = async () => {
  const result = await latestRequest();

  const stat = result?.statistics;
  const session = await userInfo();
  const user = session?.user;
 
  const userId = user?._id?.toString() || user?.id; 
  const money=await getFunding(1);
  const totalMoneyDonated = money?.totalAmount;

  return (
    <div className="min-h-screen bg-slate-50 p-5 lg:p-8">
      {/* ================= HERO ================= */}
      <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Image
              src={user?.image || "/avatar.png"}
              alt={user?.name || "User Avatar"}
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-4 border-white"></span>
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Welcome back,
              <span className="ml-2 bg-gradient-to-r from-rose-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                {user?.name}
              </span>
              👋
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Thank you for being a lifesaver. Manage your donation requests and
              continue helping people in need.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-600">
                ❤️ {user?.blood_group || "--"}
              </span>

              <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold capitalize text-blue-600">
                {user?.role}
              </span>

              <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold capitalize text-emerald-600">
                {user?.status}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/donor/create-donation-request"
          className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-rose-500/30"
        >
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          New Request
        </Link>
      </div>

      {/* ================= QUOTE ================= */}
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4">
        <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
        <p className="text-sm font-medium text-rose-700">
          One blood donation can save up to three lives. Thank you for making a
          difference.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="group bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">
              Total Requests
            </p>
            <h2 className="mt-3 text-5xl font-black tracking-tight text-slate-900">
              {String(stat?.totalRequests || 0).padStart(2, "0")}
            </h2>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-100 p-4 text-rose-600 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        {/* Pending */}
        <div className="group bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">
              Pending
            </p>
            <h2 className="mt-3 text-5xl font-black tracking-tight text-emerald-600">
              {String(stat?.pendingRequests || 0).padStart(2, "0")}
            </h2>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-4 text-emerald-600 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        {/* Completed */}
        <div className="group bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">
              Completed
            </p>
            <h2 className="mt-3 text-5xl font-black tracking-tight text-blue-600">
              {String(stat?.completedRequests || 0).padStart(2, "0")}
            </h2>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 p-4 text-blue-600 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>

        {/* Fund */}
        <div className="group bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">
              Fund Donated
            </p>
            <h2 className="mt-3 text-5xl font-black tracking-tight text-amber-600">
              {String(totalMoneyDonated || 0).padStart(2, "0")}
            </h2>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4 text-amber-600 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <DollarSign className="h-7 w-7" />
          </div>
        </div>
      </div>
      
      {/* 🔴 এখানে শুধু প্রয়োজনীয় দুটি প্রপ্স পাস করা হলো */}
      <LatestRequest data={result?.data} userId={userId} />

    </div>
  );
};

export default Page;