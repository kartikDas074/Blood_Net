import { userInfo } from '@/lib/core/session';
import React from 'react';
import GetMyRequest from '../../Common/GetMyRequest';


const MyRequest = async () => {
    const session = await userInfo();
    const userId = session?.user?.id;

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto font-sans select-none bg-slate-50/50 min-h-screen">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Donation Requests</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Track and manage your blood donation requests across affiliated hospitals.
              </p>
            </div>

            {/* Client Interactive Component */}
            <GetMyRequest userId={userId} />
        </div>
    );
};

export default MyRequest;