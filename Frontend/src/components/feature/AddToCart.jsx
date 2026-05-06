import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    add_To_Cart,
    decreaseCartQuantity,
    deleteFromCart,
    viewCart
} from "../../Services/Operation/productApi";
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ShieldCheck,
    ArrowLeft,
    Tag,
    ChevronRight,
    Ticket
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { viewCoupons } from "../../Services/Operation/categoryApi";
import { useForm } from "react-hook-form";

export default function AddToCart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [seeCoupon, setSeeCoupon] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
    } = useForm();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                let res = await dispatch(viewCart());
                setData(res?.data || []);

                const couponRes = await viewCoupons();
                setCoupons(couponRes || []);
            } catch (error) {
                console.error("Cart Fetch Error:", error);
            }
        };
        fetchCart();
    }, [dispatch]);

    // Price calculations
    const subtotal = data.reduce((total, item) => {
        const price =
            item?.product?.price -
            (item?.product?.price * item?.product?.discount) / 100;
        return total + item.quantity * (price || 0);
    }, 0);

    const platformFee = data.length > 0 ? 10 : 0;

    const total = Math.round(
        (subtotal + platformFee) -
        ((subtotal + platformFee) * discountValue) / 100
    );

    // Quantity handlers
    const handleIncrease = async (productId, size) => {
        setData(prev =>
            prev.map(item =>
                item.product._id === productId && item.size === size
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
        try {
            await add_To_Cart(undefined, productId, size);
        } catch {
            const res = await dispatch(viewCart());
            setData(res?.data || []);
        }
    };

    const handleDecrease = async (productId, size) => {
        setData(prev =>
            prev
                .map(item =>
                    item.product._id === productId && item.size === size
                        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
        try {
            await decreaseCartQuantity(productId, size);
        } catch {
            const res = await dispatch(viewCart());
            setData(res?.data || []);
        }
    };

    const handleDelete = async (productId, size, stock) => {
        setData(prev =>
            prev.filter(
                item =>
                    !(item.product._id === productId && item.size === size)
            )
        );
        try {
            await dispatch(deleteFromCart(productId, size, stock));
        } catch {
            const res = await dispatch(viewCart());
            setData(res?.data || []);
        }
    };


    function onSubmit(info) {
        const coupon = coupons.find(
            item => item.code === info.couponCode.trim()
        );

        if (coupon) {
            setDiscountValue(coupon.discountValue);
        } else {
            setDiscountValue(0);
        }
    }
    console.log(data);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <Link to="/" className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 text-sm font-medium">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Gallery
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Shopping Cart <span className="text-indigo-600">.</span>
                        </h1>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm self-start">
                        <p className="text-sm font-bold text-slate-600">
                            Total Items: <span className="text-indigo-600">{data.length}</span>
                        </p>
                    </div>
                </div>

                {data.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is feeling lonely</h2>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                            Start Shopping <ChevronRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {data.map(ele => (
                                <div
                                    key={ele}
                                    className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group"
                                >
                                    {/* LEFT: Image + Quantity */}
                                    <div className="flex flex-col items-center gap-3">
                                        {/* Image */}
                                        <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            <img
                                                src={ele.product?.images[0]}
                                                alt={ele.product?.productName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                            />
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                                            <button
                                                onClick={() =>
                                                    handleDecrease(ele.product._id, ele.size)
                                                }
                                                className="p-1 hover:bg-white rounded-md transition cursor-pointer"
                                            >
                                                <Minus size={14} className="text-slate-600" />
                                            </button>

                                            <span className="px-3 text-sm font-semibold text-slate-800">
                                                {ele.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleIncrease(ele.product._id, ele.size)
                                                }
                                                className="p-1 hover:bg-white rounded-md transition cursor-pointer"
                                            >
                                                <Plus size={14} className="text-slate-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* MIDDLE: Info */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            {/* Title */}
                                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
                                                {ele.product?.productName}
                                            </h3>

                                            {/* Meta */}
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Size
                                                </span>
                                                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                                    {ele.size}
                                                </span>

                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                                                    Off
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                                                    {ele.product.discount}%
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    {/* RIGHT: Price + Delete */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    ele.product._id,
                                                    ele.size,
                                                    ele.quantity
                                                )
                                            }
                                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900">
                                                {new Intl.NumberFormat("en-IN", {
                                                    style: "currency",
                                                    currency: "INR",
                                                    maximumFractionDigits: 0
                                                }).format(
                                                    ele.product.price -
                                                    (ele.product.price * ele.product.discount) / 100
                                                )}
                                            </p>

                                            {/* Optional original price */}
                                            <p className="text-xs text-slate-400 line-through">
                                                ₹{ele.product.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    Summary <ShieldCheck size={20} className="text-emerald-500" />
                                </h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Platform Fee</span>
                                        <span className="text-slate-900">₹{platformFee}</span>
                                    </div>
                                    {discountValue > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                                            <span>Discount</span>
                                            <span>-{discountValue}%</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-slate-100 my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">Total Amount</span>
                                        <span className="text-2xl font-black text-indigo-600">₹{total}</span>
                                    </div>
                                </div>

                                {/* Coupon Box */}
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Promo Code</label>
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input
                                            {...register("couponCode")}
                                            placeholder="Enter code..."
                                            className="bg-transparent border-none focus:ring-0 px-3 flex-1 text-sm font-bold text-slate-700 placeholder:text-slate-400"
                                        />
                                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                                            Apply
                                        </button>
                                    </form>

                                    <button
                                        onClick={() => setSeeCoupon(!seeCoupon)}
                                        className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        <Ticket size={14} /> {seeCoupon ? "Hide available coupons" : "View available coupons"}
                                    </button>

                                    {seeCoupon && (
                                        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {coupons.map((ele, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(ele.code);
                                                        setValue("couponCode", ele.code);
                                                    }}
                                                    className="flex justify-between items-center p-3 border border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors group"
                                                >
                                                    <span className="text-sm font-black text-slate-700">{ele.code}</span>
                                                    <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm group-hover:scale-110 transition-transform">Copy</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate("/checkout", { state: { discountValue } })}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                                >
                                    Proceed to Checkout
                                    <ChevronRight size={20} />
                                </button>

                                <p className="text-[10px] text-center text-slate-400 mt-6 font-medium uppercase tracking-wider">
                                    Secure SSL encrypted checkout
                                </p>
                            </div>
                        </div>
                    </div >
                )
                }
            </div >
        </div >
    );
}