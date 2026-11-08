import React from 'react';
import { Calendar, Award, Clock, ArrowRight, Globe } from 'lucide-react';
import { Doctor, DepartmentType } from '../types/indext';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctor: Doctor) => void;
  onBookWithDoctor: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onViewProfile,
  onBookWithDoctor,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#16A6A1]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Doctor Photo */}
        <div className="relative h-64 overflow-hidden bg-slate-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/70 via-transparent to-transparent"></div>

          {/* Department badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md ${
                doctor.department === 'ENT'
                  ? 'bg-[#123B5D] text-white'
                  : 'bg-[#16A6A1] text-white'
              }`}
            >
              {doctor.department === 'ENT' ? '👂 ENT Specialist' : '🦷 Dental Specialist'}
            </span>
          </div>

          {/* Experience tag */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-teal-300" />
              {doctor.experienceYears}+ Years Clinical Practice
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-bold text-[#123B5D] text-lg mb-1 group-hover:text-[#16A6A1] transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-[#16A6A1] mb-2">{doctor.specialization}</p>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2">{doctor.qualification}</p>

          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.consultationHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 flex gap-2">
        <button
          onClick={() => onViewProfile(doctor)}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#123B5D] text-xs font-semibold transition cursor-pointer"
        >
          View Profile
        </button>
        <button
          onClick={() => onBookWithDoctor(doctor)}
          className="flex-1 py-2.5 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          Book Visit
        </button>
      </div>
    </div>
  );
};
