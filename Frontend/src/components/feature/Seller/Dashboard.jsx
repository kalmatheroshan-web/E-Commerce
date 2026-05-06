import { ShoppingBag, Users, BarChart3, DollarSign, MoreHorizontal, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOrder } from "../../../Redux/slices/orderSlice";
import { getAllOrders } from "../../../Services/Operation/sellerApi";

export default function ModernDashboard() {
    const [orders, setOrders] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await getAllOrders();
                const orderData = Array.isArray(response) ? response : response?.data || [];
                dispatch(setOrder(orderData));
                setOrders(orderData);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }
        fetchOrders();
    }, [dispatch]);

    // Data Aggregation
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    const displayOrders = [...orders].reverse().slice(0, 6);

    const stats = [
        { title: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Orders", value: orders.length, icon: <ShoppingBag />, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Customers", value: [...new Set(orders.map(o => o.userId))].length, icon: <Users />, color: "text-violet-600", bg: "bg-violet-50" },
        { title: "Avg. Value", value: orders.length ? `$${(totalRevenue / orders.length).toFixed(0)}` : "$0", icon: <TrendingUp />, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    return (
        <main className="flex-1 min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Modern Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Console</h1>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <Calendar size={14} />
                            <span className="text-sm font-medium">Real-time data for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                                {stat.icon}
                            </div>
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
                            <h2 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h2>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Modernized Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 flex justify-between items-center border-b border-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Latest Transactions</h3>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View History</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-slate-400 text-[11px] uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-6 py-4 text-left font-bold">Transaction</th>
                                        <th className="px-6 py-4 text-left font-bold">Customer</th>
                                        <th className="px-6 py-4 text-left font-bold">Status</th>
                                        <th className="px-6 py-4 text-right font-bold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {displayOrders.map((order, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-800">#{order._id?.slice(-6).toUpperCase()}</div>
                                                <div className="text-[10px] text-slate-400 uppercase">Process ID</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-600">{order.customerName || "Private Buyer"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-sm font-black text-slate-800">${(order.totalAmount || 0).toLocaleString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Gauges Section */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Store Health</h3>
                            <div className="flex flex-col items-center gap-8">
                                <Gauge percentage={78} label="Growth" color="#4F46E5" />
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="p-4 rounded-2xl bg-slate-50 text-center">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Retention</p>
                                        <p className="text-lg font-bold text-slate-800">92%</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 text-center">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Bounce</p>
                                        <p className="text-lg font-bold text-slate-800">24%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Card */}
                        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Inventory Reach</h4>
                            <div className="space-y-4">
                                <ModernProgress label="Logistics" percent={85} />
                                <ModernProgress label="Fulfillment" percent={62} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// --- Modern Sub-Components ---

const Gauge = ({ percentage, label, color }) => {
    const radius = 36;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
        <div className="relative flex flex-col items-center">
            <svg width="120" height="120" className="transform -rotate-90">
                <circle cx="60" cy="60" r={radius} stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                <circle
                    cx="60" cy="60" r={radius} stroke={color} strokeWidth="8" fill="transparent"
                    strokeDasharray={dashArray}
                    style={{ strokeDashoffset: dashOffset, transition: "stroke-dashoffset 1s ease-in-out", strokeLinecap: 'round' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-2xl font-black text-slate-800 leading-none">{percentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{label}</span>
            </div>
        </div>
    );
};

const ModernProgress = ({ label, percent }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
            <span className="text-slate-300">{label}</span>
            <span className="text-white">{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-1000"
                style={{ width: `${percent}%` }}
            />
        </div>
    </div>
);