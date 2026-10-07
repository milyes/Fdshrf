import React, { useState } from 'react';
import { VAULT_FILES_LIST, VaultFile } from '../data/vaultData';

interface FileExplorerProps {
  isMounted: boolean;
  onMountToggle: () => void;
  onFileSelect?: (file: VaultFile) => void;
  filesList?: VaultFile[];
  onOpenLanceBinUpload?: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  isMounted,
  onMountToggle,
  onFileSelect,
  filesList = VAULT_FILES_LIST,
  onOpenLanceBinUpload,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectedFile, setInspectedFile] = useState<VaultFile | null>(null);

  const filteredFiles = filesList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.cipherName.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'ALL' || f.category === selectedCategory || (selectedCategory === 'dirs' && f.type === 'dir');
    return matchesSearch && matchesCat;
  });

  const handleInspect = (file: VaultFile) => {
    setInspectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  return (
    <div className="border border-[#1e2e24] bg-[#0e1410] font-mono shadow-xl relative">
      {/* File Explorer Header */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#1e2e24] bg-[#0f1510] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-widest text-[#5a6a60]">
            $ ls -la ~/ZCORE-Vault --color=always
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#121a14] border border-[#1e2e24] text-[#00ff88] font-bold">
            {isMounted ? 'total 1,247 files • 4.2 GB' : 'total 52 • EMPTY'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isMounted && (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="filter files / cipher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black border border-[#1e2e24] px-2 py-0.5 text-[10px] text-[#c8d2c0] placeholder-[#5a6a60] focus:outline-none focus:border-[#00ff88]/40 w-32 sm:w-44"
              />
            </div>
          )}

          {onOpenLanceBinUpload && (
            <button
              onClick={onOpenLanceBinUpload}
              className="text-[10px] px-2.5 py-0.5 border border-[#00ff88] text-black bg-[#00ff88] hover:bg-[#8affc8] font-black transition-all shadow-[0_0_10px_rgba(0,255,136,0.4)] flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Téléverser et exécuter LANCE_BIN.HTML dans le coffre"
            >
              <span>🚀</span>
              <span className="hidden sm:inline">UPLOADER</span>
              <span>LANCE_BIN.HTML</span>
            </button>
          )}

          <button
            onClick={onMountToggle}
            className={`text-[10px] px-2.5 py-0.5 border font-bold transition-all active:scale-95 ${
              isMounted
                ? 'border-[#ff5a3c]/40 text-[#ff5a3c] bg-[#ff5a3c]/10 hover:bg-[#ff5a3c]/20'
                : 'border-[#00ff88]/40 text-[#00ff88] bg-[#00ff88]/10 hover:bg-[#00ff88]/20 shadow-[0_0_8px_#00ff88]'
            }`}
          >
            {isMounted ? 'UNMOUNT FUSE' : '▶ MOUNT V2'}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-3 md:p-4">
        {!isMounted ? (
          /* UNMOUNTED V1 STATE */
          <div className="text-[11px] leading-6">
            <div className="text-[#5a6a60]">
              drwx------  2 u0_a478 u0_a478  4096 May 13 14:22{' '}
              <span className="text-[#00ff88]">.</span>
            </div>
            <div className="text-[#5a6a60]">
              drwx------ 18 u0_a478 u0_a478  4096 May 13 14:20{' '}
              <span className="text-[#00ff88]">..</span>
            </div>
            <div className="text-[#5a6a60] mt-2">
              -rw-------  1 u0_a478 u0_a478     0 May 13 14:22 .nomedia
            </div>

            <div className="mt-4 border border-dashed border-[#ffcc33]/30 bg-[#ffcc33]/5 px-3 py-3 flex items-start gap-3">
              <span className="text-[#ffcc33] text-[15px] leading-none mt-0.5">⚠</span>
              <div className="space-y-1.5 flex-1">
                <div className="text-[#ffcc33] text-[11px] font-bold tracking-widest flex items-center justify-between">
                  <span>COFFRE VIDE — TOKEN EXPIRÉ</span>
                  <span className="text-[9px] px-1.5 py-0.5 border border-[#ffcc33]/30 bg-[#ffcc33]/10">
                    DIAGNOSTIC V1
                  </span>
                </div>
                <div className="text-[11px] text-[#9a8a5a] leading-relaxed">
                  Le vault est monté mais vide car{' '}
                  <span className="text-[#ffcc33] font-bold">gd_zcore</span> n'a pas de
                  token valide. Le remote crypt ne peut lister{' '}
                  <span className="text-[#c8d2c0]">gd_zcore:zcore_vault</span>.
                  Réauthentifie avec [2] puis remonte.
                </div>
                <div className="text-[10px] text-[#5a6a60] bg-black/60 p-2 border border-[#1e2e24]">
                  $ rclone ls crypt_zcore: # --&gt; 0 objects | 0 B (empty token found)
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={onMountToggle}
                    className="px-3 py-1 bg-[#00ff88] text-black text-[11px] font-bold hover:bg-[#8affc8] transition-all shadow-[0_0_10px_#00ff88]"
                  >
                    ⚡ EXÉCUTER LES FIXES & MONTER LE VAULT V2 (4.2 GB)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MOUNTED V2 STATE - 1,247 FILES & 4.2 GB ACTIVE */
          <div className="space-y-3">
            {/* Category Quick Filter */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#15201a] text-[10px]">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'ALL', label: 'TOUT (1,247)' },
                  { id: 'dirs', label: 'DOSSIERS (6)' },
                  { id: 'ai_model', label: 'IA_ZERO.07 (2.8G)' },
                  { id: 'document', label: 'CONTRATS' },
                  { id: 'finance', label: 'DOSSIERS QC' },
                  { id: 'database', label: 'SQLITE DB' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-0.5 border transition-colors ${
                      selectedCategory === cat.id
                        ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/15 font-bold'
                        : 'border-[#1e2e24] text-[#5a6a60] hover:text-[#c8d2c0]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-[#5a6a60] text-[10px] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                <span>AES-256-GCM DÉCHIFFRÉ EN TEMPS RÉEL (VFS)</span>
              </div>
            </div>

            {/* Terminal File Table */}
            <div className="overflow-x-auto border border-[#1e2e24] bg-black">
              <table className="w-full text-left text-[11px] leading-relaxed border-collapse">
                <thead>
                  <tr className="border-b border-[#1e2e24] bg-[#0c120e] text-[#5a6a60] text-[10px]">
                    <th className="py-1 px-2.5">PERMISSIONS</th>
                    <th className="py-1 px-2">USER</th>
                    <th className="py-1 px-2 text-right">TAILLE</th>
                    <th className="py-1 px-2.5">DATE</th>
                    <th className="py-1 px-3">NOM DU FICHIER (CLAIR)</th>
                    <th className="py-1 px-3 hidden md:table-cell text-[#4a5a4e]">
                      GDRIVE CHIFFRÉ (AES)
                    </th>
                    <th className="py-1 px-2 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121a14]">
                  {/* Root directory pointers */}
                  <tr className="text-[#5a6a60] hover:bg-[#0f1510]">
                    <td className="py-1 px-2.5">drwx------</td>
                    <td className="py-1 px-2">u0_a478</td>
                    <td className="py-1 px-2 text-right">4.0 KB</td>
                    <td className="py-1 px-2.5">May 13 14:25</td>
                    <td className="py-1 px-3 text-[#00ff88] font-bold">.</td>
                    <td className="py-1 px-3 hidden md:table-cell text-[#2a3a2e]">/root</td>
                    <td className="py-1 px-2 text-center text-[#4a5a4e]">-</td>
                  </tr>
                  <tr className="text-[#5a6a60] hover:bg-[#0f1510]">
                    <td className="py-1 px-2.5">drwx------</td>
                    <td className="py-1 px-2">u0_a478</td>
                    <td className="py-1 px-2 text-right">4.0 KB</td>
                    <td className="py-1 px-2.5">May 13 14:20</td>
                    <td className="py-1 px-3 text-[#00ff88] font-bold">..</td>
                    <td className="py-1 px-3 hidden md:table-cell text-[#2a3a2e]">/home</td>
                    <td className="py-1 px-2 text-center text-[#4a5a4e]">-</td>
                  </tr>

                  {filteredFiles.map((file, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleInspect(file)}
                      className="hover:bg-[#121e16] cursor-pointer group transition-colors"
                    >
                      <td className="py-1 px-2.5 text-[#5a6a60]">{file.permissions}</td>
                      <td className="py-1 px-2 text-[#4a5a4e]">u0_a478</td>
                      <td className="py-1 px-2 text-right font-bold text-[#c8d2c0] group-hover:text-white">
                        {file.size}
                      </td>
                      <td className="py-1 px-2.5 text-[#5a6a60] whitespace-nowrap">
                        {file.modified}
                      </td>
                      <td className="py-1 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={
                              file.type === 'dir'
                                ? 'text-[#00ff88] font-bold'
                                : 'text-[#c8d2c0] group-hover:text-[#8affc8]'
                            }
                          >
                            {file.type === 'dir' ? '📁 ' : '📄 '}
                            {file.name}
                          </span>
                          {file.category === 'ai_model' && (
                            <span className="text-[9px] px-1 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
                              IA_ZERO
                            </span>
                          )}
                          {file.category === 'finance' && (
                            <span className="text-[9px] px-1 bg-[#ffcc33]/10 text-[#ffcc33] border border-[#ffcc33]/30">
                              LOI 25
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-1 px-3 hidden md:table-cell text-[10px] text-[#4a5a4e] group-hover:text-[#5a6a60] font-mono">
                        {file.cipherName}
                      </td>
                      <td className="py-1 px-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspect(file);
                          }}
                          className="text-[9px] px-1.5 py-0.5 border border-[#1e2e24] group-hover:border-[#00ff88]/40 text-[#7a8a7e] group-hover:text-[#00ff88]"
                        >
                          INFO
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick summary stats bar */}
            <div className="p-2.5 border border-[#00ff88]/20 bg-[#00ff88]/5 flex flex-wrap items-center justify-between gap-2 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-[#00ff88] font-bold">✓ VAULT V2 EN LIGNE:</span>
                <span className="text-[#c8d2c0]">1,247 fichiers déchiffrés sans latence</span>
                <span className="text-[#5a6a60]">|</span>
                <span className="text-[#7a8a7e]">Taille totale: 4,218,591,240 octets (4.218 GiB)</span>
              </div>
              <div className="text-[#8affc8] font-semibold">
                Termux mount: /home/ZCORE-Vault [FUSE3 rw]
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Inspector Modal */}
      {inspectedFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1410] border border-[#00ff88]/40 p-4 max-w-lg w-full font-mono text-[11px] space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#1e2e24] pb-2">
              <span className="text-[#00ff88] font-bold flex items-center gap-2">
                <span>◈ INSPECTION CHIFFREMENT AES-256</span>
              </span>
              <button
                onClick={() => setInspectedFile(null)}
                className="text-[#5a6a60] hover:text-[#ff5a3c] text-sm font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#c8d2c0]">
              <div>
                <span className="text-[#5a6a60] block text-[10px]">NOM DÉCHIFFRÉ LOCAL:</span>
                <span className="text-white font-bold text-[12px]">{inspectedFile.name}</span>
              </div>
              <div>
                <span className="text-[#5a6a60] block text-[10px]">CHEMIN LOCAL TERMUX:</span>
                <span className="text-[#8affc8]">{inspectedFile.path}</span>
              </div>
              <div>
                <span className="text-[#5a6a60] block text-[10px]">CHEMIN GOOGLE DRIVE (OBFUSQUÉ):</span>
                <span className="text-[#ffcc33] bg-black px-2 py-0.5 border border-[#1e2e24] block mt-0.5">
                  gd_zcore:zcore_vault/{inspectedFile.cipherName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="border border-[#1e2e24] bg-black p-2">
                  <span className="text-[#5a6a60] block text-[9px]">TAILLE EN CLAIR:</span>
                  <span className="text-white font-bold">{inspectedFile.size}</span>
                </div>
                <div className="border border-[#1e2e24] bg-black p-2">
                  <span className="text-[#5a6a60] block text-[9px]">ALGORITHME:</span>
                  <span className="text-[#00ff88] font-bold">AES-256-GCM (128-bit MAC)</span>
                </div>
              </div>
              <div className="border border-[#1e2e24] bg-black p-2 text-[10px] text-[#7a8a7e]">
                <span className="text-[#00ff88] font-bold block mb-1">CONFORMITÉ LOI 25 / RGPD:</span>
                Ce fichier est chiffré avant d'atteindre les serveurs de Google. Aucun mot de passe
                ou clé maîtresse n'est stocké dans le cloud.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1e2e24]">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`rclone cat crypt_zcore:"${inspectedFile.name}" | head -n 20`);
                  alert('Commande copiée!');
                }}
                className="px-2.5 py-1 border border-[#1e2e24] hover:border-[#00ff88]/30 text-[#7a8a7e] hover:text-[#00ff88] text-[10px]"
              >
                COPY CAT CMD
              </button>
              <button
                onClick={() => setInspectedFile(null)}
                className="px-3 py-1 bg-[#121a14] border border-[#00ff88]/40 text-[#00ff88] font-bold text-[10px] hover:bg-[#00ff88]/20"
              >
                FERMER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
