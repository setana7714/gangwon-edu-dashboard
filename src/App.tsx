import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import FilterPanel from './components/FilterPanel';
import SummaryBar from './components/SummaryBar';
import ResultSections from './components/ResultSections';
import Footer from './components/Footer';
import FaceDots from './components/FaceDots';
import { TabIcon } from './components/BrandIcon';
import { TAB_HINT, TAB_LABEL, TAB_ORDER, type Tab, type Venue } from './types/venue';
import {
  defaultSort,
  filterVenues,
  getAvailability,
  INITIAL_FILTER,
  tabOf,
  WALK_LIMIT_MIN,
  type FilterState,
} from './utils/filterVenues';
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

  const { tab } = filter;

  const counts = useMemo(() => {
    const c = Object.fromEntries(TAB_ORDER.map((t) => [t, 0])) as Record<Tab, number>;
    for (const v of venues) c[tabOf(v)] += 1;
    return c;
  }, [venues]);

  const tabVenues = useMemo(() => venues.filter((v) => tabOf(v) === tab), [venues, tab]);
  const available = useMemo(() => getAvailability(tabVenues), [tabVenues]);
  const filtered = useMemo(() => filterVenues(venues, filter), [venues, filter]);

  const updateFilter = (patch: Partial<FilterState>) => setFilter((prev) => ({ ...prev, ...patch }));
  const changeTab = (next: Tab) => setFilter({ ...INITIAL_FILTER, tab: next, sortBy: defaultSort(next) });
  // 조건만 되돌리고 보던 버튼과 정렬은 유지
  const resetFilter = () => setFilter((prev) => ({ ...INITIAL_FILTER, tab: prev.tab, sortBy: prev.sortBy }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-4 py-6">
        <TabBar tab={tab} counts={counts} onChange={changeTab} />

        <div className="flex items-center gap-3 px-1">
          <TabIcon tab={tab} size={48} />
          <div>
            <h2 className="text-3xl leading-tight">{TAB_LABEL[tab]}</h2>
            <p className="text-sm text-forest/70">{TAB_HINT[tab]}</p>
            {tab === 'LOCAL' && (
              <p className="text-xs text-forest/50">걸어서 {WALK_LIMIT_MIN}분 이내이거나 배달되는 곳이에요</p>
            )}
          </div>
        </div>

        <FilterPanel filter={filter} available={available} onChange={updateFilter} onReset={resetFilter} />

        <SummaryBar
          count={filtered.length}
          total={tabVenues.length}
          adminDocsOnly={filter.needAdminDocs && tab !== 'LOCAL'}
          sortBy={filter.sortBy}
          onSortChange={(sortBy) => updateFilter({ sortBy })}
        />

        {loading ? (
          <div className="mt-10 flex flex-col items-center text-sm text-forest/60">
            <FaceDots />
            밥 짓는 중이에요… 🍚
          </div>
        ) : error ? (
          <p className="mt-10 text-center text-sm font-medium">{error}</p>
        ) : (
          <ResultSections tab={tab} venues={filtered} hasAny={tabVenues.length > 0} onReset={resetFilter} />
        )}
      </div>
      <Footer />
    </div>
  );
}
