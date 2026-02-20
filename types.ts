export interface ProductVariation {
  color?: { name: string; code?: string; image?: string };
  size?: string;
  sku?: string;
  stock: number;
  price?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string; // legacy mapping
  title?: string;
  price: number; // legacy mapping
  basePrice?: number;

  category: string;
  image: string; // legacy mapping
  images?: string[];
  hoverImage: string;
  description: string;

  sizes: string[];
  colors: string[];

  hasVariations?: boolean;
  variations?: ProductVariation[];

  availableColors?: { name: string; code?: string; image?: string }[];
  availableSizes?: string[];

  stock?: number;
  attributes?: {
    material?: string;
    care?: string;
    fit?: string;
    length?: string;
    occasion?: string;
    season?: string;
  };

  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];

  isNew?: boolean; // mapped to trending
  colorImages?: Record<string, string>; // Map color name to image URL
  details?: {
    fabric: string;
    modelStats: string;
    stylingTips: string;
  };
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  verified: boolean;
}

// Renamed from JournalEntry to EventEntry
export interface EventEntry {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  category: string;
  location?: string; // Added location field for events
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

export interface GalleryImage {
  id: string; // mapped from _id
  title: string;
  src: string; // url of image
  category?: string;
  location?: string;
  description?: string;
  span?: 'col-span-1' | 'col-span-2' | 'row-span-1' | 'row-span-2' | 'col-span-1 row-span-2' | 'col-span-2 row-span-1' | 'col-span-2 row-span-2';
  order?: number;
  isActive?: boolean;
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
    size?: number;
    format?: string;
  };
}