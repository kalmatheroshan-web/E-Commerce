/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, FileText, LifeBuoy, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MoreDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuItems = [
        { label: "Become seller", icon: <HelpCircle size={18} />, onClick: () => navigate("/seller-ad") },
        { label: "Terms of Service", icon: <FileText size={18} />, onClick: () => navigate("/terms") },
        { label: "Privacy Policy", icon: <ShieldCheck size={18} />, onClick: () => navigate("/privacy") },
        { label: "Contact Support", icon: <LifeBuoy size={18} />, onClick: () => navigate("/support") },
    ];

    return (
        <div
            className="relative inline-block"
            ref={dropdownRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger matches your Navbar style */}
            <div className="flex items-center gap-1 pl-2 py-1 pr-1 rounded-full hover:bg-slate-100 cursor-pointer transition-all border border-transparent hover:border-slate-200">
                <span className="text-xs font-bold tracking-widest text-slate-700 px-2">MORE</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu - Exact Styling Logic */}
            <div className={`absolute right-0 mt-0 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden transition-all duration-200 origin-top-right z-50
                ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>

                {/* Header - Styled like your User info block */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">Support & Help</p>
                    <p className="text-xs text-slate-500 truncate">FikriShop Resources</p>
                </div>

                {/* Items List */}
                <div className="p-2 space-y-1">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false);
                            }}
                            // Exact hover gradient and transition classes from your example
                            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:bg-gradient-to-r from-blue-100 to-white transition-colors text-sm font-medium"
                        >
                            <span className="text-slate-400 group-hover:text-indigo-600">
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default MoreDropdown;