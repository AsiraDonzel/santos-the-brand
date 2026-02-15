import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Plus, Edit, Trash2, Calendar, 
  TrendingUp, Lock, Unlock, Users, Package, 
  Eye, ShoppingCart, Search, LogOut, X, Save, MapPin, Clock
} from 'lucide-react';
import { PRODUCTS, EVENT_ENTRIES, CATEGORIES } from '../constants';
import PageTransition from '../components/PageTransition';
import { Product, EventEntry } from '../types';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'events'>('overview');
  const [isSiteLocked, setIsSiteLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Local State for Interactivity
  const [products, setProducts] = useState(PRODUCTS);
  const [events, setEvents] = useState(EVENT_ENTRIES);

  // 2. Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);

  // 3. Form States
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '', price: 0, category: 'Dresses', image: '', sizes: ['S', 'M', 'L'], colors: ['Black'], description: '', isNew: true
  });

  const [eventFormData, setEventFormData] = useState<Partial<EventEntry>>({
    title: '', subtitle: '', category: 'Community', date: '', location: '', image: ''
  });

  // --- PRODUCT LOGIC ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({ name: '', price: 0, category: 'Dresses', image: '', sizes: ['S', 'M', 'L'], colors: ['Black'], description: '', isNew: true });
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
              <NavBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 />} label="Metrics" />
              <NavBtn active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package />} label="Inventory" />
              <NavBtn active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="Events" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Product Name" value={productFormData.name} onChange={v => setProductFormData({...productFormData, name: v})} required />
                <FormInput label="Price (USD)" type="number" value={productFormData.price} onChange={v => setProductFormData({...productFormData, price: Number(v)})} required />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                  <select className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent" value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value})}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <FormInput label="Image URL" value={productFormData.image} onChange={v => setProductFormData({...productFormData, image: v})} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                <textarea rows={3} className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50" value={productFormData.description} onChange={e => setProductFormData({...productFormData, description: e.target.value})} />
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="trending" checked={productFormData.isNew} onChange={e => setProductFormData({...productFormData, isNew: e.target.checked})} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="trending" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Feature as "Trending Now"</label>
              </div>
              <button type="submit" className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"><Save className="w-4 h-4" /> Save Product</button>
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
                <FormInput label="Event Title" value={eventFormData.title} onChange={v => setEventFormData({...eventFormData, title: v})} required />
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                   <select className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-primary-500 text-sm bg-transparent" value={eventFormData.category} onChange={e => setEventFormData({...eventFormData, category: e.target.value})}>
                     <option value="Community">Community</option>
                     <option value="Fashion">Fashion</option>
                     <option value="Workshop">Workshop</option>
                   </select>
                </div>
                <FormInput label="Date (e.g. Dec 2025)" value={eventFormData.date} onChange={v => setEventFormData({...eventFormData, date: v})} icon={<Clock size={14}/>} required />
                <FormInput label="Location" value={eventFormData.location} onChange={v => setEventFormData({...eventFormData, location: v})} icon={<MapPin size={14}/>} required />
              </div>
              <FormInput label="Image URL" value={eventFormData.image} onChange={v => setEventFormData({...eventFormData, image: v})} placeholder="https://..." />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtitle / Description</label>
                <textarea rows={3} className="w-full border border-slate-100 p-3 outline-none focus:border-primary-500 text-sm resize-none rounded-sm bg-slate-50" value={eventFormData.subtitle} onChange={e => setEventFormData({...eventFormData, subtitle: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-primary-950 text-white py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"><Save className="w-4 h-4" /> Save Event</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[70] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <MobileNavIcon active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 />} label="Metrics" />
        <MobileNavIcon active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package />} label="Inventory" />
        <MobileNavIcon active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar />} label="Events" />
      </div>
    </PageTransition>
  );
};

// --- Helper UI Components ---
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