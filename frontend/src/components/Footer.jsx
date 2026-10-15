import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Headphones, 
  CreditCard, 
  Sparkles, 
  Mail, 
  ArrowRight,
  Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip (Like Myntra / Amazon) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Genuine</h4>
              <p className="text-xs text-slate-400 mt-0.5">Verified authentic brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free over ₹499 across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">7-Day Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant doorstep pickups</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 VIP Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated customer care</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Kart</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
                  Premium Commerce
                </span>
              </div>
            </Link>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier lifestyle and tech marketplace. Curated electronics, trendsetting apparel, bestsellers, and modern home essentials with lightning delivery.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-400" /> Get ₹200 off your first purchase
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 flex-1 outline-none focus:border-orange-500"
                />
                <button 
                  type="button" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition shadow"
                >
                  Join <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-orange-400 transition">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-orange-400 transition">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="hover:text-orange-400 transition">
                  Books & Reading
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="hover:text-orange-400 transition">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition">
                  All New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-orange-400 transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-400 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#returns" className="hover:text-orange-400 transition">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-orange-400 transition">
                  FAQs & Helpdesk
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Payment Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Secure Checkout
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Encrypted 256-bit SSL checkout with instant Razorpay verification.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-300">
                UPI / GPay
              </span>
              <span className="px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-300">
                Visa / Master
              </span>
              <span className="px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-300">
                NetBanking
              </span>
              <span className="px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-300">
                Razorpay
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ShopKart Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>for prime shopping experience</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
