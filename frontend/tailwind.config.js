import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',    // Indigo (modern, sophisticated)
          secondary: '#06b6d4',  // Cyan (accent)
          accent: '#ec4899',     // Pink (modern accent)
          dark: '#0f172a',       // Slate-900
          darker: '#020617',     // Even darker
          muted: '#64748b',      // Slate-500
        },
        gradient: {
          start: '#0f172a',      // Deep slate
          middle: '#4f46e5',     // Indigo-600
          end: '#6366f1',        // Indigo-500
        }
      },
      animation: {
        border: "border 4s linear infinite",
        glow: "glow 2.5s ease-in-out infinite alternate",
        float: "float 3.5s ease-in-out infinite",
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        slideIn: "slideIn 0.3s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
        glow: {
          from: { boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" },
          to: { boxShadow: "0 0 35px rgba(236, 72, 153, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'mesh-gradient': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'cosmic': 'radial-gradient(ellipse at center, #0f172a 0%, #0f172a 70%, #020617 100%)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '\"Segoe UI\"', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
    },
  },
  plugins: [daisyui],
};
