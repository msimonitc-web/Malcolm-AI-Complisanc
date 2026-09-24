import React, { useState } from 'react';
import { Sparkles, X, ShieldCheck, CheckCircle2, Building2, User, Mail, Phone, Users, ArrowRight } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { useCsrf } from '../context/CsrfContext';

interface PreLaunchSeatReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreLaunchSeatReservationModal: React.FC<PreLaunchSeatReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { courses, formatPrice } = useAcademy();
  const { submitProtectedForm } = useCsrf();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-1');
  const [seatCount, setSeatCount] = useState<number>(3);
  const [companyName, setCompanyName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const estimatedTotal = (selectedCourse?.price || 3500) * seatCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !companyName || !contactName) {
      setErrorMessage('Please fill in your company name, contact name, and email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await submitProtectedForm('/api/forms/enrollment-order', {
        courseId: selectedCourseId,
        seatCount,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        notes: `[PRE-LAUNCH SEAT RESERVATION] ${notes}`,
      });

      if (result.success) {
        setSuccessResult(result);
      } else {
        setErrorMessage(result.error || 'Failed to submit pre-launch reservation. Please try again.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error during reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setCompanyName('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#071433] via-[#0f275c] to-[#071433] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-[#071433]">
              <Sparkles className="w-3.5 h-3.5" /> Official Launch Imminent
            </span>
            <span className="text-xs text-slate-300">Complisey Academy · Seychelles</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Book Your Seats Now Before Launch</h2>
          <p className="text-sm text-slate-300 mt-1">
            Secure priority early-bird enrollment for your compliance team under Section 34 &amp; AML/CFT Act 2020.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {successResult ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Seat Reservation Confirmed!</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
                Thank you, <strong>{contactName}</strong> from <strong>{companyName}</strong>. Your pre-launch reservation for <strong>{seatCount} seat(s)</strong> in <em>{selectedCourse?.title}</em> has been securely registered.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-left max-w-md mx-auto text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div><strong>Registered Email:</strong> {contactEmail}</div>
                <div><strong>Estimated Investment:</strong> {formatPrice(estimatedTotal)} (Proforma invoice ready)</div>
                <div><strong>Operations Desk:</strong> Malcolm Simon &amp; Eric D'Souza notified.</div>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#071433] hover:bg-[#0f275c] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg"
                >
                  Return to Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Select Compliance Course / Track
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#071433]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — {formatPrice(c.price)} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Reporting Entity / Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Trust (Seychelles) Ltd"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#071433]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Compliance Officer / Contact Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Marie-Claire Pool"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#071433]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Professional Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="officer@company.sc"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#071433]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (Seychelles / Int.)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+248 4..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#071433]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Number of Seats to Reserve
                  </label>
                  <span className="text-xs font-bold text-[#071433] dark:text-amber-400">
                    {seatCount} Seat{seatCount > 1 ? 's' : ''} ({formatPrice(estimatedTotal)} Total)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                    className="w-full accent-[#071433] dark:accent-amber-400 cursor-pointer"
                  />
                  <span className="w-12 text-center text-sm font-bold bg-slate-100 dark:bg-slate-800 py-1 rounded-lg">
                    {seatCount}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes / Special Training Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. In-house customized training required for 15 directors..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#071433]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#071433] to-[#0f275c] hover:from-[#0f275c] hover:to-[#071433] text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Reserving Seats...' : 'Confirm Pre-Launch Reservation'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
