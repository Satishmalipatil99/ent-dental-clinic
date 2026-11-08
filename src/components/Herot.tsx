import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Clinic, DepartmentType } from '../types/indext';

interface HeroProps {
  clinic: Clinic;
  onOpenBooking: (department?: DepartmentType) => void;
  onExploreDepartments: () => void;
}

export const Hero: React.FC<HeroProps> = ({ clinic, onOpenBooking, onExploreDepartments }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8FB] via-white to-white py-12 md:py-20 lg:py-24">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5F6F2] border border-[#16A6A1]/30 text-[#123B5D] text-xs font-semibold tracking-wide shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#16A6A1]"></span>
              <span>Advanced Dual-Specialty Healthcare Facility</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#123B5D] leading-[1.15] tracking-tight">
              {clinic.heroHeading || 'Complete Care for Your Ears, Nose, Throat & Smile.'}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {clinic.heroSubheading ||
                'Comprehensive ENT and Dental care under one roof. Experience personalized healthcare with dedicated specialists and modern facilities.'}
            </p>

            {/* Clinical Highlights Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-sm text-[#263746]">
                <CheckCircle2 className="w-5 h-5 text-[#16A6A1] shrink-0" />
                <span>German HD Video Endoscopes</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#263746]">
                <CheckCircle2 className="w-5 h-5 text-[#16A6A1] shrink-0" />
                <span>Microscope-Guided Root Canals</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#263746]">
                <CheckCircle2 className="w-5 h-5 text-[#16A6A1] shrink-0" />
                <span>Soundproof Audiometry Suite</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#263746]">
                <CheckCircle2 className="w-5 h-5 text-[#16A6A1] shrink-0" />
                <span>Hospital-Grade Class-B Sterilization</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white font-semibold text-base shadow-lg shadow-[#16A6A1]/25 hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                Book an Appointment
              </button>

              <button
                onClick={onExploreDepartments}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#123B5D] border border-slate-200 hover:border-slate-300 font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                Explore Our Departments
                <ArrowRight className="w-4 h-4 text-[#16A6A1]" />
              </button>
            </div>

            {/* Trust badge icons below CTAs */}
            <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A6A1]" />
                <span>Board Certified Surgeons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#16A6A1]" />
                <span>Verified Clinical Sterilization</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#16A6A1]" />
                <span>Zero Wait-Time Scheduling</span>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Photography Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Clinical Photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-5/4">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern AuraCare ENT and Dental Clinic Suite"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-medium text-teal-200 uppercase tracking-wider">Clinical Excellence</p>
                  <p className="text-sm font-semibold">Specialized Consultation &amp; Operatory Suites</p>
                </div>
              </div>

              {/* Floating Department Badge: ENT */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl shrink-0">
                  👂
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Department</p>
                  <p className="text-sm font-bold text-[#123B5D]">ENT Specialists</p>
                </div>
              </div>

              {/* Floating Department Badge: Dental */}
              <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-xl shrink-0">
                  🦷
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Department</p>
                  <p className="text-sm font-bold text-[#123B5D]">Advanced Dental Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
