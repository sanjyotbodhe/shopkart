import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { handleImageFallback } from "../utils/imageFallback";
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Printer, 
  ArrowRight,
  ChevronRight,
  Sparkles
} from "lucide-react";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const getStepIndex = (status) => {
  const index = STATUS_STEPS.indexOf(status);
  return index >= 0 ? index : 0;
};

const STEP_ICONS = [Clock, CheckCircle2, Truck, Package];

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    if (!order?._id) return;
    try {
      setUpdating(true);
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.error || err.message));
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order || res.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Loading order invoice...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
            {error || "We were unable to locate this order."}
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/orders"
              className="bg-slate-900 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { shippingAddress, items = [], totalAmount, status, createdAt } = order;
  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/orders" className="hover:text-orange-600 transition">Orders</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Order #{order._id}</span>
        </nav>

        {/* Celebration / Success Hero Box */}
        <div className="bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-center mb-8">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Payment & Order Verified
            </span>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Thank You for Your Order!
            </h1>

            <p className="text-white/90 text-xs sm:text-sm">
              We have received your order and our logistics team is preparing it for express dispatch.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-2 font-mono text-xs">
              <span className="bg-black/25 px-3 py-1.5 rounded-xl border border-white/20">
                Order ID: <span className="font-bold text-yellow-300">#{order._id}</span>
              </span>
              {createdAt && (
                <span className="bg-black/25 px-3 py-1.5 rounded-xl border border-white/20">
                  Placed: {formatDate(createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Tracker Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Live Shipment Tracking
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Estimated Delivery: <span className="font-bold text-emerald-600">Within 2 Days via Express Courier</span>
              </p>
            </div>

            {/* Dev Simulator */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Status:</span>
              <select
                value={order.status || "PLACED"}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={updating}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 cursor-pointer outline-none focus:ring-1 focus:ring-orange-500"
              >
                {STATUS_STEPS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="relative flex items-center justify-between max-w-lg mx-auto px-4 py-2">
            <div className="absolute top-4 left-8 right-8 h-1 bg-slate-100 -z-0" />
            <div
              className="absolute top-4 left-8 h-1 bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500 -z-0"
              style={{
                width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 80}%`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const StepIcon = STEP_ICONS[idx] || CheckCircle2;

              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-50"
                        : isCurrent
                        ? "bg-orange-600 text-white shadow-md ring-4 ring-orange-100 animate-pulse"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? "✓" : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`mt-2 text-[10px] font-bold tracking-tight uppercase ${
                      isCurrent
                        ? "text-orange-600"
                        : isCompleted
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Info Grid: Shipping & Items */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Ordered Items List */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Items in this Order</span>
              <span className="text-xs text-slate-400 font-semibold">{items.length} items</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={item.product || idx} className="py-3 flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => handleImageFallback(e, "")}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>Total Paid</span>
                <span className="text-lg text-emerald-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address & Actions */}
          <div className="md:col-span-5 space-y-6">
            
            {shippingAddress && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Delivery Address</span>
                </h3>

                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    {shippingAddress.fullName}
                  </p>
                  <p className="text-slate-500 font-mono">{shippingAddress.phone}</p>
                  <p className="text-slate-600 leading-relaxed">
                    {shippingAddress.addressLine1 || shippingAddress.address}
                  </p>
                  <p className="text-slate-600 font-medium">
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Navigation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3 text-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>

              <Link
                to="/orders"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow cursor-pointer block"
              >
                <span>View All Orders</span>
              </Link>

              <Link
                to="/products"
                className="text-xs font-bold text-orange-600 hover:underline block pt-1"
              >
                Continue Shopping →
              </Link>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default OrderConfirmation;
