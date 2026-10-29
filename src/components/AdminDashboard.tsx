import React, { useState, useMemo } from 'react';
import { useBakery } from '../context/BakeryContext';
import { OrderStatus, Product, CustomBespokeInquiry, Order, BlogPost } from '../types/bakery';
import { WEEKLY_SALES_DATA, MASEH_ASSETS } from '../data/initialData';
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
  X
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

  // Add / Edit product modal state
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<'Chewable' | 'Fondant Cakes' | 'Savory Pastries'>('Chewable');
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

  // Overall financial stats
  const totalSalesAll = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalDeposits = useMemo(() => orders.reduce((sum, o) => sum + o.depositAmount, 0), [orders]);
  const totalBalancesDue = useMemo(() => orders.reduce((sum, o) => sum + o.balanceDue, 0), [orders]);
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
      name: newProdName.trim(),
      category: newProdCat,
      badge: newProdBadge.trim() || 'Bakery Special',
      priceRangeText: `$${newProdMinPrice.toFixed(2)}–$${newProdMaxPrice.toFixed(2)}`,
      minPrice: Number(newProdMinPrice),
      maxPrice: Number(newProdMaxPrice),
      description: newProdDesc.trim() || 'Delicious authentic African pastry made fresh in our kitchen.',
      flavorNotes: ['Made Fresh Daily', 'Traditional Recipe'],
      active: true,
      inStock: true,
      imageTheme: newProdCat === 'Fondant Cakes' ? 'fondantcake' : 'puffpuff',
      imageUrl: newProdCat === 'Fondant Cakes' ? MASEH_ASSETS.fondantCakes : MASEH_ASSETS.puffPuff1,
      cardBgColor: '#FCE1D4',
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
      case 'Awaiting Confirmation':
        return 'bg-[#FFF3CD] text-[#856404] border-[#856404]';
      case 'Preparing':
        return 'bg-[#F4BF28] text-[#1A0D08] border-[#1A0D08]';
      case 'Ready':
        return 'bg-[#3ED494] text-[#1A0D08] border-[#1A0D08]';
      case 'Delivered':
        return 'bg-[#1A0D08] text-white border-[#1A0D08]';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1A0D08] pb-24">
      
      {/* ══════════════════════════════════════════════════
          TOP HEADER STRIP (High Contrast Dark Espresso & Gold)
          ══════════════════════════════════════════════════ */}
      <header className="bg-[#1E0F0A] text-white border-b-[4px] border-[#F4BF28] px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F4BF28] border-2 border-white shadow-[3px_3px_0px_#E86236] flex items-center justify-center text-[#1A0D08] text-2xl font-heading font-black">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                  MASEH'S <span className="text-[#F4BF28]">OPERATIONS HUB</span>
                </h1>
                <span className={`text-[10px] font-heading font-black px-2.5 py-0.5 rounded-full border border-black uppercase flex items-center gap-1.5 ${
                  isCloudSynced ? 'bg-[#3ED494] text-[#1A0D08]' : 'bg-[#F4BF28] text-[#1A0D08]'
                }`}>
                  <Cloud className="w-3 h-3" />
                  {isCloudSynced ? 'FIRESTORE CLOUD SYNCED' : 'LOCAL READY'}
                </span>
              </div>
              <p className="font-body text-xs text-white/80">
                Order Pipeline • Daily Kitchen Prep • Bespoke Inquiries • Menu & Stock • Blog Stories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/30 text-xs font-bold transition-all"
              title="Reset sample orders & inquiries"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>

            <button
              onClick={() => setCurrentView('storefront')}
              className="bakery-btn-yellow flex items-center gap-2 px-4 py-2.5 text-xs uppercase border-2 border-[#1A0D08] shadow-[2.5px_2.5px_0px_#FAF6EF]"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              RETURN TO STOREFRONT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* ══════════════════════════════════════════════════
            KEY METRICS SUMMARY CARDS
            ══════════════════════════════════════════════════ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border-[3px] border-[#2D1610] shadow-[4px_4px_0px_#2D1610] p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-black uppercase text-[#1A0D08]/70">TOTAL BOOKINGS</span>
              <div className="w-8 h-8 rounded-xl bg-[#F4BF28] border-2 border-[#2D1610] flex items-center justify-center text-[#1A0D08]">
                <DollarSign className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
            <div>
              <p className="font-heading font-black text-2xl sm:text-3xl text-[#1A0D08]">
                ${totalSalesAll.toFixed(2)}
              </p>
              <p className="text-[11px] font-extrabold text-[#237A57] mt-0.5">
                50% Deposits Confirmed: ${totalDeposits.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-[3px] border-[#2D1610] shadow-[4px_4px_0px_#2D1610] p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-black uppercase text-[#1A0D08]/70">BALANCE DUE AT PICKUP</span>
              <div className="w-8 h-8 rounded-xl bg-[#FAF6EF] border-2 border-[#2D1610] flex items-center justify-center text-[#E86236]">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-heading font-black text-2xl sm:text-3xl text-[#E86236]">
                ${totalBalancesDue.toFixed(2)}
              </p>
              <p className="text-[11px] font-bold text-[#1A0D08]/80 mt-0.5">
                Collect upon delivery / handoff
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-[3px] border-[#2D1610] shadow-[4px_4px_0px_#2D1610] p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-black uppercase text-[#1A0D08]/70">IN KITCHEN / FRYING</span>
              <div className="w-8 h-8 rounded-xl bg-[#3ED494] border-2 border-[#2D1610] flex items-center justify-center text-[#1A0D08]">
                <ChefHat className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-heading font-black text-2xl sm:text-3xl text-[#1A0D08]">
                {inKitchenCount}
              </p>
              <p className="text-[11px] font-extrabold text-[#237A57] mt-0.5">
                Dough rising or in deep fryer
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-[3px] border-[#2D1610] shadow-[4px_4px_0px_#2D1610] p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-black uppercase text-[#1A0D08]/70">BESPOKE INQUIRIES</span>
              <div className="w-8 h-8 rounded-xl bg-[#E86236] border-2 border-[#2D1610] flex items-center justify-center text-white">
                <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <p className="font-heading font-black text-2xl sm:text-3xl text-[#1A0D08]">
                {pendingInquiriesCount}
              </p>
              <p className="text-[11px] font-extrabold text-[#E86236] mt-0.5">
                Awaiting baker quote review
              </p>
            </div>
          </div>

        </section>

        {/* ══════════════════════════════════════════════════
            TAB NAVIGATION
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#2D1610]/20 pb-4">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-2 ${
                activeTab === 'pipeline'
                  ? 'bg-[#1A0D08] text-white border-[#1A0D08] shadow-[3px_3px_0px_#F4BF28]'
                  : 'bg-white text-[#1A0D08] border-[#2D1610] hover:bg-[#FAF6EF]'
              }`}
            >
              <Package className="w-4 h-4" />
              Orders Pipeline ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('prep-sheet')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-2 ${
                activeTab === 'prep-sheet'
                  ? 'bg-[#1A0D08] text-white border-[#1A0D08] shadow-[3px_3px_0px_#F4BF28]'
                  : 'bg-white text-[#1A0D08] border-[#2D1610] hover:bg-[#FAF6EF]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Kitchen Prep Sheet
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-[#1A0D08] text-white border-[#1A0D08] shadow-[3px_3px_0px_#F4BF28]'
                  : 'bg-white text-[#1A0D08] border-[#2D1610] hover:bg-[#FAF6EF]'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              Bespoke Inquiries ({bespokeInquiries.length})
              {pendingInquiriesCount > 0 && (
                <span className="bg-[#E86236] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-[#1A0D08] text-white border-[#1A0D08] shadow-[3px_3px_0px_#F4BF28]'
                  : 'bg-white text-[#1A0D08] border-[#2D1610] hover:bg-[#FAF6EF]'
              }`}
            >
              <Layers className="w-4 h-4" />
              Menu & Live Stock ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-2 ${
                activeTab === 'blog'
                  ? 'bg-[#1A0D08] text-white border-[#1A0D08] shadow-[3px_3px_0px_#F4BF28]'
                  : 'bg-white text-[#1A0D08] border-[#2D1610] hover:bg-[#FAF6EF]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Journal & Blog ({blogPosts.length})
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase border-2 transition-all flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-[#1A0D08] text-white border-[#1A0D08] shadow-[3px_3px_0px_#F4BF28]'
                  : 'bg-white text-[#1A0D08] border-[#2D1610] hover:bg-[#FAF6EF]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Revenue & Trends
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            TAB 1: ORDERS PIPELINE (KANBAN & TABLE VIEWS)
            ══════════════════════════════════════════════════ */}
        {activeTab === 'pipeline' && (
          <section className="space-y-6">
            
            {/* Control Bar: Search, Status Filter, and Kanban/Table toggle */}
            <div className="bg-white rounded-2xl border-[3px] border-[#2D1610] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#2D1610]">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A0D08]/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, phone, or pastry..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-semibold text-[#1A0D08] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#1A0D08]" />
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-[#FAF6EF] border-2 border-[#2D1610] rounded-xl text-xs font-bold text-[#1A0D08]"
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
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setPipelineViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg font-heading font-black text-xs uppercase border-2 transition-all ${
                    pipelineViewMode === 'kanban'
                      ? 'bg-[#F4BF28] text-[#1A0D08] border-[#2D1610] shadow-[2px_2px_0px_#2D1610]'
                      : 'bg-[#FAF6EF] text-[#1A0D08] border-[#2D1610]/40'
                  }`}
                >
                  Kanban Board
                </button>
                <button
                  onClick={() => setPipelineViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg font-heading font-black text-xs uppercase border-2 transition-all ${
                    pipelineViewMode === 'table'
                      ? 'bg-[#F4BF28] text-[#1A0D08] border-[#2D1610] shadow-[2px_2px_0px_#2D1610]'
                      : 'bg-[#FAF6EF] text-[#1A0D08] border-[#2D1610]/40'
                  }`}
                >
                  Table View
                </button>
              </div>
            </div>

            {/* KANBAN BOARD VIEW */}
            {pipelineViewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                
                {/* Column 1: Awaiting Confirmation */}
                {(['Awaiting Confirmation', 'Preparing', 'Ready', 'Delivered'] as OrderStatus[]).map((colStatus) => {
                  const colOrders = filteredOrders.filter(o => o.status === colStatus);

                  const columnHeaderBg = 
                    colStatus === 'Awaiting Confirmation' ? 'bg-[#FFF3CD] text-[#856404]' :
                    colStatus === 'Preparing' ? 'bg-[#F4BF28] text-[#1A0D08]' :
                    colStatus === 'Ready' ? 'bg-[#3ED494] text-[#1A0D08]' : 'bg-[#1A0D08] text-white';

                  return (
                    <div
                      key={colStatus}
                      className="bg-[#FAF6EF] rounded-2xl border-[3px] border-[#2D1610] p-4 flex flex-col min-h-[500px] shadow-[4px_4px_0px_#2D1610]"
                    >
                      <div className={`p-2.5 rounded-xl border-2 border-[#2D1610] mb-3 flex items-center justify-between font-heading font-black text-xs uppercase ${columnHeaderBg}`}>
                        <span>{colStatus}</span>
                        <span className="w-5 h-5 rounded-full bg-white text-[#1A0D08] flex items-center justify-center text-[10px] border border-[#2D1610]">
                          {colOrders.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {colOrders.length === 0 ? (
                          <div className="text-center py-10 text-xs font-bold text-[#1A0D08]/40 border-2 border-dashed border-[#2D1610]/20 rounded-xl">
                            No orders in this stage
                          </div>
                        ) : (
                          colOrders.map(ord => (
                            <div
                              key={ord.id}
                              className="bg-white rounded-xl border-2 border-[#2D1610] p-3.5 shadow-[2.5px_2.5px_0px_#2D1610] space-y-2.5 transition-all hover:-translate-y-0.5"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div>
                                  <span className="font-heading font-black text-xs text-[#E86236]">
                                    #{ord.id}
                                  </span>
                                  <h4 className="font-heading font-black text-sm text-[#1A0D08]">
                                    {ord.customerName}
                                  </h4>
                                </div>
                                <span className={`text-[10px] font-heading font-black uppercase px-2 py-0.5 rounded border border-[#2D1610] ${
                                  ord.orderType === 'Delivery' ? 'bg-[#3CA9E2] text-white' : 'bg-[#FAF6EF] text-[#1A0D08]'
                                }`}>
                                  {ord.orderType}
                                </span>
                              </div>

                              {/* Due Date & Phone */}
                              <div className="text-[11px] font-bold text-[#1A0D08]/80 space-y-1">
                                <div className="flex items-center gap-1.5 text-[#1A0D08]">
                                  <Calendar className="w-3.5 h-3.5 text-[#E86236]" />
                                  <span>Date: {ord.eventDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-[#237A57]" /> {ord.customerPhone}
                                  </span>
                                  <a
                                    href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-heading font-black text-[#237A57] underline"
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </div>

                              {/* Item list */}
                              <div className="bg-[#FAF6EF] p-2 rounded-lg border border-[#2D1610]/20 text-[11px] font-bold text-[#1A0D08] space-y-1">
                                {ord.items.map((it, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{it.quantity}x {it.productName}</span>
                                    <span className="text-[#E86236] text-[10px]">({it.selectedSize.label})</span>
                                  </div>
                                ))}
                                {ord.specialInstructions && (
                                  <p className="text-[10px] font-normal text-[#1A0D08]/80 italic pt-1 border-t border-[#2D1610]/10">
                                    "{ord.specialInstructions}"
                                  </p>
                                )}
                              </div>

                              {/* Price and Deposit */}
                              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2D1610]/10">
                                <div>
                                  <span className="font-heading font-black text-sm text-[#1A0D08]">
                                    ${ord.total.toFixed(2)}
                                  </span>
                                  <span className="block text-[10px] font-bold text-[#237A57]">
                                    Paid Dep: ${ord.depositAmount.toFixed(2)}
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1">
                                  {ord.status === 'Awaiting Confirmation' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                                      className="bakery-btn-yellow px-2 py-1 text-[10px] uppercase border border-[#2D1610]"
                                    >
                                      Start Frying →
                                    </button>
                                  )}

                                  {ord.status === 'Preparing' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Ready')}
                                      className="bg-[#3ED494] text-[#1A0D08] font-heading font-black px-2 py-1 text-[10px] uppercase rounded-lg border border-[#2D1610]"
                                    >
                                      Mark Ready →
                                    </button>
                                  )}

                                  {ord.status === 'Ready' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                                      className="bg-[#1A0D08] text-white font-heading font-black px-2 py-1 text-[10px] uppercase rounded-lg border border-[#2D1610]"
                                    >
                                      Completed ✓
                                    </button>
                                  )}

                                  {ord.status === 'Delivered' && (
                                    <span className="text-[10px] font-black text-[#237A57]">
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
              <div className="bg-white rounded-3xl border-[3.5px] border-[#2D1610] shadow-[6px_6px_0px_#2D1610] p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-[2.5px] border-[#2D1610] bg-[#FAF6EF] text-xs font-heading font-black uppercase text-[#1A0D08]">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Event Date</th>
                        <th className="py-3 px-3">Total / Deposit</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Advance Pipeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#2D1610]/10 text-xs font-medium text-[#1A0D08]">
                      {filteredOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-[#FAF6EF] transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-heading font-black text-sm text-[#E86236]">#{ord.id}</span>
                            <span className="block text-[10px] font-bold text-[#1A0D08]/60">{ord.orderType}</span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-sm text-[#1A0D08]">{ord.customerName}</p>
                            <p className="text-[11px] text-[#1A0D08]/80">{ord.customerPhone}</p>
                            {ord.deliveryAddress && (
                              <p className="text-[10px] text-[#1A0D08]/60 truncate max-w-[150px]">📍 {ord.deliveryAddress}</p>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-xs font-bold">
                                {it.quantity}x {it.productName} <span className="text-[10px] text-[#E86236]">({it.selectedSize.label})</span>
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-heading font-bold text-xs bg-[#FAF6EF] px-2 py-1 rounded-md border border-[#2D1610]">
                              📅 {ord.eventDate}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-heading font-black text-sm text-[#1A0D08]">${ord.total.toFixed(2)}</span>
                            <span className="block text-[10px] font-bold text-[#237A57]">Dep: ${ord.depositAmount.toFixed(2)}</span>
                            <span className="block text-[10px] font-bold text-[#E86236]">Due: ${ord.balanceDue.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block font-heading font-black text-[10px] px-2.5 py-1 rounded-xl border ${getStatusBadge(ord.status)}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {ord.status === 'Awaiting Confirmation' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                                className="bakery-btn-yellow px-2.5 py-1 text-[10px] uppercase border border-[#2D1610]"
                              >
                                Start Frying →
                              </button>
                            )}
                            {ord.status === 'Preparing' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Ready')}
                                className="bg-[#3ED494] text-[#1A0D08] font-heading font-black px-2.5 py-1 text-[10px] uppercase rounded-lg border border-[#2D1610]"
                              >
                                Mark Ready →
                              </button>
                            )}
                            {ord.status === 'Ready' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                                className="bg-[#1A0D08] text-white font-heading font-black px-2.5 py-1 text-[10px] uppercase rounded-lg border border-[#2D1610]"
                              >
                                Mark Delivered ✓
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
            <div className="bg-white rounded-3xl border-[3.5px] border-[#2D1610] shadow-[6px_6px_0px_#2D1610] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-black text-2xl text-[#1A0D08] uppercase flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-[#E86236]" />
                    Daily Kitchen Production & Prep Sheet
                  </h3>
                  <p className="text-xs text-[#1A0D08]/80 font-medium">
                    Aggregated pastry batch counts and cake bake schedules grouped by customer event dates.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bakery-btn-yellow px-4 py-2 text-xs uppercase border-2 border-[#2D1610] self-start sm:self-auto"
                >
                  🖨️ Print Kitchen Sheet
                </button>
              </div>

              {kitchenPrepByDate.length === 0 ? (
                <div className="text-center py-12 text-[#1A0D08]/60 font-bold">
                  No upcoming orders to prepare.
                </div>
              ) : (
                <div className="space-y-6">
                  {kitchenPrepByDate.map((group) => (
                    <div
                      key={group.date}
                      className="bg-[#FAF6EF] rounded-2xl border-[2.5px] border-[#2D1610] shadow-[4px_4px_0px_#2D1610] p-5"
                    >
                      <div className="flex items-center justify-between border-b-2 border-[#2D1610]/20 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#E86236]"></span>
                          <h4 className="font-heading font-black text-lg text-[#1A0D08] uppercase">
                            Event Date: {group.date}
                          </h4>
                          <span className="bg-[#F4BF28] text-[#1A0D08] text-xs font-heading font-black px-2 py-0.5 rounded-full border border-[#2D1610]">
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
            <div className="bg-white rounded-3xl border-[3.5px] border-[#2D1610] shadow-[6px_6px_0px_#2D1610] p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="font-heading font-black text-2xl text-[#1A0D08] uppercase flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#E86236]" />
                  Weekly Revenue & Sales Volume
                </h3>
                <p className="text-xs text-[#1A0D08]/80 font-medium">
                  Pastry production peaks on Fridays and Saturdays due to wedding dessert spreads and party platters.
                </p>
              </div>

              {/* Bar Chart */}
              <div className="h-64 sm:h-72 w-full pt-8 flex items-end justify-between gap-3 sm:gap-6 border-b-[3.5px] border-[#2D1610] px-2 sm:px-6">
                {WEEKLY_SALES_DATA.map((item) => {
                  const maxRevenue = 2000;
                  const heightPercent = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));

                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-[#1A0D08] text-white text-[10px] font-heading font-black px-2 py-1 rounded-md text-center shadow-[2px_2px_0px_#F4BF28] pointer-events-none">
                        ${item.revenue} ({item.orders} orders)
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[48px] bg-[#F4BF28] hover:bg-[#E86236] rounded-t-xl border-[2.5px] border-[#2D1610] shadow-[2.5px_0px_0px_#2D1610] transition-all relative"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-heading font-black text-[#1A0D08] whitespace-nowrap hidden sm:block">
                          ${item.revenue}
                        </span>
                      </div>

                      <span className="font-heading font-black text-xs text-[#1A0D08] mt-2">
                        {item.day}
                      </span>
                      <span className="text-[10px] text-[#1A0D08]/70 font-bold">
                        {item.orders} ord
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#1A0D08] bg-[#FAF6EF] p-4 rounded-2xl border-2 border-[#2D1610]">
                <div>
                  <span>Projected Weekly Total: </span>
                  <span className="font-heading font-black text-[#E86236] text-sm">
                    ${WEEKLY_SALES_DATA.reduce((s, i) => s + i.revenue, 0).toLocaleString()} USD
                  </span>
                </div>
                <div>
                  <span>Average Party Order: </span>
                  <span className="font-heading font-black text-[#237A57] text-sm">
                    ${Math.round(WEEKLY_SALES_DATA.reduce((s, i) => s + i.revenue, 0) / WEEKLY_SALES_DATA.reduce((s, i) => s + i.orders, 0))} USD
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

