import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { MASEH_SETTINGS } from '../data/initialData';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { submitContactMessage } = useBakery();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Event Catering Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    await submitContactMessage({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject,
      message: message.trim()
    });
    setIsSubmitting(false);
    setIsSent(true);
  };

  return (
    <div className="py-8 sm:py-12 space-y-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E2745] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#D93462]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#F5C84B]" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#302020] tracking-tight">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm text-[#806D6A]">
          Have questions about catering portions, custom cake design, or delivery timing? Reach out to our bakery team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#3A1F1F]/10 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#302020]">Bakery Information</h3>
            
            <div className="space-y-4 text-xs text-[#302020]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#806D6A] block text-[11px]">Phone Order Line</span>
                  <a href={`tel:${MASEH_SETTINGS.phone}`} className="font-bold text-sm hover:text-[#8E2745]">
                    {MASEH_SETTINGS.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#806D6A] block text-[11px]">Email Inquiries</span>
                  <a href={`mailto:${MASEH_SETTINGS.email}`} className="font-bold text-sm hover:text-[#8E2745]">
                    {MASEH_SETTINGS.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#806D6A] block text-[11px]">Bakery Location</span>
                  <p className="font-medium">{MASEH_SETTINGS.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] text-[#8E2745] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#806D6A] block text-[11px]">Operating Hours</span>
                  <p className="font-medium">{MASEH_SETTINGS.hours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#3A1F1F]/10">
              <a
                href={MASEH_SETTINGS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#3A1F1F]/10 shadow-sm">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#302020]">Send Us a Message</h3>

              <div>
                <label className="block text-xs font-bold text-[#302020] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#302020] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#302020] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (240) 555-0199"
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#302020] mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                >
                  <option>Event Catering Inquiry</option>
                  <option>Custom Cake Question</option>
                  <option>Delivery Radius / Address Check</option>
                  <option>Dietary & Allergen Guidance</option>
                  <option>Other Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#302020] mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event date, expected guest count, or any custom requests..."
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:ring-2 focus:ring-[#D93462]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-xs py-3 px-6 w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#302020]">Message Sent!</h3>
              <p className="text-xs text-[#806D6A] max-w-sm mx-auto">
                Thank you for contacting Maseh's Delights. Our kitchen team will review your message and reply promptly.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="btn-secondary text-xs py-2 px-4 mt-2"
              >
                Send Another Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
