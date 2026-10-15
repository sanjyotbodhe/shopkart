import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CartContext from "../context/CartContext";
import { handleImageFallback } from "../utils/imageFallback";
import { 
  ShoppingBag, 
  Trash2, 
  Eye, 
  Check, 
  Star 
} from "lucide-react";

function WishlistCard({ product, onRemove, removing }) {
  const { addCart } = useContext(CartContext) || {};
  const [movingToCart, setMovingToCart] = useState(false);
  const [movedSuccess, setMovedSuccess] = useState(false);

  const originalPrice = Math.round(product.price * 1.35);

  const handleMoveToCart = async () => {
    if (!addCart || product.stock === 0) return;
    try {
      setMovingToCart(true);
      await addCart(product._id);
      setMovedSuccess(true);
      setTimeout(() => setMovedSuccess(false), 2000);
    } finally {
      setMovingToCart(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      
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

        {/* Floating Remove Button */}
        <button
          onClick={() => onRemove(product._id)}
          disabled={removing}
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition shadow-sm backdrop-blur-sm cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        
        <Link
          to={`/products/${product._id}`}
          className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 hover:text-orange-600 transition"
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-slate-400 line-through font-medium">
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] font-bold text-emerald-600 ml-auto">
            26% OFF
          </span>
        </div>

        {/* Stock status */}
        <p className="mt-1 text-xs">
          {product.stock > 0 ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock ({product.stock} left)
            </span>
          ) : (
            <span className="text-rose-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Out of Stock
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
          
          <button
            onClick={handleMoveToCart}
            disabled={movingToCart || product.stock === 0}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              movedSuccess
                ? "bg-emerald-600 text-white"
                : product.stock === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-orange-600 text-white shadow-sm"
            }`}
          >
            {movingToCart ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : movedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <Link
            to={`/products/${product._id}`}
            className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

        </div>

      </div>

    </div>
  );
}

export default WishlistCard;