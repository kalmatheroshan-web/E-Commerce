import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard, Users, Tag, ShoppingBag, Percent,
    Settings, LogOut, Search, Trash2,
    DollarSign, TrendingUp, UserX, Eye, Plus,
    Activity, BarChart3, Star, X,
    CheckCircle
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { LineChart, PieChart } from '@mui/x-charts';
import { createCategory, createCoupons, deleteCoupon, viewCategory, viewCoupons } from '../../../Services/Operation/categoryApi';
import { logout } from '../../../Services/Operation/authApi';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
        {trend && (
            <div className={`mt-4 text-xs font-medium flex items-center ${trend.startsWith('↑') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend} <span className="text-slate-400 ml-1 font-normal">vs last month</span>
            </div>
        )}
    </div>
);

const SectionHeader = ({ title, icon: Icon, children }) => (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon className="text-indigo-600" size={22} />}
            {title}
        </h2>
        <div className="flex items-center gap-3">{children}</div>
    </div>
);

export default function AdminBoard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [categories, setCategories] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [stats] = useState({ totalRevenue: 189100, totalOrders: 1480, activeSellers: 3, totalCustomers: 28450 });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'sellers', label: 'Sellers', icon: Users }, // ID is 'sellers'
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'coupons', label: 'Coupons', icon: Percent },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                let val = await viewCategory();
                setCategories(Array.isArray(val) ? val : []);
                console.log(val);

                val = await viewCoupons();
                console.log(val);

                setCoupons(Array.isArray(val) ? val : []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const formatCurrency = (val) => `₹${val.toLocaleString('en-IN')}`;

    // --- Render Helpers ---

    const renderDashboard = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend="↑ 12.5%" colorClass="bg-indigo-50 text-indigo-600" />
                <StatCard title="Orders" value={stats.totalOrders} icon={ShoppingBag} trend="↑ 8.2%" colorClass="bg-emerald-50 text-emerald-600" />
                <StatCard title="Active Sellers" value={stats.activeSellers} icon={Users} colorClass="bg-amber-50 text-amber-600" />
                <StatCard title="Customers" value={stats.totalCustomers.toLocaleString()} icon={Star} colorClass="bg-purple-50 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <SectionHeader title="Revenue Insights" icon={TrendingUp} />
                    <LineChart
                        xAxis={[{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], scaleType: 'point' }]}
                        // FIX: Data must be numbers, not strings like '12k'
                        series={[{ data: [12000, 15000, 13000, 18000, 22000, 25000, 29000], area: true, color: '#6366f1' }]}
                        height={300}
                        // Optional: Format Y axis to show 'k'
                        yAxis={[{ valueFormatter: (value) => `${value / 1000}k` }]}
                    />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <SectionHeader title="Categories" icon={BarChart3} />
                    <PieChart
                        series={[
                            {
                                data: categories.map((ele, index) => ({
                                    id: index,
                                    value: ele.count || 1,
                                    label: ele.categoryName,
                                })),
                                innerRadius: 60,
                                paddingAngle: 2,
                                cornerRadius: 4,
                            },
                        ]}
                        height={300}
                        slotProps={{ legend: { hidden: true } }}
                    />
                </div>
            </div>
        </div>
    );

    const renderSellers = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <SectionHeader title="Seller Directory">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64" placeholder="Search sellers..." />
                    </div>
                </SectionHeader>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Seller Details</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Revenue</th>
                            <th className="px-6 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50 transition">
                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">Astra Electronics</div>
                                <div className="text-xs text-slate-500">astra@example.com</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-700">₹45,200</td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition"><Eye size={18} /></button>
                                    <button className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"><UserX size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await createCategory({ categoryName: newCategoryName });

            // Refresh the list with the new category
            setCategories([...categories, response]);

            // Reset form
            setNewCategoryName('');
            setShowAddForm(false);
        } catch (error) {
            console.error("Error adding category:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCategory = () => {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SectionHeader title="Category Management" icon={Tag}>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`${showAddForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white'} px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100`}
                    >
                        {showAddForm ? <X size={18} /> : <Plus size={18} />}
                        {showAddForm ? 'Cancel' : 'Add New'}
                    </button>
                </SectionHeader>

                {/* Inline Add Category Form */}
                {showAddForm && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-indigo-50 shadow-sm animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleAddCategory} className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[240px]">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Category Name
                                </label>
                                <input
                                    autoFocus
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="e.g. Electronics, Home Decor..."
                                />
                            </div>
                            <button
                                disabled={isSubmitting || !newCategoryName}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Category'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Grid Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat._id} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                                            {cat.categoryName.charAt(0)}
                                        </div>
                                        <h3 className="font-bold text-slate-800">{cat.categoryName}</h3>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <p className="text-slate-400">No categories found. Click "Add New" to start.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const [showCouponForm, setShowCouponForm] = useState(false);
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            isActive: true,
            discountType: 'percentage'
        }
    });

    const renderCounpoun = () => {
        const currentType = watch("discountType");

        const onSubmit = async (data) => {
            try {
                const val = await createCoupons(data);
                setCoupons(Array.isArray(val) ? val : []);

                reset();
                setShowCouponForm(false);
            } catch (err) {
                console.error("Coupon Creation Failed", err);
            }
        };

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <SectionHeader title="Coupons & Promotions" icon={Percent}>
                    <button
                        onClick={() => setShowCouponForm(!showCouponForm)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
                    >
                        {showCouponForm ? <X size={18} /> : <Plus size={18} />}
                        {showCouponForm ? 'Close' : 'Create Coupon'}
                    </button>
                </SectionHeader>

                {/* Create Coupon Form */}
                {showCouponForm && (
                    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-top-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Coupon Code */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Coupon Code</label>
                                    <input
                                        {...register("code", { required: "Required" })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="PROMO2026"
                                    />
                                </div>

                                {/* Discount Type (Select) */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Discount Type</label>
                                    <select
                                        {...register("discountType")}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>

                                {/* Discount Value */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">
                                        {currentType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                                    </label>
                                    <input
                                        type="number"
                                        {...register("discountValue", { required: true, min: 1 })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder={currentType === 'percentage' ? "10" : "500"}
                                    />
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Expiry Date</label>
                                    <input
                                        type="date"
                                        {...register("expiryDate", { required: true })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>

                                {/* Is Active (Checkbox Toggle) */}
                                <div className="flex items-center gap-3 pt-8 px-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        {...register("isActive")}
                                        className="w-5 h-5 accent-indigo-600 rounded"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                        Enable Coupon Immediately
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Save Coupon
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Coupons List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {coupons.length > 0 ? (

                        coupons.map((coupon) => (
                            <div key={coupon._id} className="relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">

                                {/* Top/Bottom Ticket Cutouts (Visual Flair) */}
                                <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#F8FAFC] border border-slate-200 rounded-full z-10 shadow-inner"></div>
                                <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#F8FAFC] border border-slate-200 rounded-full z-10 shadow-inner"></div>

                                <div className="p-6">
                                    {/* Header: Code & Action */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-black text-2xl text-slate-800 tracking-tighter uppercase">
                                                    {coupon.code}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${coupon.isActive
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                <Activity size={12} />
                                                <p className="text-[11px] font-medium uppercase tracking-wide">
                                                    Valid until {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                (async() => {
                                                    await deleteCoupon(coupon._id)
                                                    setCoupons(coupons.filter((item) => item._id !== coupon._id))
                                                })()
                                            }}
                                            className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                            title="Delete Coupon"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Content: Discount Details */}
                                    <div className="flex items-end justify-between pt-5 border-t border-dashed border-slate-200 relative">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Benefit</p>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                                    {coupon.discountType === 'percentage' ? (
                                                        <Percent size={16} className="text-indigo-600" />
                                                    ) : (
                                                        <DollarSign size={16} className="text-indigo-600" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 capitalize">
                                                    {coupon.discountType} Discount
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-3xl font-black text-indigo-600">
                                                {coupon.discountType === 'percentage'
                                                    ? `${coupon.discountValue}%`
                                                    : `₹${coupon.discountValue}`
                                                }
                                                <span className="text-xs text-indigo-400 ml-1 font-bold uppercase tracking-tighter">Off</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Progress bar indicating "Health/Usage" */}
                                <div className="h-1 w-full bg-slate-50">
                                    <div
                                        className={`h-full transition-all duration-500 ${coupon.isActive ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                        style={{ width: '100%' }}
                                    ></div>
                                </div>
                            </div>
                        ))

                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <Percent className="text-slate-200 mb-4" size={48} />
                            <p className="text-slate-500 font-medium">No active coupons found</p>
                            <p className="text-slate-400 text-sm">Create one to boost your sales!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                            <ShoppingBag className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">AdminMart</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-indigo-600'} />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button onClick={() => dispatch(logout(navigate))} className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition font-semibold text-sm">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-72 p-6 lg:p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h1>
                        <p className="text-slate-500 text-sm">Welcome back, here's what's happening today.</p>
                    </div>
                    <button className="relative p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-xl transition">
                        <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                        <Settings size={22} />
                    </button>
                </header>

                {/* FIX: Tab ID matching */}
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'sellers' && renderSellers()}
                {activeTab === 'categories' && renderCategory()}
                {activeTab === 'coupons' && renderCounpoun()}
            </main>
        </div>
    );
}