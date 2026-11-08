import { AppointmentRequest, AppointmentStatus, DashboardStats, DepartmentType, Doctor } from '../types/indext';

export interface AppointmentValidationInput {
  patientName: string;
  mobileNumber: string;
  email?: string;
  department: DepartmentType | '';
  doctorId: string;
  preferredDate: string;
  preferredTimeSlot: string;
  consent: boolean;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates Indian and standard 10-digit mobile numbers with optional country codes (+91, 0)
 */
export function validateMobileNumber(phone: string): boolean {
  if (!phone) return false;
  // Clean spaces, hyphens, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Matches: 9876543210, +919876543210, 09876543210, 919876543210
  const mobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  return mobileRegex.test(cleaned);
}

/**
 * Validates that an appointment date is not in the past
 */
export function validateAppointmentDate(dateString: string, referenceDate: Date = new Date()): boolean {
  if (!dateString) return false;
  // Parse YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const targetDate = new Date(year, month, day);
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  
  return targetDate.getTime() >= today.getTime();
}

/**
 * Validates email if provided
 */
export function validateEmail(email?: string): boolean {
  if (!email || email.trim() === '') return true; // Optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates the full appointment submission form
 */
export function validateAppointmentForm(
  data: AppointmentValidationInput,
  referenceDate: Date = new Date()
): ValidationResult {
  const errors: Record<string, string> = {};

  // Patient Name
  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName = 'Please enter patient full name (at least 2 characters).';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(data.patientName.trim())) {
    errors.patientName = 'Patient name should only contain letters and standard punctuation.';
  }

  // Mobile Number
  if (!data.mobileNumber || data.mobileNumber.trim() === '') {
    errors.mobileNumber = 'Mobile number is required for SMS and WhatsApp appointment updates.';
  } else if (!validateMobileNumber(data.mobileNumber)) {
    errors.mobileNumber = 'Please enter a valid 10-digit mobile number (e.g., 98765 43210 or +91 9876543210).';
  }

  // Email (optional)
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address or leave it blank.';
  }

  // Department
  if (!data.department || (data.department !== 'ENT' && data.department !== 'Dental')) {
    errors.department = 'Please select a clinic department (ENT or Dental Care).';
  }

  // Preferred Doctor
  if (!data.doctorId || data.doctorId.trim() === '') {
    errors.doctorId = 'Please select a preferred specialist doctor or select "Any Available Specialist".';
  }

  // Preferred Date
  if (!data.preferredDate) {
    errors.preferredDate = 'Please select an appointment date.';
  } else if (!validateAppointmentDate(data.preferredDate, referenceDate)) {
    errors.preferredDate = 'Appointment date cannot be in the past.';
  }

  // Preferred Time Slot
  if (!data.preferredTimeSlot || data.preferredTimeSlot.trim() === '') {
    errors.preferredTimeSlot = 'Please select a preferred time slot.';
  }

  // Consent
  if (!data.consent) {
    errors.consent = 'You must acknowledge the appointment policy and clinical consent.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates unique human-readable appointment reference code, e.g. AC-2026-8942
 */
export function generateReferenceNumber(prefix: string = 'AC'): string {
  const year = new Date().getFullYear();
  const randomChars = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomChars}`;
}

/**
 * Filters doctors by department
 */
export function filterDoctorsByDepartment(doctors: Doctor[], department?: DepartmentType | ''): Doctor[] {
  if (!department) return doctors.filter(d => d.isPublished);
  return doctors.filter(d => d.isPublished && d.department === department);
}

/**
 * Calculates dashboard statistics from appointment list
 */
export function calculateDashboardStats(
  appointments: AppointmentRequest[],
  doctorsCount: number,
  servicesCount: number
): DashboardStats {
  const stats: DashboardStats = {
    totalAppointments: appointments.length,
    pendingRequests: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    entAppointments: 0,
    dentalAppointments: 0,
    totalDoctors: doctorsCount,
    totalServices: servicesCount,
  };

  for (const appt of appointments) {
    if (appt.status === 'Pending') stats.pendingRequests++;
    else if (appt.status === 'Confirmed') stats.confirmedAppointments++;
    else if (appt.status === 'Completed') stats.completedAppointments++;
    else if (appt.status === 'Cancelled') stats.cancelledAppointments++;

    if (appt.department === 'ENT') stats.entAppointments++;
    else if (appt.department === 'Dental') stats.dentalAppointments++;
  }

  return stats;
}

/**
 * Days of the week list
 */
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Returns day of week name for a YYYY-MM-DD date string
 */
export function getDayOfWeekFromDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Determines whether a doctor consults on the given date's day of week
 */
export function isDoctorAvailableOnDate(doctor: Doctor | undefined, dateString: string): boolean {
  if (!doctor) return true; // Any doctor
  if (!dateString) return true;
  const dayOfWeek = getDayOfWeekFromDate(dateString);
  if (!dayOfWeek) return true;
  if (!doctor.consultationDays || doctor.consultationDays.length === 0) return true;
  return doctor.consultationDays.some((d) => d.toLowerCase() === dayOfWeek.toLowerCase());
}

/**
 * Returns filtered available time slots for a doctor on a specific date
 */
export function getDoctorAvailableSlots(doctor: Doctor | undefined, dateString?: string): string[] {
  if (!doctor) return AVAILABLE_TIME_SLOTS;

  // Check day-specific weekly schedule if set
  if (dateString && doctor.weeklySchedule) {
    const dayOfWeek = getDayOfWeekFromDate(dateString);
    if (dayOfWeek && doctor.weeklySchedule[dayOfWeek] && doctor.weeklySchedule[dayOfWeek].length > 0) {
      return doctor.weeklySchedule[dayOfWeek];
    }
  }

  // Doctor-level custom available slots
  if (doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0) {
    return doctor.availableTimeSlots;
  }

  return AVAILABLE_TIME_SLOTS;
}

/**
 * Formats time slots available in operating hours
 */
export const AVAILABLE_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
];
