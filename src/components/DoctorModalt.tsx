import React from 'react';
import { X, Calendar, Clock, Award, Globe, GraduationCap, CheckCircle } from 'lucide-react';
import { Doctor } from '../types/indext';

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition cursor-pointer"
          aria-label="Close doctor details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner with Photo */}
        <div className="relative bg-gradient-to-r from-[#123B5D] to-[#16A6A1] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-200 shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              {doctor.department === 'ENT' ? '👂 ENT Specialist' : '🦷 Dental Specialist'}
            </div>
            <h2 id="doctor-modal-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {doctor.name}
            </h2>
            <p className="text-teal-200 text-sm font-medium">{doctor.specialization}</p>
            <p className="text-white/80 text-xs">{doctor.experienceYears}+ Years Clinical Excellence</p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Biography */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Clinical Background &amp; Profile
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Qualifications & Degrees */}
          <div className="p-4 rounded-xl bg-[#F2F8FB] border border-slate-200/60 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-[#123B5D] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-1">
                Medical Qualifications &amp; Accreditations
              </h4>
              <p className="text-xs text-slate-700 font-medium">{doctor.qualification}</p>
            </div>
          </div>

          {/* Consultation Schedule & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
                <Clock className="w-4 h-4 text-[#16A6A1]" />
                <span>Consultation Timings</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{doctor.consultationHours}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {doctor.consultationDays.map((day, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
                <Globe className="w-4 h-4 text-[#16A6A1]" />
                <span>Languages Spoken</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{doctor.languages.join(', ')}</p>
              <div className="flex items-center gap-1 text-[11px] text-teal-700 pt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>English &amp; Regional Languages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Prior appointments recommended for minimal wait time.</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book with {doctor.name.split(' ')[0]} {doctor.name.split(' ')[1]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
