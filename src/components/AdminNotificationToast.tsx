import React from 'react';
import { Mail, CheckCircle2, X, ExternalLink, ArrowRight, Building2, Eye } from 'lucide-react';
import { AdminEmailNotification } from '../types';

interface AdminNotificationToastProps {
  notification: AdminEmailNotification | null;
  onDismiss: () => void;
  onViewDetails: (notification: AdminEmailNotification) => void;
}

export const AdminNotificationToast: React.FC<AdminNotificationToastProps> = ({
  notification,
  onDismiss,
  onViewDetails,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100vw-2.5rem)] animate-in slide-in-from-bottom-5 duration-300 font-['IBM_Plex_Sans'] shadow-2xl">
      <div className="bg-[#071433] text-white rounded-2xl border border-amber-400/40 p-4 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#071433] flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Automated Admin Alert
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300">Email Dispatched to Admin Inboxes</p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-mono text-amber-300 font-bold">{notification.proformaNumber}</span>
            <span>{notification.seatCount} Seat{notification.seatCount > 1 ? 's' : ''} (SCR {notification.totalAmount.toLocaleString('en-US')})</span>
          </div>

          <div className="text-slate-200">
            <p className="font-bold text-white text-xs">{notification.companyName}</p>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {notification.studentName} ({notification.studentEmail})
            </p>
            <p className="text-[11px] text-amber-200/90 mt-0.5 font-medium line-clamp-1">
              Package: {notification.coursePackageTitle}
            </p>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span>Dispatched to:</span>
            <span className="font-mono text-slate-300 truncate">
              {notification.recipientEmails.join(', ')}
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onViewDetails(notification);
              onDismiss();
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#071433] text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Email Body</span>
          </button>

          <button
            onClick={onDismiss}
            className="px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
