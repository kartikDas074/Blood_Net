import React from "react";
import SidebarComponent from "../sidebar/Sidebar"; 

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <SidebarComponent />

      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
