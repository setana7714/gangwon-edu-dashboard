/** @type {import('tailwindcss').Config} */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{ts,tsx}'] },
  theme: {
    extend: {
      // design/meetneat-brand-guide.md 의 토큰
      colors: {
        mint: '#9CE6D3',
        coral: '#FF8368',
        forest: '#173B3F',
        vanilla: '#FFF7E8',
        sage: '#DDE8E3',
      },
      borderRadius: {
        card: '24px',
      },
      boxShadow: {
        card: '0 14px 30px rgb(23 59 63 / 0.07)',
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
