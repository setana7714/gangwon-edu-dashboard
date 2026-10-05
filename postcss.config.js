import { fileURLToPath } from 'node:url';

export default {
  plugins: {
    // 실행 위치와 무관하게 설정 파일을 찾도록 절대 경로 지정
    tailwindcss: { config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) },
    autoprefixer: {},
  },
};
