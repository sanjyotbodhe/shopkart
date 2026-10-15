import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import api, { getProducts } from "../services/api";
import { 
  User, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Heart, 
  Package, 
  Compass, 
  ArrowRight 
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "Customer",
    email: "",
    phone: "",
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.post("customers/me")
      .then((response) => {
        if (!cancelled && response.data) {
          setData(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (!cancelled) {
          navigate("/login");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((res) => {
        if (!cancelled && res?.products) {
          setProducts(res.products.slice(0, 4));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Welcome Banner & Customer Info */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-md">
              Customer Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, {data.name}!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Welcome to ShopKart. Explore the product catalog, manage your wishlist, track recent orders, or view your shopping cart.
            </p>

            {/* Quick Action Links */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Compass className="w-4 h-4" />
                <span>Browse Products</span>
              </Link>
              <Link
                to="/cart"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>My Cart</span>
              </Link>
              <Link
                to="/orders"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>My Orders</span>
              </Link>
              <Link
                to="/wishlist"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Heart className="w-4 h-4 text-pink-600" />
                <span>My Wishlist</span>
              </Link>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="md:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-20 text-slate-400 font-medium">Name:</span>
                <span className="font-bold text-slate-900">{data.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-slate-400 font-medium">Email:</span>
                <span className="font-mono text-slate-800">{data.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-slate-400 font-medium">Phone:</span>
                <span className="font-mono text-slate-800">{data.phone || "—"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Featured Products Showcase (Real Products from Database) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Top picks from our catalog available for purchase
              </p>
            </div>

            <Link
              to="/products"
              className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="w-full aspect-square rounded-xl animate-shimmer" />
                  <div className="h-4 w-3/4 rounded animate-shimmer" />
                  <div className="h-3 w-1/2 rounded animate-shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Home;