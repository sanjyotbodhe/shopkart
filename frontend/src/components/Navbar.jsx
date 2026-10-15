import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState, useContext } from "react";
import CartContext from "../context/CartContext";
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  LogOut, 
  Compass, 
  Menu, 
  X,
  User
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], getCart } = useContext(CartContext) || {};
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
      navigate("/login");
    } catch {
      console.log("Something went wrong while logging out.");
      navigate("/login");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadWishlistCount = async () => {
      try {
        const res = await api.get("/wishlist/count");
        if (!cancelled && typeof res.data?.count === "number") {
          setWishlistCount(res.data.count);
        }
      } catch (err) {
        // Silently catch unauthenticated
      }
    };

    const loadUserInfo = async () => {
      try {
        const res = await api.post("/customers/me");
        if (!cancelled && res.data?.name) {
          setUserName(res.data.name);
        }
      } catch {
        // Guest user
      }
    };

    loadWishlistCount();
    loadUserInfo();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/cart" && getCart) {
      getCart();
    }
  }, [getCart, location.pathname]);

  const isActive = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/home")) return true;
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-sm group-hover:bg-orange-700 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Shop<span className="text-orange-600">Kart</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive("/")
                  ? "text-orange-600 bg-orange-50 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive("/products")
                  ? "text-orange-600 bg-orange-50 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Products</span>
            </Link>

            <Link
              to="/wishlist"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive("/wishlist")
                  ? "text-pink-600 bg-pink-50 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-pink-500 text-pink-500" : ""}`} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive("/cart")
                  ? "text-orange-600 bg-orange-50 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive("/orders")
                  ? "text-slate-900 bg-slate-100 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
              {userName && (
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {userName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Products
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Wishlist ({wishlistCount})
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cart ({cartCount})
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Orders
          </Link>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {userName && <span className="text-xs font-semibold text-slate-600">Hi, {userName}</span>}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;