export interface ProductVariation {
  color?: { name: string; code?: string; image?: string };
  size?: string;
  sku?: string;
  stock: number;
  price?: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
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
  _id: string;
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
  location?: string; // Added location field for events
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

export interface GalleryImage {
  _id: any;
  id: string; // mapped from _id
  title: string;
  src: string; // url of image
  category?: string;
  location?: string;
  description?: string;
  span?:
    | "col-span-1"
    | "col-span-2"
    | "row-span-1"
    | "row-span-2"
    | "col-span-1 row-span-2"
    | "col-span-2 row-span-1"
    | "col-span-2 row-span-2";
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

export interface ShowcaseItem {
  _id: string;
  src: string;
  title: string;
  date: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  name?: string; // legacy compat
  price: number;
  quantity: number;
  image?: string;
  variation?: {
    color?: string;
    size?: string;
    sku?: string;
  };
}

export interface Order {
  _id: string;
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderNumber: string;
  promoCode?: {
    code: string;
    discountAmount: number;
  };
  paymentMethod: "paystack" | "delivery";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  paystackReference?: string;
  statusHistory?: {
    status: string;
    changedAt: string;
    changedBy: string;
    notes?: string;
  }[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // legacy compat
  customer?: string;
  email?: string;
  phone?: string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  status?: string;
  deliveryStatus?: string;
  date?: string;
  trackingNumber?: string;
}

export interface PromoCode {
  _id: string;
  id?: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;
  perUserLimit?: number;
  isActive: boolean;
  applicableCategories?: string[];
  excludedCategories?: string[];
  applicableProducts?: string[];
  excludedProducts?: string[];
  customerEmail?: string;
  isSingleUse?: boolean;
  createdBy?: string;
  // legacy compat
  discountPercentage?: number;
  usageCount?: number;
}
