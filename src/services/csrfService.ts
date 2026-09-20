/**
 * CompliSey CSRF Protection Service
 * Manages fetching, caching, and validating anti-CSRF tokens for all frontend form submissions.
 */

const CSRF_STORAGE_KEY = 'complisey_csrf_token_v1';

class CsrfService {
  private currentToken: string | null = null;
  private fetchPromise: Promise<string> | null = null;
  private listeners: Set<(token: string | null) => void> = new Set();

  constructor() {
    // Attempt to load from storage as quick startup fallback
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(CSRF_STORAGE_KEY);
        if (stored) {
          this.currentToken = stored;
        }
      } catch {
        // Storage might be unavailable
      }
    }
  }

  public subscribe(listener: (token: string | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentToken);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentToken));
  }

  /**
   * Fetches an anti-CSRF token from the backend /api/csrf-token endpoint.
   * Ensures deduplicated concurrent requests.
   */
  public async fetchCsrfToken(forceFresh: boolean = false): Promise<string> {
    if (!forceFresh && this.currentToken) {
      return this.currentToken;
    }

    if (this.fetchPromise && !forceFresh) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      try {
        const res = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include', // Include HTTP-only session cookie
          headers: {
            Accept: 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to retrieve CSRF token: HTTP ${res.status}`);
        }

        const data = await res.json();
        const token = data.csrfToken;

        if (!token) {
          throw new Error('Server returned empty CSRF token');
        }

        this.currentToken = token;
        try {
          sessionStorage.setItem(CSRF_STORAGE_KEY, token);
        } catch {}

        this.notify();
        return token;
      } catch (err) {
        console.warn('[CompliSey CSRF] Could not fetch server token, using fallback session token:', err);
        // If server is not responding (e.g. initial static offline mode), generate local fallback token
        if (!this.currentToken) {
          this.currentToken = `offline_token_${Date.now()}`;
          this.notify();
        }
        return this.currentToken;
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  /**
   * Synchronously returns the currently cached token, or empty string.
   */
  public getTokenSync(): string {
    return this.currentToken || '';
  }

  /**
   * Submits a protected form payload to the backend with guaranteed CSRF tokens.
   * Attaches both the 'X-CSRF-Token' header and '_csrf' in the body.
   * Automatically retries once if a 403 token expiration occurs.
   */
  public async postProtected<T = any>(
    url: string,
    bodyData: Record<string, any> = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    let token = await this.fetchCsrfToken();

    const doRequest = async (activeToken: string) => {
      const payload = {
        ...bodyData,
        _csrf: activeToken,
        csrfToken: activeToken,
      };

      return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': activeToken,
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    };

    let response = await doRequest(token);

    // If 403 CSRF token failure, refresh token once and retry
    if (response.status === 403) {
      console.warn('[CompliSey CSRF] 403 received, refreshing token and retrying...');
      token = await this.fetchCsrfToken(true);
      response = await doRequest(token);
    }

    try {
      const json = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: json.message || json.error || `Request failed with status ${response.status}`,
          data: json,
        };
      }
      return { success: true, data: json };
    } catch (e: any) {
      return {
        success: response.ok,
        error: response.ok ? undefined : `Request failed: ${response.statusText}`,
      };
    }
  }

  /**
   * Test CSRF verification against the backend
   */
  public async testVerification(): Promise<boolean> {
    try {
      const result = await this.postProtected('/api/verify-csrf', {
        test: true,
        clientTimestamp: new Date().toISOString(),
      });
      return result.success;
    } catch {
      return false;
    }
  }
}

export const csrfService = new CsrfService();
