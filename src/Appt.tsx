import React, { useState, useEffect } from 'react';
import {
  Clinic,
  Department,
  Doctor,
  ServiceTreatment,
  Testimonial,
  GalleryImage,
  AppointmentRequest,
  DepartmentType,
} from './types/indext';
import { storageService } from './services/storageServicet';
import { Navbar } from './components/Navbart';
import { Hero } from './components/Herot';
import { TrustIndicators } from './components/TrustIndicatorst';
import { DepartmentCards } from './components/DepartmentCardst';
import { FeaturedTreatments } from './components/FeaturedTreatmentst';
import { DoctorCard } from './components/DoctorCardt';
import { DoctorModal } from './components/DoctorModalt';
import { ServiceModal } from './components/ServiceModalt';
import { AboutSection } from './components/AboutSectiont';
import { TestimonialsSection } from './components/TestimonialsSectiont';
import { GallerySection } from './components/GallerySectiont';
import { ContactSection } from './components/ContactSectiont';
import { Footer } from './components/Footert';
import { WhatsAppWidget } from './components/WhatsAppWidgett';
import { AppointmentModal } from './components/AppointmentModalt';
import { AdminDashboard } from './components/AdminDashboardt';
import {
  Calendar,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Stethoscope,
  Smile,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  // Application Data States
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<ServiceTreatment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeDoctorFilter, setActiveDoctorFilter] = useState<'ALL' | DepartmentType>('ALL');

  // Modal States
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [bookingDepartment, setBookingDepartment] = useState<DepartmentType | undefined>(undefined);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);

  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceTreatment | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Load all data
  const loadData = async () => {
    const c = await storageService.getClinic();
    setClinic(c);
    const depts = await storageService.getDepartments();
    setDepartments(depts);
    const docs = await storageService.getDoctors();
    setDoctors(docs);
    const srvs = await storageService.getServices();
    setServices(srvs);
    const tests = await storageService.getTestimonials(true);
    setTestimonials(tests);
    const gal = await storageService.getGallery();
    setGallery(gal);
    setIsAdminLoggedIn(storageService.isAdminLoggedIn());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Navigation Handlers
  const handleNavigate = (view: string, dept?: DepartmentType) => {
    setCurrentView(view);
    if (dept) {
      setActiveDoctorFilter(dept);
    }
  };

  const handleOpenBooking = (dept?: DepartmentType, doctorId?: string) => {
    setBookingDepartment(dept);
    setBookingDoctorId(doctorId);
    setIsAppointmentModalOpen(true);
  };

  const handleBookWithDoctor = (doc: Doctor) => {
    handleOpenBooking(doc.department, doc.id);
  };

  if (!clinic) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#123B5D]">
          <div className="w-8 h-8 rounded-full border-4 border-[#16A6A1] border-t-transparent animate-spin"></div>
          <span className="font-semibold text-sm">Loading AuraCare Clinic...</span>
        </div>
      </div>
    );
  }

  // Filter doctors for listing
  const filteredDoctors = doctors.filter((doc) => {
    if (activeDoctorFilter === 'ALL') return true;
    return doc.department === activeDoctorFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#263746]">
      {/* 1. Header & Navigation */}
      <Navbar
        clinic={clinic}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 2. Main Content Routing */}
      <main className="flex-1">
        {/* ===================== VIEW: HOME ===================== */}
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              clinic={clinic}
              onOpenBooking={handleOpenBooking}
              onExploreDepartments={() => {
                const el = document.getElementById('departments');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleNavigate('dept-ent');
              }}
            />

            {/* Trust Indicators */}
            <TrustIndicators />

            {/* Core Department Cards */}
            <DepartmentCards
              onSelectDepartment={(dept) => handleNavigate(dept === 'ENT' ? 'dept-ent' : 'dept-dental', dept)}
              onOpenBooking={(dept) => handleOpenBooking(dept)}
            />

            {/* Featured Treatments */}
            <FeaturedTreatments
              services={services.filter((s) => s.featured)}
              onSelectService={(service) => setSelectedServiceForModal(service)}
              onOpenBooking={(dept) => handleOpenBooking(dept)}
            />

            {/* Doctors Showcase */}
            <section className="py-16 md:py-24 bg-[#F2F8FB]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase mb-3">
                      <Award className="w-3.5 h-3.5" />
                      Specialist Medical Team
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D]">
                      Meet Our Specialist Doctors
                    </h2>
                    <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-xl">
                      Board-certified Otolaryngologists, Endodontists, and Orthodontists dedicated to clinical precision and gentle care.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('doctors')}
                    className="self-start md:self-auto text-xs font-bold text-[#123B5D] hover:text-[#16A6A1] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    View All Doctors &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.slice(0, 3).map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onViewProfile={(doc) => setSelectedDoctorForModal(doc)}
                      onBookWithDoctor={handleBookWithDoctor}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* About Our Clinic */}
            <AboutSection clinic={clinic} />

            {/* Patient Testimonials Carousel */}
            <TestimonialsSection testimonials={testimonials} />

            {/* Clinic Gallery */}
            <GallerySection gallery={gallery.slice(0, 6)} />

            {/* Appointment CTA Banner */}
            <section className="py-16 bg-gradient-to-r from-[#123B5D] to-[#16A6A1] text-white">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
                <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-teal-200">
                  Patient Scheduling
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Your Health Deserves Expert Attention.
                </h2>
                <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  Take the first step towards better health. Request an appointment with our ENT or Dental department today with zero advance payment and minimal wait times.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="px-8 py-3.5 rounded-xl bg-white text-[#123B5D] font-bold text-sm hover:bg-slate-100 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#16A6A1]" />
                    Book an Appointment
                  </button>
                  <a
                    href={`tel:${clinic.phone}`}
                    className="px-8 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Call: {clinic.phone}
                  </a>
                </div>
              </div>
            </section>

            {/* Contact & Map Section */}
            <ContactSection clinic={clinic} />
          </>
        )}

        {/* ===================== VIEW: ENT DEPARTMENT ===================== */}
        {currentView === 'dept-ent' && (
          <div className="space-y-16 py-8">
            {/* Department Hero Banner */}
            <div className="bg-[#F2F8FB] border-b border-slate-200/60 py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#123B5D] text-xs font-bold uppercase">
                    👂 Department of Otolaryngology
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-bold text-[#123B5D]">
                    Comprehensive Ear, Nose &amp; Throat Care
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Personalized diagnostic, medical, and surgical interventions for hearing impairments, chronic sinus congestion, voice disorders, and pediatric airway conditions with German video endoscopes.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleOpenBooking('ENT')}
                      className="px-6 py-3 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      Book ENT Consultation
                    </button>
                    <button
                      onClick={() => handleNavigate('doctors', 'ENT')}
                      className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      View ENT Doctors
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ENT Services List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#123B5D]">
                  ENT Clinical Services &amp; Diagnostic Procedures
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Select any procedure to review clinical indications, symptoms addressed, and recovery profiles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter((s) => s.department === 'ENT')
                  .map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="h-44 rounded-xl overflow-hidden bg-slate-100">
                          <img
                            src={srv.image}
                            alt={srv.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          {srv.category}
                        </span>
                        <h3 className="font-bold text-[#123B5D] text-base group-hover:text-[#16A6A1] transition-colors">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {srv.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedServiceForModal(srv)}
                          className="text-xs font-bold text-[#123B5D] hover:text-[#16A6A1] flex items-center gap-1 cursor-pointer"
                        >
                          View Details &rarr;
                        </button>
                        <button
                          onClick={() => handleOpenBooking('ENT')}
                          className="px-3 py-1.5 rounded-lg bg-[#E5F6F2] hover:bg-teal-100 text-[#16A6A1] text-xs font-semibold cursor-pointer"
                        >
                          Book Visit
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* ENT Specialists Showcase */}
            <div className="bg-[#F2F8FB] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#123B5D]">
                    Our ENT Consultants &amp; Surgeons
                  </h2>
                  <p className="text-xs text-slate-600">
                    Consult with senior otolaryngologists for airway, sinus, and hearing conditions.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors
                    .filter((d) => d.department === 'ENT')
                    .map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onViewProfile={(doc) => setSelectedDoctorForModal(doc)}
                        onBookWithDoctor={handleBookWithDoctor}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW: DENTAL DEPARTMENT ===================== */}
        {currentView === 'dept-dental' && (
          <div className="space-y-16 py-8">
            {/* Department Hero Banner */}
            <div className="bg-[#F2F8FB] border-b border-slate-200/60 py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-[#16A6A1] text-xs font-bold uppercase">
                    🦷 Department of Advanced Dentistry
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-bold text-[#123B5D]">
                    Complete Dental Care for a Healthier Smile
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Comprehensive oral health, pain-free single-sitting root canals, dental implants, clear invisible aligners, and restorative cosmetic aesthetics in an ultra-sanitized environment.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleOpenBooking('Dental')}
                      className="px-6 py-3 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Dental Consultation
                    </button>
                    <button
                      onClick={() => handleNavigate('doctors', 'Dental')}
                      className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      View Dental Specialists
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dental Treatments Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#123B5D]">
                  Comprehensive Dental Treatments
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Advanced restorative, periodontal, orthodontic and surgical dental care.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter((s) => s.department === 'Dental')
                  .map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="h-44 rounded-xl overflow-hidden bg-slate-100">
                          <img
                            src={srv.image}
                            alt={srv.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          {srv.category}
                        </span>
                        <h3 className="font-bold text-[#123B5D] text-base group-hover:text-[#16A6A1] transition-colors">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {srv.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedServiceForModal(srv)}
                          className="text-xs font-bold text-[#123B5D] hover:text-[#16A6A1] flex items-center gap-1 cursor-pointer"
                        >
                          View Details &rarr;
                        </button>
                        <button
                          onClick={() => handleOpenBooking('Dental')}
                          className="px-3 py-1.5 rounded-lg bg-[#E5F6F2] hover:bg-teal-100 text-[#16A6A1] text-xs font-semibold cursor-pointer"
                        >
                          Book Visit
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Dental Specialists Showcase */}
            <div className="bg-[#F2F8FB] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#123B5D]">
                    Our Dental Specialists &amp; Surgeons
                  </h2>
                  <p className="text-xs text-slate-600">
                    Experienced Endodontists, Orthodontists, and Periodontists committed to painless oral care.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors
                    .filter((d) => d.department === 'Dental')
                    .map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onViewProfile={(doc) => setSelectedDoctorForModal(doc)}
                        onBookWithDoctor={handleBookWithDoctor}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW: DOCTORS DIRECTORY ===================== */}
        {currentView === 'doctors' && (
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#16A6A1] uppercase tracking-wider block mb-1">
                    Specialist Medical Faculty
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#123B5D]">
                    Doctors &amp; Specialists Directory
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                    View verified qualifications, consultation hours, and directly book appointment requests.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start md:self-auto">
                  <button
                    onClick={() => setActiveDoctorFilter('ALL')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeDoctorFilter === 'ALL'
                        ? 'bg-white text-[#123B5D] shadow-xs'
                        : 'text-slate-600 hover:text-[#123B5D]'
                    }`}
                  >
                    All Specialists ({doctors.length})
                  </button>
                  <button
                    onClick={() => setActiveDoctorFilter('ENT')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeDoctorFilter === 'ENT'
                        ? 'bg-white text-[#123B5D] shadow-xs'
                        : 'text-slate-600 hover:text-[#123B5D]'
                    }`}
                  >
                    👂 ENT Specialists ({doctors.filter((d) => d.department === 'ENT').length})
                  </button>
                  <button
                    onClick={() => setActiveDoctorFilter('Dental')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeDoctorFilter === 'Dental'
                        ? 'bg-white text-[#123B5D] shadow-xs'
                        : 'text-slate-600 hover:text-[#123B5D]'
                    }`}
                  >
                    🦷 Dental Specialists ({doctors.filter((d) => d.department === 'Dental').length})
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onViewProfile={(d) => setSelectedDoctorForModal(d)}
                    onBookWithDoctor={handleBookWithDoctor}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW: SERVICES CATALOG ===================== */}
        {currentView === 'services' && (
          <div className="py-8">
            <FeaturedTreatments
              services={services}
              onSelectService={(service) => setSelectedServiceForModal(service)}
              onOpenBooking={handleOpenBooking}
            />
          </div>
        )}

        {/* ===================== VIEW: CLINIC GALLERY ===================== */}
        {currentView === 'gallery' && (
          <div className="py-8">
            <GallerySection gallery={gallery} />
          </div>
        )}

        {/* ===================== VIEW: ABOUT US ===================== */}
        {currentView === 'about' && (
          <div className="py-8">
            <AboutSection clinic={clinic} />
          </div>
        )}

        {/* ===================== VIEW: CONTACT ===================== */}
        {currentView === 'contact' && (
          <div className="py-8">
            <ContactSection clinic={clinic} />
          </div>
        )}
      </main>

      {/* 3. Floating WhatsApp & Direct Dial Widget */}
      <WhatsAppWidget clinic={clinic} />

      {/* 4. Comprehensive Footer */}
      <Footer
        clinic={clinic}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 5. Appointment Request Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        clinic={clinic}
        doctors={doctors}
        initialDepartment={bookingDepartment}
        initialDoctorId={bookingDoctorId}
        onAppointmentCreated={() => {
          loadData();
        }}
      />

      {/* 6. Doctor Profile Detail Modal */}
      <DoctorModal
        doctor={selectedDoctorForModal}
        onClose={() => setSelectedDoctorForModal(null)}
        onBookAppointment={handleBookWithDoctor}
      />

      {/* 7. Treatment Detail Modal */}
      <ServiceModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onBookTreatment={(dept) => handleOpenBooking(dept)}
      />

      {/* 8. Admin Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          loadData();
        }}
        clinic={clinic}
        onClinicUpdated={(updated) => {
          setClinic(updated);
        }}
        onDataChanged={() => {
          loadData();
        }}
      />
    </div>
  );
}
