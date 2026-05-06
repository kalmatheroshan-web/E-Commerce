import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Truck, ShieldCheck, ArrowRight,
    CreditCard as CardIcon, Phone, Mail, User, MapPin,
    Lock, Package, ChevronRight
} from "lucide-react";

import {
    createOrder,
    placeOrder,
    verify_payment
} from "../../Services/Operation/productApi";

/**
 * Reusable Style Constants
 * Keeps the JSX clean and the UI consistent
 */
const STYLES = {
    container: "min-h-screen bg-slate-50 pb-20 font-sans text-slate-900",
    headerSection: "bg-white border-b border-slate-200 mb-8",
    headerContent: "max-w-7xl mx-auto px-4 py-6 flex items-center justify-between",
    mainGrid: "max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-12 gap-8 items-start",

    // Card Styles
    card: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
    sectionPadding: "p-6 md:p-8",
    sectionTitle: "text-lg font-semibold text-slate-800 flex items-center gap-3 mb-6",

    // Form Elements
    inputGroup: "space-y-1.5",
    label: "text-sm font-medium text-slate-700 ml-1",
    inputWrapper: "relative group transition-all",
    inputIcon: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors",
    input: "w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-slate-400",
    inputSmall: "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500",

    // Buttons
    primaryBtn: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",

    // Order Summary
    summaryItem: "flex justify-between items-start gap-4 text-slate-600",
    badge: "px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md uppercase tracking-wider"
};

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { signupData } = useSelector((state) => state.auth);
    const cartItems = signupData?.cart ?? [];

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            paymentMethod: "online",
        },
    });

    useEffect(() => {
        if (signupData) {
            reset({
                name: `${signupData.firstName} ${signupData.lastName}`,
                email: signupData.email,
                country: "India",
                paymentMethod: "online"
            });
        }
    }, [signupData, reset]);

    const paymentMethod = watch("paymentMethod");

    const shippingFee = 0;
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item?.product?.price || 0;
        const discount = item?.product?.discount || 0;
        const finalPrice = price - (price * discount) / 100;
        return sum + finalPrice * item.quantity;
    }, 0);

    const location = useLocation();
    const discountValue = location?.state?.discountValue || 0;
    const totalAmount = Math.round((subtotal + shippingFee + 10) - (subtotal + shippingFee + 10)* discountValue/100);

    const onSubmit = async (data) => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const orderData = {
            address: {
                street: data.street,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
            },
            items: cartItems,
            paymentMethod: data.paymentMethod,
            totalAmount,
        };

        try {
            if (data.paymentMethod === "COD") {
                await dispatch(placeOrder(orderData));
                toast.success("Order placed successfully!");
                navigate("/orders");
                return;
            }

            const orderRes = await createOrder(totalAmount);
            const order = orderRes.order;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Fikri Shop",
                description: "Secure Checkout",
                prefill: {
                    name: data.name,
                    email: data.email,
                    contact: data.phone,
                },
                theme: { color: "#4F46E5" },
                handler: async (response) => {
                    try {
                        await verify_payment(response);
                        await dispatch(placeOrder({
                            ...orderData,
                            paymentId: response.razorpay_payment_id,
                        }));
                        toast.success("Payment successful!");
                        navigate("/orders");
                    } catch (error) {
                        console.log(error);
                        toast.error("Payment verification failed.");
                    }
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            toast.error(err?.message || "Checkout failed");
        }
    };

    return (
        <div className={STYLES.container}>
            {/* Simple Checkout Header */}
            <header className={STYLES.headerSection}>
                <div className={STYLES.headerContent}>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight">Checkout</h1>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Secure Encrypted Transaction</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                        Return to cart
                    </button>
                </div>
            </header>

            <main className={STYLES.mainGrid}>
                {/* LEFT COLUMN - Information Forms */}
                <div className="lg:col-span-7 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Personal Details */}
                        <div className={STYLES.card}>
                            <div className={STYLES.sectionPadding}>
                                <h2 className={STYLES.sectionTitle}>
                                    <User className="w-5 h-5 text-indigo-600" />
                                    Personal Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className={STYLES.label}>Full Name</label>
                                        <div className={STYLES.inputWrapper}>
                                            <User className={STYLES.inputIcon} />
                                            <input {...register("name", { required: true })} className={STYLES.input} placeholder="John Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={STYLES.label}>Email Address</label>
                                        <div className={STYLES.inputWrapper}>
                                            <Mail className={STYLES.inputIcon} />
                                            <input type="email" {...register("email", { required: true })} className={STYLES.input} placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={STYLES.label}>Phone Number</label>
                                        <div className={STYLES.inputWrapper}>
                                            <Phone className={STYLES.inputIcon} />
                                            <input type="tel" {...register("phone", { required: true })} className={STYLES.input} placeholder="+91 00000 00000" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className={STYLES.card}>
                            <div className={STYLES.sectionPadding}>
                                <h2 className={STYLES.sectionTitle}>
                                    <MapPin className="w-5 h-5 text-indigo-600" />
                                    Shipping Address
                                </h2>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className={STYLES.label}>Street Address</label>
                                        <div className={STYLES.inputWrapper}>
                                            <MapPin className={STYLES.inputIcon} />
                                            <input {...register("street", { required: true })} className={STYLES.input} placeholder="House No, Building, Street Name" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={STYLES.label}>City</label>
                                        <input {...register("city", { required: true })} className={STYLES.inputSmall} placeholder="Mumbai" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={STYLES.label}>State</label>
                                        <input {...register("state", { required: true })} className={STYLES.inputSmall} placeholder="Maharashtra" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={STYLES.label}>Pincode</label>
                                        <input {...register("pincode", { required: true })} className={STYLES.inputSmall} placeholder="400001" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={STYLES.label}>Country</label>
                                        <input {...register("country")} disabled className={`${STYLES.inputSmall} bg-slate-50 text-slate-500 cursor-not-allowed`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className={STYLES.card}>
                            <div className={STYLES.sectionPadding}>
                                <h2 className={STYLES.sectionTitle}>
                                    <CardIcon className="w-5 h-5 text-indigo-600" />
                                    Payment Method
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { id: "online", label: "Online Payment", sub: "Cards, UPI, Netbanking" },
                                        { id: "COD", label: "Cash on Delivery", sub: "Pay when you receive" }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all flex flex-col gap-1 ${paymentMethod === method.id
                                                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10"
                                                    : "border-slate-100 hover:border-slate-200"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-slate-800">{method.label}</span>
                                                <input type="radio" value={method.id} {...register("paymentMethod")} className="mt-1 w-4 h-4 text-indigo-600" />
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{method.sub}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Submission Button */}
                        <button type="submit" disabled={isSubmitting || cartItems.length === 0} className={STYLES.primaryBtn}>
                            {isSubmitting ? "Processing Transaction..." : `Complete Purchase • ₹${totalAmount}`}
                            {!isSubmitting && <ArrowRight size={20} />}
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN - Sticky Summary */}
                <div className="lg:col-span-5 lg:sticky lg:top-8">
                    <div className={STYLES.card}>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Package size={18} className="text-slate-400" />
                                Your Order
                            </h2>
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => {
                                    const price = item?.product?.price || 0;
                                    const discount = item?.product?.discount || 0;
                                    const finalPrice = Math.round(price - (price * discount) / 100);

                                    return (
                                        <div key={item._id} className={STYLES.summaryItem}>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.product.productName}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} × ₹{finalPrice}</p>
                                            </div>
                                            <span className="font-bold text-slate-800">₹{finalPrice * item.quantity}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-6 border-t border-dashed border-slate-200 space-y-3">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-800">₹{Math.round(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Shipping Fee</span>
                                    <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Processing Fee</span>
                                    <span className="font-medium text-slate-800">₹10</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 text-xl">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-black text-indigo-600">₹{totalAmount}</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex gap-4 items-start border border-slate-100">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <ShieldCheck className="text-indigo-600 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-700 font-bold">Secure Checkout</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Your data is protected by industry-standard 256-bit SSL encryption.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}