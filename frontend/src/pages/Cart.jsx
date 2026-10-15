import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import Navbar from "../components/Navbar";
import { handleImageFallback } from "../utils/imageFallback";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight 
} from "lucide-react";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems = [],
    loading = false,
    error = null,
    updateCart,
    deleteCart,
    getCart,
  } = useContext(CartContext) || {};

  useEffect(() => {
    if (getCart) {
      getCart();
    }
  }, [getCart]);

  const itemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  
  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.product?.price || 0) * (item.quantity || 1),
    0
  );

  const handleDecrease = (item) => {
    if (!item?.product?._id) return;
    if (item.quantity === 1) {
      deleteCart(item.product._id);
      return;
    }
    updateCart(item.product._id, item.quantity - 1);
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex min-h-[75vh] items-center justify-center">
          <p className="text-sm font-semibold text-slate-600">Loading your cart...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title */}
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} currently in your cart
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-md mx-auto shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Your cart is empty
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Add products to your cart to see them here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Active Cart */
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-3">
              {cartItems.map((item) => {
                const product = item.product || {};
                const lineTotal = (product.price || 0) * (item.quantity || 1);

                return (
                  <article
                    key={product._id || item._id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 block"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => handleImageFallback(e, product.category)}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${product._id}`}
                        className="font-bold text-slate-900 text-sm sm:text-base hover:text-orange-600 transition block truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatPrice(product.price)} each
                      </p>

                      {/* Controls Row */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            disabled={loading}
                            aria-label={`Decrease ${product.name} quantity`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs sm:text-sm text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCart(product._id, item.quantity + 1)}
                            disabled={loading || (product.stock && item.quantity >= product.stock)}
                            aria-label={`Increase ${product.name} quantity`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="text-base font-black text-slate-900">
                          {formatPrice(lineTotal)}
                        </span>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => deleteCart(product._id)}
                          disabled={loading}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition disabled:opacity-50 ml-auto sm:ml-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>

                      </div>

                    </div>
                  </article>
                );
              })}
            </div>

            {/* Right Order Summary Column */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-semibold text-slate-900">{itemCount}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-slate-900">
                  <span className="text-base font-black">Subtotal</span>
                  <span className="text-xl font-black text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default Cart;
