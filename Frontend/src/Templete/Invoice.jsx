import { ArrowLeft, Download, Printer } from "lucide-react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Invoice({ setInvoice, order }) {
    const { signupData: user } = useSelector((state) => state.auth) || {};
    
    
    const invoiceRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `invoice-${order._id?.slice(-6) || "file"}`,
    });

    if (!order) return null;

    // Totals
    const totalAmount = order?.totalAmount || 0;
    const gstRate = 0.18;
    const subtotal = totalAmount / (1 + gstRate);
    const gst = totalAmount - subtotal;


    // Helpers
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function formatAddress(address) {
        if (!address) return "Shipping address not provided";
        if (typeof address === "string") return address;
        return `${address.street || ""}, ${address.city || ""}, ${address.state || ""} ${address.pincode || ""}`;
    }

    return (
        <div className="md:p-10 bg-slate-50 min-h-screen flex flex-col items-center print:bg-white print:p-0">

            {/* Top Bar */}
            <div className="w-full max-w-3xl mb-6 flex justify-between items-center pt-6 print:hidden">
                <button
                    onClick={() => setInvoice(false)}
                    className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-900 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </button>

                <div className="flex gap-2">
                    <button onClick={handlePrint} className="p-2 cursor-pointer hover:bg-white rounded-full">
                        <Download className="w-5 h-5" />
                    </button>

                    <button onClick={handlePrint} className="p-2 cursor-pointer hover:bg-white rounded-full">
                        <Printer className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Invoice */}
            <div
                ref={invoiceRef}
                className="invoice-root bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 md:p-12 space-y-10 border print:shadow-none print:border-none print:max-w-full"
            >
                {/* Header */}
                <div className="flex justify-between">
                    <div>
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg shadow-md">
                                F
                            </div>
                            <p className="text-3xl font-bold text-gray-800 tracking-wide">
                                Fikri<span className="text-indigo-500 font-stretch-ultra-expanded">Shop</span>
                            </p>
                        </div>
                        <h1 className="text-3xl font-black">INVOICE</h1>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-slate-400">Invoice Number</p>
                        <p className="font-mono font-bold">
                            #INV-{order._id?.slice(-6) || "1001"}
                        </p>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-12 border-t pt-6">
                    <div>
                        <p className="text-xs text-slate-400">Billing From</p>
                        <p className="font-bold">Fikri Shop</p>
                        <p>Ahmedabad, Gujarat</p>
                        <p>contact@fikrishop.com</p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-slate-400">Billing To</p>
                        <p className="font-bold">
                            {user?.firstName
                                ? `${user.firstName} ${user.lastName || ""}`
                                : "Valued Customer"}
                        </p>
                        <p>{formatAddress(user.addresses[0])}</p>
                        <p>{user?.email || "customer@email.com"}</p>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex justify-between bg-slate-50 p-4 rounded">
                    <div>
                        <span className="text-slate-400">Issue Date: </span>
                        <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div>
                        <span className="text-slate-400">Status: </span>
                        <strong>{order.status || "Pending"}</strong>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-slate-400 text-xs">
                            <th className="text-left pb-2">Description</th>
                            <th className="text-center pb-2">Qty</th>
                            <th className="text-right pb-2">Price</th>
                            <th className="text-right pb-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products?.map((item, idx) => (
                            <tr key={item._id || idx}>
                                <td className="py-2">{item.product?.productName || "Product"}</td>
                                <td className="text-center">{item.quantity || 1}</td>
                                <td className="text-right">
                                    ₹{(item.product?.price || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="text-right font-medium">
                                    ₹{(item.quantity * (item.product?.price || 0)).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="flex justify-end">
                    <div className="w-60 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST (18%)</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total</span>
                            <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-center text-slate-500">
                    Payment: {order.paymentMethod || "N/A"}
                    <br />
                    Thank you for choosing <strong>Fikri Shop</strong>
                </div>
            </div>
        </div>
    );
}