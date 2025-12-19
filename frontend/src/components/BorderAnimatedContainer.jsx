// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#0f172a,theme(colors.slate.800)_50%,#0f172a)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_#6366f1_86%,_#ec4899_90%,_#06b6d4_94%,_theme(colors.slate.600/.48))_border-box] rounded-3xl border border-transparent animate-border flex overflow-hidden shadow-2xl shadow-brand-primary/20">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
