import { Person, Receipt, ReceiptItem, SplitSummary, PersonSummary } from '../types';

export const PERSON_COLORS = [
  { color: '#10b981', avatarBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' }, // Emerald
  { color: '#06b6d4', avatarBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' },       // Cyan
  { color: '#8b5cf6', avatarBg: 'bg-violet-500/20 border-violet-500/40 text-violet-400' },   // Violet
  { color: '#ec4899', avatarBg: 'bg-pink-500/20 border-pink-500/40 text-pink-400' },       // Pink
  { color: '#f59e0b', avatarBg: 'bg-amber-500/20 border-amber-500/40 text-amber-400' },     // Amber
  { color: '#3b82f6', avatarBg: 'bg-blue-500/20 border-blue-500/40 text-blue-400' },       // Blue
  { color: '#14b8a6', avatarBg: 'bg-teal-500/20 border-teal-500/40 text-teal-400' },       // Teal
  { color: '#f97316', avatarBg: 'bg-orange-500/20 border-orange-500/40 text-orange-400' },   // Orange
  { color: '#a855f7', avatarBg: 'bg-purple-500/20 border-purple-500/40 text-purple-400' },   // Purple
];

export function getPersonBadgeClasses(index: number) {
  const c = PERSON_COLORS[index % PERSON_COLORS.length];
  return c;
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  if (isNaN(amount)) return `${currency}0.00`;
  return `${currency}${amount.toFixed(2)}`;
}

export function calculateSplitSummary(
  receipt: Receipt,
  people: Person[]
): SplitSummary {
  const totalFoodSubtotal = receipt.items.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Track each person's consumed items & share
  const personItemMap: Record<string, { item: ReceiptItem; fraction: number; amount: number }[]> = {};
  const personSubtotals: Record<string, number> = {};

  people.forEach(p => {
    personItemMap[p.name] = [];
    personSubtotals[p.name] = 0;
  });

  let assignedFoodSubtotal = 0;
  let unassignedFoodSubtotal = 0;
  const unassignedItemsList: ReceiptItem[] = [];

  receipt.items.forEach(item => {
    const assigned = item.assignedTo || [];
    if (assigned.length === 0) {
      unassignedFoodSubtotal += item.price;
      unassignedItemsList.push(item);
    } else {
      assignedFoodSubtotal += item.price;
      // Calculate fraction per person
      assigned.forEach(personName => {
        // If shares are specified, use them, otherwise split equally
        const fraction = item.shares && item.shares[personName] !== undefined
          ? item.shares[personName]
          : 1 / assigned.length;
        
        const shareAmount = item.price * fraction;
        if (!personItemMap[personName]) {
          personItemMap[personName] = [];
          personSubtotals[personName] = 0;
        }
        personItemMap[personName].push({
          item,
          fraction,
          amount: shareAmount,
        });
        personSubtotals[personName] = (personSubtotals[personName] || 0) + shareAmount;
      });
    }
  });

  // Calculate proportional tax & tip for each person
  // Rule: each person pays tax and tip proportional to their share of the total subtotal
  const peopleSummaries: PersonSummary[] = people.map(person => {
    const subtotal = personSubtotals[person.name] || 0;
    const proportionOfFood = totalFoodSubtotal > 0 ? subtotal / totalFoodSubtotal : 0;
    
    const propTax = receipt.tax * proportionOfFood;
    const propTip = receipt.tip * proportionOfFood;
    const propDiscount = (receipt.discount || 0) * proportionOfFood;
    const totalOwed = subtotal + propTax + propTip - propDiscount;

    return {
      person,
      items: personItemMap[person.name] || [],
      itemsSubtotal: Number(subtotal.toFixed(2)),
      proportionalTax: Number(propTax.toFixed(2)),
      proportionalTip: Number(propTip.toFixed(2)),
      proportionalDiscount: Number(propDiscount.toFixed(2)),
      totalOwed: Number(totalOwed.toFixed(2)),
      percentageOfAssigned: assignedFoodSubtotal > 0 ? (subtotal / assignedFoodSubtotal) * 100 : 0,
    };
  });

  const assignmentPercentage = totalFoodSubtotal > 0 
    ? Math.min(100, Math.round((assignedFoodSubtotal / totalFoodSubtotal) * 100))
    : 100;

  return {
    peopleSummaries,
    totalAssignedItems: receipt.items.length - unassignedItemsList.length,
    totalUnassignedItems: unassignedItemsList.length,
    unassignedItemsList,
    totalFoodSubtotal: Number(totalFoodSubtotal.toFixed(2)),
    assignedFoodSubtotal: Number(assignedFoodSubtotal.toFixed(2)),
    unassignedFoodSubtotal: Number(unassignedFoodSubtotal.toFixed(2)),
    totalTax: receipt.tax,
    totalTip: receipt.tip,
    grandTotal: receipt.total,
    isFullyAssigned: unassignedItemsList.length === 0,
    assignmentPercentage,
  };
}

export function generateTextSummary(receipt: Receipt, summary: SplitSummary): string {
  let text = `🧾 ${receipt.merchantName.toUpperCase()} - BILL SPLIT\n`;
  text += `📅 Date: ${receipt.date} | Total: ${formatCurrency(receipt.total, receipt.currency)}\n`;
  text += `----------------------------------------\n\n`;

  summary.peopleSummaries.forEach(ps => {
    if (ps.items.length === 0) return;
    text += `👤 ${ps.person.name.toUpperCase()} owes: ${formatCurrency(ps.totalOwed, receipt.currency)}\n`;
    text += `   Items (${formatCurrency(ps.itemsSubtotal, receipt.currency)}):\n`;
    ps.items.forEach(it => {
      const shareTag = it.fraction < 1 ? ` (${Math.round(it.fraction * 100)}% share)` : '';
      text += `    • ${it.item.name} - ${formatCurrency(it.amount, receipt.currency)}${shareTag}\n`;
    });
    text += `   + Tax share: ${formatCurrency(ps.proportionalTax, receipt.currency)}\n`;
    text += `   + Tip share: ${formatCurrency(ps.proportionalTip, receipt.currency)}\n\n`;
  });

  if (summary.totalUnassignedItems > 0) {
    text += `⚠️ Unassigned Items (${formatCurrency(summary.unassignedFoodSubtotal, receipt.currency)}):\n`;
    summary.unassignedItemsList.forEach(item => {
      text += `   • ${item.name} (${formatCurrency(item.price, receipt.currency)})\n`;
    });
    text += `\n`;
  }

  text += `Subtotal: ${formatCurrency(receipt.subtotal, receipt.currency)} | Tax: ${formatCurrency(receipt.tax, receipt.currency)} | Tip: ${formatCurrency(receipt.tip, receipt.currency)}\n`;
  text += `Generated with SplitSmart AI`;

  return text;
}
