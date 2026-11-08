import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types/indext';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 bg-[#F2F8FB] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Patient Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D]">
            What Our Patients Say
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Genuine experiences from patients who entrusted their ear, nose, throat and dental care to our team.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 relative">
            <MessageSquareQuote className="w-16 h-16 text-teal-100 absolute top-6 right-8 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Star Rating & Department Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < current.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">5.0 Outpatient Rating</span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    current.department === 'ENT'
                      ? 'bg-blue-50 text-[#123B5D]'
                      : 'bg-teal-50 text-[#16A6A1]'
                  }`}
                >
                  {current.department === 'ENT' ? '👂 ENT Patient' : '🦷 Dental Patient'} • {current.treatmentName}
                </span>
              </div>

              {/* Feedback Quote */}
              <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed font-normal">
                "{current.feedback}"
              </p>

              {/* Patient Author and Verified Tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#123B5D] text-base">{current.patientName}</h4>
                  <p className="text-xs text-slate-400">Treatment Date: {current.date}</p>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400 font-semibold px-1">
                    {currentIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
