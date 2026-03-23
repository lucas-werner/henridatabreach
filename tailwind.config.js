/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brabant: {
          red: "#dd0000",
          black: "#1d1d1b",
          gray: "#75848b",
          blue: "#224271",
          aqua: "#006e79",
          green: "#56a446",
          yellow: "#f7a823",
          rose: "#e35178",
          cream: "#f7f4f1"
        }
      },
      fontFamily: {
        display: ['"Futura PT"', "Futura", "Arial", "sans-serif"],
        body: ["Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 40px rgba(29, 29, 27, 0.08)",
        panel: "0 28px 80px rgba(29, 29, 27, 0.12)"
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.65" },
          "50%": { transform: "scale(1.25)", opacity: "1" }
        }
      },
      animation: {
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
