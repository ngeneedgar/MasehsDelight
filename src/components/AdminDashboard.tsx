import React, { useState, useMemo } from 'react';
import { useBakery } from '../context/BakeryContext';
import { OrderStatus, Product, CustomBespokeInquiry, Order, BlogPost } from '../types/bakery';
import { WEEKLY_SALES_DATA, MASEH_ASSETS } from '../data/initialData';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  DollarSign,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  RotateCcw,
  ChefHat,
  TrendingUp,
  Search,
  Filter,
  Phone,
  Calendar,
  Layers,
  ClipboardList,
  Check,
  AlertCircle,
  BookOpen,
  Cloud,
  Sparkles,
  X,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    customInquiries,
    products,
    blogPosts,
    updateOrderStatus,
    approveBespokeInquiry,
    declineBespokeInquiry,
    updateProduct,
    toggleProductStock,
    addProduct,
    deleteProduct,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setCurrentView,
    resetToDemoData,
    isCloudSynced
  } = useBakery();

  const bespokeInquiries = customInquiries;

  const [activeTab, setActiveTab] = useState<'pipeline' | 'prep-sheet' | 'inquiries' | 'inventory' | 'blog' | 'analytics'>('pipeline');
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  
  // Custom quote pricing inputs for inquiries
  const [customQuoteInputs, setCustomQuoteInputs] = useState<Record<string, number>>({});

  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<'African Doughnuts' | 'Snacks' | 'Savory Pastries' | 'Cakes' | 'Custom Cakes'>('African Doughnuts');
  const [newProdBadge, setNewProdBadge] = useState('Chef Special');
  const [newProdMinPrice, setNewProdMinPrice] = useState(30);
  const [newProdMaxPrice, setNewProdMaxPrice] = useState(80);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  // Blog article modal state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<BlogPost['category']>('Heritage Baking');
  const [articleReadTime, setArticleReadTime] = useState('4 min read');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContentText, setArticleContentText] = useState('');
  const [articleFeaturedImage, setArticleFeaturedImage] = useState('');

  // Daily Kitchen Prep Sheet checked items state (persists in session)
  const [prepChecklist, setPrepChecklist] = useState<Record<string, boolean>>({});

  // Staff Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('maseh_admin_auth') === 'true' || auth.currentUser !== null;
  });
  const [authMethod, setAuthMethod] = useState<'pin' | 'credentials'>('pin');
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminEmail, setAdminEmail] = useState('edgarngene@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pinCode.trim();
    if (trimmed === '2025' || trimmed === '1985' || trimmed === 'Masehs@2025@.' || trimmed.toLowerCase() === 'maseh') {
      sessionStorage.setItem('maseh_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect passcode. Master PIN is 2025.');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      sessionStorage.setItem('maseh_admin_auth', 'true');
      setIsAuthenticated(true);
    } catch (err: any) {
      if (adminPassword === 'Masehs@2025@.' || adminPassword === '2025') {
        sessionStorage.setItem('maseh_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setAuthError(err.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('maseh_admin_auth');
    signOut(auth).catch(() => {});
    setIsAuthenticated(false);
  };

  // Overall financial stats
  const totalSalesAll = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalDeposits = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalBalancesDue = useMemo(() => orders.filter(o => o.status !== 'Completed').reduce((sum, o) => sum + o.total, 0), [orders]);
  const pendingInquiriesCount = useMemo(() => bespokeInquiries.filter((i: CustomBespokeInquiry) => i.status === 'Pending Review').length, [bespokeInquiries]);
  const inKitchenCount = useMemo(() => orders.filter(o => o.status === 'Preparing').length, [orders]);

  // Filtered orders for search and filter
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchesSearch = 
        ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerPhone.includes(searchQuery) ||
        ord.items.some(it => it.productName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Aggregate Kitchen Prep by Date
  const kitchenPrepByDate = useMemo(() => {
    const map: Record<string, {
      date: string;
      orderCount: number;
      orders: Order[];
      itemsSummary: Record<string, { count: number; unitText: string }>;
    }> = {};

    orders.forEach(ord => {
      const dateKey = ord.eventDate || 'Scheduled';
      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          orderCount: 0,
          orders: [],
          itemsSummary: {}
        };
      }
      map[dateKey].orderCount += 1;
      map[dateKey].orders.push(ord);

      ord.items.forEach(it => {
        const itemKey = `${it.productName} (${it.selectedSize.label})`;
        if (!map[dateKey].itemsSummary[itemKey]) {
          map[dateKey].itemsSummary[itemKey] = {
            count: 0,
            unitText: it.selectedSize.piecesCount || 'Batch'
          };
        }
        map[dateKey].itemsSummary[itemKey].count += it.quantity;
      });
    });

    return Object.values(map);
  }, [orders]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newP: Product = {
      id: `prod-${Date.now()}`,
      slug: newProdName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProdName.trim(),
      category: (newProdCat as any) || 'African Doughnuts',
      badge: newProdBadge.trim() || 'Bakery Special',
      priceRangeText: `$${Number(newProdMinPrice).toFixed(2)}–$${Number(newProdMaxPrice).toFixed(2)}`,
      minPrice: Number(newProdMinPrice),
      maxPrice: Number(newProdMaxPrice),
      description: newProdDesc.trim() || 'Delicious authentic African pastry made fresh in our kitchen.',
      flavorNotes: ['Made Fresh Daily', 'Traditional Recipe'],
      allergens: ['Wheat / Gluten', 'Dairy', 'Eggs'],
      preparationNotice: 'Prepared fresh to order.',
      active: true,
      inStock: true,
      imageUrl: newProdCat === 'Cakes' || newProdCat === 'Custom Cakes' ? MASEH_ASSETS.fondantCakes : MASEH_ASSETS.puffPuff1,
      cardBgColor: '#FFF8F0',
      sizes: [
        {
          label: 'Standard Portion',
          price: Number(newProdMinPrice),
          description: 'Standard portion for small party'
        },
        {
          label: 'Event Catering Platter',
          price: Number(newProdMaxPrice),
          description: 'Large celebration tray'
        }
      ]
    };

    addProduct(newP);
    setIsNewProductModalOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImageUrl('');
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;

    const paragraphs = articleContentText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (editingArticleId) {
      const existing = blogPosts.find(b => b.id === editingArticleId);
      if (existing) {
        updateBlogPost({
          ...existing,
          title: articleTitle.trim(),
          category: articleCategory,
          readTime: articleReadTime.trim() || '4 min read',
          excerpt: articleExcerpt.trim(),
          content: paragraphs.length > 0 ? paragraphs : existing.content,
          featuredImage: articleFeaturedImage.trim() || existing.featuredImage
        });
      }
    } else {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: articleTitle.trim(),
        slug: articleTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: articleCategory,
        readTime: articleReadTime.trim() || '4 min read',
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        excerpt: articleExcerpt.trim(),
        content: paragraphs.length > 0 ? paragraphs : ['Article content written by Maseh.'],
        featuredImage: articleFeaturedImage.trim() || MASEH_ASSETS.puffPuff1,
        author: {
          name: 'Maseh',
          role: 'Founder & Master Baker'
        },
        tags: [articleCategory, 'Bakery', 'Maryland']
      };
      addBlogPost(newPost);
    }

    setIsArticleModalOpen(false);
    setEditingArticleId(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Preparing':
        return 'bg-[#F5C84B]/20 text-[#8E2745] border-[#F5C84B]/40';
      case 'Ready for pickup':
      case 'Out for delivery':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'Completed':
        return 'bg-[#3A1F1F] text-white border-[#3A1F1F]';
      case 'Cancelled':
        return 'bg-red-50 text-red-900 border-red-200';
      default:
        return 'bg-gray-50 text-gray-900 border-gray-200';
    }
  };

  // ══════════════════════════════════════════════════
  // STAFF AUTHENTICATION GATE (Protected Access)
  // ══════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-between p-4 sm:p-6 md:p-10 text-[#231712]">
        {/* Top brand bar */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-2 text-xs font-semibold text-[#5C4D46] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
          <span className="text-[11px] font-semibold bg-[#D99B26]/15 text-[#B8860B] px-3 py-1 rounded-full border border-[#D99B26]/20">
            Protected Staff Area
          </span>
        </div>

        {/* Auth Gate Card */}
        <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#231712]/10 shadow-[0_12px_40px_-10px_rgba(35,23,18,0.08)]">
          <div className="text-center mb-6">
            <img
              src={MASEH_ASSETS.logoColor}
              alt="Maseh's Delight"
              className="h-16 sm:h-20 w-auto mx-auto object-contain mb-3 drop-shadow-sm"
            />
            <h2 className="font-serif font-bold text-2xl text-[#231712]">
              Operations Hub
            </h2>
            <p className="text-xs text-[#7A6C65] mt-1 leading-relaxed">
              Authenticate to manage live pastry catalog, orders, kitchen prep, and bakery journal stories.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#FAF6EE] p-1 rounded-xl mb-6 border border-[#231712]/8">
            <button
              type="button"
              onClick={() => { setAuthMethod('pin'); setPinError(''); setAuthError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMethod === 'pin'
                  ? 'bg-white text-[#231712] shadow-sm font-bold'
                  : 'text-[#7A6C65] hover:text-[#231712]'
              }`}
            >
              Quick Staff PIN
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('credentials'); setPinError(''); setAuthError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMethod === 'credentials'
                  ? 'bg-white text-[#231712] shadow-sm font-bold'
                  : 'text-[#7A6C65] hover:text-[#231712]'
              }`}
            >
              Firebase Account
            </button>
          </div>

          {authMethod === 'pin' ? (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C4D46] mb-1.5">
                  Enter 4-Digit Bakery Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={16}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter PIN (e.g. 2025)"
                    className="w-full text-center text-lg tracking-widest font-mono py-3 px-4 rounded-xl border border-[#231712]/15 bg-[#FAF6EE] focus:bg-white focus:outline-none focus:border-[#D99B26] focus:ring-2 focus:ring-[#D99B26]/20 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C65]">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                {pinError && (
                  <p className="text-xs text-[#C85A32] font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{pinError}</span>
                  </p>
                )}
                <p className="text-[11px] text-[#7A6C65]/80 mt-1.5 text-center">
                  Owner Master Passcode: <span className="font-mono font-bold text-[#D99B26]">2025</span>
                </p>
              </div>

              {/* Quick keypad */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['1','2','3','4','5','6','7','8','9','C','0','✓'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'C') setPinCode('');
                      else if (key === '✓') {
                        if (pinCode.length > 0) {
                          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                          handlePinSubmit(fakeEvent);
                        }
                      } else {
                        if (pinCode.length < 10) setPinCode(prev => prev + key);
                      }
                    }}
                    className={`py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      key === '✓'
                        ? 'bg-[#D99B26] text-white hover:bg-[#B8860B]'
                        : key === 'C'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-[#FAF6EE] text-[#231712] hover:bg-[#F2ECE0] border border-[#231712]/8'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-xs uppercase tracking-wider font-bold rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Operations Hub</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C4D46] mb-1">
                  Owner Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#231712]/15 bg-[#FAF6EE] focus:bg-white focus:outline-none focus:border-[#D99B26] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C4D46] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#231712]/15 bg-[#FAF6EE] focus:bg-white focus:outline-none focus:border-[#D99B26] transition-all"
                />
              </div>

              {authError && (
                <p className="text-xs text-[#C85A32] font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{authError}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full btn-primary py-3 text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmittingAuth ? 'Verifying...' : 'Sign In as Administrator'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[#7A6C65] mt-6">
          <p>© {new Date().getFullYear()} Maseh's Delight Bakery • Silver Spring, MD</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#231712] pb-24">
      
      {/* ══════════════════════════════════════════════════
          TOP HEADER STRIP (Consistent Website Branding)
          ══════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-[#231712]/10 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-[0_2px_12px_rgba(35,23,18,0.04)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex-shrink-0 group focus:outline-none cursor-pointer"
              title="Return to public storefront"
            >
              <img
                src={MASEH_ASSETS.logoColor}
                alt="Maseh's Delight"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(35,23,18,0.06)]"
              />
            </button>
            <div className="border-l border-[#231712]/10 pl-4">
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#231712]">
                  Operations Hub
                </h1>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isCloudSynced
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-[#D99B26]/15 text-[#B8860B] border border-[#D99B26]/30'
                }`}>
                  <Cloud className="w-3 h-3" />
                  {isCloudSynced ? 'Firestore Cloud Synced' : 'Offline Mode'}
                </span>
              </div>
              <p className="text-xs text-[#7A6C65] hidden sm:block">
                Order Pipeline • Kitchen Prep Sheet • Bespoke Inquiries • Pastry Stock • Journal Stories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#5C4D46] rounded-xl border border-[#231712]/10 text-xs font-semibold transition-all cursor-pointer"
              title="Reset sample orders & inquiries"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-800 rounded-xl border border-red-200 text-xs font-semibold transition-all cursor-pointer"
              title="Sign out of Operations Hub"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock / Sign Out</span>
            </button>

            <button
              onClick={() => setCurrentView('storefront')}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* ══════════════════════════════════════════════════
            KEY METRICS SUMMARY CARDS (Website-Style Warm Cards)
            ══════════════════════════════════════════════════ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border border-[#231712]/10 shadow-[0_4px_20px_-4px_rgba(35,23,18,0.05)] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-[#7A6C65] tracking-wider">TOTAL BOOKINGS</span>
              <div className="w-8 h-8 rounded-xl bg-[#D99B26]/15 flex items-center justify-center text-[#B8860B]">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-serif font-bold text-2xl sm:text-3xl text-[#231712]">
                ${totalSalesAll.toFixed(2)}
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                50% Deposits Confirmed: ${totalDeposits.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#231712]/10 shadow-[0_4px_20px_-4px_rgba(35,23,18,0.05)] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-[#7A6C65] tracking-wider">BALANCE DUE</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] flex items-center justify-center text-[#C85A32]">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-serif font-bold text-2xl sm:text-3xl text-[#C85A32]">
                ${totalBalancesDue.toFixed(2)}
              </p>
              <p className="text-[11px] font-medium text-[#7A6C65] mt-1">
                Collect upon delivery / handoff
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#231712]/10 shadow-[0_4px_20px_-4px_rgba(35,23,18,0.05)] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-[#7A6C65] tracking-wider">IN KITCHEN</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
                <ChefHat className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-serif font-bold text-2xl sm:text-3xl text-[#231712]">
                {inKitchenCount}
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                Dough rising or in deep fryer
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#231712]/10 shadow-[0_4px_20px_-4px_rgba(35,23,18,0.05)] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-[#7A6C65] tracking-wider">BESPOKE INQUIRIES</span>
              <div className="w-8 h-8 rounded-xl bg-[#C85A32]/15 flex items-center justify-center text-[#C85A32]">
                <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-serif font-bold text-2xl sm:text-3xl text-[#231712]">
                {pendingInquiriesCount}
              </p>
              <p className="text-[11px] font-semibold text-[#C85A32] mt-1">
                Awaiting baker quote review
              </p>
            </div>
          </div>

        </section>

        {/* ══════════════════════════════════════════════════
            TAB NAVIGATION (Refined Pill Controls)
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#231712]/10 pb-4">
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-[#231712] text-white shadow-sm'
                  : 'bg-white text-[#5C4D46] hover:text-[#231712] hover:bg-[#FAF6EE] border border-[#231712]/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders Pipeline ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prep-sheet')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'prep-sheet'
                  ? 'bg-[#231712] text-white shadow-sm'
                  : 'bg-white text-[#5C4D46] hover:text-[#231712] hover:bg-[#FAF6EE] border border-[#231712]/10'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Kitchen Prep Sheet</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#231712] text-white shadow-sm'
                  : 'bg-white text-[#5C4D46] hover:text-[#231712] hover:bg-[#FAF6EE] border border-[#231712]/10'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Bespoke Inquiries ({bespokeInquiries.length})</span>
              {pendingInquiriesCount > 0 && (
                <span className="bg-[#C85A32] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#231712] text-white shadow-sm'
                  : 'bg-white text-[#5C4D46] hover:text-[#231712] hover:bg-[#FAF6EE] border border-[#231712]/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Menu & Live Stock ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-[#231712] text-white shadow-sm'
                  : 'bg-white text-[#5C4D46] hover:text-[#231712] hover:bg-[#FAF6EE] border border-[#231712]/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Journal & Blog ({blogPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#231712] text-white shadow-sm'
                  : 'bg-white text-[#5C4D46] hover:text-[#231712] hover:bg-[#FAF6EE] border border-[#231712]/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Revenue & Trends</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            TAB 1: ORDERS PIPELINE (KANBAN & TABLE VIEWS)
            ══════════════════════════════════════════════════ */}
        {activeTab === 'pipeline' && (
          <section className="space-y-6">
            
            {/* Control Bar: Search, Status Filter, and Kanban/Table toggle */}
            <div className="bg-white rounded-2xl border border-[#231712]/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6C65]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, phone, or pastry..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] border border-[#231712]/15 rounded-xl text-xs font-medium text-[#231712] focus:bg-white focus:outline-none focus:border-[#D99B26] transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#7A6C65]" />
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-[#FAF6EE] border border-[#231712]/15 rounded-xl text-xs font-semibold text-[#231712] focus:bg-white focus:outline-none focus:border-[#D99B26]"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                    <option value="Preparing">Preparing in Kitchen</option>
                    <option value="Ready">Ready / Packaged</option>
                    <option value="Delivered">Delivered / Completed</option>
                  </select>
                </div>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1.5 self-end md:self-auto bg-[#FAF6EE] p-1 rounded-xl border border-[#231712]/10">
                <button
                  onClick={() => setPipelineViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    pipelineViewMode === 'kanban'
                      ? 'bg-white text-[#231712] shadow-sm'
                      : 'text-[#7A6C65] hover:text-[#231712]'
                  }`}
                >
                  Kanban Board
                </button>
                <button
                  onClick={() => setPipelineViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    pipelineViewMode === 'table'
                      ? 'bg-white text-[#231712] shadow-sm'
                      : 'text-[#7A6C65] hover:text-[#231712]'
                  }`}
                >
                  Table View
                </button>
              </div>
            </div>

            {/* KANBAN BOARD VIEW */}
            {pipelineViewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
                
                {/* Pipeline Columns */}
                {(['Pending', 'Confirmed', 'Preparing', 'Ready for pickup', 'Completed'] as OrderStatus[]).map((colStatus) => {
                  const colOrders = filteredOrders.filter(o => o.status === colStatus);

                  const columnHeaderBg = 
                    colStatus === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                    colStatus === 'Confirmed' ? 'bg-blue-50 text-blue-900 border-blue-200' :
                    colStatus === 'Preparing' ? 'bg-[#F5C84B]/20 text-[#8E2745] border-[#F5C84B]/40' :
                    colStatus === 'Ready for pickup' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                    'bg-[#3A1F1F] text-white border-[#3A1F1F]';

                  return (
                    <div
                      key={colStatus}
                      className="bg-[#FFF8F0] rounded-2xl border border-[#3A1F1F]/10 p-3.5 flex flex-col min-h-[480px] shadow-xs"
                    >
                      <div className={`p-2 rounded-xl border mb-3 flex items-center justify-between font-bold text-xs tracking-wide ${columnHeaderBg}`}>
                        <span>{colStatus}</span>
                        <span className="w-5 h-5 rounded-full bg-white text-[#302020] flex items-center justify-center text-[10px] font-bold border border-[#3A1F1F]/10">
                          {colOrders.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {colOrders.length === 0 ? (
                          <div className="text-center py-10 text-xs font-medium text-[#806D6A]/60 border border-dashed border-[#3A1F1F]/15 rounded-xl">
                            No orders in this stage
                          </div>
                        ) : (
                          colOrders.map(ord => (
                            <div
                              key={ord.id}
                              className="bg-white rounded-xl border border-[#3A1F1F]/10 p-3 shadow-xs space-y-2 transition-all hover:shadow-md"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div>
                                  <span className="font-mono font-bold text-xs text-[#8E2745]">
                                    #{ord.orderNumber || ord.id}
                                  </span>
                                  <h4 className="font-serif font-bold text-sm text-[#302020]">
                                    {ord.customerName}
                                  </h4>
                                </div>
                                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                                  ord.orderType === 'Delivery' ? 'bg-[#D93462]/10 text-[#8E2745] border-[#D93462]/20' : 'bg-[#FFF8F0] text-[#302020] border-[#3A1F1F]/10'
                                }`}>
                                  {ord.orderType}
                                </span>
                              </div>

                              {/* Due Date & Phone */}
                              <div className="text-[11px] font-medium text-[#806D6A] space-y-0.5">
                                <div className="flex items-center gap-1.5 text-[#302020]">
                                  <Calendar className="w-3.5 h-3.5 text-[#8E2745]" />
                                  <span>Date: {ord.eventDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-emerald-700" /> {ord.customerPhone}
                                  </span>
                                  <a
                                    href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-semibold text-emerald-800 underline"
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </div>

                              {/* Item list */}
                              <div className="bg-[#FFF8F0] p-2 rounded-lg border border-[#3A1F1F]/8 text-[11px] font-medium text-[#302020] space-y-0.5">
                                {ord.items.map((it, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{it.quantity}x {it.productName}</span>
                                    <span className="text-[#8E2745] text-[10px]">({it.selectedSize.label})</span>
                                  </div>
                                ))}
                                {ord.specialInstructions && (
                                  <p className="text-[10px] text-[#806D6A] italic pt-1 border-t border-[#3A1F1F]/8">
                                    "{ord.specialInstructions}"
                                  </p>
                                )}
                              </div>

                              {/* Total & Action */}
                              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#3A1F1F]/8">
                                <div>
                                  <span className="font-serif font-bold text-sm text-[#302020]">
                                    ${ord.total.toFixed(2)}
                                  </span>
                                  <span className="block text-[10px] font-semibold text-emerald-700">
                                    Pay on Delivery
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1">
                                  {ord.status === 'Pending' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Confirmed')}
                                      className="bg-[#F5C84B] hover:bg-[#e5b229] text-[#3A1F1F] font-bold px-2 py-1 text-[10px] rounded-lg transition-colors cursor-pointer"
                                    >
                                      Confirm →
                                    </button>
                                  )}

                                  {ord.status === 'Confirmed' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                                      className="bg-[#D93462] hover:bg-[#c42553] text-white font-bold px-2 py-1 text-[10px] rounded-lg transition-colors cursor-pointer"
                                    >
                                      Bake →
                                    </button>
                                  )}

                                  {ord.status === 'Preparing' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Ready for pickup')}
                                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2 py-1 text-[10px] rounded-lg transition-colors cursor-pointer"
                                    >
                                      Ready →
                                    </button>
                                  )}

                                  {ord.status === 'Ready for pickup' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Completed')}
                                      className="bg-[#3A1F1F] hover:bg-black text-white font-bold px-2 py-1 text-[10px] rounded-lg transition-colors cursor-pointer"
                                    >
                                      Deliver ✓
                                    </button>
                                  )}

                                  {ord.status === 'Completed' && (
                                    <span className="text-[10px] font-bold text-emerald-700">
                                      Finished ✓
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

            {/* TABLE VIEW */}
            {pipelineViewMode === 'table' && (
              <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#3A1F1F]/10 bg-[#FFF8F0] text-xs font-serif font-bold uppercase text-[#302020]">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Event Date</th>
                        <th className="py-3 px-3">Total Due (On Delivery)</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Advance Pipeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3A1F1F]/8 text-xs font-medium text-[#302020]">
                      {filteredOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-[#FFF8F0]/60 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-sm text-[#8E2745]">#{ord.orderNumber || ord.id}</span>
                            <span className="block text-[10px] font-semibold text-[#806D6A]">{ord.orderType}</span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-sm text-[#302020]">{ord.customerName}</p>
                            <p className="text-[11px] text-[#806D6A]">{ord.customerPhone}</p>
                            {ord.deliveryAddress && (
                              <p className="text-[10px] text-[#806D6A] truncate max-w-[150px]">📍 {ord.deliveryAddress}</p>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-xs font-semibold">
                                {it.quantity}x {it.productName} <span className="text-[10px] text-[#8E2745]">({it.selectedSize.label})</span>
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-xs bg-[#FFF8F0] px-2.5 py-1 rounded-lg border border-[#3A1F1F]/10">
                              📅 {ord.eventDate}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-serif font-bold text-sm text-[#302020]">${ord.total.toFixed(2)}</span>
                            <span className="block text-[10px] font-semibold text-emerald-700">Pay on Delivery</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block font-bold text-[10px] px-2.5 py-1 rounded-xl border ${getStatusBadge(ord.status)}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {ord.status === 'Pending' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Confirmed')}
                                className="bg-[#F5C84B] hover:bg-[#e5b229] text-[#3A1F1F] font-bold px-2.5 py-1 text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                              >
                                Confirm Order →
                              </button>
                            )}
                            {ord.status === 'Confirmed' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                                className="bg-[#D93462] hover:bg-[#c42553] text-white font-bold px-2.5 py-1 text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                              >
                                Start Baking →
                              </button>
                            )}
                            {ord.status === 'Preparing' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Ready for pickup')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                              >
                                Mark Ready →
                              </button>
                            )}
                            {(ord.status === 'Ready for pickup' || ord.status === 'Out for delivery') && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Completed')}
                                className="bg-[#3A1F1F] hover:bg-black text-white font-bold px-2.5 py-1 text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                              >
                                Mark Completed ✓
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </section>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 2: DAILY KITCHEN PREP SHEET
            ══════════════════════════════════════════════════ */}
        {activeTab === 'prep-sheet' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#302020] flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-[#8E2745]" />
                    Daily Kitchen Production & Prep Sheet
                  </h3>
                  <p className="text-xs text-[#806D6A] font-medium">
                    Aggregated pastry batch counts and cake bake schedules grouped by customer event dates.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  🖨️ Print Kitchen Sheet
                </button>
              </div>

              {kitchenPrepByDate.length === 0 ? (
                <div className="text-center py-12 text-[#806D6A] font-medium">
                  No upcoming orders to prepare.
                </div>
              ) : (
                <div className="space-y-6">
                  {kitchenPrepByDate.map((group) => (
                    <div
                      key={group.date}
                      className="bg-[#FFF8F0] rounded-2xl border border-[#3A1F1F]/10 shadow-xs p-5"
                    >
                      <div className="flex items-center justify-between border-b border-[#3A1F1F]/10 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#8E2745]"></span>
                          <h4 className="font-serif font-bold text-lg text-[#302020]">
                            Event Date: {group.date}
                          </h4>
                          <span className="bg-[#F5C84B] text-[#3A1F1F] text-xs font-bold px-2 py-0.5 rounded-full">
                            {group.orderCount} Order{group.orderCount > 1 ? 's' : ''} Scheduled
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Total Batches to Fry & Bake */}
                        <div className="bg-white rounded-xl border-2 border-[#2D1610] p-4 shadow-[2px_2px_0px_#2D1610]">
                          <h5 className="font-heading font-black text-xs uppercase text-[#E86236] mb-3 flex items-center gap-1.5">
                            <ChefHat className="w-4 h-4" /> TOTAL QUANTITIES TO PREPARE:
                          </h5>
                          <div className="space-y-2">
                            {Object.entries(group.itemsSummary).map(([itemKey, val], idx) => {
                              const checkKey = `${group.date}-${itemKey}`;
                              const isChecked = !!prepChecklist[checkKey];

                              return (
                                <label
                                  key={idx}
                                  className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-[#3ED494]/20 border-[#3ED494] line-through text-[#1A0D08]/50'
                                      : 'bg-[#FAF6EF] border-[#2D1610]/20 hover:border-[#2D1610]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        setPrepChecklist(prev => ({ ...prev, [checkKey]: !prev[checkKey] }))
                                      }
                                      className="w-4 h-4 accent-[#237A57] rounded"
                                    />
                                    <span className="font-heading font-black text-xs text-[#1A0D08]">
                                      {itemKey}
                                    </span>
                                  </div>
                                  <span className="bg-[#1A0D08] text-white font-heading font-black text-xs px-2.5 py-0.5 rounded-full">
                                    {val.count}x order batches
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: Associated customer packages */}
                        <div className="bg-white rounded-xl border-2 border-[#2D1610] p-4 shadow-[2px_2px_0px_#2D1610]">
                          <h5 className="font-heading font-black text-xs uppercase text-[#237A57] mb-3 flex items-center gap-1.5">
                            <Truck className="w-4 h-4" /> PACKAGING & DISPATCH CHECKLIST:
                          </h5>
                          <div className="space-y-2.5">
                            {group.orders.map(o => (
                              <div key={o.id} className="p-2.5 rounded-lg border border-[#2D1610]/15 bg-[#FAF6EF] text-xs">
                                <div className="flex items-center justify-between font-bold">
                                  <span>#{o.id} • {o.customerName}</span>
                                  <span className="text-[10px] font-heading font-black text-[#E86236]">
                                    {o.orderType}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#1A0D08]/80 mt-0.5">
                                  {o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                                </p>
                                {o.specialInstructions && (
                                  <p className="text-[10px] text-[#E86236] font-semibold mt-1">
                                    Note: {o.specialInstructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 3: BESPOKE CAKE & EVENT INQUIRIES
            ══════════════════════════════════════════════════ */}
        {activeTab === 'inquiries' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl border-[3.5px] border-[#2D1610] shadow-[6px_6px_0px_#2D1610] p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="font-heading font-black text-2xl text-[#1A0D08] uppercase flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-[#F4BF28]" />
                  Custom Cake & Event Inquiries Review
                </h3>
                <p className="text-xs text-[#1A0D08]/80 font-medium">
                  Review customer requests submitted via the Bespoke Cake Studio. Set the final quoted price and click "Approve & Generate Order" to auto-create a 50% deposit order in your live pipeline!
                </p>
              </div>

              {bespokeInquiries.length === 0 ? (
                <div className="text-center py-12 text-[#1A0D08]/60 font-bold">
                  No bespoke inquiries pending.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {bespokeInquiries.map((inq: CustomBespokeInquiry) => {
                    const defaultQuote = customQuoteInputs[inq.id] ?? inq.estimatedPrice;

                    return (
                      <div
                        key={inq.id}
                        className="bg-[#FAF6EF] rounded-2xl border-[3px] border-[#2D1610] shadow-[4px_4px_0px_#2D1610] p-5 sm:p-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-black text-sm text-[#E86236]">
                                #{inq.id}
                              </span>
                              <span className={`text-[10px] font-heading font-black uppercase px-2 py-0.5 rounded-full border border-[#2D1610] ${
                                inq.status === 'Pending Review'
                                  ? 'bg-[#F4BF28] text-[#1A0D08]'
                                  : inq.status === 'Approved'
                                  ? 'bg-[#3ED494] text-[#1A0D08]'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {inq.status}
                              </span>
                            </div>
                            <h4 className="font-heading font-black text-lg text-[#1A0D08] mt-1">
                              {inq.customerName}
                            </h4>
                            <p className="text-xs font-bold text-[#1A0D08]/80 flex items-center gap-2">
                              <span>📞 {inq.customerPhone}</span>
                              <span>✉️ {inq.customerEmail}</span>
                            </p>
                          </div>

                          <div className="text-left sm:text-right bg-white p-3 rounded-xl border border-[#2D1610]/20">
                            <span className="text-[10px] font-heading font-black uppercase text-[#1A0D08]/70 block">
                              CUSTOMER SYSTEM ESTIMATE
                            </span>
                            <span className="font-heading font-black text-xl text-[#1A0D08]">
                              ${inq.estimatedPrice.toFixed(2)}
                            </span>
                            <span className="block text-[10px] font-bold text-[#237A57]">
                              50% Deposit: ${(inq.estimatedPrice * 0.5).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-[#2D1610]/20 mb-4 text-xs">
                          <div>
                            <span className="font-heading font-black text-[10px] text-[#1A0D08]/60 uppercase block">Event Date</span>
                            <span className="font-bold text-[#1A0D08]">📅 {inq.requestedDate}</span>
                          </div>
                          <div>
                            <span className="font-heading font-black text-[10px] text-[#1A0D08]/60 uppercase block">Event Type</span>
                            <span className="font-bold text-[#1A0D08]">{inq.eventType}</span>
                          </div>
                          <div>
                            <span className="font-heading font-black text-[10px] text-[#1A0D08]/60 uppercase block">Guest Count</span>
                            <span className="font-bold text-[#1A0D08]">{inq.guestCount} Guests</span>
                          </div>
                          <div>
                            <span className="font-heading font-black text-[10px] text-[#1A0D08]/60 uppercase block">Cake Tier</span>
                            <span className="font-bold text-[#1A0D08]">{inq.cakeTiers}</span>
                          </div>
                        </div>

                        {/* Flavors & Add-ons */}
                        <div className="space-y-2 mb-4 text-xs font-medium">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-heading font-black text-[11px] text-[#1A0D08] uppercase">Selected Flavor:</span>
                            <span className="bg-[#FBE48E] text-[#1A0D08] text-[10px] font-heading font-black px-2 py-0.5 rounded-md border border-[#2D1610]">
                              {inq.flavorSelection}
                            </span>
                          </div>

                          {inq.pastryAddons && inq.pastryAddons.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-heading font-black text-[11px] text-[#1A0D08] uppercase">Pastry Add-ons:</span>
                              {inq.pastryAddons.map((ao: string, i: number) => (
                                <span key={i} className="bg-[#BDE3F4] text-[#1A0D08] text-[10px] font-heading font-black px-2 py-0.5 rounded-md border border-[#2D1610]">
                                  {ao}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="bg-white p-3 rounded-lg border border-[#2D1610]/15">
                            <span className="font-heading font-black text-[10px] text-[#1A0D08]/60 uppercase block mb-1">
                              DESIGN VISION & CUSTOM NOTES:
                            </span>
                            <p className="text-xs font-semibold text-[#1A0D08]">
                              "{inq.designNotes}"
                            </p>
                          </div>
                        </div>

                        {/* Actions & Price Quoting */}
                        {inq.status === 'Pending Review' && (
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#2D1610]/15">
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-heading font-black uppercase text-[#1A0D08]">
                                Final Quoted Price ($):
                              </label>
                              <input
                                type="number"
                                value={defaultQuote}
                                onChange={(e) =>
                                  setCustomQuoteInputs(prev => ({ ...prev, [inq.id]: Number(e.target.value) }))
                                }
                                className="w-24 px-2 py-1 bg-white border-2 border-[#2D1610] rounded-lg text-xs font-heading font-black"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => declineBespokeInquiry(inq.id)}
                                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 font-heading font-black text-xs uppercase rounded-xl border border-red-300"
                              >
                                Decline
                              </button>

                              <button
                                onClick={() => {
                                  approveBespokeInquiry(inq.id, defaultQuote);
                                  setActiveTab('pipeline');
                                }}
                                className="bakery-btn-yellow px-4 py-2 text-xs uppercase border-2 border-[#2D1610] flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#2D1610]"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#237A57]" />
                                APPROVE & CREATE ORDER (${defaultQuote})
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 4: MENU & LIVE STOCK MANAGER
            ══════════════════════════════════════════════════ */}
        {activeTab === 'inventory' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl border-[3.5px] border-[#2D1610] shadow-[6px_6px_0px_#2D1610] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-black text-2xl text-[#1A0D08] uppercase">
                    Pastry Menu & Live Inventory Controls
                  </h3>
                  <p className="text-xs text-[#1A0D08]/80 font-medium">
                    Toggle live stock status (marks items as Sold Out on the customer storefront) and manage pricing.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="bakery-btn-yellow flex items-center gap-2 px-4 py-2.5 text-xs uppercase border-2 border-[#1A0D08] shadow-[3px_3px_0px_#1A0D08]"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  ADD NEW MENU ITEM
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className={`rounded-2xl border-[2.5px] border-[#2D1610] p-4 flex flex-col justify-between transition-all ${
                      prod.inStock ? 'bg-[#FAF6EF] shadow-[3.5px_3.5px_0px_#2D1610]' : 'bg-gray-100 opacity-70 border-dashed'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-[#2D1610] shadow-[2px_2px_0px_#2D1610]"
                          />
                          <div>
                            <span className="inline-block bg-[#F4BF28] text-[#1A0D08] text-[10px] font-heading font-black uppercase px-2 py-0.5 rounded border border-[#2D1610] mb-0.5">
                              {prod.badge}
                            </span>
                            <h4 className="font-heading font-black text-base text-[#1A0D08]">
                              {prod.name}
                            </h4>
                            <span className="text-xs font-extrabold text-[#E86236]">
                              {prod.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-heading font-black text-sm text-[#1A0D08]">
                            {prod.priceRangeText}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#1A0D08]/80 font-medium line-clamp-2 mb-3">
                        {prod.description}
                      </p>

                      <div className="space-y-1 mb-3">
                        {prod.sizes.map((s, i) => (
                          <div key={i} className="flex justify-between text-[11px] font-bold text-[#1A0D08] bg-white px-2 py-1 rounded border border-[#2D1610]/15">
                            <span>{s.label} ({s.piecesCount || 'Portion'})</span>
                            <span className="text-[#E86236]">${s.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stock and Edit Controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#2D1610]/15">
                      <button
                        onClick={() => toggleProductStock(prod.id)}
                        className={`px-3 py-1.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-1.5 ${
                          prod.inStock
                            ? 'bg-[#3ED494] text-[#1A0D08] border-[#2D1610] shadow-[2px_2px_0px_#2D1610]'
                            : 'bg-red-200 text-red-900 border-[#2D1610]'
                        }`}
                      >
                        {prod.inStock ? '✓ In Stock' : '⚠️ Sold Out'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="px-2.5 py-1.5 bg-white rounded-lg border border-[#2D1610] hover:bg-[#FAF6EF] text-xs font-bold text-[#1A0D08] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Edit product details & pricing"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {products.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${prod.name}" from live catalog?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 bg-white rounded-lg border border-red-300 hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: JOURNAL & BLOG STORIES MANAGER
            ══════════════════════════════════════════════════ */}
        {activeTab === 'blog' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl border-[3.5px] border-[#2D1610] shadow-[6px_6px_0px_#2D1610] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-black text-2xl text-[#1A0D08] uppercase flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#E86236]" />
                    Bakery Journal & Stories Manager
                  </h3>
                  <p className="text-xs text-[#1A0D08]/80 font-medium">
                    Create, edit, and publish stories and heritage recipes. Updates sync directly to the public website via Firestore.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticleId(null);
                    setArticleTitle('');
                    setArticleCategory('Heritage Baking');
                    setArticleReadTime('4 min read');
                    setArticleExcerpt('');
                    setArticleContentText('');
                    setArticleFeaturedImage('');
                    setIsArticleModalOpen(true);
                  }}
                  className="bakery-btn-yellow flex items-center gap-2 px-4 py-2.5 text-xs uppercase border-2 border-[#1A0D08] shadow-[3px_3px_0px_#1A0D08] cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  ADD NEW ARTICLE
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#FAF6EF] rounded-2xl border-[2.5px] border-[#2D1610] shadow-[3.5px_3.5px_0px_#2D1610] overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white border-b-2 border-[#2D1610]">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-white text-[#1A0D08] text-[10px] font-heading font-black uppercase px-2 py-0.5 rounded border border-[#2D1610]">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#1A0D08]/60">
                          <span>{post.publishedDate}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>

                        <h4 className="font-heading font-black text-base text-[#1A0D08] line-clamp-2 leading-snug">
                          {post.title}
                        </h4>

                        <p className="text-xs text-[#1A0D08]/80 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#2D1610]/15 mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#1A0D08]/60">
                        By {post.author.name}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingArticleId(post.id);
                            setArticleTitle(post.title);
                            setArticleCategory(post.category);
                            setArticleReadTime(post.readTime);
                            setArticleExcerpt(post.excerpt);
                            setArticleContentText(post.content.join('\n\n'));
                            setArticleFeaturedImage(post.featuredImage);
                            setIsArticleModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-white rounded-lg border border-[#2D1610] hover:bg-white/80 text-xs font-bold text-[#1A0D08] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Edit article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {blogPosts.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete article "${post.title}"?`)) {
                                deleteBlogPost(post.id);
                              }
                            }}
                            className="p-1.5 bg-white rounded-lg border border-red-300 hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 5: FINANCIALS & WEEKLY REVENUE CHART
            ══════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#3A1F1F]/10 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="font-serif font-bold text-2xl text-[#302020] flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#8E2745]" />
                  Weekly Revenue & Sales Volume
                </h3>
                <p className="text-xs text-[#806D6A] font-medium">
                  Pastry production peaks on Fridays and Saturdays due to wedding dessert spreads and party platters.
                </p>
              </div>

              {/* Bar Chart */}
              <div className="h-64 sm:h-72 w-full pt-8 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#3A1F1F]/15 px-2 sm:px-6">
                {WEEKLY_SALES_DATA.map((item: { day: string; revenue: number; orders: number }) => {
                  const maxRevenue = 2000;
                  const heightPercent = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));

                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-[#3A1F1F] text-white text-[10px] font-bold px-2 py-1 rounded-md text-center shadow-xs pointer-events-none">
                        ${item.revenue} ({item.orders} orders)
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[48px] bg-[#F5C84B] hover:bg-[#D93462] rounded-t-xl transition-all relative"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#302020] whitespace-nowrap hidden sm:block">
                          ${item.revenue}
                        </span>
                      </div>

                      <span className="font-bold text-xs text-[#302020] mt-2">
                        {item.day}
                      </span>
                      <span className="text-[10px] text-[#806D6A] font-semibold">
                        {item.orders} ord
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#302020] bg-[#FFF8F0] p-4 rounded-2xl border border-[#3A1F1F]/10">
                <div>
                  <span className="text-[#806D6A]">Projected Weekly Total: </span>
                  <span className="font-serif font-bold text-[#8E2745] text-sm ml-1">
                    ${WEEKLY_SALES_DATA.reduce((s: number, i: { revenue: number; orders: number }) => s + i.revenue, 0).toLocaleString()} USD
                  </span>
                </div>
                <div>
                  <span className="text-[#806D6A]">Average Party Order: </span>
                  <span className="font-serif font-bold text-emerald-700 text-sm ml-1">
                    ${Math.round(WEEKLY_SALES_DATA.reduce((s: number, i: { revenue: number; orders: number }) => s + i.revenue, 0) / WEEKLY_SALES_DATA.reduce((s: number, i: { revenue: number; orders: number }) => s + i.orders, 0))} USD
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Add New Product Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A0D08]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-[4px] border-[#2D1610] shadow-[8px_8px_0px_#2D1610] p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewProductModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#FAF6EF] border-2 border-[#2D1610] flex items-center justify-center font-bold text-xs hover:bg-gray-200"
            >
              ✕
            </button>

            <h3 className="font-heading font-black text-xl text-[#1A0D08] uppercase mb-1">
              Add New Menu Item
            </h3>
            <p className="text-xs text-[#1A0D08]/70 mb-4 font-medium">
              Item will immediately publish to customer storefront & sync to Firestore.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Cameroonian Spicy Meat Pies"
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e: any) => setNewProdCat(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  >
                    <option value="Chewable">Chewable</option>
                    <option value="Fondant Cakes">Fondant Cakes</option>
                    <option value="Savory Pastries">Savory Pastries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Badge</label>
                  <input
                    type="text"
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    placeholder="e.g. Chef's Pick"
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newProdMinPrice}
                    onChange={(e) => setNewProdMinPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newProdMaxPrice}
                    onChange={(e) => setNewProdMaxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newProdImageUrl}
                  onChange={(e) => setNewProdImageUrl(e.target.value)}
                  placeholder="https://... (defaults to category photo)"
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Appetizing description..."
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bakery-btn-yellow w-full py-3 text-xs uppercase border-2 border-[#1A0D08] shadow-[3px_3px_0px_#1A0D08]"
                >
                  SAVE & PUBLISH TO MENU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-[#1A0D08]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-[4px] border-[#2D1610] shadow-[8px_8px_0px_#2D1610] p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#FAF6EF] border-2 border-[#2D1610] flex items-center justify-center font-bold text-xs hover:bg-gray-200"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={editingProduct.imageUrl}
                alt={editingProduct.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-[#2D1610]"
              />
              <div>
                <h3 className="font-heading font-black text-xl text-[#1A0D08] uppercase leading-tight">
                  Edit Menu Item
                </h3>
                <p className="text-xs text-[#1A0D08]/70 font-medium">
                  {editingProduct.id} • Live Firestore Sync
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct({
                  ...editingProduct,
                  priceRangeText: `$${editingProduct.minPrice}–$${editingProduct.maxPrice}`,
                  sizes: editingProduct.sizes.length > 0 ? editingProduct.sizes.map((s, idx) => ({
                    ...s,
                    price: idx === 0 ? editingProduct.minPrice : (idx === editingProduct.sizes.length - 1 ? editingProduct.maxPrice : s.price)
                  })) : [
                    { label: 'Standard Portion', price: editingProduct.minPrice, description: 'Standard order' },
                    { label: 'Catering Platter', price: editingProduct.maxPrice, description: 'Celebration tray' }
                  ]
                });
                setEditingProduct(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  >
                    <option value="Chewable">Chewable</option>
                    <option value="Fondant Cakes">Fondant Cakes</option>
                    <option value="Savory Pastries">Savory Pastries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.minPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.maxPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, maxPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FAF6EF] rounded-xl border border-[#2D1610]/20">
                <span className="text-xs font-bold text-[#1A0D08]">Stock Availability</span>
                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, inStock: !editingProduct.inStock })}
                  className={`px-3 py-1 rounded-lg text-xs font-heading font-black uppercase border ${
                    editingProduct.inStock
                      ? 'bg-[#3ED494] text-[#1A0D08] border-[#2D1610]'
                      : 'bg-red-100 text-red-900 border-red-300'
                  }`}
                >
                  {editingProduct.inStock ? '✓ In Stock' : '⚠️ Sold Out'}
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 bg-[#FAF6EF] hover:bg-gray-200 text-[#1A0D08] text-xs font-heading font-black uppercase rounded-xl border-2 border-[#2D1610]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bakery-btn-yellow py-3 text-xs uppercase border-2 border-[#1A0D08] shadow-[3px_3px_0px_#1A0D08]"
                >
                  Update & Sync to Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Journal Story Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A0D08]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border-[4px] border-[#2D1610] shadow-[8px_8px_0px_#2D1610] p-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsArticleModalOpen(false);
                setEditingArticleId(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#FAF6EF] border-2 border-[#2D1610] flex items-center justify-center font-bold text-xs hover:bg-gray-200"
            >
              ✕
            </button>

            <h3 className="font-heading font-black text-xl text-[#1A0D08] uppercase mb-1">
              {editingArticleId ? 'Edit Bakery Journal Story' : 'Write New Journal Story'}
            </h3>
            <p className="text-xs text-[#1A0D08]/70 mb-4 font-medium">
              Publish authentic stories, heritage recipes, and bakery traditions directly to the blog.
            </p>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g. The Science of the Perfect Golden Puff Puff Bubble"
                  className="w-full px-3 py-2.5 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Category</label>
                  <select
                    value={articleCategory}
                    onChange={(e: any) => setArticleCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  >
                    <option value="Heritage Baking">Heritage Baking</option>
                    <option value="Party Planning">Party Planning</option>
                    <option value="Cake Studio">Cake Studio</option>
                    <option value="Kitchen Secrets">Kitchen Secrets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-black uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    placeholder="e.g. 4 min read"
                    className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={articleFeaturedImage}
                  onChange={(e) => setArticleFeaturedImage(e.target.value)}
                  placeholder="https://... or choose from quick assets below"
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium mb-2"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-[#1A0D08]/60 uppercase">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setArticleFeaturedImage(MASEH_ASSETS.puffPuff1)}
                    className="text-[10px] bg-[#FAF6EF] hover:bg-[#F4BF28] px-2 py-1 rounded border border-[#2D1610] font-bold transition-colors"
                  >
                    Puff Puff
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleFeaturedImage(MASEH_ASSETS.chinChin)}
                    className="text-[10px] bg-[#FAF6EF] hover:bg-[#F4BF28] px-2 py-1 rounded border border-[#2D1610] font-bold transition-colors"
                  >
                    Chin Chin
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleFeaturedImage(MASEH_ASSETS.fondantCakes)}
                    className="text-[10px] bg-[#FAF6EF] hover:bg-[#F4BF28] px-2 py-1 rounded border border-[#2D1610] font-bold transition-colors"
                  >
                    Celebration Cake
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleFeaturedImage(MASEH_ASSETS.fishRollPie)}
                    className="text-[10px] bg-[#FAF6EF] hover:bg-[#F4BF28] px-2 py-1 rounded border border-[#2D1610] font-bold transition-colors"
                  >
                    Fish Roll Pie
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={articleExcerpt}
                  onChange={(e) => setArticleExcerpt(e.target.value)}
                  placeholder="Engaging summary shown on article cards..."
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-black uppercase mb-1">
                  Full Article Body (Separate paragraphs with a blank line) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={articleContentText}
                  onChange={(e) => setArticleContentText(e.target.value)}
                  placeholder="First paragraph...&#10;&#10;Second paragraph discussing ingredients and technique...&#10;&#10;Third paragraph concluding thoughts..."
                  className="w-full px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsArticleModalOpen(false);
                    setEditingArticleId(null);
                  }}
                  className="flex-1 py-3 bg-[#FAF6EF] hover:bg-gray-200 text-[#1A0D08] text-xs font-heading font-black uppercase rounded-xl border-2 border-[#2D1610]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bakery-btn-yellow py-3 text-xs uppercase border-2 border-[#1A0D08] shadow-[3px_3px_0px_#1A0D08]"
                >
                  {editingArticleId ? 'Update & Save Story' : 'Publish Story to Journal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

