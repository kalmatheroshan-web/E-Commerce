import React, { useState } from 'react';
import CreateReview from './CreateReview';

const TrackOrder = React.memo(({ order, setTrackOrder }) => {
    const [activeReviewId, setActiveReviewId] = useState(null);

    if (!order || !order._id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 flex items-center justify-center rounded-full mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Order details unavailable</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">We couldn't retrieve the tracking details for this reference number.</p>
                <button
                    className="mt-6 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    onClick={() => setTrackOrder(false)}
                >
                    Return to Orders
                </button>
            </div>
        );
    }

    const { _id, status, products = [], createdAt, totalAmount = 0 } = order;
    
    // Normalize status for comparisons
    const currentStatus = status?.toLowerCase() || 'pending';
    const statuses = ["pending", "shipped", "delivered"];
    const currentStep = statuses.indexOf(currentStatus);
    const isDelivered = currentStatus === "delivered";

    // Status map for badges and labels
    const statusConfig = {
        pending: { label: 'Order Placed', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        shipped: { label: 'In Transit', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-6 md:py-12 antialiased font-sans">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                {/* Review Modal Portal */}
                {activeReviewId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setActiveReviewId(null)} />
                        <div className="relative  w-screen transform animate-in zoom-in-95 duration-200">
                            <CreateReview
                                productId={activeReviewId}
                                productImage={products.find(p => p?.product?._id === activeReviewId)?.product?.images?.[0]}
                                setReview={() => setActiveReviewId(null)}
                            />
                        </div>
                    </div>
                )}

                {/* Top Action / Breadcrumb */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => setTrackOrder(false)} 
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Orders
                    </button>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        #{_id ? _id.slice(-8).toUpperCase() : ''}
                    </span>
                </div>

                {/* Main Split Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column: Logistics Tracker & Core Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Status Card Header */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig[currentStatus]?.color || 'bg-slate-100'}`}>
                                        {statusConfig[currentStatus]?.label || currentStatus}
                                    </span>
                                    <h1 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">
                                        {isDelivered ? 'Your package has arrived!' : 'Your delivery is on its way'}
                                    </h1>
                                    <p className="text-slate-500 text-xs md:text-sm mt-1">
                                        {isDelivered ? 'Delivered on: ' : 'Estimated arrival: '}
                                        <span className="font-semibold text-slate-800">Wednesday, 29 April</span>
                                    </p>
                                </div>
                                <div className="text-xs sm:text-right text-slate-400 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                    <p>Placed via Web</p>
                                    <p className="font-medium text-slate-600 mt-0.5">
                                        {createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-[1px] bg-slate-100 my-8" />

                            {/* Desktop: Horizontal Flow Stepper */}
                            <div className="hidden md:flex relative justify-between max-w-xl mx-auto px-4">
                                <div className="absolute top-3.5 left-6 right-6 h-[2px] bg-slate-100" aria-hidden="true">
                                    <div
                                        className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out origin-left"
                                        style={{ width: `${currentStep >= 0 ? (currentStep / (statuses.length - 1)) * 100 : 0}%` }}
                                    />
                                </div>

                                {statuses.map((step, idx) => {
                                    const isPassed = idx <= currentStep;
                                    const isCurrent = idx === currentStep;
                                    return (
                                        <div key={step} className="relative flex flex-col items-center z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                                isPassed 
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100' 
                                                    : 'bg-white border-slate-200 text-slate-400'
                                            }`}>
                                                {isPassed ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xs font-semibold">{idx + 1}</span>
                                                )}
                                            </div>
                                            <span className={`mt-3 text-xs font-semibold capitalize ${isCurrent ? 'text-slate-900 font-bold' : isPassed ? 'text-slate-600' : 'text-slate-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile: Vertical Flow Timeline */}
                            <div className="md:hidden space-y-8 relative pl-6 max-w-sm mx-auto py-2">
                                <div className="absolute top-2 bottom-2 left-[31px] w-[2px] bg-slate-100" aria-hidden="true">
                                    <div 
                                        className="w-full bg-indigo-600 transition-all duration-1000 ease-in-out origin-top"
                                        style={{ height: `${currentStep >= 0 ? (currentStep / (statuses.length - 1)) * 100 : 0}%` }}
                                    />
                                </div>

                                {statuses.map((step, idx) => {
                                    const isPassed = idx <= currentStep;
                                    const isCurrent = idx === currentStep;
                                    return (
                                        <div key={step} className="flex items-start gap-4 relative z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0 ${
                                                isPassed 
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                                                    : 'bg-white border-slate-200 text-slate-400'
                                            }`}>
                                                {isPassed ? (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-[10px] font-bold">{idx + 1}</span>
                                                )}
                                            </div>
                                            <div className="-mt-0.5">
                                                <p className={`text-sm font-semibold capitalize ${isCurrent ? 'text-slate-900 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'}`}>
                                                    {step}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-slate-400 mt-0.5">Active status process updates dynamically.</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Shipment Summary Sidebar */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm lg:sticky lg:top-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Items in Order</h3>
                            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                {products.length} {products.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* Product Rows */}
                        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-1">
                            {products.map((item, index) => (
                                <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                    <img 
                                        src={item?.product?.images?.[0]} 
                                        alt="" 
                                        className="h-14 w-14 rounded-xl border border-slate-100 object-cover bg-slate-50 shrink-0" 
                                    />
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm leading-snug truncate">
                                                {item?.product?.productName}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Qty: <span className="text-slate-600 font-medium">{item?.quantity || 0}</span> • Price: ₹{item?.product?.price?.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            <span className="text-sm font-bold text-slate-900">
                                                ₹{item?.product?.price && item?.quantity ? (item.product.price * item.quantity).toLocaleString('en-IN') : '0'}
                                            </span>
                                            
                                            {isDelivered && item?.product?._id && (
                                                <button
                                                    onClick={() => setActiveReviewId(item.product._id)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                                                >
                                                    Write Review
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total Footer Section inside Card */}
                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Shipping</span>
                                <span className="font-medium text-emerald-600">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-sm font-semibold text-slate-900">Total Paid</span>
                                <span className="text-lg font-black text-indigo-600">
                                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </div>
    );
});

export default TrackOrder;