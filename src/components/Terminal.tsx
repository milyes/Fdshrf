import React, { useState, useRef, useEffect } from 'react';
import { LogEntry } from '../data/vaultData';

interface TerminalProps {
  logs: LogEntry[];
  onClear: () => void;
  onRunCommand: (cmd: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, onClear, onRunCommand }) => {
  const [filter, setFilter] = useState<'ALL' | 'ERR' | 'WARN' | 'OK' | 'CMD'>('ALL');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((l) => {
    if (filter === 'ALL') return true;
    return l.lvl === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');
    onRunCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx]);
        }
      }
    }
  };

  const copyAllLogs = () => {
    const text = logs.map((l) => `[${l.ts}] [${l.lvl}] ${l.msg}`).join('\n');
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="border border-[#1e2e24] bg-black font-mono shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2e24] bg-[#0f1510]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-widest text-[#5a6a60] truncate max-w-[280px] sm:max-w-none">
            LOG TAIL — /data/data/com.termux/files/usr/var/log/rclone.log
          </span>
          <span className="hidden md:inline-flex gap-1.5 items-center">
            <span className="h-2 w-2 rounded-full bg-[#ff5a3c]" />
            <span className="h-2 w-2 rounded-full bg-[#ffcc33]" />
            <span className="h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="hidden sm:flex items-center gap-1 text-[9px]">
            {(['ALL', 'OK', 'ERR', 'WARN', 'CMD'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-1.5 py-0.5 border transition-colors ${
                  filter === lvl
                    ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 font-bold'
                    : 'border-[#1e2e24] text-[#5a6a60] hover:text-[#c8d2c0]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={copyAllLogs}
            className="text-[10px] px-2 py-1 border border-[#1e2e24] hover:border-[#00ff88]/40 hover:text-[#00ff88] text-[#5a6a60] transition-colors"
            title="Copier tous les logs"
          >
            COPY
          </button>
          <button
            onClick={onClear}
            className="text-[10px] px-2 py-1 border border-[#1e2e24] hover:border-[#00ff88]/40 hover:text-[#00ff88] text-[#5a6a60] transition-colors"
          >
            CLEAR
          </button>
          <span className="text-[10px] text-[#5a6a60] font-bold">
            {logs.length}L
          </span>
        </div>
      </div>

      {/* Log Output Screen */}
      <div
        ref={scrollRef}
        className="h-[270px] overflow-auto p-3 text-[11px] leading-[1.65] font-mono bg-[#050805] select-text"
      >
        {filteredLogs.map((c, s) => (
          <div key={s} className="flex gap-2.5 whitespace-pre-wrap break-all items-baseline">
            <span className="text-[#2a3a2e] shrink-0 text-[10px] select-none font-normal">
              {c.ts}
            </span>
            <span
              className={`shrink-0 font-bold px-1 text-[9px] tracking-wider rounded-xs ${
                c.lvl === 'ERR'
                  ? 'bg-[#ff5a3c]/20 text-[#ff5a3c] border border-[#ff5a3c]/30'
                  : c.lvl === 'WARN'
                  ? 'bg-[#ffcc33]/20 text-[#ffcc33] border border-[#ffcc33]/30'
                  : c.lvl === 'OK'
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30'
                  : c.lvl === 'CMD'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-[#5a6a60]'
              }`}
            >
              {c.lvl}
            </span>
            <span
              className={`flex-1 ${
                c.lvl === 'ERR'
                  ? 'text-[#ff8a6a]'
                  : c.lvl === 'OK'
                  ? 'text-[#8affc8]'
                  : c.lvl === 'CMD'
                  ? 'text-[#aaff88] font-bold'
                  : c.lvl === 'WARN'
                  ? 'text-[#ffcc33]'
                  : 'text-[#8a9a8e]'
              }`}
            >
              {c.msg}
            </span>
          </div>
        ))}

        <div className="mt-2 flex gap-2 text-[#00ff88] items-center">
          <span className="text-[#00ff88] font-bold">u0_a478@termux:~$</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>

      {/* Quick Interactive Command Bar */}
      <div className="border-t border-[#121a14] bg-[#0c120e] p-2 flex flex-col gap-2">
        {/* Preset command chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] pb-1 scrollbar-none">
          <span className="text-[#4a5a4e] uppercase tracking-widest text-[9px] shrink-0 mr-1">
            CLI RUN:
          </span>
          {[
            { label: 'rclone size', cmd: 'rclone size crypt_zcore:' },
            { label: 'rclone check', cmd: 'rclone check /sdcard/IA_ZERO.07 crypt_zcore:backups/IA_ZERO.07' },
            { label: 'df -h', cmd: 'df -h ~/ZCORE-Vault' },
            { label: 'cat fix.sh', cmd: 'cat fix.sh' },
            { label: 'rclone config show', cmd: 'rclone config show crypt_zcore' },
            { label: 'help', cmd: 'help' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onRunCommand(item.cmd)}
              className="px-2 py-0.5 border border-[#1e2e24] bg-[#0a0a0a] text-[#7a8a7e] hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-colors whitespace-nowrap active:scale-95"
            >
              $ {item.label}
            </button>
          ))}
        </div>

        {/* Live Terminal Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-[#00ff88] text-[11px] font-bold select-none pl-1">
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type rclone or bash command (e.g. rclone size, rclone check, ls, help)..."
            className="flex-1 bg-black border border-[#1e2e24] px-2.5 py-1 text-[11px] text-[#00ff88] placeholder-[#4a5a4e] focus:outline-none focus:border-[#00ff88]/60 focus:bg-[#050805]"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#121a14] border border-[#00ff88]/40 text-[#00ff88] text-[10px] font-bold tracking-wider hover:bg-[#00ff88]/10 active:scale-95 transition-all"
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};
