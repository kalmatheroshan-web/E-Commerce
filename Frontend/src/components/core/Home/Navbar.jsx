import { BaggageClaim, Search, User, X, Package2, UserRoundPen, LogOut, CreditCard, Heart, ChevronDown, Menu, Eye, Home, ShoppingBag, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Services/Operation/authApi';
import MoreDropdown from './MoreDropdown';
import { searchResult } from '../../../Services/Operation/searchApi';

function Navbar() {
    const [showProfile, setShowProfile] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [result, setResult] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { signupData, role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const timerRef = useRef(null);
    const searchRef = useRef(null);

    // Close Mobile Menu on route change
    useEffect(() => {
        (() => {
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
        })()
    }, [location.pathname]);

    // Handle Scroll for sticky effects
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounced Search Logic
    useEffect(() => {
        if (searchValue.trim() === "") {
            (() => {
                setResult([]);
            })()
            return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            let res = await searchResult(searchValue);
            setResult(res || []);
        }, 300);
        return () => clearTimeout(timerRef.current);
    }, [searchValue]);

    const handleSearchSubmit = (item) => {
        setResult([]);
        setSearchValue("");
        setIsSearchOpen(false);
        const targetResult = item ? [item] : result;
        navigate(`/search/${item?.productName || searchValue}`, {
            state: { Result: targetResult }
        });
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-slate-200" : "bg-white border-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between gap-4">

                        {/* LEFT: Menu & Logo */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 transition"
                            >
                                <Menu size={24} className="text-slate-700" />
                            </button>

                            <Link to="/" className="flex items-center gap-2 active:scale-95 transition">
                                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                                    <Package2 className="text-white" size={20} />
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-800  xs:block">
                                    Fikri<span className="text-indigo-600">Shop</span>
                                </h1>
                            </Link>
                        </div>

                        {/* CENTER: Desktop Search */}
                        <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl relative">
                            <div className="w-full flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                                <Search size={18} className="text-slate-400" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                                    placeholder="Search for products..."
                                    className="w-full bg-transparent outline-none text-sm px-3 text-slate-700 h-6"
                                />
                                {searchValue && (
                                    <button onClick={() => setSearchValue("")}>
                                        <X size={16} className="text-slate-400 hover:text-slate-600" />
                                    </button>
                                )}
                            </div>

                            {/* Desktop Search Results */}
                            {result.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50">
                                    <div className="max-h-80 overflow-y-auto">
                                        {result.map((item, index) => (
                                            <div key={index} onClick={() => handleSearchSubmit(item)} className="flex items-center gap-3 p-3 hover:bg-indigo-50 transition cursor-pointer border-b border-slate-50 last:border-0">
                                                <img src={item?.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-700">{item?.productName}</span>
                                                    <span className="text-xs text-slate-400">{item?.category?.categoryName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Mobile Search Toggle */}
                            <button onClick={() => setIsSearchOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-slate-100">
                                <Search size={22} className="text-slate-700" />
                            </button>

                            <Link to="/addToCart" className="relative p-2.5 rounded-full hover:bg-slate-100 transition">
                                <BaggageClaim size={24} className="text-slate-700" />
                                {signupData?.cart?.length > 0 && (
                                    <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
                                        {signupData.cart.length}
                                    </span>
                                )}
                            </Link>

                            {signupData && role === "customer" ? (
                                <div className="relative" onMouseEnter={() => setShowProfile(true)} onMouseLeave={() => setShowProfile(false)}>
                                    <button className="flex items-center gap-1 rounded-full p-1 hover:bg-slate-100 transition border border-transparent">
                                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-100">
                                            {signupData.firstName?.charAt(0)}
                                        </div>
                                        <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform ${showProfile ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Profile Dropdown */}
                                    <div className={`absolute right-0 top-full pt-2 w-56 transition-all duration-200 ${showProfile ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                                        <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
                                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                                <p className="font-semibold text-slate-800 text-sm truncate">{signupData.firstName} {signupData.lastName}</p>
                                                <p className="text-xs text-slate-500 truncate">{signupData.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 text-sm transition text-slate-600"><UserRoundPen size={18} /> Profile</button>
                                                <button onClick={() => navigate("/orders")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 text-sm transition text-slate-600"><Package2 size={18} /> Orders</button>
                                                <hr className="my-1 border-slate-100" />
                                                <button onClick={() => dispatch(logout(navigate))} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-sm transition"><LogOut size={18} /> Logout</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                !location.pathname.includes("login") && (
                                    <button onClick={() => navigate("/login")} className="hidden cursor-pointer sm:block bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition active:scale-95">
                                        Login
                                    </button>
                                )
                            )}
                            <div className="hidden md:block">
                                <MoreDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MOBILE SEARCH OVERLAY --- */}
            <div className={`fixed inset-0 bg-white z-[60] transition-transform duration-300 lg:hidden ${isSearchOpen ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSearchOpen(false)} className="p-2 -ml-2"><X size={24} /></button>
                        <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-3 py-2">
                            <Search size={18} className="text-slate-400" />
                            <input
                                autoFocus
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                                placeholder="Search products..."
                                className="w-full bg-transparent outline-none px-2 text-base"
                            />
                        </div>
                    </div>
                    <div className="mt-4 overflow-y-auto flex-1">
                        {result.map((item, index) => (
                            <div key={index} onClick={() => handleSearchSubmit(item)} className="flex items-center gap-4 py-3 border-b border-slate-50">
                                <img src={item?.images?.[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                <div>
                                    <p className="font-medium text-slate-800">{item.productName}</p>
                                    <p className="text-xs text-slate-500">{item?.category?.categoryName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MOBILE SIDEBAR MENU --- */}
            <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] transition-opacity lg:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`w-3/4 max-w-xs h-full bg-white transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-xl font-bold">Fikri<span className="text-indigo-600">Shop</span></h1>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="space-y-2">
                            <Link to="/" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700"><Home size={20} /> Home</Link>
                            <Link to="/products" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700"><ShoppingBag size={20} /> Shop</Link>
                            {signupData && (
                                <>
                                    <Link to="/profile" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700"><User size={20} /> My Profile</Link>
                                    <Link to="/orders" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700"><Package2 size={20} /> My Orders</Link>
                                </>
                            )}
                        </div>

                        {!signupData && (
                            <button onClick={() => navigate("/login")} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold">Login / Sign Up</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16"></div>
        </>
    );
}

export default Navbar;