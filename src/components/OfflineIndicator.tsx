import React from 'react';
import { WifiOff, Wifi, RefreshCw, HardDriveDownload } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  onOpenOfflineManager?: () => void;
  downloadedCount?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onOpenOfflineManager,
  downloadedCount = 0,
}) => {
  const { isOnline, wasOffline, checkConnection } = useOnlineStatus();
  const [checking, setChecking] = React.useState(false);

  const handleManualCheck = async () => {
    setChecking(true);
    await checkConnection();
    setTimeout(() => setChecking(false), 500);
  };

  // If connection was restored recently
  if (wasOffline && isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center justify-between sm:justify-start gap-2.5 rounded-xl bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-xl border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-2">
        <Wifi className="w-4 h-4 text-emerald-200 shrink-0" />
        <span>Connection Restored · Progress will synchronize automatically with the cloud database.</span>
      </div>
    );
  }

  // If online, don't show the warning banner
  if (isOnline) {
    return null;
  }

  // When offline / intermittent
  return (
    <aside aria-label="Connectivity Status" className="fixed bottom-4 left-4 right-4 sm:right-auto max-w-md z-50 rounded-2xl bg-[#071433] text-white p-3.5 shadow-2xl border border-amber-400/40 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5 border border-amber-400/30">
          <WifiOff className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-white">Offline Mode Active</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-[#071433] text-[9px] font-black uppercase">
              Cached UI
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Internet connection intermittent or unavailable. Dashboard UI, notes, and downloaded course materials are fully accessible offline.
          </p>

          <div className="flex items-center gap-2 pt-1">
            {onOpenOfflineManager && (
              <button
                onClick={onOpenOfflineManager}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-[#071433] text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <HardDriveDownload className="w-3 h-3" />
                <span>Offline Library ({downloadedCount})</span>
              </button>
            )}

            <button
              onClick={handleManualCheck}
              disabled={checking}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking...' : 'Check Signal'}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
