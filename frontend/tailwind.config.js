import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8b5cf6',    // Purple
          secondary: '#06b6d4',  // Cyan
          accent: '#f97316',     // Orange
          dark: '#0f172a',       // Slate-900
          darker: '#020617',     // Even darker
        },
        gradient: {
          start: '#1e1b4b',      // Purple-900
          middle: '#7c3aed',     // Violet-600
          end: '#0f172a',        // Slate-900
        }
      },
      animation: {
        border: "border 4s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
        glow: {
          from: { boxShadow: "0 0 20px #8b5cf6" },
          to: { boxShadow: "0 0 30px #f97316" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'cosmic': 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f172a 70%, #020617 100%)',
      }
    },
  },
  plugins: [daisyui],
};
