import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Sparkles,
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "user";
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const passwordChecks = {
    length: form.password.length >= 8,
    number: /\d/.test(form.password),
    special: /[@$!%*?&]/.test(form.password),
    letter: /[A-Za-z]/.test(form.password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!passwordRegex.test(form.password)) {
      setError("Password must meet all requirements below.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("https://curalink-mvp-backend.onrender.com/api/auth/register", {
        ...form,
        role,
      });
      alert("Registration successful!");
      navigate(`/login?role=${role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post("https://curalink-mvp-backend.onrender.com/api/auth/google", {
        token,
        role,
      });
      alert("Registered and logged in with Google!");
      navigate(
        res.data.user.role === "researcher"
          ? "/researcher-dashboard"
          : "/patient-dashboard"
      );
    } catch {
      alert("Google registration failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="743917778455-a32paa95v5forlmffmtq4gvjq7rrajda.apps.googleusercontent.com">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-10 w-full max-w-2xl pt-16"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="absolute -top-12 left-0 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Join CuraLink
                </h1>
                <p className="text-blue-200 text-lg mb-8">
                  {role === 'patient' 
                    ? 'Start your personalized health journey today'
                    : 'Connect with patients and advance medical research'
                  }
                </p>
                
                <div className="space-y-4 text-left">
                  {[
                    "AI-powered recommendations",
                    "Secure & private platform",
                    "Global network of experts",
                    "Real-time updates"
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-3 text-white/80"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Create Account
                </h2>
                <p className="text-blue-200">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Registration
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6"
                >
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-12"
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-white/5 rounded-2xl p-4 mt-3 space-y-2"
                  >
                    <p className="text-white/60 text-sm font-medium mb-2">Password Requirements:</p>
                    {Object.entries(passwordChecks).map(([key, isValid]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${isValid ? 'text-green-300' : 'text-red-300'}`}>
                          {key === 'length' && 'At least 8 characters'}
                          {key === 'number' && 'Contains a number'}
                          {key === 'special' && 'Contains a special character'}
                          {key === 'letter' && 'Contains a letter'}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Register Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                  <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                </motion.button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative bg-transparent px-4">
                    <span className="text-white/40 text-sm">or continue with</span>
                  </div>
                </div>

                {/* Google Register */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleRegister}
                    onError={() => alert("Google registration failed")}
                    theme="filled_blue"
                    size="large"
                    text="signup_with"
                    shape="pill"
                  />
                </div>

                {/* Login Link */}
                <p className="text-center text-white/60 text-sm">
                  Already have an account?{" "}
                  <Link
                    to={`/login?role=${role}`}
                    className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}