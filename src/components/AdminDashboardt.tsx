import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  CalendarCheck,
  UserCheck,
  Stethoscope,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  Clinic,
  Doctor,
  ServiceTreatment,
  AppointmentRequest,
  AppointmentStatus,
  DepartmentType,
  DashboardStats,
  GalleryImage,
  Testimonial,
} from '../types/indext';
import { storageService } from '../services/storageServicet';
import { AVAILABLE_TIME_SLOTS, DAYS_OF_WEEK } from '../lib/appointmentLogict';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: Clinic;
  onClinicUpdated: (updated: Clinic) => void;
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  clinic,
  onClinicUpdated,
  onDataChanged,
}) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@auracare.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  type TabType = 'overview' | 'appointments' | 'doctors' | 'services' | 'gallery' | 'testimonials' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Loaded Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<ServiceTreatment[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Appointment Filters
  const [apptStatusFilter, setApptStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [apptDeptFilter, setApptDeptFilter] = useState<DepartmentType | 'ALL'>('ALL');
  const [apptSearch, setApptSearch] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<AppointmentRequest | null>(null);
  const [apptAdminNoteInput, setApptAdminNoteInput] = useState('');

  // Doctor Form Modal / State
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docDept, setDocDept] = useState<DepartmentType>('ENT');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docExp, setDocExp] = useState(10);
  const [docHours, setDocHours] = useState('');
  const [docImg, setDocImg] = useState('');
  const [docBio, setDocBio] = useState('');
  const [docConsultationDays, setDocConsultationDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [docAvailableSlots, setDocAvailableSlots] = useState<string[]>([...AVAILABLE_TIME_SLOTS]);

  // Service Form Modal / State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceTreatment | null>(null);
  const [srvTitle, setSrvTitle] = useState('');
  const [srvDept, setSrvDept] = useState<DepartmentType>('ENT');
  const [srvCategory, setSrvCategory] = useState('');
  const [srvShortDesc, setSrvShortDesc] = useState('');
  const [srvFullDesc, setSrvFullDesc] = useState('');
  const [srvProcTime, setSrvProcTime] = useState('');
  const [srvRecTime, setSrvRecTime] = useState('');
  const [srvImg, setSrvImg] = useState('');

  // Gallery Add State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryImage['category']>('ENT Facilities');
  const [galUrl, setGalUrl] = useState('');
  const [galDesc, setGalDesc] = useState('');

  // Clinic Settings Form
  const [clinicSettingsForm, setClinicSettingsForm] = useState<Clinic>(clinic);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Load status on mount
  useEffect(() => {
    setIsLoggedIn(storageService.isAdminLoggedIn());
    setClinicSettingsForm(clinic);
  }, [isOpen, clinic]);

  // Fetch data when logged in
  const refreshAdminData = async () => {
    const s = await storageService.getDashboardStats();
    setStats(s);
    const appts = await storageService.getAppointments({
      department: apptDeptFilter,
      status: apptStatusFilter,
      search: apptSearch,
    });
    setAppointments(appts);
    const docs = await storageService.getAllDoctorsAdmin();
    setDoctors(docs);
    const srvs = await storageService.getAllServicesAdmin();
    setServices(srvs);
    const gal = await storageService.getGallery();
    setGallery(gal);
    const test = await storageService.getTestimonials(false);
    setTestimonials(test);
  };

  useEffect(() => {
    if (isLoggedIn && isOpen) {
      refreshAdminData();
    }
  }, [isLoggedIn, isOpen, apptStatusFilter, apptDeptFilter, apptSearch]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = storageService.loginAdmin(loginEmail, loginPassword);
    if (success) {
      setIsLoggedIn(true);
      refreshAdminData();
    } else {
      setLoginError('Invalid credentials. Use demo email: admin@auracare.com & pass: admin123');
    }
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsLoggedIn(false);
    setSelectedAppt(null);
  };

  // Appointment Status Updates
  const handleUpdateApptStatus = async (id: string, newStatus: AppointmentStatus) => {
    await storageService.updateAppointmentStatus(id, newStatus, apptAdminNoteInput || undefined);
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: apptAdminNoteInput }),
      });
    } catch (e) {
      // Ignored
    }
    await refreshAdminData();
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt((prev) => (prev ? { ...prev, status: newStatus, adminNotes: apptAdminNoteInput } : null));
    }
    onDataChanged();
  };

  // Doctor CRUD
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocName('');
    setDocDept('ENT');
    setDocQual('MBBS, MS (ENT)');
    setDocSpec('Senior Consultant ENT Surgeon');
    setDocExp(10);
    setDocHours('10:00 AM – 02:00 PM, 04:00 PM – 07:00 PM');
    setDocImg('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80');
    setDocBio('Experienced specialist dedicated to minimally invasive care and gentle patient consultation.');
    setDocConsultationDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setDocAvailableSlots([
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 01:00 PM',
      '04:00 PM - 05:00 PM',
      '05:00 PM - 06:00 PM',
      '06:00 PM - 07:00 PM',
    ]);
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setDocName(doc.name);
    setDocDept(doc.department);
    setDocQual(doc.qualification);
    setDocSpec(doc.specialization);
    setDocExp(doc.experienceYears);
    setDocHours(doc.consultationHours);
    setDocImg(doc.image);
    setDocBio(doc.bio);
    setDocConsultationDays(doc.consultationDays && doc.consultationDays.length > 0 ? doc.consultationDays : ['Monday', 'Wednesday', 'Friday']);
    setDocAvailableSlots(doc.availableTimeSlots && doc.availableTimeSlots.length > 0 ? doc.availableTimeSlots : [...AVAILABLE_TIME_SLOTS]);
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      await storageService.updateDoctor(editingDoctor.id, {
        name: docName,
        department: docDept,
        qualification: docQual,
        specialization: docSpec,
        experienceYears: Number(docExp),
        consultationHours: docHours,
        image: docImg,
        bio: docBio,
        consultationDays: docConsultationDays,
        availableTimeSlots: docAvailableSlots,
      });
    } else {
      await storageService.addDoctor({
        name: docName,
        department: docDept,
        qualification: docQual,
        specialization: docSpec,
        experienceYears: Number(docExp),
        consultationHours: docHours,
        image: docImg,
        bio: docBio,
        consultationDays: docConsultationDays,
        availableTimeSlots: docAvailableSlots,
        languages: ['English', 'Hindi'],
        isPublished: true,
        featured: false,
      });
    }
    setIsDoctorModalOpen(false);
    await refreshAdminData();
    onDataChanged();
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this doctor profile?')) {
      await storageService.deleteDoctor(id);
      await refreshAdminData();
      onDataChanged();
    }
  };

  const handleToggleDoctorPublish = async (doc: Doctor) => {
    await storageService.updateDoctor(doc.id, { isPublished: !doc.isPublished });
    await refreshAdminData();
    onDataChanged();
  };

  // Services CRUD
  const handleOpenAddService = () => {
    setEditingService(null);
    setSrvTitle('');
    setSrvDept('ENT');
    setSrvCategory('General Procedures');
    setSrvShortDesc('');
    setSrvFullDesc('');
    setSrvProcTime('30 mins');
    setSrvRecTime('Immediate');
    setSrvImg('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: ServiceTreatment) => {
    setEditingService(srv);
    setSrvTitle(srv.title);
    setSrvDept(srv.department);
    setSrvCategory(srv.category);
    setSrvShortDesc(srv.shortDescription);
    setSrvFullDesc(srv.fullDescription);
    setSrvProcTime(srv.procedureTime);
    setSrvRecTime(srv.recoveryTime);
    setSrvImg(srv.image);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await storageService.updateService(editingService.id, {
        title: srvTitle,
        department: srvDept,
        category: srvCategory,
        shortDescription: srvShortDesc,
        fullDescription: srvFullDesc,
        procedureTime: srvProcTime,
        recoveryTime: srvRecTime,
        image: srvImg,
      });
    } else {
      await storageService.addService({
        title: srvTitle,
        department: srvDept,
        category: srvCategory,
        shortDescription: srvShortDesc,
        fullDescription: srvFullDesc,
        symptomsAddressed: ['Routine screening & care'],
        procedureTime: srvProcTime,
        recoveryTime: srvRecTime,
        image: srvImg,
        isPublished: true,
        featured: false,
      });
    }
    setIsServiceModalOpen(false);
    await refreshAdminData();
    onDataChanged();
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Delete this service procedure?')) {
      await storageService.deleteService(id);
      await refreshAdminData();
      onDataChanged();
    }
  };

  const handleToggleServicePublish = async (srv: ServiceTreatment) => {
    await storageService.updateService(srv.id, { isPublished: !srv.isPublished });
    await refreshAdminData();
    onDataChanged();
  };

  // Gallery CRUD
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    await storageService.addGalleryImage({
      title: galTitle,
      category: galCategory,
      imageUrl: galUrl,
      description: galDesc,
    });
    setIsGalleryModalOpen(false);
    setGalTitle('');
    setGalUrl('');
    setGalDesc('');
    await refreshAdminData();
    onDataChanged();
  };

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('Delete this photo?')) {
      await storageService.deleteGalleryImage(id);
      await refreshAdminData();
      onDataChanged();
    }
  };

  // Save Clinic Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await storageService.updateClinic(clinicSettingsForm);
    onClinicUpdated(updated);
    setSaveSuccessMsg('Clinic settings updated and live across the website!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all doctors, appointments, and clinic settings to demonstration defaults?')) {
      storageService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16A6A1] flex items-center justify-center font-bold text-white shadow-xs">
              AC
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">AuraCare Clinic Management Portal</h2>
              <p className="text-xs text-teal-200">Appointments, Specialists &amp; Content Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------- LOGIN SCREEN IF NOT AUTHENTICATED ---------------- */}
        {!isLoggedIn ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#F2F8FB]">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#E5F6F2] text-[#16A6A1] flex items-center justify-center mx-auto shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#123B5D]">Administrator Sign-In</h3>
                <p className="text-xs text-slate-500">
                  Authorized medical staff and clinic coordinators only.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A6A1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A6A1]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-[#123B5D]">
                  <p className="font-semibold">Default Demonstration Credentials:</p>
                  <p className="text-slate-600 mt-0.5">Email: <code>admin@auracare.com</code></p>
                  <p className="text-slate-600">Password: <code>admin123</code></p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#123B5D] hover:bg-[#0b253c] text-white text-sm font-bold shadow-md transition cursor-pointer"
                >
                  Sign In to Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ---------------- AUTHENTICATED ADMIN INTERFACE ---------------- */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1.5 overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'appointments'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4" />
                  Appointments
                </span>
                {stats && stats.pendingRequests > 0 && (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {stats.pendingRequests}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('doctors')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  activeTab === 'doctors'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Doctors &amp; Specialists
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Clinical Services
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Clinic Gallery
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Testimonials
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                Website Settings
              </button>

              <div className="pt-6 border-t border-slate-200">
                <button
                  onClick={handleResetDefaults}
                  className="w-full text-[11px] text-slate-500 hover:text-red-600 p-2 text-left flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Demo Data
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B5D]">Clinic Dashboard Overview</h3>
                    <p className="text-xs text-slate-500">Live operational metrics and appointment summaries</p>
                  </div>

                  {/* Metrics Cards */}
                  {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Requests</span>
                        <div className="text-2xl font-bold text-[#123B5D] mt-1">{stats.totalAppointments}</div>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">All time registrations</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/30">
                        <span className="text-xs font-bold text-amber-700 uppercase">Pending Review</span>
                        <div className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingRequests}</div>
                        <span className="text-[11px] text-amber-600 mt-0.5 block">Requires phone confirmation</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-xs bg-teal-50/30">
                        <span className="text-xs font-bold text-teal-700 uppercase">Confirmed</span>
                        <div className="text-2xl font-bold text-teal-700 mt-1">{stats.confirmedAppointments}</div>
                        <span className="text-[11px] text-teal-600 mt-0.5 block">Slot allotted &amp; verified</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs font-bold text-slate-400 uppercase">Department Ratio</span>
                        <div className="text-sm font-bold text-[#123B5D] mt-2">
                          👂 ENT: {stats.entAppointments} | 🦷 Dental: {stats.dentalAppointments}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">Active Doctors: {stats.totalDoctors}</span>
                      </div>
                    </div>
                  )}

                  {/* Recent Appointments Preview */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#123B5D] text-sm">Recent Appointment Requests</h4>
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="text-xs font-semibold text-[#16A6A1] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View All Appointments &rarr;
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                            <th className="pb-2">Reference</th>
                            <th className="pb-2">Patient</th>
                            <th className="pb-2">Mobile</th>
                            <th className="pb-2">Dept</th>
                            <th className="pb-2">Preferred Date</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {appointments.slice(0, 5).map((appt) => (
                            <tr key={appt.id} className="hover:bg-slate-50">
                              <td className="py-2.5 font-mono font-bold text-[#123B5D]">{appt.referenceNumber}</td>
                              <td className="py-2.5 font-semibold text-slate-800">{appt.patientName}</td>
                              <td className="py-2.5 text-slate-600">{appt.mobileNumber}</td>
                              <td className="py-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {appt.department}
                                </span>
                              </td>
                              <td className="py-2.5 text-slate-600">{appt.preferredDate}</td>
                              <td className="py-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    appt.status === 'Confirmed'
                                      ? 'bg-teal-100 text-teal-800'
                                      : appt.status === 'Pending'
                                      ? 'bg-amber-100 text-amber-800'
                                      : appt.status === 'Completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {appt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPOINTMENT MANAGEMENT */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#123B5D]">Appointment Management</h3>
                      <p className="text-xs text-slate-500">Filter, verify and update patient appointment statuses</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={apptSearch}
                          onChange={(e) => setApptSearch(e.target.value)}
                          placeholder="Search patient / ref..."
                          className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
                        />
                      </div>

                      <select
                        value={apptDeptFilter}
                        onChange={(e) => setApptDeptFilter(e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="ALL">All Depts</option>
                        <option value="ENT">ENT</option>
                        <option value="Dental">Dental</option>
                      </select>

                      <select
                        value={apptStatusFilter}
                        onChange={(e) => setApptStatusFilter(e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto max-h-[60vh]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 sticky top-0 z-10 text-slate-500 uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Ref #</th>
                            <th className="py-3 px-4">Patient Name</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">Dept &amp; Doctor</th>
                            <th className="py-3 px-4">Schedule</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {appointments.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">
                                No appointments found matching the selected filters.
                              </td>
                            </tr>
                          ) : (
                            appointments.map((appt) => (
                              <tr key={appt.id} className="hover:bg-slate-50/80">
                                <td className="py-3 px-4 font-mono font-bold text-[#123B5D]">
                                  {appt.referenceNumber}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-slate-800">{appt.patientName}</div>
                                  {appt.notes && (
                                    <div className="text-[11px] text-slate-500 italic truncate max-w-xs">
                                      "{appt.notes}"
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div>{appt.mobileNumber}</div>
                                  {appt.email && <div className="text-[11px] text-slate-400">{appt.email}</div>}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-semibold text-[#123B5D]">{appt.department}</span>
                                  <div className="text-[11px] text-slate-500">{appt.doctorName}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-medium text-slate-700">{appt.preferredDate}</div>
                                  <div className="text-[11px] text-slate-400">{appt.preferredTimeSlot}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                      appt.status === 'Confirmed'
                                        ? 'bg-teal-100 text-teal-800'
                                        : appt.status === 'Pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : appt.status === 'Completed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {appt.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right space-x-1">
                                  {appt.status === 'Pending' && (
                                    <button
                                      onClick={() => handleUpdateApptStatus(appt.id, 'Confirmed')}
                                      className="px-2 py-1 rounded bg-[#16A6A1] text-white text-[11px] font-semibold hover:bg-teal-700 transition cursor-pointer"
                                      title="Confirm Appointment"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {appt.status === 'Confirmed' && (
                                    <button
                                      onClick={() => handleUpdateApptStatus(appt.id, 'Completed')}
                                      className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition cursor-pointer"
                                      title="Mark Completed"
                                    >
                                      Complete
                                    </button>
                                  )}
                                  {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                                    <button
                                      onClick={() => handleUpdateApptStatus(appt.id, 'Cancelled')}
                                      className="px-2 py-1 rounded bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-700 text-[11px] transition cursor-pointer"
                                      title="Cancel Appointment"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCTORS MANAGEMENT */}
              {activeTab === 'doctors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#123B5D]">Doctor &amp; Specialist Directory</h3>
                      <p className="text-xs text-slate-500">Manage physician credentials, timings, and publishing</p>
                    </div>
                    <button
                      onClick={handleOpenAddDoctor}
                      className="px-3.5 py-2 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Doctor
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-[#16A6A1] uppercase tracking-wider block">
                              {doc.department}
                            </span>
                            <h4 className="font-bold text-[#123B5D] text-sm truncate">{doc.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{doc.specialization}</p>
                            <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                                🗓️ {doc.consultationDays?.length || 0} Days
                              </span>
                              <span className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-semibold">
                                ⏰ {doc.availableTimeSlots?.length || '10'} Slots
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleToggleDoctorPublish(doc)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                              doc.isPublished
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {doc.isPublished ? '● Published' : '○ Draft'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditDoctor(doc)}
                              className="text-slate-600 hover:text-[#123B5D] p-1 cursor-pointer"
                              title="Edit Doctor"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doc.id)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CLINICAL SERVICES MANAGEMENT */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#123B5D]">Clinical Procedures &amp; Services</h3>
                      <p className="text-xs text-slate-500">Manage ENT and Dental clinical treatments</p>
                    </div>
                    <button
                      onClick={handleOpenAddService}
                      className="px-3.5 py-2 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Service
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4"
                      >
                        <img
                          src={srv.image}
                          alt={srv.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#123B5D]">
                              {srv.department}
                            </span>
                            <span className="text-[10px] text-slate-400">{srv.category}</span>
                          </div>
                          <h4 className="font-bold text-[#123B5D] text-sm truncate">{srv.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{srv.shortDescription}</p>

                          <div className="pt-2 flex items-center justify-between">
                            <button
                              onClick={() => handleToggleServicePublish(srv)}
                              className={`text-[10px] font-semibold cursor-pointer ${
                                srv.isPublished ? 'text-teal-600' : 'text-slate-400'
                              }`}
                            >
                              {srv.isPublished ? 'Published' : 'Hidden'}
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditService(srv)}
                                className="text-slate-500 hover:text-slate-800 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(srv.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GALLERY MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#123B5D]">Clinic Photographs &amp; Gallery</h3>
                      <p className="text-xs text-slate-500">Upload facility images, operatory suites, and infrastructure</p>
                    </div>
                    <button
                      onClick={() => setIsGalleryModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map((img) => (
                      <div
                        key={img.id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 relative group"
                      >
                        <img src={img.imageUrl} alt={img.title} className="w-full h-36 object-cover" />
                        <div className="p-3">
                          <span className="text-[10px] font-bold text-[#16A6A1]">{img.category}</span>
                          <h4 className="text-xs font-bold text-[#123B5D] truncate">{img.title}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(img.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 transition cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: TESTIMONIALS MANAGEMENT */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B5D]">Patient Testimonials</h3>
                    <p className="text-xs text-slate-500">Review authorized feedback for public website publication</p>
                  </div>

                  <div className="space-y-3">
                    {testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#123B5D] text-sm">{t.patientName}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {t.department} – {t.treatmentName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 italic">"{t.feedback}"</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">Rating: {t.rating} ★ | Date: {t.date}</span>
                        </div>
                        <button
                          onClick={async () => {
                            await storageService.updateTestimonial(t.id, { isPublished: !t.isPublished });
                            await refreshAdminData();
                            onDataChanged();
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            t.isPublished ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {t.isPublished ? 'Published' : 'Hidden'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: WEBSITE SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B5D]">Clinic Information &amp; Web Settings</h3>
                    <p className="text-xs text-slate-500">
                      Configure contact numbers, Google Maps location, and headline copy
                    </p>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-3.5 rounded-xl bg-teal-50 text-teal-800 text-xs flex items-center gap-2 border border-teal-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinic Name</label>
                      <input
                        type="text"
                        value={clinicSettingsForm.name}
                        onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reception Phone</label>
                        <input
                          type="text"
                          value={clinicSettingsForm.phone}
                          onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number</label>
                        <input
                          type="text"
                          value={clinicSettingsForm.whatsapp}
                          onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, whatsapp: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Emergency Phone</label>
                        <input
                          type="text"
                          value={clinicSettingsForm.emergencyPhone}
                          onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, emergencyPhone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={clinicSettingsForm.email}
                          onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinic Physical Address</label>
                      <input
                        type="text"
                        value={clinicSettingsForm.address}
                        onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Maps Embed URL</label>
                      <input
                        type="text"
                        value={clinicSettingsForm.googleMapsUrl}
                        onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, googleMapsUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Main Heading</label>
                      <input
                        type="text"
                        value={clinicSettingsForm.heroHeading}
                        onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, heroHeading: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Subheading</label>
                      <textarea
                        rows={2}
                        value={clinicSettingsForm.heroSubheading}
                        onChange={(e) => setClinicSettingsForm({ ...clinicSettingsForm, heroSubheading: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#16A6A1]"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        Save All Website Settings
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Doctor Add/Edit Submodal */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDoctor}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#123B5D]">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Specialist'}
              </h4>
              <button
                type="button"
                onClick={() => setIsDoctorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Doctor Full Name</label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Dr. Full Name"
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Department</label>
                <select
                  value={docDept}
                  onChange={(e) => setDocDept(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
                >
                  <option value="ENT">ENT</option>
                  <option value="Dental">Dental</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Years Experience</label>
                <input
                  type="number"
                  value={docExp}
                  onChange={(e) => setDocExp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Specialization</label>
              <input
                type="text"
                required
                value={docSpec}
                onChange={(e) => setDocSpec(e.target.value)}
                placeholder="e.g. Endodontist &amp; Smile Architect"
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Degrees &amp; Qualifications</label>
              <input
                type="text"
                required
                value={docQual}
                onChange={(e) => setDocQual(e.target.value)}
                placeholder="e.g. BDS, MDS (Conservative Dentistry)"
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Consultation Timings Text</label>
              <input
                type="text"
                required
                value={docHours}
                onChange={(e) => setDocHours(e.target.value)}
                placeholder="e.g. 10:00 AM – 02:00 PM, 04:00 PM – 07:00 PM"
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            {/* DOCTOR AVAILABILITY: CONSULTATION DAYS */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">Consultation Days</label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDocConsultationDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}
                    className="text-[#16A6A1] hover:underline cursor-pointer"
                  >
                    Mon–Fri
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setDocConsultationDays([...DAYS_OF_WEEK])}
                    className="text-[#16A6A1] hover:underline cursor-pointer"
                  >
                    All 7
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setDocConsultationDays([])}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = docConsultationDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => {
                        if (isSelected) setDocConsultationDays(docConsultationDays.filter((d) => d !== day));
                        else setDocConsultationDays([...docConsultationDays, day]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#123B5D] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 pt-0.5">
                Patients will see doctor availability status based on these consultation days.
              </p>
            </div>

            {/* DOCTOR AVAILABILITY: PREFERRED TIME SLOTS */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Available Time Slots</label>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    {docAvailableSlots.length} Active Slots
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDocAvailableSlots([...AVAILABLE_TIME_SLOTS])}
                    className="text-[#16A6A1] hover:underline cursor-pointer"
                  >
                    All Slots
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setDocAvailableSlots(AVAILABLE_TIME_SLOTS.slice(0, 4))}
                    className="text-[#16A6A1] hover:underline cursor-pointer"
                  >
                    Morning
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setDocAvailableSlots(AVAILABLE_TIME_SLOTS.slice(4))}
                    className="text-[#16A6A1] hover:underline cursor-pointer"
                  >
                    Evening
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setDocAvailableSlots([])}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1.5 max-h-48 overflow-y-auto">
                {AVAILABLE_TIME_SLOTS.map((slot) => {
                  const isSlotActive = docAvailableSlots.includes(slot);
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => {
                        if (isSlotActive) setDocAvailableSlots(docAvailableSlots.filter((s) => s !== slot));
                        else setDocAvailableSlots([...docAvailableSlots, slot]);
                      }}
                      className={`p-2 rounded-lg text-left text-[11px] font-medium transition cursor-pointer flex items-center justify-between border ${
                        isSlotActive
                          ? 'bg-teal-50/80 border-[#16A6A1] text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{slot}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 ml-1 ${
                          isSlotActive ? 'bg-[#16A6A1] text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSlotActive ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 pt-0.5">
                These slots dynamically populate the 'Preferred Time Slot' dropdown for this doctor on the appointment request form.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Profile Image URL</label>
              <input
                type="url"
                required
                value={docImg}
                onChange={(e) => setDocImg(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Biography</label>
              <textarea
                rows={3}
                value={docBio}
                onChange={(e) => setDocBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDoctorModalOpen(false)}
                className="px-4 py-2 rounded-lg border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#16A6A1] text-white text-xs font-bold"
              >
                Save Doctor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Service Add/Edit Submodal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveService}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#123B5D]">
                {editingService ? 'Edit Treatment' : 'Add New Clinical Treatment'}
              </h4>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Treatment Title</label>
              <input
                type="text"
                required
                value={srvTitle}
                onChange={(e) => setSrvTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Department</label>
                <select
                  value={srvDept}
                  onChange={(e) => setSrvDept(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
                >
                  <option value="ENT">ENT</option>
                  <option value="Dental">Dental</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  required
                  value={srvCategory}
                  onChange={(e) => setSrvCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Short Summary</label>
              <textarea
                rows={2}
                required
                value={srvShortDesc}
                onChange={(e) => setSrvShortDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Full Clinical Overview</label>
              <textarea
                rows={3}
                required
                value={srvFullDesc}
                onChange={(e) => setSrvFullDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Procedure Time</label>
                <input
                  type="text"
                  value={srvProcTime}
                  onChange={(e) => setSrvProcTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Recovery Time</label>
                <input
                  type="text"
                  value={srvRecTime}
                  onChange={(e) => setSrvRecTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Image URL</label>
              <input
                type="url"
                required
                value={srvImg}
                onChange={(e) => setSrvImg(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 rounded-lg border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#16A6A1] text-white text-xs font-bold"
              >
                Save Treatment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Add Submodal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveGallery}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#123B5D]">Add Clinic Photograph</h4>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Photo Title</label>
              <input
                type="text"
                required
                value={galTitle}
                onChange={(e) => setGalTitle(e.target.value)}
                placeholder="e.g. Endoscopy Console"
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={galCategory}
                onChange={(e) => setGalCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
              >
                <option value="ENT Facilities">ENT Facilities</option>
                <option value="Dental Operatory">Dental Operatory</option>
                <option value="Reception & Lounge">Reception &amp; Lounge</option>
                <option value="Clinic Infrastructure">Clinic Infrastructure</option>
                <option value="Advanced Equipment">Advanced Equipment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Image URL</label>
              <input
                type="url"
                required
                value={galUrl}
                onChange={(e) => setGalUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Description</label>
              <textarea
                rows={2}
                value={galDesc}
                onChange={(e) => setGalDesc(e.target.value)}
                placeholder="Brief description of the facility..."
                className="w-full px-3 py-2 rounded-lg border text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="px-4 py-2 rounded-lg border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#16A6A1] text-white text-xs font-bold"
              >
                Add Image
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
