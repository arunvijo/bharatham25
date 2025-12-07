// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF5101",
        cream: "#F4E5D4",
        white: "#faf5ee",
        black: "#271811",
        yellow: "#F4F437",
      },

      fontFamily: {
        mont: ["Mont", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
      },

      fontSize: {
        // Big hero title (BHARATHAM26 in hero)
        "display-hero": ["clamp(2.8rem, 8vw, 5rem)", { lineHeight: "1" }],

        // Overlay nav text (HOME / ABOUT / EVENTS…)
        "display-nav": ["clamp(3rem, 9vw, 6rem)", { lineHeight: "1.1" }],

        // Navbar logo text
        "brand-logo": ["clamp(1.2rem, 5vw, 2.5rem)", { lineHeight: "1" }],

        // Button text (LOGIN etc.)
        "btn": ["clamp(0.9rem, 1.4vw, 1.1rem)", { lineHeight: "1.2" }],

        // Small label (like "Scroll")
        "label": ["0.75rem", { lineHeight: "1.2" }],
      },

      keyframes: {
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        menuJumpIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(100vh)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        menuJumpOut: {
          "0%": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(100vh)",
          },
        },
      },
      animation: {
        spinSlow: "spinSlow 5s linear infinite",
        spinVerySlow: "spinSlow 12s linear infinite",
        spinUltraSlow: "spinSlow 20s linear infinite",
        menuJumpIn: "menuJumpIn 1s cubic-bezier(0.16, 1, 0.3, 1) both",
        menuJumpOut: "menuJumpOut 0.7s cubic-bezier(0.4, 0, 0.6, 1) both",
      },
    },
  },
  plugins: [],
};