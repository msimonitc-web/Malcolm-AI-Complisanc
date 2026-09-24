import React, { useState } from 'react';
import {
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  TrendingDown,
} from 'lucide-react';
import { calculateOrderTotalSCR, CoursePackageType } from '../utils/pricing';
import { useAcademy } from '../context/AcademyContext';

interface CorporateSeatCalculatorProps {
  onApplySelection?: (seats: number, pkg: 'both' | 'level1' | 'level2') => void;
}

export const CorporateSeatCalculator: React.FC<CorporateSeatCalculatorProps> = ({
  onApplySelection,
}) => {
  const { usdExchangeRate, pricingPercentageAdjustment } = useAcademy();
  const [seats, setSeats] = useState<number>(5);
  const [selectedPkg, setSelectedPkg] = useState<'both' | 'level1' | 'level2'>('both');

  const mappedPkg: CoursePackageType = selectedPkg === 'both' ? 'pack' : selectedPkg;
  const pricing = calculateOrderTotalSCR(seats, seats > 1, mappedPkg, pricingPercentageAdjustment);
  const baseSingleRate = calculateOrderTotalSCR(1, false, mappedPkg, pricingPercentageAdjustment).ratePerSeat;
  const standardTotal = baseSingleRate * seats;
  const savings = Math.max(0, standardTotal - pricing.totalSCR);
  const savingsPercent = Math.round((savings / standardTotal) * 100);
  const totalUSD = Math.round(pricing.totalSCR / usdExchangeRate);

  const handleApply = () => {
    if (onApplySelection) {
      onApplySelection(seats, selectedPkg);
    } else {
      const el = document.getElementById('registration-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="corporate-calculator" className="bg-gradient-to-br from-[#071433] via-[#0b1c45] to-[#122b68] rounded-3xl border border-amber-400/40 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Corporate Group Booking Calculator
            </span>
            <span className="text-xs text-slate-300">· Section 34 Staff Training</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Estimate Corporate Seat Volume &amp; Invoicing Tiers
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            CompliSey provides tiered volume pricing for Seychelles CSPs, domestic &amp; offshore banks, securities dealers, and regulated fiduciary teams.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-200">Consolidated Proforma Invoicing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 relative z-10">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step A: Package Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Choose Curriculum Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPkg('both')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPkg === 'both'
                    ? 'bg-amber-400 text-[#071433] border-amber-300 font-bold shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold flex items-center justify-between">
                  <span>Full Curriculum</span>
                  {selectedPkg === 'both' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-[11px] opacity-90 mt-0.5">All 6 Modules (12 CPD)</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPkg('level1')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPkg === 'level1'
                    ? 'bg-amber-400 text-[#071433] border-amber-300 font-bold shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold flex items-center justify-between">
                  <span>Level 1 Only</span>
                  {selectedPkg === 'level1' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-[11px] opacity-90 mt-0.5">Statutory Foundations (6 CPD)</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPkg('level2')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPkg === 'level2'
                    ? 'bg-amber-400 text-[#071433] border-amber-300 font-bold shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold flex items-center justify-between">
                  <span>Level 2 Only</span>
                  {selectedPkg === 'level2' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-[11px] opacity-90 mt-0.5">Advanced Ops (6 CPD)</div>
              </button>
            </div>
          </div>

          {/* Step B: Seat Counter Stepper & Slider */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Select Staff Seat Count: <span className="text-amber-400 text-sm font-black">{seats} Staff Seat{seats > 1 ? 's' : ''}</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-300 font-medium">Exact Count:</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={seats}
                  onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-1 bg-black/40 border border-amber-400/40 rounded-lg text-amber-300 font-mono font-bold text-xs text-center focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={Math.min(50, seats)}
                  onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                  className="w-full accent-amber-400 h-2.5 bg-white/20 rounded-lg cursor-pointer appearance-none relative z-10"
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((Math.min(50, seats) - 1) / 49) * 100}%, rgba(255, 255, 255, 0.2) ${((Math.min(50, seats) - 1) / 49) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 px-1 font-mono font-bold">
                <span>1 seat</span>
                <span>10 seats</span>
                <span>20 seats</span>
                <span>35 seats</span>
                <span>50+ seats</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-slate-400 font-semibold mr-1">Quick Presets:</span>
              {[1, 5, 10, 20, 30, 40, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSeats(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    seats === preset
                      ? 'bg-amber-400 text-[#071433] shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  {preset} {preset === 1 ? 'Seat' : 'Seats'}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Tiers Breakdown Card */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Seychelles Statutory Volume Discount Schedule</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <TrendingDown className="w-3 h-3" /> Up to 36% discount
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px]">
              <div className={`p-2 rounded-lg border text-center transition-all ${seats === 1 ? 'bg-amber-400 text-[#071433] font-black' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div>Individual</div>
                <div className="font-mono text-[10px] mt-0.5">SCR {selectedPkg === 'both' ? '2,500' : selectedPkg === 'level1' ? '1,250' : '1,500'}</div>
                <div className="text-[9px] opacity-80">Standard</div>
              </div>

              <div className={`p-2 rounded-lg border text-center transition-all ${seats >= 2 && seats <= 5 ? 'bg-amber-400 text-[#071433] font-black' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div>1–5 Seats</div>
                <div className="font-mono text-[10px] mt-0.5">SCR {selectedPkg === 'both' ? '2,250' : selectedPkg === 'level1' ? '1,100' : '1,300'}</div>
                <div className="text-[9px] text-emerald-300 font-semibold">Save 10%</div>
              </div>

              <div className={`p-2 rounded-lg border text-center transition-all ${seats >= 6 && seats <= 10 ? 'bg-amber-400 text-[#071433] font-black' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div>6–10 Seats</div>
                <div className="font-mono text-[10px] mt-0.5">SCR {selectedPkg === 'both' ? '2,050' : selectedPkg === 'level1' ? '1,000' : '1,200'}</div>
                <div className="text-[9px] text-emerald-300 font-semibold">Save 18%</div>
              </div>

              <div className={`p-2 rounded-lg border text-center transition-all ${seats >= 11 && seats <= 20 ? 'bg-amber-400 text-[#071433] font-black' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div>11–20 Seats</div>
                <div className="font-mono text-[10px] mt-0.5">SCR {selectedPkg === 'both' ? '1,850' : selectedPkg === 'level1' ? '900' : '1,100'}</div>
                <div className="text-[9px] text-emerald-300 font-semibold">Save 26%</div>
              </div>

              <div className={`p-2 rounded-lg border text-center transition-all ${seats >= 21 ? 'bg-amber-400 text-[#071433] font-black' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div>21+ Seats</div>
                <div className="font-mono text-[10px] mt-0.5">SCR {selectedPkg === 'both' ? '1,600' : selectedPkg === 'level1' ? '800' : '950'}</div>
                <div className="text-[9px] text-emerald-300 font-semibold">Save 36%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quotation & Action Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-300">Live Volume Quotation</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                MCB Seychelles Wire Ready
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-300">Effective Unit Rate</div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                SCR {pricing.ratePerSeat.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-300">/ seat</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Tier: <strong className="text-white">{pricing.bandLabel}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="text-xs text-slate-300">Total Quotation Value</div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                SCR {pricing.totalSCR.toLocaleString()}
              </div>
              <div className="text-xs text-slate-300 mt-0.5 flex items-center justify-between">
                <span>Approx. USD ${totalUSD.toLocaleString()}</span>
                {savings > 0 && (
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    Saves SCR {savings.toLocaleString()} ({savingsPercent}%)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Consolidated corporate proforma invoice generated</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{seats} unique employee course activation tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verifiable CPD professional certificates for employee training records</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply {seats} Seats to Registration Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Pre-fills your registration desk below with this exact quotation and seat allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
