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
        blush: '#FFD9E4', // 귀여운 분홍 포인트
        sky: '#CDEBFF',
        butter: '#FFD45C', // 만화 느낌 포인트 색
      },
      borderRadius: {
        card: '24px',
      },
      boxShadow: {
        card: '0 14px 30px rgb(23 59 63 / 0.07)',
        // 만화 컷처럼 어긋난 그림자
        pop: '5px 5px 0 0 #173B3F',
        'pop-sm': '3px 3px 0 0 #173B3F',
      },
      keyframes: {
        wiggle: { '0%,100%': { transform: 'rotate(-5deg)' }, '50%': { transform: 'rotate(5deg)' } },
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        // 끝 상태는 쓰지 않아 원래 스타일(살짝 기울어진 각도)로 자연스럽게 도착
        'pop-in': { '0%': { opacity: '0', transform: 'scale(0.9) translateY(10px)' } },
      },
      animation: {
        wiggle: 'wiggle 1.4s ease-in-out infinite',
        bob: 'bob 3s ease-in-out infinite',
        'pop-in': 'pop-in 0.4s ease-out backwards',
      },
      fontFamily: {
        display: ['Jua', '"Pretendard Variable"', 'Pretendard', 'sans-serif'],
        sans: ['"Pretendard Variable"', 'Pretendard', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
