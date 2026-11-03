import { useEffect, useState } from 'react';
import { countVisit } from '../utils/visitCounter';

export default function Footer() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    countVisit().then(setVisits);
  }, []);

  return (
    <footer className="mt-12 border-t-2 border-forest bg-forest text-vanilla">
      <div
        aria-hidden="true"
        className="h-[135px] bg-repeat-x"
        style={{ backgroundImage: 'url(brand/meetneat-doodle-pattern.svg)', backgroundSize: 'auto 100%' }}
      />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6">
        <img src="brand/meetneat-symbol.svg" alt="" className="h-12 w-12 shrink-0 motion-safe:animate-bob" />
        <div className="text-sm">
          <p className="font-display text-xl">은쑥이의 교육청도 식후경 🍚</p>
          <p className="text-vanilla/80">오늘도 맛있게 드시고, 퇴근은 칼같이! 🏃💨</p>
          <p className="mt-1 text-vanilla/90">🌿 은쑥이가 배고파서 만들었어요</p>
          {visits !== null && (
            <p className="mt-1">
              <span className="inline-block -rotate-2 rounded-full border-2 border-vanilla/60 bg-butter px-3 py-0.5 text-xs font-extrabold text-forest">
                👀 지금까지 {visits.toLocaleString('ko-KR')}번 열렸어요
              </span>
            </p>
          )}
          <p className="mt-2 text-vanilla/70">
            이곳은 은쑥이가 지극히 개인적으로 모은 정보예요. 소개된 곳을 이용하면서 생기는 일은 은쑥이가 책임질 수 없어요.
          </p>
          <p className="text-vanilla/70">장소 정보는 바뀔 수 있어요. 방문 전에 전화로 한 번 더 확인해 주세요.</p>
        </div>
      </div>
    </footer>
  );
}
