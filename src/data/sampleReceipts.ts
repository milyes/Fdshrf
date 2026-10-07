import { Receipt, Person } from '../types';

export const INITIAL_PEOPLE: Person[] = [
  { id: 'p1', name: 'Dhruv', color: '#10b981', avatarBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', avatarText: 'D' },
  { id: 'p2', name: 'Sarah', color: '#06b6d4', avatarBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400', avatarText: 'S' },
  { id: 'p3', name: 'Sue', color: '#8b5cf6', avatarBg: 'bg-violet-500/20 border-violet-500/40 text-violet-400', avatarText: 'U' },
  { id: 'p4', name: 'Alex', color: '#ec4899', avatarBg: 'bg-pink-500/20 border-pink-500/40 text-pink-400', avatarText: 'A' },
];

export const SAMPLE_RECEIPTS: Record<string, { label: string; tag: string; receipt: Receipt; visualSvg: string }> = {
  italian: {
    label: 'Bella Vista Trattoria & Cantina',
    tag: 'Dinner & Drinks (4 people)',
    visualSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480" width="100%" height="100%">
      <rect width="320" height="480" fill="#fdfbf7"/>
      <line x1="16" y1="50" x2="304" y2="50" stroke="#d1d5db" stroke-dasharray="4"/>
      <text x="160" y="32" font-family="monospace" font-size="14" font-weight="bold" fill="#111827" text-anchor="middle">BELLA VISTA TRATTORIA</text>
      <text x="160" y="44" font-family="monospace" font-size="10" fill="#6b7280" text-anchor="middle">TABLE 12 • 4 GUESTS • 8:45 PM</text>
      <text x="20" y="75" font-family="monospace" font-size="11" fill="#374151">1x Loaded Fiesta Nachos</text>
      <text x="300" y="75" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$14.50</text>
      <text x="20" y="105" font-family="monospace" font-size="11" fill="#374151">1x Margherita Woodfire Pizza</text>
      <text x="300" y="105" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$18.00</text>
      <text x="20" y="135" font-family="monospace" font-size="11" fill="#374151">1x Truffle Mushroom Penne</text>
      <text x="300" y="135" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$22.00</text>
      <text x="20" y="165" font-family="monospace" font-size="11" fill="#374151">1x Caesar Salad w/ Grilled Chicken</text>
      <text x="300" y="165" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$16.50</text>
      <text x="20" y="195" font-family="monospace" font-size="11" fill="#374151">2x Aperol Spritz Cocktail</text>
      <text x="300" y="195" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$26.00</text>
      <text x="20" y="225" font-family="monospace" font-size="11" fill="#374151">1x Sparkling San Pellegrino 750ml</text>
      <text x="300" y="225" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$6.50</text>
      <text x="20" y="255" font-family="monospace" font-size="11" fill="#374151">1x Classic Espresso Tiramisu</text>
      <text x="300" y="255" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$9.50</text>
      <line x1="16" y1="280" x2="304" y2="280" stroke="#d1d5db" stroke-dasharray="4"/>
      <text x="20" y="305" font-family="monospace" font-size="11" fill="#6b7280">SUBTOTAL</text>
      <text x="300" y="305" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$113.00</text>
      <text x="20" y="330" font-family="monospace" font-size="11" fill="#6b7280">TAX (8.875%)</text>
      <text x="300" y="330" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$10.03</text>
      <text x="20" y="355" font-family="monospace" font-size="11" fill="#6b7280">TIP / GRATUITY (18%)</text>
      <text x="300" y="355" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$20.34</text>
      <line x1="16" y1="375" x2="304" y2="375" stroke="#111827" stroke-width="1.5"/>
      <text x="20" y="405" font-family="monospace" font-size="14" font-weight="bold" fill="#111827">TOTAL DUE</text>
      <text x="300" y="405" font-family="monospace" font-size="15" font-weight="bold" fill="#111827" text-anchor="end">$143.37</text>
      <text x="160" y="445" font-family="monospace" font-size="9" fill="#9ca3af" text-anchor="middle">THANK YOU FOR DINING WITH US!</text>
    </svg>`,
    receipt: {
      id: 'rec_italian',
      merchantName: 'Bella Vista Trattoria & Cantina',
      date: 'Oct 6, 2026',
      currency: '$',
      items: [
        {
          id: 'item_1',
          name: 'Loaded Fiesta Nachos',
          price: 14.50,
          quantity: 1,
          category: 'appetizer',
          assignedTo: [],
        },
        {
          id: 'item_2',
          name: 'Margherita Woodfire Pizza',
          price: 18.00,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 'item_3',
          name: 'Truffle Mushroom Penne',
          price: 22.00,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 'item_4',
          name: 'Caesar Salad w/ Chicken',
          price: 16.50,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 'item_5',
          name: '2x Aperol Spritz Cocktail',
          price: 26.00,
          quantity: 2,
          unitPrice: 13.00,
          category: 'drink',
          assignedTo: [],
        },
        {
          id: 'item_6',
          name: 'San Pellegrino Sparkling Water',
          price: 6.50,
          quantity: 1,
          category: 'drink',
          assignedTo: [],
        },
        {
          id: 'item_7',
          name: 'Classic Espresso Tiramisu',
          price: 9.50,
          quantity: 1,
          category: 'dessert',
          assignedTo: [],
        },
      ],
      subtotal: 113.00,
      tax: 10.03,
      taxPercentage: 8.875,
      tip: 20.34,
      tipPercentage: 18,
      discount: 0,
      total: 143.37,
    },
  },
  sushi: {
    label: 'Sakura Omakase & Sushi Bar',
    tag: 'Japanese Sushi (3 people)',
    visualSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440" width="100%" height="100%">
      <rect width="320" height="440" fill="#fcfbf9"/>
      <text x="160" y="32" font-family="monospace" font-size="14" font-weight="bold" fill="#111827" text-anchor="middle">SAKURA SUSHI BAR</text>
      <text x="160" y="46" font-family="monospace" font-size="10" fill="#6b7280" text-anchor="middle">ORDER #4402 • 7:15 PM</text>
      <line x1="16" y1="56" x2="304" y2="56" stroke="#d1d5db" stroke-dasharray="4"/>
      <text x="20" y="85" font-family="monospace" font-size="11" fill="#374151">1x Spicy Salmon Roll (8pcs)</text>
      <text x="300" y="85" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$15.00</text>
      <text x="20" y="115" font-family="monospace" font-size="11" fill="#374151">1x Dragon Roll (Unagi & Avocado)</text>
      <text x="300" y="115" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$19.50</text>
      <text x="20" y="145" font-family="monospace" font-size="11" fill="#374151">1x Steamed Edamame with Sea Salt</text>
      <text x="300" y="145" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$7.00</text>
      <text x="20" y="175" font-family="monospace" font-size="11" fill="#374151">1x Pork Gyoza Pan Fried (6pcs)</text>
      <text x="300" y="175" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$9.50</text>
      <text x="20" y="205" font-family="monospace" font-size="11" fill="#374151">2x Sapporo Draft Beer</text>
      <text x="300" y="205" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$16.00</text>
      <text x="20" y="235" font-family="monospace" font-size="11" fill="#374151">1x Green Tea Mochi Trio</text>
      <text x="300" y="235" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$8.00</text>
      <line x1="16" y1="260" x2="304" y2="260" stroke="#d1d5db" stroke-dasharray="4"/>
      <text x="20" y="285" font-family="monospace" font-size="11" fill="#6b7280">SUBTOTAL</text>
      <text x="300" y="285" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$75.00</text>
      <text x="20" y="310" font-family="monospace" font-size="11" fill="#6b7280">TAX (9%)</text>
      <text x="300" y="310" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$6.75</text>
      <text x="20" y="335" font-family="monospace" font-size="11" fill="#6b7280">TIP (20%)</text>
      <text x="300" y="335" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$15.00</text>
      <line x1="16" y1="355" x2="304" y2="355" stroke="#111827" stroke-width="1.5"/>
      <text x="20" y="380" font-family="monospace" font-size="14" font-weight="bold" fill="#111827">TOTAL</text>
      <text x="300" y="380" font-family="monospace" font-size="15" font-weight="bold" fill="#111827" text-anchor="end">$96.75</text>
    </svg>`,
    receipt: {
      id: 'rec_sushi',
      merchantName: 'Sakura Omakase & Sushi Bar',
      date: 'Oct 6, 2026',
      currency: '$',
      items: [
        {
          id: 's_1',
          name: 'Spicy Salmon Roll (8pcs)',
          price: 15.00,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 's_2',
          name: 'Dragon Roll (Unagi & Avocado)',
          price: 19.50,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 's_3',
          name: 'Steamed Edamame w/ Sea Salt',
          price: 7.00,
          quantity: 1,
          category: 'appetizer',
          assignedTo: [],
        },
        {
          id: 's_4',
          name: 'Pork Gyoza (6pcs)',
          price: 9.50,
          quantity: 1,
          category: 'appetizer',
          assignedTo: [],
        },
        {
          id: 's_5',
          name: '2x Sapporo Draft Beer',
          price: 16.00,
          quantity: 2,
          unitPrice: 8.00,
          category: 'drink',
          assignedTo: [],
        },
        {
          id: 's_6',
          name: 'Green Tea Mochi Trio',
          price: 8.00,
          quantity: 1,
          category: 'dessert',
          assignedTo: [],
        },
      ],
      subtotal: 75.00,
      tax: 6.75,
      taxPercentage: 9.0,
      tip: 15.00,
      tipPercentage: 20,
      discount: 0,
      total: 96.75,
    },
  },
  brunch: {
    label: 'Morning Glory Artisan Cafe',
    tag: 'Weekend Brunch (3 people)',
    visualSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
      <rect width="320" height="400" fill="#fbfaf6"/>
      <text x="160" y="32" font-family="monospace" font-size="14" font-weight="bold" fill="#111827" text-anchor="middle">MORNING GLORY CAFE</text>
      <text x="160" y="46" font-family="monospace" font-size="10" fill="#6b7280" text-anchor="middle">SUN 10:30 AM • CHECK #109</text>
      <line x1="16" y1="56" x2="304" y2="56" stroke="#d1d5db" stroke-dasharray="4"/>
      <text x="20" y="85" font-family="monospace" font-size="11" fill="#374151">1x Sourdough Avocado Toast</text>
      <text x="300" y="85" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$15.50</text>
      <text x="20" y="115" font-family="monospace" font-size="11" fill="#374151">1x Smoked Salmon Eggs Benedict</text>
      <text x="300" y="115" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$19.00</text>
      <text x="20" y="145" font-family="monospace" font-size="11" fill="#374151">1x Belgian Waffle w/ Fresh Berries</text>
      <text x="300" y="145" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$14.00</text>
      <text x="20" y="175" font-family="monospace" font-size="11" fill="#374151">2x Oat Milk Iced Vanilla Latte</text>
      <text x="300" y="175" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$13.00</text>
      <text x="20" y="205" font-family="monospace" font-size="11" fill="#374151">1x Fresh Squeezed Orange Juice</text>
      <text x="300" y="205" font-family="monospace" font-size="11" fill="#111827" text-anchor="end">$6.50</text>
      <line x1="16" y1="230" x2="304" y2="230" stroke="#d1d5db" stroke-dasharray="4"/>
      <text x="20" y="255" font-family="monospace" font-size="11" fill="#6b7280">SUBTOTAL</text>
      <text x="300" y="255" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$68.00</text>
      <text x="20" y="280" font-family="monospace" font-size="11" fill="#6b7280">TAX (8.25%)</text>
      <text x="300" y="280" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$5.61</text>
      <text x="20" y="305" font-family="monospace" font-size="11" fill="#6b7280">TIP (18%)</text>
      <text x="300" y="305" font-family="monospace" font-size="11" fill="#374151" text-anchor="end">$12.24</text>
      <line x1="16" y1="325" x2="304" y2="325" stroke="#111827" stroke-width="1.5"/>
      <text x="20" y="350" font-family="monospace" font-size="14" font-weight="bold" fill="#111827">TOTAL</text>
      <text x="300" y="350" font-family="monospace" font-size="15" font-weight="bold" fill="#111827" text-anchor="end">$85.85</text>
    </svg>`,
    receipt: {
      id: 'rec_brunch',
      merchantName: 'Morning Glory Artisan Cafe',
      date: 'Oct 4, 2026',
      currency: '$',
      items: [
        {
          id: 'b_1',
          name: 'Sourdough Avocado Toast',
          price: 15.50,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 'b_2',
          name: 'Smoked Salmon Eggs Benedict',
          price: 19.00,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 'b_3',
          name: 'Belgian Waffle w/ Fresh Berries',
          price: 14.00,
          quantity: 1,
          category: 'food',
          assignedTo: [],
        },
        {
          id: 'b_4',
          name: '2x Oat Milk Iced Vanilla Latte',
          price: 13.00,
          quantity: 2,
          unitPrice: 6.50,
          category: 'drink',
          assignedTo: [],
        },
        {
          id: 'b_5',
          name: 'Fresh Squeezed Orange Juice',
          price: 6.50,
          quantity: 1,
          category: 'drink',
          assignedTo: [],
        },
      ],
      subtotal: 68.00,
      tax: 5.61,
      taxPercentage: 8.25,
      tip: 12.24,
      tipPercentage: 18,
      discount: 0,
      total: 85.85,
    },
  },
};
