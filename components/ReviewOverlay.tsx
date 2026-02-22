import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Search, CheckCircle } from 'lucide-react';
import { PRODUCTS, MOCK_ORDERS } from '../constants';

interface ReviewOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReviewOverlay: React.FC<ReviewOverlayProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [step, setStep] = useState<'verify' | 'orders' | 'write'>('verify');
    const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) {
            setError('Please provide your name and email.');
            return;
        }

        const userOrders = MOCK_ORDERS.filter(o => o.email.toLowerCase() === email.toLowerCase());

        if (userOrders.length === 0) {
            setError('No orders found for this email address.');
            return;
        }

        // Extract all unique products across their orders
        const productsMap = new Map();
        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productsMap.has(item.productId)) {
                    const productData = PRODUCTS.find(p => p.id === item.productId);
                    if (productData) {
                        productsMap.set(item.productId, {
                            orderId: order.id,
                            date: order.date,
                            product: productData
                        });
                    }
                }
            });
        });

        const products = Array.from(productsMap.values());
        if (products.length === 0) {
            setError('No products found in your orders.');
            return;
        }

        setPurchasedProducts(products);
        setError('');
        setStep('orders');
    };

    const handleSelectProduct = (productEntry: any) => {
        setSelectedProduct(productEntry);
        setRating(0);
        setReviewTitle('');
        setReviewText('');
        setStep('write');
    };

    const handleSubmitReview = () => {
        if (!rating) {
            alert('Please select a star rating.');
            return;
        }
        if (!reviewTitle.trim() || !reviewText.trim()) {
            alert('Please fill out the review title and body.');
            return;
        }

        const productToUpdate = PRODUCTS.find(p => p.id === selectedProduct.product.id);
        if (productToUpdate) {
            if (!productToUpdate.reviews) {
                productToUpdate.reviews = [];
            }
            productToUpdate.reviews.push({
                id: Date.now().toString(),
                userName: name,
                rating,
                date: new Date().toISOString().split('T')[0],
                title: reviewTitle,
                text: reviewText,
                verified: true
            });
        }

        alert('Your review has been saved! Thank you.');
        onClose();
        // Reset state after close
        setTimeout(() => {
            setEmail('');
            setName('');
            setStep('verify');
            setPurchasedProducts([]);
        }, 500);
    };

    const resetProcess = () => {
        setEmail('');
        setName('');
        setError('');
        setStep('verify');
        setPurchasedProducts([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col pt-10 px-6 sm:px-12 md:px-24"
                    >
                        <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-gray-100 pb-8 shrink-0">
                            <span className="font-serif text-2xl text-primary-950">Client Reviews</span>
                            <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-black hover:rotate-90 transition-all duration-300">
                                <X className="w-8 h-8" strokeWidth={1} />
                            </button>
                        </div>

                        <div className="w-full max-w-4xl mx-auto py-12 flex-1 overflow-y-auto custom-scrollbar-hide">

                            {step === 'verify' && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
                                    <h2 className="text-3xl font-serif text-primary-950 mb-4">Verify Your Purchase</h2>
                                    <p className="text-slate-500 mb-8 leading-relaxed font-light">To maintain the highest standard of feedback, we only accept reviews from verified clients. Please enter the email and name associated with your order.</p>

                                    <form onSubmit={handleVerify} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Full Name</label>
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-b-2 border-slate-200 outline-none focus:border-primary-600 py-3 text-lg bg-transparent transition-colors" placeholder="e.g. Alice Doe" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email Address</label>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-b-2 border-slate-200 outline-none focus:border-primary-600 py-3 text-lg bg-transparent transition-colors" placeholder="e.g. alice@example.com" required />
                                        </div>
                                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                                        <button type="submit" className="mt-8 px-10 py-5 bg-primary-950 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors w-full sm:w-auto shadow-xl shadow-primary-900/10">
                                            Find My Orders
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'orders' && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <button onClick={resetProcess} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600">← Back</button>
                                        <h2 className="text-3xl font-serif text-primary-950">Your Past Purchases</h2>
                                    </div>
                                    <p className="text-slate-500 mb-10 leading-relaxed font-light max-w-2xl">Welcome back, {name}. Please select an item from your order history below to write a verified review.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {purchasedProducts.map((entry, i) => (
                                            <div key={i} className="group border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 bg-white">
                                                <div className="aspect-[4/5] bg-gray-50 mb-6 overflow-hidden relative">
                                                    <img src={entry.product.image || entry.product.images?.[0]} alt={entry.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury mix-blend-multiply" />
                                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest">
                                                        {entry.date}
                                                    </div>
                                                </div>
                                                <h3 className="font-serif text-lg text-primary-950 mb-2 truncate">{entry.product.name}</h3>
                                                <p className="text-sm text-slate-400 mb-6">Order: #{entry.orderId}</p>
                                                <button onClick={() => handleSelectProduct(entry)} className="w-full border border-primary-900 text-primary-900 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary-900 hover:text-white transition-colors">
                                                    Write Review
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 'write' && selectedProduct && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                                    <div className="flex items-center gap-4 mb-8">
                                        <button onClick={() => setStep('orders')} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600">← Back</button>
                                        <h2 className="text-3xl font-serif text-primary-950">Review Product</h2>
                                    </div>

                                    <div className="flex items-start gap-6 bg-slate-50 p-6 border border-slate-100 mb-10">
                                        <img src={selectedProduct.product.image || selectedProduct.product.images?.[0]} alt="" className="w-20 h-24 object-cover" />
                                        <div>
                                            <h3 className="font-serif text-xl text-primary-950">{selectedProduct.product.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1">Purchased on {selectedProduct.date} (Order #{selectedProduct.orderId})</p>
                                            <div className="flex items-center mt-3 gap-1 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                                                <CheckCircle className="w-3 h-3" /> Verified Buyer Badge
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Overall Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className={`text-4xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-200'}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Headline</label>
                                            <input type="text" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} className="w-full border-b border-gray-200 py-4 outline-none focus:border-primary-500 transition-colors text-xl font-serif" placeholder="Summarize your experience" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Written Review</label>
                                            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="w-full border border-gray-200 p-4 h-48 outline-none focus:border-primary-500 transition-colors resize-none rounded-none bg-transparent" placeholder="Tell us what you loved about it, how it fits, or anything else you'd like to share." />
                                        </div>

                                        <button
                                            onClick={handleSubmitReview}
                                            className="w-full md:w-auto px-12 bg-primary-900 text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors shadow-xl shadow-primary-900/10"
                                        >
                                            Publish Review
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
};

export default ReviewOverlay;
