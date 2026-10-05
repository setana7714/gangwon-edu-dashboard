const DOODLE = 'url(brand/meetneat-doodle-pattern.svg)';

export default function Header() {
  return (
    <>
      <header className="border-b border-sage bg-vanilla">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <a href="./" aria-label="밋앤잇 홈">
            <img src="brand/meetneat-logo.svg" alt="밋앤잇" className="hidden h-[72px] w-auto sm:block" />
            <span className="flex items-center gap-2 sm:hidden">
              <img src="brand/meetneat-symbol.svg" alt="" className="h-10 w-10" />
              <span className="text-xl font-extrabold tracking-[-0.04em]">밋앤잇</span>
            </span>
          </a>
          <p className="text-right text-xs font-medium text-forest/70 sm:text-sm">
            강원특별자치도교육청
            <br className="sm:hidden" /> 업무 지원 장소 대시보드
          </p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-card bg-forest text-vanilla">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[420px] bg-cover bg-center md:block"
            style={{ backgroundImage: DOODLE }}
          />
          <div className="relative px-6 py-8 sm:px-8 md:pr-[440px]">
            <p className="text-xs font-extrabold tracking-[0.15em] text-coral">MEET • EAT • WORK WELL</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
              오늘의 업무, 장소 고르기부터 가볍게.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-vanilla/80 sm:text-base">
              오찬 미팅, 팀 회식, 미팅 카페, 연수·대관까지. 인원과 시설, 행정서류 지원 여부로 춘천의 업무 장소를
              골라보세요.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
