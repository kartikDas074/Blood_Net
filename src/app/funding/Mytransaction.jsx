import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Copy, 
  Check,
  TrendingUp,
  CreditCard,
  Search
} from 'lucide-react';

const Mytransaction = ({ data }) => {
  const transactions = data?.result || [];
  const totalFundingAmount = data?.totalAmount || 0;
  
  // ইন্টারেক্টিভ কপির জন্য স্টেট
  const [copiedId, setCopiedId] = useState(null);
  // সার্চ ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');

  // ট্রানজেকশন আইডি কপি করার ফাংশন
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ডাইনামিকালি কিছু ইন্টারেক্টিভ মেট্রিক হিসাব করা (প্রিমিয়াম ফিল দিতে)
  const successCount = transactions.filter(tx => tx.paymentStatus?.toUpperCase() === 'COMPLETED').length;
  const successRate = transactions.length ? Math.round((successCount / transactions.length) * 100) : 0;
  const averageDonation = transactions.length ? Math.round(totalFundingAmount / transactions.length) : 0;

  // সার্চিং লজিক (ইমেইল বা নাম দিয়ে খোঁজার জন্য)
  const filteredTransactions = transactions.filter(tx => 
    tx.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.stripeSessionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (transactions.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-16 text-center bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500 mb-4 border border-rose-100">
          <AlertCircle size={28} />
        </div>
        <h4 className="text-xl font-black text-[#090d16]">No Transaction Records Yet</h4>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto font-medium">
          Once your stripe sessions are validated, your complete ledger breakdown will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 antialiased">
      
      {/* ================= ১. প্রিমিয়াম ডাইনামিক স্ট্যাটস গ্রিড ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* টোটাল ফান্ডিং */}
        <div className="bg-[#090d16] text-white p-6 rounded-3xl relative overflow-hidden shadow-[0_10px_30px_rgba(9,13,22,0.15)] group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <DollarSign size={80} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Contributed</p>
          <h2 className="text-4xl font-black font-mono text-emerald-400 mt-2">
            ${totalFundingAmount.toLocaleString()}
          </h2>
          <p className="text-slate-500 text-xs mt-3 flex items-center gap-1">
            <TrendingUp size={14} className="text-emerald-400" />
            Lifetime secure funding ledger
          </p>
        </div>

        {/* এভারেজ পেমেন্ট */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Value</p>
            <h2 className="text-3xl font-black font-mono text-[#090d16] mt-2">
              ${averageDonation.toLocaleString()}
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-3 flex items-center gap-1.5 font-medium">
            <CreditCard size={14} className="text-slate-400" />
            Per transaction average
          </p>
        </div>

        {/* সাকসেস রেট */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Rate</p>
            <h2 className="text-3xl font-black font-mono text-[#090d16] mt-2">
              {successRate}%
            </h2>
          </div>
          <p className="text-emerald-600 text-xs mt-3 flex items-center gap-1.5 font-semibold">
            <CheckCircle2 size={14} className="text-emerald-500" />
            {successCount} out of {transactions.length} Verified
          </p>
        </div>

      </div>

      {/* ================= ২. ট্রানজেকশন হিস্ট্রি মেইন প্যানেল ================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* ইন্টারঅ্যাক্টিভ হেডার এবং সার্চ বার */}
        <div className="px-6 py-6 border-b border-slate-100 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#090d16] tracking-tight">Verified Payments Ledger</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Secure transactions logged via Stripe endpoint</p>
          </div>
          
          {/* সার্চ ফিল্টার ইনপুট */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search donor or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* ৩. ট্রানজেকশন লিস্ট (লুপ ও মডার্ন কলামাইজড লেআউট) */}
        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((tx) => {
            const transactionId = tx._id?.$oid || tx._id;
            
            // ডেট ফরম্যাট করা
            const paymentDate = tx.createdAt?.$date 
              ? new Date(tx.createdAt.$date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : new Date(tx.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

            const isCompleted = tx.paymentStatus?.toUpperCase() === 'COMPLETED';

            return (
              <div 
                key={transactionId} 
                className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/70 transition-colors duration-200"
              >
                {/* কলাম ১: ইউজার ইনফো */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform duration-200">
                    <ArrowUpRight size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#090d16] flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      {tx.userName || 'Anonymous Donor'}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" />
                      {tx.userEmail}
                    </p>
                  </div>
                </div>

                {/* কলাম ২: ট্রানজেকশন সেশন আইডি (ইন্টারঅ্যাক্টিভ কপি বাটনসহ) */}
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session Reference</span>
                  <div className="flex items-center gap-1.5 group/copy cursor-pointer" onClick={() => handleCopy(transactionId, tx.stripeSessionId)}>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {tx.stripeSessionId ? `${tx.stripeSessionId.substring(0, 16)}...` : 'N/A'}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 opacity-60 group-hover/copy:opacity-100 transition-opacity">
                      {copiedId === transactionId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                    {copiedId === transactionId && (
                      <span className="text-[10px] text-emerald-600 font-bold tracking-wide animate-fade-in">Copied!</span>
                    )}
                  </div>
                </div>

                {/* কলাম ৩: ট্রানজেকশন ডেট ও টাইম */}
                <div className="flex flex-col gap-1 min-w-[150px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Payment Date</span>
                  <span className="text-xs font-bold text-slate-600 font-mono flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    {paymentDate}
                  </span>
                </div>

                {/* কলাম ৪: অ্যামাউন্ট এবং সাকসেস স্ট্যাটাস */}
                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-none border-slate-100 pt-4 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block lg:hidden">Contribution Value</span>
                    <span className="text-base font-black text-emerald-600 font-mono">+${tx.amount}</span>
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                        {/* ব্লিংকিং লাইভ ডট ইফেক্ট */}
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        COMPLETED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
                        <AlertCircle size={12} />
                        {tx.paymentStatus || 'PENDING'}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
          
          {/* সার্চ রেজাল্ট যদি খালি থাকে */}
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm font-semibold">
              No transactions match your search keywords.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Mytransaction;