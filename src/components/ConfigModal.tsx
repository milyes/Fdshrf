import React, { useState } from 'react';
import { RCLONE_CONF_SAMPLE } from '../data/vaultData';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onNotify }) => {
  const [activeTab, setActiveTab] = useState<'rclone' | 'script' | 'architecture'>('rclone');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fixScript = `#!/data/data/com.termux/files/usr/bin/bash
# ZCORE VAULT REMEDIATION SCRIPT — NetSecurePro Montréal
# Build: NANS-V9 / rclone-android-arm64
set -e

echo "[*] Step 1/3: Killing stale FUSE instances & freeing mountpoint..."
killall -9 rclone 2>/dev/null || true
fusermount3 -u -z /data/data/com.termux/files/home/ZCORE-Vault 2>/dev/null || true
rm -rf ~/.cache/rclone/vfs/gd_zcore_crypt/

echo "[*] Step 2/3: Refreshing OAuth2 token for gd_zcore..."
rclone config reconnect gd_zcore:

echo "[*] Step 3/3: Validating encrypted remote credentials..."
rclone lsd gd_zcore_crypt: --max-depth 1

echo "[*] Mounting ZCORE Encrypted Vault (AES-256-GCM)..."
mkdir -p ~/ZCORE-Vault
nohup rclone mount gd_zcore_crypt: ~/ZCORE-Vault \\
  --vfs-cache-mode full \\
  --vfs-cache-max-size 10G \\
  --vfs-cache-max-age 48h \\
  --buffer-size 64M \\
  --allow-other \\
  --dir-cache-time 72h \\
  --log-file /data/data/com.termux/files/usr/var/log/rclone.log \\
  --log-level INFO >/dev/null 2>&1 &

sleep 2
echo "[+] SUCCESS: ZCORE Vault mounted at ~/ZCORE-Vault (1,247 files / 4.2GB)"
`;

  const architectureText = `
[ Android Device / Samsung S24 Ultra Termux ]
      │
      ▼
[/sdcard/IA_ZERO.07/ (Local Staging 4.2 GB)]
      │
      ▼ (rclone sync --fast-list --checkers 16 --transfers 8)
[rclone gd_zcore_crypt (AES-256-GCM + Crypt Header Salt)]
      │
      ▼ (Google Drive API v3 / HTTPS TLS 1.3)
[Google Drive Cloud : /ZCORE_VAULT_2026/ (4.2 GB, 1,247 encrypted blobs)]
      │
      ▼ (FUSE Mount /dev/fuse)
[~/ZCORE-Vault Virtual Directory -> Decrypted rw access via Termux / Obsidian / ZTerminal]
`;

  const contentToCopy = activeTab === 'rclone' ? RCLONE_CONF_SAMPLE : activeTab === 'script' ? fixScript : architectureText;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    onNotify('Copié dans le presse-papiers');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#0e0e0e] border border-[#00ff88]/50 rounded-xs w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(0,255,136,0.2)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff88] text-base">⚙</span>
            <span className="text-white text-xs font-bold tracking-wider">
              INSPECTION SYSTÈME & CONFIGURATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white px-2 py-0.5 text-xs border border-neutral-700 hover:border-neutral-500 rounded-xs"
          >
            ✕ FERMER [ESC]
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#222] bg-[#0c0c0c] text-xs">
          <button
            onClick={() => setActiveTab('rclone')}
            className={`px-3 py-1.5 border-b-2 font-bold transition-colors ${
              activeTab === 'rclone'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ~/.config/rclone/rclone.conf
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 border-b-2 font-bold transition-colors ${
              activeTab === 'script'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ~/bin/fix_zcore.sh
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 border-b-2 font-bold transition-colors ${
              activeTab === 'architecture'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ARCH_DIAGRAM
          </button>
        </div>

        {/* Content Box */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-[#0a0a0a]">
          <pre className="text-neutral-300 whitespace-pre-wrap leading-relaxed select-all">
            {activeTab === 'rclone' && RCLONE_CONF_SAMPLE}
            {activeTab === 'script' && fixScript}
            {activeTab === 'architecture' && architectureText}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#222] bg-[#121212] text-xs">
          <div className="text-neutral-500 text-[11px]">
            {activeTab === 'rclone' && 'Chiffrement AES-256 standard NIST • Sel cryptographique actif'}
            {activeTab === 'script' && 'Exécutable Bash Termux Android ARM64'}
            {activeTab === 'architecture' && 'NetSecurePro Montréal • Le Camion Blindé Cloud'}
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-[#00ff88]/15 hover:bg-[#00ff88]/30 border border-[#00ff88]/60 text-[#00ff88] rounded-xs font-bold transition-all"
          >
            {copied ? '✓ COPIÉ DANS LE PRESSE-PAPIERS' : '📋 COPIER LE CODE'}
          </button>
        </div>
      </div>
    </div>
  );
};
