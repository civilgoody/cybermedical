import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#1F1F1F",
        input: "#1F1F1F",
        ring: "#FF29A8",
        background: "#141414",
        foreground: "#FFFFFF",
        
        primary: {
          DEFAULT: "#FF29A8",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#141414",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF3333",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#666666",
          foreground: "#888888",
        },
        accent: {
          DEFAULT: "#1F1F1F",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#141414",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#6EE2AD",
          foreground: "#141414",
        },
        warning: {
          DEFAULT: "#FFB800",
          foreground: "#141414",
        },
        info: {
          DEFAULT: "#00FFFF",
          foreground: "#141414",
        },

        // Gradients
        cta: "linear-gradient(161.36deg, #8845BE 19.26%, #B94AAB 46.7%, #881D7B 87.39%)",
        
        // Legacy color tokens (keeping for compatibility)
        FF29A8: "#FF29A8",
        "00FFFF": "#00FFFF",
        "6EE2AD": "#6EE2AD",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

