import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, ProductSizeOption, CustomBespokeInquiry, BlogPost } from '../types/bakery';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BESPOKE_INQUIRIES, INITIAL_BLOG_POSTS } from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

export type AppView = 'storefront' | 'checkout' | 'order-confirmation' | 'order-tracking' | 'admin';

interface BakeryContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  customInquiries: CustomBespokeInquiry[];
  blogPosts: BlogPost[];
  selectedArticle: BlogPost | null;
  setSelectedArticle: (post: BlogPost | null) => void;
  activeOrder: Order | null;
  currentView: AppView;
  isCartOpen: boolean;
  isCloudSynced: boolean;
  setCurrentView: (view: AppView) => void;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: ProductSizeOption, quantity?: number, specialNotes?: string) => void;
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
    eventDate: string;
    allergies: string[];
    specialInstructions?: string;
    deliveryFee: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  submitBespokeInquiry: (payload: Omit<CustomBespokeInquiry, 'id' | 'createdAt' | 'status'>) => CustomBespokeInquiry;
  approveBespokeInquiry: (inquiryId: string, confirmedPrice?: number, bakerNotes?: string) => Order;
  declineBespokeInquiry: (inquiryId: string, reason?: string) => void;
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

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_products_v3');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_posts_v2');
      return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Custom Bespoke Event Inquiries
  const [customInquiries, setCustomInquiries] = useState<CustomBespokeInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_inquiries_v2');
      return saved ? JSON.parse(saved) : INITIAL_BESPOKE_INQUIRIES;
    } catch {
      return INITIAL_BESPOKE_INQUIRIES;
    }
  });

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('maseh_wishlist');
      return saved ? JSON.parse(saved) : ['prod-puff-puff'];
    } catch {
      return ['prod-puff-puff'];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const savedId = localStorage.getItem('maseh_active_order_id');
      if (savedId) {
        const found = orders.find(o => o.id === savedId);
        return found || orders[0] || null;
      }
      return orders[0] || null;
    } catch {
      return null;
    }
  });

  const checkIsAdmin = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    return hash.includes('admin') || path.includes('/admin') || path.endsWith('admin') || search.includes('admin');
  };

  const checkIsTracking = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    return hash.includes('track') || path.includes('/track');
  };

  const [currentView, setCurrentViewState] = useState<AppView>(() => {
    if (checkIsAdmin()) return 'admin';
    if (checkIsTracking()) return 'order-tracking';
    return 'storefront';
  });

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        window.location.hash = 'admin';
      } else if (view === 'order-tracking') {
        window.location.hash = 'track';
      } else if (view === 'storefront') {
        if (window.location.hash.includes('admin') || window.location.hash.includes('track')) {
          history.pushState(null, '', window.location.pathname);
        }
      }
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdmin()) {
        setCurrentViewState('admin');
      } else if (checkIsTracking()) {
        setCurrentViewState('order-tracking');
      } else {
        const hash = window.location.hash.toLowerCase();
        if (!hash || hash === '#' || hash === '#storefront' || hash === '#menu' || hash === '#home') {
          setCurrentViewState('storefront');
        }
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    // Initial verification on mount
    handleUrlChange();

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // ══════════════════════════════════════════════════════════════════
  // FIRESTORE LIVE REAL-TIME LISTENERS
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    // 1. Sync Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setProducts(cloudProds);
          setIsCloudSynced(true);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'products');
      }
    );

    // 2. Sync Posts
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

    // 3. Sync Orders
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

    // 4. Sync Inquiries
    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudInqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomBespokeInquiry));
          setCustomInquiries(cloudInqs);
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

  // Sync state to local storage as resilient offline cache
  useEffect(() => {
    localStorage.setItem('maseh_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('maseh_posts_v2', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('maseh_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('maseh_inquiries_v2', JSON.stringify(customInquiries));
  }, [customInquiries]);

  useEffect(() => {
    localStorage.setItem('maseh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('maseh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('maseh_active_order_id', activeOrder.id);
    }
  }, [activeOrder]);

  const addToCart = (product: Product, size: ProductSizeOption, quantity = 1, specialNotes = '') => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id && item.selectedSize.label === size.label);
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
        specialInstructions: specialNotes
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

  const createOrder = (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    orderType: 'Pickup' | 'Delivery';
    deliveryAddress?: string;
    eventDate: string;
    allergies: string[];
    specialInstructions?: string;
    deliveryFee: number;
  }): Order => {
    const subtotal = cartTotal;
    const total = subtotal + payload.deliveryFee;
    const depositAmount = Number((total * 0.5).toFixed(2));
    const balanceDue = Number((total - depositAmount).toFixed(2));

    const newOrder: Order = {
      id: `MD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      orderType: payload.orderType,
      deliveryAddress: payload.deliveryAddress,
      eventDate: payload.eventDate,
      items: [...cart],
      subtotal,
      deliveryFee: payload.deliveryFee,
      total,
      depositAmount,
      balanceDue,
      status: 'Awaiting Confirmation',
      allergies: payload.allergies,
      specialInstructions: payload.specialInstructions
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setCurrentView('order-confirmation');

    // Async write to Firestore
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );

    // Async write to Firestore
    const target = orders.find(o => o.id === orderId);
    if (target) {
      setDoc(doc(db, 'orders', orderId), { ...target, status }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      });
    }
  };

  const submitBespokeInquiry = (payload: Omit<CustomBespokeInquiry, 'id' | 'createdAt' | 'status'>): CustomBespokeInquiry => {
    const newInquiry: CustomBespokeInquiry = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending Review',
      ...payload
    };

    setCustomInquiries(prev => [newInquiry, ...prev]);

    // Async write to Firestore
    setDoc(doc(db, 'inquiries', newInquiry.id), newInquiry).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `inquiries/${newInquiry.id}`);
    });

    return newInquiry;
  };

  const approveBespokeInquiry = (inquiryId: string, confirmedPrice?: number, bakerNotes?: string): Order => {
    const target = customInquiries.find(r => r.id === inquiryId);
    if (!target) throw new Error('Inquiry not found');

    const finalPrice = confirmedPrice || target.estimatedPrice;
    const deposit = Number((finalPrice * 0.5).toFixed(2));
    const balance = Number((finalPrice - deposit).toFixed(2));

    const createdOrder: Order = {
      id: `MD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: target.customerName,
      customerPhone: target.customerPhone,
      customerEmail: target.customerEmail,
      orderType: 'Pickup',
      eventDate: target.requestedDate,
      items: [
        {
          id: `bespoke-item-${Date.now()}`,
          productId: 'bespoke-celebration-cake',
          productName: `Bespoke Cake: ${target.cakeTiers} (${target.eventType})`,
          category: 'Fondant Cakes',
          imageUrl: INITIAL_PRODUCTS.find(p => p.category === 'Fondant Cakes')?.imageUrl,
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
      depositAmount: deposit,
      balanceDue: balance,
      status: 'Preparing',
      allergies: ['Gluten', 'Eggs', 'Dairy'],
      specialInstructions: `Bespoke Order [${target.id}]: ${target.designNotes}`,
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
      prev.map(r => (r.id === inquiryId ? { ...r, status: 'Approved' as const, bakerQuotePrice: finalPrice, bakerNotes: bakerNotes || 'Bespoke order approved & converted to production order.' } : r))
    );
    setOrders(prev => [createdOrder, ...prev]);
    setActiveOrder(createdOrder);

    // Sync to Firestore
    setDoc(doc(db, 'inquiries', inquiryId), { status: 'Approved', bakerQuotePrice: finalPrice }, { merge: true }).catch(() => {});
    setDoc(doc(db, 'orders', createdOrder.id), createdOrder).catch(() => {});

    return createdOrder;
  };

  const declineBespokeInquiry = (inquiryId: string, reason?: string) => {
    setCustomInquiries(prev =>
      prev.map(r => (r.id === inquiryId ? { ...r, status: 'Declined' as const, bakerNotes: reason || 'Capacity reached for this weekend.' } : r))
    );
    setDoc(doc(db, 'inquiries', inquiryId), { status: 'Declined', bakerNotes: reason }, { merge: true }).catch(() => {});
  };

  // Product CRUD
  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
    setDoc(doc(db, 'products', product.id), product).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `products/${product.id}`);
    });
  };

  const toggleProductStock = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === productId ? { ...p, inStock: !p.inStock, active: !p.active } : p));
      const target = updated.find(p => p.id === productId);
      if (target) {
        setDoc(doc(db, 'products', productId), target).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
        });
      }
      return updated;
    });
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    setDoc(doc(db, 'products', product.id), product).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `products/${product.id}`);
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteDoc(doc(db, 'products', productId)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    });
  };

  // Blog Post CRUD
  const addBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
    setDoc(doc(db, 'posts', post.id), post).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `posts/${post.id}`);
    });
  };

  const updateBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => prev.map(p => (p.id === post.id ? post : p)));
    setDoc(doc(db, 'posts', post.id), post).catch(err => {
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
    const found = orders.find(o => o.id.toUpperCase() === orderId.trim().toUpperCase());
    if (found) {
      setActiveOrder(found);
    }
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setOrders(INITIAL_ORDERS);
    setCustomInquiries(INITIAL_BESPOKE_INQUIRIES);
    setCart([]);
    setWishlist(['prod-puff-puff']);
    setActiveOrder(INITIAL_ORDERS[0]);
    localStorage.removeItem('maseh_products_v3');
    localStorage.removeItem('maseh_posts_v2');
    localStorage.removeItem('maseh_orders_v2');
    localStorage.removeItem('maseh_inquiries_v2');
    localStorage.removeItem('maseh_cart');
    localStorage.removeItem('maseh_wishlist');
    localStorage.removeItem('maseh_active_order_id');

    // Seed to Firestore
    INITIAL_PRODUCTS.forEach(p => {
      setDoc(doc(db, 'products', p.id), p).catch(() => {});
    });
    INITIAL_BLOG_POSTS.forEach(b => {
      setDoc(doc(db, 'posts', b.id), b).catch(() => {});
    });
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
        activeOrder,
        currentView,
        isCartOpen,
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
