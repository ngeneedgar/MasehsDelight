export type ProductCategory = 'All' | 'Chewable' | 'Fondant Cakes' | 'Savory Pastries';

export interface ProductSizeOption {
  label: string;
  price: number;
  description: string;
  piecesCount?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Chewable' | 'Fondant Cakes' | 'Savory Pastries';
  badge: string;
  priceRangeText: string;
  minPrice: number;
  maxPrice: number;
  sizes: ProductSizeOption[];
  description: string;
  flavorNotes: string[];
  active: boolean;
  inStock: boolean;
  imageTheme: 'puffpuff' | 'chinchin' | 'fishroll' | 'fondantcake' | 'scotchegg';
  imageUrl: string;
  secondaryImageUrl?: string;
  cardBgColor?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  selectedSize: ProductSizeOption;
  quantity: number;
  imageUrl?: string;
  specialInstructions?: string;
}

export type OrderStatus = 'Awaiting Confirmation' | 'Preparing' | 'Ready' | 'Delivered';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderType: 'Pickup' | 'Delivery';
  deliveryAddress?: string;
  eventDate: string; // Enforced >= 3 days from today
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  depositAmount: number; // 50%
  balanceDue: number; // 50%
  status: OrderStatus;
  allergies: string[];
  specialInstructions?: string;
  isCustomOrder?: boolean;
  customDetails?: {
    eventType: string;
    guestCount: number;
    flavor: string;
    tiers: string;
    decorNotes: string;
  };
}

export interface CustomBespokeInquiry {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestedDate: string;
  eventType: string;
  guestCount: number;
  cakeTiers: string;
  flavorSelection: string;
  pastryAddons: string[];
  designNotes: string;
  estimatedPrice: number;
  status: 'Pending Review' | 'Approved' | 'Declined';
  bakerQuotePrice?: number;
  bakerNotes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: 'Heritage Baking' | 'Party Planning' | 'Cake Studio' | 'Kitchen Secrets';
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  featuredImage: string;
  tags: string[];
  relatedProductId?: string;
}
