import { Link, useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, ShieldCheck, Star, Heart, Truck, CheckCircle2 } from "lucide-react";
import { useState, useMemo, useCallback, lazy, Suspense, useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { add_To_Cart, getReviews } from "../../Services/Operation/productApi";
import CreateReview from "../core/User/CreateReview";

// Lazy load Reviews component
const Reviews = lazy(() => import("./Reviews"));

function ProductDetail() {
    const location = useLocation();
    const product = location.state?.ele;
    const [review, setReview] = useState([]);
    console.log(product);


    useEffect(() => {
        (
            async () => {
                const response = await getReviews(product._id);
                setReview(response);
            }
        )()
    }, []);


    // Memoize initial state values
    const initialMainImg = useMemo(() => product?.images?.[0], [product]);
    const initialSelectedSize = useMemo(() => product?.sizes?.[0]?.size, [product]);

    const [mainImg, setMainImg] = useState(initialMainImg);
    const [selectedSize, setSelectedSize] = useState(initialSelectedSize);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const userFromStore = useSelector((state) => state.auth?.signupData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Memoize handlers
    const addToCart = useCallback(async () => {
        if (!userFromStore) {
            navigate('/login');
            return;
        }

        if (isAddingToCart) return; // Prevent multiple clicks

        setIsAddingToCart(true);
        try {
            await dispatch(add_To_Cart(navigate, product._id, selectedSize));
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



    // Memoize product images array for thumbnails
    const productImages = useMemo(() => product.images, [product.images]);
    const productSizes = useMemo(() => product.sizes, [product.sizes]);

    // Memoize computed values
    const discountedPrice = useMemo(() => product.price - product.price * product.discount / 100, [product.price]);


    const rating = useMemo(() => ({
        value: review.reduce((prev, cur) => cur.rating + prev, 0) / review.length || 0,
        count: review.length
    }), [review]);

    if (!product) {
        return <div className="p-20 text-center text-gray-600">Product Not Found</div>;
    }


    return (
        <div className="bg-white min-h-screen pt-20">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600 transition">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[250px] sm:max-w-full">
                        {product.productName}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* LEFT COLUMN */}
                    <div className="lg:top-28 self-start">
                        <div className="flex gap-4">
                            {/* Thumbnails */}
                            <div className="hidden md:flex flex-col gap-3">
                                {productImages.map((img, i) => (
                                    <ThumbnailButton
                                        key={i}
                                        img={img}
                                        isActive={mainImg === img}
                                        onHover={handleImageSelect}
                                    />
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden relative group border border-gray-100">
                                <img
                                    src={mainImg}
                                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110"
                                    alt={product.productName}
                                    loading="eager" // Prioritize main image
                                />

                                <button
                                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition shadow-md active:scale-95"
                                    aria-label="Add to wishlist"
                                >
                                    <Heart
                                        size={20}
                                        className="text-gray-600 hover:text-red-500 transition-colors"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Thumbnails */}
                        <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-2">
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

                    {/* RIGHT COLUMN */}
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

                {/* Reviews Section with Suspense */}
                {
                    review.length > 0 && <div className="mt-0 border-t h-full border-gray-100 pt-18">
                        <Suspense fallback={<ReviewsSkeleton />}>
                            <Reviews review={review} />
                        </Suspense>
                    </div>}
            </div>
        </div>
    );
}

// Extracted components for better performance

const ThumbnailButton = React.memo(({ img, isActive, onHover }) => (
    <button
        onMouseEnter={() => onHover(img)}
        className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all cursor-pointer
            ${isActive
                ? "border-blue-600 shadow-md"
                : "border-gray-200 opacity-70 hover:opacity-100 hover:border-blue-400"
            }`}
    >
        <img
            src={img}
            loading="lazy"
            className="w-full h-full object-cover"
            alt=""
        />
    </button>
));

const MobileThumbnailButton = React.memo(({ img, isActive, onClick }) => (
    <button
        onClick={() => onClick(img)}
        className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all
            ${isActive
                ? "border-blue-600 shadow-md"
                : "border-gray-200 opacity-70 hover:opacity-100"
            }`}
    >
        <img
            src={img}
            className="w-full h-full object-cover"
            alt=""
            loading="lazy"
        />
    </button>
));

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
        {/* Header */}
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-blue-50 text-blue-700 text-[11px] font-bold uppercase px-3 py-1 rounded-full">
                    Bestseller
                </span>

                <div className="flex items-center text-amber-500 gap-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-gray-900">{rating.value}</span>
                    <span className="text-gray-400 font-medium text-sm">
                        ({rating.count.toLocaleString()} Reviews)
                    </span>
                </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {product.productName}
            </h1>
            <p className="text-gray-500 mt-2 text-base sm:text-lg">
                Premium Quality Comfort Wear
            </p>
        </div>

        {/* Pricing */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl sm:text-4xl font-black text-gray-900">
                    ₹{Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-lg text-gray-400 line-through">
                    ₹{product.price.toLocaleString()}
                </span>
                <span className="text-green-600 font-bold text-sm">
                    {product.discount} % OFF
                </span>
            </div>
            <p className="text-green-600 text-sm font-semibold mt-1">
                Inclusive of all taxes
            </p>
        </div>


        {/* Size */}
        <div>
            {(productSizes.length === 1 && productSizes[0].size === "oneSize") ? "" : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-900 text-md">
                            Select Size
                        </span>
                        <button className="text-blue-600 text-sm font-bold hover:underline">
                            Size Chart  {productSizes.length}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {productSizes?.map((item) => (
                            <SizeButton
                                key={item.size}
                                size={item.size}
                                isSelected={selectedSize === item.size}
                                onSelect={onSizeSelect}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
                onClick={onAddToCart}
                disabled={isAddingToCart}
                className={`flex items-center justify-center flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95
                    ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="flex-1 cursor-pointer bg-white border-2 border-gray-900 text-gray-900 h-14 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all active:scale-95">
                Buy Now
            </button>
        </div>

        {/* Delivery */}
        <div className="py-6 border-y border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
                <Truck size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                    Free Delivery by{" "}
                    <span className="font-bold text-gray-900">

                        {
                            new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                                weekday: 'long',
                                day: 'numeric',
                                month: "short",
                                year: 'numeric'
                            })
                        }
                    </span>
                </span>
            </div>

            <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                    In Stock and ready to ship
                </span>
            </div>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <RefreshCw size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-gray-700">
                    10 Days Return
                </span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <ShieldCheck size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-gray-700">
                    Quality Assured
                </span>
            </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-lg">
                Product Details
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {product.description.substr(0, 200)}
            </p>
        </div>
    </div>
));

const SizeButton = React.memo(({ size, isSelected, onSelect }) => (
    <button
        onClick={() => onSelect(size)}
        className={`h-11 cursor-pointer text-sm w-16 flex items-center justify-center rounded-xl font-bold transition-all
            ${isSelected
                ? "bg-blue-600 text-white ring-2 ring-blue-200 shadow-md"
                : "bg-white border border-gray-200 hover:border-blue-600 hover:bg-blue-50"
            }`}
    >
        {size}
    </button>
));

const ReviewsSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
            <div className="h-24 bg-gray-200 rounded">hello</div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// Add display names for better debugging
ThumbnailButton.displayName = 'ThumbnailButton';
MobileThumbnailButton.displayName = 'MobileThumbnailButton';
ProductInfo.displayName = 'ProductInfo';
SizeButton.displayName = 'SizeButton';

export default ProductDetail;