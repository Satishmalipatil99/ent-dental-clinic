import React from 'react';
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Clock,
  Sparkles,
  Stethoscope,
  Smile,
  CheckCircle2,
} from 'lucide-react';
import { Clinic } from '../types/indext';

interface AboutSectionProps {
  clinic: Clinic;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ clinic }) => {
  const whyChooseUs = [
    {
      icon: Award,
      title: 'Experienced Medical Professionals',
      description: 'Consultations and surgical procedures handled exclusively by accredited specialists with over a decade of dedicated clinical focus.',
    },
    {
      icon: Sparkles,
      title: 'Modern Facilities & Diagnostic Suites',
      description: 'Equipped with German Karl Storz rigid video endoscopes, surgical microscopes, digital RVG sensors, and rotary endodontic systems.',
    },
    {
      icon: HeartHandshake,
      title: 'Personalized Patient Care',
      description: 'Every patient receives an individual diagnostic plan with clear clinical counseling, transparent estimates, and gentle chairside empathy.',
    },
    {
      icon: Clock,
      title: 'Convenient Appointment Requests',
      description: 'Zero-wait scheduling with online slot requests, SMS confirmations, and priority slots for acute ear or dental emergencies.',
    },
    {
      icon: Stethoscope,
      title: 'Comprehensive ENT & Dental Under One Roof',
      description: 'Cross-specialty collaboration for connected conditions like maxillary sinus tooth root infections, snoring, and obstructive sleep apnea.',
    },
    {
      icon: ShieldCheck,
      title: 'Hospital-Grade Sterilization Protocols',
      description: 'Stringent Class-B autoclave sterilization, barrier protections, and sterile disposable consumables following global infection guidelines.',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        {/* About Clinic Intro & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80"
                    alt="Clinical Consultation Chamber"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#E5F6F2] p-4 rounded-2xl text-center">
                  <span className="text-xl font-bold text-[#16A6A1] block">Dual-Specialty</span>
                  <span className="text-xs text-slate-600 font-medium">Integrated Clinical Hub</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-[#123B5D] p-4 rounded-2xl text-center text-white">
                  <span className="text-xl font-bold text-teal-300 block">Class-B</span>
                  <span className="text-xs text-slate-300 font-medium">Sterilization Protocols</span>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                    alt="Modern Operatory Suite"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase">
              <Stethoscope className="w-3.5 h-3.5" />
              About AuraCare Specialists
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D] tracking-tight">
              A Benchmark in Integrated Otolaryngology &amp; Oral Health
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Founded on the belief that healthcare should be both technologically precise and deeply compassionate, AuraCare brings together senior ENT surgeons and advanced dental practitioners under a unified healthcare umbrella.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-[#F2F8FB] border border-slate-200/60 space-y-1.5">
                <h4 className="font-bold text-[#123B5D] text-sm">Our Clinical Mission</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To provide accurate, conservative diagnostics and evidence-based interventions that preserve natural anatomy, hearing, airway clarity, and oral function.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F2F8FB] border border-slate-200/60 space-y-1.5">
                <h4 className="font-bold text-[#123B5D] text-sm">Our Patient Philosophy</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Anxiety-free, gentle procedures in a sanitized and calm environment where patients are fully informed partners in every medical decision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Why Choose Us */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase">
              The AuraCare Standard
            </div>
            <h2 className="text-3xl font-bold text-[#123B5D]">Why Choose Our Clinic</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Commitment to medical precision, transparent communication, and comfortable treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F2F8FB] hover:bg-white hover:shadow-lg border border-slate-200/60 transition-all duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-white text-[#16A6A1] shadow-xs flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#123B5D] text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
