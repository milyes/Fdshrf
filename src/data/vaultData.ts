export interface LogEntry {
  ts: string;
  lvl: 'INFO' | 'WARN' | 'ERR' | 'OK' | 'CMD';
  msg: string;
}

export interface FixAction {
  id: 'fuse' | 'gd' | 'pass';
  title: string;
  cmd: string;
  desc: string;
  fixMsg: string;
  label: string;
}

export interface VaultFile {
  name: string;
  path: string;
  size: string;
  bytes: number;
  type: 'file' | 'dir';
  modified: string;
  cipherName: string;
  permissions: string;
  category?: 'ai_model' | 'document' | 'finance' | 'database' | 'script' | 'config';
}

export const FIX_ACTIONS: FixAction[] = [
  {
    id: 'fuse',
    title: 'Fix fusermount3',
    cmd: 'pkg update && pkg install termux-api libfuse -y && ln -s $PREFIX/bin/fusermount $PREFIX/bin/fusermount3',
    desc: 'Symlink fusermount -> fusermount3 [Termux / Linux FUSE3]',
    fixMsg: 'fusermount3 resolved -> /data/data/com.termux/files/usr/bin/fusermount3 (FUSE 3.16.2 ready)',
    label: '[1]',
  },
  {
    id: 'gd',
    title: 'Reconnect gd_zcore',
    cmd: `rclone config reconnect gd_zcore: --auto-confirm\n# -> Token refresh via OAuth2 Google Drive (SSL pinning active)`,
    desc: 'Refresh OAuth2 token expiré (token valid 2026-10-20)',
    fixMsg: 'gd_zcore: token refreshed & cached - expires 2026-10-20T14:00Z [quota: 2.1TB / 5.0TB]',
    label: '[2]',
  },
  {
    id: 'pass',
    title: 'Remove Config Password',
    cmd: `rclone config password\n> Remove password? y\n# ou: export RCLONE_CONFIG_PASS="" && rclone config show`,
    desc: 'Retirer / déverrouiller mot de passe rclone.conf pour montage automatique',
    fixMsg: 'config password removed - crypt_zcore key unlocked [scrypt N=16384 AES-GCM]',
    label: '[3]',
  },
];

export const INITIAL_LOGS_UNMOUNTED: LogEntry[] = [
  { ts: '14:21:08', lvl: 'INFO', msg: 'rclone v1.68.0-termux // ANDROID arm64 (kernel 5.15.137)' },
  { ts: '14:21:09', lvl: 'INFO', msg: 'Reading config: /data/data/com.termux/files/home/.config/rclone/rclone.conf' },
  { ts: '14:21:11', lvl: 'WARN', msg: 'crypt_zcore: checking remote gd_zcore:zcore_vault' },
  { ts: '14:22:01', lvl: 'ERR', msg: 'gd_zcore: failed to get token: empty token found - please run "rclone config reconnect gd_zcore:"' },
  { ts: '14:22:03', lvl: 'ERR', msg: 'mount ~/ZCORE-Vault: fusermount3: command not found - exec: "fusermount3": executable file not found in $PATH' },
  { ts: '14:22:04', lvl: 'ERR', msg: 'mount failed: mountpoint ~/ZCORE-Vault not empty ? still busy' },
  { ts: '14:22:15', lvl: 'ERR', msg: 'crypt: failed to decrypt config: bad password - Set RCLONE_CONFIG_PASS correctly' },
  { ts: '14:22:16', lvl: 'WARN', msg: 'ls ~/ZCORE-Vault -> total 52 drwx------ 2 u0_a478 4096 Coffre vide' },
  { ts: '14:22:18', lvl: 'INFO', msg: 'backup job IA_ZERO.07: WAITING token refresh' },
];

export const INITIAL_LOGS_MOUNTED: LogEntry[] = [
  { ts: '14:25:01', lvl: 'INFO', msg: 'rclone v1.68.0-termux // ANDROID arm64 (kernel 5.15.137)' },
  { ts: '14:25:02', lvl: 'OK', msg: 'fusermount3: symlinked -> /data/data/com.termux/files/usr/bin/fusermount3' },
  { ts: '14:25:03', lvl: 'OK', msg: 'gd_zcore: OAuth2 token refreshed (drive scope: active, quota 2.1TB/5TB)' },
  { ts: '14:25:04', lvl: 'OK', msg: 'crypt_zcore: key derivation scrypt N=16384 r=8 p=1 unlocked successfully' },
  { ts: '14:25:06', lvl: 'CMD', msg: '$ rclone mount crypt_zcore: ~/ZCORE-Vault --daemon --vfs-cache-mode full --vfs-cache-max-size 10G --allow-other' },
  { ts: '14:25:07', lvl: 'OK', msg: 'FUSE mountpoint established at /data/data/com.termux/files/home/ZCORE-Vault [rw,nosuid,nodev]' },
  { ts: '14:25:08', lvl: 'INFO', msg: 'VFS Cache initialized: /data/data/com.termux/files/usr/var/rclone/cache (10G max)' },
  { ts: '14:25:10', lvl: 'OK', msg: 'V2 MOUNTED: 1,247 files indexed | 4,218,591,240 bytes (4.2 GB) | AES-256-GCM zero-knowledge' },
  { ts: '14:25:12', lvl: 'OK', msg: 'IA_ZERO.07 checkpoint verified: /sdcard/IA_ZERO.07 [814 models & weights in sync]' },
  { ts: '14:25:15', lvl: 'INFO', msg: 'Ready for background operations • Termux daemon pid 18492' },
];

export const VAULT_FILES_LIST: VaultFile[] = [
  // Directories
  {
    name: 'IA_ZERO.07',
    path: '~/ZCORE-Vault/IA_ZERO.07',
    size: '2.8 GB',
    bytes: 3006477107,
    type: 'dir',
    modified: 'May 13 14:18',
    cipherName: '7q2k19m.../f8a29b',
    permissions: 'drwx------',
    category: 'ai_model',
  },
  {
    name: 'contracts',
    path: '~/ZCORE-Vault/contracts',
    size: '142.6 MB',
    bytes: 149528166,
    type: 'dir',
    modified: 'May 12 18:40',
    cipherName: 'k90x1p.../9d28ca',
    permissions: 'drwx------',
    category: 'document',
  },
  {
    name: 'dossiers_clients_qc',
    path: '~/ZCORE-Vault/dossiers_clients_qc',
    size: '488.2 MB',
    bytes: 511918080,
    type: 'dir',
    modified: 'May 11 09:22',
    cipherName: 'w38m9x.../2b189f',
    permissions: 'drwx------',
    category: 'finance',
  },
  {
    name: 'databases',
    path: '~/ZCORE-Vault/databases',
    size: '715.4 MB',
    bytes: 750153728,
    type: 'dir',
    modified: 'May 10 23:15',
    cipherName: '1j98k2.../5c891a',
    permissions: 'drwx------',
    category: 'database',
  },
  {
    name: 'security_audits',
    path: '~/ZCORE-Vault/security_audits',
    size: '64.1 MB',
    bytes: 67213721,
    type: 'dir',
    modified: 'May 09 11:05',
    cipherName: '9x2k8l.../7a291b',
    permissions: 'drwx------',
    category: 'document',
  },
  {
    name: 'scripts',
    path: '~/ZCORE-Vault/scripts',
    size: '48.2 KB',
    bytes: 49356,
    type: 'dir',
    modified: 'May 08 16:30',
    cipherName: '0a1b2c.../3d4e5f',
    permissions: 'drwx------',
    category: 'script',
  },

  // Key individual files inside vault
  {
    name: 'IA_ZERO.07/model_checkpoint_epoch48.safetensors.aes',
    path: '~/ZCORE-Vault/IA_ZERO.07/model_checkpoint_epoch48.safetensors.aes',
    size: '1.42 GB',
    bytes: 1524711424,
    type: 'file',
    modified: 'May 13 14:12',
    cipherName: 'd/8f3/a9c84e1b0728.bin',
    permissions: '-rw-------',
    category: 'ai_model',
  },
  {
    name: 'IA_ZERO.07/tokenizer_vocab_bpe.json.aes',
    path: '~/ZCORE-Vault/IA_ZERO.07/tokenizer_vocab_bpe.json.aes',
    size: '4.8 MB',
    bytes: 5033164,
    type: 'file',
    modified: 'May 13 13:50',
    cipherName: 'd/8f3/98bca120984.bin',
    permissions: '-rw-------',
    category: 'ai_model',
  },
  {
    name: 'IA_ZERO.07/training_eval_loss_run9.parquet.aes',
    size: '88.4 MB',
    bytes: 92694118,
    path: '~/ZCORE-Vault/IA_ZERO.07/training_eval_loss_run9.parquet.aes',
    type: 'file',
    modified: 'May 13 14:15',
    cipherName: 'd/8f3/09fae829304.bin',
    permissions: '-rw-------',
    category: 'ai_model',
  },
  {
    name: 'contracts/NDA_NetSecure_2024.pdf.aes',
    path: '~/ZCORE-Vault/contracts/NDA_NetSecure_2024.pdf.aes',
    size: '1.2 MB',
    bytes: 1247849,
    type: 'file',
    modified: 'May 12 18:20',
    cipherName: 'f/4a1/c9810ef7201.bin',
    permissions: '-rw-------',
    category: 'document',
  },
  {
    name: 'contracts/Master_Service_Agreement_QC_2025.pdf.aes',
    path: '~/ZCORE-Vault/contracts/Master_Service_Agreement_QC_2025.pdf.aes',
    size: '3.4 MB',
    bytes: 3565158,
    type: 'file',
    modified: 'May 12 18:35',
    cipherName: 'f/4a1/8120bba9201.bin',
    permissions: '-rw-------',
    category: 'document',
  },
  {
    name: 'dossiers_clients_qc/finance_audit_Q1_2025.xlsx.aes',
    path: '~/ZCORE-Vault/dossiers_clients_qc/finance_audit_Q1_2025.xlsx.aes',
    size: '871.4 KB',
    bytes: 892341,
    type: 'file',
    modified: 'May 11 09:15',
    cipherName: 'c/21e/778901ba394.bin',
    permissions: '-rw-------',
    category: 'finance',
  },
  {
    name: 'dossiers_clients_qc/loi25_registre_incidents_qc.enc',
    path: '~/ZCORE-Vault/dossiers_clients_qc/loi25_registre_incidents_qc.enc',
    size: '2.1 MB',
    bytes: 2202009,
    type: 'file',
    modified: 'May 11 09:20',
    cipherName: 'c/21e/99410ea8211.bin',
    permissions: '-rw-------',
    category: 'finance',
  },
  {
    name: 'databases/vault_sqlite_metadata.db.aes',
    path: '~/ZCORE-Vault/databases/vault_sqlite_metadata.db.aes',
    size: '128.5 MB',
    bytes: 134742016,
    type: 'file',
    modified: 'May 10 23:10',
    cipherName: 'b/99a/650198ca128.bin',
    permissions: '-rw-------',
    category: 'database',
  },
  {
    name: 'scripts/backup_cron.sh',
    path: '~/ZCORE-Vault/scripts/backup_cron.sh',
    size: '1.8 KB',
    bytes: 1843,
    type: 'file',
    modified: 'May 08 16:15',
    cipherName: 'e/31d/44091ab7720.bin',
    permissions: '-rwx------',
    category: 'script',
  },
  {
    name: 'vault.keychain.enc',
    path: '~/ZCORE-Vault/vault.keychain.enc',
    size: '512 B',
    bytes: 512,
    type: 'file',
    modified: 'May 07 10:00',
    cipherName: 'a/001/00000000001.bin',
    permissions: '-rw-------',
    category: 'config',
  },
  {
    name: '.nomedia',
    path: '~/ZCORE-Vault/.nomedia',
    size: '0 B',
    bytes: 0,
    type: 'file',
    modified: 'May 07 09:59',
    cipherName: '.nomedia',
    permissions: '-rw-------',
    category: 'config',
  },
];

export const DEFAULT_LOGS = INITIAL_LOGS_MOUNTED;

export const VAULT_METRICS = {
  totalFiles: 1247,
  totalBytes: 4510834688,
  totalSize: '4.2 GB',
  status: 'MOUNTED',
  cipher: 'AES-256-GCM',
  mountPoint: '~/ZCORE-Vault',
  remote: 'gd_zcore_crypt:',
};

export const RCLONE_CONF_SAMPLE = `[gd_zcore]
type = drive
scope = drive
token = {"access_token":"ya29.a0AfH6SM...","token_type":"Bearer","refresh_token":"1//04...","expiry":"2026-10-20T14:00:00.000Z"}
client_id = 918237491823-netsecure.apps.googleusercontent.com
client_secret = GOCSPX-zcore...
team_drive = 

[crypt_zcore]
type = crypt
remote = gd_zcore:zcore_vault
filename_encryption = obfuscate
directory_name_encryption = true
password = *** UNLOCKED (scrypt N=16384 r=8 p=1) ***
password2 = *** SALT OK ***`;

export const RCLONE_CONFIG_SAMPLE = RCLONE_CONF_SAMPLE;


export const FIX_SCRIPT_SH = `#!/data/data/com.termux/files/usr/bin/bash
# ZCORE Vault Fix & Mount Script - NetSecurePro Montreal
set -e

echo "[+] 1/3 Checking fusermount3 binary..."
if ! command -v fusermount3 &> /dev/null; then
    echo "[!] fusermount3 missing, creating symlink from fusermount..."
    pkg update -y && pkg install termux-api libfuse -y
    ln -sf "$PREFIX/bin/fusermount" "$PREFIX/bin/fusermount3"
    chmod +x "$PREFIX/bin/fusermount3"
    echo "[OK] fusermount3 created successfully"
else
    echo "[OK] fusermount3 already available at $(which fusermount3)"
fi

echo "[+] 2/3 Checking GDrive OAuth token..."
rclone lsd gd_zcore: > /dev/null 2>&1 || {
    echo "[!] Refreshing token for gd_zcore:..."
    rclone config reconnect gd_zcore: --auto-confirm
}
echo "[OK] gd_zcore: token active"

echo "[+] 3/3 Checking mount point directory..."
mkdir -p "$HOME/ZCORE-Vault"

echo "[+] Mounting crypt_zcore: on ~/ZCORE-Vault with VFS full cache..."
rclone mount crypt_zcore: "$HOME/ZCORE-Vault" \\
    --daemon \\
    --vfs-cache-mode full \\
    --vfs-cache-max-size 10G \\
    --allow-other \\
    --dir-cache-time 72h \\
    --log-file "$PREFIX/var/log/rclone.log" \\
    --log-level INFO

echo "[SUCCESS] ~/ZCORE-Vault mounted (1,247 files, 4.2GB decrypted transparently)"
`;
