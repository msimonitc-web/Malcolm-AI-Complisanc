import { CourseActivationToken } from '../types';
import { systemAuditLogService } from './systemAuditLogService';

const STORAGE_KEY = 'complisey_activation_tokens';

// Pre-seeded initial tokens for instant testing
export const INITIAL_ACTIVATION_TOKENS: CourseActivationToken[] = [
  {
    token: 'ACT-AML-7821',
    courseIds: ['c-1'],
    courseTitle: 'Seychelles AML/CFT Statutory Fundamentals',
    issuedBy: 'Malcolm Simon',
    issuedToName: 'Marcus Delpech',
    issuedToEmail: 'm.delpech@fiduciary-sey.sc',
    orderId: 'ord-init-1',
    proformaNumber: 'PRO-CS-2026-001',
    issuedAt: '2026-09-14T09:30:00.000Z',
    status: 'active',
  },
  {
    token: 'ACT-CDD-4092',
    courseIds: ['c-2'],
    courseTitle: 'Practical CDD, Beneficial Ownership & High-Risk Profiling',
    issuedBy: "Eric D'Souza",
    issuedToName: 'Nathalie Hoareau',
    issuedToEmail: 'n.hoareau@fiduciary-sey.sc',
    orderId: 'ord-init-2',
    proformaNumber: 'PRO-CS-2026-002',
    issuedAt: '2026-09-15T11:15:00.000Z',
    status: 'active',
  },
  {
    token: 'ACT-PKG-LEVEL1',
    courseIds: ['c-1', 'c-2', 'c-3'],
    courseTitle: 'Level 1: Statutory Compliance Foundations (3 Courses)',
    issuedBy: 'Malcolm Simon',
    issuedToName: 'Victoria Fiduciary Services Team',
    issuedToEmail: 'corp@demo.local',
    orderId: 'ord-init-3',
    proformaNumber: 'PRO-CS-2026-003',
    issuedAt: '2026-09-16T14:00:00.000Z',
    status: 'active',
  },
  {
    token: 'ACT-ALL-2026',
    courseIds: ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6'],
    courseTitle: 'Complete Seychelles AML/CFT Officer Curriculum (All 6 Courses)',
    issuedBy: "Eric D'Souza",
    issuedToName: 'Registered Reporting Entity Learner',
    issuedToEmail: 'compliance@seychelles-csp.sc',
    orderId: 'ord-init-4',
    proformaNumber: 'PRO-CS-2026-004',
    issuedAt: '2026-09-17T08:00:00.000Z',
    status: 'active',
  },
  {
    token: 'PARTNER-LAUNCH-2026',
    courseIds: ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6'],
    courseTitle: 'Level 1 & Level 2 Complete Partner Launch Access',
    issuedBy: 'Malcolm Simon',
    issuedToName: 'Complisey Founding Partner',
    issuedToEmail: 'partner@complisey.com',
    orderId: 'ord-partner-launch',
    proformaNumber: 'PRO-PARTNER-VIP',
    issuedAt: '2026-09-20T00:00:00.000Z',
    status: 'active',
  },
];

class ActivationTokenService {
  private getTokens(): CourseActivationToken[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load activation tokens from storage', e);
    }
    return INITIAL_ACTIVATION_TOKENS;
  }

  private saveTokens(tokens: CourseActivationToken[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch (e) {
      console.warn('Failed to save activation tokens to storage', e);
    }
  }

  public getAllTokens(): CourseActivationToken[] {
    return this.getTokens();
  }

  public getTokensForOrder(orderId: string): CourseActivationToken[] {
    return this.getTokens().filter((t) => t.orderId === orderId);
  }

  public getTokensForCompany(companyName: string): CourseActivationToken[] {
    const clean = companyName.trim().toLowerCase();
    return this.getTokens().filter(
      (t) =>
        t.companyName?.trim().toLowerCase() === clean ||
        t.issuedToName?.trim().toLowerCase().includes(clean)
    );
  }

  public findToken(tokenString: string): CourseActivationToken | undefined {
    const clean = tokenString.trim().toUpperCase();
    return this.getTokens().find((t) => t.token.toUpperCase() === clean);
  }

  /**
   * Generates a single token (individual or ad-hoc)
   */
  public generateToken(params: {
    courseIds: string[];
    courseTitle: string;
    issuedBy: 'Malcolm Simon' | "Eric D'Souza" | 'Eric' | string;
    issuedToName: string;
    issuedToEmail: string;
    orderId?: string;
    proformaNumber?: string;
    taxInvoiceNumber?: string;
    companyName?: string;
    seatNumber?: number;
    totalSeatsInOrder?: number;
    assignedToName?: string;
    assignedToEmail?: string;
  }): CourseActivationToken {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const prefix =
      params.courseIds.length >= 6
        ? 'ALL'
        : params.courseIds.length > 1
        ? 'PKG'
        : params.courseIds[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-3) || 'AML';

    const token = `ACT-${prefix}-${randomCode}`;

    const isSingleSeat = (params.totalSeatsInOrder || 1) === 1;
    const designatedName = params.assignedToName || (isSingleSeat ? params.issuedToName : undefined);
    const designatedEmail = (params.assignedToEmail || (isSingleSeat ? params.issuedToEmail : undefined))?.trim().toLowerCase();

    const newToken: CourseActivationToken = {
      token,
      courseIds: params.courseIds,
      courseTitle: params.courseTitle,
      issuedBy: params.issuedBy,
      issuedToName: params.issuedToName,
      issuedToEmail: params.issuedToEmail,
      orderId: params.orderId,
      proformaNumber: params.proformaNumber,
      taxInvoiceNumber: params.taxInvoiceNumber,
      companyName: params.companyName,
      seatNumber: params.seatNumber || 1,
      totalSeatsInOrder: params.totalSeatsInOrder || 1,
      issuedAt: new Date().toISOString(),
      assignedToName: designatedName,
      assignedToEmail: designatedEmail,
      assignedAt: designatedEmail ? new Date().toISOString() : undefined,
      status: designatedEmail ? 'assigned' : 'active',
      isNonTransferable: true,
    };

    const tokens = this.getTokens();
    const updated = [newToken, ...tokens.filter((t) => t.token !== token)];
    this.saveTokens(updated);

    return newToken;
  }

  /**
   * Generates a full batch of unique, trackable seat tokens for an order with N seats.
   * Ensures every seat has its own distinct token, numbered Seat 1 to N.
   */
  public generateTokensForOrder(params: {
    orderId: string;
    proformaNumber?: string;
    ccsBookingId?: string;
    taxInvoiceNumber?: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    seatCount: number;
    courseIds: string[];
    courseTitle: string;
    issuedBy: 'Malcolm Simon' | "Eric D'Souza" | 'Eric' | string;
  }): CourseActivationToken[] {
    const seatCount = Math.max(1, params.seatCount || 1);
    const existingTokens = this.getTokens().filter((t) => t.orderId === params.orderId);

    if (existingTokens.length >= seatCount) {
      return existingTokens;
    }

    const refRaw = params.proformaNumber || params.ccsBookingId || params.orderId || 'ACT';
    const refCode = refRaw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-5) || 'ORD';

    const newTokens: CourseActivationToken[] = [];
    const now = new Date().toISOString();

    for (let i = 1; i <= seatCount; i++) {
      const existing = existingTokens.find((t) => t.seatNumber === i);
      if (existing) {
        newTokens.push(existing);
        continue;
      }

      const seatPad = String(i).padStart(2, '0');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const tokenString =
        seatCount === 1
          ? `ACT-${refCode}-${randomSuffix}`
          : `ACT-${refCode}-S${seatPad}-${randomSuffix}`;

      const isIndividual = seatCount === 1;
      const tok: CourseActivationToken = {
        token: tokenString,
        courseIds: params.courseIds,
        courseTitle: params.courseTitle,
        issuedBy: params.issuedBy,
        issuedToName: params.companyName || params.contactName,
        issuedToEmail: params.contactEmail,
        orderId: params.orderId,
        proformaNumber: params.proformaNumber,
        taxInvoiceNumber: params.taxInvoiceNumber,
        companyName: params.companyName,
        seatNumber: i,
        totalSeatsInOrder: seatCount,
        issuedAt: now,
        assignedToName: isIndividual ? params.contactName : undefined,
        assignedToEmail: isIndividual ? params.contactEmail.trim().toLowerCase() : undefined,
        assignedAt: isIndividual ? now : undefined,
        status: isIndividual ? 'assigned' : 'active',
        isNonTransferable: true,
      };

      newTokens.push(tok);
    }

    const allCurrent = this.getTokens();
    const otherTokens = allCurrent.filter((t) => t.orderId !== params.orderId);
    const updated = [...newTokens, ...otherTokens];
    this.saveTokens(updated);

    return newTokens;
  }

  /**
   * Assigns a specific seat token to a named employee email.
   * Locks the token so only that email can redeem it.
   */
  public assignToken(
    tokenString: string,
    assignedToName: string,
    assignedToEmail: string
  ): { success: boolean; message: string; token?: CourseActivationToken } {
    const clean = tokenString.trim().toUpperCase();
    const tokens = this.getTokens();
    const target = tokens.find((t) => t.token.toUpperCase() === clean);

    if (!target) {
      return { success: false, message: 'Activation token not found.' };
    }

    if (target.status === 'redeemed') {
      const redeemedDate = target.redeemedAt ? new Date(target.redeemedAt).toLocaleDateString() : '';
      return {
        success: false,
        message: `This seat token was already redeemed by ${target.redeemedByEmail} on ${redeemedDate}. Under academy training rules, active course seats cannot be transferred once training commences.`,
      };
    }

    const updated = tokens.map((t) => {
      if (t.token.toUpperCase() === clean) {
        return {
          ...t,
          assignedToName: assignedToName.trim(),
          assignedToEmail: assignedToEmail.trim().toLowerCase(),
          assignedAt: new Date().toISOString(),
          status: 'assigned' as const,
        };
      }
      return t;
    });

    this.saveTokens(updated);
    const assigned = updated.find((t) => t.token.toUpperCase() === clean);

    systemAuditLogService.logEvent(
      'TOKENS',
      'INFO',
      'TOKEN_ASSIGNED_STAFF',
      assignedToEmail,
      'corporate_manager',
      `Seat ${target.seatNumber || 1} assigned to staff member ${assignedToName} (${assignedToEmail}) under seat policy.`,
      {
        token: target.token,
        seatNumber: target.seatNumber,
        assignedToName,
        assignedToEmail,
        orderId: target.orderId,
      }
    );

    return {
      success: true,
      message: `Seat ${target.seatNumber || 1} successfully assigned to ${assignedToName} (${assignedToEmail}).`,
      token: assigned,
    };
  }

  /**
   * Clears assignment of an unredeemed seat so it can be reassigned.
   */
  public unassignToken(tokenString: string): { success: boolean; message: string; token?: CourseActivationToken } {
    const clean = tokenString.trim().toUpperCase();
    const tokens = this.getTokens();
    const target = tokens.find((t) => t.token.toUpperCase() === clean);

    if (!target) return { success: false, message: 'Token not found.' };
    if (target.status === 'redeemed') {
      return { success: false, message: 'Cannot unassign an already redeemed seat.' };
    }

    const updated = tokens.map((t) => {
      if (t.token.toUpperCase() === clean) {
        return {
          ...t,
          assignedToName: undefined,
          assignedToEmail: undefined,
          assignedAt: undefined,
          status: 'active' as const,
        };
      }
      return t;
    });

    this.saveTokens(updated);

    systemAuditLogService.logEvent(
      'TOKENS',
      'INFO',
      'TOKEN_UNASSIGNED',
      'Corporate Admin',
      'corporate_manager',
      `Seat ${target.seatNumber || 1} allocation cleared for reassignment.`,
      { token: target.token, seatNumber: target.seatNumber, orderId: target.orderId }
    );

    return { success: true, message: 'Seat assignment cleared. Available for allocation.' };
  }

  /**
   * Redeems an activation token with strict identity binding and non-transferability verification.
   */
  public markTokenRedeemed(
    tokenString: string,
    studentEmail: string,
    studentName?: string
  ): { success: boolean; message: string; token?: CourseActivationToken } {
    const clean = tokenString.trim().toUpperCase();
    const tokens = this.getTokens();
    const target = tokens.find((t) => t.token.toUpperCase() === clean);

    if (!target) {
      systemAuditLogService.logEvent(
        'TOKENS',
        'WARNING',
        'TOKEN_INVALID_ATTEMPT',
        studentEmail,
        'student',
        `Failed redemption attempt: invalid token string '${tokenString}' submitted.`,
        { tokenAttempted: tokenString, studentEmail }
      );
      return {
        success: false,
        message: 'Invalid activation token code. Please check the code provided by Complisey Administration or your Compliance Officer.',
      };
    }

    // 1. Guard: Check if token is already redeemed
    if (target.status === 'redeemed') {
      const redeemedDate = target.redeemedAt ? new Date(target.redeemedAt).toLocaleDateString() : 'an earlier date';
      const learnerLabel = target.redeemedByName
        ? `${target.redeemedByName} (${target.redeemedByEmail})`
        : target.redeemedByEmail || 'another registered learner';

      systemAuditLogService.logEvent(
        'TOKENS',
        'WARNING',
        'TOKEN_REDEEM_ALREADY_USED',
        studentEmail,
        'student',
        `Blocked duplicate redemption of ${clean}: Already redeemed on ${redeemedDate} by ${learnerLabel}.`,
        { token: clean, redeemedBy: target.redeemedByEmail, attemptedBy: studentEmail }
      );

      return {
        success: false,
        message: `This activation token was already redeemed on ${redeemedDate} by ${learnerLabel}. Course seat tokens are strictly single-use and non-transferable. Progress records and graduation certificates are permanently bound to the original learner.`,
      };
    }

    // 2. Guard: Check if revoked
    if (target.status === 'revoked') {
      systemAuditLogService.logEvent(
        'TOKENS',
        'WARNING',
        'TOKEN_REVOKED_ATTEMPT',
        studentEmail,
        'student',
        `Attempted redemption of revoked token ${clean}.`,
        { token: clean, studentEmail }
      );
      return {
        success: false,
        message: 'This activation token has been revoked by administration or superseded.',
      };
    }

    // 3. Guard: Check if pre-assigned or bound to a specific learner/employee email (corporate or individual)
    const studentCleanEmail = studentEmail.trim().toLowerCase();
    const lockedEmail = (target.assignedToEmail || (target.totalSeatsInOrder === 1 ? target.issuedToEmail : undefined))?.trim().toLowerCase();

    if (lockedEmail && lockedEmail !== studentCleanEmail) {
      const lockedName = target.assignedToName || target.issuedToName || 'the designated learner';
      const isIndiv = (target.totalSeatsInOrder || 1) === 1;

      systemAuditLogService.logEvent(
        'TOKENS',
        'CRITICAL',
        'TOKEN_TRANSFER_BLOCKED',
        studentEmail,
        'student',
        `Seat token ${clean} is registered to ${lockedEmail}. Attempted redemption by unassigned account ${studentCleanEmail}.`,
        {
          token: clean,
          lockedEmail,
          lockedName,
          attemptedEmail: studentCleanEmail,
          policy: 'Academy Seat Policy',
        }
      );

      return {
        success: false,
        message: isIndiv
          ? `Non-Transferable Individual Seat: This enrollment token is registered specifically to ${lockedName} (${lockedEmail}). You are currently authenticated as ${studentEmail}. Course seats, exam access, and graduation certificates are strictly personal and cannot be transferred to another individual.`
          : `Non-Transferable Seat: This corporate seat token is assigned specifically to ${lockedName} (${lockedEmail}). You are currently authenticated as ${studentEmail}. Course seats cannot be transferred once allocated. Please log in with your assigned address.`,
      };
    }

    // 4. Bind and redeem
    const now = new Date().toISOString();
    const updated = tokens.map((t) => {
      if (t.token.toUpperCase() === clean) {
        return {
          ...t,
          status: 'redeemed' as const,
          redeemedAt: now,
          redeemedByEmail: studentCleanEmail,
          redeemedByName: studentName || t.assignedToName || t.issuedToName,
          isNonTransferable: true,
        };
      }
      return t;
    });

    this.saveTokens(updated);
    const redeemedToken = updated.find((t) => t.token.toUpperCase() === clean);

    systemAuditLogService.logEvent(
      'TOKENS',
      'INFO',
      'TOKEN_REDEEM_SUCCESS',
      studentCleanEmail,
      'student',
      `Seat token ${clean} successfully activated and bound to ${studentName || studentCleanEmail} for course(s): ${target.courseIds.join(', ')}.`,
      {
        token: clean,
        courseIds: target.courseIds,
        courseTitle: target.courseTitle,
        studentEmail: studentCleanEmail,
        studentName: studentName || target.assignedToName || target.issuedToName,
        orderId: target.orderId,
      }
    );

    return {
      success: true,
      message: 'Course seat successfully activated and bound to your student profile.',
      token: redeemedToken,
    };
  }

  public buildActivationUrl(token: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://academy.complisey.com';
    return `${origin}/?activate=${encodeURIComponent(token.trim().toUpperCase())}`;
  }

  /**
   * Builds formatted clipboard copy text for a batch or single seat token for sending to client HR/MLRO or individual learner.
   */
  public buildBulkTokensText(tokens: CourseActivationToken[], entityOrLearnerName: string): string {
    const isSingle = tokens.length === 1;
    const lines = [
      `COMPLISEY ACADEMY - OFFICIAL SEAT ACTIVATION ROSTER`,
      isSingle ? `Designated Learner: ${entityOrLearnerName}` : `Client / Entity: ${entityOrLearnerName}`,
      `Total Authorized Seats: ${tokens.length}`,
      `Program: Seychelles AML/CFT Professional Training`,
      `Policy: Course seat tokens and certificates are strictly single-use and non-transferable.`,
      `--------------------------------------------------------------------------------`,
    ];

    tokens.forEach((tok) => {
      const seatNo = tok.seatNumber ? `Seat #${tok.seatNumber}` : 'Seat';
      const statusLabel = tok.status === 'redeemed' 
        ? `[REDEEMED by ${tok.redeemedByEmail}]` 
        : tok.status === 'assigned' 
        ? `[REGISTERED to ${tok.assignedToEmail}]` 
        : '[AVAILABLE]';
      const link = this.buildActivationUrl(tok.token);

      lines.push(`${seatNo}: ${tok.token} ${statusLabel}`);
      lines.push(`  Direct Activation URL: ${link}`);
      if (tok.assignedToName) {
        lines.push(`  Designated Learner: ${tok.assignedToName} (${tok.assignedToEmail})`);
      }
      lines.push('');
    });

    lines.push(`Instructions for Learner:`);
    lines.push(`1. Click the Direct Activation URL above or visit https://academy.complisey.com`);
    lines.push(`2. If prompted, enter the designated Token Code.`);
    lines.push(`3. Seat will be permanently locked to your verified profile for official certificate issuance.`);

    return lines.join('\n');
  }

  public clearAllTokens(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear activation tokens:', e);
    }
  }
}

export const activationTokenService = new ActivationTokenService();
