import React from 'react';
import { X, Calendar, Clock, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ServiceTreatment, DepartmentType } from '../types/indext';

interface ServiceModalProps {
  service: ServiceTreatment | null;
  onClose: () => void;
  onBookTreatment: (department: DepartmentType) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onBookTreatment,
}) => {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition cursor-pointer"
          aria-label="Close treatment details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Image */}
        <div className="relative h-56 sm:h-64 bg-slate-100">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/90 via-[#123B5D]/40 to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  service.department === 'ENT' ? 'bg-[#123B5D] text-white' : 'bg-[#16A6A1] text-white'
                }`}
              >
                {service.department} Department
              </span>
              <span className="text-[11px] text-teal-200 font-medium">{service.category}</span>
            </div>
            <h2 id="service-modal-title" className="text-xl sm:text-2xl font-bold text-white">
              {service.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Treatment Overview
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">{service.fullDescription}</p>
          </div>

          {/* Clinical Indicators / Symptoms Addressed */}
          {service.symptomsAddressed && service.symptomsAddressed.length > 0 && (
            <div className="p-4 rounded-xl bg-[#F2F8FB] border border-slate-200/60">
              <h4 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#16A6A1]" />
                Symptoms &amp; Clinical Indications Evaluated:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.symptomsAddressed.map((symptom, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#16A6A1] shrink-0" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedure & Recovery Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Procedure Time</span>
              <span className="text-sm font-bold text-[#123B5D]">{service.procedureTime}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Recovery Guidance</span>
              <span className="text-sm font-bold text-[#123B5D]">{service.recoveryTime}</span>
            </div>
          </div>

          {/* Medical Disclaimer Note */}
          <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Clinical protocols are tailored by our specialists after thorough diagnostic examination. Individual outcomes and recovery intervals may vary.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookTreatment(service.department);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book Consultation for this Treatment
          </button>
        </div>
      </div>
    </div>
  );
};
