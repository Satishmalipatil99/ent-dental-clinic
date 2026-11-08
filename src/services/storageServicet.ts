import {
  Clinic,
  Department,
  Doctor,
  ServiceTreatment,
  Testimonial,
  GalleryImage,
  AppointmentRequest,
  AppointmentStatus,
  DepartmentType,
  DashboardStats,
} from '../types/indext';
import {
  INITIAL_CLINIC,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_GALLERY,
  INITIAL_APPOINTMENTS,
} from './clinicDatat';
import {
  generateReferenceNumber,
  calculateDashboardStats,
} from '../lib/appointmentLogict';

const STORAGE_KEYS = {
  CLINIC: 'auracare_clinic',
  DEPARTMENTS: 'auracare_departments',
  DOCTORS: 'auracare_doctors',
  SERVICES: 'auracare_services',
  APPOINTMENTS: 'auracare_appointments',
  TESTIMONIALS: 'auracare_testimonials',
  GALLERY: 'auracare_gallery',
  ADMIN_AUTH: 'auracare_admin_auth',
};

// Helper for localStorage
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}`, e);
  }
}

// Data Service API
export const storageService = {
  // CLINIC SETTINGS
  async getClinic(): Promise<Clinic> {
    return getStored<Clinic>(STORAGE_KEYS.CLINIC, INITIAL_CLINIC);
  },

  async updateClinic(data: Partial<Clinic>): Promise<Clinic> {
    const current = await this.getClinic();
    const updated = { ...current, ...data };
    setStored(STORAGE_KEYS.CLINIC, updated);
    return updated;
  },

  // DEPARTMENTS
  async getDepartments(): Promise<Department[]> {
    return getStored<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  async getDepartmentByType(type: DepartmentType): Promise<Department | undefined> {
    const departments = await this.getDepartments();
    return departments.find((d) => d.type === type);
  },

  // DOCTORS
  async getDoctors(options?: { department?: DepartmentType; publishedOnly?: boolean }): Promise<Doctor[]> {
    let doctors = getStored<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    if (options?.publishedOnly !== false) {
      doctors = doctors.filter((d) => d.isPublished);
    }
    if (options?.department) {
      doctors = doctors.filter((d) => d.department === options.department);
    }
    return doctors;
  },

  async getAllDoctorsAdmin(): Promise<Doctor[]> {
    return getStored<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    const doctors = await this.getAllDoctorsAdmin();
    return doctors.find((d) => d.id === id);
  },

  async addDoctor(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
    const doctors = await this.getAllDoctorsAdmin();
    const newDoctor: Doctor = {
      ...doctor,
      id: `doc-${Date.now()}`,
    };
    const updated = [newDoctor, ...doctors];
    setStored(STORAGE_KEYS.DOCTORS, updated);
    return newDoctor;
  },

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    const doctors = await this.getAllDoctorsAdmin();
    const index = doctors.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Doctor not found');
    const updatedDoctor = { ...doctors[index], ...updates };
    doctors[index] = updatedDoctor;
    setStored(STORAGE_KEYS.DOCTORS, doctors);
    return updatedDoctor;
  },

  async deleteDoctor(id: string): Promise<boolean> {
    const doctors = await this.getAllDoctorsAdmin();
    const filtered = doctors.filter((d) => d.id !== id);
    setStored(STORAGE_KEYS.DOCTORS, filtered);
    return true;
  },

  // SERVICES
  async getServices(options?: { department?: DepartmentType; publishedOnly?: boolean }): Promise<ServiceTreatment[]> {
    let services = getStored<ServiceTreatment[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (options?.publishedOnly !== false) {
      services = services.filter((s) => s.isPublished);
    }
    if (options?.department) {
      services = services.filter((s) => s.department === options.department);
    }
    return services;
  },

  async getAllServicesAdmin(): Promise<ServiceTreatment[]> {
    return getStored<ServiceTreatment[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async getServiceById(id: string): Promise<ServiceTreatment | undefined> {
    const services = await this.getAllServicesAdmin();
    return services.find((s) => s.id === id);
  },

  async addService(service: Omit<ServiceTreatment, 'id'>): Promise<ServiceTreatment> {
    const services = await this.getAllServicesAdmin();
    const newService: ServiceTreatment = {
      ...service,
      id: `srv-${Date.now()}`,
    };
    const updated = [newService, ...services];
    setStored(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async updateService(id: string, updates: Partial<ServiceTreatment>): Promise<ServiceTreatment> {
    const services = await this.getAllServicesAdmin();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Service not found');
    const updatedService = { ...services[index], ...updates };
    services[index] = updatedService;
    setStored(STORAGE_KEYS.SERVICES, services);
    return updatedService;
  },

  async deleteService(id: string): Promise<boolean> {
    const services = await this.getAllServicesAdmin();
    const filtered = services.filter((s) => s.id !== id);
    setStored(STORAGE_KEYS.SERVICES, filtered);
    return true;
  },

  // APPOINTMENTS
  async getAppointments(filters?: {
    department?: DepartmentType | 'ALL';
    status?: AppointmentStatus | 'ALL';
    search?: string;
    date?: string;
  }): Promise<AppointmentRequest[]> {
    let appointments = getStored<AppointmentRequest[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);

    if (filters) {
      if (filters.department && filters.department !== 'ALL') {
        appointments = appointments.filter((a) => a.department === filters.department);
      }
      if (filters.status && filters.status !== 'ALL') {
        appointments = appointments.filter((a) => a.status === filters.status);
      }
      if (filters.date) {
        appointments = appointments.filter((a) => a.preferredDate === filters.date);
      }
      if (filters.search && filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        appointments = appointments.filter(
          (a) =>
            a.patientName.toLowerCase().includes(query) ||
            a.mobileNumber.includes(query) ||
            a.referenceNumber.toLowerCase().includes(query) ||
            (a.email && a.email.toLowerCase().includes(query)) ||
            (a.doctorName && a.doctorName.toLowerCase().includes(query))
        );
      }
    }

    // Sort newest first
    return appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAppointmentByReference(ref: string): Promise<AppointmentRequest | undefined> {
    const appointments = getStored<AppointmentRequest[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    return appointments.find((a) => a.referenceNumber.toUpperCase() === ref.trim().toUpperCase());
  },

  async createAppointment(
    data: Omit<AppointmentRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<AppointmentRequest> {
    const appointments = getStored<AppointmentRequest[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const referenceNumber = generateReferenceNumber('AC');
    const now = new Date().toISOString();

    const newAppointment: AppointmentRequest = {
      ...data,
      id: `appt-${Date.now()}`,
      referenceNumber,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newAppointment, ...appointments];
    setStored(STORAGE_KEYS.APPOINTMENTS, updated);
    return newAppointment;
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    adminNotes?: string,
    doctorId?: string,
    doctorName?: string
  ): Promise<AppointmentRequest> {
    const appointments = getStored<AppointmentRequest[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');

    const updated: AppointmentRequest = {
      ...appointments[index],
      status,
      adminNotes: adminNotes !== undefined ? adminNotes : appointments[index].adminNotes,
      doctorId: doctorId || appointments[index].doctorId,
      doctorName: doctorName || appointments[index].doctorName,
      updatedAt: new Date().toISOString(),
    };

    appointments[index] = updated;
    setStored(STORAGE_KEYS.APPOINTMENTS, appointments);
    return updated;
  },

  // TESTIMONIALS
  async getTestimonials(approvedOnly: boolean = true): Promise<Testimonial[]> {
    let testimonials = getStored<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    if (approvedOnly) {
      testimonials = testimonials.filter((t) => t.isApproved && t.isPublished);
    }
    return testimonials;
  },

  async addTestimonial(data: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const list = getStored<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const newTestimonial: Testimonial = {
      ...data,
      id: `test-${Date.now()}`,
    };
    const updated = [newTestimonial, ...list];
    setStored(STORAGE_KEYS.TESTIMONIALS, updated);
    return newTestimonial;
  },

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    const list = getStored<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Testimonial not found');
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    setStored(STORAGE_KEYS.TESTIMONIALS, list);
    return updated;
  },

  // GALLERY
  async getGallery(): Promise<GalleryImage[]> {
    return getStored<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },

  async addGalleryImage(data: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    const gallery = getStored<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const newImage: GalleryImage = {
      ...data,
      id: `gal-${Date.now()}`,
    };
    const updated = [newImage, ...gallery];
    setStored(STORAGE_KEYS.GALLERY, updated);
    return newImage;
  },

  async deleteGalleryImage(id: string): Promise<boolean> {
    const gallery = getStored<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const filtered = gallery.filter((g) => g.id !== id);
    setStored(STORAGE_KEYS.GALLERY, filtered);
    return true;
  },

  // DASHBOARD STATS
  async getDashboardStats(): Promise<DashboardStats> {
    const appointments = await this.getAppointments();
    const doctors = await this.getAllDoctorsAdmin();
    const services = await this.getAllServicesAdmin();
    return calculateDashboardStats(appointments, doctors.length, services.length);
  },

  // AUTHENTICATION
  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  loginAdmin(email: string, pass: string): boolean {
    // Configurable admin credentials - default admin@auracare.com / admin123
    if (
      (email.trim().toLowerCase() === 'admin@auracare.com' || email.trim().toLowerCase() === 'admin@clinic.com') &&
      pass === 'admin123'
    ) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      }
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  // RESET TO DEMO DATA
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.CLINIC);
    window.localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    window.localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    window.localStorage.removeItem(STORAGE_KEYS.SERVICES);
    window.localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    window.localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    window.localStorage.removeItem(STORAGE_KEYS.GALLERY);
  },
};
