import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import WishlistCard from "../components/WishlistCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart, ArrowRight, ShoppingBag, Sparkles, ChevronRight } from "lucide-react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");
      setWishlist(response.data?.wishlist || []);
    } catch (err) {
      setError("Unable to load your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await api.delete(`/wishlist/${productId}`);

      setWishlist((currentWishlist) =>
        currentWishlist.filter((product) => product._id !== productId)
      );
    } catch (err) {
      alert("Unable to remove product from wishlist.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">My Wishlist</span>
        </nav>

        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>My Wishlist</span>
              {!loading && !error && (
                <span className="text-xs font-bold bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full">
                  {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Items saved for future shopping. Move them to your cart to checkout anytime.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="w-full aspect-square rounded-xl animate-shimmer" />
                <div className="h-4 w-3/4 rounded animate-shimmer" />
                <div className="h-3 w-1/2 rounded animate-shimmer" />
                <div className="h-9 w-full rounded-xl animate-shimmer mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-8 text-center max-w-md mx-auto my-12">
            <p className="text-3xl mb-2">⚠️</p>
            <h3 className="text-base font-bold text-rose-800">{error}</h3>
            <button
              onClick={fetchWishlist}
              className="mt-4 bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center max-w-md mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 fill-pink-500/20" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Explore more and shortlist some of your favorite electronics, shoes, and styles!
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                removing={removingId === product._id}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;