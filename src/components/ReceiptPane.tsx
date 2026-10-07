import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Plus, 
  Percent, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Edit2, 
  Trash2,
  ChevronRight,
  Eye,
  Camera,
  Coffee,
  Utensils,
  Wine,
  IceCream
} from 'lucide-react';
import { Receipt, ReceiptItem, Person } from '../types';
import { formatCurrency } from '../utils/calculator';
import { SAMPLE_RECEIPTS } from '../data/sampleReceipts';

interface ReceiptPaneProps {
  receipt: Receipt;
  onUpdateReceipt: (updated: Receipt) => void;
  people: Person[];
  onOpenAssignModal: (item: ReceiptItem) => void;
  onUploadImage: (file: File) => Promise<void>;
  onSelectSample: (sampleKey: string) => void;
  isLoading: boolean;
  activeSampleKey: string;
}

export const ReceiptPane: React.FC<ReceiptPaneProps> = ({
  receipt,
  onUpdateReceipt,
  people,
  onOpenAssignModal,
  onUploadImage,
  onSelectSample,
  isLoading,
  activeSampleKey,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'image'>('list');
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingTip, setIsEditingTip] = useState(false);
  const [isEditingTax, setIsEditingTax] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [customTipVal, setCustomTipVal] = useState(receipt.tipPercentage?.toString() || '18');
  const [customTaxVal, setCustomTaxVal] = useState(receipt.tax.toString());
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  // Tip update
  const handleSetTipPercent = (pct: number) => {
    const tipAmount = Number(((receipt.subtotal * pct) / 100).toFixed(2));
    const newTotal = Number((receipt.subtotal + receipt.tax + tipAmount - receipt.discount).toFixed(2));
    onUpdateReceipt({
      ...receipt,
      tip: tipAmount,
      tipPercentage: pct,
      total: newTotal,
    });
    setCustomTipVal(pct.toString());
  };

  const handleCustomTaxSave = () => {
    const newTax = parseFloat(customTaxVal) || 0;
    const newTotal = Number((receipt.subtotal + newTax + receipt.tip - receipt.discount).toFixed(2));
    onUpdateReceipt({
      ...receipt,
      tax: newTax,
      total: newTotal,
    });
    setIsEditingTax(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newItemPrice);
    if (!newItemName.trim() || isNaN(price) || price <= 0) return;

    const newItem: ReceiptItem = {
      id: `item_${Date.now()}`,
      name: newItemName.trim(),
      price,
      quantity: 1,
      category: 'food',
      assignedTo: [],
    };

    const updatedItems = [...receipt.items, newItem];
    const newSubtotal = updatedItems.reduce((sum, it) => sum + it.price, 0);
    const newTotal = Number((newSubtotal + receipt.tax + receipt.tip - receipt.discount).toFixed(2));

    onUpdateReceipt({
      ...receipt,
      items: updatedItems,
      subtotal: Number(newSubtotal.toFixed(2)),
      total: newTotal,
    });

    setNewItemName('');
    setNewItemPrice('');
    setIsAddingItem(false);
  };

  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedItems = receipt.items.filter((it) => it.id !== itemId);
    const newSubtotal = updatedItems.reduce((sum, it) => sum + it.price, 0);
    const newTotal = Number((newSubtotal + receipt.tax + receipt.tip - receipt.discount).toFixed(2));

    onUpdateReceipt({
      ...receipt,
      items: updatedItems,
      subtotal: Number(newSubtotal.toFixed(2)),
      total: newTotal,
    });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'drink':
        return <Wine className="w-3.5 h-3.5 text-blue-400" />;
      case 'dessert':
        return <IceCream className="w-3.5 h-3.5 text-pink-400" />;
      case 'appetizer':
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Utensils className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const currentSvg = SAMPLE_RECEIPTS[activeSampleKey]?.visualSvg;

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Top Banner / Upload Controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Parsed Receipt
              </h2>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {receipt.items.length} items
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {receipt.merchantName} • {receipt.date}
            </p>
          </div>

          {/* Toggle between list view and receipt image */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex text-xs">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Items</span>
              </button>
              <button
                onClick={() => setViewMode('image')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'image'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Paper Receipt</span>
              </button>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors active:scale-95"
              title="Upload new receipt image"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Sample Receipts Quick Switcher Bar */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60 overflow-x-auto text-xs scrollbar-none pb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Samples:
          </span>
          {Object.entries(SAMPLE_RECEIPTS).map(([key, data]) => {
            const isActive = activeSampleKey === key;
            return (
              <button
                key={key}
                onClick={() => onSelectSample(key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {data.label.split(' ')[0]} {data.label.split(' ')[1] || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loading state with AI scanner effect */}
        {isLoading && (
          <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse pointer-events-none" />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Analyzing Receipt with Gemini Vision...</h3>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Extracting line items, prices, tax, and merchant details
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Drag & drop upload target */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10'
              : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Drop a receipt photo here or click to upload (PNG, JPG, HEIC)</span>
          </div>
        </div>

        {/* View Mode: SVG / Image View */}
        {viewMode === 'image' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl border border-slate-700 bg-[#fdfbf7]">
              {currentSvg ? (
                <div 
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: currentSvg }} 
                />
              ) : receipt.imageUrl ? (
                <img 
                  src={receipt.imageUrl} 
                  alt="Receipt" 
                  className="w-full h-auto object-contain max-h-[500px]" 
                />
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono text-sm">
                  Receipt image preview not available.
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Items extracted via Gemini OCR and listed on the Items tab.
            </p>
          </div>
        )}

        {/* View Mode: Itemized List */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2">
              <span>Item & Assignments</span>
              <span>Price</span>
            </div>

            {receipt.items.map((item, index) => {
              const isAssigned = item.assignedTo && item.assignedTo.length > 0;
              const isSplit = isAssigned && item.assignedTo.length > 1;

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenAssignModal(item)}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                    isAssigned
                      ? 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 shadow-sm'
                      : 'bg-amber-950/10 border-amber-900/40 hover:border-amber-500/50 hover:bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                            {item.quantity > 1 ? `${item.quantity}x ` : ''}
                            {item.name}
                          </span>
                        </div>

                        {/* Assignment Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {isAssigned ? (
                            item.assignedTo.map((name) => {
                              const person = people.find((p) => p.name.toLowerCase() === name.toLowerCase());
                              const shareRatio = item.shares && item.shares[name] !== undefined
                                ? item.shares[name]
                                : 1 / item.assignedTo.length;
                              const shareText = isSplit ? ` (${Math.round(shareRatio * 100)}%)` : '';

                              return (
                                <span
                                  key={name}
                                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-sm ${
                                    person?.avatarBg || 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  }`}
                                >
                                  <span>{name}</span>
                                  {isSplit && (
                                    <span className="text-[10px] opacity-75 font-mono">
                                      {shareText}
                                    </span>
                                  )}
                                </span>
                              );
                            })
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                              <AlertCircle className="w-3 h-3" />
                              Unassigned
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors flex items-center ml-1">
                            Click to assign
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and delete button */}
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div className="font-mono text-sm font-bold text-slate-100">
                        {formatCurrency(item.price, receipt.currency)}
                      </div>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Custom Item Button / Form */}
            {!isAddingItem ? (
              <button
                onClick={() => setIsAddingItem(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Extra Item / Fee</span>
              </button>
            ) : (
              <form onSubmit={handleAddItem} className="p-3 rounded-xl border border-slate-700 bg-slate-950 space-y-2">
                <div className="text-xs font-bold text-slate-300">Add New Item</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Item name (e.g. Extra Guacamole)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price ($)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Bill Totals & Tax/Tip Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2.5">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Food & Beverage Subtotal</span>
          <span className="font-mono font-medium text-slate-200">
            {formatCurrency(receipt.subtotal, receipt.currency)}
          </span>
        </div>

        {/* Tax Row */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Tax</span>
            {receipt.taxPercentage ? (
              <span className="text-[10px] font-mono text-slate-400">
                ({receipt.taxPercentage}%)
              </span>
            ) : null}
            <button
              onClick={() => setIsEditingTax(!isEditingTax)}
              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <Edit2 className="w-2.5 h-2.5" />
              Edit
            </button>
          </div>
          {isEditingTax ? (
            <div className="flex items-center gap-1">
              <span className="text-xs">{receipt.currency}</span>
              <input
                type="number"
                step="0.01"
                value={customTaxVal}
                onChange={(e) => setCustomTaxVal(e.target.value)}
                className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white text-right"
              />
              <button
                onClick={handleCustomTaxSave}
                className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <span className="font-mono font-medium text-slate-200">
              {formatCurrency(receipt.tax, receipt.currency)}
            </span>
          )}
        </div>

        {/* Tip Row with Presets */}
        <div className="pt-1 border-t border-slate-800/60">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span>Tip / Gratuity</span>
              <span className="text-[10px] font-mono text-emerald-400">
                ({receipt.tipPercentage || 0}%)
              </span>
            </div>
            <span className="font-mono font-medium text-emerald-300">
              {formatCurrency(receipt.tip, receipt.currency)}
            </span>
          </div>

          {/* Quick Tip % buttons */}
          <div className="grid grid-cols-5 gap-1 text-[11px] font-mono">
            {[0, 15, 18, 20, 25].map((pct) => (
              <button
                key={pct}
                onClick={() => handleSetTipPercent(pct)}
                className={`py-1 rounded font-semibold border transition-all ${
                  receipt.tipPercentage === pct
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Due</span>
            <p className="text-[11px] text-emerald-400/80">Proportionally distributed in real-time</p>
          </div>
          <span className="font-mono text-lg font-bold text-white tracking-tight">
            {formatCurrency(receipt.total, receipt.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
