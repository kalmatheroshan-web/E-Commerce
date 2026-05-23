import { Sparkles, Zap, MoveUpRight, MoveRight, Cpu, ArrowRight } from "lucide-react";
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
            setLoading(true); 
            try {
                let val = await getAllProducts();

                // General Products
                const general = val.filter(ele => ele.category.categoryName !== "Electronics").slice(0, 10);
                setData(general);

                // Electronics
                const electronics = val.filter(ele => ele.category.categoryName === "Electronics");
                const maxItems = window.innerWidth <= 768 ? 4 : 10; // Scaled down to 4 items on mobile for vertical balance
                setElectric(electronics.slice(0, maxItems));
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false); 
            }
        }
        main();
    }, []);

    return (
        <div className="min-h-screen bg-[#F6F8FC] pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-20 selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden">
            
            {/* 1. FEATURED ITEMS SECTION */}
            <section className="mb-12 sm:mb-20">
                {/* Premium Bento Header */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 backdrop-blur-md bg-white/80">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 rounded-full text-indigo-600 text-[11px] font-semibold mb-2">
                            <Sparkles size={11} />
                            <span>Curated Collection</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Featured <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Items</span>
                        </h2>
                        <p className="text-gray-500 mt-0.5 text-xs sm:text-sm font-medium">Handpicked premium lifestyle products.</p>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 group transition-colors self-start sm:self-center">
                        View All Trends 
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Unified Grid with safe fallback wrappers */}
                <div className="w-full">
                    {!loading ? (
                        <div className="w-full">
                            <Card data={data} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <Skelton key={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 2. PROMO BANNER (EARBUDS) */}
            <section className="my-12 sm:my-20">
                <div className="group relative min-h-[340px] md:min-h-[380px] w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden rounded-3xl shadow-xl border border-slate-800/40 py-10 md:py-0 gap-8 md:gap-0">
                    
                    {/* Glow Accents */}
                    <div className="absolute top-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-500/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-[60px] sm:blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                    
                    <div className="text-center md:text-left text-white z-20 relative max-w-md order-2 md:order-1 flex flex-col items-center md:items-start w-full">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-200 text-[10px] font-semibold mb-4 sm:mb-6 border border-white/10">
                            <Zap size={10} className="text-amber-400 fill-amber-400" />
                            <span className="uppercase tracking-wider">Limited Release</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight leading-tight text-white">
                            Sonic <span className="bg-gradient-to-r from-indigo-200 via-sky-200 to-white bg-clip-text text-transparent">Pro Buds</span>
                        </h2>
                        <p className="text-slate-300 max-w-sm mb-6 sm:mb-8 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
                            Redefining silence with industry-leading Active Noise Cancellation and immersive 360 Spatial Audio.
                        </p>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-all active:scale-95 text-xs sm:text-sm">
                            Experience Sound <MoveUpRight size={14} />
                        </button>
                    </div>

                    <div className="relative h-44 sm:h-56 md:h-[380px] w-full md:w-1/2 flex items-center justify-center lg:justify-end order-1 md:order-2">
                        <div className="absolute w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
                        <img 
                            src="/Earbuds2.png" 
                            alt="Sonic Pro Buds" 
                            className="h-full max-h-[180px] sm:max-h-[220px] md:max-h-[280px] object-contain z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                    </div>
                </div>
            </section>

            {/* 3. ELECTRONICS SECTION */}
            <section className="mb-12 sm:mb-20">
                {/* Premium Bento Header */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 backdrop-blur-md bg-white/80">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shadow-inner">
                            <Cpu size={18} sm:size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Electronics Essentials</h3>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Cutting edge gear optimized for modern workflows.</p>
                        </div>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 group transition-colors self-start sm:self-center">
                        Browse Gear 
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Electronics Grid */}
                <div className="w-full">
                    {!loading ? (
                        <div className="w-full">
                            <Card data={electric} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                            {Array.from({ length: window.innerWidth <= 768 ? 4 : 10 }).map((_, index) => (
                                <Skelton key={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. NEON STRIDE BANNER (SHOES) */}
            <section className="mt-12 sm:mt-20">
                <div className="group relative min-h-[380px] md:min-h-[400px] w-full bg-gradient-to-br from-neutral-950 via-slate-900 to-emerald-950 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden rounded-3xl border border-emerald-950/30 py-10 md:py-0 shadow-2xl gap-6 md:gap-0">
                    
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.02] pointer-events-none"></div>

                    <div className="text-center md:text-left text-white z-20 relative max-w-md order-2 md:order-1 flex flex-col items-center md:items-start w-full">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400 block mb-2 sm:mb-3">High Performance Gear</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tighter italic uppercase leading-tight">
                            NEON <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_2px_10px_rgba(16,185,129,0.2)]">STRIDE.</span>
                        </h2>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-400/10 hover:bg-emerald-300 transition-all hover:shadow-emerald-400/20 active:scale-95 text-xs sm:text-sm">
                            Shop Collection <MoveRight size={14} />
                        </button>
                    </div>

                    <div className="relative h-48 sm:h-56 md:h-[380px] w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
                        <div className="absolute w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <img 
                            src="/shoes.png" 
                            alt="Neon Stride Shoes" 
                            className="h-full max-h-[190px] sm:max-h-[230px] md:max-h-[320px] object-contain z-10 transform -rotate-12 group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500 ease-out drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]" 
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Product;