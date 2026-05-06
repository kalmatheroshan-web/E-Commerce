import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4">
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-indigo-100/40 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-slate-200/40 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center relative z-10"
      >
        {/* Icon / Visual Element */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-24 h-24 bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-sm relative">
            <Search className="text-slate-400" size={40} strokeWidth={1.5} />
            {/* The "404" Badge */}
            <span className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-indigo-200">
              Error 404
            </span>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
          Lost in the <span className="text-indigo-600">void?</span>
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to familiar territory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm text-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 text-sm"
          >
            <Home size={18} />
            Home Screen
          </button>
        </div>

        {/* Quick Links / Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Useful Links
          </p>
          <div className="flex justify-center gap-6 text-sm font-semibold text-slate-500">
            <button onClick={() => navigate("/help")} className="hover:text-indigo-600 transition-colors">Help Center</button>
            <button onClick={() => navigate("/contact")} className="hover:text-indigo-600 transition-colors">Contact Support</button>
            <button onClick={() => navigate("/shop")} className="hover:text-indigo-600 transition-colors">All Products</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;