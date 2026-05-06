import { useLocation } from "react-router-dom";
import { ChevronDown, Filter, Star, X, RotateCcw, PackageSearch, LayoutGrid } from "lucide-react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Checkbox,
    Slider,
    Drawer,
    Chip
} from '@mui/material';
import { useState, useMemo, useEffect } from "react";
import SearchResult from "../../../Templete/SearchResult";

export default function MenuProduct() {
    const location = useLocation();
    // Safety check for location state
    const allProducts = useMemo(() => location.state?.Result || [], [location.state?.Result]);

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minRating, setMinRating] = useState(0);

    // 1. Fixed Price Logic: Ensure maximumPrice updates if products change
    const maximumPrice = useMemo(() => {
        if (allProducts.length === 0) return 10000;
        return Math.max(...allProducts.map(p => p.price || 0));
    }, [allProducts]);

    const [priceRange, setPriceRange] = useState([0, maximumPrice]);

    // Update price range if the global maximum changes (e.g., new search)
    useEffect(() => {
        (async () => {
            setPriceRange([0, maximumPrice]);
        })()
    }, [maximumPrice]);

    const categories = useMemo(() => {
        const rawCategories = allProducts.map(p =>
            typeof p.category === 'object' ? p.category.categoryName : p.category
        );
        return Array.from(new Set(rawCategories)).filter(Boolean);
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const catName = typeof product.category === 'object'
                ? product.category.categoryName
                : product.category;

            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(catName);
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            const matchesRating = (product.rating || 0) >= minRating;

            return matchesCategory && matchesPrice && matchesRating;
        });
    }, [allProducts, selectedCategories, priceRange, minRating]);

    const handleCategoryChange = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, maximumPrice]);
        setMinRating(0);
        setIsMobileFilterOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-slate-200 bg-white z-20">
                <FilterSidebar
                    maximumPrice={maximumPrice}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    handleCategoryChange={handleCategoryChange}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    resetFilters={resetFilters}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 pt-20 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Our Collection</h1>
                                <p className="text-slate-500 text-sm font-medium">
                                    Showing <span className="text-indigo-600 font-bold">{filteredProducts.length}</span> premium products
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                                <button className="p-2 bg-white shadow-sm rounded-md text-indigo-600"><LayoutGrid size={18} /></button>
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        {(selectedCategories.length > 0 || minRating > 0) && (
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Active:</span>
                                {selectedCategories.map(cat => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        onDelete={() => handleCategoryChange(cat)}
                                        size="small"
                                        className="bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                                    />
                                ))}
                                {minRating > 0 && (
                                    <Chip
                                        label={`${minRating}+ Stars`}
                                        onDelete={() => setMinRating(0)}
                                        size="small"
                                        className="bg-amber-50 text-amber-700 font-bold border border-amber-100"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="h-full min-h-[70vh] bg-transparent">
                            <SearchResult data={filteredProducts} />
                        </div>
                    ) : (
                        <NoResults resetFilters={resetFilters} />
                    )}
                </div>
            </main>

            {/* Mobile Filter Trigger */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 font-bold transition-all active:scale-95"
                >
                    <Filter size={20} />
                    <span>Filters</span>
                    {selectedCategories.length > 0 && (
                        <span className="bg-white text-indigo-600 w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
                            {selectedCategories.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Fixed: Pass maximumPrice to Drawer's Sidebar */}
            <Drawer
                anchor="bottom"
                open={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                PaperProps={{
                    sx: { height: '80vh', borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }
                }}
            >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
                <FilterSidebar
                    maximumPrice={maximumPrice}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    handleCategoryChange={handleCategoryChange}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    resetFilters={resetFilters}
                />
            </Drawer>
        </div>
    );
}

// 2. Added Props Validation/Default Values
const FilterSidebar = ({ maximumPrice = 10000, categories, selectedCategories, handleCategoryChange, priceRange, setPriceRange, minRating, setMinRating, resetFilters }) => (
    <div className="flex flex-col h-full bg-white">
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
            <h2 className="font-black text-sm uppercase tracking-[0.2em] text-slate-800">Filters</h2>
            <button onClick={resetFilters} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                Clear All
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4">
            <AccordionSection title="Categories" defaultExpanded>
                <div className="space-y-1">
                    {categories.map(cat => (
                        <FilterCheckbox
                            key={cat}
                            label={cat}
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                        />
                    ))}
                </div>
            </AccordionSection>

            <AccordionSection title="Price Range" defaultExpanded>
                <div className="px-2 pt-2">
                    <Slider
                        value={priceRange}
                        onChange={(e, val) => setPriceRange(val)}
                        min={0}
                        max={maximumPrice}
                        valueLabelDisplay="auto"
                        sx={{
                            color: '#6366f1',
                            '& .MuiSlider-thumb': {
                                width: 20, height: 20, backgroundColor: '#fff', border: '2px solid currentColor',
                                '&:hover': { boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)' }
                            },
                        }}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-bold text-slate-400">₹{priceRange[0]}</span>
                        <span className="text-xs font-bold text-slate-400">₹{priceRange[1]}</span>
                    </div>
                </div>
            </AccordionSection>

            <AccordionSection title="Customer Rating">
                <div className="space-y-1">
                    {[4, 3, 2].map((r) => (
                        <div
                            key={r}
                            onClick={() => setMinRating(minRating === r ? 0 : r)}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${minRating === r ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={`${i < r ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-600">& up</span>
                            </div>
                            {minRating === r && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                        </div>
                    ))}
                </div>
            </AccordionSection>
        </div>
    </div>
);

const AccordionSection = ({ title, children, defaultExpanded = false }) => (
    <Accordion defaultExpanded={defaultExpanded} elevation={0} disableGutters className="before:hidden bg-transparent mb-2">
        <AccordionSummary expandIcon={<ChevronDown size={18} className="text-slate-400" />} className="px-2 min-h-0 py-1">
            <Typography className="text-[11px] font-black uppercase tracking-wider text-slate-400">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className="px-2 pb-4">{children}</AccordionDetails>
    </Accordion>
);

const FilterCheckbox = ({ label, checked, onChange }) => (
    <label className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${checked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
            {checked && <X size={12} className="text-white rotate-45" />}
        </div>
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        <span className={`text-sm ${checked ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{label}</span>
    </label>
);

const NoResults = ({ resetFilters }) => (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[1rem] border border-slate-100 shadow-sm">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <PackageSearch size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No matches found</h2>
        <p className="text-slate-500 mb-8 max-w-xs text-center text-sm leading-relaxed">
            Try broadening your search by adjusting the filters or price range.
        </p>
        <button
            onClick={resetFilters}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
        >
            <RotateCcw size={18} /> Reset All Filters
        </button>
    </div>
);