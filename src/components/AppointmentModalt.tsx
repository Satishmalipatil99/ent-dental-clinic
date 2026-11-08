import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Printer,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { Doctor, DepartmentType, AppointmentRequest, Clinic } from '../types/indext';
import {
  validateAppointmentForm,
  AVAILABLE_TIME_SLOTS,
  filterDoctorsByDepartment,
  getDayOfWeekFromDate,
  isDoctorAvailableOnDate,
  getDoctorAvailableSlots,
} from '../lib/appointmentLogict';
import { storageService } from '../services/storageServicet';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: Clinic;
  doctors: Doctor[];
  initialDepartment?: DepartmentType;
  initialDoctorId?: string;
  onAppointmentCreated?: (appointment: AppointmentRequest) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  clinic,
  doctors,
  initialDepartment,
  initialDoctorId,
  onAppointmentCreated,
}) => {
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<DepartmentType | ''>(initialDepartment || 'ENT');
  const [doctorId, setDoctorId] = useState<string>(initialDoctorId || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentRequest | null>(null);

  // Sync initial department/doctor when modal opens or props change
  useEffect(() => {
    if (initialDepartment) {
      setDepartment(initialDepartment);
    }
    if (initialDoctorId) {
      setDoctorId(initialDoctorId);
    }
  }, [initialDepartment, initialDoctorId, isOpen]);

  // Compute minimum selectable date (today formatted as YYYY-MM-DD)
  const todayString = new Date().toISOString().split('T')[0];

  // Filter doctors dynamically according to department
  const availableDoctors = filterDoctorsByDepartment(doctors, department || undefined);

  // Find currently selected doctor object
  const selectedDoctorObj = doctorId && doctorId !== 'any'
    ? doctors.find((d) => d.id === doctorId)
    : undefined;

  // Check if selected doctor is available on the selected date
  const isDoctorAvailableToday = preferredDate && selectedDoctorObj
    ? isDoctorAvailableOnDate(selectedDoctorObj, preferredDate)
    : true;

  const dayOfWeekName = preferredDate ? getDayOfWeekFromDate(preferredDate) : '';

  // Dynamically compute available time slots based on selected doctor & date
  const dynamicTimeSlots = getDoctorAvailableSlots(selectedDoctorObj, preferredDate);

  // Auto-reset time slot if current selection is not in filtered slots
  useEffect(() => {
    if (preferredTimeSlot && !dynamicTimeSlots.includes(preferredTimeSlot)) {
      setPreferredTimeSlot('');
    }
  }, [dynamicTimeSlots, preferredTimeSlot]);

  // Auto-reset doctor selection if current doctor is not in selected department
  useEffect(() => {
    if (doctorId && department) {
      const match = availableDoctors.find((d) => d.id === doctorId);
      if (!match) {
        setDoctorId('');
      }
    }
  }, [department, availableDoctors, doctorId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validateAppointmentForm({
      patientName,
      mobileNumber,
      email,
      department,
      doctorId,
      preferredDate,
      preferredTimeSlot,
      consent,
      notes,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Find selected doctor name
      const selectedDoc = doctors.find((d) => d.id === doctorId);
      const doctorName = selectedDoc ? selectedDoc.name : 'Any Available Specialist';

      const newAppt = await storageService.createAppointment({
        patientName: patientName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim() || undefined,
        department: department as DepartmentType,
        doctorId,
        doctorName,
        preferredDate,
        preferredTimeSlot,
        notes: notes.trim() || undefined,
        consent,
      });

      // Also submit to backend server API asynchronously if running
      try {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppt),
        });
      } catch (err) {
        // Local persistence already succeeded
      }

      setConfirmedBooking(newAppt);
      if (onAppointmentCreated) {
        onAppointmentCreated(newAppt);
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Unable to submit appointment request. Please retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!confirmedBooking) return;
    const msg = encodeURIComponent(
      `Hello AuraCare Clinic, I have submitted an appointment request (Ref: ${confirmedBooking.referenceNumber}) for ${confirmedBooking.patientName} in ${confirmedBooking.department} Department on ${confirmedBooking.preferredDate} at ${confirmedBooking.preferredTimeSlot}. Please confirm availability.`
    );
    window.open(`https://wa.me/${clinic.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setPatientName('');
    setMobileNumber('');
    setEmail('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ---------------- SUCCESS / CONFIRMED BOOKING SCREEN ---------------- */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E5F6F2] text-[#16A6A1] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A6A1] bg-[#E5F6F2] px-3 py-1 rounded-full">
                Request Registered Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#123B5D] pt-2">
                Appointment Request Submitted
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-slate-800">{confirmedBooking.patientName}</span>. Your request has been forwarded to our clinical coordination team.
              </p>
            </div>

            {/* Printable summary ticket */}
            <div className="bg-[#F2F8FB] p-6 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Reference Number</span>
                <span className="font-mono text-base font-bold text-[#123B5D] tracking-wider bg-white px-3 py-1 rounded-md border border-slate-200">
                  {confirmedBooking.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block">Department</span>
                  <span className="font-bold text-[#123B5D] text-sm">
                    {confirmedBooking.department === 'ENT' ? '👂 ENT Care' : '🦷 Dental Care'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned / Selected Specialist</span>
                  <span className="font-bold text-[#123B5D] text-sm">{confirmedBooking.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Preferred Date</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.preferredDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Preferred Time Window</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.preferredTimeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact Mobile</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Review Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {confirmedBooking.status} (Under Verification)
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                * Our patient liaison officer will call or WhatsApp you within 60 minutes during clinic operating hours to confirm final appointment slot.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Print / Save Slip
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Connect via WhatsApp
              </button>

              <button
                onClick={handleResetAndClose}
                className="py-3 px-6 rounded-xl bg-[#123B5D] hover:bg-[#0b253c] text-white text-xs font-semibold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- BOOKING FORM ---------------- */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase mb-2">
                <Calendar className="w-3.5 h-3.5" />
                Online Appointment Request
              </div>
              <h2 id="appointment-modal-title" className="text-2xl sm:text-3xl font-bold text-[#123B5D]">
                Consult Our Specialists
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Fill in your details below. Our clinic coordinator will review physician schedules and confirm your visit.
              </p>
            </div>

            {errors.form && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Department Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Department <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDepartment('ENT')}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    department === 'ENT'
                      ? 'border-[#123B5D] bg-blue-50/70 text-[#123B5D] ring-2 ring-[#123B5D]/20 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-2xl">👂</span>
                  <div>
                    <div className="text-sm">ENT Department</div>
                    <div className="text-[11px] text-slate-500 font-normal">Ear, Nose, Throat &amp; Sinus</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDepartment('Dental')}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    department === 'Dental'
                      ? 'border-[#16A6A1] bg-teal-50/70 text-[#16A6A1] ring-2 ring-[#16A6A1]/20 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-2xl">🦷</span>
                  <div>
                    <div className="text-sm">Dental Department</div>
                    <div className="text-[11px] text-slate-500 font-normal">Implants, RCT &amp; Orthodontics</div>
                  </div>
                </button>
              </div>
              {errors.department && <p className="text-red-500 text-xs mt-1.5">{errors.department}</p>}
            </div>

            {/* Doctor Selection (Filtered by Department) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Doctor / Specialist <span className="text-red-500">*</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800 bg-white"
              >
                <option value="">-- Select Specialist --</option>
                <option value="any">Any Available Specialist in {department || 'Clinic'}</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} – {doc.specialization} ({doc.qualification})
                  </option>
                ))}
              </select>
              {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
            </div>

            {/* Patient Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800"
                  />
                </div>
                {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 9876543210 or +91..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800"
                  />
                </div>
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>
            </div>

            {/* Email (Optional) & Preferred Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  {dayOfWeekName && (
                    <span className="text-[11px] font-semibold text-[#16A6A1]">
                      {dayOfWeekName}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  min={todayString}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800 bg-white"
                />
                {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
              </div>
            </div>

            {/* Doctor Availability Notice if not on normal schedule */}
            {selectedDoctorObj && preferredDate && !isDoctorAvailableToday && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{selectedDoctorObj.name}</span>'s standard consultation days are{' '}
                  <span className="font-semibold">{selectedDoctorObj.consultationDays.join(', ')}</span>.
                  You may still request this date, and our clinic desk will confirm special physician availability.
                </div>
              </div>
            )}

            {/* Preferred Time Slot (Dynamically Filtered by Doctor & Schedule) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-semibold text-[#16A6A1] bg-[#E5F6F2] px-2 py-0.5 rounded-full">
                  {dynamicTimeSlots.length} Slots Available {selectedDoctorObj ? `(${selectedDoctorObj.name.split(' ')[0]} ${selectedDoctorObj.name.split(' ')[1] || ''})` : ''}
                </span>
              </div>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800 bg-white"
              >
                <option value="">-- Choose Available Slot ({dynamicTimeSlots.length} available) --</option>
                {dynamicTimeSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.preferredTimeSlot && (
                <p className="text-red-500 text-xs mt-1">{errors.preferredTimeSlot}</p>
              )}
            </div>

            {/* Brief Note (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brief Health Concern / Reason for Visit <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe symptoms (e.g. ear blockage, toothache, routine checkup)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A6A1] text-sm text-slate-800"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="space-y-1.5">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#16A6A1] focus:ring-[#16A6A1] w-4 h-4 cursor-pointer"
                />
                <span>
                  I understand that this is an appointment request and will be verified by the clinic. I consent to receiving appointment updates via SMS and WhatsApp.
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#16A6A1] hover:bg-[#11817d] text-white font-bold text-sm shadow-lg shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                {isSubmitting ? 'Registering Request...' : 'Submit Appointment Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
