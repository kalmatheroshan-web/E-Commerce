import { Link, useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, ShieldCheck, Star, Heart, Truck, CheckCircle2 } from "lucide-react";
import { useState, useMemo, useCallback, lazy, Suspense, useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { add_To_Cart, getReviews } from "../../Services/Operation/productApi";
import CreateReview from "../core/User/CreateReview";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// Lazy load Reviews component
const Reviews = lazy(() => import("./Reviews"));

function ProductDetail() {
    const location = useLocation();
    const product = location.state?.ele;
    const [review, setReview] = useState([]);

    // Safely set states without breaking on direct page refreshes
    const [mainImg, setMainImg] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const userFromStore = useSelector((state) => state.auth?.signupData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fetch reviews & Sync initial product state values safely
    useEffect(() => {
        if (!product) return;

        if (product.images?.[0]) setMainImg(product.images[0]);
        if (product.sizes?.[0]?.size) setSelectedSize(product.sizes[0].size);

        const fetchReviews = async () => {
            try {
                const response = await getReviews(product._id);
                if (response) setReview(response);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [product]);

    // Handle user adding item to cart
    const addToCart = useCallback(async () => {
        if (!userFromStore) {
            navigate('/login');
            return;
        }
        if (isAddingToCart) return;

        setIsAddingToCart(true);
        try {
            await dispatch(add_To_Cart(navigate, product?._id, selectedSize));
        } finally {
            setIsAddingToCart(false);
        }
    }, [userFromStore, navigate, dispatch, product?._id, selectedSize, isAddingToCart]);

    const handleSizeSelect = useCallback((size) => {
        setSelectedSize(size);
    }, []);

    const handleImageSelect = useCallback((img) => {
        setMainImg(img);
    }, []);

    // Memoized Mappings
    const productImages = useMemo(() => product?.images || [], [product?.images]);
    const productSizes = useMemo(() => product?.sizes || [], [product?.sizes]);

    // Financial Calculation Formula
    const discountedPrice = useMemo(() => {
        if (!product) return 0;
        return product.price - (product.price * (product.discount || 0) / 100);
    }, [product]);

    // Aggregate rating calculator
    const rating = useMemo(() => ({
        value: review.length > 0 ? (review.reduce((prev, cur) => cur.rating + prev, 0) / review.length).toFixed(1) : "0.0",
        count: review.length
    }), [review]);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <p className="text-xl font-semibold text-gray-800 mb-4">Product Not Found</p>
                <Link to="/" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:bg-blue-700 transition">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen antialiased">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-sm">
                        {product.productName}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Responsive Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* LEFT COLUMN: Media Showcase Panel */}
                    <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Desktop Left-Side Vertical Thumbnail Strip */}
                            <div className="hidden md:flex flex-col gap-3 flex-shrink-0">
                                {productImages.map((img, i) => (
                                    <ThumbnailButton
                                        key={i}
                                        img={img}
                                        isActive={mainImg === img}
                                        onHover={handleImageSelect}
                                    />
                                ))}
                            </div>

                            {/* Main Image Viewport Area Container */}
                            {/* CHANGED: aspect-square replaced with response ratios aspect-[3/4] on mobile, md:aspect-square on desktop */}
                            <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden relative group border border-gray-100 shadow-sm aspect-[3/4] md:aspect-square w-full">
                                {/* Desktop Zoom Display */}
                                <img
                                    src={mainImg}
                                    className="w-full h-full object-cover hidden md:block transition-transform duration-500 group-hover:scale-105"
                                    alt={product.productName}
                                    loading="eager"
                                />

                                {/* Mobile Swiper Viewport Carousel */}
                                {/* CHANGED: H-full applied cleanly to fill the parent wrapper viewport container context */}
                                <div className="w-full h-full md:hidden bg-white">
                                    <Swiper
                                        modules={[Pagination, Autoplay]}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        pagination={{ clickable: true, dynamicBullets: true }}
                                        className="w-full h-full product-swiper pb-2 [--swiper-pagination-color:#2563eb] [--swiper-pagination-bullet-inactive-color:#9ca3af]"
                                    >
                                        {productImages.map((img, i) => {
                                            const imgSrc = img.url || img;
                                            return (
                                                <SwiperSlide key={i} className="w-full h-full">
                                                    <div className="w-full h-full bg-gray-50">
                                                        <img
                                                            src={imgSrc}
                                                            alt={`${product.productName} view ${i + 1}`}
                                                            className="w-full h-full object-cover"
                                                            loading={i === 0 ? "eager" : "lazy"}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </div>

                                {/* Floating Action Favorite Wishlist Overlay */}
                                <button
                                    className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition shadow-md active:scale-95 cursor-pointer border border-gray-100"
                                    aria-label="Add to wishlist"
                                >
                                    <Heart size={20} className="text-gray-600 hover:text-red-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Horizontal Thumbnail Strip */}
                        <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                            {productImages.map((img, i) => (
                                <MobileThumbnailButton
                                    key={i}
                                    img={img}
                                    isActive={mainImg === img}
                                    onClick={handleImageSelect}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Technical Spec & Checkout */}
                    <div className="lg:col-span-5">
                        <ProductInfo
                            product={product}
                            selectedSize={selectedSize}
                            discountedPrice={discountedPrice}
                            rating={rating}
                            onSizeSelect={handleSizeSelect}
                            onAddToCart={addToCart}
                            isAddingToCart={isAddingToCart}
                            productSizes={productSizes}
                        />
                    </div>

                </div>

                {/* Consumer Review Thread Block Container */}
                {review.length > 0 && (
                    <div className="mt-16 border-t border-gray-100 pt-12">
                        <Suspense fallback={<ReviewsSkeleton />}>
                            <Reviews review={review} />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}

const ThumbnailButton = React.memo(({ img, isActive, onHover }) => {
    const srcStr = typeof img === 'string' ? img : img?.url || '';
    return (
        <button
            onMouseEnter={() => onHover(srcStr)}
            className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-gray-50
                ${isActive ? "border-blue-600 shadow-sm" : "border-gray-200 opacity-80 hover:opacity-100 hover:border-blue-400"}`}
        >
            <img src={srcStr} loading="lazy" className="w-full h-full object-cover" alt="Thumbnail" />
        </button>
    );
});

const MobileThumbnailButton = React.memo(({ img, isActive, onClick }) => {
    const srcStr = typeof img === 'string' ? img : img?.url || '';
    return (
        <button
            onClick={() => onClick(srcStr)}
            className={`w-16 h-20 flex-shrink-0 snap-start rounded-xl overflow-hidden border-2 transition-all bg-gray-50
                ${isActive ? "border-blue-600 shadow-sm" : "border-gray-100 opacity-70"}`}
        >
            <img src={srcStr} className="w-full h-full object-cover" alt="Mobile Thumbnail" loading="lazy" />
        </button>
    );
});

const ProductInfo = React.memo(({
    product,
    selectedSize,
    discountedPrice,
    rating,
    onSizeSelect,
    onAddToCart,
    isAddingToCart,
    productSizes
}) => (
    <div className="space-y-8">
        {/* Core Product Identification Header */}
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-blue-50 text-blue-700 text-[11px] tracking-wider font-extrabold uppercase px-3 py-1 rounded-full">
                    Bestseller
                </span>
                <div className="flex items-center text-amber-500 gap-1 bg-amber-50/60 px-2.5 py-0.5 rounded-lg border border-amber-100">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-gray-900">{rating.value}</span>
                    <span className="text-gray-400 font-medium text-xs ml-0.5">
                        ({rating.count.toLocaleString()})
                    </span>
                </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {product.productName}
            </h1>
            <p className="text-gray-500 mt-2 text-base">
                Premium Quality Comfort Wear
            </p>
        </div>

        {/* Pricing Architecture Segment */}
        <div className="p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    ₹{Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-lg text-gray-400 line-through font-medium">
                    ₹{product.price.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-700 text-xs font-extrabold px-2 py-0.5 rounded-md">
                    {product.discount}% OFF
                </span>
            </div>
            <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">
                <span>✓</span> Inclusive of all taxes
            </p>
        </div>

        {/* Dynamic Apparel Size Selection Drawer */}
        {!(productSizes.length === 1 && productSizes[0].size === "oneSize") && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                        Select Size
                    </span>
                    <button className="text-blue-600 text-xs font-bold hover:underline cursor-pointer">
                        Size Chart
                    </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {productSizes.map((item) => (
                        <SizeButton
                            key={item.size}
                            size={item.size}
                            isSelected={selectedSize === item.size}
                            onSelect={onSizeSelect}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* Checkout Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button
                onClick={onAddToCart}
                disabled={isAddingToCart}
                className={`flex-1 flex p-4  lg:p-0 items-center justify-center bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl text-base font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] ${
                    isAddingToCart ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                }`}
            >
                {isAddingToCart ? (
                    <div className="flex p-4 items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                    </div>
                ) : 'Add to Cart'}
            </button>
            <button className="flex-1  p-4  lg:p-0  cursor-pointer h-14 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-bold text-base hover:bg-gray-50 transition-all active:scale-[0.98]">
                Buy Now
            </button>
        </div>

        <div className="py-5 border-y border-gray-100 space-y-3.5">
            <div className="flex items-center gap-3">
                <Truck size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                    Free Delivery by{" "}
                    <span className="font-bold text-gray-900">
                        {new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                            weekday: 'long', day: 'numeric', month: 'short'
                        })}
                    </span>
                </span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm font-medium text-gray-600">
                    In Stock and ready to ship
                </span>
            </div>
        </div>

        {/* Risk Mitigation Badges */}
        <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <RefreshCw size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-gray-700">10 Days Return</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <ShieldCheck size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-gray-700">Quality Assured</span>
            </div>
        </div>

        {/* Product Technical Narrative */}
        <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                Product Details
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
                {product.description?.substr(0, 200)}...
            </p>
        </div>
    </div>
));

const SizeButton = React.memo(({ size, isSelected, onSelect }) => (
    <button
        onClick={() => onSelect(size)}
        className={`h-11 cursor-pointer text-xs w-14 sm:w-16 flex items-center justify-center rounded-xl font-bold transition-all uppercase
            ${isSelected
                ? "bg-blue-600 text-white ring-4 ring-blue-50 shadow-sm"
                : "bg-white border border-gray-200 text-gray-800 hover:border-gray-400 hover:bg-gray-50"}`}
    >
        {size}
    </button>
));

const ReviewsSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded-xl"></div>
            <div className="h-20 bg-gray-100 rounded-xl"></div>
        </div>
    </div>
);

// Explicit Debugger Display Naming Allocations
ThumbnailButton.displayName = 'ThumbnailButton';
MobileThumbnailButton.displayName = 'MobileThumbnailButton';
ProductInfo.displayName = 'ProductInfo';
SizeButton.displayName = 'SizeButton';

export default ProductDetail;