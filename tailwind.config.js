/** @type {import('tailwindcss').Config} */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{ts,tsx}'] },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '"Malgun Gothic"', '"Apple SD Gothic Neo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
