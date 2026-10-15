import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { 
  Package, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ChevronRight, 
  ShoppingBag, 
  Sparkles,
  ArrowRight,
  ShieldCheck
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
  });
};

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const getStepIndex = (status) => {
  const index = STATUS_STEPS.indexOf(status);
  return index >= 0 ? index : 0;
};

const STEP_ICONS = [Clock, CheckCircle2, Truck, Package];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders");
      if (res.data?.orders) {
        setOrders(res.data.orders);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(
        "Failed to update status: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">My Orders</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>My Orders</span>
              {!loading && !error && (
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track live shipment progression, view itemized receipts and order histories.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse More Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <div className="h-6 w-1/3 rounded animate-shimmer" />
                <div className="h-16 w-full rounded-2xl animate-shimmer" />
                <div className="h-10 w-full rounded animate-shimmer" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-md mx-auto my-8">
            <p className="text-3xl mb-2">⚠️</p>
            <h3 className="text-base font-bold text-rose-800">{error}</h3>
            <button
              type="button"
              onClick={fetchOrders}
              className="mt-4 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center max-w-md mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              No Orders Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              You haven't placed any orders yet. Discover our latest top electronics and trending fashion.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition shadow shadow-orange-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIdx = getStepIndex(order.status);

              return (
                <article
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-slate-300 transition"
                >
                  {/* Order Top Strip */}
                  <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID:</span>
                        <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                          #{order._id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "SHIPPED"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "CONFIRMED"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {order.status || "PLACED"}
                      </span>
                    </div>
                  </div>

                  {/* Swiggy / Zomato Animated Status Tracker Bar */}
                  <div className="px-6 py-6 bg-white border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Shipment Status Progression
                    </p>

                    <div className="relative flex items-center justify-between max-w-lg mx-auto px-4">
                      {/* Grey Base Track */}
                      <div className="absolute top-4 left-8 right-8 h-1 bg-slate-100 -z-0" />

                      {/* Active Color Track */}
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

                  {/* Order Items Body */}
                  <div className="p-5 sm:p-6">
                    <div className="space-y-3 mb-5">
                      {order.items?.map((item, idx) => (
                        <div
                          key={item.product || idx}
                          className="flex items-center justify-between text-xs sm:text-sm text-slate-700 py-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            <span className="text-slate-400 font-normal">× {item.quantity}</span>
                          </div>
                          <span className="font-bold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="border-t border-slate-100 pt-4 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Total Paid</span>
                        <span className="text-xl font-black text-slate-900">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        
                        {/* Dev Status Simulation Tool */}
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-2.5 py-1 text-xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Simulate:
                          </span>
                          <select
                            value={order.status || "PLACED"}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 cursor-pointer outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            {STATUS_STEPS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          <span>Full Invoice & Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                      </div>

                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Orders;
