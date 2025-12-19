import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative w-full max-w-6xl md:h-[800px] h-auto z-10">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 lg:p-12 flex items-center justify-center md:border-r border-slate-700/50">
              <div className="w-full max-w-md animate-fadeIn">
                {/* HEADING TEXT */}
                <div className="text-center mb-10">
                  <div className="relative mb-6 inline-block w-full">
                    <MessageCircleIcon className="w-16 h-16 mx-auto text-brand-accent animate-float" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-primary opacity-20 blur-2xl animate-glow rounded-full"></div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-100 via-brand-accent to-slate-100 bg-clip-text text-transparent mb-3">Create Account</h2>
                  <p className="text-slate-400 text-lg">Join our community today</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* FULL NAME */}
                  <div className="group">
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

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
                  <button className="auth-btn mt-8" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-700/50">
                  <p className="text-center text-sm text-slate-400">Already have an account?</p>
                  <Link to="/login" className="block w-full px-4 py-3 text-center bg-slate-800/50 hover:bg-slate-800 text-slate-100 rounded-xl font-medium transition-all duration-300 border border-slate-700/50 hover:border-brand-primary/30">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-slate-800/20 to-transparent relative overflow-hidden">
              {/* Decorative gradient circles */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/5 to-transparent opacity-50"></div>
              
              <div className="relative z-10 text-center max-w-sm">
                <img
                  src="/signup.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain drop-shadow-2xl mb-8 animate-slideIn"
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">Ready to Connect?</h3>
                  <p className="text-slate-400 text-sm mb-8">Join thousands of users enjoying seamless messaging and real-time communication</p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="auth-badge">✓ No Credit Card</span>
                    <span className="auth-badge">✓ Instant Setup</span>
                    <span className="auth-badge">✓ Free Forever</span>
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
export default SignUpPage;
