// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {

        primary: "#FF5101",
        cream: "#F4E5D4",
        white: "#faf5ee",
        black: "#271811",
        yellow: "#F4F437",


        // Backgrounds (Keep warm but clean)
        'desi-cream': '#FDFBF7',
        'desi-stone': '#E7E5E4',
        
        // Accents (Keep vibrant)
        'desi-saffron': '#D97706', 
        'desi-teal': '#0F766E',    
        'desi-maroon': '#9F1239',  
        
        // TEXT COLORS (Darker for Better Contrast)
        'desi-dark': '#0F0F0F',    // Almost black (was #1C1917)
        'desi-gray': '#44403C',    // Dark Charcoal (was #57534E)
        'desi-muted': '#78716C',   // New: For less important text (still readable)
      },
      fontFamily: {
        'reality': ['"Reality Stone"', 'sans-serif'], 
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        mont: ["Mont", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
      },
      // Increase default font sizes slightly
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
        xs: ['0.8rem', { lineHeight: '1rem' }],    // Was 0.75rem
        sm: ['0.925rem', { lineHeight: '1.25rem' }], // Was 0.875rem
        base: ['1.05rem', { lineHeight: '1.6rem' }], // Was 1rem
        lg: ['1.2rem', { lineHeight: '1.75rem' }],   // Was 1.125rem
        xl: ['1.35rem', { lineHeight: '1.85rem' }],  // Was 1.25rem
        '2xl': ['1.6rem', { lineHeight: '2.1rem' }], // Was 1.5rem
        '3xl': ['2rem', { lineHeight: '2.3rem' }],    // Was 1.875rem
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
}
