import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import SummaryBar from './components/SummaryBar';
import VenueGrid from './components/VenueGrid';
import Footer from './components/Footer';
import FaceDots from './components/FaceDots';
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

  const updateFilter = (patch: Partial<FilterState>) => setFilter((prev) => ({ ...prev, ...patch }));
  // 정렬 기준은 필터 초기화 대상에서 제외
  const resetFilter = () => setFilter((prev) => ({ ...INITIAL_FILTER, sortBy: prev.sortBy }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start">
        <FilterSidebar filter={filter} onChange={updateFilter} onReset={resetFilter} />
        <main className="min-w-0 flex-1">
          <SummaryBar
            count={filtered.length}
            total={venues.length}
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
            <VenueGrid venues={filtered} onReset={resetFilter} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
