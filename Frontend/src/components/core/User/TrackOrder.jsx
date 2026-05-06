import React, { useState } from 'react';
import CreateReview from './CreateReview';

const TrackOrder = React.memo(({ order, setTrackOrder }) => {
    const [activeReviewId, setActiveReviewId] = useState(null);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-200">
                    <span className="text-2xl text-slate-400">×</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Order Information Unavailable</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">We are unable to retrieve details for this reference number at this time.</p>
                <button
                    className="mt-8 px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors"
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


    const handleWriteReview = (productId) => {
        setActiveReviewId(productId);
    };

    return (
        <div className="relative py-18 px-6 max-w-5xl mx-auto font-sans antialiased">
            {/* Breadcrumb / Navigation */}
            <nav className="flex items-center gap-2 mb-10 text-xs font-medium tracking-wide text-slate-400 uppercase">
                <button onClick={() => setTrackOrder(false)} className="hover:text-slate-900 cursor-pointer transition-colors">Orders</button>
                <span>/</span>
                <span className="text-slate-900">Track #{_id.slice(-8).toUpperCase()}</span>
            </nav>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {/* Enterprise Header */}
                <header className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Order Details</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                            <span>ID: <span className="font-mono text-slate-700 uppercase">{_id}</span></span>
                            <span className="h-4 w-[1px] bg-slate-200"></span>
                            <span>Placed {new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Value</span>
                        <span className="text-2xl font-bold select-none text-indigo-600">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                </header>

                {/* Logistics Status Board */}
                <section className="bg-slate-50/50 p-8 border-b border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex justify-between">
                            <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200" aria-hidden="true">
                                <div
                                    className="h-full bg-slate-900 transition-all duration-1000 ease-in-out"
                                    style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                                />
                            </div>

                            {statuses.map((step, idx) => (
                                <div key={step} className="relative flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${idx <= currentStep
                                        ? 'bg-green-400/15 border-green-800 text-green-800 shadow-md'
                                        : 'bg-white border-slate-200 text-slate-300'
                                        }`}>
                                        {idx <= currentStep ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        )}
                                    </div>
                                    <span className={`mt-3 text-xs font-semibold uppercase tracking-widest ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Line Items Table */}
                <section className="p-8">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Shipment Summary</h3>
                    <div className="overflow-x-auto">
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
                                                <div className="h-14 w-14 bg-slate-50 rounded border border-slate-100 flex-shrink-0 overflow-hidden">
                                                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                                </div>
                                                <div className="flex flex-col ">
                                                    <p className="font-medium text-slate-900 leading-tight">{item.product.productName}</p>
                                                    <p className="text-xs text-slate-400 mt-1 uppercase">SKU: {item.product._id?.slice(-8) || 'N/A'}</p>

                                                    {/* WRITE REVIEW OPTION */}
                                                    {isDelivered && (
                                                        <button
                                                            onClick={() => handleWriteReview(item.product._id)}
                                                            className="text-indigo-600 cursor-pointer text-[11px] font-bold uppercase tracking-tighter mt-2 flex items-center gap-1 hover:text-indigo-800 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                            Write a Review
                                                        </button>
                                                    )}

                                                    {/* 3. Conditional Rendering: Only show if this specific ID is active */}
                                                    {activeReviewId === item.product._id && (
                                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                                                            {/* 1. The Backdrop (Blurs the background and closes on click) */}
                                                            <div
                                                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                                                                onClick={() => setActiveReviewId(null)}
                                                            />

                                                            {/* 2. The Modal Content */}
                                                            <div className="relative w-[1800px] flex justify-center transform animate-in zoom-in-95 duration-200">
                                                                <CreateReview
                                                                    productId={item.product._id}
                                                                    productImage={item.product.images[0]}
                                                                    setReview={() => setActiveReviewId(null)}
                                                                />
                                                            </div>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center text-sm font-medium text-slate-600">
                                            {item.quantity}
                                        </td>
                                        <td className="py-6 text-right text-sm font-semibold text-slate-900">
                                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        {status === 'delivered' ? 'Delivered on: ' : 'Estimated Delivery: '}
                        <span className="font-semibold text-slate-700 underline underline-offset-2">Wednesday, 29 April</span>
                    </p>
                </footer>
            </div>
        </div>
    );
});

export default TrackOrder;