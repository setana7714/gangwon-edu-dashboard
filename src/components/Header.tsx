export default function Header() {
  return (
    <header className="bg-blue-900 text-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <h1 className="text-xl font-bold sm:text-2xl">
          🏛️ 밋앤잇 <span className="font-medium text-blue-200">(Meet &amp; Eat)</span>
        </h1>
        <p className="mt-1 text-sm text-blue-200">
          강원특별자치도교육청 업무 지원 장소 대시보드 — 오찬 미팅 · 팀 회식 · 미팅 카페 · 연수/대관 장소를 업무
          조건과 행정서류 지원 여부로 검색합니다.
        </p>
      </div>
    </header>
  );
}
