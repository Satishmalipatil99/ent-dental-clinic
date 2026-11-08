import React, { useState } from 'react';
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  UserCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { Clinic, DepartmentType } from '../types/indext';

interface FooterProps {
  clinic: Clinic;
  onNavigate: (view: string, dept?: DepartmentType) => void;
  onOpenBooking: (dept?: DepartmentType) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  clinic,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
}) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#123B5D] text-slate-300 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Clinic Brand & Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A6A1] to-teal-400 flex items-center justify-center text-white shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Aura<span className="text-[#16A6A1]">Care</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Integrated center of excellence for Otolaryngology (ENT) and Advanced Aesthetic Dentistry. Modern diagnostic precision, gentle care, and patient trust.
            </p>
            <div className="pt-2 text-xs text-teal-300 space-y-1">
              <p>NABH Aligned Clinical Standards</p>
              <p>Certified Class-B Sterilization Chamber</p>
            </div>
          </div>

          {/* ENT Services Quick List */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-white/10 pb-2">
              ENT Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dept-ent', 'ENT')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Ear Care &amp; Microsurgery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-ent', 'ENT')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Sinus &amp; Endoscopy (FESS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-ent', 'ENT')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Voice &amp; Vocal Cord Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-ent', 'ENT')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Digital Audiometry Booth
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-ent', 'ENT')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Pediatric ENT Care
                </button>
              </li>
            </ul>
          </div>

          {/* Dental Services Quick List */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-white/10 pb-2">
              Dental Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dept-dental', 'Dental')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Single-Sitting Root Canal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-dental', 'Dental')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Dental Implants &amp; Bone Grafts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-dental', 'Dental')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Clear Invisible Aligners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-dental', 'Dental')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Laser Teeth Whitening
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dept-dental', 'Dental')}
                  className="hover:text-teal-300 transition text-left cursor-pointer"
                >
                  Zirconia Crowns &amp; Veneers
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-white/10 pb-2">
              Clinic Contact &amp; Hours
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{clinic.address}, {clinic.city}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${clinic.phone}`} className="hover:text-white">
                  {clinic.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${clinic.email}`} className="hover:text-white">
                  {clinic.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300">
                  <p>{clinic.operatingHours.weekdays}</p>
                  <p>{clinic.operatingHours.saturday}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onOpenBooking()}
                className="bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
              >
                Book Appointment
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-xs bg-white/10 hover:bg-white/20 text-teal-200 px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Staff / Admin Portal
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {clinic.name}. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-white transition cursor-pointer underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition cursor-pointer underline-offset-2 hover:underline"
            >
              Terms &amp; Medical Disclaimer
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
            <h3 className="text-xl font-bold text-[#123B5D] mb-4">Patient Privacy &amp; Data Protection</h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                AuraCare Clinic adheres to high healthcare data privacy practices. We collect patient contact details solely to confirm appointment schedules, send SMS/WhatsApp confirmations, and maintain clinical communication.
              </p>
              <p>
                We do not sell, share, or disclose patient telephone numbers, email addresses, or clinical records to third-party marketing entities.
              </p>
              <p>
                For data deletion requests or inquiries regarding your stored appointment records, contact our privacy officer at care@auracareclinic.com.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Medical Disclaimer Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
            <h3 className="text-xl font-bold text-[#123B5D] mb-4">Terms &amp; Medical Notice</h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                Information provided on this website is for general informational and educational purposes only and does not substitute for professional in-person medical diagnosis or clinical consultation.
              </p>
              <p>
                Online appointment submissions are requests subject to physician schedule verification and clinic confirmation.
              </p>
              <p>
                In cases of acute airway compromise, heavy bleeding, or severe dental trauma, immediately visit our emergency department or call emergency services.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
