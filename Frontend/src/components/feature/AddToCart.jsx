import { useEffect, useState } from "react";
import { CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
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
    ChevronRight,
    Ticket
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { viewCoupons } from "../../Services/Operation/categoryApi";
import { useForm } from "react-hook-form";
import { setLoading } from "../../Redux/slices/authSlice";

export default function AddToCart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

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
        dispatch(setLoading(true));
        const fetchCart = async () => {
            try {
                let res = await dispatch(viewCart());
                setData(res?.data || []);

                const couponRes = await viewCoupons();
                setCoupons(couponRes || []);
            } catch (error) {
                console.error("Cart Fetch Error:", error);
            } finally {
                dispatch(setLoading(false));
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

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                width="100%"
            >
                <CircularProgress
                    size={50}
                    thickness={4}
                    sx={{ color: '#4f46e5' }}
                />
            </Box>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 md:py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div>
                        <Link to="/" className="group inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 text-sm font-medium">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Gallery
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Shopping Cart <span className="text-indigo-600">.</span>
                        </h1>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
                        <p className="text-sm font-bold text-slate-600">
                            Total Items: <span className="text-indigo-600">{data.length}</span>
                        </p>
                    </div>
                </div>

                {data.length === 0 ? (
                    <div className="text-center py-16 md:py-20 bg-white rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-200 px-4">
                        <div className="bg-slate-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={28} className="text-slate-300" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Your cart is feeling lonely</h2>
                        <p className="text-slate-500 mb-6 sm:mb-8 max-w-xs mx-auto text-sm">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm sm:text-base">
                            Start Shopping <ChevronRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {data.map(ele => (
                                <div
                                    key={`${ele.product?._id}-${ele.size}`}
                                    className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300 group relative"
                                >
                                    {/* Layout Container for Image and Details */}
                                    <div className="flex gap-4 flex-1">
                                        {/* Image Section */}
                                        <div className="w-20 h-24 sm:w-24 sm:h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                                            <img
                                                src={ele.product?.images?.[0]}
                                                alt={ele.product?.productName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </div>

                                        {/* Info Details Section */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                                            <div>
                                                <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition pr-6 sm:pr-0">
                                                    {ele.product?.productName}
                                                </h3>

                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Size
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                                        {ele.size}
                                                    </span>

                                                    {ele.product?.discount > 0 && (
                                                        <>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                                Off
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                                                                {ele.product.discount}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price Display for Desktop / Tablet view */}
                                            <div className="hidden sm:block mt-2">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-base font-bold text-slate-900">
                                                        {new Intl.NumberFormat("en-IN", {
                                                            style: "currency",
                                                            currency: "INR",
                                                            maximumFractionDigits: 0
                                                        }).format(
                                                            ele.product?.price -
                                                            (ele.product?.price * ele.product?.discount) / 100
                                                        )}
                                                    </span>
                                                    {ele.product?.discount > 0 && (
                                                        <span className="text-xs text-slate-400 line-through">
                                                            ₹{ele.product?.price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action bar (Quantity selectors and Actions layout) */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 native-mobile-row">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
                                            <button
                                                onClick={() => handleDecrease(ele.product?._id, ele.size)}
                                                className="p-1 hover:bg-white rounded-md transition touch-manipulation"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} className="text-slate-600" />
                                            </button>

                                            <span className="px-3 text-sm font-semibold text-slate-800 min-w-[24px] text-center">
                                                {ele.quantity}
                                            </span>

                                            <button
                                                onClick={() => handleIncrease(ele.product?._id, ele.size)}
                                                className="p-1 hover:bg-white rounded-md transition touch-manipulation"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} className="text-slate-600" />
                                            </button>
                                        </div>

                                        {/* Bottom Action wrapper for mobile */}
                                        <div className="flex items-center gap-4 sm:mt-0">
                                            {/* Price display fallback for mobile layout execution */}
                                            <div className="text-right sm:hidden">
                                                <p className="text-base font-bold text-slate-900">
                                                    {new Intl.NumberFormat("en-IN", {
                                                        style: "currency",
                                                        currency: "INR",
                                                        maximumFractionDigits: 0
                                                    }).format(
                                                        ele.product?.price -
                                                        (ele.product?.price * ele.product?.discount) / 100
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(ele.product?._id, ele.size, ele.quantity)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition absolute top-3 right-3 sm:relative sm:top-0 sm:right-0"
                                                aria-label="Delete item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24">
                            <div className="bg-white p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    Summary <ShieldCheck size={20} className="text-emerald-500" />
                                </h2>

                                <div className="space-y-4 mb-6 md:mb-8">
                                    <div className="flex justify-between text-sm sm:text-base text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base text-slate-500 font-medium">
                                        <span>Platform Fee</span>
                                        <span className="text-slate-900">₹{platformFee}</span>
                                    </div>
                                    {discountValue > 0 && (
                                        <div className="flex justify-between text-sm sm:text-base text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                                            <span>Discount</span>
                                            <span>-{discountValue}%</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-slate-100 my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-base sm:text-lg font-bold text-slate-900">Total Amount</span>
                                        <span className="text-xl sm:text-2xl font-black text-indigo-600">₹{total}</span>
                                    </div>
                                </div>

                                {/* Coupon Box */}
                                <div className="mb-6">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Promo Code</label>
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input
                                            {...register("couponCode")}
                                            placeholder="Enter code..."
                                            className="bg-transparent border-none focus:ring-0 px-2 flex-1 text-sm font-bold text-slate-700 placeholder:text-slate-400 w-full min-w-0"
                                        />
                                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex-shrink-0">
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
                                        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 transition-all duration-300">
                                            {coupons.map((ele, i) => (
                                                <div
                                                    key={ele.code || i}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(ele.code);
                                                        setValue("couponCode", ele.code);
                                                    }}
                                                    className="flex justify-between items-center p-3 border border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors group"
                                                >
                                                    <span className="text-sm font-black text-slate-700">{ele.code}</span>
                                                    <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm group-hover:scale-105 transition-transform">Copy</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate("/checkout", { state: { discountValue } })}
                                    className="w-full bg-indigo-600 text-white py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 touch-manipulation"
                                >
                                    Proceed to Checkout
                                    <ChevronRight size={20} />
                                </button>

                                <p className="text-[10px] text-center text-slate-400 mt-5 font-medium uppercase tracking-wider">
                                    Secure SSL encrypted checkout
                                </p>
                            </div>
                        </div>
                    </div >
                )}
            </div >
        </div>
    );
}