import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#fbf8ff",
          100: "#f4ecff",
          200: "#e9d9ff",
          300: "#d8bdff",
          400: "#b98cff",
          500: "#9868e8",
          600: "#7649c4",
          700: "#573498"
        },
        dusk: "#312449",
        plum: "#5c3b76",
        mist: "#f7f1fb",
        petal: "#ffe9f3",
        sage: "#dff4ea"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(99, 70, 135, 0.16)",
        glow: "0 12px 30px rgba(152, 104, 232, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
