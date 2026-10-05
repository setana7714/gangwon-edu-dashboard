import type { ReactNode } from 'react';
import { Car, DoorClosed, FileText, RotateCcw, Search, Video } from 'lucide-react';
import { CATEGORY_LABEL, type Category } from '../types/venue';
import type { FilterState } from '../utils/filterVenues';

interface Props {
  filter: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const CATEGORIES: Category[] = ['ALL', 'MEAL', 'CAFE', 'VENUE'];

const CAPACITY_GROUPS = [
  { value: 0, label: '전체' },
  { value: 2, label: '2~6인' },
  { value: 7, label: '7~15인' },
  { value: 16, label: '16~50인' },
];

const PRICE_LIMITS = [
  { value: 0, label: '전체' },
  { value: 10000, label: '1만원 이하' },
  { value: 20000, label: '2만원 이하' },
  { value: 30000, label: '3만원 이하' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
        active
          ? 'border-blue-700 bg-blue-700 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  icon,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
      <span className="flex items-center gap-2 text-sm text-slate-700">
        {icon}
        {label}
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-slate-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-blue-700 peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400" />
    </label>
  );
}

export default function FilterSidebar({ filter, onChange, onReset }: Props) {
  return (
    <aside className="w-full shrink-0 space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:w-72">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">조건 선택</h2>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-700"
        >
          <RotateCcw size={14} />
          초기화
        </button>
      </div>

      <label className="relative block">
        <span className="sr-only">상호명 검색</span>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={filter.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          placeholder="상호명 · 주소 · 인근 기관 검색"
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
        />
      </label>

      <Section title="카테고리">
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <ChoiceButton key={c} active={filter.category === c} onClick={() => onChange({ category: c })}>
              {CATEGORY_LABEL[c]}
            </ChoiceButton>
          ))}
        </div>
      </Section>

      <Section title="인원">
        <div className="grid grid-cols-2 gap-2">
          {CAPACITY_GROUPS.map((g) => (
            <ChoiceButton
              key={g.value}
              active={filter.capacityGroup === g.value}
              onClick={() => onChange({ capacityGroup: g.value })}
            >
              {g.label}
            </ChoiceButton>
          ))}
        </div>
      </Section>

      <Section title="1인당 가격">
        <div className="grid grid-cols-2 gap-2">
          {PRICE_LIMITS.map((p) => (
            <ChoiceButton key={p.value} active={filter.maxPrice === p.value} onClick={() => onChange({ maxPrice: p.value })}>
              {p.label}
            </ChoiceButton>
          ))}
        </div>
      </Section>

      <Section title="시설">
        <Toggle
          checked={filter.needBeam}
          onChange={(needBeam) => onChange({ needBeam })}
          icon={<Video size={16} className="text-slate-500" />}
          label="빔프로젝터 보유"
        />
        <Toggle
          checked={filter.needPrivateRoom}
          onChange={(needPrivateRoom) => onChange({ needPrivateRoom })}
          icon={<DoorClosed size={16} className="text-slate-500" />}
          label="프라이빗 룸"
        />
        <Toggle
          checked={filter.needParking}
          onChange={(needParking) => onChange({ needParking })}
          icon={<Car size={16} className="text-slate-500" />}
          label="전용 주차장"
        />
      </Section>

      <Section title="행정서류">
        <Toggle
          checked={filter.needAdminDocs}
          onChange={(needAdminDocs) => onChange({ needAdminDocs })}
          icon={<FileText size={16} className="text-slate-500" />}
          label="행정서류 4종 완비 장소만 보기"
        />
        <p className="mt-1 px-2 text-xs leading-relaxed text-slate-400">
          전자세금계산서 · 견적서 · 사업자등록증 · 관공서/법인카드 결제
        </p>
      </Section>
    </aside>
  );
}
