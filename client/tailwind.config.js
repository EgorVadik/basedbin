/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                crimson: ['Crimson Pro', 'serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            boxShadow: {
                '3xl': '0px 4px 20px rgba(0, 0, 0, 0.25)',
                '4xl': '0px 4px 20px 5px rgba(0, 0, 0, 0.25);',
            },
        },
    },
    // eslint-disable-next-line no-undef
    plugins: [require('@tailwindcss/typography')],
}
