import { TAB_LABEL, TAB_ORDER, type Tab } from '../types/venue';
import { TabIcon } from './BrandIcon';

interface Props {
  tab: Tab;
  counts: Record<Tab, number>;
  onChange: (tab: Tab) => void;
}

// 맨 위 큰 버튼 한 줄: 하나만 누르면 바로 결과가 나옴
export default function TabBar({ tab, counts, onChange }: Props) {
  return (
    <nav aria-label="장소 종류" className="grid grid-cols-5 gap-2 sm:gap-3">
      {TAB_ORDER.map((t) => {
        const active = t === tab;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t)}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2.5 transition duration-150 hover:-rotate-1 hover:scale-105 active:scale-95 sm:py-3 ${
              active
                ? 'border-forest bg-butter shadow-pop-sm'
                : 'border-forest/20 bg-white hover:border-forest hover:bg-butter/30'
            }`}
          >
            <span className={active ? 'motion-safe:animate-wiggle' : ''}>
              <TabIcon tab={t} size={38} />
            </span>
            <span className={`text-[12px] leading-tight sm:text-base ${active ? 'font-extrabold' : 'font-bold'}`}>
              {TAB_LABEL[t]}
            </span>
            <span className="text-[10px] font-medium text-forest/60 sm:text-xs">{counts[t]}곳</span>
          </button>
        );
      })}
    </nav>
  );
}
