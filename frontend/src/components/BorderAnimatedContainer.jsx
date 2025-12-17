// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#0f172a,theme(colors.slate.800)_50%,#0f172a)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_#8b5cf6_86%,_#f97316_90%,_#06b6d4_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border  flex overflow-hidden shadow-2xl shadow-brand-primary/10">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
