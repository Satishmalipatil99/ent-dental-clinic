import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Clinic } from '../types/indext';

interface ContactSectionProps {
  clinic: Clinic;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ clinic }) => {
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formMessage) return;
    setIsSent(true);
    setTimeout(() => {
      setFormName('');
      setFormPhone('');
      setFormMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase">
            <MapPin className="w-3.5 h-3.5" />
            Clinic Location &amp; Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D]">
            Visit Us or Get in Touch
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Centrally located with dedicated parking, wheelchair accessibility, and high-standard patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards & Operating Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F2F8FB] p-6 sm:p-8 rounded-3xl border border-slate-200/60 space-y-6">
              <h3 className="font-bold text-[#123B5D] text-lg">Clinic Information</h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#16A6A1] flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#123B5D] block">Address</span>
                    <span>{clinic.address}, {clinic.city}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#16A6A1] flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#123B5D] block">Phone Inquiries</span>
                    <a href={`tel:${clinic.phone}`} className="hover:text-[#16A6A1] font-medium">
                      {clinic.phone}
                    </a>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Emergency: <strong className="text-red-600">{clinic.emergencyPhone}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#16A6A1] flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#123B5D] block">WhatsApp Desk</span>
                    <a
                      href={`https://wa.me/${clinic.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#25D366] font-medium"
                    >
                      {clinic.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#16A6A1] flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#123B5D] block">Email</span>
                    <a href={`mailto:${clinic.email}`} className="hover:text-[#16A6A1] font-medium">
                      {clinic.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours Box */}
              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#123B5D]">
                  <Clock className="w-4 h-4 text-[#16A6A1]" />
                  <span>Clinical Operating Hours</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 pl-6">
                  <p>{clinic.operatingHours.weekdays}</p>
                  <p>{clinic.operatingHours.saturday}</p>
                  <p>{clinic.operatingHours.sunday}</p>
                </div>
              </div>
            </div>

            {/* Quick Enquiry Form */}
            <form
              onSubmit={handleContactSubmit}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <h4 className="font-bold text-[#123B5D] text-sm">Send a Quick Message</h4>
              {isSent && (
                <div className="p-3 rounded-lg bg-teal-50 text-teal-800 text-xs flex items-center gap-2 border border-teal-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Your enquiry has been received. Our coordinator will contact you shortly.</span>
                </div>
              )}
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A6A1]"
              />
              <input
                type="tel"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="Mobile Number"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A6A1]"
              />
              <textarea
                required
                rows={2}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Your Question or Query..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A6A1]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0b253c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Enquiry
              </button>
            </form>
          </div>

          {/* Right Column: Google Maps Location Embed & Route Details */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <iframe
                title="Clinic Location Map"
                src={clinic.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2F8FB] border border-slate-200/60 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
              <span>📍 Nearest Metro Station: Indiranagar 100ft Rd (800m)</span>
              <span>🚗 Valet &amp; Underground Parking Available</span>
              <span>♿ Wheelchair Ramp &amp; Stretcher Elevator</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
