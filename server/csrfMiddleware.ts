import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Secret key for HMAC signing of CSRF tokens
const CSRF_HMAC_SECRET = process.env.CSRF_SECRET || 'complisey_aml_cft_secure_csrf_secret_2026_seychelles';
export const CSRF_COOKIE_NAME = '_complisey_csrf_secret';
export const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generates an anti-CSRF token based on an HTTP-only secret cookie.
 * Uses HMAC-SHA256 to ensure tokens cannot be forged or tampered with by third parties.
 */
export function generateCsrfToken(secret: string): string {
  return crypto
    .createHmac('sha256', CSRF_HMAC_SECRET)
    .update(secret)
    .digest('hex');
}

/**
 * Validates whether a provided token matches the expected HMAC of the secret.
 * Uses timingSafeEqual to protect against side-channel timing attacks.
 */
export function validateCsrfToken(secret: string, token: string): boolean {
  if (!secret || !token) return false;
  
  const expectedToken = generateCsrfToken(secret);
  const tokenBuf = Buffer.from(token, 'utf-8');
  const expectedBuf = Buffer.from(expectedToken, 'utf-8');

  if (tokenBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuf, expectedBuf);
}

/**
 * Middleware that ensures a CSRF secret cookie exists on every request.
 * If not present, creates a cryptographically strong 32-byte secret and sets it in an HTTP-only cookie.
 */
export function ensureCsrfCookie(req: Request, res: Response, next: NextFunction): void {
  let secret = req.cookies?.[CSRF_COOKIE_NAME];

  if (!secret) {
    secret = crypto.randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE_NAME, secret, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    // Attach to req.cookies so downstream middlewares have access
    if (!req.cookies) {
      req.cookies = {};
    }
    req.cookies[CSRF_COOKIE_NAME] = secret;
  }

  // Also expose the valid token on response headers or locals for convenience
  const token = generateCsrfToken(secret);
  res.locals.csrfToken = token;
  res.setHeader('X-CSRF-Token', token);

  next();
}

/**
 * CSRF Protection Middleware for all state-changing HTTP methods (POST, PUT, PATCH, DELETE).
 * Validates the token sent in the headers (x-csrf-token) or request body (_csrf, csrfToken).
 * Rejects forged or missing tokens with HTTP 403 Forbidden.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Safe HTTP methods per RFC 7231 are exempt from CSRF checks
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method.toUpperCase())) {
    return next();
  }

  const secret = req.cookies?.[CSRF_COOKIE_NAME];
  if (!secret) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Missing CSRF Secret Cookie',
      code: 'EBADCSRFTOKEN',
      message: 'Cross-Site Request Forgery security check failed. No valid CSRF session cookie was found. Please reload the page.',
    });
    return;
  }

  // Extract the submitted token from header, body, or query
  const submittedToken =
    (req.headers[CSRF_HEADER_NAME] as string) ||
    (req.headers['csrf-token'] as string) ||
    (req.headers['x-xsrf-token'] as string) ||
    req.body?._csrf ||
    req.body?.csrfToken ||
    req.body?.csrf_token ||
    (req.query?._csrf as string);

  if (!submittedToken) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Missing CSRF Token',
      code: 'EBADCSRFTOKEN',
      message: 'Cross-Site Request Forgery security check failed. A valid CSRF token is required in the "x-csrf-token" header or "_csrf" form parameter.',
    });
    return;
  }

  // Verify the token cryptographically
  const isValid = validateCsrfToken(secret, submittedToken);

  if (!isValid) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid CSRF Token Mismatch',
      code: 'EBADCSRFTOKEN',
      message: 'Cross-Site Request Forgery security check failed. The submitted anti-CSRF token does not match the authenticated session.',
    });
    return;
  }

  // Token is valid; proceed to next handler
  next();
}
