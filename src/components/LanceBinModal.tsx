import React, { useState, useRef } from 'react';
import { VaultFile } from '../data/vaultData';

interface LanceBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUploaded: (file: VaultFile, htmlContent: string) => void;
  onLogMessage: (msg: string, lvl?: 'INFO' | 'WARN' | 'ERR' | 'OK' | 'CMD') => void;
  onNotify: (msg: string) => void;
}

export const LanceBinModal: React.FC<LanceBinModalProps> = ({
  isOpen,
  onClose,
  onFileUploaded,
  onLogMessage,
  onNotify,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('LANCE_BIN.HTML');
  const [targetDir, setTargetDir] = useState<string>('scripts');
  const [encryptAES, setEncryptAES] = useState<boolean>(true);
  const [autoExecute, setAutoExecute] = useState<boolean>(true);
  const [htmlContentPreview, setHtmlContentPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'upload' | 'preview' | 'executing' | 'done'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const DEFAULT_SAMPLE_HTML = `<!DOCTYPE html>
<html lang="fr-CA">
<head>
  <meta charset="UTF-8">
  <title>LANCE_BIN — NetSecurePro ZCORE Launcher</title>
  <style>
    body { background: #0a0a0a; color: #00ff88; font-family: monospace; padding: 20px; }
    h1 { border-bottom: 1px solid #00ff88; padding-bottom: 10px; font-size: 18px; }
    .badge { background: #00ff88; color: #000; font-weight: bold; padding: 2px 6px; }
    .log { background: #000; border: 1px solid #222; padding: 12px; margin-top: 15px; }
  </style>
</head>
<body>
  <h1>🚀 LANCE_BIN // ZCORE BINARY LAUNCHER <span class="badge">NANS-V9</span></h1>
  <p><strong>Environnement:</strong> Android Termux ARM64 | FUSE Mount Point: ~/ZCORE-Vault</p>
  <p><strong>Chiffrement:</strong> AES-256-GCM Zero-Knowledge Protocol</p>
  <div class="log">
    <div>[OK] Détection binaire: /data/data/com.termux/files/home/ZCORE-Vault/scripts/</div>
    <div>[OK] Permissions: -rwxr-xr-x (chmod +x actif)</div>
    <div>[INFO] Exécution pipeline IA_ZERO.07 synchronisée.</div>
  </div>
</body>
</html>`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name.toUpperCase().endsWith('.HTML') ? file.name : `${file.name}`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setHtmlContentPreview(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUseDefaultSample = () => {
    setSelectedFile(new File([DEFAULT_SAMPLE_HTML], 'LANCE_BIN.HTML', { type: 'text/html' }));
    setFileName('LANCE_BIN.HTML');
    setHtmlContentPreview(DEFAULT_SAMPLE_HTML);
    onNotify('Modèle LANCE_BIN.HTML chargé');
  };

  const handleUploadAndRun = () => {
    setIsProcessing(true);
    setViewMode('executing');
    setExecutionLog([]);

    const content = htmlContentPreview || DEFAULT_SAMPLE_HTML;
    const finalName = fileName.trim() || 'LANCE_BIN.HTML';
    const fileSizeStr = `${(content.length / 1024).toFixed(1)} KB`;
    const targetPath = `~/ZCORE-Vault/${targetDir}/${finalName}`;
    const cipherBlob = `e/71b/${Math.random().toString(36).substring(2, 10)}.bin`;

    const logsToAdd: string[] = [
      `[*] Réception du fichier HTML: ${finalName} (${content.length} octets)`,
      `[*] Vérification de sécurité MIME: text/html (W3C Standard)`,
      encryptAES ? `[+] Chiffrement AES-256-GCM : clé dérivée via scrypt N=16384` : `[!] Chiffrement désactivé (mode clair)`,
      `[+] Écriture locale vers point de montage: ${targetPath}`,
      `[+] Attribution des permissions d'exécution: chmod +x ${targetPath}`,
      `[*] Synchronisation automatique vers gd_zcore_crypt:${targetDir}/${finalName}...`,
      `[OK] Remote blob généré: ${cipherBlob}`,
      autoExecute ? `[🚀 LANCE_BIN] Exécution du binaire/script HTML dans l'environnement Termux...` : `[*] Prêt pour exécution manuelle.`,
    ];

    onLogMessage(`$ rclone copyto /tmp/${finalName} gd_zcore_crypt:${targetDir}/${finalName} --crypt-show-mapping`, 'CMD');
    onLogMessage(`[UPLOAD] Fichier ${finalName} injecté dans ~/ZCORE-Vault/${targetDir}/`, 'OK');

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < logsToAdd.length) {
        setExecutionLog(prev => [...prev, logsToAdd[idx]]);
        onLogMessage(logsToAdd[idx], logsToAdd[idx].startsWith('[+]') || logsToAdd[idx].startsWith('[OK]') ? 'OK' : 'INFO');
        idx++;
      } else {
        clearInterval(timer);
        setIsProcessing(false);
        setViewMode('done');

        // Create new VaultFile to inject into explorer
        const newVaultFile: VaultFile = {
          name: `${targetDir}/${finalName}`,
          path: targetPath,
          size: fileSizeStr,
          bytes: content.length,
          type: 'file',
          modified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit', hour12: false }),
          cipherName: cipherBlob,
          permissions: '-rwxr-xr-x',
          category: 'script',
        };

        onFileUploaded(newVaultFile, content);
        onNotify(`✓ ${finalName} téléversé et exécuté avec succès`);
      }
    }, 380);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#0e0e0e] border border-[#00ff88]/60 rounded-xs w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_40px_rgba(0,255,136,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff88] text-base animate-pulse">🚀</span>
            <div>
              <span className="text-white text-xs font-black tracking-wider uppercase">
                TÉLÉVERSEMENT & EXÉCUTION — LANCE_BIN.HTML
              </span>
              <span className="text-[10px] text-neutral-500 block">
                Injecter un lanceur binaire HTML dans le Coffre Chiffré ~/ZCORE-Vault
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white px-2 py-0.5 text-xs border border-neutral-700 hover:border-neutral-500 rounded-xs"
          >
            ✕ FERMER [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {viewMode === 'upload' && (
            <>
              {/* Dropzone & File Select */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#00ff88]/40 hover:border-[#00ff88] bg-[#0c140f] hover:bg-[#0c1a12] p-5 rounded-xs text-center cursor-pointer transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".html,.htm,.txt" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                <div className="text-[#00ff88] font-bold text-xs">
                  {selectedFile ? `Fichier sélectionné : ${selectedFile.name}` : 'Cliquez pour sélectionner LANCE_BIN.HTML depuis votre appareil'}
                </div>
                <div className="text-neutral-500 text-[10px] mt-1">
                  Formats acceptés : .HTML, .HTM (Binaire lanceur Termux ou tableau de bord embarqué)
                </div>
              </div>

              {/* Quick Preset Choice */}
              <div className="flex items-center justify-between bg-[#121212] border border-[#222] p-2.5 rounded-xs">
                <div>
                  <div className="text-neutral-300 font-bold text-[11px]">Pas de fichier LANCE_BIN.HTML sous la main ?</div>
                  <div className="text-neutral-500 text-[10px]">Utiliser le modèle officiel NetSecurePro LANCE_BIN.HTML optimisé NANS-V9</div>
                </div>
                <button
                  type="button"
                  onClick={handleUseDefaultSample}
                  className="px-2.5 py-1 bg-[#00ff88]/15 hover:bg-[#00ff88]/30 border border-[#00ff88]/50 text-[#00ff88] text-[10px] font-bold rounded-xs shrink-0 transition-colors"
                >
                  ⚡ CHARGER MODÈLE
                </button>
              </div>

              {/* Form Config Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#111] p-3 border border-[#222]">
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                    Nom du fichier dans le Vault:
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-black border border-neutral-700 focus:border-[#00ff88] text-[#00ff88] px-2.5 py-1.5 text-xs font-mono rounded-xs outline-none"
                    placeholder="LANCE_BIN.HTML"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                    Dossier de destination (FUSE):
                  </label>
                  <select
                    value={targetDir}
                    onChange={(e) => setTargetDir(e.target.value)}
                    className="w-full bg-black border border-neutral-700 focus:border-[#00ff88] text-white px-2.5 py-1.5 text-xs font-mono rounded-xs outline-none"
                  >
                    <option value="scripts">~/ZCORE-Vault/scripts/ (Recommandé)</option>
                    <option value="IA_ZERO.07">~/ZCORE-Vault/IA_ZERO.07/</option>
                    <option value="contracts">~/ZCORE-Vault/contracts/</option>
                    <option value="dossiers_clients_qc">~/ZCORE-Vault/dossiers_clients_qc/</option>
                    <option value="">~/ZCORE-Vault/ (Racine)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="encryptCheck"
                    checked={encryptAES}
                    onChange={(e) => setEncryptAES(e.target.checked)}
                    className="accent-[#00ff88]"
                  />
                  <label htmlFor="encryptCheck" className="text-[11px] text-neutral-300 cursor-pointer">
                    Chiffrement <span className="text-[#00ff88] font-bold">AES-256-GCM</span> automatique
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="autoExecCheck"
                    checked={autoExecute}
                    onChange={(e) => setAutoExecute(e.target.checked)}
                    className="accent-[#00ff88]"
                  />
                  <label htmlFor="autoExecCheck" className="text-[11px] text-neutral-300 cursor-pointer">
                    Lancer l'exécution binaire après téléversement
                  </label>
                </div>
              </div>

              {/* HTML Preview Toggle */}
              {htmlContentPreview && (
                <div className="border border-neutral-800 bg-black p-2.5 rounded-xs">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1.5">
                    <span className="font-bold text-neutral-400 uppercase">APERÇU CODE SOURCE ({fileName})</span>
                    <span>{htmlContentPreview.length} caractères</span>
                  </div>
                  <pre className="text-[10px] text-[#8affc8] max-h-32 overflow-y-auto whitespace-pre-wrap leading-tight bg-[#050505] p-2 border border-neutral-900 select-all">
                    {htmlContentPreview.substring(0, 800)}
                    {htmlContentPreview.length > 800 ? '\n... [contenu tronqué pour aperçu]' : ''}
                  </pre>
                </div>
              )}
            </>
          )}

          {/* Executing Animation / Real-time pipeline */}
          {(viewMode === 'executing' || viewMode === 'done') && (
            <div className="space-y-3">
              <div className="bg-[#09100c] border border-[#00ff88]/40 p-3 rounded-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : 'bg-[#00ff88]'}`} />
                  <span className="text-white font-bold text-xs uppercase">
                    {isProcessing ? 'INJECTION & EXÉCUTION EN COURS...' : '✓ EXÉCUTION TERMINÉE AVEC SUCCÈS'}
                  </span>
                </div>
                <span className="text-[11px] text-[#00ff88] font-bold">
                  {targetDir ? `~/ZCORE-Vault/${targetDir}/${fileName}` : `~/ZCORE-Vault/${fileName}`}
                </span>
              </div>

              {/* Pipeline Log Window */}
              <div className="bg-black border border-neutral-800 p-3 rounded-xs font-mono text-[11px] text-neutral-300 max-h-60 overflow-y-auto space-y-1">
                {executionLog.map((line, idx) => (
                  <div 
                    key={idx}
                    className={`leading-relaxed ${
                      line.startsWith('[+]') || line.startsWith('[OK]')
                        ? 'text-[#00ff88]'
                        : line.startsWith('[🚀')
                        ? 'text-cyan-400 font-bold'
                        : line.startsWith('[!]')
                        ? 'text-amber-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Rendered HTML Sandbox Live Preview */}
              {viewMode === 'done' && (
                <div className="border border-[#00ff88]/30 rounded-xs overflow-hidden">
                  <div className="bg-[#161616] px-3 py-1.5 text-[10px] text-neutral-400 flex items-center justify-between border-b border-neutral-800">
                    <span className="font-bold text-[#00ff88]">VUE EXÉCUTÉE DANS LE NAVIGATEUR (SANDBOX):</span>
                    <span className="text-neutral-500">file://localhost/~/ZCORE-Vault/{targetDir}/{fileName}</span>
                  </div>
                  <iframe
                    title="LANCE_BIN Preview"
                    srcDoc={htmlContentPreview || DEFAULT_SAMPLE_HTML}
                    className="w-full h-44 bg-[#0a0a0a] border-none"
                    sandbox="allow-scripts"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#222] bg-[#121212] text-xs">
          <div className="text-neutral-500 text-[11px]">
            {viewMode === 'upload' && 'Intégration transparente FUSE / rclone cryptée'}
            {viewMode === 'executing' && 'Exécution sandboxée Termux aarch64'}
            {viewMode === 'done' && 'Fichier disponible dans l\'explorateur de fichiers'}
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'done' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('upload');
                    setSelectedFile(null);
                  }}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xs font-bold transition-all text-xs"
                >
                  NOUVEAU FICHIER
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 bg-[#00ff88] hover:bg-[#00dd77] text-black font-black rounded-xs shadow-[0_0_15px_#00ff88] transition-all text-xs"
                >
                  ✓ TERMINER & VOIR VAULT
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xs font-bold transition-all text-xs"
                >
                  ANNULER
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleUploadAndRun}
                  className="px-4 py-1.5 bg-[#00ff88] hover:bg-[#00dd77] disabled:opacity-50 text-black font-black rounded-xs shadow-[0_0_15px_#00ff88] transition-all text-xs flex items-center gap-1.5"
                >
                  <span>🚀</span>
                  <span>UPLOADER & LANCER LANCE_BIN</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
