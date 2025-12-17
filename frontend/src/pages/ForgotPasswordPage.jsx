import { useState } from "react";
import { Link } from "react-router";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MailIcon, ArrowLeftIcon, LoaderIcon, CheckCircleIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      setIsSuccess(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full flex items-center justify-center p-4 bg-gradient-to-br from-brand-darker via-brand-dark to-brand-darker">
        <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
          <BorderAnimatedContainer>
            <div className="w-full flex flex-col md:flex-row">
              {/* FORM COLUMN - LEFT SIDE */}
              <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-brand-primary/30">
                <div className="w-full max-w-md text-center">
                  <div className="relative mb-6">
                    <CheckCircleIcon className="w-20 h-20 mx-auto text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">Check Your Email</h2>
                  <p className="text-slate-400 mb-6">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    The link will expire in 10 minutes. Check your spam folder if you don't see it.
                  </p>
                  <Link to="/login" className="auth-link">
                    Back to Login
                  </Link>
                </div>
              </div>

              {/* ILLUSTRATION - RIGHT SIDE */}
              <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                <div>
                  <img
                    src="/login.png"
                    alt="Email illustration"
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
                    <MailIcon className="w-16 h-16 mx-auto text-brand-primary animate-float" />
                    <div className="absolute inset-0 bg-brand-primary/20 blur-xl animate-glow rounded-full"></div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-2">Forgot Password?</h2>
                  <p className="text-slate-400">Enter your email to reset your password</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        placeholder="johndoe@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link flex items-center justify-center gap-2">
                    <ArrowLeftIcon className="w-4 h-4" />
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
                  <h3 className="text-xl font-medium text-cyan-400">Secure Password Reset</h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Secure</span>
                    <span className="auth-badge">10 Min Expiry</span>
                    <span className="auth-badge">One-Time Use</span>
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

export default ForgotPasswordPage;