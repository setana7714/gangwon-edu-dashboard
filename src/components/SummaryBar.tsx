import type { FilterState } from '../utils/filterVenues';

interface Props {
  count: number;
  total: number;
  adminDocsOnly: boolean;
  sortBy: FilterState['sortBy'];
  onSortChange: (sortBy: FilterState['sortBy']) => void;
}

export default function SummaryBar({ count, total, adminDocsOnly, sortBy, onSortChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-card border border-sage bg-white px-5 py-3 shadow-card">
      <div>
        <p className="text-sm">
          총 <strong className="text-lg font-extrabold">{count}</strong>곳을 찾았어요
          <span className="ml-2 text-xs text-forest/50">(전체 {total}곳)</span>
        </p>
        {adminDocsOnly && count > 0 && (
          <p className="text-xs font-medium text-forest/70">좋아요. 행정서류까지 챙기는 곳만 모았어요.</p>
        )}
      </div>
      <label className="flex shrink-0 items-center gap-2 text-sm text-forest/70">
        정렬
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
          className="rounded-full border border-sage bg-white px-3 py-1.5 text-sm font-medium text-forest focus:border-forest focus:outline-none"
        >
          <option value="RATING">평점순</option>
          <option value="NAME">이름순</option>
          <option value="DISTANCE">가까운순</option>
        </select>
      </label>
    </div>
  );
}
