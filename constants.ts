import { Product, EventEntry, Review } from './types'; // Updated import

export const CATEGORIES = ["All", "Dresses", "Outerwear", "Tops", "Accessories"];

const generateReviews = (productId: string): Review[] => [
  // Reviews can be populated here if needed
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