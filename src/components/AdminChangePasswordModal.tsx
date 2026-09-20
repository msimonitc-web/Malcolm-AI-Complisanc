import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  X,
  Key,
  KeyRound,
  Check,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

interface AdminChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAdminEmail?: string;
}

export const AdminChangePasswordModal: React.FC<AdminChangePasswordModalProps> = ({
  isOpen,
  onClose,
  defaultAdminEmail,
}) => {
  const { currentUser, changeAdminPassword } = useAcademy();

  const [selectedAdminEmail, setSelectedAdminEmail] = useState<string>(
    defaultAdminEmail || currentUser?.email || 'malcolm@complisanc.com'
  );
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

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Please enter your current administrator password.');
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
      setError('New password must be different from your current password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = changeAdminPassword(selectedAdminEmail, currentPassword, newPassword);
      if (res.success) {
        setSuccess(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          // Keep open momentarily to see success then allow closing
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update administrator password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMalcolm = selectedAdminEmail.toLowerCase().includes('malcolm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#071433] text-white w-full max-w-lg rounded-2xl border border-amber-400/40 shadow-2xl overflow-hidden relative font-['IBM_Plex_Sans']">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Update Administrator Password</span>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[9px] font-black uppercase">
                  Back Office
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Authorized credentials for Malcolm Simon &amp; Eric D'Souza
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 relative z-10 max-h-[85vh] overflow-y-auto">
          {/* Security Advisory */}
          <div className="p-3.5 bg-[#0d2254] rounded-xl border border-blue-400/30 text-xs text-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sensitive Data Protection Mandate</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Updating your administrator password secures your access to sensitive learner AML/CFT records, company wire proformas, and Section 34 audit trails.
            </p>
          </div>

          {/* Admin Account Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Administrator Account:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAdminEmail('malcolm@complisanc.com');
                  setError(null);
                  setSuccess(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isMalcolm
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 ring-2 ring-amber-400/30'
                    : 'border-[#1b3a78] bg-[#0c1e48] hover:bg-[#122b64] text-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Malcolm Simon</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  malcolm@complisanc.com
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAdminEmail('eric@complisanc.com');
                  setError(null);
                  setSuccess(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  !isMalcolm
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 ring-2 ring-amber-400/30'
                    : 'border-[#1b3a78] bg-[#0c1e48] hover:bg-[#122b64] text-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Eric D'Souza</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  eric@complisanc.com
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Current Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
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
                New Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 characters"
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

              {/* Password Strength Checklist */}
              {newPassword.length > 0 && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#091b42] border border-[#1c3e7b] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Password Strength:</span>
                    <span
                      className={`font-black ${
                        strengthScore >= 4
                          ? 'text-emerald-400'
                          : strengthScore >= 2
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {strengthScore >= 4
                        ? 'Strong (Recommended)'
                        : strengthScore >= 2
                        ? 'Moderate'
                        : 'Weak'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore >= 4
                          ? 'w-full bg-emerald-400'
                          : strengthScore >= 3
                          ? 'w-3/4 bg-amber-400'
                          : strengthScore >= 2
                          ? 'w-2/4 bg-amber-500'
                          : 'w-1/4 bg-rose-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                    <div
                      className={`flex items-center gap-1 ${
                        hasMinLength ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>8+ characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        hasNumber ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>At least 1 number</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        hasUppercase ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        hasSpecial ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Special character</span>
                    </div>
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

            {/* Status Messages */}
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

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || (newPassword.length > 0 && !passwordsMatch)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Updating Credentials...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
