import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Lock,
  Unlock,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  ImageIcon,
  ListOrdered,
  MonitorPlay,
  Ticket,
} from "lucide-react";
import {
  PRODUCTS,
  EVENT_ENTRIES,
  SHOWCASE_ITEMS,
  MOCK_ORDERS,
} from "../constants";
import PageTransition from "../components/PageTransition";
import {
  Product,
  EventEntry,
  GalleryImage,
  ShowcaseItem,
  Order,
  PromoCode,
} from "../types";

// Admin UI primitives
import { NavBtn, MobileNavIcon } from "../components/admin/NavBtn";

// Tab panels
import OverviewPanel from "../components/admin/panels/OverviewPanel";
import ProductsPanel from "../components/admin/panels/ProductsPanel";
import EventsPanel from "../components/admin/panels/EventsPanel";
import GalleryPanel from "../components/admin/panels/GalleryPanel";
import ShowcasePanel from "../components/admin/panels/ShowcasePanel";
import OrdersPanel from "../components/admin/panels/OrdersPanel";
import PromoCodesPanel from "../components/admin/panels/PromoCodesPanel";

// Modal forms
import OrderDetailModal from "../components/admin/modals/OrderDetailModal";
import ProductModal from "../components/admin/modals/ProductModal";
import EventModal from "../components/admin/modals/EventModal";
import GalleryModal from "../components/admin/modals/GalleryModal";
import ShowcaseModal from "../components/admin/modals/ShowcaseModal";
import PromoCodeModal from "../components/admin/modals/PromoCodeModal";
import { useGallery, useWebsiteStatus } from "@/hooks/storeHooks";
import { toggleLockWebsite } from "@/hooks/adminHooks";

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const status = useWebsiteStatus();
  const websiteStatus = status.data?.isLocked;
  const toggleLock = toggleLockWebsite();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "products"
    | "events"
    | "gallery"
    | "orders"
    | "showcase"
    | "promocodes"
  >("overview");
  const [isSiteLocked, setIsSiteLocked] = useState(websiteStatus);
  

  const [searchQuery, setSearchQuery] = useState("");

  // 1. Local State for Interactivity
  const [products, setProducts] = useState(PRODUCTS);

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // 2. Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] =
    useState<GalleryImage | null>(null);
  const [editingShowcaseItem, setEditingShowcaseItem] =
    useState<ShowcaseItem | null>(null);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(
    null,
  );

  // 3. Form States
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: "",
    title: "",
    price: 0,
    basePrice: 0,
    category: "Dresses",
    image: "",
    images: [],
    hoverImage: "",
    description: "",
    hasVariations: false,
    variations: [],
    availableColors: [],
    availableSizes: [],
    stock: 0,
    attributes: {
      material: "",
      care: "",
      fit: "",
      length: "",
      occasion: "",
      season: "",
    },
    isActive: true,
    featured: false,
    trending: false,
    tags: [],
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    isNew: true,
  });

  const [eventFormData, setEventFormData] = useState<Partial<EventEntry>>({
    title: "",
    content: "",
    category: "Community",
    date: "",
    location: "",
    image: "",
  });

  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryImage>>(
    {
      title: "",
      src: "",
      category: "Uncategorized",
      location: "",
      description: "",
      span: "col-span-1",
      isActive: true,
      order: 0,
      tags: [],
    },
  );

  const [showcaseFormData, setShowcaseFormData] = useState<
    Partial<ShowcaseItem>
  >({
    title: "",
    date: "",
    src: "",
  });

  const [promoCodeFormData, setPromoCodeFormData] = useState<
    Partial<PromoCode>
  >({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    isActive: true,
  });

  // --- HANDLER FUNCTIONS ---

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: "",
      title: "",
      price: 0,
      basePrice: 0,
      category: "Dresses",
      image: "",
      images: [],
      hoverImage: "",
      description: "",
      hasVariations: false,
      variations: [],
      availableColors: [],
      availableSizes: [],
      stock: 0,
      attributes: {
        material: "",
        care: "",
        fit: "",
        length: "",
        occasion: "",
        season: "",
      },
      isActive: true,
      featured: false,
      trending: false,
      tags: [],
      sizes: ["S", "M", "L"],
      colors: ["Black"],
      isNew: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData(product);
    setIsProductModalOpen(true);
  };

  const openAddGalleryImage = () => {
    setEditingGalleryImage(null);
    setGalleryFormData({
      title: "",
      src: "",
      category: "Uncategorized",
      location: "",
      description: "",
      span: "col-span-1",
      isActive: true,
      order: 0,
      tags: [],
    });
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryImage = (img: GalleryImage) => {
    setEditingGalleryImage(img);
    setGalleryFormData(img);
    setIsGalleryModalOpen(true);
  };

  // --- SHOWCASE LOGIC ---
  const openAddShowcase = () => {
    setEditingShowcaseItem(null);
    setShowcaseFormData({ title: "", date: "", src: "" });
    setIsShowcaseModalOpen(true);
  };

  const openEditShowcase = (item: ShowcaseItem) => {
    setEditingShowcaseItem(item);
    setShowcaseFormData(item);
    setIsShowcaseModalOpen(true);
  };

  // --- EVENT LOGIC ---
  const openAddEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      content: "",
      category: "Community",
      date: "",
      location: "",
      image: "",
    });
    setIsEventModalOpen(true);
  };

  const openEditEvent = (event: EventEntry) => {
    setEditingEvent(event);
    setEventFormData(event);
    setIsEventModalOpen(true);
  };

  // --- PROMO CODE LOGIC ---
  const openAddPromoCode = () => {
    setEditingPromoCode(null);
    setPromoCodeFormData({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
    });
    setIsPromoCodeModalOpen(true);
  };

  const openEditPromoCode = (pc: PromoCode) => {
    setEditingPromoCode(pc);
    setPromoCodeFormData(pc);
    setIsPromoCodeModalOpen(true);
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++)
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    setPromoCodeFormData({ ...promoCodeFormData, code });
  };

  // --- COMPUTED DATA ---
  const totalSalesFromOrders = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const paidOrdersCount = orders.filter((o) => o.status === "Completed").length;

  const stats = [
    {
      label: "Total Sales",
      value: totalSalesFromOrders.toLocaleString(),
      change: "+12.4%",
      stroke: "#10b981",
      fill: "#10b981",
      hoverBg: "bg-green-500",
      icon: ShoppingCart,
      data: [
        { v: 400 },
        { v: 300 },
        { v: 500 },
        { v: 280 },
        { v: totalSalesFromOrders * 0.4 },
        { v: 430 },
        { v: totalSalesFromOrders * 0.8 },
      ],
    },
    {
      label: "Total Visitors",
      value: "1,237",
      change: "+20.4%",
      stroke: "#3b82f6",
      fill: "#3b82f6",
      hoverBg: "bg-blue-500",
      icon: Users,
      data: [
        { v: 200 },
        { v: 300 },
        { v: 250 },
        { v: 400 },
        { v: 380 },
        { v: 520 },
        { v: 480 },
      ],
    },
    {
      label: "Orders Paid",
      value: paidOrdersCount.toString(),
      change: "+5.4%",
      stroke: "#f97316",
      fill: "#f97316",
      hoverBg: "bg-orange-500",
      icon: Package,
      data: [
        { v: 300 },
        { v: 200 },
        { v: 400 },
        { v: 500 },
        { v: 400 },
        { v: paidOrdersCount * 50 },
        { v: paidOrdersCount * 100 },
      ],
    },
    {
      label: "Registered Users",
      value: "437",
      change: "+42.4%",
      stroke: "#94a3b8",
      fill: "#94a3b8",
      hoverBg: "bg-slate-500",
      icon: Users,
      data: [
        { v: 100 },
        { v: 150 },
        { v: 120 },
        { v: 200 },
        { v: 180 },
        { v: 300 },
        { v: 400 },
      ],
    },
  ];

  const pieData = [
    { name: "Women", value: 45, color: "#3b82f6" },
    { name: "Accessories", value: 25, color: "#9333ea" },
    { name: "Men", value: 15, color: "#10b981" },
    { name: "Teens & Kids", value: 10, color: "#eab308" },
    { name: "Babies", value: 5, color: "#f43f5e" },
  ];

  // --- RENDER ---
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 pt-20 pb-32 lg:pb-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary-950 rounded-full flex items-center justify-center shadow-xl border border-primary-800 shrink-0">
                <span className="font-serif text-2xl lg:text-3xl text-white font-bold">
                  S
                </span>
              </div>
              <div>
                <h1 className="font-serif text-2xl lg:text-4xl text-primary-950 leading-tight">
                  Admin Console
                </h1>
                <p className="text-slate-500 font-light mt-1 text-[10px] lg:text-sm tracking-widest uppercase italic">
                  Owner Workspace
                </p>
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <button
                onClick={async () => {
                  const action = websiteStatus ? "unlock" : "lock";
                  if (
                    !window.confirm(
                      `Are you sure you want to ${action} the website?`,
                    )
                  )
                    return;
                  try {
                    await toggleLock.mutateAsync({
                      lockData: { isLocked: !websiteStatus },
                    });
                    setIsSiteLocked(!websiteStatus);
                    alert(`Website ${action}ed successfully`);
                  } catch (error) {
                    alert(`Failed to ${action} the website`);
                  }
                }}
                disabled={toggleLock.isPending}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 lg:px-6 rounded-sm font-bold text-[10px] lg:text-xs tracking-widest uppercase transition-all disabled:opacity-50 ${websiteStatus ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-white border border-gray-200 text-slate-600 hover:bg-slate-100"}`}
              >
                {websiteStatus ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                {toggleLock.isPending
                  ? "Updating..."
                  : websiteStatus
                    ? "Locked"
                    : "Lock Site"}
              </button>
              <button
                onClick={onLogout}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 lg:px-6 bg-white border border-red-100 text-red-600 rounded-sm font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Desktop Sidebar Nav */}
            <div className="hidden lg:block lg:col-span-1 space-y-2">
              <NavBtn
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                icon={<BarChart3 />}
                label="Dashboard"
              />
              <NavBtn
                active={activeTab === "products"}
                onClick={() => setActiveTab("products")}
                icon={<Package />}
                label="Inventory"
              />
              <NavBtn
                active={activeTab === "events"}
                onClick={() => setActiveTab("events")}
                icon={<Calendar />}
                label="Events"
              />
              <NavBtn
                active={activeTab === "gallery"}
                onClick={() => setActiveTab("gallery")}
                icon={<ImageIcon />}
                label="Gallery"
              />
              <NavBtn
                active={activeTab === "showcase"}
                onClick={() => setActiveTab("showcase")}
                icon={<MonitorPlay />}
                label="Showcase"
              />
              <NavBtn
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
                icon={<ListOrdered />}
                label="Orders"
              />
              <NavBtn
                active={activeTab === "promocodes"}
                onClick={() => setActiveTab("promocodes")}
                icon={<Ticket />}
                label="Discounts"
              />
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <OverviewPanel
                    stats={stats}
                    pieData={pieData}
                    products={products}
                    onEditProduct={openEditProduct}
                  />
                )}
                {activeTab === "products" && (
                  <ProductsPanel
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddProduct={openAddProduct}
                    onEditProduct={openEditProduct}
                  />
                )}
                {activeTab === "events" && (
                  <EventsPanel
                    onAddEvent={openAddEvent}
                    onEditEvent={openEditEvent}
                  />
                )}
                {activeTab === "gallery" && (
                  <GalleryPanel
                    onAddImage={openAddGalleryImage}
                    onEditImage={openEditGalleryImage}
                  />
                )}
                {activeTab === "showcase" && (
                  <ShowcasePanel
                    onAddShowcase={openAddShowcase}
                    onEditShowcase={openEditShowcase}
                  />
                )}
                {activeTab === "orders" && (
                  <OrdersPanel
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onOpenOrderDetails={openOrderDetails}
                  />
                )}
                {activeTab === "promocodes" && (
                  <PromoCodesPanel
                    onAddPromoCode={openAddPromoCode}
                    onEditPromoCode={openEditPromoCode}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        formData={productFormData}
        setFormData={setProductFormData}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        editingEvent={editingEvent}
        formData={eventFormData}
        setFormData={setEventFormData}
      />

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        editingImage={editingGalleryImage}
        formData={galleryFormData}
        setFormData={setGalleryFormData}
        setIsGalleryModalOpen={setIsGalleryModalOpen}
        galleryFormData={galleryFormData}
      />

      <ShowcaseModal
        isOpen={isShowcaseModalOpen}
        onClose={() => setIsShowcaseModalOpen(false)}
        editingItem={editingShowcaseItem}
        formData={showcaseFormData}
        setFormData={setShowcaseFormData}
      />

      <PromoCodeModal
        isOpen={isPromoCodeModalOpen}
        onClose={() => setIsPromoCodeModalOpen(false)}
        editingPromoCode={editingPromoCode}
        formData={promoCodeFormData}
        setFormData={setPromoCodeFormData}
        onGenerateCode={generateRandomCode}
      />

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center z-[70] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto gap-4 custom-scrollbar-hide">
        <MobileNavIcon
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<BarChart3 />}
          label="Dashboard"
        />
        <MobileNavIcon
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
          icon={<Package />}
          label="Inventory"
        />
        <MobileNavIcon
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
          icon={<Calendar />}
          label="Events"
        />
        <MobileNavIcon
          active={activeTab === "gallery"}
          onClick={() => setActiveTab("gallery")}
          icon={<ImageIcon />}
          label="Gallery"
        />
        <MobileNavIcon
          active={activeTab === "showcase"}
          onClick={() => setActiveTab("showcase")}
          icon={<MonitorPlay />}
          label="Showcase"
        />
        <MobileNavIcon
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
          icon={<ListOrdered />}
          label="Orders"
        />
        <MobileNavIcon
          active={activeTab === "promocodes"}
          onClick={() => setActiveTab("promocodes")}
          icon={<Ticket />}
          label="Discounts"
        />
      </div>
    </PageTransition>
  );
};

export default AdminPage;
