export type DepartmentType = 'ENT' | 'Dental';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Clinic {
  id: string;
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  emergencyPhone: string;
  email: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  operatingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  heroHeading: string;
  heroSubheading: string;
}

export interface Department {
  id: string;
  type: DepartmentType;
  name: string;
  shortDescription: string;
  longDescription: string;
  heroImage: string;
  features: string[];
  headDoctorId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: DepartmentType;
  qualification: string;
  specialization: string;
  experienceYears: number;
  image: string;
  bio: string;
  consultationDays: string[];
  consultationHours: string;
  languages: string[];
  isPublished: boolean;
  featured: boolean;
  availableTimeSlots?: string[];
  weeklySchedule?: Record<string, string[]>;
}

export interface ServiceTreatment {
  id: string;
  department: DepartmentType;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  symptomsAddressed: string[];
  procedureTime: string;
  recoveryTime: string;
  image: string;
  isPublished: boolean;
  featured: boolean;
}

export interface AppointmentRequest {
  id: string;
  referenceNumber: string;
  patientName: string;
  mobileNumber: string;
  email?: string;
  department: DepartmentType;
  doctorId: string;
  doctorName?: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string;
  notes?: string;
  consent: boolean;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  department: DepartmentType;
  feedback: string;
  rating: number;
  treatmentName: string;
  date: string;
  isApproved: boolean;
  isPublished: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Clinic Infrastructure' | 'ENT Facilities' | 'Dental Operatory' | 'Reception & Lounge' | 'Advanced Equipment';
  imageUrl: string;
  description: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pendingRequests: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  entAppointments: number;
  dentalAppointments: number;
  totalDoctors: number;
  totalServices: number;
}
