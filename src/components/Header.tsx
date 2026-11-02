const DOODLE = 'url(brand/meetneat-doodle-pattern.svg)';

export default function Header() {
  return (
    <>
      <header className="border-b border-sage bg-vanilla">
        <div className="mx-auto max-w-7xl px-4 py-4">
          {/* 로고 그림 안 글자(밋앤잇)가 새 이름과 달라, 심볼 + 이름 글자로 구성 */}
          <a href="./" className="flex w-fit items-center gap-3">
            <img src="brand/meetneat-symbol.svg" alt="" className="h-11 w-11 sm:h-14 sm:w-14" />
            <span>
              <span className="block text-lg font-extrabold leading-tight tracking-[-0.04em] sm:text-2xl">
                쑥의 교육청도 식후경이다
              </span>
              <span className="block text-[11px] font-bold tracking-[0.15em] text-coral sm:text-xs">
                MEET • EAT • WORK WELL
              </span>
            </span>
          </a>
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
              오찬 미팅, 팀 회식, 미팅 카페, 연수·대관까지. 춘천의 업무 장소와 근처 밥집을 한곳에서 골라보세요.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
