export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center space-y-6">
        
       
        <div className="relative w-20 h-20 flex items-center justify-center">
          
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping duration-1000"></div>
         
          <div className="absolute inset-2 rounded-full bg-rose-500/30 animate-pulse duration-700"></div>
          
    
          <div className="w-10 h-10 bg-[#991B1B] rounded-tl-full rounded-br-full rounded-bl-full rotate-45 shadow-lg shadow-rose-900/20 flex items-center justify-center transform transition-transform">
          
            <div className="w-3 h-3 bg-white/30 rounded-full -rotate-45 -translate-x-1 -translate-y-1"></div>
          </div>
        </div>

        <div className="space-y-3 text-center max-w-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wide uppercase">
              Loading Portal
            </h3>
            <p className="text-[11px] font-bold text-rose-700/80 tracking-wider uppercase animate-pulse">
              Connecting to Blood Network...
            </p>
          </div>

         
          <div className="w-40 h-1 bg-slate-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#991B1B] rounded-full w-1/2 animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
          </div>
        </div>

      </div>
    </div>
  );
}