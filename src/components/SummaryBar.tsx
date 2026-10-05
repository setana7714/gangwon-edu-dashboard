import type { FilterState } from '../utils/filterVenues';

interface Props {
  count: number;
  total: number;
  sortBy: FilterState['sortBy'];
  onSortChange: (sortBy: FilterState['sortBy']) => void;
}

export default function SummaryBar({ count, total, sortBy, onSortChange }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm text-slate-700">
        총 <strong className="text-lg text-blue-700">{count}</strong>곳 검색됨
        <span className="ml-2 text-xs text-slate-400">(전체 {total}곳)</span>
      </p>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        정렬
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="RATING">평점순</option>
          <option value="NAME">이름순</option>
          <option value="DISTANCE">가까운순</option>
        </select>
      </label>
    </div>
  );
}
