export type ProductCategory = 
  | 'All' 
  | 'African Doughnuts' 
  | 'Snacks' 
  | 'Savory Pastries' 
  | 'Cakes' 
  | 'Custom Cakes';

export interface ProductSizeOption {
  label: string;
  price: number;
  description: string;
  piecesCount?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'African Doughnuts' | 'Snacks' | 'Savory Pastries' | 'Cakes' | 'Custom Cakes';
  badge: string;
  priceRangeText: string;
  minPrice: number;
  maxPrice: number;
  sizes: ProductSizeOption[];
  description: string;
  flavorNotes: string[];
  allergens: string[];
  preparationNotice: string;
  active: boolean;
  inStock: boolean;
  featured?: boolean;
  imageUrl: string;
  secondaryImageUrl?: string;
  cardBgColor?: string;
  isCake?: boolean;
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
  cakeDetails?: {
    flavor?: string;
    cakeMessage?: string;
    colorTheme?: string;
    eventDate?: string;
  };
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Preparing' 
  | 'Ready for pickup' 
  | 'Out for delivery' 
  | 'Completed' 
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderType: 'Pickup' | 'Delivery';
  deliveryAddress?: string;
  cityState?: string;
  zipCode?: string;
  eventDate: string;
  preferredTime?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number; // Total amount due on delivery
  paymentMethod: 'Payment on Delivery';
  paymentTermsAgreed: boolean;
  status: OrderStatus;
  allergies: string[];
  specialInstructions?: string;
  internalNotes?: string;
  isCustomOrder?: boolean;
  customDetails?: {
    eventType?: string;
    guestCount?: number;
    flavor?: string;
    tiers?: string;
    cakeMessage?: string;
    colorTheme?: string;
    decorNotes?: string;
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

export interface ContactMessage {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Replied';
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
