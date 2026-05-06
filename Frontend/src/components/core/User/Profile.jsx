import React, { useState } from "react";
import {
  CirclePower, User, Settings, ShoppingBag, Heart,
  ChevronRight, MapPin, Package, Shield, Pen, Mail
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { editAddress, logout } from "../../../Services/Operation/authApi";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userFromStore = useSelector((state) => state.auth?.signupData);
  const data = userFromStore || JSON.parse(localStorage.getItem("user") || "{}");
  const [activeTab, setActiveTab] = useState("My Profile");

  const menuItems = [
    { icon: <User size={18} />, label: "My Profile" },
    { icon: <Settings size={18} />, label: "Account Settings" },
  ];
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-md transition-transform group-hover:scale-105"
                  src={data?.image || `https://api.dicebear.com/9.x/identicon/svg?seed=${data?.firstName + " " + data.lastName}`}
                  alt="profile"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-indigo-500 animate-ping border-2 border-white rounded-full"></span>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {data?.firstName} {data?.lastName}
                </h3>
                <p className="text-sm font-medium text-slate-500">{data?.email}</p>
              </div>

              <div className="flex gap-3 w-full mt-6">
                <StatCard label="Orders" value="0" />
                <StatCard label="Saved" value="0" />
              </div>
            </div>
          </div>

          <nav className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm ">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center justify-between px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 group ${activeTab === item.label
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeTab === item.label ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}>
                    {item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${activeTab === item.label
                      ? "bg-white translate-x-1 opacity-100 animate-pulse"
                      : "opacity-0"
                    }`}
                />
              </button>
            ))}

            <div className="h-px bg-slate-100 my-2 mx-2" />

            <button
              onClick={() => dispatch(logout(navigate))}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all font-semibold text-sm"
            >
              <CirclePower size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "My Profile" && <MyProfile data={data} />}
              {activeTab === "My Orders" && <MyOrders />}
              {activeTab === "Wishlist" && <Wishlist />}
              {activeTab === "Account Settings" && <AccountSettings data={data} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

const StatCard = ({ label, value }) => (
  <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-lg font-bold text-slate-900">{value}</p>
  </div>
);

const InputGroup = ({ label, register, type = "text", placeholder = "", disabled = false, icon: Icon }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
      <input
        {...register}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-medium disabled:bg-slate-50 disabled:text-slate-500`}
      />
    </div>
  </div>
);

function MyProfile({ data }) {
  const [isEdit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || ""
    },
  });

  const onSubmit = async (info) => {
    await dispatch(editAddress(info));
    setEdit(false);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              <p className="text-sm text-slate-500">Manage your account identity details.</p>
            </div>
          </div>
          <button
            onClick={() => setEdit(!isEdit)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isEdit ? "bg-slate-100 text-slate-600" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
          >
            <Pen size={14} />
            {isEdit ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="First Name" register={register("firstName")} disabled={!isEdit} />
            <InputGroup label="Last Name" register={register("lastName")} disabled={!isEdit} />
          </div>
          <InputGroup label="Email Address" icon={Mail} register={register("email")} disabled={!isEdit} />

          {isEdit && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-100">
                Save Changes
              </button>
            </motion.div>
          )}
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { q: "Account Security", a: "Your data is encrypted and never shared with 3rd parties." },
          { q: "Email Changes", a: "Updating email requires a one-time verification link." }
        ].map((item, i) => (
          <div key={i} className="p-5 rounded-2xl bg-indigo-600 text-white">
            <h4 className="font-bold text-sm mb-1">{item.q}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSettings({ data }) {
  const dispatch = useDispatch();
  const [isEdit, setEdit] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      street: data?.addresses[0]?.street || "",
      city: data?.addresses[0]?.city || "",
      state: data?.addresses[0]?.state || "",
      pincode: data?.addresses[0]?.pincode || "",
      country: data?.addresses[0]?.country || "",
    },
  });

  const onSubmit = (info) => {
    dispatch(editAddress({ addresses: info }));
    setEdit(false);
  };

  function formatAddress(address = {}) {
    const { street, city, state, pincode, country } = address;

    return [
      street,
      [city, state].filter(Boolean).join(", "),
      [country, pincode].filter(Boolean).join(", "),
    ]
      .filter(Boolean)
      .join("\n");
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <MapPin size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Shipping Address
            </h2>
            <p className="text-sm text-slate-500">
              Your primary delivery location
            </p>
          </div>
        </div>

        <button
          onClick={() => setEdit(!isEdit)}
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <Pen size={14} />
          {isEdit ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Address Display */}
      {!isEdit && (
        <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <MapPin size={16} className="mt-1 text-indigo-500" />
          <p className="whitespace-pre-line text-sm text-slate-700 leading-relaxed font-medium">
            {formatAddress(data?.addresses?.[0]) || "No address added"}
          </p>
        </div>
      )}

      {/* Form */}
      {isEdit && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 border-t pt-6"
        >
          <InputGroup
            label="Street Address"
            register={register("street")}
            placeholder="123 Luxury Lane"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputGroup label="City" register={register("city")} />
            <InputGroup label="State" register={register("state")} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputGroup label="Pincode" register={register("pincode")} />
            <InputGroup label="Country" register={register("country")} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEdit(false)}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


export default Profile;