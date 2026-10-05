const DOODLE = 'url(brand/meetneat-doodle-pattern.svg)';

export default function Header() {
  return (
    <>
      <header className="border-b border-sage bg-vanilla">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <a href="./" aria-label="쑥's 밋앤잇 홈">
            <img src="brand/meetneat-logo.svg" alt="" className="hidden h-[72px] w-auto sm:block" />
            <span className="flex items-center gap-2 sm:hidden">
              <img src="brand/meetneat-symbol.svg" alt="" className="h-10 w-10" />
              <span className="text-xl font-extrabold tracking-[-0.04em]">쑥's 밋앤잇</span>
            </span>
          </a>
          <p className="hidden text-2xl font-extrabold tracking-[-0.04em] sm:block">쑥's 밋앤잇</p>
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
