// 브랜드 가이드의 UI 시그니처: 두 눈 + 미소 (빈 상태·로딩에 사용)
export default function FaceDots({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="16" cy="19" r="3.5" fill="currentColor" />
      <circle cx="32" cy="19" r="3.5" fill="currentColor" />
      <path d="M15 29c5 6 13 6 18 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
