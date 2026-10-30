import React, { useState, useMemo } from 'react';
import { useBakery } from '../context/BakeryContext';
import { OrderStatus, Product, CustomBespokeInquiry, Order, BlogPost } from '../types/bakery';
import { MASEH_ASSETS, MASEH_SETTINGS } from '../data/initialData';
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
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  Printer,
  Store,
  User,
  MapPin,
  ChevronDown
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

  const [activeTab, setActiveTab] = useState<'pipeline' | 'prep-sheet' | 'inquiries' | 'inventory' | 'blog' | 'analytics'>('pipeline');
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  // Custom quote pricing inputs for inquiries
  const [customQuoteInputs, setCustomQuoteInputs] = useState<Record<string, number>>({});

  // Product modal
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<'African Doughnuts' | 'Snacks' | 'Savory Pastries' | 'Cakes' | 'Custom Cakes'>('African Doughnuts');
  const [newProdBadge, setNewProdBadge] = useState('Chef Special');
  const [newProdMinPrice, setNewProdMinPrice] = useState(30);
  const [newProdMaxPrice, setNewProdMaxPrice] = useState(80);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Blog article modal
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<BlogPost['category']>('Heritage Baking');
  const [articleReadTime, setArticleReadTime] = useState('4 min read');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContentText, setArticleContentText] = useState('');

  // Daily Kitchen Prep Sheet checked items state
  const [prepChecklist, setPrepChecklist] = useState<Record<string, boolean>>({});

  // Financial & Order Stats
  const totalSalesAll = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const pendingInquiriesCount = useMemo(() => customInquiries.filter(i => i.status === 'Pending Review').length, [customInquiries]);
  const inKitchenCount = useMemo(() => orders.filter(o => o.status === 'Preparing').length, [orders]);
  const totalBalancesDue = useMemo(() => orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0), [orders]);

  // Filtered orders for search and filter
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        ord.id.toLowerCase().includes(q) ||
        (ord.orderNumber && ord.orderNumber.toLowerCase().includes(q)) ||
        ord.customerName.toLowerCase().includes(q) ||
        (ord.customerPhone && ord.customerPhone.includes(searchQuery)) ||
        ord.items.some(it => it.productName.toLowerCase().includes(q));

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
      if (ord.status === 'Cancelled') return;
      const dateKey = ord.eventDate || 'Scheduled Orders';
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
      category: newProdCat,
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
          label: 'Standard Box',
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
          readTime: articleReadTime,
          excerpt: articleExcerpt.trim(),
          content: paragraphs.length > 0 ? paragraphs : existing.content
        });
      }
    } else {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        slug: articleTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: articleTitle.trim(),
        category: articleCategory,
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: articleReadTime,
        excerpt: articleExcerpt.trim() || 'A story about African pastry heritage and bakery traditions.',
        author: {
          name: "Maseh's Delights Kitchen",
          role: 'Head Pastry Chef'
        },
        tags: ['African Pastries', 'Bakery Stories', 'Celebrations'],
        featuredImage: MASEH_ASSETS.puffPuff2,
        content: paragraphs.length > 0 ? paragraphs : ['Our bakery is built upon family recipes passed down through generations.']
      };
      addBlogPost(newPost);
    }

    setIsArticleModalOpen(false);
    setEditingArticleId(null);
    setArticleTitle('');
    setArticleExcerpt('');
    setArticleContentText('');
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Preparing':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Out for delivery':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Completed':
        return 'bg-[#3A1F1F] text-white border-[#3A1F1F]';
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#302020] pb-24">
      
      {/* ══════════════════════════════════════════════════
          TOP BRANDED ADMIN HEADER
          ══════════════════════════════════════════════════ */}
      <header className="bg-[#3A1F1F] text-white border-b border-[#F5C84B]/20 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex-shrink-0 group cursor-pointer focus:outline-none"
              title="Return to Maseh's Delights Public Store"
            >
              <img
                src={MASEH_ASSETS.logoWhite}
                alt="Maseh's Delights"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </button>

            <div className="border-l border-white/20 pl-4">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg sm:text-xl text-[#F5C84B]">
                  Bakery Operations Hub
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isCloudSynced
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  <Cloud className="w-3 h-3" />
                  <span>{isCloudSynced ? 'Firestore Synced' : 'Local Storage'}</span>
                </span>
              </div>
              <p className="text-xs text-white/75 hidden sm:block">
                Bowie, Maryland • Orders, Kitchen Prep, Custom Cakes & Inventory
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Reset sample orders & inquiries"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F5C84B]" />
              <span className="hidden sm:inline">Reset Sample Data</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 px-4 py-2 bg-[#D93462] hover:bg-[#c22b54] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          DASHBOARD MAIN CONTAINER
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 1. METRICS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Total Orders & Bookings */}
          <div className="bg-white rounded-2xl border border-[#3A1F1F]/10 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#806D6A]">Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-[#3A1F1F] text-[#F5C84B] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-[#302020]">
              ${totalSalesAll.toFixed(2)}
            </p>
            <p className="text-[11px] text-[#4C9B72] font-semibold mt-1">
              {orders.length} active customer orders
            </p>
          </div>

          {/* Balance Due on Delivery */}
          <div className="bg-white rounded-2xl border border-[#3A1F1F]/10 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#806D6A]">Payment on Delivery</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#4C9B72] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-[#8E2745]">
              ${totalBalancesDue.toFixed(2)}
            </p>
            <p className="text-[11px] text-[#806D6A] font-medium mt-1">
              To collect on delivery / pickup
            </p>
          </div>

          {/* In Kitchen / Baking */}
          <div className="bg-white rounded-2xl border border-[#3A1F1F]/10 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#806D6A]">Kitchen Baking</span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-[#302020]">
              {inKitchenCount}
            </p>
            <p className="text-[11px] text-orange-700 font-semibold mt-1">
              Batches in oven & prep today
            </p>
          </div>

          {/* Pending Bespoke Cake Inquiries */}
          <div 
            onClick={() => setActiveTab('inquiries')}
            className="bg-white rounded-2xl border border-[#3A1F1F]/10 p-4 sm:p-5 shadow-sm cursor-pointer hover:border-[#8E2745] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#806D6A]">Custom Cake Quotes</span>
              <div className="w-8 h-8 rounded-xl bg-[#FFF0F4] text-[#D93462] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-[#D93462]">
              {pendingInquiriesCount}
            </p>
            <p className="text-[11px] text-[#8E2745] font-semibold mt-1 flex items-center gap-1">
              <span>Awaiting consultation quote</span>
              <span>→</span>
            </p>
          </div>

        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="bg-white rounded-2xl p-2 border border-[#3A1F1F]/10 shadow-sm flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#8E2745] text-white shadow-sm'
                : 'text-[#302020] hover:bg-[#FFF8F0]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Pipeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prep-sheet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'prep-sheet'
                ? 'bg-[#8E2745] text-white shadow-sm'
                : 'text-[#302020] hover:bg-[#FFF8F0]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Daily Kitchen Prep Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#8E2745] text-white shadow-sm'
                : 'text-[#302020] hover:bg-[#FFF8F0]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Cake Quotes ({customInquiries.length})</span>
            {pendingInquiriesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#F5C84B] text-[#3A1F1F] text-[10px] font-black flex items-center justify-center">
                {pendingInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#8E2745] text-white shadow-sm'
                : 'text-[#302020] hover:bg-[#FFF8F0]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pastry & Cake Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'blog'
                ? 'bg-[#8E2745] text-white shadow-sm'
                : 'text-[#302020] hover:bg-[#FFF8F0]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bakery Journal ({blogPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#8E2745] text-white shadow-sm'
                : 'text-[#302020] hover:bg-[#FFF8F0]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sales Analytics</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════
            TAB 1: LIVE ORDERS PIPELINE
            ══════════════════════════════════════════════════ */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#3A1F1F]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#806D6A]" />
                <input
                  type="text"
                  placeholder="Search by order #, customer name, phone, or treat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15 text-xs text-[#302020] focus:outline-none focus:ring-2 focus:ring-[#8E2745]/30"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#806D6A] flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Status:
                </span>
                {(['all', 'Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#3A1F1F] text-white'
                        : 'bg-[#FFF8F0] text-[#302020] hover:bg-[#3A1F1F]/10 border border-[#3A1F1F]/10'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}

                <div className="border-l border-[#3A1F1F]/15 pl-2 ml-1 flex items-center gap-1">
                  <button
                    onClick={() => setPipelineViewMode('kanban')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      pipelineViewMode === 'kanban' ? 'bg-[#8E2745] text-white' : 'text-[#806D6A] hover:bg-[#FFF8F0]'
                    }`}
                    title="Kanban Board View"
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setPipelineViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      pipelineViewMode === 'table' ? 'bg-[#8E2745] text-white' : 'text-[#806D6A] hover:bg-[#FFF8F0]'
                    }`}
                    title="Table View"
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Render (Kanban or Table) */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#3A1F1F]/10">
                <Package className="w-12 h-12 mx-auto text-[#806D6A]/50 mb-3" />
                <h3 className="font-serif font-bold text-lg text-[#302020]">No Orders Found</h3>
                <p className="text-xs text-[#806D6A] mt-1">Try resetting your search query or status filter.</p>
              </div>
            ) : pipelineViewMode === 'kanban' ? (
              /* KANBAN VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Completed'] as OrderStatus[]).map((colStatus) => {
                  const colOrders = filteredOrders.filter(o => o.status === colStatus);
                  return (
                    <div key={colStatus} className="bg-white/80 rounded-2xl border border-[#3A1F1F]/10 p-3 flex flex-col gap-3">
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#3A1F1F]/8">
                        <span className="font-serif font-bold text-xs text-[#302020] uppercase tracking-wider">
                          {colStatus}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-[#FFF8F0] border border-[#3A1F1F]/15 text-[10px] font-bold flex items-center justify-center text-[#302020]">
                          {colOrders.length}
                        </span>
                      </div>

                      {/* Column Cards */}
                      <div className="space-y-3 flex-1">
                        {colOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="bg-white rounded-xl p-3.5 border border-[#3A1F1F]/10 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-[#8E2745]">
                                {ord.orderNumber || ord.id}
                              </span>
                              <span className="text-[10px] font-bold text-[#4C9B72] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                POD: ${(ord.total || 0).toFixed(2)}
                              </span>
                            </div>

                            <div>
                              <p className="font-bold text-xs text-[#302020]">{ord.customerName}</p>
                              <a
                                href={`tel:${ord.customerPhone}`}
                                className="text-[11px] text-[#806D6A] hover:text-[#D93462] flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-3 h-3 text-[#F5C84B]" />
                                <span>{ord.customerPhone}</span>
                              </a>
                            </div>

                            {/* Event Date & Delivery Type */}
                            <div className="text-[10px] text-[#806D6A] bg-[#FFF8F0] p-2 rounded-lg space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#302020]">Event Date:</span>
                                <span>{ord.eventDate || 'Scheduled'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#302020]">Type:</span>
                                <span>{ord.orderType}</span>
                              </div>
                              {ord.deliveryAddress && (
                                <p className="truncate text-[10px] text-[#806D6A] pt-0.5">
                                  📍 {ord.deliveryAddress}
                                </p>
                              )}
                            </div>

                            {/* Order Items Summary */}
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#806D6A]">
                                Items ({ord.items.length}):
                              </p>
                              {ord.items.slice(0, 2).map((it, idx) => (
                                <p key={idx} className="text-[11px] text-[#302020] truncate font-medium">
                                  • {it.quantity}x {it.productName} ({it.selectedSize.label})
                                </p>
                              ))}
                              {ord.items.length > 2 && (
                                <p className="text-[10px] text-[#806D6A] italic">
                                  +{ord.items.length - 2} more item(s)...
                                </p>
                              )}
                            </div>

                            {/* Status Change Selector */}
                            <div className="pt-2 border-t border-[#3A1F1F]/8">
                              <label className="block text-[10px] font-bold text-[#806D6A] mb-1">
                                Update Progress:
                              </label>
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                className={`w-full text-xs font-bold py-1.5 px-2 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeStyle(ord.status)}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Preparing">Preparing (In Kitchen)</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        ))}

                        {colOrders.length === 0 && (
                          <div className="p-4 text-center text-xs text-[#806D6A]/60 italic border border-dashed border-[#3A1F1F]/10 rounded-xl">
                            No orders in this stage
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="bg-white rounded-2xl border border-[#3A1F1F]/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#3A1F1F] text-white uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Event Date</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total (POD)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3A1F1F]/8">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FFF8F0]/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#8E2745]">
                            {ord.orderNumber || ord.id}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-[#302020]">{ord.customerName}</p>
                            <p className="text-[11px] text-[#806D6A]">{ord.customerPhone}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#302020]">{ord.eventDate || 'Scheduled'}</p>
                            <p className="text-[10px] text-[#806D6A]">{ord.orderType}</p>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">
                            {ord.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#4C9B72]">
                            ${(ord.total || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeStyle(ord.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for delivery">Out for delivery</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={`tel:${ord.customerPhone}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8E2745] hover:underline"
                            >
                              <Phone className="w-3 h-3" /> Call
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 2: DAILY KITCHEN PREP SHEET
            ══════════════════════════════════════════════════ */}
        {activeTab === 'prep-sheet' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#302020]">
                  Baker's Kitchen Production Sheet
                </h3>
                <p className="text-xs text-[#806D6A]">
                  Aggregated quantities of puff puff batches, chin chin tubs, fish rolls, and cake tiers grouped by event date.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Daily Sheet</span>
              </button>
            </div>

            {kitchenPrepByDate.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#3A1F1F]/10">
                <ChefHat className="w-12 h-12 mx-auto text-[#806D6A]/50 mb-3" />
                <h4 className="font-serif font-bold text-lg text-[#302020]">No Active Baking Batches</h4>
                <p className="text-xs text-[#806D6A] mt-1">Confirmed orders will appear here automatically.</p>
              </div>
            ) : (
              kitchenPrepByDate.map((group, gIdx) => (
                <div key={gIdx} className="bg-white rounded-2xl border border-[#3A1F1F]/10 overflow-hidden shadow-sm space-y-4 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#3A1F1F]/10">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-[#8E2745]" />
                      <span className="font-serif font-bold text-base text-[#302020]">
                        Production Target Date: {group.date}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#8E2745] bg-[#FFF0F4] px-3 py-1 rounded-full border border-[#D93462]/20">
                      {group.orderCount} Order(s)
                    </span>
                  </div>

                  {/* Summary Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(group.itemsSummary).map(([itemLabel, data], iIdx) => {
                      const checkKey = `${group.date}-${itemLabel}`;
                      const isChecked = !!prepChecklist[checkKey];

                      return (
                        <div
                          key={iIdx}
                          onClick={() => setPrepChecklist(prev => ({ ...prev, [checkKey]: !isChecked }))}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-[#FFF8F0] border-[#3A1F1F]/10 text-[#302020] hover:border-[#8E2745]'
                          }`}
                        >
                          <div>
                            <p className={`font-bold text-xs ${isChecked ? 'line-through text-emerald-800' : ''}`}>
                              {itemLabel}
                            </p>
                            <p className="text-[11px] font-semibold text-[#8E2745] mt-0.5">
                              Quantity: {data.count} ({data.unitText})
                            </p>
                          </div>

                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                            isChecked ? 'bg-emerald-600 text-white border-emerald-600' : 'border-[#3A1F1F]/20 bg-white'
                          }`}>
                            {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 3: CUSTOM CAKE INQUIRIES & QUOTES
            ══════════════════════════════════════════════════ */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#302020]">
                  Custom Celebration Cake Consultation Inquiries
                </h3>
                <p className="text-xs text-[#806D6A]">
                  Review customer requests submitted via the Bespoke Cake Studio. Set final quotes and approve into live production orders.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-[#FFF0F4] text-[#8E2745] px-3 py-1.5 rounded-xl border border-[#D93462]/20">
                  {customInquiries.length} Total Submissions
                </span>
              </div>
            </div>

            {customInquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#3A1F1F]/10">
                <Sparkles className="w-12 h-12 mx-auto text-[#806D6A]/50 mb-3" />
                <h4 className="font-serif font-bold text-lg text-[#302020]">No Custom Cake Inquiries Yet</h4>
                <p className="text-xs text-[#806D6A] mt-1">Inquiries submitted from the website will appear here in real time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customInquiries.map((inq) => {
                  const quotePrice = customQuoteInputs[inq.id] !== undefined ? customQuoteInputs[inq.id] : inq.estimatedPrice;

                  return (
                    <div
                      key={inq.id}
                      className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#8E2745] bg-[#FFF0F4] px-2.5 py-1 rounded-lg">
                            {inq.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            inq.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : inq.status === 'Declined'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {inq.status}
                          </span>
                        </div>

                        {/* Customer & Event Info */}
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#302020]">
                            {inq.customerName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#806D6A] pt-1">
                            <a href={`tel:${inq.customerPhone}`} className="hover:text-[#D93462] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#F5C84B]" />
                              <span>{inq.customerPhone}</span>
                            </a>
                            <span>•</span>
                            <span>{inq.customerEmail}</span>
                          </div>
                        </div>

                        {/* Event Details Grid */}
                        <div className="bg-[#FFF8F0] rounded-xl p-3 text-xs space-y-1.5 text-[#302020]">
                          <div className="flex justify-between">
                            <span className="font-semibold text-[#806D6A]">Event & Date:</span>
                            <span className="font-bold">{inq.eventType} ({inq.requestedDate})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-[#806D6A]">Size & Guests:</span>
                            <span className="font-bold">{inq.cakeTiers} • {inq.guestCount} guests</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-[#806D6A]">Flavor & Theme:</span>
                            <span className="font-bold truncate max-w-[200px]">{inq.flavorSelection}</span>
                          </div>
                          {inq.designNotes && (
                            <div className="pt-1 border-t border-[#3A1F1F]/8">
                              <span className="font-semibold text-[#806D6A] block text-[10px] uppercase">Notes:</span>
                              <p className="text-[11px] text-[#302020] italic">{inq.designNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#3A1F1F]/10 space-y-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-xs font-bold text-[#302020]">
                            Quote Price ($):
                          </label>
                          <input
                            type="number"
                            value={quotePrice}
                            onChange={(e) => setCustomQuoteInputs({ ...customQuoteInputs, [inq.id]: Number(e.target.value) })}
                            className="w-28 px-3 py-1.5 bg-[#FFF8F0] rounded-lg border border-[#3A1F1F]/20 text-xs font-bold text-[#302020] text-right focus:outline-none focus:ring-2 focus:ring-[#8E2745]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.customerName}, this is Maseh's Delights regarding your custom cake request for ${inq.requestedDate}. We've prepared your consultation quote of $${quotePrice}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </a>

                          {inq.status === 'Pending Review' && (
                            <>
                              <button
                                onClick={() => {
                                  approveBespokeInquiry(inq.id, quotePrice, 'Approved by Head Baker');
                                  setActiveTab('pipeline');
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#8E2745] hover:bg-[#701c34] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                              >
                                Approve Order
                              </button>

                              <button
                                onClick={() => declineBespokeInquiry(inq.id, 'Fully booked for this date')}
                                className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer"
                                title="Decline Inquiry"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 4: PASTRY & CAKE INVENTORY
            ══════════════════════════════════════════════════ */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#302020]">
                  Pastry Catalog & Portion Pricing
                </h3>
                <p className="text-xs text-[#806D6A]">
                  Manage stock availability, adjust pricing tiers, and update bakery offerings live.
                </p>
              </div>

              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-[#3A1F1F]/10 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-[#FFF8F0]">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => toggleProductStock(prod.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm transition-all cursor-pointer ${
                          prod.inStock
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E2745]">
                          {prod.category}
                        </span>
                        <span className="font-bold text-xs text-[#302020]">
                          {prod.priceRangeText}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#302020] mt-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-[#806D6A] line-clamp-2 mt-1">
                        {prod.description}
                      </p>
                    </div>

                    {/* Portions & Sizes list */}
                    <div className="bg-[#FFF8F0] p-2.5 rounded-xl space-y-1.5 text-xs border border-[#3A1F1F]/8">
                      <span className="font-bold text-[10px] uppercase text-[#806D6A] block">
                        Serving Tiers:
                      </span>
                      {prod.sizes.map((sz, sIdx) => (
                        <div key={sIdx} className="flex justify-between items-center text-[11px]">
                          <span className="font-medium text-[#302020]">{sz.label}</span>
                          <span className="font-bold text-[#8E2745]">${sz.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="pt-2 flex items-center justify-between border-t border-[#3A1F1F]/8">
                      <button
                        onClick={() => toggleProductStock(prod.id)}
                        className="text-xs font-bold text-[#8E2745] hover:underline cursor-pointer"
                      >
                        Toggle Stock Status
                      </button>

                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add New Product */}
            {isNewProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-[#3A1F1F]/15 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#3A1F1F]/10">
                    <h3 className="font-serif font-bold text-lg text-[#302020]">
                      Add New Pastry or Cake
                    </h3>
                    <button
                      onClick={() => setIsNewProductModalOpen(false)}
                      className="w-7 h-7 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#806D6A] hover:text-[#302020]"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-[#302020] mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Suya Spiced Meat Pie"
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#302020] mb-1">Category</label>
                        <select
                          value={newProdCat}
                          onChange={(e: any) => setNewProdCat(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                        >
                          <option>African Doughnuts</option>
                          <option>Snacks</option>
                          <option>Savory Pastries</option>
                          <option>Cakes</option>
                          <option>Custom Cakes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#302020] mb-1">Badge</label>
                        <input
                          type="text"
                          value={newProdBadge}
                          onChange={(e) => setNewProdBadge(e.target.value)}
                          placeholder="e.g. Best Seller"
                          className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#302020] mb-1">Standard Price ($)</label>
                        <input
                          type="number"
                          value={newProdMinPrice}
                          onChange={(e) => setNewProdMinPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#302020] mb-1">Catering Platter ($)</label>
                        <input
                          type="number"
                          value={newProdMaxPrice}
                          onChange={(e) => setNewProdMaxPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#302020] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="Describe flavor and ingredients..."
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsNewProductModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-[#3A1F1F]/20 font-bold text-[#806D6A]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary py-2 px-6 font-bold"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 5: BAKERY JOURNAL STORIES
            ══════════════════════════════════════════════════ */}
        {activeTab === 'blog' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#302020]">
                  Heritage Stories & Bakery Journal
                </h3>
                <p className="text-xs text-[#806D6A]">
                  Publish authentic articles celebrating African pastry culture, recipe secrets, and celebration cake tips.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingArticleId(null);
                  setArticleTitle('');
                  setArticleExcerpt('');
                  setArticleContentText('');
                  setIsArticleModalOpen(true);
                }}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-[#3A1F1F]/10 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-[#FFF8F0]">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#3A1F1F]/80 backdrop-blur-md text-[#F5C84B] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-[#806D6A] font-semibold">
                        {post.publishedDate} • {post.readTime}
                      </p>
                      <h4 className="font-serif font-bold text-base text-[#302020] mt-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[#806D6A] line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#3A1F1F]/8">
                      <button
                        onClick={() => {
                          setEditingArticleId(post.id);
                          setArticleTitle(post.title);
                          setArticleCategory(post.category);
                          setArticleReadTime(post.readTime);
                          setArticleExcerpt(post.excerpt);
                          setArticleContentText(post.content.join('\n\n'));
                          setIsArticleModalOpen(true);
                        }}
                        className="text-xs font-bold text-[#8E2745] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Article
                      </button>

                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Article Editor */}
            {isArticleModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-[#3A1F1F]/15 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#3A1F1F]/10">
                    <h3 className="font-serif font-bold text-lg text-[#302020]">
                      {editingArticleId ? 'Edit Journal Article' : 'Write New Article'}
                    </h3>
                    <button
                      onClick={() => setIsArticleModalOpen(false)}
                      className="w-7 h-7 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#806D6A] hover:text-[#302020]"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveArticle} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-[#302020] mb-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="e.g. The Secrets of Perfect Golden Puff Puff"
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#302020] mb-1">Category</label>
                        <select
                          value={articleCategory}
                          onChange={(e: any) => setArticleCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                        >
                          <option>Heritage Baking</option>
                          <option>Celebrations</option>
                          <option>Pastry Guide</option>
                          <option>Behind the Scenes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#302020] mb-1">Read Time</label>
                        <input
                          type="text"
                          value={articleReadTime}
                          onChange={(e) => setArticleReadTime(e.target.value)}
                          placeholder="e.g. 4 min read"
                          className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#302020] mb-1">Short Summary (Excerpt)</label>
                      <textarea
                        rows={2}
                        value={articleExcerpt}
                        onChange={(e) => setArticleExcerpt(e.target.value)}
                        placeholder="Brief overview shown on the card..."
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#302020] mb-1">Full Article Story (Paragraphs)</label>
                      <textarea
                        rows={5}
                        value={articleContentText}
                        onChange={(e) => setArticleContentText(e.target.value)}
                        placeholder="Type full article. Separate paragraphs with double enter..."
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl border border-[#3A1F1F]/15"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsArticleModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-[#3A1F1F]/20 font-bold text-[#806D6A]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary py-2 px-6 font-bold"
                      >
                        Publish Story
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 6: SALES ANALYTICS
            ══════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#302020]">
                Bakery Sales & Performance Insights
              </h3>
              <p className="text-xs text-[#806D6A]">
                Overview of pastry orders, revenue by category, and fulfillment rates in the Washington DC & Maryland Metro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Share */}
              <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-base text-[#302020]">
                  Revenue by Category
                </h4>
                <div className="space-y-3">
                  {[
                    { cat: 'African Doughnuts (Puff Puff)', pct: 45, color: 'bg-[#D93462]' },
                    { cat: 'Celebration & Fondant Cakes', pct: 30, color: 'bg-[#8E2745]' },
                    { cat: 'West African Chin Chin', pct: 15, color: 'bg-[#F5C84B]' },
                    { cat: 'Savory Pastries (Fish Rolls)', pct: 10, color: 'bg-[#4C9B72]' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#302020]">{item.cat}</span>
                        <span className="text-[#8E2745] font-bold">{item.pct}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#FFF8F0] overflow-hidden border border-[#3A1F1F]/10">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment on Delivery Performance */}
              <div className="bg-white rounded-2xl p-5 border border-[#3A1F1F]/10 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#302020]">
                    Payment on Delivery Fulfillment
                  </h4>
                  <p className="text-xs text-[#806D6A] mt-1">
                    Customers pay with cash or direct transfer upon arrival of treats.
                  </p>

                  <div className="mt-4 p-4 rounded-xl bg-[#FFF8F0] border border-[#3A1F1F]/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#806D6A]">Completed Orders:</span>
                      <span className="font-bold text-[#4C9B72]">
                        {orders.filter(o => o.status === 'Completed').length} orders fulfilled
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#806D6A]">Pending Deliveries:</span>
                      <span className="font-bold text-[#8E2745]">
                        {orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length} scheduled
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#3A1F1F]/8">
                      <span className="font-bold text-[#302020]">Collection Reliability:</span>
                      <span className="font-bold text-emerald-700">99.4% Honored</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#806D6A] italic">
                  Note: All transactions are recorded in the orders pipeline.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
