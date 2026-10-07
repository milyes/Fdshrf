import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_LOGS, 
  LogEntry, 
  FIX_ACTIONS, 
  FixAction, 
  VAULT_METRICS,
  VAULT_FILES_LIST,
  VaultFile,
  RCLONE_CONF_SAMPLE
} from './data/vaultData';
import { Terminal } from './components/Terminal';
import { FixPanel } from './components/FixPanel';
import { BackupRunner } from './components/BackupRunner';
import { FileExplorer } from './components/FileExplorer';
import { ConfigModal } from './components/ConfigModal';
import { LanceBinModal } from './components/LanceBinModal';

export default function App() {
  // App State - Default to v2 MOUNTED as requested by user
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const [fixesStatus, setFixesStatus] = useState<Record<string, boolean>>({
    fuse: true,
    gd: true,
    pass: true
  });
  const [logs, setLogs] = useState<LogEntry[]>(DEFAULT_LOGS);
  const [filesList, setFilesList] = useState<VaultFile[]>(VAULT_FILES_LIST);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showLanceBinModal, setShowLanceBinModal] = useState<boolean>(false);
  const [systemUptime, setSystemUptime] = useState<string>('04:18:22');
  const [activeTab, setActiveTab] = useState<'all' | 'terminal' | 'explorer' | 'backup'>('all');

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setSystemUptime(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addLog = (msg: string, lvl: 'INFO' | 'WARN' | 'ERR' | 'OK' | 'CMD' = 'INFO') => {
    const now = new Date();
    const ts = now.toISOString().replace('T', ' ').substring(0, 19);
    setLogs(prev => [...prev, { ts, lvl, msg }]);
  };

  const handleClearLogs = () => {
    setLogs([]);
    showToast('Logs du terminal vidés');
  };

  // Run a Fix Action
  const handleRunFix = (action: FixAction) => {
    setActiveActionId(action.id);
    addLog(`$ ${action.cmd}`, 'CMD');
    addLog(`Exécution du script de remédiation: ${action.title}...`, 'INFO');

    setTimeout(() => {
      setFixesStatus(prev => ({ ...prev, [action.id]: true }));
      addLog(`[SUCCESS] ${action.fixMsg}`, 'OK');
      setActiveActionId(null);
      showToast(`✓ Fix appliqué: ${action.label}`);

      // If all fixes are now done, auto mount
      const updated = { ...fixesStatus, [action.id]: true };
      if (updated.fuse && updated.gd && updated.pass && !isMounted) {
        setTimeout(() => {
          setIsMounted(true);
          addLog('[FUSE] Vault re-monté avec succès : 1,247 fichiers déchiffrés (4.2GB)', 'OK');
          showToast('✓ ZCORE Vault monté avec succès');
        }, 600);
      }
    }, 1200);
  };

  // Run custom CLI command
  const handleRunCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLog(`$ ${trimmed}`, 'CMD');

    const lower = trimmed.toLowerCase();
    if (lower === 'clear') {
      setLogs([]);
      return;
    }

    if (lower === 'help') {
      addLog('COMMANDES DISPONIBLES: status, mount, unmount, rclone ls, rclone size, rclone check, df -h, cat fix.sh, clear', 'INFO');
      return;
    }

    if (lower === 'status') {
      addLog(`STATUS: ${isMounted ? 'MOUNTED (v2)' : 'UNMOUNTED'} | FIXES: ${Object.values(fixesStatus).filter(Boolean).length}/3`, isMounted ? 'OK' : 'WARN');
      addLog(`FILES: ${isMounted ? '1,247 items (4.2GB)' : '0 items'} | REMOTE: gd_zcore_crypt:`, 'INFO');
      return;
    }

    if (lower.includes('mount') && !lower.includes('unmount')) {
      setIsMounted(true);
      setFixesStatus({ fuse: true, gd: true, pass: true });
      addLog('[FUSE] rclone mount gd_zcore_crypt: ~/ZCORE-Vault --vfs-cache-mode full', 'OK');
      addLog('[OK] Mountpoint actif : 1,247 fichiers / 4.2GB déchiffrés en temps réel', 'OK');
      showToast('ZCORE Vault monté');
      return;
    }

    if (lower.includes('unmount') || lower.includes('fusermount3 -u')) {
      setIsMounted(false);
      addLog('[WARN] fusermount3 -u -z ~/ZCORE-Vault : Point de montage libéré', 'WARN');
      showToast('ZCORE Vault démonté');
      return;
    }

    if (lower.includes('rclone size')) {
      if (isMounted) {
        addLog('Total objects: 1,247', 'INFO');
        addLog('Total size: 4.201 GiB (4,510,834,688 Byte)', 'OK');
      } else {
        addLog('Total objects: 0 (remote unreachable or unmounted)', 'WARN');
      }
      return;
    }

    if (lower.includes('rclone check')) {
      addLog('[*] Checking hashes between /sdcard/IA and gd_zcore_crypt:...', 'INFO');
      setTimeout(() => {
        addLog('1,247 matching, 0 differences, 0 errors. Integrity 100% OK', 'OK');
      }, 500);
      return;
    }

    if (lower.includes('df -h')) {
      addLog('Filesystem             Size  Used Avail Use% Mounted on', 'INFO');
      addLog('/dev/block/dm-54        512G  312G  200G  61% /data', 'INFO');
      if (isMounted) {
        addLog('gd_zcore_crypt:         2.0T  4.2G  2.0T   1% /data/data/com.termux/files/home/ZCORE-Vault', 'OK');
      }
      return;
    }

    if (lower.includes('cat') && lower.includes('conf')) {
      addLog(RCLONE_CONF_SAMPLE, 'INFO');
      return;
    }

    if (lower.includes('fix.sh')) {
      addLog('Exécution du script global ~/bin/fix_zcore.sh...', 'INFO');
      setFixesStatus({ fuse: true, gd: true, pass: true });
      setIsMounted(true);
      addLog('Remédiation terminée : tous les 3 correctifs au vert.', 'OK');
      showToast('Remédiation globale complétée');
      return;
    }

    // Default response
    setTimeout(() => {
      addLog(`[exec] Commande terminée avec code retour 0 (${trimmed})`, 'OK');
    }, 400);
  };

  // Toggle Mount state
  const handleToggleMount = () => {
    if (isMounted) {
      setIsMounted(false);
      addLog('[CMD] fusermount3 -u -z /data/data/com.termux/files/home/ZCORE-Vault', 'CMD');
      addLog('[WARN] Vault démonté manuellement. Le répertoire ~/ZCORE-Vault est maintenant VIDE.', 'WARN');
      showToast('Coffre démonté (UNMOUNTED)');
    } else {
      setIsMounted(true);
      setFixesStatus({ fuse: true, gd: true, pass: true });
      addLog('[CMD] rclone mount gd_zcore_crypt: ~/ZCORE-Vault --vfs-cache-mode full &', 'CMD');
      addLog('[OK] Remount réussi ! 1,247 fichiers déchiffrés (4.2 GB) disponibles.', 'OK');
      showToast('Coffre monté (v2 MOUNTED)');
    }
  };

  // Reset to original v1 unmounted state for testing demonstration
  const handleResetToV1 = () => {
    setIsMounted(false);
    setFixesStatus({ fuse: false, gd: false, pass: false });
    addLog('[ALERT] État réinitialisé au diagnostic initial : UNMOUNTED / Token expired', 'ERR');
    showToast('Mode initial (UNMOUNTED / COFFRE VIDE) chargé');
  };

  // Force all to green v2
  const handleForceV2 = () => {
    setIsMounted(true);
    setFixesStatus({ fuse: true, gd: true, pass: true });
    addLog('[SYSTEM] Forcé à v2 MOUNTED : Tous les 3 correctifs au vert, 1,247 fichiers, 4.2GB.', 'OK');
    showToast('v2 MOUNTED activé');
  };

  // Handle uploaded LANCE_BIN.HTML
  const handleFileUploaded = (file: VaultFile, content: string) => {
    setFilesList(prev => [file, ...prev]);
    addLog(`[INJECT] ${file.name} monté dans FUSE avec permissions ${file.permissions}`, 'OK');
    addLog(`[EXEC] LANCE_BIN exécuté dans Termux: ${file.path} [${file.size}]`, 'OK');
    // Ensure vault is mounted if user uploaded into it
    if (!isMounted) {
      setIsMounted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-mono flex flex-col selection:bg-[#00ff88]/30 selection:text-[#00ff88]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-3 right-3 z-50 bg-[#121212] border border-[#00ff88] text-[#00ff88] px-4 py-2 rounded-xs shadow-[0_0_25px_rgba(0,255,136,0.3)] text-xs font-bold animate-slideDown flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR / TERMINAL TELEMETRY HEADER */}
      <header className="border-b border-[#222] bg-[#0d0d0d] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
            <span className="font-black text-[#00ff88] tracking-widest text-sm">
              ANDROID-RCLONE ZCORE
            </span>
          </div>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-400 text-[11px] hidden sm:inline">
            Le Camion Blindé Cloud • NetSecurePro Montréal
          </span>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-2">
          {/* Uptime Pill */}
          <div className="bg-[#161616] border border-[#262626] px-2.5 py-1 text-[11px] text-neutral-400 flex items-center gap-1.5">
            <span className="text-neutral-500">HEURE:</span>
            <span className="text-white font-bold">{systemUptime}</span>
          </div>

          {/* Preset Switcher */}
          <div className="flex items-center bg-[#141414] border border-[#2a2a2a] p-0.5 rounded-xs">
            <button
              onClick={handleForceV2}
              className={`px-2.5 py-1 text-[10px] font-bold transition-all ${
                isMounted 
                  ? 'bg-[#00ff88] text-black shadow-[0_0_12px_rgba(0,255,136,0.5)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Passer à l'état v2 MOUNTED (1,247 fichiers / 4.2GB)"
            >
              v2 MOUNTED [ACTIF]
            </button>
            <button
              onClick={handleResetToV1}
              className={`px-2.5 py-1 text-[10px] font-bold transition-all ${
                !isMounted 
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Simuler l'état unmounted initial / token expiré"
            >
              v1 UNMOUNTED
            </button>
          </div>

          {/* Bouton Uploade LANCE_BIN.HTML */}
          <button
            onClick={() => setShowLanceBinModal(true)}
            className="px-3 py-1 bg-[#00ff88] hover:bg-[#8affc8] text-black text-[11px] font-black rounded-xs shadow-[0_0_15px_rgba(0,255,136,0.6)] hover:shadow-[0_0_22px_#00ff88] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Téléverser et lancer LANCE_BIN.HTML dans le coffre ZCORE"
          >
            <span className="text-sm">🚀</span>
            <span>UPLOADER LANCE_BIN.HTML</span>
          </button>

          {/* Config Inspector Button */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>⚙</span>
            <span className="hidden md:inline">CONFIG</span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER / NANS-V9 TELEMETRY */}
      <div className="bg-[#0f0f0f] border-b border-[#1c1c1c] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div>
            <span className="text-neutral-500">CORE: </span>
            <span className="text-neutral-300 font-bold">NANS-V9</span>
          </div>
          <div>
            <span className="text-neutral-500">ARCH: </span>
            <span className="text-neutral-300">aarch64 (Termux v0.118)</span>
          </div>
          <div>
            <span className="text-neutral-500">CIPHER: </span>
            <span className="text-[#00ff88]">AES-256-GCM (Salting v2)</span>
          </div>
          <div>
            <span className="text-neutral-500">REMOTE: </span>
            <span className="text-white">gd_zcore_crypt:</span>
          </div>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-1 text-[10px]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 py-0.5 border rounded-xs transition-colors ${
              activeTab === 'all'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            VUE COMPLÈTE
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-2 py-0.5 border rounded-xs transition-colors ${
              activeTab === 'explorer'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            FICHIERS ({VAULT_METRICS.totalFiles})
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2 py-0.5 border rounded-xs transition-colors ${
              activeTab === 'terminal'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-2 py-0.5 border rounded-xs transition-colors ${
              activeTab === 'backup'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            CRON IA_ZERO.07
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full flex flex-col gap-5">
        
        {/* VAULT STATUS HERO BANNER */}
        <div className={`border rounded-xs p-4 sm:p-5 transition-all ${
          isMounted 
            ? 'bg-[#0c140f] border-[#00ff88]/50 shadow-[0_0_30px_rgba(0,255,136,0.12)]' 
            : 'bg-[#181109] border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Status Emblem */}
              <div className={`w-12 h-12 rounded-xs border flex items-center justify-center text-xl shrink-0 ${
                isMounted
                  ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'border-amber-500 text-amber-500 bg-amber-500/10'
              }`}>
                {isMounted ? '🛡' : '⚠'}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-white text-base sm:text-lg font-black tracking-wider">
                    {isMounted ? 'COFFRE CHIFFRÉ ZCORE — v2 ACTIF' : 'DIAGNOSTIC : COFFRE DÉMONTÉ'}
                  </h1>
                  <span className={`px-2 py-0.5 text-[11px] font-black rounded-xs border uppercase tracking-wider ${
                    isMounted 
                      ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/15' 
                      : 'border-amber-500 text-amber-400 bg-amber-500/15 animate-pulse'
                  }`}>
                    {isMounted ? '● MOUNTED [FUSE-RW]' : '○ UNMOUNTED [COFFRE VIDE]'}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                  {isMounted ? (
                    <span>
                      Point de montage FUSE actif sur <code className="text-[#00ff88]">~/ZCORE-Vault</code>. Déchiffrement AES-256-GCM à la volée. 
                      Cache VFS full activé (max 10GB). Synchronisation bidirectionnelle Google Drive opérationnelle.
                    </span>
                  ) : (
                    <span>
                      Le point de montage est inactif ou le jeton OAuth2 gd_zcore a expiré. 
                      Le répertoire local est vide (0 octets). Utilisez les 3 boutons de remédiation ci-dessous pour rétablir le montage.
                    </span>
                  )}
                </p>

                {/* Metrics Bar */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500">FICHIERS:</span>
                    <span className={`font-bold ${isMounted ? 'text-[#00ff88]' : 'text-neutral-400'}`}>
                      {isMounted ? `${VAULT_METRICS.totalFiles.toLocaleString('fr-CA')} fichiers` : '0 fichier'}
                    </span>
                  </div>
                  <span className="text-neutral-700">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500">TAILLE DÉCHIFFRÉE:</span>
                    <span className={`font-bold ${isMounted ? 'text-white' : 'text-neutral-400'}`}>
                      {isMounted ? VAULT_METRICS.totalSize : '0.0 GB'}
                    </span>
                  </div>
                  <span className="text-neutral-700">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500">CACHE VFS:</span>
                    <span className="text-neutral-300 font-mono">
                      {isMounted ? '842 MB / 10 GB (Hit Rate 98.4%)' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mount Toggle Action Button */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
              <button
                onClick={handleToggleMount}
                className={`px-4 py-2 border font-bold text-xs rounded-xs transition-all flex items-center gap-2 ${
                  isMounted
                    ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                    : 'border-[#00ff88] bg-[#00ff88] hover:bg-[#00dd77] text-black shadow-[0_0_15px_#00ff88]'
                }`}
              >
                <span>{isMounted ? '⏏ DÉMONTER LE COFFRE' : '⚡ REMONTER LE COFFRE'}</span>
              </button>
              <span className="text-[10px] text-neutral-500">
                {isMounted ? 'fusermount3 -u -z' : 'rclone mount --vfs-cache-mode full'}
              </span>
            </div>
          </div>
        </div>

        {/* 3-BUTTON FIX PANEL (EXACTLY AS SPECIFIED IN USER REQUEST & HTML) */}
        {(activeTab === 'all' || activeTab === 'terminal') && (
          <FixPanel
            fixesStatus={fixesStatus}
            activeActionId={activeActionId}
            onRunFix={handleRunFix}
            onViewScript={() => setShowConfigModal(true)}
            onOpenLanceBinUpload={() => setShowLanceBinModal(true)}
          />
        )}

        {/* FILE EXPLORER SECTION (1,247 FILES / 4.2GB INTERACTIVE BROWSER) */}
        {(activeTab === 'all' || activeTab === 'explorer') && (
          <FileExplorer
            isMounted={isMounted}
            onMountToggle={handleToggleMount}
            filesList={filesList}
            onOpenLanceBinUpload={() => setShowLanceBinModal(true)}
            onFileSelect={(file) => {
              addLog(`[FILE ACCESSED] ${file.name} (${file.size}) -> Déchiffré AES-256`, 'INFO');
              showToast(`Déchiffrement vérifié: ${file.name}`);
            }}
          />
        )}

        {/* BACKUP RUNNER (IA_ZERO.07 — CRON 02:00) */}
        {(activeTab === 'all' || activeTab === 'backup') && (
          <BackupRunner onLogMessage={addLog} />
        )}

        {/* INTERACTIVE TERMINAL & LOGS */}
        {(activeTab === 'all' || activeTab === 'terminal') && (
          <Terminal
            logs={logs}
            onClear={handleClearLogs}
            onRunCommand={handleRunCommand}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1a1a1a] bg-[#0c0c0c] px-4 py-3 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff88]">●</span>
          <span>NetSecurePro Montréal • Système Android-RClone ZCORE</span>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-400">Le Camion Blindé Cloud</span>
        </div>
        <div className="text-[11px] text-neutral-600 font-mono">
          Session FUSE: pid 18492 • Socket /dev/fuse • Build NANS-V9
        </div>
      </footer>

      {/* Configuration & Architecture Inspector Modal */}
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onNotify={showToast}
      />

      {/* LANCE_BIN.HTML Upload & Execution Modal */}
      <LanceBinModal
        isOpen={showLanceBinModal}
        onClose={() => setShowLanceBinModal(false)}
        onFileUploaded={handleFileUploaded}
        onLogMessage={addLog}
        onNotify={showToast}
      />
    </div>
  );
}
