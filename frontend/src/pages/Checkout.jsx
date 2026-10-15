import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import { 
  ShieldCheck, 
  Lock, 
  MapPin, 
  User, 
  Phone, 
  Home as HomeIcon, 
  Building, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems = [],
    loading = false,
    getCart,
    clearCart,
  } = useContext(CartContext) || {};

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (getCart) {
      getCart();
    }
  }, [getCart]);

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total +
      Number(item?.product?.price ?? item?.price ?? 0) *
        Number(item?.quantity ?? 1),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    let cleanPhone = "";
    for (let i = 0; i < formData.phone.length; i++) {
      const char = formData.phone[i];
      if (char !== " " && char !== "-") {
        cleanPhone += char;
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (
      cleanPhone.length !== 10 ||
      !cleanPhone.split("").every((ch) => ch >= "0" && ch <= "9")
    ) {
      newErrors.phone = "Phone must contain a valid 10-digit number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    const trimmedPincode = formData.pincode.trim();
    if (
      trimmedPincode.length !== 6 ||
      !trimmedPincode.split("").every((ch) => ch >= "0" && ch <= "9")
    ) {
      newErrors.pincode = "Pincode must contain 6 digits.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      setSubmitError("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    let cleanPhone = "";
    for (let i = 0; i < formData.phone.length; i++) {
      const char = formData.phone[i];
      if (char !== " " && char !== "-") {
        cleanPhone += char;
      }
    }

    const payload = {
      shippingAddress: {
        fullName: formData.fullName.trim(),
        phone: cleanPhone,
        address: formData.address.trim(),
        addressLine1: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },
    };

    try {
      const response = await api.post("/orders/create-payment-order", payload);
      const data = response.data;

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setSubmitError(
          "Unable to load Razorpay payment SDK. Please verify your connection."
        );
        setIsSubmitting(false);
        return;
      }

      // Open Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "ShopKart",
        description: "ShopKart Order Payment",
        order_id: data.razorpayOrderId,

        handler: async function (paymentResponse) {
          try {
            setIsSubmitting(true);
            setSubmitError("");

            // Call Payment Verification API
            const verifyRes = await api.post("/orders/verify-payment", {
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              if (clearCart) clearCart();
              if (getCart) getCart();
              const finalOrder = verifyRes.data.order || data.order;
              setConfirmedOrder(finalOrder);
              setOrderPlaced(true);
              if (finalOrder?._id) {
                navigate(`/order-success/${finalOrder._id}`);
              }
            } else {
              setSubmitError(
                verifyRes.data?.message || "Payment verification failed."
              );
            }
          } catch (verifyErr) {
            const errMessage =
              verifyErr.response?.data?.message ||
              verifyErr.response?.data?.error ||
              "Payment verification failed.";
            setSubmitError(errMessage);
          } finally {
            setIsSubmitting(false);
          }
        },

        prefill: {
          name: formData.fullName.trim(),
          contact: cleanPhone ? (cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`) : "",
        },

        theme: {
          color: "#ea580c", // Vibrant brand orange
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (failResponse) {
        console.error("Payment failed", failResponse.error);
        setSubmitError(
          failResponse.error?.description ||
            "Payment failed. Please try again."
        );
        setIsSubmitting(false);
      });

      paymentObject.open();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to initiate order.";
      setSubmitError(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Checkout Steps Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <Link to="/cart" className="flex items-center gap-2 text-emerald-600 hover:underline">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                ✓
              </span>
              <span>Cart</span>
            </Link>
            <div className="h-0.5 w-12 sm:w-20 bg-orange-500" />
            <div className="flex items-center gap-2 text-orange-600">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Shipping & Address</span>
            </div>
            <div className="h-0.5 w-12 sm:w-20 bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">
                3
              </span>
              <span>Razorpay Payment</span>
            </div>
          </div>
        </div>

        {orderPlaced ? (
          /* Placed State Fallback */
          <div className="bg-white rounded-3xl p-10 border border-slate-200 max-w-lg mx-auto text-center shadow-lg">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Order Placed Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Order ID: <span className="font-mono font-bold text-slate-800">{confirmedOrder?._id}</span>
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/orders"
                className="bg-slate-900 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition"
              >
                View Orders
              </Link>
              <Link
                to="/products"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Main 2-Column Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Delivery Address Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              
              <div className="pb-4 border-b border-slate-200 mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  <span>Delivery Address</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Please provide your accurate delivery details for swift doorstep delivery.
                </p>
              </div>

              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full bg-slate-50 focus:bg-white text-sm px-4 py-3 rounded-xl border outline-none transition ${
                      errors.fullName
                        ? "border-rose-400 bg-rose-50/50"
                        : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs font-semibold text-rose-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>10-Digit Mobile Number *</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono font-bold px-3 py-3 rounded-xl flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`flex-1 bg-slate-50 focus:bg-white text-sm px-4 py-3 rounded-xl border outline-none transition ${
                        errors.phone
                          ? "border-rose-400 bg-rose-50/50"
                          : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-semibold text-rose-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <HomeIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Street Address, Flat, Building *</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House / Flat no, Street, Landmark"
                    className={`w-full bg-slate-50 focus:bg-white text-sm px-4 py-3 rounded-xl border outline-none transition ${
                      errors.address
                        ? "border-rose-400 bg-rose-50/50"
                        : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs font-semibold text-rose-600 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City & State Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>City *</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className={`w-full bg-slate-50 focus:bg-white text-sm px-4 py-3 rounded-xl border outline-none transition ${
                        errors.city
                          ? "border-rose-400 bg-rose-50/50"
                          : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-xs font-semibold text-rose-600 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span>State *</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      className={`w-full bg-slate-50 focus:bg-white text-sm px-4 py-3 rounded-xl border outline-none transition ${
                        errors.state
                          ? "border-rose-400 bg-rose-50/50"
                          : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      }`}
                    />
                    {errors.state && (
                      <p className="text-xs font-semibold text-rose-600 mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Postal Code / Pincode (6-Digits) *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400001"
                    className={`w-full sm:w-1/2 bg-slate-50 focus:bg-white font-mono text-sm px-4 py-3 rounded-xl border outline-none transition ${
                      errors.pincode
                        ? "border-rose-400 bg-rose-50/50"
                        : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-xs font-semibold text-rose-600 mt-1">{errors.pincode}</p>
                  )}
                </div>

                {/* Mobile Pay CTA */}
                <div className="pt-6 border-t border-slate-100 lg:hidden">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {formatPrice(totalAmount)} via Razorpay</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

            {/* Right Column: Order Summary & Payment Guarantee */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center justify-between pb-3 border-b border-slate-100">
                  <span>Order Summary</span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}
                  </span>
                </h2>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const product = item?.product || {};
                    const name = product.name || item?.name || "Product";
                    const price = Number(product.price ?? item?.price ?? 0);
                    const quantity = Number(item?.quantity ?? 1);
                    const itemTotal = price * quantity;

                    return (
                      <div
                        key={product._id || item?._id || name}
                        className="flex items-center justify-between gap-3 text-xs py-1"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 truncate">{name}</p>
                          <p className="text-slate-400 mt-0.5">Qty: {quantity} × {formatPrice(price)}</p>
                        </div>
                        <span className="font-extrabold text-slate-900 shrink-0">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bill Row */}
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-bold text-slate-900">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Standard Express Delivery</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      FREE
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-slate-900">
                    <span className="text-sm font-black">Amount Payable</span>
                    <span className="text-xl font-black text-slate-900">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Desktop Pay Button */}
                <div className="hidden lg:block pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {formatPrice(totalAmount)} with Razorpay</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Trust Badge */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Safe & Secure Payments</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Payments are encrypted with 256-bit SSL via official Razorpay checkout.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Checkout;
