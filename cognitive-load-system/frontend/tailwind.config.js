/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        mist: "#d8e3f0",
        signal: "#f97316",
        tealwave: "#14b8a6",
        roseheat: "#fb7185"
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.28)"
      }
    }
  },
  plugins: []
};

