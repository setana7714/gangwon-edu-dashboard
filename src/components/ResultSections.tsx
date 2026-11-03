import { TAB_GROUPED, type Tab, type Venue } from '../types/venue';
import { groupByDrive } from '../utils/filterVenues';
import VenueGrid from './VenueGrid';

interface Props {
  tab: Tab;
  venues: Venue[];
  hasAny: boolean;
  onReset: () => void;
}

// 식당·회식·카페는 차로 시간 구간별로 묶어서, 근처 밥집·연수·대관은 한 목록으로 보여줌
export default function ResultSections({ tab, venues, hasAny, onReset }: Props) {
  if (venues.length === 0 || !TAB_GROUPED[tab]) {
    return <VenueGrid venues={venues} hasAny={hasAny} onReset={onReset} />;
  }

  return (
    <div className="space-y-8">
      {groupByDrive(venues).map((g) => (
        <section key={g.key}>
          <h3 className="mt-6 inline-block -rotate-1 rounded-full border-2 border-forest bg-coral/30 px-4 py-1 text-xl shadow-pop-sm">
            {g.label} <span className="font-sans text-sm font-bold text-forest/70">· {g.venues.length}곳</span>
          </h3>
          <VenueGrid venues={g.venues} hasAny={hasAny} onReset={onReset} />
        </section>
      ))}
    </div>
  );
}
