import React from 'react';
import SidebarComponent from '../sidebar/Sidebar'; // তোমার আগের তৈরি করা কম্পোনেন্ট নাম অনুযায়ী চেক করে নিবে

const DashboardLayout = ({ children }) => {
    return (
        // h-screen দিয়ে পুরো স্ক্রিন লক করা হলো যেন সাইডবার ফিক্সড থাকে
        <div className='flex h-screen w-full bg-slate-50 overflow-hidden'>
            
            {/* সাইডবার কন্টেইনার */}
            <SidebarComponent />
            
            {/* মেইন কনটেন্ট এরিয়া (আলাদা স্ক্রল হবে) */}
            <main className='flex-1 h-full overflow-y-auto p-4 md:p-6'>
                {children}
            </main>
            
        </div>
    );
};

export default DashboardLayout;