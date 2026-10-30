import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  ProductSizeOption,
  CustomBespokeInquiry,
  BlogPost,
  ContactMessage,
  ProductCategory
} from '../types/bakery';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_BESPOKE_INQUIRIES,
  INITIAL_BLOG_POSTS
} from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

export type AppView = 
  | 'home'
  | 'shop'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'about'
  | 'contact'
  | 'delivery'
  | 'policies'
  | 'admin'
  | 'storefront'; // alias for home

interface BakeryContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  customInquiries: CustomBespokeInquiry[];
  blogPosts: BlogPost[];
  selectedArticle: BlogPost | null;
  setSelectedArticle: (post: BlogPost | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeOrder: Order | null;
  currentView: AppView;
  isCartOpen: boolean;
  isCustomCakeModalOpen: boolean;
  setIsCustomCakeModalOpen: (open: boolean) => void;
  isCloudSynced: boolean;
  setCurrentView: (view: AppView) => void;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    size: ProductSizeOption,
    quantity?: number,
    specialNotes?: string,
    cakeDetails?: {
      flavor?: string;
      cakeMessage?: string;
      colorTheme?: string;
      eventDate?: string;
    }
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  createOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    orderType: 'Pickup' | 'Delivery';
    deliveryAddress?: string;
    cityState?: string;
    zipCode?: string;
    eventDate: string;
    preferredTime?: string;
    allergies: string[];
    specialInstructions?: string;
    deliveryFee: number;
    paymentTermsAgreed: boolean;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, internalNotes?: string) => void;
  submitBespokeInquiry: (payload: Omit<CustomBespokeInquiry, 'id' | 'createdAt' | 'status'>) => Promise<CustomBespokeInquiry>;
  approveBespokeInquiry: (inquiryId: string, confirmedPrice?: number, bakerNotes?: string) => Order;
  declineBespokeInquiry: (inquiryId: string, reason?: string) => void;
  submitContactMessage: (payload: { fullName: string; email: string; phone?: string; subject?: string; message: string }) => Promise<void>;
  updateProduct: (product: Product) => void;
  toggleProductStock: (productId: string) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;
  setActiveOrderById: (orderId: string) => void;
  resetToDemoData: () => void;
  cartTotal: number;
  cartCount: number;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

function isValidProductRecord(p: any): p is Product {
  return (
    p &&
    typeof p === 'object' &&
    typeof p.id === 'string' &&
    p.id.length > 0 &&
    typeof p.name === 'string' &&
    p.name.length > 0 &&
    Array.isArray(p.sizes) &&
    p.sizes.length > 0
  );
}

function mergeWithInitialProducts(incomingList: any[]): Product[] {
  if (!Array.isArray(incomingList) || incomingList.length === 0) {
    return INITIAL_PRODUCTS;
  }
  
  const map = new Map<string, Product>();
  // Prepopulate with all 8 authentic initial products
  INITIAL_PRODUCTS.forEach(p => map.set(p.id, { ...p }));

  // Overlay any valid incoming products
  incomingList.forEach(raw => {
    if (isValidProductRecord(raw)) {
      const existing = map.get(raw.id);
      map.set(raw.id, {
        ...(existing || raw),
        ...raw,
        imageUrl: raw.imageUrl || existing?.imageUrl || INITIAL_PRODUCTS[0].imageUrl,
        active: raw.active !== false,
        inStock: raw.inStock !== false,
        minPrice: typeof raw.minPrice === 'number' && raw.minPrice > 0 
          ? raw.minPrice 
          : (raw.sizes?.[0]?.price || existing?.minPrice || 50),
        maxPrice: typeof raw.maxPrice === 'number' && raw.maxPrice > 0 
          ? raw.maxPrice 
          : (raw.sizes?.[raw.sizes.length - 1]?.price || existing?.maxPrice || 110),
      });
    }
  });

  const merged = Array.from(map.values());
  return merged.length >= INITIAL_PRODUCTS.length ? merged : INITIAL_PRODUCTS;
}

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCustomCakeModalOpen, setIsCustomCakeModalOpen] = useState(false);

  // Products - always guarantee complete 8 bakery products fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Purge legacy corrupted storage keys from previous database schemas
      localStorage.removeItem('maseh_products_v4');
      localStorage.removeItem('maseh_products_v3');
      localStorage.removeItem('maseh_products_v2');
      localStorage.removeItem('maseh_products_v1');

      const saved = localStorage.getItem('maseh_products_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return mergeWithInitialProducts(parsed);
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Ensure products array never drops below complete 8 bakery catalog
  useEffect(() => {
    if (!products || products.length < 8) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, [products]);

  // Fetch /api/products from backend to ensure synchronization
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then((serverProds: Product[]) => {
        if (Array.isArray(serverProds) && serverProds.length >= 8) {
          setProducts(prev => mergeWithInitialProducts(serverProds));
        }
      })
      .catch(() => {});
  }, []);

  // Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_posts_v3');
      return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_orders_v4');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Custom Bespoke Event Inquiries
  const [customInquiries, setCustomInquiries] = useState<CustomBespokeInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_inquiries_v4');
      return saved ? JSON.parse(saved) : INITIAL_BESPOKE_INQUIRIES;
    } catch {
      return INITIAL_BESPOKE_INQUIRIES;
    }
  });

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_cart_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_wishlist_v4');
      return saved ? JSON.parse(saved) : ['prod-puff-puff-1', 'prod-chin-chin'];
    } catch {
      return ['prod-puff-puff-1', 'prod-chin-chin'];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const savedId = localStorage.getItem('maseh_active_order_id_v4');
      if (savedId) {
        const found = orders.find(o => o.id === savedId || o.orderNumber === savedId);
        return found || orders[0] || null;
      }
      return orders[0] || null;
    } catch {
      return null;
    }
  });

  // URL route parsing
  const checkRoute = (): AppView => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();

    if (hash.includes('admin') || path.includes('/admin') || search.includes('admin')) {
      return 'admin';
    }
    if (hash.includes('track') || path.includes('/track')) {
      return 'order-tracking';
    }
    if (hash.includes('shop')) {
      return 'shop';
    }
    if (hash.includes('cakes')) {
      setSelectedCategory('Cakes');
      return 'shop';
    }
    if (hash.includes('pastries')) {
      setSelectedCategory('African Doughnuts');
      return 'shop';
    }
    if (hash.includes('about')) {
      return 'about';
    }
    if (hash.includes('contact')) {
      return 'contact';
    }
    if (hash.includes('delivery')) {
      return 'delivery';
    }
    if (hash.includes('policies') || hash.includes('terms')) {
      return 'policies';
    }
    if (hash.includes('checkout')) {
      return 'checkout';
    }
    if (hash.includes('confirmation')) {
      return 'order-confirmation';
    }
    return 'home';
  };

  const [currentView, setCurrentViewState] = useState<AppView>(() => checkRoute());

  const setCurrentView = (view: AppView) => {
    const normalized = view === 'storefront' ? 'home' : view;
    setCurrentViewState(normalized);
    if (typeof window !== 'undefined') {
      if (normalized === 'admin') {
        window.location.hash = 'admin';
      } else if (normalized === 'order-tracking') {
        window.location.hash = 'track';
      } else if (normalized === 'shop') {
        window.location.hash = 'shop';
      } else if (normalized === 'about') {
        window.location.hash = 'about';
      } else if (normalized === 'contact') {
        window.location.hash = 'contact';
      } else if (normalized === 'delivery') {
        window.location.hash = 'delivery';
      } else if (normalized === 'policies') {
        window.location.hash = 'policies';
      } else if (normalized === 'checkout') {
        window.location.hash = 'checkout';
      } else if (normalized === 'order-confirmation') {
        window.location.hash = 'confirmation';
      } else {
        if (window.location.hash) {
          history.pushState(null, '', window.location.pathname);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const detected = checkRoute();
      setCurrentViewState(detected);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Firestore Sync Listeners
  useEffect(() => {
    // Proactively self-heal Firestore database so all 8 products are properly saved
    INITIAL_PRODUCTS.forEach(p => {
      setDoc(doc(db, 'products', p.id), p, { merge: true }).catch(() => {});
    });

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const sanitized = mergeWithInitialProducts(cloudProds);
          setProducts(sanitized);
          setIsCloudSynced(true);
        } else {
          // If Firestore collection has no documents yet, seed INITIAL_PRODUCTS so database is initialized
          INITIAL_PRODUCTS.forEach(p => {
            setDoc(doc(db, 'products', p.id), p, { merge: true }).catch(() => {});
          });
          setProducts(INITIAL_PRODUCTS);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'products');
        setProducts(prev => (prev && prev.length >= 8 ? prev : INITIAL_PRODUCTS));
      }
    );

    const unsubPosts = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
          setBlogPosts(cloudPosts);
          setIsCloudSynced(true);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'posts');
      }
    );

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
          setOrders(cloudOrders);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'orders');
      }
    );

    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomBespokeInquiry));
          setCustomInquiries(cloudInquiries);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'inquiries');
      }
    );

    return () => {
      unsubProducts();
      unsubPosts();
      unsubOrders();
      unsubInquiries();
    };
  }, []);

  // Local storage persistence
  useEffect(() => {
    if (products && products.length >= 8) {
      localStorage.setItem('maseh_products_v5', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('maseh_posts_v3', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('maseh_orders_v4', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('maseh_inquiries_v4', JSON.stringify(customInquiries));
  }, [customInquiries]);

  useEffect(() => {
    localStorage.setItem('maseh_cart_v4', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('maseh_wishlist_v4', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('maseh_active_order_id_v4', activeOrder.id);
    }
  }, [activeOrder]);

  const addToCart = (
    product: Product,
    size: ProductSizeOption,
    quantity = 1,
    specialNotes = '',
    cakeDetails?: { flavor?: string; cakeMessage?: string; colorTheme?: string; eventDate?: string }
  ) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.productId === product.id && item.selectedSize.label === size.label && !cakeDetails
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        productName: product.name,
        category: product.category,
        selectedSize: size,
        quantity,
        imageUrl: product.imageUrl,
        specialInstructions: specialNotes,
        cakeDetails
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.selectedSize.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // CREATE ORDER WITH PAYMENT ON DELIVERY
  const createOrder = async (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    orderType: 'Pickup' | 'Delivery';
    deliveryAddress?: string;
    cityState?: string;
    zipCode?: string;
    eventDate: string;
    preferredTime?: string;
    allergies: string[];
    specialInstructions?: string;
    deliveryFee: number;
    paymentTermsAgreed: boolean;
  }): Promise<Order> => {
    const subtotal = cartTotal;
    const total = subtotal + payload.deliveryFee;
    const orderNumber = `MD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      orderType: payload.orderType,
      deliveryAddress: payload.deliveryAddress,
      cityState: payload.cityState,
      zipCode: payload.zipCode,
      eventDate: payload.eventDate,
      preferredTime: payload.preferredTime || '11:00 AM – 3:00 PM',
      items: [...cart],
      subtotal,
      deliveryFee: payload.deliveryFee,
      total,
      paymentMethod: 'Payment on Delivery',
      paymentTermsAgreed: payload.paymentTermsAgreed,
      status: 'Pending',
      allergies: payload.allergies,
      specialInstructions: payload.specialInstructions
    };

    // Update local state immediately
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setCurrentView('order-confirmation');

    // Attempt REST API post
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(() => {});
    } catch {}

    // Firestore mirror
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, internalNotes?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          return {
            ...ord,
            status,
            internalNotes: internalNotes !== undefined ? internalNotes : ord.internalNotes
          };
        }
        return ord;
      })
    );

    // Call REST endpoint
    try {
      fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNotes })
      }).catch(() => {});
    } catch {}

    // Firestore update
    const target = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (target) {
      setDoc(doc(db, 'orders', target.id), { ...target, status, internalNotes }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      });
    }
  };

  const submitBespokeInquiry = async (
    payload: Omit<CustomBespokeInquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<CustomBespokeInquiry> => {
    const newInquiry: CustomBespokeInquiry = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending Review',
      ...payload
    };

    setCustomInquiries(prev => [newInquiry, ...prev]);

    try {
      fetch('/api/custom-cake-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      }).catch(() => {});
    } catch {}

    setDoc(doc(db, 'inquiries', newInquiry.id), newInquiry).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `inquiries/${newInquiry.id}`);
    });

    return newInquiry;
  };

  const approveBespokeInquiry = (inquiryId: string, confirmedPrice?: number, bakerNotes?: string): Order => {
    const target = customInquiries.find(r => r.id === inquiryId);
    if (!target) throw new Error('Inquiry not found');

    const finalPrice = confirmedPrice || target.estimatedPrice;
    const orderNumber = `MD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const createdOrder: Order = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: target.customerName,
      customerPhone: target.customerPhone,
      customerEmail: target.customerEmail,
      orderType: 'Pickup',
      eventDate: target.requestedDate,
      preferredTime: '11:00 AM',
      items: [
        {
          id: `bespoke-item-${Date.now()}`,
          productId: 'bespoke-celebration-cake',
          productName: `Bespoke Cake: ${target.cakeTiers} (${target.eventType})`,
          category: 'Custom Cakes',
          imageUrl: INITIAL_PRODUCTS.find(p => p.category === 'Custom Cakes')?.imageUrl,
          selectedSize: {
            label: target.cakeTiers,
            price: finalPrice,
            description: `Flavor: ${target.flavorSelection}. Decor: ${target.designNotes}`
          },
          quantity: 1,
          specialInstructions: `Guest Count: ${target.guestCount}. Pastry add-ons: ${target.pastryAddons.join(', ')}`
        }
      ],
      subtotal: finalPrice,
      deliveryFee: 0,
      total: finalPrice,
      paymentMethod: 'Payment on Delivery',
      paymentTermsAgreed: true,
      status: 'Confirmed',
      allergies: ['Gluten', 'Eggs', 'Dairy'],
      specialInstructions: `Bespoke Order [${target.id}]: ${target.designNotes}`,
      internalNotes: bakerNotes,
      isCustomOrder: true,
      customDetails: {
        eventType: target.eventType,
        guestCount: target.guestCount,
        flavor: target.flavorSelection,
        tiers: target.cakeTiers,
        decorNotes: target.designNotes
      }
    };

    setCustomInquiries(prev =>
      prev.map(inq => (inq.id === inquiryId ? { ...inq, status: 'Approved', bakerQuotePrice: finalPrice, bakerNotes } : inq))
    );
    setOrders(prev => [createdOrder, ...prev]);

    setDoc(doc(db, 'inquiries', inquiryId), { ...target, status: 'Approved', bakerQuotePrice: finalPrice, bakerNotes }, { merge: true }).catch(() => {});
    setDoc(doc(db, 'orders', createdOrder.id), createdOrder).catch(() => {});

    return createdOrder;
  };

  const declineBespokeInquiry = (inquiryId: string, reason?: string) => {
    setCustomInquiries(prev =>
      prev.map(inq => (inq.id === inquiryId ? { ...inq, status: 'Declined', bakerNotes: reason } : inq))
    );
    const target = customInquiries.find(r => r.id === inquiryId);
    if (target) {
      setDoc(doc(db, 'inquiries', inquiryId), { ...target, status: 'Declined', bakerNotes: reason }, { merge: true }).catch(() => {});
    }
  };

  const submitContactMessage = async (payload: { fullName: string; email: string; phone?: string; subject?: string; message: string }) => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
    setDoc(doc(db, 'products', product.id), product, { merge: true }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `products/${product.id}`);
    });
  };

  const toggleProductStock = (productId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updated = { ...p, inStock: !p.inStock };
          setDoc(doc(db, 'products', p.id), { inStock: updated.inStock }, { merge: true }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `products/${p.id}`);
          });
          return updated;
        }
        return p;
      })
    );
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    setDoc(doc(db, 'products', product.id), product).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteDoc(doc(db, 'products', productId)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    });
  };

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
    setDoc(doc(db, 'posts', post.id), post).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `posts/${post.id}`);
    });
  };

  const updateBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => prev.map(p => (p.id === post.id ? post : p)));
    setDoc(doc(db, 'posts', post.id), post, { merge: true }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `posts/${post.id}`);
    });
  };

  const deleteBlogPost = (postId: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== postId));
    deleteDoc(doc(db, 'posts', postId)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `posts/${postId}`);
    });
  };

  const setActiveOrderById = (orderId: string) => {
    const found = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (found) {
      setActiveOrder(found);
    }
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomInquiries(INITIAL_BESPOKE_INQUIRIES);
    setBlogPosts(INITIAL_BLOG_POSTS);
  };

  return (
    <BakeryContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        customInquiries,
        blogPosts,
        selectedArticle,
        setSelectedArticle,
        selectedProduct,
        setSelectedProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeOrder,
        currentView,
        isCartOpen,
        isCustomCakeModalOpen,
        setIsCustomCakeModalOpen,
        isCloudSynced,
        setCurrentView,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        createOrder,
        updateOrderStatus,
        submitBespokeInquiry,
        approveBespokeInquiry,
        declineBespokeInquiry,
        submitContactMessage,
        updateProduct,
        toggleProductStock,
        addProduct,
        deleteProduct,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        setActiveOrderById,
        resetToDemoData,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
