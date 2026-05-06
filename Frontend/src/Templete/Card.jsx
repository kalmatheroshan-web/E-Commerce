import React from "react";
import { Link } from "react-router-dom";

export default function Card({ data = [] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.map((ele) => {
                const {
                    _id,
                    productName,
                    price,
                    images = [],
                } = ele;
                return (
                    <Link
                        to={`/product/${_id}`} 
                        key={_id}
                        state={{ ele }}
                        className="group bg-white p-3 rounded-xl  hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100">
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={images[0] || "/placeholder.png"} // ✅ fallback
                                alt={productName || "Product"}
                                loading="lazy"
                            />
                        </div>

                        {/* Details */}
                        <div className="mt-3 space-y-1">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-1">
                                {productName}
                            </h3>

                            <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-gray-900">
                                    ₹{price?.toLocaleString("en-IN") || "0"}
                                </p>

                                <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded text-xs font-semibold text-green-700">
                                    <span>4.5</span>
                                    <span>★</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400">Free Delivery</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}