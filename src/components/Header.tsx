import React from 'react';
import { 
  Receipt as ReceiptIcon, 
  Sparkles, 
  Share2, 
  RotateCcw, 
  HelpCircle,
  Percent,
  Check
} from 'lucide-react';
import { Receipt } from '../types';

interface HeaderProps {
  receipt: Receipt;
  onReset: () => void;
  onShare: () => void;
  currency: string;
  onCurrencyChange: (curr: string) => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  receipt,
  onReset,
  onShare,
  currency,
  onCurrencyChange,
  isCopied,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
              <ReceiptIcon className="w-5 h-5 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  SplitSmart <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" />
                  Split-Screen Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Instant receipt parsing & natural language bill splitting
              </p>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              {['$', '€', '£', 'C$'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    currency === curr
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Share Breakdown Button */}
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              title="Copy bill breakdown to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share Summary</span>
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
              title="Reset all assignments"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
