import React, { useState } from 'react';
import { Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { ServiceTreatment, DepartmentType } from '../types/indext';

interface FeaturedTreatmentsProps {
  services: ServiceTreatment[];
  onSelectService: (service: ServiceTreatment) => void;
  onOpenBooking: (dept: DepartmentType) => void;
}

export const FeaturedTreatments: React.FC<FeaturedTreatmentsProps> = ({
  services,
  onSelectService,
  onOpenBooking,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | DepartmentType>('ALL');

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.department === activeFilter;
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Evidence-Based Interventions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D] tracking-tight">
              Featured Treatments &amp; Procedures
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Advanced outpatient ENT and dental procedures performed with modern clinical equipment and precision diagnostics.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-white text-[#123B5D] shadow-xs'
                  : 'text-slate-600 hover:text-[#123B5D]'
              }`}
            >
              All Procedures
            </button>
            <button
              onClick={() => setActiveFilter('ENT')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'ENT'
                  ? 'bg-white text-[#123B5D] shadow-xs'
                  : 'text-slate-600 hover:text-[#123B5D]'
              }`}
            >
              👂 ENT Procedures
            </button>
            <button
              onClick={() => setActiveFilter('Dental')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'Dental'
                  ? 'bg-white text-[#123B5D] shadow-xs'
                  : 'text-slate-600 hover:text-[#123B5D]'
              }`}
            >
              🦷 Dental Treatments
            </button>
          </div>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#16A6A1]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={treatment.image}
                    alt={treatment.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                        treatment.department === 'ENT'
                          ? 'bg-[#123B5D] text-white'
                          : 'bg-[#16A6A1] text-white'
                      }`}
                    >
                      {treatment.department}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs">
                      {treatment.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-[#123B5D] text-lg mb-2 group-hover:text-[#16A6A1] transition-colors line-clamp-1">
                    {treatment.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {treatment.shortDescription}
                  </p>

                  {/* Procedure Duration & Recovery */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#16A6A1]" />
                      <span>{treatment.procedureTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectService(treatment)}
                  className="text-xs font-bold text-[#123B5D] hover:text-[#16A6A1] transition flex items-center gap-1.5 cursor-pointer"
                >
                  Learn More &amp; Symptoms
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenBooking(treatment.department)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E5F6F2] hover:bg-teal-100 text-[#16A6A1] text-xs font-semibold transition cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
