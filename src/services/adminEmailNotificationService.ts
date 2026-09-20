import { doc, setDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db, ensureFirebaseAuth } from '../lib/firebase';
import { EnrollmentOrder } from '../types';
import { INITIAL_ORDERS } from '../data/bankingDetails';
import { systemAuditLogService } from './systemAuditLogService';

export interface ResendStatusInfo {
  service: string;
  configured: boolean;
  sender: string;
  activeMode: 'live' | 'simulated';
  monthlyAllowance: string;
  dailyAllowance: string;
  timestamp: string;
}

/**
 * Utility to dispatch an email payload through the server-side Resend proxy
 */
async function dispatchViaResendApi(payload: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  category: string;
  metadata?: Record<string, string>;
}): Promise<{ success: boolean; mode: 'live' | 'simulated'; id?: string; error?: string }> {
  try {
    let csrfToken =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1] || '';

    if (!csrfToken && typeof window !== 'undefined') {
      try {
        const tokenRes = await fetch('/api/csrf-token');
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          csrfToken = tokenData.csrfToken || '';
        }
      } catch {
        // Continue with best effort
      }
    }

    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, mode: 'simulated', error: errData.error || `HTTP ${res.status}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[Resend API Warning]', msg);
    return { success: false, mode: 'simulated', error: msg };
  }
}


export interface AdminEmailNotification {
  id: string;
  orderId: string;
  proformaNumber: string;
  ccsBookingId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  companyName: string;
  companyAddress?: string;
  coursePackageTitle: string;
  courseId: string;
  seatCount: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  recipientEmails: string[];
  subject: string;
  htmlContent: string;
  textContent: string;
  status: 'sent' | 'delivered';
  notes?: string;
  sentAt: string;
  isRead?: boolean;
}

// Canonical admin notification recipients for Malcolm Simon & Eric D'Souza
export const DEFAULT_ADMIN_EMAILS = [
  'msimonitc@gmail.com',
  'malcolm@complisanc.com',
  'eric@complisanc.com',
];

const LOCAL_STORAGE_KEY = 'complisey_admin_notifications_v1';

class AdminEmailNotificationService {
  private listeners: Set<(notifications: AdminEmailNotification[]) => void> = new Set();
  private notificationsCache: AdminEmailNotification[] = [];

  constructor() {
    this.loadInitialFromStorage();
  }

  private loadInitialFromStorage() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        this.notificationsCache = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load local admin notifications:', e);
      this.notificationsCache = [];
    }

    if (this.notificationsCache.length === 0) {
      INITIAL_ORDERS.forEach((ord) => {
        const { subject, textContent, htmlContent } = this.generateEmailTemplates(ord, DEFAULT_ADMIN_EMAILS);
        this.notificationsCache.push({
          id: `notif_${ord.id}`,
          orderId: ord.id,
          proformaNumber: ord.proformaNumber,
          ccsBookingId: ord.ccsBookingId,
          studentName: ord.contactName,
          studentEmail: ord.contactEmail,
          studentPhone: ord.contactPhone || '',
          companyName: ord.companyName,
          companyAddress: ord.companyAddress || '',
          coursePackageTitle: ord.courseTitle,
          courseId: ord.courseId,
          seatCount: ord.seatCount,
          unitPrice: ord.unitPrice,
          totalAmount: ord.totalAmount,
          currency: ord.currency,
          recipientEmails: DEFAULT_ADMIN_EMAILS,
          subject,
          htmlContent,
          textContent,
          status: 'delivered',
          notes: ord.notes,
          sentAt: ord.createdAt,
          isRead: ord.status === 'activated',
        });
      });
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.notificationsCache));
    } catch (e) {
      console.warn('Could not persist admin notifications to storage:', e);
    }
  }

  public getNotifications(): AdminEmailNotification[] {
    return [...this.notificationsCache];
  }

  public subscribe(callback: (notifications: AdminEmailNotification[]) => void): () => void {
    this.listeners.add(callback);
    callback([...this.notificationsCache]);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    const data = [...this.notificationsCache];
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('Error executing notification listener:', err);
      }
    });
  }

  /**
   * Generates plaintext and HTML email bodies for proforma invoice notification.
   */
  public generateEmailTemplates(order: EnrollmentOrder, recipients: string[] = DEFAULT_ADMIN_EMAILS) {
    const formattedAmount = `SCR ${order.totalAmount.toLocaleString('en-US')}`;
    const formattedUnitPrice = `SCR ${order.unitPrice.toLocaleString('en-US')}`;
    const subject = `[ACTION REQUIRED] New Proforma Invoice ${order.proformaNumber} - ${order.companyName} (${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''}) - ${formattedAmount}`;

    const lineItemsText = order.items && order.items.length > 0
      ? order.items.map((it, idx) => `Item ${idx + 1}: ${it.courseTitle} | ${it.seatCount} Seat(s) @ ${order.currency || 'SCR'} ${it.unitPrice.toLocaleString()} = ${order.currency || 'SCR'} ${it.totalAmount.toLocaleString()}`).join('\n')
      : `Package / Course   : ${order.courseTitle}\nPrepaid Seats      : ${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''} (12-Month Access)\nUnit Price / Seat  : ${formattedUnitPrice}`;

    const textContent = `
COMPLISEY ACADEMY - AUTOMATED ADMIN NOTIFICATION
=====================================================
New Proforma Invoice Request Triggered by Student

A student has generated a proforma invoice request on the Complisey Academy platform.
Please review the student details and selected course package below.

1. PROFORMA & TRANSACTION DETAILS
-----------------------------------------------------
Proforma Invoice #: ${order.proformaNumber}
CCS Booking ID     : ${order.ccsBookingId || order.bankReferenceCode}
Bank Reference Code: ${order.bankReferenceCode}
Generated Date     : ${new Date(order.createdAt).toLocaleString()}
Current Status     : Pending Seychelles Bank Wire Transfer

2. STUDENT / REPORTING ENTITY DETAILS
-----------------------------------------------------
Contact Person     : ${order.contactName}
Contact Email      : ${order.contactEmail}
Contact Phone      : ${order.contactPhone || 'Not provided'}
Reporting Entity   : ${order.companyName}
Registered Address : ${order.companyAddress || 'Republic of Seychelles'}
Special Notes      : ${order.notes || 'None provided'}

3. SELECTED ITEMS & PRICING
-----------------------------------------------------
${lineItemsText}
Total Seats        : ${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''}
Total Amount Due   : ${formattedAmount} (Seychelles Rupees)
Payment Terms      : Advance Bank Wire to The Mauritius Commercial Bank (Seychelles) Ltd.

4. ADMINISTRATIVE ACTION REQUIRED
-----------------------------------------------------
1. Check Complisey's MCB Seychelles bank account (A/C: 00001073508) for credit quoting reference "${order.bankReferenceCode}".
2. Once funds are cleared, navigate to the Complisey Admin Portal.
3. Click "Activate Seats" on order ${order.proformaNumber} to dispatch LMS credentials and automatically dispatch the client's Official Receipt Confirmation.

Dispatch Recipients: ${recipients.join(', ')}
Automated Notification System · Complisanc Consulting Services (SEY)
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #071433; color: #ffffff; padding: 24px; text-align: left; }
    .badge { display: inline-block; background: #fbbf24; color: #071433; padding: 4px 10px; border-radius: 4px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .title { font-size: 20px; font-weight: 800; margin-top: 12px; margin-bottom: 4px; color: #ffffff; }
    .subtitle { font-size: 13px; color: #cbd5e1; margin: 0; }
    .content { padding: 24px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
    .info-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .info-table td.label { font-weight: 600; color: #475569; width: 35%; background: #f8fafc; }
    .info-table td.value { color: #0f172a; font-weight: 500; }
    .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 16px 0; }
    .highlight-title { font-size: 13px; font-weight: 800; color: #166534; margin-bottom: 4px; }
    .highlight-desc { font-size: 12px; color: #15803d; margin: 0; }
    .btn { display: inline-block; background: #071433; color: #fbbf24; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; margin-top: 12px; }
    .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Proforma Request Alert</span>
      <h1 class="title">New Proforma Invoice Generated</h1>
      <p class="subtitle">Booking Ref: <strong>${order.ccsBookingId || order.bankReferenceCode}</strong> · ${new Date(order.createdAt).toLocaleDateString()}</p>
    </div>

    <div class="content">
      <p style="font-size: 13px; color: #334155; margin-top: 0;">
        A student has requested a Proforma Invoice for prepaid AML/CFT seat enrolment. Please record the details for bank reconciliation and audit readiness.
      </p>

      <div class="section-title">1. Student &amp; Reporting Entity</div>
      <table class="info-table">
        <tr>
          <td class="label">Student / Contact</td>
          <td class="value"><strong>${order.contactName}</strong></td>
        </tr>
        <tr>
          <td class="label">Contact Email</td>
          <td class="value"><a href="mailto:${order.contactEmail}" style="color: #0c245c; text-decoration: underline;">${order.contactEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Phone</td>
          <td class="value">${order.contactPhone || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Reporting Entity</td>
          <td class="value"><strong>${order.companyName}</strong></td>
        </tr>
        <tr>
          <td class="label">Entity Address</td>
          <td class="value">${order.companyAddress || 'Republic of Seychelles'}</td>
        </tr>
      </table>

      <div class="section-title">2. Selected Package &amp; Pricing</div>
      ${order.items && order.items.length > 0 ? `
      <table class="info-table" style="margin-bottom: 8px;">
        <thead>
          <tr style="background: #f1f5f9; font-size: 11px; text-transform: uppercase;">
            <th style="padding: 6px 8px; text-align: left;">Item</th>
            <th style="padding: 6px 8px; text-align: center;">Seats</th>
            <th style="padding: 6px 8px; text-align: right;">Unit Rate</th>
            <th style="padding: 6px 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((it, idx) => `
          <tr style="background: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
            <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${it.courseTitle}</td>
            <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${it.seatCount}</td>
            <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">SCR ${it.unitPrice.toLocaleString()}</td>
            <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">SCR ${it.totalAmount.toLocaleString()}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
      <table class="info-table">
        <tr>
          <td class="label">Total Seats</td>
          <td class="value"><strong>${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''}</strong></td>
        </tr>
        <tr>
          <td class="label">Total Payable</td>
          <td class="value" style="font-size: 15px; font-weight: 800; color: #071433;">${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Payment Mode</td>
          <td class="value">Direct Bank Wire (Seychelles Rupees)</td>
        </tr>
      </table>
      ` : `
      <table class="info-table">
        <tr>
          <td class="label">Course Package</td>
          <td class="value"><strong>${order.courseTitle}</strong></td>
        </tr>
        <tr>
          <td class="label">Prepaid Seats</td>
          <td class="value"><strong>${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''}</strong> (12-Month Access)</td>
        </tr>
        <tr>
          <td class="label">Unit Rate</td>
          <td class="value">${formattedUnitPrice} / seat</td>
        </tr>
        <tr>
          <td class="label">Total Payable</td>
          <td class="value" style="font-size: 15px; font-weight: 800; color: #071433;">${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Payment Mode</td>
          <td class="value">Direct Bank Wire (Seychelles Rupees)</td>
        </tr>
      </table>
      `}

      <div class="highlight-box">
        <div class="highlight-title">Bank Reconciliation Instruction</div>
        <p class="highlight-desc">
          Expected bank wire reference: <strong>${order.bankReferenceCode}</strong>. When payment is verified in The Mauritius Commercial Bank (Seychelles) Ltd. (Account 00001073508), activate the order in the Admin Portal to dispatch LMS access and student receipt confirmation.
        </p>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 12px; color: #64748b;">Notification automatically dispatched to: <strong>${recipients.join(', ')}</strong></span>
      </div>
    </div>

    <div class="footer">
      Complisanc Consulting Services (SEY) trading as Complisey · Victoria, Mahé, Republic of Seychelles · Reg # 842109
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, textContent, htmlContent };
  }

  /**
   * Main trigger method: called whenever a student generates a proforma invoice.
   */
  public async triggerProformaNotification(
    order: EnrollmentOrder,
    recipients: string[] = DEFAULT_ADMIN_EMAILS
  ): Promise<AdminEmailNotification> {
    const { subject, textContent, htmlContent } = this.generateEmailTemplates(order, recipients);

    const notificationId = `notif_${order.id || Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const notification: AdminEmailNotification = {
      id: notificationId,
      orderId: order.id,
      proformaNumber: order.proformaNumber,
      ccsBookingId: order.ccsBookingId || order.bankReferenceCode,
      studentName: order.contactName,
      studentEmail: order.contactEmail,
      studentPhone: order.contactPhone || '',
      companyName: order.companyName,
      companyAddress: order.companyAddress || '',
      coursePackageTitle: order.courseTitle,
      courseId: order.courseId,
      seatCount: order.seatCount,
      unitPrice: order.unitPrice,
      totalAmount: order.totalAmount,
      currency: order.currency || 'SCR',
      recipientEmails: recipients,
      subject,
      htmlContent,
      textContent,
      status: 'delivered',
      notes: order.notes,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    // 1. Add to local cache immediately
    this.notificationsCache = [notification, ...this.notificationsCache.filter((n) => n.orderId !== order.id)];
    this.saveToStorage();
    this.notifyListeners();

    // 2. Persist to Firestore for durable multi-device admin audit trail
    try {
      await ensureFirebaseAuth();
      const docRef = doc(db, 'admin_notifications', notification.id);
      await setDoc(docRef, {
        id: notification.id,
        orderId: notification.orderId,
        proformaNumber: notification.proformaNumber,
        ccsBookingId: notification.ccsBookingId,
        studentName: notification.studentName,
        studentEmail: notification.studentEmail,
        studentPhone: notification.studentPhone || '',
        companyName: notification.companyName,
        companyAddress: notification.companyAddress || '',
        coursePackageTitle: notification.coursePackageTitle,
        courseId: notification.courseId,
        seatCount: notification.seatCount,
        unitPrice: notification.unitPrice,
        totalAmount: notification.totalAmount,
        currency: notification.currency,
        recipientEmails: notification.recipientEmails,
        subject: notification.subject,
        htmlContent: notification.htmlContent,
        textContent: notification.textContent,
        status: notification.status,
        notes: notification.notes || '',
        sentAt: notification.sentAt,
      });
      console.log(`[Admin Notification] Dispatched & synced to Firestore: ${notification.id} for ${notification.proformaNumber}`);
    } catch (firestoreErr) {
      console.warn('[Admin Notification] Local cache saved; Firestore sync notice:', firestoreErr);
    }

    // 3. Dispatch via Resend Transactional Email Engine
    dispatchViaResendApi({
      to: notification.recipientEmails,
      subject: notification.subject,
      html: notification.htmlContent,
      text: notification.textContent,
      category: 'proforma_admin_alert',
      metadata: {
        orderId: notification.orderId,
        proformaNumber: notification.proformaNumber,
      },
    }).then((result) => {
      systemAuditLogService.logEvent(
        'BILLING',
        'INFO',
        result.mode === 'live' ? 'EMAIL_DISPATCHED_RESEND_LIVE' : 'EMAIL_DISPATCHED_RESEND_SIMULATED',
        'Resend Email Engine',
        'system',
        `Automated proforma alert email dispatched to ${notification.recipientEmails.join(', ')} for ${notification.proformaNumber} (${result.mode.toUpperCase()}${result.id ? ` - ID: ${result.id}` : ''})`,
        {
          orderId: notification.orderId,
          proformaNumber: notification.proformaNumber,
          recipients: notification.recipientEmails,
          mode: result.mode,
          resendMessageId: result.id,
          success: result.success,
        }
      );
    });

    // 4. Also dispatch official Proforma Invoice with MCB Seychelles wiring instructions directly to Client
    if (order.contactEmail && !notification.recipientEmails.includes(order.contactEmail)) {
      const clientSubject = `[Proforma Invoice & Bank Details] Complisey Academy — ${order.proformaNumber} (${order.companyName})`;
      dispatchViaResendApi({
        to: order.contactEmail,
        subject: clientSubject,
        html: notification.htmlContent,
        text: notification.textContent,
        category: 'client_proforma_invoice',
        metadata: {
          orderId: order.id,
          proformaNumber: order.proformaNumber,
          recipient: order.contactEmail,
        },
      }).then((result) => {
        systemAuditLogService.logEvent(
          'BILLING',
          'INFO',
          result.mode === 'live' ? 'CLIENT_PROFORMA_DISPATCHED_RESEND_LIVE' : 'CLIENT_PROFORMA_DISPATCHED_RESEND_SIMULATED',
          'Resend Email Engine',
          'system',
          `Proforma invoice & MCB bank transfer details dispatched to client ${order.contactEmail} (${result.mode.toUpperCase()}${result.id ? ` - ID: ${result.id}` : ''})`,
          {
            orderId: order.id,
            proformaNumber: order.proformaNumber,
            recipient: order.contactEmail,
            mode: result.mode,
            resendMessageId: result.id,
            success: result.success,
          }
        );
      });
    }

    return notification;
  }

  /**
   * Check configuration health and quota status of Resend
   */
  public async checkResendStatus(): Promise<ResendStatusInfo | null> {
    try {
      const res = await fetch('/api/email/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Resend Status Query]', e);
    }
    return null;
  }

  /**
   * Dispatch a test verification email via Resend to Malcolm Simon and Eric D'Souza
   */
  public async sendTestVerificationEmail(recipients: string[] = DEFAULT_ADMIN_EMAILS) {
    const csrfToken =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1] || '';

    const res = await fetch('/api/email/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ recipients }),
    });

    if (res.ok) {
      const data = await res.json();
      const dispatchedList = Array.isArray(data.testRecipients) ? data.testRecipients.join(', ') : recipients.join(', ');
      systemAuditLogService.logEvent(
        'SYSTEM',
        'INFO',
        'RESEND_TEST_DISPATCH',
        'Malcolm Simon',
        'admin',
        `Admin test dispatch executed via Resend to ${dispatchedList} (Mode: ${data.mode?.toUpperCase()})`,
        data
      );
      return data;
    }
    throw new Error('Failed to dispatch test email');
  }

  /**
   * Fetch recent notifications from Firestore if available
   */
  public async syncFromFirestore(): Promise<AdminEmailNotification[]> {
    try {
      await ensureFirebaseAuth();
      const colRef = collection(db, 'admin_notifications');
      const q = query(colRef, orderBy('sentAt', 'desc'), limit(50));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const remoteItems: AdminEmailNotification[] = [];
        snap.forEach((docSnap) => {
          remoteItems.push(docSnap.data() as AdminEmailNotification);
        });

        // Merge with local items
        const existingIds = new Set(this.notificationsCache.map((n) => n.id));
        const newOnes = remoteItems.filter((r) => !existingIds.has(r.id));
        if (newOnes.length > 0) {
          this.notificationsCache = [...newOnes, ...this.notificationsCache];
          this.saveToStorage();
          this.notifyListeners();
        }
      }
    } catch (e) {
      console.warn('Could not sync admin notifications from Firestore:', e);
    }
    return this.notificationsCache;
  }

  /**
   * Mark a notification as read
   */
  public markAsRead(id: string) {
    this.notificationsCache = this.notificationsCache.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Mark all notifications as read
   */
  public markAllAsRead() {
    this.notificationsCache = this.notificationsCache.map((n) => ({ ...n, isRead: true }));
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Helper to construct a mailto link with prefilled subject and body
   */
  public getMailtoUrl(notification: AdminEmailNotification): string {
    const to = notification.recipientEmails.join(',');
    const subject = encodeURIComponent(notification.subject);
    const body = encodeURIComponent(notification.textContent);
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }
}

export const adminEmailNotificationService = new AdminEmailNotificationService();

// ============================================================================
// CLIENT RECEIPT CONFIRMATION DISPATCH SERVICE
// ============================================================================

export interface ClientReceiptConfirmation {
  id: string;
  orderId: string;
  invoiceNumber: string;
  proformaNumber: string;
  ccsBookingId: string;
  studentName: string;
  studentEmail: string;
  companyName: string;
  companyAddress?: string;
  coursePackageTitle: string;
  seatCount: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  bankName: string;
  bankAddress: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftBic: string;
  paymentConfirmedAt: string;
  confirmedBy: string;
  activationToken: string;
  recipientEmail: string;
  ccEmails: string[];
  subject: string;
  htmlContent: string;
  textContent: string;
  status: 'sent' | 'delivered';
}

const CLIENT_RECEIPTS_STORAGE_KEY = 'complisey_client_receipts_v1';

class ClientReceiptNotificationService {
  private listeners: Set<(receipts: ClientReceiptConfirmation[]) => void> = new Set();
  private receiptsCache: ClientReceiptConfirmation[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(CLIENT_RECEIPTS_STORAGE_KEY);
      if (raw) {
        this.receiptsCache = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load client receipts from local storage:', e);
      this.receiptsCache = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(CLIENT_RECEIPTS_STORAGE_KEY, JSON.stringify(this.receiptsCache));
    } catch (e) {
      console.warn('Could not save client receipts to storage:', e);
    }
  }

  public getReceipts(): ClientReceiptConfirmation[] {
    return [...this.receiptsCache];
  }

  public getReceiptByOrderId(orderId: string): ClientReceiptConfirmation | undefined {
    return this.receiptsCache.find((r) => r.orderId === orderId);
  }

  public subscribe(callback: (receipts: ClientReceiptConfirmation[]) => void): () => void {
    this.listeners.add(callback);
    callback([...this.receiptsCache]);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    const data = [...this.receiptsCache];
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('Error executing receipt listener:', err);
      }
    });
  }

  /**
   * Generates email templates for payment receipt confirmation sent to the client.
   */
  public generateReceiptEmailTemplates(
    order: EnrollmentOrder,
    invoiceNumber: string,
    activationToken: string,
    confirmedBy: string = 'Malcolm Simon'
  ) {
    const formattedAmount = `${order.currency || 'SCR'} ${order.totalAmount.toLocaleString('en-US')}`;
    const subject = `[RECEIPT & TAX INVOICE] Payment Confirmed (${invoiceNumber}) - CompliSey Academy Access Activated`;

    const lineItemsText = order.items && order.items.length > 0
      ? order.items.map((it, idx) => `  ${idx + 1}. ${it.courseTitle} (${it.seatCount} Seat${it.seatCount > 1 ? 's' : ''}) - ${order.currency || 'SCR'} ${it.totalAmount.toLocaleString()}`).join('\n')
      : `  • ${order.courseTitle} (${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''})`;

    const textContent = `
COMPLISEY ACADEMY - OFFICIAL RECEIPT & TAX INVOICE
Complisanc Consulting Services (SEY) trading as Complisey
Victoria, Mahé, Republic of Seychelles
=====================================================

Dear ${order.contactName},

We are pleased to confirm that your payment has been received in full and verified in our bank account. Your twelve-month accredited training seats at CompliSey Academy are now officially ACTIVE.

1. PAYMENT SETTLEMENT CONFIRMATION
-----------------------------------------------------
Official Tax Invoice #: ${invoiceNumber}
Proforma Invoice Ref  : ${order.proformaNumber}
CCS Booking ID        : ${order.ccsBookingId || order.bankReferenceCode}
Bank Received         : The Mauritius Commercial Bank (Seychelles) Ltd.
Bank Address          : P.O. Box 122, Manglier Street, Victoria, Mahe, Seychelles
Branch                : Victoria, Mahe
Account Beneficiary   : Complisanc Consulting Services (SEY)
Account Number        : 00001073508
IBAN                  : SC32MCBL06070000000001073508SCR
SWIFT Code            : MCBLSCSC
Currency              : ${order.currency || 'SCR'}
Amount Cleared        : ${formattedAmount} (Paid in Full)
Confirmation Date     : ${new Date().toLocaleString()}
Verified By           : ${confirmedBy} (Complisey Administration Desk)

2. BILLED REPORTING ENTITY
-----------------------------------------------------
Client / Officer      : ${order.contactName}
Contact Email         : ${order.contactEmail}
Reporting Entity      : ${order.companyName}
Registered Address    : ${order.companyAddress || 'Republic of Seychelles'}

3. ACCREDITED CURRICULUM SEATS ACTIVATED
-----------------------------------------------------
${lineItemsText}
Total Seats Provisioned: ${order.seatCount} Seat(s)
Access Duration        : 12 Months from Activation
Certificates Included  : Yes, official verifiable PDF certificate on passing 80% exam

4. LMS ACCESS CREDENTIALS & ACTIVATION
-----------------------------------------------------
Your Official Activation Token: ${activationToken}

To access your courses:
1. Log in or visit CompliSey Academy at https://academy.complisey.com
2. Your registered email (${order.contactEmail}) has been granted immediate seat access.
3. If logging in from a new workstation, enter your activation token "${activationToken}" at the LMS Activation Prompt.

5. COMPLIANCE TRAINING RECORD
-----------------------------------------------------
This document constitutes an official Tax Invoice and Payment Receipt for AML/CFT compliance training provided by Complisey Academy. Organizations may retain this record for compliance audit files.

Complisanc Consulting Services (SEY) trading as Complisey
Malcolm Simon (Administration) | Eric D'Souza (Training Desk)
Support: malcolm@complisanc.com · eric@complisanc.com
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #071433; color: #ffffff; padding: 24px; text-align: left; }
    .badge { display: inline-block; background: #10b981; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .title { font-size: 20px; font-weight: 800; margin-top: 12px; margin-bottom: 4px; color: #ffffff; }
    .subtitle { font-size: 13px; color: #cbd5e1; margin: 0; }
    .content { padding: 24px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
    .info-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .info-table td.label { font-weight: 600; color: #475569; width: 38%; background: #f8fafc; }
    .info-table td.value { color: #0f172a; font-weight: 500; }
    .token-box { background: #071433; color: #ffffff; border-radius: 10px; padding: 16px; margin: 16px 0; text-align: center; }
    .token-code { font-family: monospace; font-size: 22px; font-weight: 900; color: #fbbf24; letter-spacing: 2px; }
    .bank-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 16px 0; }
    .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Payment Confirmed · Paid in Full</span>
      <h1 class="title">Official Tax Invoice &amp; Payment Receipt</h1>
      <p class="subtitle">Tax Invoice: <strong>${invoiceNumber}</strong> · Booking Ref: <strong>${order.ccsBookingId || order.bankReferenceCode}</strong></p>
    </div>

    <div class="content">
      <p style="font-size: 13px; color: #334155; margin-top: 0;">
        Dear <strong>${order.contactName}</strong>,<br>
        We have confirmed receipt of funds in full into our bank account at <strong>The Mauritius Commercial Bank (Seychelles) Ltd.</strong> Your course registration is officially confirmed and your seat access has been activated.
      </p>

      <div class="section-title">1. Payment Settlement Record</div>
      <table class="info-table">
        <tr>
          <td class="label">Tax Invoice #</td>
          <td class="value"><strong style="font-family: monospace; color: #071433;">${invoiceNumber}</strong></td>
        </tr>
        <tr>
          <td class="label">Proforma Reference</td>
          <td class="value">${order.proformaNumber}</td>
        </tr>
        <tr>
          <td class="label">CCS Booking ID</td>
          <td class="value"><strong style="font-family: monospace;">${order.ccsBookingId || order.bankReferenceCode}</strong></td>
        </tr>
        <tr>
          <td class="label">Bank Account Received</td>
          <td class="value">
            <strong>The Mauritius Commercial Bank (Seychelles) Ltd.</strong><br>
            <span style="font-size: 11px; color: #475569;">P.O. Box 122, Manglier Street, Victoria, Mahe, Seychelles (Victoria, Mahe Branch)</span><br>
            Account Name: <strong>Complisanc Consulting Services (SEY)</strong><br>
            Account #: <span style="font-family: monospace; font-weight: 700;">00001073508</span><br>
            IBAN: <span style="font-family: monospace; font-weight: 700;">SC32MCBL06070000000001073508SCR</span><br>
            SWIFT: <span style="font-family: monospace; font-weight: 700;">MCBLSCSC</span>
          </td>
        </tr>
        <tr>
          <td class="label">Amount Cleared</td>
          <td class="value" style="font-size: 16px; font-weight: 800; color: #166534;">${formattedAmount} (Paid in Full)</td>
        </tr>
        <tr>
          <td class="label">Verification Timestamp</td>
          <td class="value">${new Date().toLocaleString()} · Confirmed by ${confirmedBy}</td>
        </tr>
      </table>

      <div class="section-title">2. Billed Entity Details</div>
      <table class="info-table">
        <tr>
          <td class="label">Reporting Entity</td>
          <td class="value"><strong>${order.companyName}</strong></td>
        </tr>
        <tr>
          <td class="label">Learner / Officer</td>
          <td class="value">${order.contactName} (${order.contactEmail})</td>
        </tr>
        <tr>
          <td class="label">Address</td>
          <td class="value">${order.companyAddress || 'Republic of Seychelles'}</td>
        </tr>
      </table>

      <div class="section-title">3. Provisioned Curriculum Seats</div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px;">
        <div style="font-weight: 700; color: #071433; margin-bottom: 4px;">${order.courseTitle}</div>
        <div style="color: #64748b;">• Total Provisioned: <strong>${order.seatCount} Seat${order.seatCount > 1 ? 's' : ''}</strong> (12-Month Access)</div>
        <div style="color: #64748b;">• Completion Certificates: Included with verifiable QR code and compliance audit trail</div>
      </div>

      <div class="token-box">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; margin-bottom: 4px;">Your Access Activation Token</div>
        <div class="token-code">${activationToken}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Quote this code when accessing from new devices or contact support if assistance is required.</div>
      </div>

      <div class="bank-box">
        <div style="font-size: 12px; font-weight: 700; color: #166534; margin-bottom: 2px;">Compliance Training Document</div>
        <p style="font-size: 11px; color: #15803d; margin: 0;">
          This official Tax Invoice and Payment Receipt serves as valid documentation of compliance training provided by Complisey Academy.
        </p>
      </div>
    </div>

    <div class="footer">
      Complisanc Consulting Services (SEY) trading as Complisey · Victoria, Mahé, Republic of Seychelles · Reg # 842109<br>
      Support &amp; Accounts: malcolm@complisanc.com · eric@complisanc.com
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, textContent, htmlContent };
  }

  /**
   * Dispatches receipt confirmation to client and records it.
   */
  public async triggerReceiptConfirmation(
    order: EnrollmentOrder,
    invoiceNumber: string,
    activationToken: string,
    confirmedBy: string = 'Malcolm Simon'
  ): Promise<ClientReceiptConfirmation> {
    const { subject, textContent, htmlContent } = this.generateReceiptEmailTemplates(
      order,
      invoiceNumber,
      activationToken,
      confirmedBy
    );

    const receipt: ClientReceiptConfirmation = {
      id: `rcpt_${order.id || Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: order.id,
      invoiceNumber,
      proformaNumber: order.proformaNumber,
      ccsBookingId: order.ccsBookingId || order.bankReferenceCode,
      studentName: order.contactName,
      studentEmail: order.contactEmail,
      companyName: order.companyName,
      companyAddress: order.companyAddress,
      coursePackageTitle: order.courseTitle,
      seatCount: order.seatCount,
      unitPrice: order.unitPrice,
      totalAmount: order.totalAmount,
      currency: order.currency || 'SCR',
      bankName: 'The Mauritius Commercial Bank (Seychelles) Ltd.',
      bankAddress: 'P.O. Box 122, Manglier Street, Victoria, Mahe, Seychelles',
      branch: 'Victoria, Mahe',
      accountName: 'Complisanc Consulting Services (SEY)',
      accountNumber: '00001073508',
      iban: 'SC32MCBL06070000000001073508SCR',
      swiftBic: 'MCBLSCSC',
      paymentConfirmedAt: new Date().toISOString(),
      confirmedBy,
      activationToken,
      recipientEmail: order.contactEmail,
      ccEmails: DEFAULT_ADMIN_EMAILS,
      subject,
      htmlContent,
      textContent,
      status: 'delivered',
    };

    // Save locally
    this.receiptsCache = [receipt, ...this.receiptsCache.filter((r) => r.orderId !== order.id)];
    this.saveToStorage();
    this.notifyListeners();

    // Persist to Firestore
    try {
      await ensureFirebaseAuth();
      const docRef = doc(db, 'client_receipt_confirmations', receipt.id);
      await setDoc(docRef, {
        ...receipt,
      });
      console.log(`[Client Receipt Service] Dispatched & synced to Firestore: ${receipt.id} for ${receipt.invoiceNumber}`);
    } catch (firestoreErr) {
      console.warn('[Client Receipt Service] Local cache saved; Firestore sync notice:', firestoreErr);
    }

    // Dispatch via Resend Transactional Email Engine to client AND Malcolm & Eric
    const allDeliveryTargets = Array.from(new Set([receipt.recipientEmail, ...receipt.ccEmails]));
    dispatchViaResendApi({
      to: allDeliveryTargets,
      cc: receipt.ccEmails,
      subject: receipt.subject,
      html: receipt.htmlContent,
      text: receipt.textContent,
      category: 'client_tax_receipt',
      metadata: {
        orderId: receipt.orderId,
        invoiceNumber: receipt.invoiceNumber,
        proformaNumber: receipt.proformaNumber,
      },
    }).then((result) => {
      systemAuditLogService.logEvent(
        'BILLING',
        'INFO',
        result.mode === 'live' ? 'RECEIPT_DISPATCHED_RESEND_LIVE' : 'RECEIPT_DISPATCHED_RESEND_SIMULATED',
        confirmedBy,
        'admin',
        `Official Tax Invoice & Payment Receipt dispatched via Resend to ${receipt.recipientEmail} and Complisey Directors (${receipt.ccEmails.join(', ')}) (Invoice: ${receipt.invoiceNumber}, Mode: ${result.mode.toUpperCase()}${result.id ? ` - ID: ${result.id}` : ''})`,
        {
          orderId: receipt.orderId,
          invoiceNumber: receipt.invoiceNumber,
          recipient: receipt.recipientEmail,
          adminCc: receipt.ccEmails,
          mode: result.mode,
          resendMessageId: result.id,
          success: result.success,
        }
      );
    });

    return receipt;
  }

  public getReceiptMailtoUrl(receipt: ClientReceiptConfirmation): string {
    const to = receipt.recipientEmail;
    const cc = receipt.ccEmails.join(',');
    const subject = encodeURIComponent(receipt.subject);
    const body = encodeURIComponent(receipt.textContent);
    return `mailto:${to}?cc=${encodeURIComponent(cc)}&subject=${subject}&body=${body}`;
  }
}

export const clientReceiptNotificationService = new ClientReceiptNotificationService();
