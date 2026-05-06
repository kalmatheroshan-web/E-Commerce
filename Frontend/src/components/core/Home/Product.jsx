import { Car, ChevronsRight, ArrowRight, Sparkles, Zap, MoveUpRight, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../../Services/Operation/productApi";
import Card from "../../../Templete/Card";

function Product() {
    let [data, setData] = useState([]);
    let [electric, setElectric] = useState([]);

    useEffect(() => {
        async function main() {
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
            }
        }
        main();
    }, []);

    return (
        <div className="min-h-screen bg-[#FBFCFE] pt-18 pb-20 px-4 md:px-12 lg:px-20">

            {/* Main Collection Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl md:text-3xl font-black text-gray-900 tracking-tight">
                        Featured <span className="text-indigo-600">Items</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Handpicked products for your lifestyle.</p>
                </div>
                {/* <Link to="/shop" className="text-sm font-bold text-indigo-600 flex items-center gap-2 group">
                    View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link> */}
            </div>

            {/* Unified Grid - Using the Card component for consistency */}
            <div className="mb-20">
                <Card data={data} />
            </div>

            {/* Dynamic Earbuds Promo Banner */}
            <div className="group relative min-h-[320px] w-full my-16 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 flex flex-col md:flex-row items-center justify-between px-10 md:px-20 overflow-hidden rounded-[1rem] shadow-2xl shadow-indigo-200 py-12 md:py-0">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>

                {/* Left content */}
                <div className="text-center md:text-left text-white z-20 relative">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <Sparkles size={16} className="text-indigo-200" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100">
                            Limited Edition Release
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
                        Sonic <br className="hidden md:block" /> <span className="text-indigo-200">Pro Buds</span>
                    </h2>
                    <p className="text-indigo-50 opacity-80 max-w-sm mb-8 text-sm md:text-lg font-medium leading-relaxed">
                        Redefining silence with industry-leading ANC and 360 Spatial Audio.
                    </p>
                </div>

                {/* Right content: Product Image */}
                <div className="relative h-64 md:h-[400px] w-full md:w-1/2 flex items-center justify-center lg:justify-end mt-10 md:mt-0">
                    {/* Glowing Orb */}
                    <div className="absolute top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-[90px] opacity-40 animate-pulse"></div>

                    {/* Main Image */}
                    <img
                        draggable={false}
                        src="/Earbuds2.png"
                        alt="Sonic Pro Buds"
                        className="h-56 md:h-80 lg:h-96 object-contain z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)] transform hover:rotate-2 hover:scale-110 transition-all duration-700 ease-in-out cursor-pointer"
                    />

                    {/* Feature Pill */}
                    <div className="absolute bottom-10 right-0 md:right-10 z-20 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-2xl shadow-2xl">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-indigo-200 font-bold">Battery Life</span>
                            <span className="text-xl font-black">48 Hours</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="flex">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Car size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Electronics Essentials</h3>
                        <p className="text-sm text-gray-400 font-medium">Cutting edge gear for the modern setup.</p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <Card data={electric} />
            </div>

            {/* shoes */}
            <div className="group relative min-h-[500px] md:min-h-[420px] w-full my-10 md:my-20 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-950 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden rounded-3xl shadow-[0_35px_70px_rgba(16,185,129,0.15)] py-12 md:py-0">

                {/* Background Decor - Hidden on smallest screens to improve performance */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.1),transparent_70%)] md:bg-[radial-gradient(circle_at_20%_30%,rgba(52,211,153,0.15),transparent_50%)] opacity-70"></div>

                {/* 1. Left Content: Text & CTA */}
                <div className="text-center md:text-left text-white z-20 relative max-w-xs sm:max-w-md lg:max-w-lg order-2 md:order-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-6">
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                            Next-Gen Running
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tighter italic leading-[0.9]">
                        NEON <br className="hidden md:block" />
                        <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">STRIDE.</span>
                    </h2>

                    <p className="text-slate-300/90 mb-8 md:mb-10 text-sm md:text-base lg:text-lg font-medium leading-relaxed">
                        Engineered with <span className="text-white font-bold">Aerofoam™</span> for 40% more energy return than standard EVA.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <button className="w-full sm:w-auto group/btn flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 uppercase italic text-xs md:text-sm">
                            Shop Collection
                            <MoveRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <button className="hidden sm:flex items-center gap-2 text-white/70 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-widest">
                            View Specs <MoveUpRight size={14} />
                        </button>
                    </div>
                </div>

                {/* 2. Right Content: The Visual Hero */}
                <div className="relative h-64 sm:h-80 md:h-full w-full md:w-1/2 flex items-center justify-center order-1 md:order-2 mb-12 md:mb-0">

                    {/* Glow Aura - Scales based on screen size */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 bg-emerald-500 rounded-full blur-[80px] md:blur-[120px] opacity-30 group-hover:opacity-50 transition duration-700"></div>

                    {/* Shoe Image: Responsive sizing using h-props and object-contain */}
                    <img
                        draggable={false}
                        src="/shoes.png"
                        alt="Apex Neon Stride"
                        className="h-56 sm:h-72 md:h-80 lg:h-[28rem] object-contain z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] transform -rotate-12 group-hover:-rotate-3 group-hover:scale-110 transition-all duration-700 ease-out"
                    />

                    {/* Float Badge: Positioned differently for mobile vs desktop */}
                    <div className="absolute -bottom-4 md:bottom-10 right-0 md:right-4 lg:right-10 z-20 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 shadow-2xl group-hover:translate-y-[-5px] transition-transform duration-500">
                        <div className="bg-emerald-500 p-1.5 md:p-2 rounded-lg shadow-inner">
                            <Zap size={18} className="text-slate-950 fill-current" />
                        </div>
                        <div className="pr-2">
                            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-tighter">Ultralight</p>
                            <p className="text-lg md:text-xl font-black text-white italic">180<span className="text-xs ml-0.5">G</span></p>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}

export default Product;