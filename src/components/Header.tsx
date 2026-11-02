const DOODLE = 'url(brand/meetneat-doodle-pattern.svg)';

export default function Header() {
  return (
    <>
      <header className="border-b-2 border-forest bg-vanilla">
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
        <div className="relative overflow-hidden rounded-card border-2 border-forest bg-forest text-vanilla shadow-pop">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[420px] bg-cover bg-center md:block"
            style={{ backgroundImage: DOODLE }}
          />
          <div className="relative px-6 py-8 sm:px-8 md:pr-[440px]">
            <span className="inline-block -rotate-3 rounded-full border-2 border-forest bg-coral px-3 py-1 text-xs font-extrabold text-forest shadow-pop-sm">
              꼬르륵… 🍚
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              일도 <span className="text-butter">밥심</span>부터!
            </h1>
            <p className="mt-3 max-w-xl text-sm text-vanilla/85 sm:text-base">
              배고프면 결재도 안 넘어가요. 점심 오찬부터 초근 저녁까지, 도교육청 근처 밥집·카페·연수 장소를
              골라보세요.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
