import { Search, Package, RotateCcw, HelpCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { viewOrders } from "../../../Services/Operation/productApi";
import Invoice from "../../../Templete/Invoice";
import TrackOrder from "./TrackOrder";
import CreateReview from "./CreateReview";

const statusTheme = {
  Delivered: "text-emerald-700 bg-emerald-50 border-emerald-100",
  Processing: "text-blue-700 bg-blue-50 border-blue-100",
  Cancelled: "text-rose-700 bg-rose-50 border-rose-100",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [viewInvoice, setInvoice] = useState(false);
  const [trackOrder, setTrackOrder] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const result = await viewOrders();
        if (result?.orders) setOrders(result.orders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (viewInvoice && activeOrder) return <Invoice order={activeOrder} setInvoice={setInvoice} />;
  if (trackOrder && activeOrder) return <TrackOrder order={activeOrder} setTrackOrder={setTrackOrder} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-5xl mx-auto pt-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search all orders..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
            />
          </div>
          <select className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold shadow-sm cursor-pointer hover:bg-slate-50 transition-colors outline-none">
            <option>Last 3 months</option>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your history...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Order Meta Header */}
                <div className="bg-slate-50/80 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    <div>
                      <p className="mb-1">Order Placed</p>
                      <p className="text-slate-900 text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="mb-1">Total Amount</p>
                      <p className="text-slate-900 text-sm">₹{order.totalAmount || order.total}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="mb-1">Order ID</p>
                      <p className="text-slate-900 text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveOrder(order); setInvoice(true); }}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View Invoice
                  </button>
                </div>

                {/* Main Content */}
                <div className="p-6 flex flex-col md:flex-row gap-8">
                  <div className="w-28 h-28 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {order.products?.[0]?.product?.image ? (
                      <img src={order.products[0].product.image} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-10 h-10 text-indigo-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-1">
                      {order.products?.[0]?.product?.name || "Order Package"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusTheme[order.status] || "bg-gray-50"}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Item quantity: {order.products?.length || 1}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[160px]">
                    <button
                      onClick={() => { setTrackOrder(true); setActiveOrder(order); }}
                      className="w-full bg-slate-900 cursor-pointer hover:bg-black text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-200"
                    >
                      Track Order
                    </button>
                    <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                      <RotateCcw size={16} />
                      Buy Again
                    </button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50/30  flex items-center justify-between">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                      <HelpCircle size={16} />
                      Support
                    </button>
                  
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Package className="mx-auto mb-4 text-slate-200" size={64} />
              <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
              <p className="text-slate-500">Looks like you haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}