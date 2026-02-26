/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                leo: {
                    primary: "#E85D04", // Brand Orange (Terracotta)
                    secondary: "#1A1A1A", // Deep Dark
                    bg: "#F5F5F4", // Light Cream / Beige
                    accent: "#FFD8C4", // Muted Peach Highlight
                    white: "#FFFFFF",
                    gray: {
                        50: "#F9FAFB",
                        100: "#F3F4F6",
                        200: "#E5E7EB",
                        300: "#D1D5DB",
                        400: "#9CA3AF",
                        500: "#6B7280",
                        600: "#4B5563",
                        900: "#111827",
                    },
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
};
