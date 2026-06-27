'use client';
import React, { useState } from 'react';

export default function BloodDonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const finalAmount = customAmount ? customAmount : selectedAmount;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) return;
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('donation', finalAmount);

      // ফোল্ডার স্ট্রাকচার অনুযায়ী সঠিক এন্ডপয়েন্ট
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        // স্ট্রাইপের চেকআউট পেজে রিডাইরেক্ট
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Stripe Error: ${data.error}`);
      } else {
        alert('Failed to initiate checkout.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- Hero Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                🩸 Save Lives
              </span>
              <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                ⚡ Emergency Support
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Support Our Blood <br className="hidden md:inline" />
              Donation Mission <span className="text-rose-500">❤️</span>
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-xl text-sm md:text-base">
              Your financial contributions fuel our mission to bridge the gap between donors and patients.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-slate-200">
              <img src="/Assets/funding.jpg" alt="Blood Donation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* --- Lower Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Progress Section */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="text-rose-600 font-bold tracking-wide text-sm uppercase">Monthly Goal Progress</div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#b91c1c] h-full rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          {/* Donation Form Widget */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-rose-100/70 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Choose Your Contribution</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[100, 200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                  className={`py-3 px-4 rounded-xl font-bold border text-sm transition ${
                    selectedAmount === amount && !customAmount
                      ? 'border-rose-200 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  ৳{amount}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
              <input
                type="number"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            {/* Form Submit wrapper */}
            <form onSubmit={handleCheckout}>
              <button 
                type="submit" 
                disabled={!finalAmount || finalAmount <= 0 || isLoading}
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] disabled:bg-slate-300 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : `Continue with Stripe (৳${finalAmount || 0})`}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}