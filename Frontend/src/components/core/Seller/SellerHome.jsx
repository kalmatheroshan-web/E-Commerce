import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Users, BarChart3, Settings, Package, PanelLeft, Gem, Search, Bell, ChevronDown, PlusCircle } from "lucide-react";

import Dashboard from "../../feature/Seller/Dashboard";
import AddProduct from "./AddProduct";
import SellerProducts from "../../feature/Seller/SellerProducts";
import SellerOrders from "../../feature/Seller/SellerOrders";
import Analytics from "../../feature/Seller/Analytics";
import { logout } from "../../../Services/Operation/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function SellerHome() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper to render current view
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <Dashboard setActiveTab={setActiveTab} />;
      case "Add Product": return <AddProduct />;
      case 'Products': return <SellerProducts />;
      case 'Orders': return <SellerOrders />;
      case "Analytics": return <Analytics />;
      case "Settings": return <Settings />;
      
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const { signupData: user } = useSelector(state => state.auth);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside
        className={`${isCollapsed ? "w-20" : "w-64"
          } bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out z-50`}
      >
        {/* Brand Logo */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
            <Gem size={22} />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              SellerCenter
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className={`text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 ${isCollapsed ? "text-center" : "px-2"}`}>
            {isCollapsed ? "•••" : "Main Menu"}
          </p>

          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === "Dashboard"}
            onClick={() => setActiveTab("Dashboard")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="Products"
            active={activeTab === "Products"}
            onClick={() => setActiveTab("Products")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<ShoppingBag size={20} />}
            label="Orders"
            active={activeTab === "Orders"}
            onClick={() => setActiveTab("Orders")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            active={activeTab === "Analytics"}
            onClick={() => setActiveTab("Analytics")}
            isCollapsed={isCollapsed}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "Settings"}
            onClick={() => setActiveTab("Settings")}
            isCollapsed={isCollapsed}
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
          >
            <PanelLeft className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search analytics, orders..."
                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("Add Product")}
              className="hidden md:flex cursor-pointer items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <PlusCircle size={18} />
              Add Product
            </button>

            <div className="h-10 w-[1px] bg-slate-200 mx-2" />

            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div
              className="relative inline-block"
            >
              {/* Trigger */}
              <button
                className="cursor-pointer flex items-center gap-3 hover:bg-slate-100 rounded-2xl transition-all"

                onMouseEnter={() => setOpen(true)}
              >
                <div onMouseLeave={() => setOpen(false)} className="h-9 w-9 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden">
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                </div>

                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Pro Seller</p>
                </div>

                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {/* Dropdown */}
              {open && (
                <div onMouseLeave={() => setOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden p-1.5 z-50">

                  <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    My Profile
                  </div>

                  <div className="h-px bg-gray-200 my-1"></div>

                  <div
                    onClick={() => dispatch(logout(navigate))}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : ""}
    className={`w-full flex items-center rounded-xl transition-all duration-200 group cursor-pointer
      ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}
      ${active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
  >
    <div className={`shrink-0 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`}>
      {icon}
    </div>
    {!isCollapsed && (
      <span className={`text-sm font-semibold whitespace-nowrap ${active ? "text-white" : "text-slate-600"}`}>
        {label}
      </span>
    )}
    {active && !isCollapsed && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse" />
    )}
  </button>
);

export default SellerHome;