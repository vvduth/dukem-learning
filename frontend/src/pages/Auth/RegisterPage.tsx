import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    

    // Validation
    if ( !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      toast.error("Passwords do not match.");
      return;
    }

    try {
      console.log(username, email, password, confirmPassword);
      const response = await authService.register(username, email, password);
      login(response.user, response.token);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || "An error occurred during registration.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen br-linear-to-br
    from-slate-400 via-white to-slate-400 px-4">
      <div className="absolute inset-0 
      bg-[radial-gradient(circle, rgba(255,255,255,0.8), rgba(203,213,225,0.8))] opacity-30" />
      <div className="relative w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60
        rounded-3xl shadow-xl shadow-slate-200/50 p-10">
          {/* header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14
            rounded-2xl bg-linear-to-br from-violet-400 to-teal-500 shadow-lg
            shadow-violet-500/25 mb-6">
              <BrainCircuit strokeWidth={2} className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight
            mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm">Sign up to start your learning journey</p>
          </div>
          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700 uppercase
              tracking-wide">
                Username
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center
                  pointer-events-none transition-colors duration-200 ${
                    focusedField === "username"
                      ? "text-violet-500"
                      : "text-slate-400"
                  }`}
                >
                  <User className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl
                   bg-slate-50/50 text-slate-900
                  placeholder-slate-400 text-sm font-medium transition-all
                  duration-200 focus:outline-none focus:border-violet-500 focus:bg-white
                  focus:shadow-lg focus:shadow-violet-500/20"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            {/* email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase
              tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center
                  pointer-events-none transition-colors duration-200 ${
                    focusedField === "email"
                      ? "text-violet-500"
                      : "text-slate-400"
                  }`}
                >
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl
                   bg-slate-50/50 text-slate-900
                  placeholder-slate-400 text-sm font-medium transition-all
                  duration-200 focus:outline-none focus:border-violet-500 focus:bg-white
                  focus:shadow-lg focus:shadow-violet-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            {/* password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase
              tracking-wide">
                Password
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center
                  pointer-events-none transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-blue-500"
                      : "text-slate-400"
                  }`}
                >
                  <Lock className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl
                   bg-slate-50/50 text-slate-900
                  placeholder-slate-400 text-sm font-medium transition-all
                  duration-200 focus:outline-none focus:border-violet-500 focus:bg-white
                  focus:shadow-lg focus:shadow-violet-500/20"
                  placeholder="Create a password"
                />
              </div>
            </div>
            {/* confirm password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 uppercase
              tracking-wide">
                Confirm Password
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center
                  pointer-events-none transition-colors duration-200 ${
                    focusedField === "confirmPassword"
                      ? "text-blue-500"
                      : "text-slate-400"
                  }`}
                >
                  <Lock className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl
                   bg-slate-50/50 text-slate-900
                  placeholder-slate-400 text-sm font-medium transition-all
                  duration-200 focus:outline-none focus:border-violet-500 focus:bg-white
                  focus:shadow-lg focus:shadow-violet-500/20"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            {/* error message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-red-700 text-xs font-medium text-center">{error}</p>
              </div>
            )}
            {/* submit button */}
            <button 
              type="submit"
              disabled={loading} 
              className="group relative w-full h-12 bg-linear-to-r
              from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600
              active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed
              disabled:active:scale-100 shadow-lg shadow-violet-500/30 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30
                    border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform
                    duration-200" strokeWidth={2} />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0
              -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>
          {/* footer */}
          <div className="mt-8 pt-6 border-slate-200/60">
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-violet-500 hover:text-violet-600
              transition-colors duration-200">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        {/* subtle footer text */}
        <p className="text-center text-xs text-slate-400 mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;