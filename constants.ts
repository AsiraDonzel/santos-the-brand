import { Product, EventEntry, Review, Order } from './types'; // Updated import

export const CATEGORIES = ["All", "Dresses", "Outerwear", "Tops", "Accessories"];

const generateReviews = (productId: string): Review[] => [
  // Reviews can be populated here if needed
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-001',
    customer: 'Alice Doe',
    email: 'alice@example.com',
    phone: '+1 234 567 8900',
    total: 1345,
    subtotal: 1300,
    shipping: 25,
    tax: 20,
    status: 'Pending',
    deliveryStatus: 'Pending',
    date: '2026-02-20',
    shippingAddress: '123 Creative Avenue, Design District, NY 10001',
    items: [
      { productId: '1', name: 'Amethyst Silk Evening Gown', price: 895, quantity: 1, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', variation: 'S | Amethyst' },
      { productId: '2', name: 'Lavender Wool Trench', price: 450, quantity: 1, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', variation: 'M | Camel' }
    ]
  },
  {
    id: 'ORD-2026-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+44 7700 900077',
    total: 340,
    subtotal: 320,
    shipping: 20,
    tax: 0,
    status: 'Completed',
    deliveryStatus: 'Packaged',
    date: '2026-02-19',
    shippingAddress: '45 London Road, Victoria, London SW1V 1AA UK',
    trackingNumber: 'TRK-9988776655',
    items: [
      { productId: '3', name: 'Midnight Velvet Blazer', price: 320, quantity: 1, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', variation: 'L | Midnight' }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Amethyst Silk Evening Gown',
    price: 895,
    category: 'Dresses',
    image: '',
    hoverImage: '',
    description: 'A stunning floor-length gown crafted from 100% mulberry silk in our signature deep amethyst hue. Designed to catch the light with every movement.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Amethyst', 'Midnight'],
    details: {
      fabric: "100% Mulberry Silk, 22mm weight",
      modelStats: "Height: 5'10\" | Wearing Size S",
      stylingTips: "Pair with silver statement earrings and minimal heels."
    },
    isNew: true,
    reviews: generateReviews('1')
  },
  {
    id: '2',
    name: 'Lavender Wool Trench',
    price: 450,
    category: 'Outerwear',
    image: '',
    hoverImage: '',
    description: 'Italian wool blend trench coat featuring a double-breasted closure and silk lining. A modern take on a classic silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Lavender', 'Camel'],
    colorImages: {},
    details: {
      fabric: "80% Virgin Wool, 20% Cashmere",
      modelStats: "Height: 5'9\" | Wearing Size M",
      stylingTips: "Layer over a monochrome outfit for effortless chic."
    },
    isNew: true
  },
  {
    id: '3',
    name: 'Midnight Velvet Blazer',
    price: 320,
    category: 'Outerwear',
    image: '',
    hoverImage: '',
    description: 'Structured velvet blazer perfect for evening events. Features gold-plated buttons and a tailored fit.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Midnight', 'Plum'],
    colorImages: {},
    details: {
      fabric: "100% Cotton Velvet",
      modelStats: "Height: 5'11\" | Wearing Size S",
      stylingTips: "Wear as a suit or separate with tailored trousers."
    }
  },
  {
    id: '4',
    name: 'Violet Cashmere Sweater',
    price: 280,
    category: 'Tops',
    image: '',
    hoverImage: '',
    description: 'Ultra-soft cashmere sweater with a relaxed fit and ribbed detailing.',
    sizes: ['S', 'M', 'L'],
    colors: ['Violet', 'Cream'],
    colorImages: {},
    details: {
      fabric: "100% Mongolian Cashmere",
      modelStats: "Height: 5'8\" | Wearing Size M",
      stylingTips: "Tuck into high-waisted silk trousers."
    }
  },
  {
    id: '5',
    name: 'Crystal Embellished Clutch',
    price: 550,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop',
    description: 'Hand-beaded clutch bag with amethyst crystals and a detachable gold chain.',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold'],
    colorImages: {},
    details: {
      fabric: "Satin lining, Swarovski Crystals",
      modelStats: "N/A",
      stylingTips: "The perfect finish for any gala ensemble."
    }
  },
  {
    id: '6',
    name: 'Lilac Chiffon Midi',
    price: 395,
    category: 'Dresses',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop',
    description: 'Flowy chiffon midi dress with delicate floral embroidery. Romantic and effortless.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Lilac'],
    colorImages: {
      'Lilac': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop'
    },
    details: {
      fabric: "100% Silk Chiffon",
      modelStats: "Height: 5'9\" | Wearing Size S",
      stylingTips: "Wear with strappy sandals for a garden party."
    },
    isNew: true
  }
];

export const EVENT_ENTRIES: EventEntry[] = [ // Updated type
  {
    id: '1',
    title: "Private Cake Fest",
    subtitle: "An intimate celebration of community, creativity, and connection to close out a landmark year.",
    category: "Community",
    date: "Dec 2025",
    location: "Lagos, Nigeria", // Added location
    image: "/img2.JPG"
  },
  {
    id: '2',
    title: "Runway Fashion Showcase",
    subtitle: "A powerful display of creativity and vision, highlighting our growth and the future of African luxury.",
    category: "Fashion",
    date: "Nov 2025",
    location: "Lagos, Nigeria", // Added location
    image: "/img3.JPG"
  },
  {
    id: '3',
    title: "Charity Sports Event",
    subtitle: "A two-day event bringing communities together through sport for a meaningful cause and collective grit.",
    category: "Impact",
    date: "Oct 2025",
    location: "Lagos, Nigeria", // Added location
    image: "/img4.JPG"
  }
];

// Alias for backwards compatibility 
export const JOURNAL_ENTRIES = EVENT_ENTRIES;

export const SHOWCASE_ITEMS = [
  { id: 'sc1', src: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop", name: 'First Look', date: 'Nov 2025' },
  { id: 'sc2', src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop", name: 'The Setup', date: 'Nov 2025' },
  { id: 'sc3', src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop", name: 'Walkway Rehearsal', date: 'Oct 2025' },
  { id: 'sc4', src: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1970&auto=format&fit=crop", name: 'Model Focus', date: 'Oct 2025' },
  { id: 'sc5', src: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop", name: 'Opening Event', date: 'Dec 2025' }
];