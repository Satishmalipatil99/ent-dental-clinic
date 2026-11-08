import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Phone,
  Clock,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  Calendar,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Clinic, DepartmentType } from '../types/indext';

interface NavbarProps {
  clinic: Clinic;
  currentView: string;
  onNavigate: (view: string, department?: DepartmentType) => void;
  onOpenBooking: (department?: DepartmentType, doctorId?: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  clinic,
  currentView,
  onNavigate,
  onOpenBooking,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string, dept?: DepartmentType) => {
    setIsMobileMenuOpen(false);
    setIsDeptDropdownOpen(false);
    onNavigate(view, dept);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top emergency and operational bar */}
      <div className="bg-[#123B5D] text-white/90 text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Emergency ENT &amp; Dental Hotline:
              <a href={`tel:${clinic.emergencyPhone}`} className="text-white hover:underline font-semibold ml-1">
                {clinic.emergencyPhone}
              </a>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              {clinic.operatingHours.weekdays}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 hidden lg:inline">NABH Hospital Standards Compliant</span>
            <button
              onClick={onOpenAdmin}
              className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-teal-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Admin Management Portal"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? 'Admin Active' : 'Staff Portal'}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div
        className={`w-full bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md border-b border-slate-200/80' : 'border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Clinic Brand & Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#123B5D] to-[#16A6A1] flex items-center justify-center text-white shadow-md shadow-teal-900/10 transition-transform group-hover:scale-105">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-[#123B5D]">
                  Aura<span className="text-[#16A6A1]">Care</span>
                </span>
                <span className="bg-[#E5F6F2] text-[#16A6A1] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ENT &amp; Dental
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">
                Center for Otolaryngology &amp; Advanced Dentistry
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium text-[#263746]">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]' : 'hover:text-[#16A6A1] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'about' ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]' : 'hover:text-[#16A6A1] hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            {/* Departments Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDeptDropdownOpen(true)}
              onMouseLeave={() => setIsDeptDropdownOpen(false)}
            >
              <button
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  currentView === 'dept-ent' || currentView === 'dept-dental'
                    ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]'
                    : 'hover:text-[#16A6A1] hover:bg-slate-50'
                }`}
              >
                Departments
                <ChevronDown className={`w-4 h-4 transition-transform ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDeptDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-0 transition-all animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => handleNavClick('dept-ent', 'ENT')}
                    className="w-full px-4 py-3 text-left hover:bg-[#F2F8FB] transition flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#123B5D] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#123B5D] group-hover:text-white transition">
                      👂
                    </div>
                    <div>
                      <div className="font-semibold text-[#123B5D] text-sm">ENT Department</div>
                      <div className="text-xs text-slate-500">Ear, nose, throat &amp; sinus specialists</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => handleNavClick('dept-dental', 'Dental')}
                    className="w-full px-4 py-3 text-left hover:bg-[#F2F8FB] transition flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#16A6A1] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#16A6A1] group-hover:text-white transition">
                      🦷
                    </div>
                    <div>
                      <div className="font-semibold text-[#123B5D] text-sm">Dental Department</div>
                      <div className="text-xs text-slate-500">Implants, root canals &amp; smile design</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('doctors')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'doctors' ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]' : 'hover:text-[#16A6A1] hover:bg-slate-50'
              }`}
            >
              Our Doctors
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'services' ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]' : 'hover:text-[#16A6A1] hover:bg-slate-50'
              }`}
            >
              Treatments
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'gallery' ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]' : 'hover:text-[#16A6A1] hover:bg-slate-50'
              }`}
            >
              Clinic Gallery
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'contact' ? 'text-[#16A6A1] font-semibold bg-[#E5F6F2]' : 'hover:text-[#16A6A1] hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action: Book Appointment Button & Call */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={`tel:${clinic.phone}`}
              className="text-xs font-semibold text-[#123B5D] hover:text-[#16A6A1] transition flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-[#16A6A1]/40"
            >
              <Phone className="w-3.5 h-3.5 text-[#16A6A1]" />
              <span className="hidden xl:inline">Call:</span> {clinic.phone}
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="bg-[#16A6A1] hover:bg-[#11817d] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-[#16A6A1]/20 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => onOpenBooking()}
              className="bg-[#16A6A1] text-white px-3 py-2 rounded-lg text-xs font-semibold sm:hidden"
            >
              Book
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${
                currentView === 'home' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${
                currentView === 'about' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            <div className="border-y border-slate-100 py-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-1">Departments</div>
              <button
                onClick={() => handleNavClick('dept-ent', 'ENT')}
                className={`w-full px-4 py-2.5 rounded-lg text-left text-sm flex items-center justify-between ${
                  currentView === 'dept-ent' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>👂 ENT (Ear, Nose &amp; Throat)</span>
                <span className="text-xs text-slate-400">View Services &rarr;</span>
              </button>
              <button
                onClick={() => handleNavClick('dept-dental', 'Dental')}
                className={`w-full px-4 py-2.5 rounded-lg text-left text-sm flex items-center justify-between ${
                  currentView === 'dept-dental' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🦷 Dental Care &amp; Orthodontics</span>
                <span className="text-xs text-slate-400">View Services &rarr;</span>
              </button>
            </div>

            <button
              onClick={() => handleNavClick('doctors')}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${
                currentView === 'doctors' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Our Doctors
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${
                currentView === 'services' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              All Treatments &amp; Procedures
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${
                currentView === 'gallery' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Clinic Facilities &amp; Gallery
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${
                currentView === 'contact' ? 'bg-[#E5F6F2] text-[#16A6A1] font-semibold' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Contact &amp; Location
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="px-4 py-2.5 rounded-lg text-left text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#16A6A1] text-white py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2 shadow-md shadow-teal-700/20"
            >
              <Calendar className="w-4 h-4" />
              Request Appointment Online
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
