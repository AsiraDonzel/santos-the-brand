import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Plus, Edit, Trash2, Calendar,
  TrendingUp, Lock, Unlock, Users, Package,
  Eye, ShoppingCart, Search, LogOut, X, Save, MapPin, Clock, ImageIcon, ListOrdered, UploadCloud, MonitorPlay, Ticket
} from 'lucide-react';
import { PRODUCTS, EVENT_ENTRIES, CATEGORIES, SHOWCASE_ITEMS, MOCK_ORDERS } from '../constants';
import PageTransition from '../components/PageTransition';
import { Product, EventEntry, GalleryImage, ShowcaseItem, Order, OrderItem, PromoCode } from '../types';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'events' | 'gallery' | 'orders' | 'showcase' | 'promocodes'>('overview');
  const [isSiteLocked, setIsSiteLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Local State for Interactivity
  const [products, setProducts] = useState(PRODUCTS);
  const [events, setEvents] = useState(EVENT_ENTRIES);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: '1', src: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80', title: 'Lookbook Spring', category: 'Lookbook', span: 'col-span-1', isActive: true, order: 1 },
    { id: '2', src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', title: 'Accessories', category: 'Product', span: 'col-span-2 row-span-2', isActive: true, order: 2 }
  ]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>(SHOWCASE_ITEMS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { id: '1', code: 'SANTOSVIP', discountPercentage: 20, isActive: true, usageCount: 42 },
    { id: '2', code: 'WELCOME10', discountPercentage: 10, isActive: true, usageCount: 128 },
    { id: '3', code: 'SUMMER26', discountPercentage: 15, isActive: false, usageCount: 5 }
  ]);

  // 2. Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [editingShowcaseItem, setEditingShowcaseItem] = useState<ShowcaseItem | null>(null);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);

  // 3. Form States
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '', title: '', price: 0, basePrice: 0, category: 'Dresses', image: '', images: [], hoverImage: '',
    description: '', hasVariations: false, variations: [], availableColors: [],
    availableSizes: [], stock: 0, attributes: { material: '', care: '', fit: '', length: '', occasion: '', season: '' },
    isActive: true, featured: false, trending: false, tags: [], sizes: ['S', 'M', 'L'], colors: ['Black'], isNew: true
  });

  const [eventFormData, setEventFormData] = useState<Partial<EventEntry>>({
    title: '', subtitle: '', category: 'Community', date: '', location: '', image: ''
  });

  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryImage>>({
    title: '', src: '', category: 'Uncategorized', location: '', description: '', span: 'col-span-1', isActive: true, order: 0, tags: []
  });

  const [showcaseFormData, setShowcaseFormData] = useState<Partial<ShowcaseItem>>({
    name: '', date: '', src: ''
  });

  const [promoCodeFormData, setPromoCodeFormData] = useState<Partial<PromoCode>>({
    code: '', discountPercentage: 0, isActive: true
  });

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '', title: '', price: 0, basePrice: 0, category: 'Dresses', image: '', images: [], hoverImage: '',
      description: '', hasVariations: false, variations: [], availableColors: [],
      availableSizes: [], stock: 0, attributes: { material: '', care: '', fit: '', length: '', occasion: '', season: '' },
      isActive: true, featured: false, trending: false, tags: [], sizes: ['S', 'M', 'L'], colors: ['Black'], isNew: true
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productFormData } as Product : p));
    } else {
      setProducts([{ ...productFormData, id: Date.now().toString(), hoverImage: productFormData.image || '' } as Product, ...products]);
    }
    setIsProductModalOpen(false);
  };

  // --- EVENT LOGIC ---
  const openAddEvent = () => {
    setEditingEvent(null);
    setEventFormData({ title: '', subtitle: '', category: 'Community', date: '', location: '', image: '' });
    setIsEventModalOpen(true);
  };

  const openEditEvent = (event: EventEntry) => {
    setEditingEvent(event);
    setEventFormData(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventFormData } as EventEntry : ev));
    } else {
      setEvents([{ ...eventFormData, id: Date.now().toString() } as EventEntry, ...events]);
    }
    setIsEventModalOpen(false);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm("Delete this product?")) setProducts(products.filter(p => p.id !== id));
  };

  const deleteEvent = (id: string) => {
    if (window.confirm("Delete this event?")) setEvents(events.filter(e => e.id !== id));
  };

  const deleteImage = (id: string) => {
    if (window.confirm("Delete this image?")) setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  const openAddGalleryImage = () => {
    setEditingGalleryImage(null);
    setGalleryFormData({
      title: '', src: '', category: 'Uncategorized', location: '', description: '', span: 'col-span-1', isActive: true, order: 0, tags: []
    });
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryImage = (img: GalleryImage) => {
    setEditingGalleryImage(img);
    setGalleryFormData(img);
    setIsGalleryModalOpen(true);
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();

    // Max 10 active check
    const activeCount = galleryImages.filter(img => img.isActive && img.id !== editingGalleryImage?.id).length;
    if (galleryFormData.isActive && activeCount >= 10) {
      alert("Maximum 10 active gallery images allowed. Please deactivate an existing image first.");
      return;
    }

    if (editingGalleryImage) {
      setGalleryImages(galleryImages.map(img => img.id === editingGalleryImage.id ? { ...img, ...galleryFormData } as GalleryImage : img));
    } else {
      setGalleryImages([{ ...galleryFormData, id: Date.now().toString() } as GalleryImage, ...galleryImages]);
    }
    setIsGalleryModalOpen(false);
  };

  // --- SHOWCASE LOGIC ---
  const openAddShowcase = () => {
    setEditingShowcaseItem(null);
    setShowcaseFormData({ name: '', date: '', src: '' });
    setIsShowcaseModalOpen(true);
  };

  const openEditShowcase = (item: ShowcaseItem) => {
    setEditingShowcaseItem(item);
    setShowcaseFormData(item);
    setIsShowcaseModalOpen(true);
  };

  const deleteShowcaseItem = (id: string) => {
    if (window.confirm("Delete this showcase item?")) setShowcaseItems(showcaseItems.filter(s => s.id !== id));
  };

  const handleSaveShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShowcaseItem) {
      setShowcaseItems(showcaseItems.map(s => s.id === editingShowcaseItem.id ? { ...s, ...showcaseFormData } as ShowcaseItem : s));
    } else {
      setShowcaseItems([{ ...showcaseFormData, id: Date.now().toString() } as ShowcaseItem, ...showcaseItems]);
    }
    setIsShowcaseModalOpen(false);
  };

  const toggleTrending = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, isNew: !p.isNew } : p));
  };

  // --- PROMO CODE LOGIC ---
  const openAddPromoCode = () => {
    setEditingPromoCode(null);
    setPromoCodeFormData({ code: '', discountPercentage: 10, isActive: true });
    setIsPromoCodeModalOpen(true);
  };

  const openEditPromoCode = (pc: PromoCode) => {
    setEditingPromoCode(pc);
    setPromoCodeFormData(pc);
    setIsPromoCodeModalOpen(true);
  };

  const deletePromoCode = (id: string) => {
    if (window.confirm("Delete this promo code?")) setPromoCodes(promoCodes.filter(p => p.id !== id));
  };

  const handleSavePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromoCode) {
      setPromoCodes(promoCodes.map(p => p.id === editingPromoCode.id ? { ...p, ...promoCodeFormData } as PromoCode : p));
    } else {
      setPromoCodes([{ ...promoCodeFormData, id: Date.now().toString(), usageCount: 0 } as PromoCode, ...promoCodes]);
    }
    setIsPromoCodeModalOpen(false);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setPromoCodeFormData({ ...promoCodeFormData, code });
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'Pending' | 'Completed' | 'Cancelled') => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status } as Order);
    }
  };

  const handleUpdateDeliveryStatus = (orderId: string, deliveryStatus: 'Pending' | 'Packaged' | 'Sent Out' | 'Delivered' | 'Received') => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, deliveryStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, deliveryStatus } as Order);
    }
  };

  const totalSalesFromOrders = orders.filter(o => o.status !== 'Cancelled').reduce((sum, order) => sum + order.total, 0);
  const paidOrdersCount = orders.filter(o => o.status === 'Completed').length;

  const stats = [
    { label: 'Total Sales', value: totalSalesFromOrders.toLocaleString(), change: '+12.4%', stroke: '#10b981', fill: '#10b981', hoverBg: 'bg-green-500', icon: ShoppingCart, data: [{ v: 400 }, { v: 300 }, { v: 500 }, { v: 280 }, { v: totalSalesFromOrders * 0.4 }, { v: 430 }, { v: totalSalesFromOrders * 0.8 }] },
    { label: 'Total Visitors', value: '1,237', change: '+20.4%', stroke: '#3b82f6', fill: '#3b82f6', hoverBg: 'bg-blue-500', icon: Users, data: [{ v: 200 }, { v: 300 }, { v: 250 }, { v: 400 }, { v: 380 }, { v: 520 }, { v: 480 }] },
    { label: 'Orders Paid', value: paidOrdersCount.toString(), change: '+5.4%', stroke: '#f97316', fill: '#f97316', hoverBg: 'bg-orange-500', icon: Package, data: [{ v: 300 }, { v: 200 }, { v: 400 }, { v: 500 }, { v: 400 }, { v: paidOrdersCount * 50 }, { v: paidOrdersCount * 100 }] },
    { label: 'Registered Users', value: '437', change: '+42.4%', stroke: '#94a3b8', fill: '#94a3b8', hoverBg: 'bg-slate-500', icon: Users, data: [{ v: 100 }, { v: 150 }, { v: 120 }, { v: 200 }, { v: 180 }, { v: 300 }, { v: 400 }] },
  ];

  const pieData = [
    { name: 'Women', value: 45, color: '#3b82f6' },
    { name: 'Accessories', value: 25, color: '#9333ea' },
    { name: 'Men', value: 15, color: '#10b981' },
    { name: 'Teens & Kids', value: 10, color: '#eab308' },
    { name: 'Babies', value: 5, color: '#f43f5e' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 pt-20 pb-32 lg:pb-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary-950 rounded-full flex items-center justify-center shadow-xl border border-primary-800 shrink-0">
                <span className="font-serif text-2xl lg:text-3xl text-white font-bold">S</span>
              </div>
              <div>
                <h1 className="font-serif text-2xl lg:text-4xl text-primary-950 leading-tight">Admin Console</h1>
                <p className="text-slate-500 font-light mt-1 text-[10px] lg:text-sm tracking-widest uppercase italic">Owner Workspace</p>
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <button onClick={() => setIsSiteLocked(!isSiteLocked)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 lg:px-6 rounded-sm font-bold text-[10px] lg:text-xs tracking-widest uppercase transition-all ${isSiteLocked ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-100'}`}>
                {isSiteLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {isSiteLocked ? 'Locked' : 'Lock Site'}
              </button>
              <button onClick={onLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 lg:px-6 bg-white border border-red-100 text-red-600 rounded-sm font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:bg-red-50 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="hidden lg:block lg:col-span-1 space-y-2">
              <NavBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 />} label="Dashboard" />
              <NavBtn active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package />} label="Inventory" />
              <NavBtn active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="Events" />
              <NavBtn active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon />} label="Gallery" />
              <NavBtn active={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')} icon={<MonitorPlay />} label="Showcase" />
              <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ListOrdered />} label="Orders" />
              <NavBtn active={activeTab === 'promocodes'} onClick={() => setActiveTab('promocodes')} icon={<Ticket />} label="Discounts" />
            </div>

            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Top Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {stats.map((stat, i) => (
                        <div key={i} className="bg-primary-950 p-4 lg:p-6 rounded-sm shadow-xl border border-primary-900 overflow-hidden relative group">
                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-4 text-white">
                              <div className={`p-3 rounded-full ${stat.hoverBg}`}><stat.icon className="w-5 h-5 text-white" /></div>
                              <div>
                                <p className="text-xs font-serif text-slate-300 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold font-serif">{stat.label.includes('Sales') || stat.label.includes('Paid') ? `₦${stat.value}` : stat.value}</h3>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              {stat.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />} {stat.change}
                            </span>
                          </div>

                          <div className="h-16 w-[110%] -ml-[5%] absolute bottom-0 left-0 right-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={stat.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                  <linearGradient id={`colorUv-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={stat.fill} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={stat.fill} stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="v" stroke={stat.stroke} strokeWidth={2} fillOpacity={1} fill={`url(#colorUv-${i})`} isAnimationActive={true} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                      {/* Sales by Category Pie Chart */}
                      <div className="bg-primary-950 p-6 rounded-sm border border-primary-900 lg:col-span-1 shadow-xl flex flex-col">
                        <h3 className="text-white font-serif text-lg mb-1">Sales by Category</h3>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-6 border-b border-primary-900 pb-4">Total Feb 21 2026</p>

                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-white text-3xl font-bold font-serif">₦125,000</h2>
                          <span className="text-green-400 text-xs font-bold">+12.4%</span>
                        </div>

                        <div className="flex-1 flex justify-center items-center min-h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value" stroke="none">
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '4px', fontSize: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-primary-900">
                          {pieData.map((d) => (
                            <div key={d.name} className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-slate-300 text-[10px] whitespace-nowrap">{d.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Low Stock Products */}
                      <div className="bg-primary-950 p-6 rounded-sm border border-primary-900 lg:col-span-2 shadow-xl flex flex-col">
                        <h3 className="text-orange-500 font-serif text-lg mb-6 pt-1">Low Stock Products</h3>

                        <div className="overflow-x-auto flex-1">
                          <table className="w-full text-left">
                            <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-primary-900">
                              <tr>
                                <th className="pb-4 pt-1 font-serif font-medium">PRODUCT</th>
                                <th className="pb-4 pt-1 font-serif font-medium">PRODUCT ID</th>
                                <th className="pb-4 pt-1 font-serif font-medium">CATEGORY</th>
                                <th className="pb-4 pt-1 font-serif font-medium">STOCK</th>
                                <th className="pb-4 pt-1 text-right font-serif font-medium">ACTION</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-900/50">
                              {products.filter(p => (p.stock || 0) < 10).slice(0, 5).map((product, idx) => (
                                <tr key={product.id} className="hover:bg-primary-900/40 transition-colors group">
                                  <td className="py-2.5 flex items-center gap-3">
                                    <img src={product.image || 'https://via.placeholder.com/150'} className="w-8 h-8 rounded-sm object-cover" alt="" />
                                    <span className="text-white text-xs font-bold font-serif whitespace-nowrap">{product.name.toUpperCase()}</span>
                                  </td>
                                  <td className="py-2.5 text-xs text-slate-300">#{product.id.slice(0, 5)}</td>
                                  <td className="py-2.5 text-xs text-slate-300">{product.category}</td>
                                  <td className="py-2.5">
                                    {product.stock === 0 ? (
                                      <span className="text-red-500 text-[10px] flex items-center gap-1"><X className="w-3 h-3" /> OUT OF STOCK</span>
                                    ) : (
                                      <span className="text-orange-400 text-xs">{product.stock} left</span>
                                    )}
                                  </td>
                                  <td className="py-2.5 text-right">
                                    <div className="flex justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => openEditProduct(product)} className="text-blue-500 hover:text-blue-400"><Eye className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => openEditProduct(product)} className="text-green-500 hover:text-green-400"><Edit className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {products.filter(p => (p.stock || 0) < 10).length === 0 && (
                            <div className="text-center py-12">
                              <p className="text-slate-400 font-serif">All products are well stocked.</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-primary-900 flex justify-between items-center">
                          <p className="text-slate-400 text-[10px] uppercase">Showing {Math.min(5, products.filter(p => (p.stock || 0) < 10).length)} of {products.filter(p => (p.stock || 0) < 10).length} entries</p>
                          <button className="text-slate-300 bg-primary-900/50 hover:bg-primary-900 px-3 py-1.5 rounded-full text-[10px] transition-colors">View All {'->'}</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'products' && (
                  <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 lg:space-y-0 bg-transparent lg:bg-white rounded-sm lg:border border-gray-100 shadow-sm">
                    <div className="p-4 lg:p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                      <div className="relative w-full md:w-72">
                        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none text-sm outline-none focus:ring-1 focus:ring-primary-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                      </div>
                      <button onClick={openAddProduct} className="w-full md:w-auto bg-primary-950 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-900 transition-colors">
                        <Plus className="w-4 h-4" /> Add Product
                      </button>
                    </div>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <tr><th className="px-6 py-4">Item</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <img src={product.image || 'https://via.placeholder.com/150'} className="w-10 h-12 object-cover rounded-sm" alt="" />
                                <div><p className="text-sm font-bold text-primary-950">{product.name}</p><p className="text-[10px] text-slate-400 uppercase">{product.category}</p></div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-600">${product.price}</td>
                              <td className="px-6 py-4"><button onClick={() => toggleTrending(product.id)} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${product.isNew ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-primary-300'}`}>{product.isNew ? 'Trending' : 'Set Trending'}</button></td>
                              <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEditProduct(product)} className="p-2 text-slate-400 hover:text-primary-600"><Edit className="w-4 h-4" /></button><button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'events' && (
                  <motion.div key="ev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex justify-end">
                      <button onClick={openAddEvent} className="w-full md:w-auto bg-primary-950 text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Create New Event</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map((event) => (
                        <div key={event.id} className="bg-white p-4 lg:p-6 border border-gray-100 flex gap-4 lg:gap-6 rounded-sm shadow-sm group">
                          <img src={event.image} className="w-20 h-20 lg:w-24 lg:h-24 object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-base lg:text-lg text-primary-950 mb-1 truncate">{event.title}</h4>
                            <p className="text-[10px] lg:text-xs text-slate-400 mb-4">{event.date} • {event.location}</p>
                            <div className="flex gap-4">
                              <button onClick={() => openEditEvent(event)} className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:underline">Edit</button>
                              <button onClick={() => deleteEvent(event.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div key="gal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
                      <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${galleryImages.filter(i => i.isActive).length >= 10 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {galleryImages.filter(i => i.isActive).length} / 10 Active
                      </div>
                      <button onClick={openAddGalleryImage} className="w-full md:w-auto bg-primary-950 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-900 transition-colors">
                        <Plus className="w-4 h-4" /> Add Image
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                      {galleryImages.sort((a, b) => (a.order || 0) - (b.order || 0)).map((img) => (
                        <div key={img.id} className={`bg-white border border-gray-100 rounded-sm shadow-sm relative group overflow-hidden ${img.span === 'col-span-2 row-span-2' ? 'col-span-2 lg:col-span-2 row-span-2' : img.span === 'col-span-2 row-span-1' ? 'col-span-2 lg:col-span-2' : img.span === 'col-span-1 row-span-2' ? 'col-span-1 lg:row-span-2' : 'col-span-1'} ${!img.isActive ? 'opacity-50 grayscale' : ''}`}>
                          <img src={img.src} className="w-full h-48 lg:h-full object-cover min-h-[192px]" alt={img.title} />
                          <div className="absolute inset-0 bg-primary-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                            <div>
                              <p className="text-white text-sm font-bold truncate">{img.title}</p>
                              <p className="text-slate-300 text-[10px] uppercase tracking-widest mt-1">{img.category}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => openEditGalleryImage(img)} className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm hover:bg-white hover:text-primary-950 transition-colors">Edit</button>
                              <button onClick={() => deleteImage(img.id)} className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm hover:bg-red-600 transition-colors">Delete</button>
                            </div>
                          </div>
                          {!img.isActive && (
                            <div className="absolute top-2 right-2 bg-slate-800 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-lg border border-slate-700">Inactive</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'showcase' && (
                  <motion.div key="showc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
                      <div className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border bg-slate-50 text-slate-500 border-slate-100">
                        {showcaseItems.length} Displayed Items
                      </div>
                      <button onClick={openAddShowcase} className="w-full md:w-auto bg-primary-950 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-900 transition-colors">
                        <Plus className="w-4 h-4" /> Add Showcase Item
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {showcaseItems.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-sm shadow-sm relative group overflow-hidden">
                          <img src={item.src} className="w-full aspect-[4/3] object-cover" alt={item.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <h4 className="text-white text-lg font-serif mb-1">{item.name}</h4>
                            <p className="text-primary-400 text-[10px] font-bold uppercase tracking-widest mb-4">{item.date}</p>
                            <div className="flex gap-3">
                              <button onClick={() => openEditShowcase(item)} className="flex-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-sm hover:bg-white hover:text-primary-950 transition-colors">Edit</button>
                              <button onClick={() => deleteShowcaseItem(item.id)} className="flex-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-sm hover:bg-red-600 transition-colors">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div key="ord" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 bg-transparent">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <h2 className="font-serif text-2xl text-primary-950">Pending Orders</h2>
                      <div className="relative w-full md:w-72">
                        <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-sm text-sm outline-none focus:ring-1 focus:ring-primary-500 transition-shadow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar-hide pb-4">
                      <table className="w-[800px] lg:w-full text-left border-separate border-spacing-y-3">
                        <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          <tr>
                            <th className="px-6 py-2">Product Info</th>
                            <th className="px-6 py-2">Customer</th>
                            <th className="px-6 py-2">Order ID</th>
                            <th className="px-6 py-2">Price</th>
                            <th className="px-6 py-2">Delivery</th>
                            <th className="px-6 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                            <tr key={order.id} onClick={() => openOrderDetails(order)} className="bg-primary-950 text-white rounded-sm group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                              <td className="px-6 py-4 rounded-l-sm">
                                {order.items.length > 0 && (
                                  <div className="flex items-center gap-3">
                                    <img src={order.items[0].image} alt={order.items[0].name} className="w-10 h-10 object-cover rounded-sm border border-primary-800" />
                                    <div className="max-w-[150px] lg:max-w-[200px]">
                                      <p className="text-xs font-bold text-white truncate">{order.items[0].name.toUpperCase()}</p>
                                      <p className="text-[10px] text-primary-400 mt-0.5">x{order.items.length} Items</p>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-xs font-medium text-white">{order.customer}</p>
                              </td>
                              <td className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-300">#{order.id}</td>
                              <td className="px-6 py-4 text-xs font-bold text-white">₦{order.total.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={order.deliveryStatus || 'Pending'}
                                  onChange={(e) => handleUpdateDeliveryStatus(order.id, e.target.value as any)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-transparent text-[10px] uppercase font-bold tracking-widest text-[#64748b] hover:text-white outline-none cursor-pointer appearance-none"
                                >
                                  <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                                  <option value="Packaged" className="bg-slate-900 text-white">Packaged</option>
                                  <option value="Sent Out" className="bg-slate-900 text-white">Sent Out</option>
                                  <option value="Delivered" className="bg-slate-900 text-green-400">Delivered</option>
                                  <option value="Received" className="bg-slate-900 text-white">Received</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 rounded-r-sm">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`bg-transparent text-[10px] uppercase font-bold tracking-widest outline-none cursor-pointer appearance-none ${order.status === 'Completed' ? 'text-blue-500' : order.status === 'Cancelled' ? 'text-red-500' : 'text-amber-500'}`}
                                >
                                  <option value="Pending" className="bg-slate-900 text-amber-500">Pending</option>
                                  <option value="Completed" className="bg-slate-900 text-blue-500">Completed</option>
                                  <option value="Cancelled" className="bg-slate-900 text-red-500">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'promocodes' && (
                  <motion.div key="promocodes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="font-serif text-2xl text-primary-950">Promo Codes</h2>
                      <button onClick={openAddPromoCode} className="bg-primary-950 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all rounded-sm"><Plus className="w-4 h-4" /> New Code</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {promoCodes.map((pc) => (
                        <div key={pc.id} className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm relative group hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xl font-bold font-serif text-primary-950 tracking-wider break-all">{pc.code}</p>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${pc.isActive ? 'text-green-500' : 'text-slate-400'}`}>{pc.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                            <span className="bg-primary-50 text-primary-900 text-xs font-bold px-2 py-1 rounded-sm">-{pc.discountPercentage}%</span>
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
                            Used: <span className="font-bold text-primary-900">{pc.usageCount || 0} times</span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditPromoCode(pc)} className="flex-1 bg-slate-50 text-slate-600 hover:bg-primary-50 hover:text-primary-600 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 rounded-sm"><Edit className="w-3 h-3" /> Edit</button>
                            <button onClick={() => deletePromoCode(pc.id)} className="flex-1 bg-slate-50 text-red-500 hover:bg-red-50 hover:text-red-600 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 rounded-sm"><Trash2 className="w-3 h-3" /> Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <Modal title={`Order Details: ${selectedOrder.id}`} onClose={() => setSelectedOrder(null)}>
            <div className="p-0 md:p-8 bg-slate-900 min-h-full">
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Column: Received Items & Cart Total */}
                <div className="flex-1 space-y-8">
                  <div className="bg-[#172439] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
                    <div className="px-6 py-4 border-b border-slate-700/50 bg-[#1e2d48]">
                      <h3 className="font-bold text-xs text-slate-300 uppercase tracking-widest">Purchased Items</h3>
                    </div>
                    <div className="divide-y divide-slate-700/50 max-h-[50vh] overflow-y-auto custom-scrollbar-hide">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="p-4 sm:p-6 flex items-start gap-6 hover:bg-slate-800/30 transition-colors">
                          <img src={item.image} alt={item.name} className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-md shadow-md border border-slate-700" />
                          <div className="flex-1 flex flex-col justify-between self-stretch">
                            <div>
                              <p className="text-sm font-bold text-white leading-tight mb-1">{item.name}</p>
                              {item.variation && <p className="text-xs text-slate-400">{item.variation}</p>}
                            </div>
                            <div className="flex justify-between items-end mt-4">
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Qty {item.quantity}</p>
                              <p className="text-sm font-bold text-white">₦{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#172439] rounded-xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Cart Total</h3>
                      <p className="font-bold text-xs text-slate-400 uppercase tracking-widest">Price</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-300">
                        <p>Subtotal:</p><p>₦{selectedOrder.subtotal.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between text-sm text-slate-300">
                        <p>Shipping:</p><p>₦{selectedOrder.shipping.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between text-base font-bold text-red-400 pt-4 mt-2 border-t border-slate-700/50">
                        <p>Total price:</p><p className="tracking-wide">₦{selectedOrder.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Fulfillment & Status */}
                <div className="lg:w-[400px] xl:w-[450px] shrink-0 space-y-8">
                  <div className="bg-[#172439] p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700/50 space-y-8">

                    <div>
                      <h3 className="font-bold text-sm text-white mb-2">Shipping Address</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{selectedOrder.shippingAddress}</p>
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-sm text-white font-medium">{selectedOrder.customer}</p>
                        <p className="text-xs text-slate-400 mt-1">{selectedOrder.email}</p>
                        {selectedOrder.phone && <p className="text-xs text-slate-400 mt-1">{selectedOrder.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white mb-2">Payment Method</h3>
                      <p className="text-sm text-slate-400 font-light">Method: Paystack</p>
                    </div>

                    <div className="pt-6 border-t border-slate-700/50">
                      <h3 className="font-bold text-sm text-white mb-2">Expected Date Of Delivery</h3>
                      <p className="text-sm font-bold text-green-400 mb-6">{selectedOrder.date}</p>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Delivery Status</label>
                          <select
                            value={selectedOrder.deliveryStatus || 'Pending'}
                            onChange={(e) => handleUpdateDeliveryStatus(selectedOrder.id, e.target.value as any)}
                            className="w-full mt-2 bg-slate-800/50 border border-slate-700 text-slate-300 text-sm px-4 py-3 rounded-md outline-none focus:border-blue-500 transition-colors cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Packaged">Packaged</option>
                            <option value="Sent Out">Sent Out</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Received">Received</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Status</label>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as any)}
                            className="w-full mt-2 bg-slate-800/50 border border-slate-700 text-slate-300 text-sm px-4 py-3 rounded-md outline-none focus:border-blue-500 transition-colors cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <button onClick={() => setSelectedOrder(null)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-4 rounded-md transition-colors shadow-lg shadow-blue-900/20 mt-4">
                          Update Status
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* --- PRODUCT MODAL --- */}
      <AnimatePresence>
        {isProductModalOpen && (
          <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setIsProductModalOpen(false)}>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6">

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">Basic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Product Title" value={productFormData.title || productFormData.name} onChange={(v: string) => setProductFormData({ ...productFormData, title: v, name: v })} required />
                  <FormInput label="Base Price (USD)" type="number" value={productFormData.basePrice || productFormData.price} onChange={(v: string) => setProductFormData({ ...productFormData, basePrice: Number(v), price: Number(v) })} required />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                    <select className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent" value={productFormData.category} onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}>
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <FormInput label="Global Stock" type="number" value={productFormData.stock || 0} onChange={(v: string) => setProductFormData({ ...productFormData, stock: Number(v) })} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadZone label="Primary Image" value={productFormData.image || (productFormData.images && productFormData.images[0]) || ''} onChange={(v: string) => setProductFormData({ ...productFormData, image: v, images: [v, ...(productFormData.images?.slice(1) || [])] })} />
                  <ImageUploadZone label="Hover Image (Optional)" value={productFormData.hoverImage || ''} onChange={(v: string) => setProductFormData({ ...productFormData, hoverImage: v })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea rows={3} className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50" value={productFormData.description} onChange={e => setProductFormData({ ...productFormData, description: e.target.value })} />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">Attributes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <FormInput label="Material" value={productFormData.attributes?.material || ''} onChange={(v: string) => setProductFormData({ ...productFormData, attributes: { ...productFormData.attributes, material: v } })} />
                  <FormInput label="Care" value={productFormData.attributes?.care || ''} onChange={(v: string) => setProductFormData({ ...productFormData, attributes: { ...productFormData.attributes, care: v } })} />
                  <FormInput label="Fit" value={productFormData.attributes?.fit || ''} onChange={(v: string) => setProductFormData({ ...productFormData, attributes: { ...productFormData.attributes, fit: v } })} />
                  <FormInput label="Length" value={productFormData.attributes?.length || ''} onChange={(v: string) => setProductFormData({ ...productFormData, attributes: { ...productFormData.attributes, length: v } })} />
                  <FormInput label="Occasion" value={productFormData.attributes?.occasion || ''} onChange={(v: string) => setProductFormData({ ...productFormData, attributes: { ...productFormData.attributes, occasion: v } })} />
                  <FormInput label="Season" value={productFormData.attributes?.season || ''} onChange={(v: string) => setProductFormData({ ...productFormData, attributes: { ...productFormData.attributes, season: v } })} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-primary-950 uppercase tracking-widest border-b pb-2">Status & Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="isActive" checked={productFormData.isActive !== false} onChange={e => setProductFormData({ ...productFormData, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                    <label htmlFor="isActive" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Active Catalog Item</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="featured" checked={productFormData.featured || false} onChange={e => setProductFormData({ ...productFormData, featured: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                    <label htmlFor="featured" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Featured (Homepage)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="trending" checked={productFormData.trending || productFormData.isNew || false} onChange={e => setProductFormData({ ...productFormData, trending: e.target.checked, isNew: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                    <label htmlFor="trending" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Trending Now</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="hasVariations" checked={productFormData.hasVariations || false} onChange={e => setProductFormData({ ...productFormData, hasVariations: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                    <label htmlFor="hasVariations" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Has Variations</label>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Tags (comma separated)" placeholder="e.g. spring, new arrival, silk" value={productFormData.tags?.join(', ') || ''} onChange={(v: string) => setProductFormData({ ...productFormData, tags: v.split(',').map(s => s.trim()) })} />
                  <FormInput label="Colors (comma separated)" placeholder="e.g. Black, Red, Blue" value={productFormData.colors?.join(', ') || ''} onChange={(v: string) => setProductFormData({ ...productFormData, colors: v.split(',').map(s => s.trim()) })} />
                </div>

                {productFormData.hasVariations && (
                  <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 mt-4">
                    <p className="text-xs text-slate-500 italic mb-2">Variation builder is active. Add specific color/size variations in the extended builder.</p>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all mt-8"><Save className="w-4 h-4" /> Save Product</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* --- EVENT MODAL --- */}
      <AnimatePresence>
        {isEventModalOpen && (
          <Modal title={editingEvent ? 'Edit Event' : 'Create New Event'} onClose={() => setIsEventModalOpen(false)}>
            <form onSubmit={handleSaveEvent} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Event Title" value={eventFormData.title} onChange={v => setEventFormData({ ...eventFormData, title: v })} required />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                  <select className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent" value={eventFormData.category} onChange={e => setEventFormData({ ...eventFormData, category: e.target.value })}>
                    <option value="Community">Community</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <FormInput label="Date (e.g. Dec 2025)" value={eventFormData.date} onChange={v => setEventFormData({ ...eventFormData, date: v })} icon={<Clock size={14} />} required />
                <FormInput label="Location" value={eventFormData.location} onChange={(v: string) => setEventFormData({ ...eventFormData, location: v })} icon={<MapPin size={14} />} required />
              </div>
              <ImageUploadZone label="Event Cover Image" value={eventFormData.image} onChange={(v: string) => setEventFormData({ ...eventFormData, image: v })} />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtitle / Description</label>
                <textarea rows={3} className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50" value={eventFormData.subtitle} onChange={e => setEventFormData({ ...eventFormData, subtitle: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"><Save className="w-4 h-4" /> Save Event</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGalleryModalOpen && (
          <Modal title={editingGalleryImage ? "Edit Gallery Image" : "Add Gallery Image"} onClose={() => setIsGalleryModalOpen(false)}>
            <form onSubmit={handleSaveImage} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Image Title" value={galleryFormData.title || ''} onChange={(v: string) => setGalleryFormData({ ...galleryFormData, title: v })} required />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                  <input type="text" className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent" value={galleryFormData.category || ''} onChange={e => setGalleryFormData({ ...galleryFormData, category: e.target.value })} placeholder="e.g. Lookbook, New Arrivals" />
                </div>
                <FormInput label="Location (Optional)" value={galleryFormData.location || ''} onChange={(v: string) => setGalleryFormData({ ...galleryFormData, location: v })} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Grid Span Setup</label>
                  <select className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent" value={galleryFormData.span || 'col-span-1'} onChange={e => setGalleryFormData({ ...galleryFormData, span: e.target.value as any })}>
                    <option value="col-span-1">1x1 (Standard Block)</option>
                    <option value="col-span-2 row-span-1">2x1 (Wide Horizontal)</option>
                    <option value="col-span-1 row-span-2">1x2 (Tall Vertical)</option>
                    <option value="col-span-2 row-span-2">2x2 (Large Hero Block)</option>
                  </select>
                </div>
              </div>

              <ImageUploadZone label="Upload High-Res Component Image" value={galleryFormData.src || ''} onChange={(v: string) => setGalleryFormData({ ...galleryFormData, src: v })} />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea rows={2} className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50" value={galleryFormData.description || ''} onChange={e => setGalleryFormData({ ...galleryFormData, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Display Order (Priority)" type="number" value={galleryFormData.order || 0} onChange={(v: string) => setGalleryFormData({ ...galleryFormData, order: Number(v) })} />
                <FormInput label="Tags (comma separated)" placeholder="e.g. fashion, summer" value={galleryFormData.tags?.join(', ') || ''} onChange={(v: string) => setGalleryFormData({ ...galleryFormData, tags: v.split(',').map(s => s.trim()) })} />
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-slate-100 pt-6">
                <input type="checkbox" id="galleryActive" checked={galleryFormData.isActive !== false} onChange={e => setGalleryFormData({ ...galleryFormData, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="galleryActive" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Active in Dashboard (Max 10 Limit)</label>
              </div>

              <button type="submit" className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all mt-4"><Save className="w-4 h-4" /> Save Gallery Setup</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShowcaseModalOpen && (
          <Modal title={editingShowcaseItem ? "Edit Showcase Item" : "Add Showcase Item"} onClose={() => setIsShowcaseModalOpen(false)}>
            <form onSubmit={handleSaveShowcase} className="p-8 space-y-8 max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <FormInput label="Showcase Item Name" value={showcaseFormData.name || ''} onChange={(v: string) => setShowcaseFormData({ ...showcaseFormData, name: v })} placeholder="e.g. Opening Event" required />
                  <FormInput label="Date Display" value={showcaseFormData.date || ''} onChange={(v: string) => setShowcaseFormData({ ...showcaseFormData, date: v })} placeholder="e.g. Dec 2025" icon={<Clock size={14} />} required />
                </div>
                <div className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                  <ImageUploadZone label="Upload Horizontal Filmstrip File" value={showcaseFormData.src || ''} onChange={(v: string) => setShowcaseFormData({ ...showcaseFormData, src: v })} />
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button type="submit" className="w-full bg-primary-950 text-white py-5 text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all rounded-sm"><Save className="w-5 h-5" /> Save Showcase Configuration</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPromoCodeModalOpen && (
          <Modal title={editingPromoCode ? "Edit Promo Code" : "Create Promo Code"} onClose={() => setIsPromoCodeModalOpen(false)}>
            <form onSubmit={handleSavePromoCode} className="p-8 space-y-8 max-w-2xl mx-auto h-full flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <FormInput label="Discount Code" value={promoCodeFormData.code || ''} onChange={(v: string) => setPromoCodeFormData({ ...promoCodeFormData, code: v.toUpperCase() })} placeholder="e.g. SUMMER26" icon={<Ticket size={14} />} required />
                  <button type="button" onClick={generateRandomCode} className="text-[10px] text-primary-600 hover:text-primary-800 font-bold uppercase tracking-widest mt-2 block">Generate Random Code</button>
                </div>
                <FormInput label="Discount Percentage (%)" type="number" value={promoCodeFormData.discountPercentage || 0} onChange={(v: string) => setPromoCodeFormData({ ...promoCodeFormData, discountPercentage: Number(v) })} placeholder="e.g. 20" required />
                <div className="flex items-center gap-3 py-2 border-t border-slate-100 pt-6">
                  <input type="checkbox" id="promoActive" checked={promoCodeFormData.isActive !== false} onChange={e => setPromoCodeFormData({ ...promoCodeFormData, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                  <label htmlFor="promoActive" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Code is Active</label>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button type="submit" className="w-full bg-primary-950 text-white py-5 text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all rounded-sm"><Save className="w-5 h-5" /> Save Promo Code</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center z-[70] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto gap-4 custom-scrollbar-hide">
        <MobileNavIcon active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 />} label="Dashboard" />
        <MobileNavIcon active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package />} label="Inventory" />
        <MobileNavIcon active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="Events" />
        <MobileNavIcon active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon />} label="Gallery" />
        <MobileNavIcon active={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')} icon={<MonitorPlay />} label="Showcase" />
        <MobileNavIcon active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ListOrdered />} label="Orders" />
        <MobileNavIcon active={activeTab === 'promocodes'} onClick={() => setActiveTab('promocodes')} icon={<Ticket />} label="Discounts" />
      </div>
    </PageTransition >
  );
};

// --- Helper UI Components ---
const ImageUploadZone = ({ label, value, onChange }: any) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-sm transition-colors cursor-pointer ${isDragging ? 'border-primary-600 bg-primary-50' : 'border-slate-300 hover:border-primary-400 bg-slate-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
      >
        <div className="space-y-1 text-center flex flex-col items-center">
          {value ? (
            <div className="relative group">
              <img src={value} alt="Preview" className="h-24 w-auto object-contain rounded-sm" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change</p>
              </div>
            </div>
          ) : (
            <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
          )}
          <div className="flex text-sm text-slate-600 mt-2">
            <label htmlFor={`file-upload-${label}`} className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs font-bold uppercase tracking-widest">{value ? 'Change Image' : 'Upload a file'}</span>
              <input id={`file-upload-${label}`} name={`file-upload-${label}`} type="file" className="sr-only" accept="image/*" onChange={handleChange} />
            </label>
            {!value && <p className="pl-1 text-xs text-slate-500">or drag and drop</p>}
          </div>
          {!value && <p className="text-[10px] text-slate-500 uppercase tracking-widest">PNG, JPG, GIF up to 10MB</p>}
        </div>
      </div>
    </div>
  );
};

const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary-950/80 backdrop-blur-md" onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white w-full h-full md:w-[95vw] md:h-[95vh] rounded-none md:rounded-lg shadow-2xl flex flex-col overflow-hidden">
      <div className="p-6 md:px-10 md:py-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <h2 className="font-serif text-3xl text-primary-950">{title}</h2>
        <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 group">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary-900 absolute opacity-0 -translate-x-4 group-hover:-translate-x-12 group-hover:opacity-100 transition-all pointer-events-none">Close</span>
          <X className="w-6 h-6 text-slate-400 group-hover:text-primary-900 transition-colors" />
        </button>
      </div>
      <div className="overflow-y-auto w-full h-full bg-white relative pb-10">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </div>
    </motion.div>
  </div>
);

const FormInput = ({ label, value, onChange, type = "text", required = false, placeholder = "", icon }: any) => (
  <div className="space-y-1 relative">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
      {icon} {label}
    </label>
    <input required={required} type={type} placeholder={placeholder} className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 transition-colors text-sm" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all ${active ? 'bg-primary-950 text-white shadow-xl shadow-primary-950/20' : 'text-slate-400 hover:text-primary-600 hover:bg-white'}`}>
    {React.cloneElement(icon, { size: 18 })} {label}
  </button>
);

const MobileNavIcon = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary-600' : 'text-slate-400'}`}>
    {React.cloneElement(icon, { size: 20 })}
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default AdminPage;