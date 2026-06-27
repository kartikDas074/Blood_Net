import Link from "next/link";
import { XCircle, RotateCcw, HeartHandshake, Home } from "lucide-react";

const CancelPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-white shadow-2xl overflow-hidden">

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-red-500 px-8 py-10 text-center text-white">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <XCircle className="h-12 w-12" />
          </div>

          <h1 className="text-3xl font-black">
            Payment Cancelled
          </h1>

          <p className="mt-3 text-rose-100 max-w-lg mx-auto">
            Your donation was not completed. No payment has been charged.
            Whenever you're ready, you can return and support our mission.
          </p>
        </div>

        {/* Body */}
        <div className="p-8">

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-4">
              <HeartHandshake className="h-10 w-10 text-amber-600 flex-shrink-0" />

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Your support still matters ❤️
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Every contribution helps us organize emergency blood
                  transportation, awareness campaigns, volunteer activities,
                  patient support, and life-saving blood donation programs.
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-bold text-slate-800">
              What happened?
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>You closed the Stripe checkout page.</li>
              <li>Your payment was not completed.</li>
              <li>No money has been deducted from your account.</li>
              <li>You can safely try again anytime.</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            <Link
              href="/funding"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 px-6 py-4 font-bold text-white transition hover:scale-[1.02] hover:shadow-xl"
            >
              <RotateCcw className="h-5 w-5" />
              Try Donation Again
            </Link>

            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>

          </div>

          {/* Footer */}
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-center">
            <p className="text-sm text-slate-300">
              ❤️ Every donation saves lives. Whenever you're ready, we'll be
              here to continue the mission together.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
};

export default CancelPage;