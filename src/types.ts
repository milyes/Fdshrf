export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unitPrice?: number;
  category?: 'food' | 'drink' | 'dessert' | 'appetizer' | 'side' | 'other';
  assignedTo: string[]; // Person names
  shares?: Record<string, number>; // e.g. { "Sarah": 0.5, "Sue": 0.5 }
}

export interface Receipt {
  id: string;
  merchantName: string;
  date: string;
  currency: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  taxPercentage?: number;
  tip: number;
  tipPercentage?: number;
  discount: number;
  total: number;
  imageUrl?: string;
  notes?: string;
}

export interface Person {
  id: string;
  name: string;
  color: string;
  avatarBg: string;
  avatarText: string;
}

export interface PersonItemShare {
  item: ReceiptItem;
  fraction: number; // e.g., 0.5 if shared between 2
  amount: number;   // item.price * fraction
}

export interface PersonSummary {
  person: Person;
  items: PersonItemShare[];
  itemsSubtotal: number;
  proportionalTax: number;
  proportionalTip: number;
  proportionalDiscount: number;
  totalOwed: number;
  percentageOfAssigned: number;
  isSettled?: boolean;
}

export interface SplitSummary {
  peopleSummaries: PersonSummary[];
  totalAssignedItems: number;
  totalUnassignedItems: number;
  unassignedItemsList: ReceiptItem[];
  totalFoodSubtotal: number;
  assignedFoodSubtotal: number;
  unassignedFoodSubtotal: number;
  totalTax: number;
  totalTip: number;
  grandTotal: number;
  isFullyAssigned: boolean;
  assignmentPercentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionExecuted?: {
    type: string;
    description: string;
    affectedItems?: string[];
    affectedPeople?: string[];
  };
}

export interface ChatCommandResponse {
  reply: string;
  action?: 'assign' | 'unassign' | 'split' | 'split_all' | 'add_person' | 'remove_person' | 'update_tip' | 'update_tax' | 'clear_all' | 'none';
  actionDescription?: string;
  assignments?: Array<{
    itemNameOrId: string;
    assignedTo: string[];
    shares?: Record<string, number>;
  }>;
  newPeople?: string[];
  tipPercentage?: number;
  tipAmount?: number;
  taxAmount?: number;
}
