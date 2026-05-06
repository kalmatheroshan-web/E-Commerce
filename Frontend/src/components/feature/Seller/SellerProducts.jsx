import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Edit3, Trash2, Package, Tag, IndianRupee, Filter, TrendingUp } from 'lucide-react';
import { getAllSellerProducts } from '../../../Services/Operation/sellerApi';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../../Services/Operation/productApi';

export default function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchProducts() {
            const value = await dispatch(getAllSellerProducts());
            if (Array.isArray(value)) setProducts(value);
        }
        fetchProducts();
    }, [dispatch]);

    // --- Data Calculations ---
    const stats = useMemo(() => {
        const totalItems = products.length;

        // Summing up price of all items
        const totalValue = products.reduce((acc, curr) => {
            const totalStock = curr.sizes.reduce(
                (sum, size) => sum + (size.stock || 0),
                0
            );

            return acc + (curr.price * totalStock);
        }, 0);

        // Calculating items with total stock < 10 across all sizes
        const lowStockItems = products.filter(product => {
            const totalStock = product.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
            return totalStock < 10;
        }).length;

        // Average discount percentage
        const avgDiscount = totalItems > 0
            ? (products.reduce((acc, curr) => acc + (curr.discount || 0), 0) / totalItems).toFixed(1)
            : 0;

        return { totalItems, totalValue, lowStockItems, avgDiscount };
    }, [products]);

    // Search filter
    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-900 font-sans">
            {/* Upper Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Inventory <span className="text-blue-600 not-italic">Pro</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time overview of your store's performance.</p>
                </div>
            </div>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Products" value={stats.totalItems} icon={<Package size={22} />} color="blue" />
                <StatCard label="Inventory Value" value={`₹${stats.totalValue.toLocaleString()}`} icon={<IndianRupee size={22} />} color="violet" />
                <StatCard label="Avg. Discount" value={`${stats.avgDiscount}%`} icon={<TrendingUp size={22} />} color="emerald" />
                <StatCard label="Restock Needed" value={stats.lowStockItems} icon={<Tag size={22} />} color="rose" />
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Quick search by product name..."
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((product) => {
                                const totalStock = product.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
                                return (
                                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.images?.[0]}
                                                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                                    alt=""
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-800">{product.productName}</p>
                                                    <p className={`text-xs font-bold ${totalStock < 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                                                        {totalStock} units in stock
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                                            {product.category?.categoryName}
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-slate-900">₹{product.price}</p>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase">{product.discount}% OFF</p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-600 hover:text-blue-600"><Edit3 size={18} /></button>
                                                <button className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-600 hover:text-rose-600 cursor-pointer" onClick={() => dispatch(deleteProduct(product._id))}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
        rose: "bg-rose-50 text-rose-600"
    };

    // Determine if this is the "featured" violet card
    const isViolet = color === 'violet';

    return (
        <div className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all ${isViolet ? 'ring-2 ring-violet-100 shadow-md' : ''}`}>

            <div className={`rounded-2xl flex items-center justify-center transition-all ${colors[color]}`}>
                {icon}
            </div>

            <div>
                <p className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1  ${isViolet ? 'px-8 grow scale-110 shadow-lg shadow-violet-100' : ''}`}>
                    {label}
                </p>
                <p className={`font-black text-slate-800 tracking-tight ${isViolet ? 'text-3xl' : 'text-2xl'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}