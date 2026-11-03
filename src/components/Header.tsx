const DOODLE = 'url(brand/meetneat-doodle-pattern.svg)';

export default function Header() {
  return (
    <>
      <header className="border-b-2 border-forest bg-vanilla">
        <div className="mx-auto max-w-7xl px-4 py-3">
          {/* 로고 그림 안 글자(밋앤잇)가 새 이름과 달라, 심볼 + 이름 글자로 구성 */}
          <a href="./" className="group flex w-fit items-center gap-3">
            <img
              src="brand/meetneat-symbol.svg"
              alt=""
              className="h-12 w-12 motion-safe:animate-bob motion-safe:group-hover:animate-wiggle sm:h-16 sm:w-16"
            />
            <span>
              <span className="block font-display text-2xl leading-tight sm:text-4xl">은쑥이의 교육청도 식후경</span>
              <span className="mt-0.5 block text-[11px] font-bold tracking-[0.15em] text-coral sm:text-xs">
                🍚 MEET • EAT • WORK WELL 🍜
              </span>
            </span>
          </a>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-card border-2 border-forest bg-forest text-vanilla shadow-pop">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[420px] bg-cover bg-center md:block"
            style={{ backgroundImage: DOODLE }}
          />
          {/* 둥둥 떠다니는 음식 스티커 */}
          <span aria-hidden="true" className="absolute right-6 top-4 text-4xl motion-safe:animate-bob">🍜</span>
          <span aria-hidden="true" className="absolute bottom-5 right-24 hidden text-3xl [animation-delay:0.8s] motion-safe:animate-bob md:block">☕</span>
          <span aria-hidden="true" className="absolute right-40 top-6 hidden text-3xl [animation-delay:1.6s] motion-safe:animate-bob md:block">🍗</span>
          <div className="relative px-6 py-5 sm:px-8 sm:py-8 md:pr-[440px]">
            <span className="inline-block -rotate-3 rounded-full border-2 border-forest bg-coral px-3 py-1 text-sm font-extrabold text-forest shadow-pop-sm motion-safe:animate-wiggle">
              꼬르륵… 🍚
            </span>
            <h1 className="mt-3 text-3xl leading-tight sm:mt-4 sm:text-5xl">
              일도 <span className="text-butter">밥심</span>부터! 🥢
            </h1>
            <p className="mt-3 hidden max-w-xl text-sm text-vanilla/90 sm:block sm:text-base">
              배고프면 결재도 안 넘어가요 😋 점심 오찬부터 초근 저녁까지, 도교육청 근처 밥집·카페·연수 장소를
              골라보세요!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
