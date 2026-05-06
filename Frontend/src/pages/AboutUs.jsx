import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
    return (
        <div className="bg-white mt-20 text-gray-800">

            <section className="bg-indigo-600 text-white py-16 px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    About Our Store
                </h1>
                <p className="max-w-2xl mx-auto text-sm md:text-lg text-indigo-100">
                    We bring you the best products at unbeatable prices with a seamless shopping experience.
                </p>
            </section>

            <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-indigo-600">
                        Our Story
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Started with a simple idea — make online shopping easy, affordable, and reliable.
                        Today, we serve thousands of happy customers with a wide range of quality products.
                    </p>
                    <p className="text-gray-600">
                        Our mission is to deliver value and trust, ensuring every purchase feels worth it.
                    </p>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                        alt="shopping"
                        className="rounded-xl w-full h-[250px] object-cover"
                    />
                </div>
            </section>
            <section className="bg-gray-900 text-white py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Happy Customers", value: "10K+" },
                        { label: "Products", value: "5K+" },
                        { label: "Orders Delivered", value: "50K+" },
                        { label: "Years of Service", value: "5+" },
                    ].map((item, i) => (
                        <div key={i}>
                            <h3 className="text-2xl md:text-3xl font-bold text-indigo-400">
                                {item.value}
                            </h3>
                            <p className="text-gray-300 mt-2 text-sm">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            
            <section className="py-16 px-6 max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-indigo-600">
                    Why Choose Us
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Quality Products",
                            desc: "We ensure top quality across all our products.",
                        },
                        {
                            title: "Fast Delivery",
                            desc: "Quick and reliable delivery at your doorstep.",
                        },
                        {
                            title: "Secure Payments",
                            desc: "100% safe and secure payment methods.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>


            <section className="bg-indigo-600 text-white py-16 text-center px-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Start Shopping Today
                </h2>
                <p className="text-indigo-100 mb-6">
                    Discover amazing deals and trending products now.
                </p>
                <Link to="/"

                    className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                    Shop Now
                </Link>
            </section>

        </div>
    );
}