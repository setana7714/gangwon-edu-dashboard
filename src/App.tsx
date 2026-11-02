import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import SummaryBar from './components/SummaryBar';
import VenueGrid from './components/VenueGrid';
import Footer from './components/Footer';
import FaceDots from './components/FaceDots';
import { RiceBowlIcon } from './components/BrandIcon';
import type { Venue } from './types/venue';
import { filterVenues, getAvailability, INITIAL_FILTER, type FilterState } from './utils/filterVenues';
import { loadVenues } from './utils/loadVenues';

// 지금 화면의 프로그램 파일과 서버에 올라간 최신 파일이 다르면 새 버전이 배포된 것
async function isNewVersionPublished(): Promise<boolean> {
  const current = document.querySelector<HTMLScriptElement>('script[src*="assets/index-"]')?.getAttribute('src');
  if (!current) return false; // 개발 서버에서는 확인하지 않음
  try {
    const html = await (await fetch('./', { cache: 'no-store' })).text();
    const latest = html.match(/assets\/index-[^"']+\.js/)?.[0];
    return Boolean(latest && !current.endsWith(latest));
  } catch {
    return false;
  }
}

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

    // 열어 둔 화면으로 돌아오면 새로고침 없이 최신 상태로 맞춤
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;
      if (await isNewVersionPublished()) {
        window.location.reload();
        return;
      }
      loadVenues().then(setVenues).catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const filtered = useMemo(() => filterVenues(venues, filter), [venues, filter]);
  const available = useMemo(() => getAvailability(venues), [venues]);

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
        <FilterSidebar filter={filter} available={available} onChange={updateFilter} onReset={resetFilter} />
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
