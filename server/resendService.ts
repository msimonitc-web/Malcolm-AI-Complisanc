import { Resend } from 'resend';

let resendClient: Resend | null = null;

/**
 * Returns a lazily initialized Resend client instance.
 * Returns null if RESEND_API_KEY is not configured in the environment.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('MY_RESEND_API_KEY')) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey.trim());
  }
  return resendClient;
}

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  category?: string;
  metadata?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  mode: 'live' | 'simulated';
  id?: string;
  error?: string;
  message?: string;
  to?: string | string[];
  subject?: string;
}

export function getValidSenderEmail(): string {
  const envFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (envFrom && !envFrom.startsWith('re_') && envFrom.includes('@')) {
    return envFrom;
  }
  return 'Complisey Academy <admissions@complisanc.com>';
}

/**
 * Sends a transactional email via Resend with graceful simulated fallback.
 */
export async function sendTransactionalEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const client = getResendClient();
  const defaultFrom = getValidSenderEmail();
  const from = payload.from || defaultFrom;

  if (!client) {
    const simulatedId = `sim_resend_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log(
      `[Resend Email: Simulated] To: ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to} | Subject: "${payload.subject}" | (Add RESEND_API_KEY to activate live delivery)`
    );
    return {
      success: true,
      mode: 'simulated',
      id: simulatedId,
      message: 'Email dispatched in simulated mode (no RESEND_API_KEY set). Set RESEND_API_KEY in environment to send live emails.',
      to: payload.to,
      subject: payload.subject,
    };
  }

  try {
    const response = await client.emails.send({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
      cc: payload.cc,
      bcc: payload.bcc,
      headers: payload.metadata ? { 'X-Complisey-Category': payload.category || 'transactional' } : undefined,
    });

    if (response.error) {
      console.error('[Resend Error]', response.error);
      return {
        success: false,
        mode: 'live',
        error: response.error.message,
      };
    }

    console.log(`[Resend Live Sent] ID: ${response.data?.id} | Subject: "${payload.subject}"`);
    return {
      success: true,
      mode: 'live',
      id: response.data?.id,
      to: payload.to,
      subject: payload.subject,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Resend Delivery Exception]', errorMessage);
    return {
      success: false,
      mode: 'live',
      error: errorMessage,
    };
  }
}
