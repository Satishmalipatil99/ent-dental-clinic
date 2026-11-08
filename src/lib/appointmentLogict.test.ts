import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateMobileNumber,
  validateAppointmentDate,
  validateEmail,
  validateAppointmentForm,
  generateReferenceNumber,
  filterDoctorsByDepartment,
  calculateDashboardStats,
  getDayOfWeekFromDate,
  isDoctorAvailableOnDate,
  getDoctorAvailableSlots,
} from './appointmentLogict';
import { AppointmentRequest, Doctor } from '../types/indext';

test('validateMobileNumber accepts valid Indian phone numbers', () => {
  assert.equal(validateMobileNumber('9876543210'), true);
  assert.equal(validateMobileNumber('+91 9876543210'), true);
  assert.equal(validateMobileNumber('+919876543210'), true);
  assert.equal(validateMobileNumber('09876543210'), true);
  assert.equal(validateMobileNumber('8765432109'), true);
  assert.equal(validateMobileNumber('7012345678'), true);
  assert.equal(validateMobileNumber('6200123456'), true);
});

test('validateMobileNumber rejects invalid numbers', () => {
  assert.equal(validateMobileNumber(''), false);
  assert.equal(validateMobileNumber('12345'), false);
  assert.equal(validateMobileNumber('5876543210'), false); // Starts with 5
  assert.equal(validateMobileNumber('abcdefghij'), false);
  assert.equal(validateMobileNumber('9876543210123'), false); // Too long
});

test('validateAppointmentDate prevents past dates', () => {
  const referenceDate = new Date(2026, 10, 7); // Nov 7, 2026
  
  // Today is valid
  assert.equal(validateAppointmentDate('2026-11-07', referenceDate), true);
  // Tomorrow is valid
  assert.equal(validateAppointmentDate('2026-11-08', referenceDate), true);
  // Next year is valid
  assert.equal(validateAppointmentDate('2027-01-15', referenceDate), true);
  // Yesterday is invalid
  assert.equal(validateAppointmentDate('2026-11-06', referenceDate), false);
  // Past year is invalid
  assert.equal(validateAppointmentDate('2025-10-01', referenceDate), false);
});

test('validateEmail validates correctly', () => {
  assert.equal(validateEmail(''), true); // optional
  assert.equal(validateEmail(undefined), true); // optional
  assert.equal(validateEmail('patient@example.com'), true);
  assert.equal(validateEmail('dr.smith@clinic.co.in'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('no-domain@'), false);
});

test('validateAppointmentForm flags missing required fields', () => {
  const referenceDate = new Date(2026, 10, 7);
  const result = validateAppointmentForm({
    patientName: '',
    mobileNumber: '',
    department: '',
    doctorId: '',
    preferredDate: '',
    preferredTimeSlot: '',
    consent: false,
  }, referenceDate);

  assert.equal(result.isValid, false);
  assert.ok(result.errors.patientName);
  assert.ok(result.errors.mobileNumber);
  assert.ok(result.errors.department);
  assert.ok(result.errors.doctorId);
  assert.ok(result.errors.preferredDate);
  assert.ok(result.errors.preferredTimeSlot);
  assert.ok(result.errors.consent);
});

test('validateAppointmentForm succeeds on valid complete submission', () => {
  const referenceDate = new Date(2026, 10, 7);
  const result = validateAppointmentForm({
    patientName: 'Aarav Sharma',
    mobileNumber: '+91 9876543210',
    email: 'aarav@example.com',
    department: 'ENT',
    doctorId: 'doc-ent-1',
    preferredDate: '2026-11-10',
    preferredTimeSlot: '10:00 AM - 11:00 AM',
    consent: true,
    notes: 'Mild sinus congestion and allergic rhinitis symptoms.',
  }, referenceDate);

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('generateReferenceNumber produces expected format', () => {
  const ref = generateReferenceNumber('AC');
  assert.match(ref, /^AC-\d{4}-\d{4}$/);
});

test('filterDoctorsByDepartment filters correctly', () => {
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Rao',
      department: 'ENT',
      qualification: 'MBBS, MS (ENT)',
      specialization: 'Rhinology & Sinus',
      experienceYears: 16,
      image: '',
      bio: '',
      consultationDays: ['Mon', 'Wed', 'Fri'],
      consultationHours: '10 AM - 2 PM',
      languages: ['English', 'Hindi'],
      isPublished: true,
      featured: true,
    },
    {
      id: '2',
      name: 'Dr. Priya Desai',
      department: 'Dental',
      qualification: 'BDS, MDS (Endodontics)',
      specialization: 'Root Canal & Aesthetic Dentistry',
      experienceYears: 12,
      image: '',
      bio: '',
      consultationDays: ['Tue', 'Thu', 'Sat'],
      consultationHours: '11 AM - 4 PM',
      languages: ['English', 'Hindi', 'Gujarati'],
      isPublished: true,
      featured: true,
    },
    {
      id: '3',
      name: 'Dr. Unpublished',
      department: 'Dental',
      qualification: 'BDS',
      specialization: 'General',
      experienceYears: 5,
      image: '',
      bio: '',
      consultationDays: [],
      consultationHours: '',
      languages: [],
      isPublished: false,
      featured: false,
    },
  ];

  const entDocs = filterDoctorsByDepartment(doctors, 'ENT');
  assert.equal(entDocs.length, 1);
  assert.equal(entDocs[0].name, 'Dr. Rajesh Rao');

  const dentalDocs = filterDoctorsByDepartment(doctors, 'Dental');
  assert.equal(dentalDocs.length, 1); // Only published
  assert.equal(dentalDocs[0].name, 'Dr. Priya Desai');

  const allPublished = filterDoctorsByDepartment(doctors);
  assert.equal(allPublished.length, 2);
});

test('calculateDashboardStats aggregates metrics accurately', () => {
  const mockAppointments: AppointmentRequest[] = [
    {
      id: '1',
      referenceNumber: 'AC-2026-1001',
      patientName: 'John Doe',
      mobileNumber: '9876543210',
      department: 'ENT',
      doctorId: 'doc-1',
      preferredDate: '2026-11-10',
      preferredTimeSlot: '10:00 AM - 11:00 AM',
      consent: true,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      referenceNumber: 'AC-2026-1002',
      patientName: 'Jane Smith',
      mobileNumber: '9876543211',
      department: 'Dental',
      doctorId: 'doc-2',
      preferredDate: '2026-11-11',
      preferredTimeSlot: '02:00 PM - 03:00 PM',
      consent: true,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      referenceNumber: 'AC-2026-1003',
      patientName: 'Sam Wilson',
      mobileNumber: '9876543212',
      department: 'Dental',
      doctorId: 'doc-2',
      preferredDate: '2026-11-12',
      preferredTimeSlot: '04:00 PM - 05:00 PM',
      consent: true,
      status: 'Completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const stats = calculateDashboardStats(mockAppointments, 6, 15);
  assert.equal(stats.totalAppointments, 3);
  assert.equal(stats.pendingRequests, 1);
  assert.equal(stats.confirmedAppointments, 1);
  assert.equal(stats.completedAppointments, 1);
  assert.equal(stats.cancelledAppointments, 0);
  assert.equal(stats.entAppointments, 1);
  assert.equal(stats.dentalAppointments, 2);
  assert.equal(stats.totalDoctors, 6);
  assert.equal(stats.totalServices, 15);
});

test('getDayOfWeekFromDate identifies days of week accurately', () => {
  // 2026-11-09 is a Monday
  assert.equal(getDayOfWeekFromDate('2026-11-09'), 'Monday');
  // 2026-11-10 is a Tuesday
  assert.equal(getDayOfWeekFromDate('2026-11-10'), 'Tuesday');
  // 2026-11-15 is a Sunday
  assert.equal(getDayOfWeekFromDate('2026-11-15'), 'Sunday');
});

test('isDoctorAvailableOnDate checks doctor consultation days', () => {
  const doc: Doctor = {
    id: 'doc-test-1',
    name: 'Dr. Test',
    department: 'ENT',
    qualification: 'MBBS',
    specialization: 'ENT',
    experienceYears: 10,
    image: '',
    bio: '',
    consultationDays: ['Monday', 'Wednesday', 'Friday'],
    consultationHours: '10 AM - 1 PM',
    languages: ['English'],
    isPublished: true,
    featured: false,
  };

  // 2026-11-09 is a Monday -> Available
  assert.equal(isDoctorAvailableOnDate(doc, '2026-11-09'), true);
  // 2026-11-10 is a Tuesday -> Not available
  assert.equal(isDoctorAvailableOnDate(doc, '2026-11-10'), false);
  // 2026-11-11 is a Wednesday -> Available
  assert.equal(isDoctorAvailableOnDate(doc, '2026-11-11'), true);
  // Undefined doctor -> always available (Any Doctor)
  assert.equal(isDoctorAvailableOnDate(undefined, '2026-11-10'), true);
});

test('getDoctorAvailableSlots filters dynamically by doctor configuration', () => {
  const docWithCustomSlots: Doctor = {
    id: 'doc-test-2',
    name: 'Dr. Custom',
    department: 'Dental',
    qualification: 'BDS',
    specialization: 'Dental',
    experienceYears: 8,
    image: '',
    bio: '',
    consultationDays: ['Monday', 'Tuesday'],
    consultationHours: 'Morning Only',
    languages: ['English'],
    isPublished: true,
    featured: false,
    availableTimeSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM'],
  };

  const slots = getDoctorAvailableSlots(docWithCustomSlots, '2026-11-09');
  assert.equal(slots.length, 2);
  assert.deepEqual(slots, ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM']);

  // Undefined doctor returns full operating slots
  const fallbackSlots = getDoctorAvailableSlots(undefined, '2026-11-09');
  assert.ok(fallbackSlots.length >= 8);
});
