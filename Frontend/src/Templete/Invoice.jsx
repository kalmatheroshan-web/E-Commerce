import { ArrowLeft, Download, Receipt, Printer } from "lucide-react";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

import generateInvoicePDF from "../Services/generateInvoice";

export default function Invoice({ setInvoice, order }) {
    const { signupData: user } = useSelector((state) => state.auth) || {};
    const invoiceRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!order) return null;

    // -----------------------------------
    // FINANCIAL CALCULATIONS
    // -----------------------------------
    const totalAmount = order?.totalAmount || 0;
    const gstRate = 0.18;
    const subtotal = totalAmount / (1 + gstRate);
    const gst = totalAmount - subtotal;

    // -----------------------------------
    // ACTIONS (DOWNLOAD & PRINT)
    // -----------------------------------
    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            await generateInvoicePDF({
                element: invoiceRef.current,
                filename: `invoice-${
                    order._id?.slice(-6).toUpperCase() || "FILE"
                }.pdf`,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsDownloading(false);
        }
    };


    

    // -----------------------------------
    // UTILITIES
    // -----------------------------------
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatAddress = (address) => {
        if (!address) return "Address not available";
        if (typeof address === "string") return address;
        return `${address.street || ""}, ${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`;
    };

    return (
        <div className="min-h-screen bg-slate-50/60 print:bg-white px-4 sm:px-6 py-8 sm:py-12 selection:bg-slate-900 selection:text-white antialiased">
            {/* INJECTED PRINT-ONLY STYLES */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body { 
                        background: #ffffff !important; 
                        color: #0f172a !important;
                    }
                    @page { 
                        size: A4; 
                        margin: 15mm 15mm 15mm 15mm; 
                    }
                    .print-bg-fix { 
                        background-color: #f8fafc !important; 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                    }
                    .print-border-fix {
                        border: 1px solid #e2e8f0 !important;
                    }
                }
            `}} />

            {/* ACTION BAR */}
            <div className="w-full max-w-[840px] mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 print:hidden">
                <button
                    onClick={() => setInvoice(false)}
                    className="group flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-wider transition-all"
                >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
                    Back to Orders
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <Download className="w-4 h-4 text-slate-300" />
                        {isDownloading ? "Generating..." : "Download PDF"}
                    </button>
                </div>
            </div>

            {/* INVOICE SHEET CONTAINER */}
            <div className="w-full max-w-[840px] mx-auto">
                <div
                    ref={invoiceRef}
                    className="bg-white w-full shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/60 p-8 sm:p-12 text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0"
                >
                    {/* TOP IDENTITY ROW */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center print-bg-fix">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900">FikriShop</h1>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-bold tracking-widest uppercase">
                                    Premium Marketplace
                                </p>
                            </div>
                        </div>

                        <div className="text-left md:text-right text-xs text-slate-500 space-y-1">
                            <p className="font-bold text-slate-800 text-sm">Fikri Shop Private Ltd.</p>
                            <p>Ahmedabad, Gujarat, India</p>
                            <p>support@fikrishop.com</p>
                            <p className="font-mono text-slate-400 pt-0.5">GSTIN: 24ABCDE1234F1Z5</p>
                        </div>
                    </div>

                    {/* BENTO INFO SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {/* META METRICS */}
                        <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-5 print-bg-fix print-border-fix">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Metadata</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold tracking-wide uppercase print-border-fix">
                                    {order.status || "Paid"}
                                </span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Invoice No</span>
                                    <span className="font-mono font-bold text-slate-800">
                                        INV-{order._id?.slice(-6).toUpperCase() || "100001"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Date</span>
                                    <span className="font-medium text-slate-700">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Gateway</span>
                                    <span className="font-medium capitalize text-slate-700">{order.paymentMethod || "Razorpay"}</span>
                                </div>
                            </div>
                        </div>

                        {/* BILL TO */}
                        <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-5 print-bg-fix print-border-fix">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Bill To</span>
                            <div className="space-y-1 text-xs">
                                <p className="font-bold text-slate-800 text-sm">
                                    {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Valued Customer"}
                                </p>
                                <p className="text-slate-500 leading-relaxed line-clamp-2">
                                    {formatAddress(user?.addresses?.[0])}
                                </p>
                                <p className="text-slate-400 font-mono truncate pt-0.5">
                                    {user?.email || "customer@email.com"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TABLE SYSTEM */}
                    <div className="mt-8 border border-slate-200/60 rounded-xl overflow-hidden print-border-fix">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-200/60 print-bg-fix">
                                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-slate-400">Product Details</th>
                                        <th className="px-4 py-3.5 text-center font-bold uppercase tracking-wider text-slate-400 w-20">Qty</th>
                                        <th className="px-5 py-3.5 text-right font-bold uppercase tracking-wider text-slate-400 w-32">Unit Price</th>
                                        <th className="px-5 py-3.5 text-right font-bold uppercase tracking-wider text-slate-400 w-32">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.products?.map((item, index) => {
                                        const qty = item.quantity || 1;
                                        const price = item.product?.price || 0;

                                        return (
                                            <tr key={item._id || index} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-sm text-slate-800">
                                                        {item.product?.productName || "Product Item"}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                                                        SKU: PRD-{index + 1001}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4 text-center font-medium text-slate-600">
                                                    {qty}
                                                </td>
                                                <td className="px-5 py-4 text-right font-mono text-slate-500">
                                                    ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-5 py-4 text-right font-mono font-semibold text-slate-900">
                                                    ₹{(qty * price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FINANCIAL CALCULATION BREAKDOWN BLOCK */}
                    <div className="mt-6 flex justify-end">
                        <div className="w-full sm:w-[340px] bg-slate-50/40 border border-slate-100 rounded-xl p-5 print-bg-fix print-border-fix">
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-slate-700">
                                        ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>GST (18%)</span>
                                    <span className="font-mono text-slate-700">
                                        ₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="border-t border-slate-200/80 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                                    <span>Grand Total</span>
                                    <span className="font-mono text-base text-slate-950">
                                        ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIGNATORY & FOOTER SYSTEM */}
                    <div className="mt-16 border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-8 justify-between items-start sm:items-end">
                        <div className="text-[11px] text-slate-400 space-y-1 max-w-[400px] leading-relaxed">
                            <p>This is a system-validated electronic invoice generated under the IT Act, 2000. No physical authorization token or signature is required.</p>
                            <p className="text-slate-500 font-semibold mt-1">Thank you for ordering with FikriShop.</p>
                        </div>
                        <div className="sm:text-right min-w-[200px] self-stretch sm:self-auto">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Authorized Signatory
                            </p>
                            <div className="h-12 flex items-end justify-start sm:justify-end">
                                <span className="font-serif italic text-sm text-slate-400 select-none opacity-60">FikriShop Ltd.</span>
                            </div>
                            <div className="w-full border-b border-slate-200 mt-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}