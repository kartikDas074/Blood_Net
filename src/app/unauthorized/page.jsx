import Link from "next/link";
import { ShieldX, Home, Headphones } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center px-4">

      {/* Dot Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Icon Card */}
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl border border-red-100 bg-white shadow-[0_0_50px_rgba(239,68,68,0.15)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700">
            <ShieldX className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-600">
          Error 403: Forbidden
        </span>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          Unauthorized Access
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-lg text-slate-500 leading-8">
          It looks like you don't have the necessary permissions to
          view this page. If you believe this is an error, please contact
          your administrator or verify your account privileges.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-8 py-4 font-medium text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-1 hover:bg-red-800"
          >
            <Home size={18} />
            Return Home
          </Link>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 font-medium text-slate-700 transition-all duration-300 hover:border-slate-400 hover:bg-slate-50"
          >
            <Headphones size={18} />
            Contact Support
          </button>

        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <span>Security Level: Institutional</span>
          <span>|</span>
          <span>Protected Resource</span>
          <span>|</span>
          <span>Access Restricted</span>
        </div>

      </div>
    </div>
  );
}