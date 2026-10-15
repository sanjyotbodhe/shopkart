import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../services/api";
import api from "../services/api";
import CartContext from "../context/CartContext";
import Navbar from "../components/Navbar";
import { handleImageFallback } from "../utils/imageFallback";
import { 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  PackageCheck
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const { addCart } = useContext(CartContext) || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cart action states
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState("");

  // Wishlist action states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [savingWishlist, setSavingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [wishlistSuccess, setWishlistSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id);
        setProduct(data);
      } catch {
        setError("Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Check if product is in user's wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await api.get("/wishlist");
        if (response.data?.wishlist) {
          const found = response.data.wishlist.some(
            (item) => (item._id || item) === id
          );
          setIsInWishlist(found);
        }
      } catch {
        // Unauthenticated or wishlist empty
      }
    };

    if (id) {
      checkWishlistStatus();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0 || !addCart) return;

    try {
      setAddingToCart(true);
      setCartError("");
      setCartSuccess(false);

      const result = await addCart(product._id);

      if (result && result.success === false) {
        if (result.status === 401) {
          setCartError("Please log in to add items to your cart.");
        } else {
          setCartError(result.error || "Unable to add product to cart.");
        }
      } else {
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 3500);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setCartError("Please log in to add items to your cart.");
      } else {
        setCartError(
          err.response?.data?.error || "Unable to add product to cart."
        );
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    try {
      setSavingWishlist(true);
      setWishlistError("");
      setWishlistSuccess("");

      if (isInWishlist) {
        await api.delete(`/wishlist/${product._id}`);
        setIsInWishlist(false);
        setWishlistSuccess("Removed from your wishlist.");
        setTimeout(() => setWishlistSuccess(""), 3000);
      } else {
        await api.post(`/wishlist/${product._id}`);
        setIsInWishlist(true);
        setWishlistSuccess("Added to your wishlist!");
        setTimeout(() => setWishlistSuccess(""), 3000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setWishlistError("Please log in to save items to your wishlist.");
      } else if (err.response?.status === 409) {
        setIsInWishlist(true);
        setWishlistError("Product is already in your wishlist.");
      } else {
        setWishlistError(
          err.response?.data?.error ||
            "Unable to update wishlist. Please try again."
        );
      }
    } finally {
      setSavingWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex min-h-[75vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex min-h-[75vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-base font-semibold text-rose-600">{error || "Product not found."}</p>
          <Link
            to="/products"
            className="rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-xs text-white transition hover:bg-slate-800"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Back Link */}
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image */}
          <div className="bg-slate-100 flex items-center justify-center p-6 sm:p-10">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => handleImageFallback(e, product.category)}
              className="w-full max-h-[460px] object-cover rounded-2xl shadow-sm"
            />
          </div>

          {/* Product Details Content */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            
            <div className="space-y-4">
              
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>

                <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>

              {/* Price & Stock */}
              <div className="pt-2">
                <span className="text-3xl font-black text-slate-900 block">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                
                <p className={`mt-1 text-xs font-bold ${product.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {product.stock > 0
                    ? `✓ ${product.stock} units left in stock`
                    : "✕ Out of stock"}
                </p>
              </div>

              {/* Feedback Notifications */}
              {cartSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-semibold animate-fade-in">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Added to your cart successfully!
                  </span>
                  <Link to="/cart" className="font-bold underline text-emerald-900 ml-2">
                    View Cart →
                  </Link>
                </div>
              )}

              {cartError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                  {cartError}
                </div>
              )}

              {wishlistSuccess && (
                <div className="p-3.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-700 font-semibold">
                  {wishlistSuccess}
                </div>
              )}

              {wishlistError && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                  {wishlistError}
                </div>
              )}

            </div>

            {/* Actions: Add to Cart & Wishlist */}
            <div className="pt-8 space-y-3">
              
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {addingToCart ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={savingWishlist}
                className={`w-full py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                  isInWishlist
                    ? "bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100"
                    : "bg-white border-slate-200 text-slate-700 hover:border-pink-300 hover:text-pink-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? "fill-pink-500 text-pink-500" : ""}`} />
                <span>
                  {savingWishlist
                    ? "Updating Wishlist..."
                    : isInWishlist
                    ? "In Wishlist (Click to Remove)"
                    : "Add to Wishlist"}
                </span>
              </button>

              {/* Navigation Shortcuts */}
              <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <Link to="/cart" className="hover:text-orange-600 transition font-medium">
                  Go to Cart →
                </Link>
                <Link to="/wishlist" className="hover:text-pink-600 transition font-medium">
                  View Wishlist →
                </Link>
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default ProductDetails;