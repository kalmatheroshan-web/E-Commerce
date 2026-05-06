import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  PlayCircle,
  TrendingUp,
  Truck,
  Wallet,
  Star,
  ShieldCheck,
  Users,
  BarChart3,
  Package,
} from "lucide-react";

function SuccessStories() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const categories = ["All", "Fashion", "Electronics", "Grocery", "Beauty", "Home"];

  const stories = useMemo(
    () => [
      {
        name: "Rahul Sharma",
        location: "Delhi",
        category: "Electronics",
        business: "Mobile Accessories Store",
        revenue: "₹18 Lakhs/month",
        rating: 4.9,
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        cover:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        quote:
          "AstraSeller helped me expand from local customers to all over India. Pickup + quick settlements made growth effortless.",
        highlight: "Scaled from 30 orders/day to 900 orders/day",
        video: "https://www.youtube.com/embed/Ke90Tje7VS0",
      },
      {
        name: "Priya Mehta",
        location: "Ahmedabad",
        category: "Fashion",
        business: "Boutique & Saree Store",
        revenue: "₹12 Lakhs/month",
        rating: 4.8,
        img: "https://randomuser.me/api/portraits/women/44.jpg",
        cover:
          "https://images.unsplash.com/photo-1520975958221-51d7e3e1b4df?auto=format&fit=crop&w=1200&q=80",
        quote:
          "My boutique went online and I started shipping across India. Promotions and catalog support boosted sales massively.",
        highlight: "1000+ repeat customers in 4 months",
        video: "https://www.youtube.com/embed/Zftx68K-1D4",
      },
      {
        name: "Arjun Nair",
        location: "Bangalore",
        category: "Home",
        business: "Kitchen & Utility Brand",
        revenue: "₹9 Lakhs/month",
        rating: 4.7,
        img: "https://randomuser.me/api/portraits/men/55.jpg",
        cover:
          "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80",
        quote:
          "Logistics is smooth and payments are fast. The analytics dashboard helped me pick winning products quickly.",
        highlight: "Reduced return rate by 35%",
        video: "https://www.youtube.com/embed/TcMBFSGVi1c",
      },
      {
        name: "Sneha Kapoor",
        location: "Mumbai",
        category: "Beauty",
        business: "Skincare Brand",
        revenue: "₹15 Lakhs/month",
        rating: 4.9,
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        cover:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        quote:
          "Astra Ads gave my skincare brand a huge boost. Within months I became a bestseller in multiple categories.",
        highlight: "Viral sales boost through Astra Ads",
        video: "https://www.youtube.com/embed/8mAITcNt710",
      },
      {
        name: "Karan Verma",
        location: "Hyderabad",
        category: "Sports",
        business: "Sports Accessories Store",
        revenue: "₹7 Lakhs/month",
        rating: 4.6,
        img: "https://randomuser.me/api/portraits/men/18.jpg",
        cover:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
        quote:
          "I started with 5 products. Now I sell trending sports items daily. Insights helped me grow fast.",
        highlight: "250+ daily orders in 90 days",
        video: "https://www.youtube.com/embed/ua-CiDNNj30",
      },
      {
        name: "Meena Reddy",
        location: "Chennai",
        category: "Grocery",
        business: "Grocery & Essentials Supplier",
        revenue: "₹10 Lakhs/month",
        rating: 4.8,
        img: "https://randomuser.me/api/portraits/women/22.jpg",
        cover:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
        quote:
          "With Astra logistics, grocery deliveries became reliable. Now I ship to multiple states daily.",
        highlight: "300+ daily deliveries across South India",
        video: "https://www.youtube.com/embed/3JluqTojuME",
      },
    ],
    []
  );

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStories =
    selectedCategory === "All"
      ? stories
      : stories.filter((s) => s.category === selectedCategory);

  const activeStory = filteredStories[activeStoryIndex] || filteredStories[0];

  const trustStats = [
    { label: "Sellers Registered", value: "1.1M+", icon: <Users className="w-5 h-5 text-[#2874f0]" /> },
    { label: "Customers Reach", value: "45 Cr+", icon: <TrendingUp className="w-5 h-5 text-[#2874f0]" /> },
    { label: "Pincodes Covered", value: "19K+", icon: <Truck className="w-5 h-5 text-[#2874f0]" /> },
    { label: "Secure Payments", value: "100%", icon: <ShieldCheck className="w-5 h-5 text-[#2874f0]" /> },
  ];

  const whyAstra = [
    {
      title: "Fast Logistics",
      desc: "Pickup from your location and delivery across India with reliable tracking.",
      icon: <Truck className="w-6 h-6 text-[#2874f0]" />,
    },
    {
      title: "Quick Settlements",
      desc: "Get paid in 7–10 days after successful delivery. Transparent fee structure.",
      icon: <Wallet className="w-6 h-6 text-[#2874f0]" />,
    },
    {
      title: "Analytics Dashboard",
      desc: "Track orders, inventory, sales trends and performance in real-time.",
      icon: <BarChart3 className="w-6 h-6 text-[#2874f0]" />,
    },
    {
      title: "Catalog Support",
      desc: "Upload products in bulk with professional listing support and promotions.",
      icon: <Package className="w-6 h-6 text-[#2874f0]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans text-slate-900">
      {/* HERO HEADER (Flipkart Style) */}
      <section className="bg-[#2874f0] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="uppercase tracking-[4px] text-xs font-black text-yellow-300">
              Seller Success Stories
            </p>

            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              India’s Top Sellers <br />
              <span className="text-yellow-300">Started Small</span>
            </h1>

            <p className="text-blue-100 leading-relaxed max-w-xl">
              Learn how sellers built successful businesses by reaching millions of
              customers with AstraSeller.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-xs font-black">
                🚚 Free Pickup
              </span>
              <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-xs font-black">
                💳 Fast Payments
              </span>
              <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-xs font-black">
                📊 Growth Dashboard
              </span>
            </div>

            <button className="mt-4 bg-yellow-400 text-slate-900 font-black px-8 py-3 rounded-md shadow-lg hover:bg-yellow-300 transition flex items-center gap-2">
              Start Selling <ArrowRight size={18} />
            </button>
          </div>

          <div className="w-full">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
              alt="Success"
              className="rounded-lg shadow-2xl border border-white/20 object-cover w-full h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* TRUST STATS BAR */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustStats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-[#f7faff] border border-blue-100 rounded-lg p-4"
            >
              <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
                <p className="text-xs font-bold text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="max-w-7xl mx-auto px-6 pt-14">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveStoryIndex(0);
              }}
              className={`px-5 py-2 rounded-md font-black text-xs uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? "bg-[#2874f0] text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED STORY + VIDEO */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden grid md:grid-cols-2">
          {/* LEFT */}
          <div className="p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">
                Featured Seller Story
              </h2>

              <span className="text-xs font-black bg-green-50 text-green-700 px-4 py-2 rounded-md border border-green-100">
                Verified Seller
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={activeStory.img}
                alt={activeStory.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#2874f0]"
              />
              <div>
                <p className="font-black text-lg">{activeStory.name}</p>
                <p className="text-sm text-slate-500 font-bold">
                  {activeStory.business}
                </p>
                <p className="text-xs font-black text-slate-500 mt-1">
                  {activeStory.category} • {activeStory.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(activeStory.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-slate-300"
                  }`}
                />
              ))}
              <span className="text-xs font-black text-slate-600 ml-2">
                {activeStory.rating} / 5
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed text-sm italic">
              “{activeStory.quote}”
            </p>

            <div className="bg-[#f7faff] border border-blue-100 rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest font-black text-blue-700">
                Key Achievement
              </p>
              <p className="text-sm font-black text-slate-900 mt-1">
                {activeStory.highlight}
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              AstraSeller provides a powerful seller dashboard, nationwide shipping,
              secure payments and promotional tools to grow faster.
            </p>

            <button className="bg-[#2874f0] text-white font-black px-6 py-3 rounded-md shadow hover:bg-blue-700 transition flex items-center gap-2">
              Read Full Story <ArrowRight size={18} />
            </button>
          </div>

          {/* RIGHT VIDEO */}
          <div className="bg-black relative">
            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-black px-4 py-2 rounded-md flex items-center gap-2 z-10">
              <PlayCircle size={16} className="text-yellow-400" />
              Seller Video Story
            </div>

            <iframe
              width="100%"
              height="100%"
              src={activeStory.video}
              title="Seller Success Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="min-h-[340px]"
            ></iframe>
          </div>
        </div>
      </section>

      {/* WHY SELL ON ASTRA (Flipkart-like cards) */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-slate-900 mb-8">
          Why Sellers Choose AstraSeller
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyAstra.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORIES GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">
            Explore More Seller Journeys
          </h2>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {filteredStories.length} Stories
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <div
              key={index}
              onClick={() => setActiveStoryIndex(index)}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-lg transition ${
                activeStoryIndex === index
                  ? "border-[#2874f0] ring-2 ring-blue-200"
                  : "border-slate-200"
              }`}
            >
              <div className="relative">
                <img
                  src={story.cover}
                  alt={story.name}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-black px-3 py-1 rounded-md flex items-center gap-2">
                  <PlayCircle size={16} className="text-yellow-400" />
                  Watch Story
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={story.img}
                    alt={story.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-black text-slate-900">{story.name}</p>
                    <p className="text-xs text-slate-500 font-bold">
                      {story.category} • {story.location}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-black text-green-600 mt-4">
                  {story.revenue}
                </p>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-2">
                  {story.quote}
                </p>

                <button className="mt-5 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3 rounded-md font-black transition flex justify-center items-center gap-2">
                  View Story <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA (Flipkart-like) */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Start Your Success Journey Today
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl leading-relaxed">
              Join AstraSeller and reach customers across India with logistics support,
              analytics dashboard and secure fast payments.
            </p>
          </div>

          <button className="bg-[#2874f0] text-white font-black px-10 py-4 rounded-md shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
            Register Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <p className="text-center text-[11px] uppercase tracking-widest font-bold">
          © 2026 AstraSeller Marketplace Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default SuccessStories;