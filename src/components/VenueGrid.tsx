import type { Venue } from '../types/venue';
import FaceDots from './FaceDots';
import VenueCard from './VenueCard';

interface Props {
  venues: Venue[];
  hasAny: boolean; // 조건과 무관하게 등록된 곳이 하나라도 있는지
  onReset: () => void;
}

export default function VenueGrid({ venues, hasAny, onReset }: Props) {
  if (venues.length === 0) {
    return (
      <div className="mt-4 overflow-hidden rounded-card border border-sage bg-white text-center shadow-card">
        <div
          aria-hidden="true"
          className="h-[120px] bg-forest bg-repeat-x"
          style={{ backgroundImage: 'url(brand/meetneat-doodle-pattern.svg)', backgroundSize: 'auto 100%' }}
        />
        <div className="flex flex-col items-center px-4 py-8">
          <FaceDots />
          {hasAny ? (
            <>
              <p className="mt-2 text-sm font-medium">
                음, 이 조건으로는 딱 맞는 곳이 없어요. 필터를 살짝 풀어볼까요?
              </p>
              <button
                type="button"
                onClick={onReset}
                className="mt-4 rounded-full bg-coral px-5 py-2 text-sm font-bold transition hover:brightness-95"
              >
                필터 초기화하기
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm font-medium">아직 등록된 곳이 없어요. 곧 채워둘게요.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {venues.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  );
}
