import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px] z-10">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 lg:p-12 flex items-center justify-center md:border-r border-slate-700/50">
              <div className="w-full max-w-md animate-fadeIn">
                {/* HEADING TEXT */}
                <div className="text-center mb-10">
                  <div className="relative mb-6 inline-block w-full">
                    <MessageCircleIcon className="w-16 h-16 mx-auto text-brand-primary animate-float" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-accent opacity-20 blur-2xl animate-glow rounded-full"></div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-100 via-brand-primary to-slate-100 bg-clip-text text-transparent mb-3">Welcome Back</h2>
                  <p className="text-slate-400 text-lg">Continue your conversations</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* EMAIL INPUT */}
                  <div className="group">
                    <label className="auth-input-label">Email Address</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div className="group">
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn mt-8" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-700/50">
                  <p className="text-center text-sm text-slate-400">Don't have an account?</p>
                  <Link to="/signup" className="block w-full px-4 py-3 text-center bg-slate-800/50 hover:bg-slate-800 text-slate-100 rounded-xl font-medium transition-all duration-300 border border-slate-700/50 hover:border-brand-primary/30">
                    Create Account
                  </Link>
                  <Link to="/forgot-password" className="block text-center text-brand-primary hover:text-brand-accent text-sm font-medium transition-colors duration-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-slate-800/20 to-transparent relative overflow-hidden">
              {/* Decorative gradient circles */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent opacity-50"></div>
              
              <div className="relative z-10 text-center max-w-sm">
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain drop-shadow-2xl mb-8 animate-slideIn"
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">Stay Connected</h3>
                  <p className="text-slate-400 text-sm mb-8">Message, call, and share in real-time with crystal-clear quality</p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="auth-badge">🔒 Secure</span>
                    <span className="auth-badge">⚡ Fast</span>
                    <span className="auth-badge">✨ Modern</span>
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
export default LoginPage;
