import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  ArrowRight,
  Store,
  Zap,
  Truck,
  Wallet,
  BarChart3,
  Package,
  UserPlus,
  Plus,
  Minus,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const Seller = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const highlights = useMemo(
    () => [
      {
        title: "0% Commission",
        desc: "Keep more of what you earn with our transparent fee structure.",
        icon: <Wallet className="w-6 h-6 text-blue-600" />,
      },
      {
        title: "Pan-India Reach",
        desc: "Ship to 19,000+ pin codes across the country effortlessly.",
        icon: <Truck className="w-6 h-6 text-blue-600" />,
      },
      {
        title: "Quick Payments",
        desc: "Get your funds settled within 7-10 days of delivery.",
        icon: <Zap className="w-6 h-6 text-blue-600" />,
      },
    ],
    []
  );

  const onboardingSteps = [
    {
      title: "Register & Verify",
      desc: "Submit GSTIN, PAN and bank details to activate your seller profile.",
      icon: <UserPlus className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "List Your Products",
      desc: "Upload products in bulk with photos, pricing, and descriptions.",
      icon: <Package className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Start Selling",
      desc: "Receive orders, pack items, and let Fikri Logistics handle shipping.",
      icon: <Truck className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Grow with Analytics",
      desc: "Use insights to optimize pricing, inventory and conversions.",
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    },
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      city: "Delhi",
      text: "I scaled my electronics business 10x within 6 months. Fikri logistics support is outstanding.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Mehta",
      city: "Ahmedabad",
      text: "The dashboard insights helped me improve pricing and increase sales quickly.",
      img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "Arjun Nair",
      city: "Bangalore",
      text: "Quick payments and smooth pickup service. Best platform for new sellers.",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
  ];

  const faqs = [
    {
      q: "What documents are required to register?",
      a: "You need GSTIN, PAN Card (Personal or Business), and an active Bank Account.",
    },
    {
      q: "How do I list my products?",
      a: "Once verified, use our portal to upload products in bulk using CSV or manual listing.",
    },
    {
      q: "Who handles shipping and delivery?",
      a: "Fikri Logistics handles pickup from your warehouse and delivery to customers.",
    },
    {
      q: "When will I receive my payments?",
      a: "Payments are settled within 7–10 working days after successful delivery.",
    },
    {
      q: "Do I need my own warehouse?",
      a: "Not mandatory. You can ship from home or your shop. Pickup partners collect orders.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Store className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-blue-600 tracking-tight italic">
              Fikri<span className="text-slate-900">Seller</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-widest">
            <a
              href="#sell"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Sell Online
            </a>
            <a
              href="#benefits"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Benefits
            </a>
            <a
              href="#faq"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              FAQ
            </a>

            <Link
              to={"/seller-ad/successs"}
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Success Stories
            </Link>

            <Link to={'/seller-login'} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition font-black">
              LOGIN
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="sell"
        className="relative bg-gradient-to-b from-blue-50 via-white to-white pt-16 pb-24 px-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-200/50 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-200/40 blur-3xl rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              Launch your business <br />
              to{" "}
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
                45 Crore+
              </span>{" "}
              customers
            </h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Become a verified Fikri Seller and enjoy low fees, full logistics
              support, and fast settlements.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                <CheckCircle className="text-emerald-500 w-5 h-5" /> No
                Registration Fee
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                <CheckCircle className="text-emerald-500 w-5 h-5" /> 24/7 Seller
                Support
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                <CheckCircle className="text-emerald-500 w-5 h-5" /> Free Pickup
                Available
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
              alt="Seller business"
              className="rounded-3xl shadow-2xl border border-slate-100 object-cover w-full h-[450px]"
            />

            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-100">
              <p className="text-sm font-black text-slate-900">
                📈 Boost your sales today
              </p>
              <p className="text-xs text-slate-500">
                10,000+ sellers joined this month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black mb-4">Why Sell on Fikri?</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Everything you need to start selling, manage operations, and scale
            faster.
          </p>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-shadow group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-black mb-3">{item.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ONBOARDING WITH IMAGE */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-black mb-6">
              Start Selling in 4 Simple Steps
            </h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
              Fikri provides a smooth onboarding experience and everything you
              need to run your online business efficiently.
            </p>

            <div className="space-y-6">
              {onboardingSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">
                      {i + 1}. {step.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDE IMAGE */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
              alt="Business growth"
              className="rounded-3xl shadow-2xl border border-slate-100 object-cover w-full h-[520px]"
            />

            <div className="absolute top-6 right-6 bg-blue-600 text-white p-4 rounded-2xl shadow-xl">
              <p className="text-lg font-black">🚚 Free Pickup</p>
              <p className="text-xs opacity-90">Fast shipping across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black mb-4">
            Trusted by Sellers Across India
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            Real sellers. Real stories. Real business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                “{t.text}”
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="font-black text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 italic">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-black text-slate-800 hover:bg-slate-50 transition"
                >
                  <span className="text-sm">{faq.q}</span>
                  {activeFaq === idx ? (
                    <Minus className="text-blue-600" />
                  ) : (
                    <Plus className="text-blue-600" />
                  )}
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeFaq === idx ? "max-h-40 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WITH BACKGROUND IMAGE */}
      <section className="relative py-24 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
          alt="CTA background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-700/80"></div>

        <div className="relative max-w-6xl mx-auto text-center text-white space-y-6">
          <h2 className="text-4xl font-black">Ready to Start Selling?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join FikriSeller today and unlock powerful tools, logistics support,
            and millions of customers waiting for your products.
          </p>

          <button className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition">
            Register Now <ArrowRight className="inline ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl"></div>
              <span className="text-xl font-black text-white italic">
                FikriSeller
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed">
              Empowering thousands of sellers to bridge the gap between local
              commerce and national growth.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="text-white font-black text-xs uppercase tracking-widest">
              Resources
            </h5>
            <ul className="text-xs space-y-2">
              <li className="hover:text-white cursor-pointer transition">
                Seller University
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Success Stories
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Fee Calculator
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-white font-black text-xs uppercase tracking-widest">
              Contact
            </h5>
            <ul className="text-xs space-y-2">
              <li>support@fikriseller.com</li>
              <li>1800-202-3333</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-[10px] uppercase tracking-widest font-bold">
          © 2026 Fikri Marketplace Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Seller;