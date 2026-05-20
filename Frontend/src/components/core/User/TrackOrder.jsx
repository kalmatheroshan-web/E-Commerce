import React, { useState } from 'react';
import CreateReview from './CreateReview';

const TrackOrder = React.memo(({ order, setTrackOrder }) => {
    const [activeReviewId, setActiveReviewId] = useState(null);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-200">
                    <span className="text-2xl text-slate-400">×</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 text-center">Order Information Unavailable</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">We are unable to retrieve details for this reference number at this time.</p>
                <button
                    className="mt-8 w-full max-w-xs px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors"
                    onClick={() => setTrackOrder(false)}
                >
                    Return to Orders
                </button>
            </div>
        );
    }

    const { _id, status, products, createdAt, totalAmount } = order;
    const statuses = ["pending", "shipped", "delivered"];
    const currentStep = statuses.indexOf(status);
    const isDelivered = status === "delivered";

    return (
        <div className="relative py-8 md:py-18 px-4 md:px-6 max-w-5xl mx-auto font-sans antialiased">
            
            {/* Review Modal Portal (Moved outside table for better responsiveness) */}
            {activeReviewId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveReviewId(null)} />
                    <div className="relative w-full max-w-2xl transform animate-in zoom-in-95 duration-200">
                        <CreateReview
                            productId={activeReviewId}
                            productImage={products.find(p => p.product._id === activeReviewId)?.product?.images[0]}
                            setReview={() => setActiveReviewId(null)}
                        />
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-6 md:mb-10 text-[10px] md:text-xs font-medium tracking-wide text-slate-400 uppercase">
                <button onClick={() => setTrackOrder(false)} className="hover:text-slate-900 cursor-pointer transition-colors">Orders</button>
                <span>/</span>
                <span className="text-slate-900 truncate">Track #{_id.slice(-8).toUpperCase()}</span>
            </nav>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <header className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Order Details</h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-slate-500">
                            <span>ID: <span className="font-mono text-slate-700 uppercase">{_id.slice(-12)}</span></span>
                            <span className="hidden sm:block h-3 w-[1px] bg-slate-200"></span>
                            <span>Placed {new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-slate-50">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Value</span>
                        <span className="text-xl md:text-2xl font-bold text-indigo-600">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                </header>

                {/* Logistics Status Board - Responsive Steps */}
                <section className="bg-slate-50/50 p-6 md:p-10 border-b border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex justify-between">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200" aria-hidden="true">
                                <div
                                    className="h-full bg-green-500 transition-all duration-1000 ease-in-out"
                                    style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                                />
                            </div>

                            {statuses.map((step, idx) => (
                                <div key={step} className="relative flex flex-col items-center z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${idx <= currentStep
                                        ? 'border-green-500 text-green-600 shadow-sm'
                                        : 'border-slate-200 text-slate-300'
                                        }`}>
                                        {idx <= currentStep ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        )}
                                    </div>
                                    <span className={`mt-3 text-[10px] md:text-xs font-bold uppercase tracking-tighter md:tracking-widest ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Shipment Summary */}
                <section className="p-6 md:p-8">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Shipment Summary</h3>
                    
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-4 font-semibold text-xs text-slate-400 uppercase tracking-wider">Product</th>
                                    <th className="pb-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-center">Quantity</th>
                                    <th className="pb-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.map((item, index) => (
                                    <tr key={index} className="group">
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <img src={item?.product?.images[0]} alt="" className="h-14 w-14 rounded border border-slate-100 object-cover bg-slate-50" />
                                                <div>
                                                    <p className="font-medium text-slate-900 leading-tight">{item.product.productName}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">SKU: {item.product._id?.slice(-8)}</p>
                                                    {isDelivered && (
                                                        <button
                                                            onClick={() => setActiveReviewId(item.product._id)}
                                                            className="text-indigo-600 text-[10px] font-bold uppercase mt-2 flex items-center gap-1 hover:text-indigo-800 transition-colors cursor-pointer"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                            Write Review
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center text-sm text-slate-600">{item.quantity}</td>
                                        <td className="py-6 text-right text-sm font-bold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View List */}
                    <div className="md:hidden space-y-6">
                        {products.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0">
                                <img src={item.product.images[0]} alt="" className="h-20 w-20 rounded-lg border border-slate-100 object-cover bg-slate-50" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 text-sm leading-snug truncate">{item.product.productName}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Qty: {item.quantity} • SKU: {item.product._id?.slice(-6)}</p>
                                    <p className="text-sm font-black text-indigo-600 mt-1">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                                    {isDelivered && (
                                        <button
                                            onClick={() => setActiveReviewId(item.product._id)}
                                            className="mt-3 w-full py-2 bg-slate-50 border border-slate-200 rounded text-indigo-600 text-[10px] font-bold uppercase tracking-tighter"
                                        >
                                            Write a Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-100">
                    <p className="text-[11px] md:text-xs text-slate-500 text-center md:text-left">
                        {status === 'delivered' ? 'Delivered on: ' : 'Estimated Delivery: '}
                        <span className="font-bold text-slate-800 underline decoration-indigo-200 underline-offset-4">Wednesday, 29 April</span>
                    </p>
                </footer>
            </div>
        </div>
    );
});

export default TrackOrder;