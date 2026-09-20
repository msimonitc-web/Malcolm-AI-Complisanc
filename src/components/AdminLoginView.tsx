import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Key,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';
import { useCsrf, CsrfInput } from '../context/CsrfContext';
import { AdminChangePasswordModal } from './AdminChangePasswordModal';

interface AdminLoginViewProps {
  onBackToPublicPortal?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = () => {
  const { loginWithCredentials, getAdminPassword } = useAcademy();
  const { csrfToken, submitProtectedForm } = useCsrf();

  const [email, setEmail] = useState('malcolm@complisanc.com');
  const [password, setPassword] = useState(() => getAdminPassword('malcolm@complisanc.com'));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    // Check if email belongs to authorized admins Malcolm Simon or Eric D'Souza
    const isMalcolm = cleanEmail.includes('malcolm');
    const isEric = cleanEmail.includes('eric');

    if (!isMalcolm && !isEric) {
      setError("Access Denied. This administration portal is strictly restricted to Malcolm Simon and Eric D'Souza.");
      setIsSubmitting(false);
      return;
    }

    const res = loginWithCredentials(cleanEmail, password);
    if (res.success && res.account?.role === 'admin') {
      setSuccess(`Authenticated successfully as Administrator (${res.account.name}). Entering Back Office...`);
      try {
        await submitProtectedForm('/api/auth/login-credentials', {
          email: cleanEmail,
          _csrf: csrfToken,
        });
      } catch (err) {
        console.warn('Admin login telemetry noted:', err);
      }
    } else {
      setError(res.message || 'Invalid administrator credentials. Please check your password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-[#071433] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#17326c] relative overflow-hidden space-y-6">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand & Security Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-1.5 mx-auto shadow-lg ring-4 ring-amber-400/20">
            <CompliseyLogo className="w-full h-full" cColor="#1d3c6a" ankhColor="#d9a438" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-['IBM_Plex_Sans']">
                Compli<span className="text-amber-400">Sey</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-[#071433]">
                Back Office
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Restricted Operations Terminal · Malcolm Simon &amp; Eric D'Souza
            </p>
          </div>
        </div>

        {/* Security Advisory Pill */}
        <div className="p-3.5 bg-[#0b1e4a] rounded-xl border border-[#1f3f85] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Authorized Administrators Only</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Direct portal for verifying bank wire proformas, issuing course activation tokens, and generating statutory training audit files under Section 34 of the Seychelles AML/CFT Act 2020.
          </p>
          <div className="pt-2 border-t border-[#1a3875] text-[11px] text-amber-200/90 italic">
            Strictly isolated secure credentials for audit accountability under Section 34. Click your name below to securely load credentials.
          </div>
        </div>

        {/* Quick Demo Pre-select for Malcolm Simon and Eric D'Souza */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Select Administrator:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('malcolm@complisanc.com');
                setPassword(getAdminPassword('malcolm@complisanc.com'));
                setError(null);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('malcolm')
                  ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                  : 'border-[#19366f] bg-[#0c1f4a] hover:bg-[#112961] text-slate-300'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Malcolm Simon</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                Administration &amp; Support
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('eric@complisanc.com');
                setPassword(getAdminPassword('eric@complisanc.com'));
                setError(null);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('eric')
                  ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                  : 'border-[#19366f] bg-[#0c1f4a] hover:bg-[#112961] text-slate-300'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Eric D'Souza</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                Training Inquiries &amp; Director
              </div>
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleAdminLogin} className="space-y-3.5">
          <CsrfInput formName="admin-portal-login" />
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-[#0b1e4a] border border-[#1d3d75] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Admin Password
              </label>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
              >
                Change password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-[#0b1e4a] border border-[#1d3d75] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to Administrator Back Office</span>
          </button>
        </form>

        {/* Sensitive Security Notice */}
        <div className="pt-2 text-center border-t border-[#13285c] text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Protected Statutory Back Office · Section 34 AML/CFT Act 2020</span>
          </div>
        </div>
      </div>

      {/* Admin Change Password Modal */}
      <AdminChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPassword(getAdminPassword(email));
        }}
        defaultEmail={email}
      />
    </div>
  );
};
