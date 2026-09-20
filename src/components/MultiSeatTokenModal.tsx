import React, { useState, useMemo } from 'react';
import {
  X,
  Users,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Download,
  Search,
  UserCheck,
  Lock,
  Mail,
  User,
  AlertCircle,
  Clock,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { EnrollmentOrder, CourseActivationToken } from '../types';
import { useAcademy } from '../context/AcademyContext';
import { activationTokenService } from '../services/activationTokenService';

interface MultiSeatTokenModalProps {
  order: EnrollmentOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MultiSeatTokenModal: React.FC<MultiSeatTokenModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { activationTokens, assignActivationToken, unassignActivationToken } = useAcademy();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Assignment modal / edit state
  const [assigningToken, setAssigningToken] = useState<CourseActivationToken | null>(null);
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [assigneeEmail, setAssigneeEmail] = useState<string>('');
  const [assignError, setAssignError] = useState<string | null>(null);

  // Filter tokens belonging to this order
  const orderTokens = useMemo(() => {
    if (!order) return [];
    return activationTokens.filter((t) => t.orderId === order.id);
  }, [activationTokens, order]);

  // Derived metrics
  const stats = useMemo(() => {
    const total = order?.seatCount || orderTokens.length || 1;
    const redeemed = orderTokens.filter((t) => t.status === 'redeemed').length;
    const assigned = orderTokens.filter((t) => t.status === 'assigned').length;
    const available = orderTokens.filter((t) => t.status === 'active').length;
    return { total, redeemed, assigned, available };
  }, [order, orderTokens]);

  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return orderTokens;
    const q = searchQuery.toLowerCase();
    return orderTokens.filter(
      (t) =>
        t.token.toLowerCase().includes(q) ||
        (t.assignedToName && t.assignedToName.toLowerCase().includes(q)) ||
        (t.assignedToEmail && t.assignedToEmail.toLowerCase().includes(q)) ||
        (t.redeemedBy && t.redeemedBy.toLowerCase().includes(q)) ||
        (t.seatNumber && `seat ${t.seatNumber}`.includes(q))
    );
  }, [orderTokens, searchQuery]);

  if (!isOpen || !order) return null;

  const isIndividual = (order.seatCount || 1) === 1 || !order.companyName || order.companyName.trim() === '';

  const handleCopyAll = () => {
    const bulkText = activationTokenService.buildBulkTokensText(orderTokens, order.companyName || order.contactName);
    navigator.clipboard.writeText(bulkText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = [
      'Seat Number',
      'Total Seats',
      'Activation Token Code',
      'Status',
      'Non-Transferable',
      isIndividual ? 'Designated Learner Name' : 'Assigned Employee Name',
      isIndividual ? 'Designated Learner Email' : 'Assigned Corporate Email',
      'Redeemed By Email',
      'Redeemed Date',
      'Course Title',
      'Proforma Number',
      'Tax Invoice Number',
      'Direct Activation URL',
    ];

    const rows = orderTokens.map((t) => [
      t.seatNumber || 1,
      t.totalSeatsInOrder || order.seatCount,
      t.token,
      t.status.toUpperCase(),
      t.isNonTransferable ? 'YES (Statutory Locked)' : 'NO',
      `"${t.assignedToName || ''}"`,
      `"${t.assignedToEmail || ''}"`,
      `"${t.redeemedBy || ''}"`,
      `"${t.redeemedAt || ''}"`,
      `"${t.courseTitle}"`,
      `"${t.proformaNumber || order.proformaNumber}"`,
      `"${t.taxInvoiceNumber || order.taxInvoiceNumber || ''}"`,
      activationTokenService.buildActivationUrl(t.token),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const entitySlug = (order.companyName || order.contactName || 'individual').toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `complisey-tokens-${entitySlug}-${order.proformaNumber}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAssignModal = (token: CourseActivationToken) => {
    setAssigningToken(token);
    setAssigneeName(token.assignedToName || '');
    setAssigneeEmail(token.assignedToEmail || '');
    setAssignError(null);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningToken) return;

    if (!assigneeName.trim() || !assigneeEmail.trim()) {
      setAssignError('Please provide both the staff member name and corporate email address.');
      return;
    }

    if (!assigneeEmail.includes('@')) {
      setAssignError('Please enter a valid email address.');
      return;
    }

    const res = assignActivationToken(assigningToken.token, assigneeName.trim(), assigneeEmail.trim().toLowerCase());
    if (!res.success) {
      setAssignError(res.message);
      return;
    }

    setAssigningToken(null);
  };

  const handleUnassign = (token: CourseActivationToken) => {
    if (confirm(`Remove assignment for ${token.assignedToName || token.assignedToEmail}? This seat will become available for another staff member.`)) {
      unassignActivationToken(token.token);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#071433] border border-slate-200 dark:border-blue-900/60 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-blue-900/40 bg-slate-50/80 dark:bg-[#0a1e4d]/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400">
              {isIndividual ? <UserCheck className="w-6 h-6" /> : <Users className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isIndividual
                    ? 'Individual Seat Token & Statutory Audit Record'
                    : 'Corporate Seat Tokens & Statutory Audit Roster'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                  {isIndividual ? '1 Non-Transferable Seat' : `${order.seatCount} Seats Provisioned`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                <strong>{order.companyName || order.contactName}</strong> {order.contactEmail && `(${order.contactEmail})`} · Proforma Ref: <span className="font-mono">{order.proformaNumber}</span> · Course: <span className="font-semibold text-slate-700 dark:text-slate-200">{order.courseTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit & Compliance Notice Banner */}
        <div className="px-6 py-3 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-200/60 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Seat Non-Transferability Policy:</strong>{' '}
              {isIndividual
                ? `This individual enrollment is strictly single-use and bound exclusively to ${order.contactName} (${order.contactEmail}). Course seats, exam sitting, and completion certificates cannot be transferred or reassigned to another individual.`
                : `Each token represents a single accredited seat. Pre-assigning locks redemption strictly to that staff member's email. Once redeemed, it permanently binds to the learner's compliance transcript.`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c245c] hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied!' : isIndividual ? 'Copy Token & URL' : 'Copy Email Roster'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Pill Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 border-b border-slate-200 dark:border-blue-900/30 bg-slate-50/40 dark:bg-[#050e24]/40">
          <div className="p-3 bg-white dark:bg-[#0a1e4d]/70 border border-slate-200 dark:border-blue-900/40 rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Order Seats
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.total}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#0a1e4d]/70 border border-slate-200 dark:border-blue-900/40 rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Available Seats
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {stats.available}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#0a1e4d]/70 border border-slate-200 dark:border-blue-900/40 rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pre-Assigned (Pending)
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {stats.assigned}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#0a1e4d]/70 border border-slate-200 dark:border-blue-900/40 rounded-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Redeemed &amp; Locked
            </span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {stats.redeemed}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-blue-900/30 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by seat #, token code, staff name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0c245c]/50 border border-slate-200 dark:border-blue-900 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong>{filteredTokens.length}</strong> of {orderTokens.length} seat tokens
          </span>
        </div>

        {/* Token Table */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
              No activation tokens matched your search criteria.
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-blue-900/40 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#0c245c]/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-blue-900/40">
                    <th className="py-2.5 px-3">Seat #</th>
                    <th className="py-2.5 px-3">Activation Token</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">{isIndividual ? 'Designated Learner & Email' : 'Designated Employee & Email'}</th>
                    <th className="py-2.5 px-3">Statutory Lock</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-blue-900/20">
                  {filteredTokens.map((token) => {
                    const activationUrl = activationTokenService.buildActivationUrl(token.token);
                    const isRedeemed = token.status === 'redeemed';
                    const isAssigned = token.status === 'assigned';

                    return (
                      <tr
                        key={token.token}
                        className="hover:bg-slate-50/80 dark:hover:bg-blue-950/20 transition-colors"
                      >
                        {/* Seat # */}
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0c245c] text-slate-700 dark:text-blue-200 border border-slate-200 dark:border-blue-800">
                            Seat #{token.seatNumber || 1}
                          </span>
                        </td>

                        {/* Token Code */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded-md text-[11px]">
                              {token.token}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(token.token);
                                setCopiedToken(token.token);
                                setTimeout(() => setCopiedToken(null), 2000);
                              }}
                              title="Copy token code"
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              {copiedToken === token.token ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(activationUrl);
                                setCopiedLink(token.token);
                                setTimeout(() => setCopiedLink(null), 2000);
                              }}
                              title="Copy direct activation URL"
                              className="p-1 rounded text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                            >
                              {copiedLink === token.token ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <ExternalLink className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {isAssigned && token.assignedToEmail && (
                              <a
                                href={`mailto:${token.assignedToEmail}?subject=${encodeURIComponent(
                                  `Complisey Academy — Your AML/CFT Course Activation Token (${order.companyName || order.contactName})`
                                )}&body=${encodeURIComponent(
                                  `Dear ${token.assignedToName || order.contactName || 'Learner'},\n\n` +
                                  `Your course seat for "${token.courseTitle}" at Complisey Academy has been activated${order.companyName ? ` under ${order.companyName}` : ''}.\n\n` +
                                  `Seat Information:\n` +
                                  `• Seat Number: ${token.seatNumber || 1} of ${order.seatCount}\n` +
                                  `• Activation Token: ${token.token}\n` +
                                  `• Designated Learner: ${token.assignedToName || order.contactName} (${token.assignedToEmail})\n\n` +
                                  `Direct Activation Link:\n` +
                                  `${activationUrl}\n\n` +
                                  `Seat Non-Transferability Policy:\n` +
                                  `This seat token is strictly single-use and bound exclusively to your email (${token.assignedToEmail}). Training progress and official completion certificates are non-transferable once registered.\n\n` +
                                  `Complisey Academy Administration`
                                )}`}
                                title={`Email token instructions directly to ${token.assignedToEmail}`}
                                className="p-1 rounded text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          {isRedeemed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-semibold text-[10px] border border-blue-300 dark:border-blue-700">
                              <UserCheck className="w-3 h-3" />
                              <span>Redeemed · In Study</span>
                            </span>
                          ) : isAssigned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-semibold text-[10px] border border-amber-300 dark:border-amber-700">
                              <Clock className="w-3 h-3" />
                              <span>{isIndividual ? 'Registered · Awaiting Activation' : 'Assigned · Awaiting Activation'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-300 dark:border-emerald-700">
                              <Check className="w-3 h-3" />
                              <span>Available for Staff</span>
                            </span>
                          )}
                        </td>

                        {/* Designated Employee */}
                        <td className="py-3 px-3">
                          {isRedeemed ? (
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                {token.redeemedByName || token.redeemedByEmail || token.redeemedBy}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                Redeemed: {token.redeemedAt ? new Date(token.redeemedAt).toLocaleDateString() : 'Active'}
                              </div>
                            </div>
                          ) : isAssigned ? (
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                {token.assignedToName || order.contactName}
                              </div>
                              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                {token.assignedToEmail}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned (Open for any firm staff)</span>
                          )}
                        </td>

                        {/* Statutory Non-Transferability Lock */}
                        <td className="py-3 px-3">
                          {isRedeemed ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Permanently Bound</span>
                            </span>
                          ) : isAssigned ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                              <Lock className="w-3 h-3" />
                              <span>Locked to Email</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Open</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          {isRedeemed ? (
                            <span className="text-[11px] text-slate-400 italic">Redeemed</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenAssignModal(token)}
                                className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                {isAssigned ? (isIndividual ? 'Edit Learner' : 'Edit Staff') : (isIndividual ? 'Assign Learner' : 'Assign Staff')}
                              </button>
                              {isAssigned && (
                                <button
                                  onClick={() => handleUnassign(token)}
                                  className="px-2 py-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold cursor-pointer transition-colors"
                                  title="Unassign this seat"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-blue-900/40 bg-slate-50/80 dark:bg-[#0a1e4d]/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              All seats issue verified completion certificates with cryptographic validation.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition-colors cursor-pointer"
          >
            Close Roster
          </button>
        </div>
      </div>

      {/* Assign Staff Submodal */}
      {assigningToken && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#071433] border border-slate-200 dark:border-blue-900 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-blue-900">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isIndividual ? `Designate Learner for Seat #${assigningToken.seatNumber || 1}` : `Assign Staff to Seat #${assigningToken.seatNumber || 1}`}
                </h4>
              </div>
              <button
                onClick={() => setAssigningToken(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4 pt-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Token <strong className="font-mono">{assigningToken.token}</strong> will <strong>strictly</strong> be redeemable by the email address designated below.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {isIndividual ? 'Learner Full Legal Name' : 'Staff Member Full Legal Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nathalie Hoareau"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0c245c] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {isIndividual ? 'Learner Email Address (Identity Lock)' : 'Corporate Staff Email (Identity Lock)'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. n.hoareau@company.sc"
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0c245c] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {isIndividual
                    ? 'The learner must sign in with this exact email to activate the curriculum and sit examinations.'
                    : 'The staff member must sign in with this exact email to activate the curriculum.'}
                </p>
              </div>

              {assignError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-800 dark:text-rose-200 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{assignError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningToken(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Lock Seat to Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
