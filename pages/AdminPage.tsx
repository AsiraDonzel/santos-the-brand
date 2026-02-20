import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Plus, Edit, Trash2, Calendar,
  TrendingUp, Lock, Unlock, Users, Package,
  Eye, ShoppingCart, Search, LogOut, X, Save, MapPin, Clock, ImageIcon, ListOrdered, UploadCloud
} from 'lucide-react';
import { PRODUCTS, EVENT_ENTRIES, CATEGORIES } from '../constants';
import PageTransition from '../components/PageTransition';
import { Product, EventEntry, GalleryImage } from '../types';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'events' | 'gallery' | 'orders'>('overview');
  const [isSiteLocked, setIsSiteLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Local State for Interactivity
  const [products, setProducts] = useState(PRODUCTS);
  const [events, setEvents] = useState(EVENT_ENTRIES);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: '1', src: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80', title: 'Lookbook Spring', category: 'Lookbook', span: 'col-span-1', isActive: true, order: 1 },
    { id: '2', src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', title: 'Accessories', category: 'Product', span: 'col-span-2 row-span-2', isActive: true, order: 2 }
  ]);
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Alice Doe', email: 'alice@example.com', total: 4500, status: 'Processing', date: '2026-02-20' },
    { id: 'ORD-002', customer: 'Bob Smith', email: 'bob@example.com', total: 1250, status: 'Completed', date: '2026-02-19' }
  ]);

  // 2. Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);

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

  const toggleTrending = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, isNew: !p.isNew } : p));
  };

  const stats = [
    { label: 'Active Users', value: '1,284', icon: Users, change: '+12%' },
    { label: 'Total Orders', value: '452', icon: ShoppingCart, change: '+5%' },
    { label: 'Page Views', value: '12.5k', icon: Eye, change: '+18%' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, change: '-2%' },
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
              <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ListOrdered />} label="Orders" />
            </div>

            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-4 lg:p-6 rounded-sm border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary-50 rounded-sm text-primary-600"><stat.icon className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                            <span className={`text-[9px] lg:text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                          </div>
                          <p className="text-[9px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-xl lg:text-2xl font-serif text-primary-950">{stat.value}</h3>
                        </div>
                      ))}
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

                {activeTab === 'orders' && (
                  <motion.div key="ord" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 lg:space-y-0 bg-transparent lg:bg-white rounded-sm lg:border border-gray-100 shadow-sm">
                    <div className="p-4 lg:p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                      <div className="relative w-full md:w-72">
                        <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none text-sm outline-none focus:ring-1 focus:ring-primary-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                    <div className="overflow-x-auto bg-white lg:bg-transparent rounded-sm shadow-sm lg:shadow-none">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <tr><th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 text-xs font-bold text-primary-950">{order.id}</td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-primary-950">{order.customer}</p>
                                <p className="text-[10px] text-slate-400">{order.email}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-600">${order.total}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500">{order.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

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

                <div className="pt-2">
                  <FormInput label="Tags (comma separated)" placeholder="e.g. spring, new arrival, silk" value={productFormData.tags?.join(', ') || ''} onChange={(v: string) => setProductFormData({ ...productFormData, tags: v.split(',').map(s => s.trim()) })} />
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

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center z-[70] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto gap-4 custom-scrollbar-hide">
        <MobileNavIcon active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 />} label="Dashboard" />
        <MobileNavIcon active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package />} label="Inventory" />
        <MobileNavIcon active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="Events" />
        <MobileNavIcon active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon />} label="Gallery" />
        <MobileNavIcon active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ListOrdered />} label="Orders" />
      </div>
    </PageTransition>
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
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="font-serif text-2xl text-primary-950">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
      </div>
      <div className="overflow-y-auto">{children}</div>
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