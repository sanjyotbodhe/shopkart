import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim()) {
      setError("Please fill out all the fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.post("/customers/register", formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] border border-slate-800/10">
        
        {/* Left Side: Brand Experience */}
        <div className="md:col-span-5 bg-gradient-to-tr from-orange-600 via-rose-600 to-pink-600 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white text-orange-600 flex items-center justify-center font-black shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Shop<span className="text-yellow-300">Kart</span>
              </span>
            </Link>
            <p className="text-xs text-white/80 font-medium">
              Join millions of trendsetters across India
            </p>
          </div>

          {/* Welcome Gift Box */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
            <div className="flex items-center gap-2.5 text-yellow-300 font-extrabold text-xs uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Sign Up Welcome Bonus</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Create your account today and automatically receive <strong>₹200 Instant Credits</strong> + <strong>Free Delivery</strong> on your first 3 purchases.
            </p>
          </div>

          {/* Checklist */}
          <div className="relative z-10 space-y-2.5 text-xs text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300" />
              <span>Real-time delivery SMS updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300" />
              <span>VIP early access to seasonal flash sales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300" />
              <span>Seamless 1-click Razorpay checkout</span>
            </div>
          </div>

          {/* Security */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center gap-2 text-[11px] text-white/80">
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>Bank-grade 256-bit SSL encrypted</span>
          </div>

        </div>

        {/* Right Side: Register Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="max-w-sm w-full mx-auto space-y-6">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                Get Started
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Create an account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your information to begin shopping with member perks.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Sarthak Sharma"
                  className="w-full bg-slate-50 focus:bg-white text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 focus:bg-white text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full bg-slate-50 focus:bg-white text-sm pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>10-Digit Mobile Number</span>
                </label>
                <div className="flex gap-2">
                  <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono font-bold px-3 py-2.5 rounded-xl flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="flex-1 bg-slate-50 focus:bg-white text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Claim ₹200</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Switch to Login */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-orange-600 hover:text-orange-700 hover:underline ml-1"
                >
                  Sign In instead →
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;