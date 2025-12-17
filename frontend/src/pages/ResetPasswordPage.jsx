import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { LockIcon, LoaderIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    // Validate token on mount
    if (!token) {
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", {
        token,
        password: formData.password
      });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="w-full flex items-center justify-center p-4 bg-gradient-to-br from-brand-darker via-brand-dark to-brand-darker">
        <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
          <BorderAnimatedContainer>
            <div className="w-full flex flex-col md:flex-row">
              {/* ERROR COLUMN */}
              <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-red-500/30">
                <div className="w-full max-w-md text-center">
                  <div className="relative mb-6">
                    <AlertCircleIcon className="w-20 h-20 mx-auto text-red-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Invalid Reset Link</h2>
                  <p className="text-slate-400 mb-6">
                    This password reset link is invalid or has expired.
                  </p>
                  <Link to="/forgot-password" className="auth-link">
                    Request New Reset Link
                  </Link>
                </div>
              </div>

              {/* ILLUSTRATION - RIGHT SIDE */}
              <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                <div>
                  <img
                    src="/login.png"
                    alt="Error illustration"
                    className="w-full h-auto object-contain opacity-30"
                  />
                </div>
              </div>
            </div>
          </BorderAnimatedContainer>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full flex items-center justify-center p-4 bg-gradient-to-br from-brand-darker via-brand-dark to-brand-darker">
        <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
          <BorderAnimatedContainer>
            <div className="w-full flex flex-col md:flex-row">
              {/* SUCCESS COLUMN */}
              <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-green-500/30">
                <div className="w-full max-w-md text-center">
                  <div className="relative mb-6">
                    <CheckCircleIcon className="w-20 h-20 mx-auto text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">Password Reset!</h2>
                  <p className="text-slate-400 mb-6">
                    Your password has been successfully reset.
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    Redirecting to login page in 3 seconds...
                  </p>
                  <Link to="/login" className="auth-link">
                    Go to Login
                  </Link>
                </div>
              </div>

              {/* ILLUSTRATION - RIGHT SIDE */}
              <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                <div>
                  <img
                    src="/login.png"
                    alt="Success illustration"
                    className="w-full h-auto object-contain opacity-50"
                  />
                </div>
              </div>
            </div>
          </BorderAnimatedContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-4 bg-gradient-to-br from-brand-darker via-brand-dark to-brand-darker">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-brand-primary/30">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <div className="relative mb-4">
                    <LockIcon className="w-16 h-16 mx-auto text-brand-primary animate-float" />
                    <div className="absolute inset-0 bg-brand-primary/20 blur-xl animate-glow rounded-full"></div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-2">Reset Password</h2>
                  <p className="text-slate-400">Enter your new password</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">New Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Confirm Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="input"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="Password reset illustration"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Secure & Protected</h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Strong Password</span>
                    <span className="auth-badge">Encrypted</span>
                    <span className="auth-badge">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default ResetPasswordPage;