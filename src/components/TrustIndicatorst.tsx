import React from 'react';
import { UserCheck, Building2, HeartHandshake, Stethoscope } from 'lucide-react';

export const TrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: UserCheck,
      title: 'Experienced Specialists',
      description: 'Consultations led by credentialed Otolaryngologists, Endodontists, and Orthodontists with extensive hospital and clinical backgrounds.',
    },
    {
      icon: Building2,
      title: 'Modern Clinical Facilities',
      description: 'Equipped with digital video endoscopes, ultrasonic scalers, microscope root canal systems, and sound-attenuated audiometry.',
    },
    {
      icon: HeartHandshake,
      title: 'Patient-Centred Approach',
      description: 'Transparent treatment planning, gentle chairside care, minimal wait times, and dedicated post-procedure guidance.',
    },
    {
      icon: Stethoscope,
      title: 'Comprehensive Healthcare',
      description: 'Integrated ENT and Dental diagnostics, preventative therapies, minor procedures, and rehabilitation in one unified clinic.',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F2F8FB] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E5F6F2] text-[#16A6A1] flex items-center justify-center shrink-0 group-hover:bg-[#16A6A1] group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#123B5D] text-base mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
