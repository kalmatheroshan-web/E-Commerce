import React from 'react';
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";

export default function SearchResult({ data }) {
    console.log(data);
    return (
        <div className="min-h-screen py-4">
            <div className="max-w-[1200px] mx-auto bg-white shadow-sm">
                {data?.map((ele, index) => (
                    <Link
                        to={`/product/${ele._id}`}
                        key={ele._id}
                        state={{ ele }}
                        className={`flex flex-col md:flex-row p-6 group hover:shadow-2xl transition-shadow duration-300 border-b border-gray-100 relative ${
                            index === data.length - 1 ? '' : 'border-b'
                        }`}
                    >
                        
                        {/* Left: Image Section */}
                        <div className="w-full md:w-1/4 flex justify-center items-start mb-4 md:mb-0">
                            <div className="relative h-52 w-full flex items-center justify-center overflow-hidden">
                                <img
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    src={ele.images[0]}
                                    alt={ele.productName}
                                />
                            </div>
                        </div>

                        {/* Center: Details Section */}
                        <div className="w-full md:w-1/2 md:px-8 space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                                {ele.productName}
                            </h3>
                            
                            {/* Rating & Reviews */}
                            <div className="flex items-center gap-2">
                                <span className="bg-green-700 text-white text-[12px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    4.5 <Star size={10} fill="white" />
                                </span>
                                <span className="text-gray-500 text-sm font-medium">
                                    (2,450 Ratings & 180 Reviews)
                                </span>
                            </div>

                            {/* Key Specs List */}
                            <ul className="text-sm text-gray-600 space-y-1.5 mt-3 list-disc pl-4">
                                <li className="line-clamp-1">{ele.description}</li>
                                <li>1 Year Manufacturer Warranty</li>
                                <li>7 Days Replacement Policy</li>
                            </ul>
                        </div>

                        {/* Right: Pricing Section */}
                        <div className="w-full md:w-1/4 flex flex-col items-start md:items-start pt-2 md:pt-0">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{(ele.price-ele.price*ele.discount/100).toLocaleString('en-IN')}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500 line-through">
                                    ₹{(ele.price).toLocaleString('en-IN')}
                                </span>
                                <span className="text-green-700 text-sm font-bold">
                                    {ele?.discount}% off
                                </span>
                            </div>

                            <p className="text-xs text-gray-900 mt-2">
                                Free delivery
                            </p>
                            
                            <p className="text-sm text-green-700 font-bold mt-1">
                                Bank Offer Applied
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}