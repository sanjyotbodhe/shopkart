import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Eye,
  EyeOff
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email || !formData.password) {
      setError("Please fill in both your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.post("customers/login", formData);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Auth Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] border border-slate-800/10">
        
        {/* Left Side: Brand Experience & Perks (Myntra / Nike Vibe) */}
        <div className="md:col-span-5 bg-gradient-to-tr from-orange-600 via-rose-600 to-pink-600 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
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
              India's trendsetting destination for fashion, tech & home
            </p>
          </div>

          {/* Member Benefits */}
          <div className="relative z-10 my-8 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-yellow-300">
              Exclusive Member Perks
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Flat 50% Off your first order with code <strong>FESTIVAL50</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Free Express Doorstep Delivery on all orders over ₹499</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span>Hassle-free 7-day doorstep return guarantee</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center gap-2 text-[11px] text-white/80">
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>100% Secure 256-Bit SSL Encrypted</span>
          </div>

        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="max-w-sm w-full mx-auto space-y-6">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                Welcome Back
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Sign in to your account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered email and password to continue.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 focus:bg-white text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 focus:bg-white text-sm pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Switch to Register */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-bold text-orange-600 hover:text-orange-700 hover:underline ml-1"
                >
                  Create an account →
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;