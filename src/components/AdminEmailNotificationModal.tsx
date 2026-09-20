import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Phone,
  BookOpen,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AdminEmailNotification } from '../types';
import { adminEmailNotificationService } from '../services/adminEmailNotificationService';
import { CompliseyLogo } from './CompliseyLogo';

interface AdminEmailNotificationModalProps {
  notification: AdminEmailNotification | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToOrder?: (orderId: string) => void;
}

export const AdminEmailNotificationModal: React.FC<AdminEmailNotificationModalProps> = ({
  notification,
  isOpen,
  onClose,
  onNavigateToOrder,
}) => {
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen || !notification) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(notification.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const csrfToken =
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || '';

      await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          to: notification.recipientEmails,
          subject: notification.subject,
          html: notification.htmlContent,
          text: notification.textContent,
          category: 'proforma_admin_alert_redispatch',
          metadata: {
            orderId: notification.orderId,
            proformaNumber: notification.proformaNumber,
          },
        }),
      });
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3500);
    } catch {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3500);
    }
  };

  const mailtoUrl = adminEmailNotificationService.getMailtoUrl(notification);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#071433]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-['IBM_Plex_Sans'] animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-[#071433] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  Automated Admin Email Notification
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Delivered</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Triggered on student proforma invoice request · {notification.proformaNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mailtoUrl}
              title="Open in default email client"
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Client</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Envelope Metadata Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">From:</span>{' '}
              <span className="font-mono text-slate-700">Complisanc Consulting &lt;malcolm@complisanc.com&gt;</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Dispatched At:</span>{' '}
              <span className="font-mono text-slate-700">{new Date(notification.sentAt).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">To (Admin Inboxes):</span>{' '}
            <div className="inline-flex flex-wrap gap-1.5 ml-1">
              {notification.recipientEmails.map((email) => (
                <span
                  key={email}
                  className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-mono font-medium text-[11px] border border-slate-300"
                >
                  {email}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Subject:</span>{' '}
            <span className="font-semibold text-slate-900">{notification.subject}</span>
          </div>

          {resendSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automated notification re-dispatched to {notification.recipientEmails.join(', ')} successfully!</span>
            </div>
          )}
        </div>

        {/* View Toggle Bar */}
        <div className="px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('html')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'html'
                  ? 'bg-[#071433] text-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rendered HTML Email
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'text'
                  ? 'bg-[#071433] text-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plaintext Format
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="px-3 py-1.5 rounded-lg bg-[#071433] hover:bg-[#0c245c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Sending...' : 'Resend Alert'}</span>
            </button>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-5 overflow-y-auto max-h-[55vh] bg-slate-50/50">
          {viewMode === 'html' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Rendered HTML inside preview container */}
              <div
                className="p-6 text-slate-800"
                dangerouslySetInnerHTML={{ __html: notification.htmlContent }}
              />
            </div>
          ) : (
            <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-all border border-slate-800 shadow-inner">
              {notification.textContent}
            </div>
          )}
        </div>

        {/* Structured Quick Summary Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>
              <strong>{notification.companyName}</strong> · {notification.seatCount} Seat{notification.seatCount > 1 ? 's' : ''} (SCR {notification.totalAmount.toLocaleString('en-US')})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onNavigateToOrder && (
              <button
                onClick={() => {
                  onNavigateToOrder(notification.orderId);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#071433] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review Order in Admin Portal</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
