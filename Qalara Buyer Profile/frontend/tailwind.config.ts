import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          50: "#fbf7f3",
          100: "#f2e8de",
          500: "#a9654a",
          700: "#774533"
        },
        ink: "#22201d"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(34, 32, 29, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
