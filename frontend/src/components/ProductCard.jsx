import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import CartContext from "../context/CartContext";
import { handleImageFallback } from "../utils/imageFallback";
import { 
  ShoppingBag, 
  Heart, 
  Check, 
  Eye
} from "lucide-react";

function ProductCard({ product }) {
  const { addCart } = useContext(CartContext) || {};
  const [savingWishlist, setSavingWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");

  const handleAddCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart || product.stock === 0) return;

    try {
      setAddingToCart(true);
      if (addCart) {
        await addCart(product._id);
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (savingWishlist) return;

    try {
      setSavingWishlist(true);
      setWishlistMessage("");

      await api.post(`/wishlist/${product._id}`);
      setWishlistAdded(true);
      setWishlistMessage("Saved to Wishlist!");
      setTimeout(() => setWishlistMessage(""), 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setWishlistAdded(true);
        setWishlistMessage("Already in Wishlist");
        setTimeout(() => setWishlistMessage(""), 2000);
      } else if (err.response?.status === 401) {
        setWishlistMessage("Please login first");
        setTimeout(() => setWishlistMessage(""), 2000);
      } else {
        setWishlistMessage("Unable to save");
        setTimeout(() => setWishlistMessage(""), 2000);
      }
    } finally {
      setSavingWishlist(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => handleImageFallback(e, product.category)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleAddWishlist}
          disabled={savingWishlist}
          aria-label="Add to Wishlist"
          title="Save to Wishlist"
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm backdrop-blur-sm cursor-pointer ${
            wishlistAdded
              ? "bg-pink-50 text-pink-600 scale-105"
              : "bg-white/90 text-slate-500 hover:text-pink-600 hover:bg-white"
          }`}
        >
          <Heart 
            className={`w-4 h-4 transition-transform duration-200 ${
              wishlistAdded ? "fill-pink-500 text-pink-500" : ""
            }`} 
          />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Toast Feedback */}
        {wishlistMessage && (
          <div className="absolute bottom-2 inset-x-2 z-20 bg-slate-900/90 text-white text-xs font-semibold py-1 px-2 rounded-lg text-center backdrop-blur-xs shadow-sm">
            {wishlistMessage}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        
        <div>
          <Link 
            to={`/products/${product._id}`}
            className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 hover:text-orange-600 transition"
            title={product.name}
          >
            {product.name}
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          
          {/* Price & Stock */}
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className={`text-xs font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            <button
              onClick={handleAddCart}
              disabled={addingToCart || product.stock === 0}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                product.stock === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : cartAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-orange-600 text-white shadow-xs"
              }`}
            >
              {addingToCart ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : cartAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : product.stock === 0 ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <Link
              to={`/products/${product._id}`}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;