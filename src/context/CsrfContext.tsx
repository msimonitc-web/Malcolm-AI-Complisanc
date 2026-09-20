import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { csrfService } from '../services/csrfService';

interface CsrfContextValue {
  csrfToken: string;
  isLoading: boolean;
  refreshToken: () => Promise<string>;
  submitProtectedForm: <T = any>(
    url: string,
    data: Record<string, any>
  ) => Promise<{ success: boolean; data?: T; error?: string }>;
}

const CsrfContext = createContext<CsrfContextValue | undefined>(undefined);

export const CsrfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState<string>(() => csrfService.getTokenSync());
  const [isLoading, setIsLoading] = useState<boolean>(!csrfToken);

  useEffect(() => {
    let mounted = true;

    // Listen to token updates
    const unsubscribe = csrfService.subscribe((tok) => {
      if (mounted && tok) {
        setCsrfToken(tok);
        setIsLoading(false);
      }
    });

    // Initial fetch from backend
    csrfService.fetchCsrfToken().finally(() => {
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshToken = async (): Promise<string> => {
    setIsLoading(true);
    try {
      const tok = await csrfService.fetchCsrfToken(true);
      setCsrfToken(tok);
      return tok;
    } finally {
      setIsLoading(false);
    }
  };

  const submitProtectedForm = async <T = any,>(
    url: string,
    data: Record<string, any>
  ) => {
    return csrfService.postProtected<T>(url, data);
  };

  const contextValue = useMemo(
    () => ({
      csrfToken,
      isLoading,
      refreshToken,
      submitProtectedForm,
    }),
    [csrfToken, isLoading]
  );

  return <CsrfContext.Provider value={contextValue}>{children}</CsrfContext.Provider>;
};

const fallbackCsrfValue: CsrfContextValue = {
  csrfToken: csrfService.getTokenSync(),
  isLoading: false,
  refreshToken: async () => csrfService.fetchCsrfToken(true),
  submitProtectedForm: async (url, data) => csrfService.postProtected(url, data),
};

/**
 * Hook to access anti-CSRF token and submission helpers
 */
export const useCsrf = (): CsrfContextValue => {
  const context = useContext(CsrfContext);
  if (!context) {
    return fallbackCsrfValue;
  }
  return context;
};

/**
 * Standard hidden input to embed in all HTML <form> tags.
 * Ensures that all form payloads automatically carry the active anti-CSRF token.
 */
export const CsrfInput: React.FC<{ formName?: string }> = ({ formName }) => {
  const { csrfToken } = useCsrf();
  return (
    <input
      type="hidden"
      name="_csrf"
      id={formName ? `csrf-${formName}` : undefined}
      value={csrfToken || ''}
    />
  );
};

/**
 * Visual verification badge showing form submission CSRF security
 */
export const CsrfBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { csrfToken } = useCsrf();
  return (
    <div
      className={`inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50/90 border border-emerald-300/80 px-2 py-0.5 rounded-md font-mono ${className}`}
      title={`Protected against Cross-Site Request Forgery (Token: ${csrfToken ? `${csrfToken.slice(0, 8)}...` : 'Active'})`}
    >
      <ShieldCheck className="w-3 h-3 text-emerald-600" />
      <span className="font-semibold">CSRF Secured</span>
    </div>
  );
};
