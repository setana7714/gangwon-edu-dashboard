import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import SummaryBar from './components/SummaryBar';
import VenueGrid from './components/VenueGrid';
import Footer from './components/Footer';
import FaceDots from './components/FaceDots';
import { RiceBowlIcon } from './components/BrandIcon';
import type { Venue } from './types/venue';
import { filterVenues, INITIAL_FILTER, type FilterState } from './utils/filterVenues';
import { loadVenues } from './utils/loadVenues';

export default function App() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVenues()
      .then(setVenues)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '장소 데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => filterVenues(venues, filter), [venues, filter]);

  const isLocal = filter.category === 'LOCAL';
  // 업무 장소와 근처 밥집은 따로 셈
  const total = venues.filter((v) => (v.category === 'LOCAL') === isLocal).length;

  const updateFilter =(patch: Partial<FilterState>) => setFilter((prev) => ({ ...prev, ...patch }));
  // 정렬 기준은 필터 초기화 대상에서 제외
  const resetFilter = () =>
    setFilter((prev) => ({
      ...INITIAL_FILTER,
      sortBy: prev.sortBy,
      // 근처 밥집을 보던 중이면 초기화 후에도 근처 밥집에 머무름
      category: prev.category === 'LOCAL' ? 'LOCAL' : 'ALL',
    }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start">
        <FilterSidebar filter={filter} onChange={updateFilter} onReset={resetFilter} />
        <main className="min-w-0 flex-1">
          {isLocal && (
            <div className="mb-4 flex items-center gap-3 px-1">
              <RiceBowlIcon size={44} />
              <div>
                <h2 className="text-xl font-extrabold leading-tight">근처 밥집</h2>
                <p className="text-sm text-forest/70">오늘 초근 때 뭐먹지?</p>
              </div>
            </div>
          )}
          <SummaryBar
            count={filtered.length}
            total={total}
            adminDocsOnly={filter.needAdminDocs}
            sortBy={filter.sortBy}
            onSortChange={(sortBy) => updateFilter({ sortBy })}
          />
          {loading ? (
            <div className="mt-10 flex flex-col items-center text-sm text-forest/60">
              <FaceDots />
              장소를 불러오는 중이에요…
            </div>
          ) : error ? (
            <p className="mt-10 text-center text-sm font-medium">{error}</p>
          ) : (
            <VenueGrid venues={filtered} hasAny={total > 0} onReset={resetFilter} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
