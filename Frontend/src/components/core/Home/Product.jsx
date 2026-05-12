import { Car, Sparkles, Zap, MoveUpRight, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../../Services/Operation/productApi";
import Card from "../../../Templete/Card";
import Skelton from "./Skelton";

function Product() {
    const [data, setData] = useState([]);
    const [electric, setElectric] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function main() {
            setLoading(true); // Start loading
            try {
                let val = await getAllProducts();

                // General Products
                const general = val.filter(ele => ele.category.categoryName !== "Electronics").slice(0, 10);
                setData(general);

                // Electronics
                const electronics = val.filter(ele => ele.category.categoryName === "Electronics");
                const maxItems = window.innerWidth <= 768 ? 6 : 10;
                setElectric(electronics.slice(0, maxItems));
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false); // 2. Stop loading regardless of success/error
            }
        }
        main();
    }, []);

    return (
        <div className="min-h-screen bg-[#FBFCFE] pt-10 pb-20 px-4 md:px-12 lg:px-20">

            {/* Main Collection Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl md:text-3xl font-black text-gray-900 tracking-tight">
                        Featured <span className="text-indigo-600">Items</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Handpicked products for your lifestyle.</p>
                </div>
            </div>

            {/* Unified Grid - General Products */}
            <div className="mb-20">
                {!loading ? (
                    <Card data={data} />
                ) : (
                    // 3. skeleton grid matching your card layout
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skelton key={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Promo Banner (Earbuds) */}
            <div className="group relative min-h-[320px] w-full my-16 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 flex flex-col md:flex-row items-center justify-between px-10 md:px-20 overflow-hidden rounded-[1rem] shadow-2xl shadow-indigo-200 py-12 md:py-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="text-center md:text-left text-white z-20 relative">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <Sparkles size={16} className="text-indigo-200" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100">Limited Edition Release</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
                        Sonic <br className="hidden md:block" /> <span className="text-indigo-200">Pro Buds</span>
                    </h2>
                    <p className="text-indigo-50 opacity-80 max-w-sm mb-8 text-sm md:text-lg font-medium leading-relaxed">
                        Redefining silence with industry-leading ANC and 360 Spatial Audio.
                    </p>
                </div>
                <div className="relative h-64 md:h-[400px] w-full md:w-1/2 flex items-center justify-center lg:justify-end mt-10 md:mt-0">
                    <img src="/Earbuds2.png" alt="Sonic Pro Buds" className="h-56 md:h-80 lg:h-96 object-contain z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)]" />
                </div>
            </div>

            {/* Electronics Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="flex gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Car size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Electronics Essentials</h3>
                        <p className="text-sm text-gray-400 font-medium">Cutting edge gear for the modern setup.</p>
                    </div>
                </div>
            </div>

            {/* Electronics Grid */}
            <div className="relative">
                {!loading ? (
                    <Card data={electric} />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Array.from({ length: window.innerWidth <= 768 ? 6 : 10 }).map((_, index) => (
                            <Skelton key={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Neon Stride Banner (Shoes) */}
            <div className="group relative min-h-[500px] md:min-h-[420px] w-full my-10 md:my-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-950 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden rounded-3xl py-12 md:py-0">
                <div className="text-center md:text-left text-white z-20 relative max-w-xs sm:max-w-md lg:max-w-lg order-2 md:order-1">
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tighter italic leading-[0.9]">
                        NEON <span className="text-emerald-400">STRIDE.</span>
                    </h2>
                    <button className="group/btn flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all">
                        Shop Collection <MoveRight size={18} />
                    </button>
                </div>
                <div className="relative h-64 sm:h-80 md:h-full w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
                    <img src="/shoes.png" alt="Shoes" className="h-56 md:h-80 lg:h-[28rem] object-contain z-10 -rotate-12" />
                </div>
            </div>
        </div>
    );
}

export default Product;