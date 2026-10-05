import type { Venue } from '../types/venue';
import VenueCard from './VenueCard';

interface Props {
  venues: Venue[];
  onReset: () => void;
}

export default function VenueGrid({ venues, onReset }: Props) {
  if (venues.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
        <p className="text-sm text-slate-600">조건에 맞는 장소가 없습니다.</p>
        <button type="button" onClick={onReset} className="mt-3 text-sm font-semibold text-blue-700 hover:underline">
          조건 초기화
        </button>
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
