import React, { useState } from 'react';
import { FIX_ACTIONS, FixAction } from '../data/vaultData';

interface FixPanelProps {
  fixesStatus: Record<string, boolean>;
  activeActionId: string | null;
  onRunFix: (action: FixAction) => void;
  onViewScript: () => void;
  onOpenLanceBinUpload?: () => void;
}

export const FixPanel: React.FC<FixPanelProps> = ({
  fixesStatus,
  activeActionId,
  onRunFix,
  onViewScript,
  onOpenLanceBinUpload,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fixedCount = Object.values(fixesStatus).filter(Boolean).length;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="border border-[#00ff88]/20 bg-[#0c120e] font-mono shadow-xl">
      {/* Panel Header */}
      <div className="px-3 py-2 border-b border-[#00ff88]/20 bg-[#0f1a12] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-widest text-[#00ff88] font-bold">
            FIX PANEL — NETSECUREPRO
          </span>
          <span className="text-[10px] text-[#5a6a60] font-bold">
            ({fixedCount}/3 fixed)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLanceBinUpload && (
            <button
              onClick={onOpenLanceBinUpload}
              className="text-[10px] px-2 py-0.5 border border-[#00ff88] bg-[#00ff88]/15 hover:bg-[#00ff88]/30 text-[#00ff88] font-bold rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>🚀</span>
              <span>UPLOADER LANCE_BIN.HTML</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Cards List */}
      <div className="p-3 space-y-3">
        {FIX_ACTIONS.map((action) => {
          const isFixed = !!fixesStatus[action.id];
          const isRunning = activeActionId === action.id;

          return (
            <div
              key={action.id}
              className={`border bg-[#0a0a0a] transition-all ${
                isFixed
                  ? 'border-[#00ff88]/40'
                  : isRunning
                  ? 'border-[#ffcc33]/40'
                  : 'border-[#1e2e24] hover:border-[#2a3a2e]'
              }`}
            >
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-2">
                    <span
                      className={`text-[10px] px-1 py-0.5 h-fit border ${
                        isFixed
                          ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 font-bold'
                          : 'bg-[#1a1a1a] text-[#5a6a60] border-[#2a2a2a]'
                      }`}
                    >
                      {action.label}
                    </span>
                    <div>
                      <div
                        className={`text-[12px] font-bold tracking-wide ${
                          isFixed ? 'text-[#00ff88]' : 'text-white'
                        }`}
                      >
                        {action.title}
                      </div>
                      <div className="text-[10px] text-[#5a6a60] mt-1 leading-snug">
                        {action.desc}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                      isFixed
                        ? 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]'
                        : isRunning
                        ? 'bg-[#ffcc33] shadow-[0_0_6px_#ffcc33] animate-pulse'
                        : 'bg-[#2a2a2a]'
                    }`}
                  />
                </div>

                {/* Command Preview Codebox */}
                <div className="mt-3 rounded bg-black border border-[#1a1a1a] p-2 text-[10px] text-[#8a9a8e] leading-relaxed overflow-x-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#5a6a60] text-[9px] tracking-widest font-bold">
                      COMMAND
                    </span>
                    <button
                      onClick={() => handleCopy(action.id, action.cmd)}
                      className="text-[9px] px-1.5 py-0.5 border border-[#1e2e24] hover:border-[#00ff88]/30 hover:text-[#00ff88] text-[#5a6a60] transition-colors"
                    >
                      {copiedId === action.id ? 'COPIED ✓' : 'COPY'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-all text-[#a0b0a0]">
                    {action.cmd}
                  </pre>
                </div>

                {/* Run Button */}
                <button
                  onClick={() => onRunFix(action)}
                  disabled={isRunning}
                  className={`mt-3 w-full py-2 text-[11px] tracking-widest font-bold border transition-all active:scale-[0.98] ${
                    isFixed
                      ? 'border-[#00ff88]/30 text-[#00ff88] bg-[#00ff88]/10 hover:bg-[#00ff88]/20'
                      : isRunning
                      ? 'border-[#ffcc33]/50 text-[#ffcc33] bg-[#ffcc33]/10 cursor-wait'
                      : 'border-[#00ff88]/50 text-[#00ff88] bg-[#00ff88]/10 hover:bg-[#00ff88]/20 hover:shadow-[0_0_12px_rgba(0,255,136,0.2)]'
                  }`}
                >
                  {isRunning
                    ? '⏳ EXÉCUTION EN COURS...'
                    : isFixed
                    ? `✓ FIXED (RE-RUN ${action.id.toUpperCase()})`
                    : `> RUN ${action.id.toUpperCase()}`}
                </button>
              </div>
            </div>
          );
        })}

        {/* Footnote and View Script */}
        <div className="pt-2 border-t border-[#121a14] text-[10px] text-[#5a6a60] leading-relaxed flex items-center justify-between">
          <div>
            <span className="text-[#00ff88] font-bold">$ cat fix.sh</span> — Termux reboot hook.
          </div>
          <button
            onClick={onViewScript}
            className="text-[#00ff88] hover:underline font-bold text-[9px]"
          >
            VOIR FIX.SH
          </button>
        </div>
      </div>
    </div>
  );
};
