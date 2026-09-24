import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Check,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

interface FirstLoginPasswordChangeModalProps {
  isOpen: boolean;
  adminEmail: string;
  onSuccess: () => void;
}

export const FirstLoginPasswordChangeModal: React.FC<FirstLoginPasswordChangeModalProps> = ({
  isOpen,
  adminEmail,
  onSuccess,
}) => {
  const { changeAdminPassword } = useAcademy();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isEric = adminEmail.toLowerCase().includes('eric');
  const adminName = isEric ? "Eric D'Souza" : 'Malcolm Simon';

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Please enter your current temporary administrator password.');
      return;
    }

    if (!hasMinLength) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from your temporary password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = changeAdminPassword(adminEmail, currentPassword, newPassword);
      if (res.success) {
        // Mark first login password change complete in localStorage
        localStorage.setItem(`complisey_admin_password_changed_${isEric ? 'eric' : 'malcolm'}`, 'true');
        setSuccess('Password updated successfully! Redirecting to Admin Back Office...');
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess();
        }, 1500);
      } else {
        setError(res.message);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update administrator password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071433] text-white w-full max-w-lg rounded-2xl border border-amber-400/50 shadow-2xl overflow-hidden relative font-['IBM_Plex_Sans']">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3.5 relative z-10 bg-[#091b42]">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shadow-md shrink-0">
            <KeyRound className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                Mandatory First Login
              </span>
              <span className="text-xs text-slate-300 font-mono">{adminEmail}</span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1">
              Change Temporary Password for {adminName}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 relative z-10 max-h-[80vh] overflow-y-auto">
          {/* Security Notice */}
          <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs text-amber-200 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Section 34 Security Mandate</span>
            </div>
            <p className="text-slate-300">
              For security compliance under Seychelles regulatory standards, you are required to change your temporary initial password on your first login before accessing the CompliSey Admin Portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Current Temporary Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Enter temporary password (e.g. CompliseyMalcolm2026!)"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#0b1e4a] border border-[#1f4280] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                New Secure Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="Enter new secure password (min. 8 characters)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#0b1e4a] border border-[#1f4280] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength checks */}
              {newPassword.length > 0 && (
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="w-3 h-3" />
                    <span>Special character</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 bg-[#0b1e4a] border rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden pr-10 ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? 'border-rose-500'
                      : confirmPassword.length > 0 && passwordsMatch
                      ? 'border-emerald-500'
                      : 'border-[#1f4280] focus:border-amber-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[11px] text-rose-400 mt-1">Passwords do not match.</p>
              )}
            </div>

            {/* Error / Success messages */}
            {error && (
              <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Action button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || (newPassword.length > 0 && !passwordsMatch)}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Updating & Securing Account...' : 'Set New Password & Proceed to Admin'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
