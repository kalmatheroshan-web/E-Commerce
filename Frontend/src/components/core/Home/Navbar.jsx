/* eslint-disable no-unused-vars */
import { BaggageClaim, Search, User, X, Package2, UserRoundPen, LogOut, CreditCard, Heart, ChevronDown, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Services/Operation/authApi';
import MoreDropdown from './Moredropdown';
import { searchResult } from '../../../Services/Operation/searchApi';

function Navbar() {
    const [showProfile, setShowProfile] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [result, setResult] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Mobile search toggle

    const { signupData, role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const timerRef = useRef(null);
    const searchRef = useRef(null);

    // Close search/dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResult([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounced Search Logic
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            let res = await searchResult(searchValue);
            setResult(res || []);
        }, 100);

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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b 
            ${isScrolled ? "bg-white/90 shadow-sm backdrop-blur-md border-slate-200" : "bg-white border-transparent"} px-4 md:px-8 py-3`}>
            
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 hover:bg-slate-100 rounded-md">
                        <Menu size={24} className="text-slate-600" />
                    </button>
                    <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
                        <div className="bg-indigo-600 p-1.5 rounded-xl shadow-indigo-100 shadow-lg">
                            <Package2 className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800">
                            Fikri<span className="text-indigo-600">Shop</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Search Bar */}
                <div ref={searchRef} className="hidden lg:flex flex-1 items-center max-w-xl relative">
                    <div className="flex items-center w-full bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all group">
                        <Search className="text-slate-400 group-focus-within:text-indigo-600" size={18} />
                        <input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                            className="w-full bg-transparent outline-none text-sm px-3 text-slate-700"
                            placeholder="Search products..."
                        />
                        {searchValue && <X className="text-slate-400 cursor-pointer" size={16} onClick={() => setSearchValue("")} />}
                    </div>

                    {/* Search Result Dropdown */}
                    {result.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="max-h-[350px] overflow-y-auto">
                                {result.map((item, index) => (
                                    <div key={index} onClick={() => handleSearchSubmit(item)} className="flex gap-4 items-center p-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b last:border-0 border-slate-50">
                                        <img src={item?.images?.[0] || "/placeholder.png"} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700">{item?.productName}</span>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">{item?.category?.categoryName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                        <Search size={22} />
                    </button>

                    <Link to="/addToCart" className="relative p-2.5 rounded-full hover:bg-slate-100 group transition-colors">
                        <BaggageClaim size={22} className="text-slate-600 group-hover:text-indigo-600" />
                        {signupData?.cart?.length > 0 && (
                            <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                                {signupData.cart.length}
                            </span>
                        )}
                    </Link>

                    {signupData && role === 'customer' ? (
                        <div className="relative" onMouseEnter={() => setShowProfile(true)} onMouseLeave={() => setShowProfile(false)}>
                            <button className="flex cursor-pointer items-center gap-2 pl-2 py-1 pr-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                                    {signupData.firstName?.charAt(0)}
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${showProfile ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            <div className={`absolute right-0 mt-0 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden transition-all duration-200 origin-top-right
                                ${showProfile ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                                <div className="p-4 bg-slate-50 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-800">{signupData.firstName} {signupData.lastName}</p>
                                    <p className="text-xs text-slate-500 truncate">{signupData.email}</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <button onClick={() => navigate('/profile')} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:bg-gradient-to-r from-blue-100 to-white  transition-colors text-sm font-medium">
                                        <UserRoundPen size={18} /> Profile
                                    </button>
                                    <button onClick={() => navigate('/orders')} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:bg-gradient-to-r from-blue-100 to-white transition-colors text-sm font-medium">
                                        <Package2 size={18} /> Orders
                                    </button>
                                    <div className="h-px bg-slate-100 my-1" />
                                    <button onClick={() => dispatch(logout(navigate))} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-gradient-to-r from-rose-50 to-white transition-colors text-sm font-medium">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        !location.pathname.includes('login') && (
                            <button onClick={() => navigate('/login')} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all active:scale-95">
                                Login
                            </button>
                        )
                    )}
                    <div className="hidden sm:block"><MoreDropdown /></div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white p-4 shadow-xl border-b border-slate-100 animate-in slide-in-from-top">
                    <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2">
                        <Search size={18} className="text-slate-400" />
                        <input
                            autoFocus
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                            className="w-full bg-transparent outline-none px-3 text-sm"
                            placeholder="Search..."
                        />
                        <X size={18} className="text-slate-400" onClick={() => setIsSearchOpen(false)} />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;