import forms from "@tailwindcss/forms";
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./src/**/*.{html,jsx,js}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f8f9fc',
                    100: '#f0f3f9',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                accent: {
                    500: '#06b6d4',
                    600: '#0891b2',
                },
            },
        },
    },
    plugins: [forms],
};
