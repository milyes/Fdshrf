import React, { useState, useEffect } from 'react';

interface BackupRunnerProps {
  onLogMessage: (msg: string, lvl?: 'INFO' | 'OK' | 'CMD') => void;
}

export const BackupRunner: React.FC<BackupRunnerProps> = ({ onLogMessage }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(1);
  const [speed, setSpeed] = useState('28.4 MB/s');
  const [currentFile, setCurrentFile] = useState('model_checkpoint_epoch48.safetensors.aes');
  const [lastRunTime, setLastRunTime] = useState<string>('2026-10-07 02:00 • 0 errors');

  const startBackup = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(4);
    setCurrentChunk(1);

    onLogMessage('$ rclone sync /sdcard/IA_ZERO.07 crypt_zcore:backups/IA_ZERO.07 --progress --transfers 4', 'CMD');
    onLogMessage('Scanning /sdcard/IA_ZERO.07 ... 1,247 files | 4,218,591,240 bytes (4.2GB)', 'INFO');

    const files = [
      'IA_ZERO.07/model_checkpoint_epoch48.safetensors.aes',
      'IA_ZERO.07/training_eval_loss_run9.parquet.aes',
      'contracts/Master_Service_Agreement_QC_2025.pdf.aes',
      'dossiers_clients_qc/finance_audit_Q1_2025.xlsx.aes',
      'databases/vault_sqlite_metadata.db.aes',
      'vault.keychain.enc',
    ];

    let currentP = 4;
    const interval = setInterval(() => {
      currentP += Math.floor(Math.random() * 12) + 8;
      if (currentP >= 100) {
        currentP = 100;
        clearInterval(interval);
        setProgress(100);
        setIsRunning(false);
        const timeNow = new Date().toLocaleTimeString('fr-CA', { hour12: false });
        setLastRunTime(`Aujourd'hui à ${timeNow} • 0 erreurs`);
        onLogMessage('1,247 files transferred • 4.218 GiB • Elapsed: 14.8s • Checks: 8 OK', 'INFO');
        onLogMessage('Sync complete: 1,247 transferred, 0 errors, 4.2GB crypted (AES-256-GCM zero-knowledge)', 'OK');
      } else {
        setProgress(currentP);
        const chunkIndex = Math.min(12, Math.floor((currentP / 100) * 12) + 1);
        setCurrentChunk(chunkIndex);
        const fileIdx = Math.floor((currentP / 100) * files.length);
        setCurrentFile(files[fileIdx] || files[0]);
        setSpeed(`${(24 + Math.random() * 8).toFixed(1)} MB/s`);
      }
    }, 450);
  };

  return (
    <div className="border border-[#1e2e24] bg-[#0e1410] font-mono shadow-xl">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#1e2e24] bg-[#0f1510] flex items-center justify-between">
        <span className="text-[11px] tracking-widest text-[#5a6a60] font-bold">
          BACKUP JOB — IA_ZERO.07
        </span>
        <span className="text-[9px] px-1.5 py-0.5 bg-[#121a14] border border-[#1e2e24] text-[#7a8a7e] font-bold">
          CRON 02:00
        </span>
      </div>

      <div className="p-3">
        {/* Source / Target Path */}
        <div className="text-[11px] text-white font-semibold flex items-center gap-2">
          <span>/sdcard/IA_ZERO.07</span>
          <span className="text-[#00ff88]">→</span>
          <span className="text-[#8affc8]">crypt:backups/IA_ZERO.07</span>
        </div>

        {/* Command Box */}
        <div className="mt-2 bg-black border border-[#1a1a1a] p-2 text-[10px] text-[#7a8a7e] font-mono leading-relaxed">
          <div className="text-[#a0b0a0]">
            <span className="text-[#5a6a60]">$</span> rclone sync /sdcard/IA_ZERO.07 crypt_zcore:backups/IA_ZERO.07 \
          </div>
          <div className="text-[#7a8a7e] pl-4">
            --transfers 4 --checkers 8 --fast-list \
          </div>
          <div className="text-[#7a8a7e] pl-4">
            --crypt-show-mapping --progress --log-level INFO
          </div>
        </div>

        {/* Source & Destination Details Cards */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-[#0a0a0a] border border-[#1e2e24] p-2">
            <div className="text-[#5a6a60] font-bold text-[9px] uppercase">SOURCE (LOCAL)</div>
            <div className="text-white font-bold mt-1">1,247 files • 4.2 GB</div>
            <div className="text-[#7a8a7e] text-[9px] mt-0.5 truncate">/sdcard/IA_ZERO.07</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1e2e24] p-2">
            <div className="text-[#5a6a60] font-bold text-[9px] uppercase">DEST (CLOUD)</div>
            <div className="text-[#00ff88] font-bold mt-1">AES-256 • obfuscated</div>
            <div className="text-[#7a8a7e] text-[9px] mt-0.5 truncate">gd_zcore:zcore_vault/...</div>
          </div>
        </div>

        {/* Progress Display when active */}
        {isRunning && (
          <div className="mt-3 bg-black border border-[#00ff88]/30 p-2.5 space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[#00ff88] font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
                <span>TRANSFERT ACTIF: {progress}%</span>
              </span>
              <span className="text-[#8affc8] font-bold">{speed}</span>
            </div>

            <div className="h-2 w-full bg-[#121a14] border border-[#1e2e24] overflow-hidden">
              <div
                className="h-full bg-[#00ff88] transition-all duration-300 shadow-[0_0_8px_#00ff88]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-[9px] text-[#7a8a7e] flex justify-between">
              <span className="truncate max-w-[200px]">Fichier: {currentFile}</span>
              <span className="shrink-0 text-[#00ff88]">Chunk {currentChunk}/12</span>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={startBackup}
          disabled={isRunning}
          className={`mt-3 w-full py-2 text-[11px] tracking-widest font-bold border transition-all active:scale-[0.98] ${
            isRunning
              ? 'border-[#00ff88]/50 text-[#00ff88] bg-[#00ff88]/10 cursor-wait'
              : 'border-[#2a3a2e] bg-[#121a14] text-[#c8d2c0] hover:border-[#00ff88]/40 hover:text-[#00ff88]'
          }`}
        >
          {isRunning ? `⏳ SYNCING... ${progress}% [||||    ]` : '▶ RUN BACKUP NOW'}
        </button>

        {/* Status Footnote */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-[#5a6a60]">
          <span
            className={`h-2 w-2 rounded-full shrink-0 ${
              isRunning ? 'bg-[#00ff88] animate-pulse' : 'bg-[#2a2a2a]'
            }`}
          />
          <span className="truncate">
            {isRunning
              ? `Uploading chunk ${currentChunk}/12 • ${speed} • ETA 12s`
              : `Dernier sync: ${lastRunTime} • Loi 25 compliant`}
          </span>
        </div>
      </div>
    </div>
  );
};
