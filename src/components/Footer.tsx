export default function Footer() {
  return (
    <footer className="mt-12 bg-forest text-vanilla">
      <div
        aria-hidden="true"
        className="h-[135px] bg-repeat-x"
        style={{ backgroundImage: 'url(brand/meetneat-doodle-pattern.svg)', backgroundSize: 'auto 100%' }}
      />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6">
        <img src="brand/meetneat-symbol.svg" alt="" className="h-10 w-10 shrink-0" />
        <div className="text-sm">
          <p className="font-bold">밋앤잇 · 강원특별자치도교육청 업무 지원 장소 대시보드</p>
          <p className="mt-0.5 text-vanilla/70">장소 정보는 바뀔 수 있어요. 방문 전에 전화로 한 번 더 확인해 주세요.</p>
        </div>
      </div>
    </footer>
  );
}
