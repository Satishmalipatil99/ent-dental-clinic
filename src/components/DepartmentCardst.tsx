import React from 'react';
import { ArrowRight, Check, Calendar, Activity, Sparkles } from 'lucide-react';
import { DepartmentType } from '../types/indext';

interface DepartmentCardsProps {
  onSelectDepartment: (dept: DepartmentType) => void;
  onOpenBooking: (dept: DepartmentType) => void;
}

export const DepartmentCards: React.FC<DepartmentCardsProps> = ({
  onSelectDepartment,
  onOpenBooking,
}) => {
  return (
    <section id="departments" className="py-16 md:py-24 bg-[#F2F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold tracking-wide uppercase mb-3">
            <Activity className="w-3.5 h-3.5" />
            Specialized Clinical Divisions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D] tracking-tight">
            Our Core Departments
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Delivering dedicated specialist expertise with advanced diagnostic technologies and tailored patient treatments.
          </p>
        </div>

        {/* 2 Large Department Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* CARD 1: ENT */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
            {/* Image Header with Badge */}
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
                alt="ENT Clinic and Examination Facility"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/80 via-[#123B5D]/30 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#123B5D] flex items-center gap-1.5 shadow-xs">
                <span>👂</span> Department of Otolaryngology
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold">ENT – Ear, Nose &amp; Throat Care</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Comprehensive evaluation and treatment for ear, nose and throat conditions with personalized patient care.
                </p>

                {/* Sub-specialties list */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Key ENT Clinical Services:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Ear Care & Microscopic Cleaning',
                    'Nose & Sinus Care',
                    'Throat & Voice Care',
                    'Hearing Assessment (PTA)',
                    'Allergy Evaluation',
                    'ENT Endoscopic Procedures',
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#263746]">
                      <div className="w-4 h-4 rounded-full bg-[#E5F6F2] text-[#16A6A1] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onSelectDepartment('ENT')}
                  className="flex-1 px-5 py-3 rounded-xl bg-[#123B5D] hover:bg-[#0b253c] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  Explore ENT Services
                  <ArrowRight className="w-4 h-4 text-teal-300" />
                </button>
                <button
                  onClick={() => onOpenBooking('ENT')}
                  className="px-5 py-3 rounded-xl bg-[#E5F6F2] hover:bg-teal-100 text-[#16A6A1] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book ENT
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: DENTAL */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
            {/* Image Header with Badge */}
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                alt="Advanced Dental Operatory Suite"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/80 via-[#123B5D]/30 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#16A6A1] flex items-center gap-1.5 shadow-xs">
                <span>🦷</span> Department of Advanced Dentistry
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold">Advanced Dental Care</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Comprehensive dental solutions focused on oral health, prevention, restoration and smile aesthetics.
                </p>

                {/* Sub-specialties list */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Key Dental Clinical Services:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'General Dentistry & Checkups',
                    'Single-Sitting Root Canal',
                    'Dental Implants',
                    'Laser Teeth Whitening',
                    'Orthodontics & Clear Aligners',
                    'Cosmetic Dentistry & Veneers',
                    'Pediatric Dentistry',
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#263746]">
                      <div className="w-4 h-4 rounded-full bg-[#E5F6F2] text-[#16A6A1] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onSelectDepartment('Dental')}
                  className="flex-1 px-5 py-3 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  Explore Dental Services
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => onOpenBooking('Dental')}
                  className="px-5 py-3 rounded-xl bg-[#F2F8FB] hover:bg-slate-100 text-[#123B5D] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book Dental
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
