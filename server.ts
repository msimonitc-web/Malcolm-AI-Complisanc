// Clean up any non-absolute __dirname set by tsx to prevent breaking ESM packages like vite-plugin-pwa
if (typeof (globalThis as unknown as { __dirname?: string }).__dirname !== 'undefined') {
  delete (globalThis as unknown as { __dirname?: string }).__dirname;
}

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import {
  ensureCsrfCookie,
  csrfProtection,
  CSRF_COOKIE_NAME,
  generateCsrfToken,
} from './server/csrfMiddleware';
import { sendTransactionalEmail, getResendClient, getValidSenderEmail } from './server/resendService';


async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic body & cookie parsers (mandatory before CSRF validation)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Automatically attach/ensure CSRF cookie on all incoming requests
  app.use(ensureCsrfCookie);

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'CompliSey Academy Backend',
      csrfProtection: 'active',
      timestamp: new Date().toISOString(),
    });
  });

  // CSRF Token endpoint: returns a cryptographically valid token for frontend forms
  app.get('/api/csrf-token', (req: Request, res: Response) => {
    const secret = req.cookies?.[CSRF_COOKIE_NAME];
    const token = secret ? generateCsrfToken(secret) : (res.locals.csrfToken as string);

    // Also set a readable cookie for SPA frameworks (standard Angular / Axios / fetch pattern)
    res.cookie('XSRF-TOKEN', token, {
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      csrfToken: token,
      headerName: 'X-CSRF-Token',
      formFieldName: '_csrf',
      description: 'HMAC-SHA256 Anti-CSRF Token for secure form submissions',
    });
  });

  // Dedicated test/diagnostic endpoint to verify anti-CSRF protections
  app.post('/api/verify-csrf', csrfProtection, (req: Request, res: Response) => {
    res.json({
      success: true,
      verified: true,
      message: 'CSRF token verified successfully by CompliSey security middleware.',
      timestamp: new Date().toISOString(),
      submittedSource: req.headers['x-csrf-token'] ? 'header' : 'form-body',
    });
  });

  // Form Submission Endpoints - ALL strictly protected by csrfProtection middleware

  // 1. Enrollment & Proforma Invoice Order Form
  app.post('/api/forms/enrollment-order', csrfProtection, (req: Request, res: Response) => {
    const { courseId, seatCount, companyName, contactName, contactEmail, contactPhone, notes, _csrf } = req.body;

    if (!courseId || !contactEmail) {
      res.status(400).json({
        success: false,
        error: 'Missing required enrollment parameters (courseId, contactEmail)',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Enrollment order submitted with verified anti-CSRF token.',
      receivedData: {
        courseId,
        seatCount: Number(seatCount) || 1,
        companyName: companyName || 'Reporting Entity',
        contactName: contactName || 'Compliance Officer',
        contactEmail,
        contactPhone: contactPhone || '',
        notes: notes || '',
      },
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Support Center & Bank Wire Reconciliation Form
  app.post('/api/forms/support-ticket', csrfProtection, (req: Request, res: Response) => {
    const { senderName, senderEmail, senderEntity, bookingId, inquiryType, messageBody } = req.body;

    if (!senderEmail || !messageBody) {
      res.status(400).json({
        success: false,
        error: 'Missing required support ticket fields (senderEmail, messageBody)',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Support inquiry received with verified anti-CSRF token.',
      ticketId: `TICKET-${Date.now()}`,
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 3. Corporate Portal - Add Team Member Form
  app.post('/api/forms/team-member', csrfProtection, (req: Request, res: Response) => {
    const { name, email, role, companyCode } = req.body;

    if (!name || !email) {
      res.status(400).json({
        success: false,
        error: 'Missing team member name or email',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Team member allocated with verified anti-CSRF token.',
      memberId: `mem-${Date.now()}`,
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 4. Classroom Q&A Discussion Question Form
  app.post('/api/forms/lesson-comment', csrfProtection, (req: Request, res: Response) => {
    const { lessonId, author, content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({
        success: false,
        error: 'Comment content cannot be empty',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Lesson discussion posted with verified anti-CSRF token.',
      commentId: `comm-${Date.now()}`,
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 5. Local Review Account Login Form
  app.post('/api/forms/login', csrfProtection, (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password required',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Login credentials submitted with verified anti-CSRF token.',
      email,
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 6. Corporate Seat Join Code Activation Form
  app.post('/api/forms/redeem-code', csrfProtection, (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code || !code.trim()) {
      res.status(400).json({
        success: false,
        error: 'Join code is required',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Join code validated with verified anti-CSRF token.',
      code: code.trim().toUpperCase(),
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 7. Admin Portal - Order Payment Verification & Course Activation Form
  app.post('/api/forms/admin-activation', csrfProtection, (req: Request, res: Response) => {
    const { orderId, receiptNote } = req.body;

    if (!orderId) {
      res.status(400).json({
        success: false,
        error: 'Order ID is required for activation',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Order activation processed with verified anti-CSRF token.',
      orderId,
      receiptNote: receiptNote || 'Confirmed via Seychelles Bank Account credit',
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 8. Resend Email Service Endpoints
  // Query status of Resend configuration and sender domain
  app.get('/api/email/status', (_req: Request, res: Response) => {
    const isConfigured = !!getResendClient();
    const sender = getValidSenderEmail();
    res.json({
      success: true,
      service: 'Resend Transactional Email Engine',
      configured: isConfigured,
      sender,
      activeMode: isConfigured ? 'live' : 'simulated',
      monthlyAllowance: '3,000 emails / month (Free Tier)',
      dailyAllowance: '100 emails / day (Free Tier)',
      timestamp: new Date().toISOString(),
    });
  });

  // Send transactional email via Resend
  app.post('/api/email/send', csrfProtection, async (req: Request, res: Response) => {
    const { to, subject, html, text, from, replyTo, cc, bcc, category, metadata } = req.body;

    if (!to || !subject || (!html && !text)) {
      res.status(400).json({
        success: false,
        error: 'Missing required email fields: "to", "subject", and either "html" or "text" are required.',
      });
      return;
    }

    try {
      const result = await sendTransactionalEmail({
        to,
        subject,
        html: html || `<p>${text}</p>`,
        text,
        from,
        replyTo,
        cc,
        bcc,
        category,
        metadata,
      });

      res.json({
        ...result,
        csrfVerified: true,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: `Failed to dispatch email via Resend: ${msg}`,
      });
    }
  });

  // Test dispatch endpoint (dispatches to Malcolm Simon and Eric D'Souza)
  app.post('/api/email/test', csrfProtection, async (req: Request, res: Response) => {
    const rawRecipients = req.body?.recipients || (req.body?.recipient ? [req.body.recipient] : null);
    const targetEmails: string[] = (rawRecipients && Array.isArray(rawRecipients) && rawRecipients.length > 0)
      ? rawRecipients
      : ['msimonitc@gmail.com', 'malcolm@complisanc.com', 'eric@complisanc.com'];

    const testSubject = `[Resend Verification] Complisey Academy Email Pipeline Test`;
    const testHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="background: #071433; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">Complisey Academy — Resend Pipeline Operational</h2>
          <p style="color: #fbbf24; font-size: 12px; margin: 4px 0 0 0; font-weight: 600;">Operations &amp; Training Desk · Malcolm Simon &amp; Eric D'Souza</p>
        </div>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          This is an automated verification dispatch confirming that the <strong>Resend transactional email pipeline</strong> is active and delivering live notifications and student enrollment alerts to Malcolm Simon and Eric D'Souza.
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 12px; margin: 18px 0; color: #0f172a;">
          <div><strong>Status:</strong> <span style="color: #16a34a;">● Live Delivery Active</span></div>
          <div><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
          <div><strong>Recipients:</strong> ${targetEmails.join(', ')}</div>
          <div><strong>Academy:</strong> Complisey Academy (Independent Compliance Training)</div>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          Complisanc Consulting Services (SEY) trading as Complisey · Independent AML/CFT Compliance Training · Victoria, Mahé, Republic of Seychelles
        </p>
      </div>
    `;

    const result = await sendTransactionalEmail({
      to: targetEmails,
      subject: testSubject,
      html: testHtml,
      text: `Complisey Academy — Resend Pipeline Operational. Verification dispatch to ${targetEmails.join(', ')}.`,
      category: 'test_verification',
    });

    res.json({
      ...result,
      testRecipients: targetEmails,
      csrfVerified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Vite middleware for development (Vite handles SPA routing and hot bundling)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CompliSey Academy full-stack server running on http://0.0.0.0:${PORT} with CSRF protection enabled`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error launching CompliSey Academy server:', err);
  process.exit(1);
});
