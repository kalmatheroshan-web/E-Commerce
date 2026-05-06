import { Link } from "react-router-dom";

function Footer() {
    const sections = [
        {
            title: "Product",
            links: ["Features", "Pricing", "New Arrivals", "Best Sellers"]
        },
        {
            title: "Company",
            links: ["About Us", "Careers", "Blog", "Contact"]
        },
        {
            title: "Legal",
            links: ["Privacy Policy", "Terms", "Cookies", "Licenses"]
        }
    ];

    const formatLink = (text) =>
        `/${text.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <footer className="bg-white border-t border-slate-100 mt-24">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                                FS
                            </div>
                            <h2 className="text-lg font-black tracking-tight">
                                FIKRI SHOP
                            </h2>
                        </div>

                        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                            Premium everyday essentials, thoughtfully curated.
                            Built for simplicity, designed for modern lifestyles.
                        </p>

                       
                    </div>

                    {/* Links */}
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 mb-5">
                                {section.title}
                            </h4>

                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            to={formatLink(link)}
                                            className="text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-block transition-all"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 my-10" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">

                    <p>© 2026 Fikri Shop. All rights reserved.</p>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            hello@fikrishop.com
                        </div>

                        <select className="bg-transparent outline-none cursor-pointer hover:text-slate-800 transition">
                            <option>English</option>
                            <option>Hindi</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;