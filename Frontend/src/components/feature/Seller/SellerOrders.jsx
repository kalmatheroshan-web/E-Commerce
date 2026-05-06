import React, { useEffect, useState, useMemo } from 'react';
import {
    Search, Filter, ShoppingBag, IndianRupee,
    CheckCircle2, ArrowUpRight, User, Clock, MoreVertical
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { updateOrderStatus } from '../../../Services/Operation/orderApi';

export default function SellerOrders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);
    const { orders: fetchOrders } = useSelector(state => state.orders);

    useEffect(() => {
        (async () => {
            if (Array.isArray(fetchOrders)) setOrders(fetchOrders);
        })();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            await updateOrderStatus({ orderId, status: newStatus });
        } catch (error) {
            console.error("Fulfillment Error:", error);
        }
    };

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const pending = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const rate = orders.length > 0 ? ((delivered / orders.length) * 100).toFixed(0) : 0;

        return { total: orders.length, revenue: totalRevenue, pending, rate };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o =>
            `${o.user?.firstName} ${o.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o._id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
            <div className="max-w-[1600px] mx-auto">

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <OrderStatCard label="Volume" value={stats.total} icon={<ShoppingBag />} color="indigo" />
                    <OrderStatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee />} color="emerald" />
                    <OrderStatCard label="Pending" value={stats.pending} icon={<Clock />} color="amber" />
                    <OrderStatCard label="Fulfillment" value={`${stats.rate}%`} icon={<CheckCircle2 />} color="rose" />
                </div>

                {/* --- ACTION BAR --- */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Scan transmission ID or Entity name..."
                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-md shadow-sm focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-8 py-5 bg-slate-900 text-white rounded-md font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-3">
                        <Filter size={18} /> Filter
                    </button>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-white rounded-lg border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Node</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Credit Value</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Status</th>
                                    <th className="px-8 py-6 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                    {order.user?.image ? <img src={order.user.image} className="rounded-full" alt="" /> : <User size={16} className="text-indigo-600" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700 leading-none mb-1">{order.user?.firstName || 'Unknown'} {order.user?.lastName || 'Entity'}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{order.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-lg text-slate-900 tracking-tighter">₹{order.totalAmount?.toLocaleString()}</p>
                                            <p className="text-[10px] font-black text-indigo-500 uppercase">{order.itemsCount || 1} Units</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">

                                                <div className="relative flex items-center group">
                                                    {/* The Select Box */}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className="appearance-none cursor-pointer bg-indigo-50/50 hover:bg-indigo-100/50 
      border border-indigo-100/50 hover:border-indigo-300 text-indigo-600 text-[10px] font-black uppercase tracking-widest
      pl-4 pr-10 py-2 rounded-xl transition-all duration-300 outline-none focus:ring-4 focus:ring-indigo-500/10"
                                                    >
                                                        <option value="pending" className="text-slate-900 font-sans">Pending</option>
                                                        <option value="shipped" className="text-slate-900 font-sans">Shipped</option>
                                                        <option value="delivered" className="text-slate-900 font-sans">Delivered</option>
                                                    </select>

                                                    {/* Custom Indigo Arrow Indicator */}
                                                    <div className="absolute right-4 pointer-events-none text-indigo-500 group-hover:translate-y-0.5 transition-transform">
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="m6 9 6 6 6-6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}



const OrderStatCard = ({ label, value, icon, color }) => {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
    };
    return (
        <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:rotate-12 ${colors[color]}`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
        </div>
    );
};