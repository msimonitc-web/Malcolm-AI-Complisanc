import React, { useState } from 'react';
import { DownloadCloud, Smartphone, X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'banner' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'pill',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'nav') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#071433] text-xs font-bold transition-all shadow-xs shrink-0 ${className}`}
          title="Install CompliSey Academy for offline learning and quick home screen access"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>{installing ? 'Installing...' : 'Install App'}</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={installing}
        className={`flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#071433] px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all ${className}`}
      >
        <DownloadCloud className="w-4 h-4" />
        <span>{installing ? 'Installing App...' : 'Install App (Offline Ready)'}</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors ${className}`}
          title="Install on Apple iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#071433] flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Install CompliSey</h3>
                    <p className="text-[11px] text-slate-500">Add to iPhone / iPad Home Screen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span>Tap the <strong>Share</strong> button in your Safari toolbar (square with upward arrow).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                    <span>Open from your home screen for full offline study access.</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#071433] text-amber-300 py-2.5 text-xs font-bold hover:bg-[#0c245c] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
