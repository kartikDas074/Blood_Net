import React from 'react';
import { UserPlus, Search, ShieldAlert, Heart } from 'lucide-react';

const FeatureSection = () => {
  const steps = [
    {
      id: 1,
      title: 'Registration',
      description: 'Quick verification of your eligibility through our medical-grade screening algorithm.',
      icon: UserPlus,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'group-hover:border-red-200',
    },
    {
      id: 2,
      title: 'Matching',
      description: 'Real-time matching with hospitals and requests within your immediate vicinity.',
      icon: Search,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'group-hover:border-blue-200',
    },
    {
      id: 3,
      title: 'Donation',
      description: 'Proceed to the nearest certified clinic. The process takes less than 15 minutes.',
      icon: ShieldAlert,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'group-hover:border-emerald-200',
    },
    {
      id: 4,
      title: 'Impact',
      description: 'Get notified when your contribution has been successfully delivered and used.',
      icon: Heart,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'group-hover:border-amber-200',
    },
  ];

  return (
    // মেইন ব্যাকগ্রাউন্ড পিওর হোয়াইট এবং টেক্সট ডার্ক ব্লু-স্লেট থিম
    <section className="w-full py-20 bg-[#FFFFFF] text-[#090d16]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#090d16]">
            A Streamlined Journey to Saving Lives
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
            Our four-step protocol ensures donor safety and recipient speed. Every second counts in medical logistics.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.id} 
                className={`bg-[#F8FAFC] border border-slate-200/80 p-8 rounded-2xl flex flex-col justify-between hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group ${step.borderColor}`}
              >
                <div className="space-y-6">
                  {/* Icon Box - সাদা ব্যাকগ্রাউন্ডেড বক্স এবং সফ্ট কালারড গ্লো */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-slate-100 shadow-sm ${step.bgColor} bg-opacity-60 transition-colors duration-300`}>
                    <IconComponent size={20} className={step.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#090d16] tracking-wide transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step Number Indicator */}
                <div className="pt-6 flex justify-end">
                  <span className="text-xs font-black text-slate-300 font-mono tracking-widest group-hover:text-slate-400 transition-colors duration-200">
                    0{step.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;