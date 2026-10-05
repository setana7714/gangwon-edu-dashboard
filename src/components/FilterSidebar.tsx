import type { ReactNode } from 'react';
import { Bike, Car, DoorClosed, FileText, Footprints, RotateCcw, Video } from 'lucide-react';
import { CATEGORY_LABEL, type Category } from '../types/venue';
import type { FilterState } from '../utils/filterVenues';
import { CategoryIcon, RiceBowlIcon } from './BrandIcon';

interface Props {
  filter: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const CATEGORIES: Exclude<Category, 'LOCAL'>[] = ['ALL', 'MEAL', 'CAFE', 'VENUE'];

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
      <h3 className="mb-2 text-xs font-bold text-forest/60">{title}</h3>
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
      className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-forest bg-mint font-bold text-forest'
          : 'border-sage bg-white font-medium text-forest/80 hover:border-mint hover:bg-mint/20'
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
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-2 py-2 hover:bg-vanilla">
      <span className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-sage transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-mint peer-checked:after:translate-x-4 peer-checked:after:bg-forest peer-focus-visible:ring-2 peer-focus-visible:ring-forest" />
    </label>
  );
}

export default function FilterSidebar({ filter, onChange, onReset }: Props) {
  const isLocal = filter.category === 'LOCAL';

  return (
    <aside className="w-full shrink-0 space-y-5 rounded-card border border-sage bg-white p-5 shadow-card lg:sticky lg:top-6 lg:w-72">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold">조건 선택</h2>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-forest/60 hover:text-forest"
        >
          <RotateCcw size={14} />
          초기화
        </button>
      </div>

      <Section title="무엇을 찾나요?">
        <div className="grid grid-cols-2 gap-2">
          <ChoiceButton active={!isLocal} onClick={() => onChange({ category: 'ALL' })}>
            <span>
              업무 장소 <span className="text-xs font-medium">(연수, 식당, 카페)</span>
            </span>
          </ChoiceButton>
          <ChoiceButton active={isLocal} onClick={() => onChange({ category: 'LOCAL' })}>
            <RiceBowlIcon size={26} />
            {CATEGORY_LABEL.LOCAL}
          </ChoiceButton>
        </div>
      </Section>

      {!isLocal && (
        <Section title="카테고리">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <ChoiceButton key={c} active={filter.category === c} onClick={() => onChange({ category: c })}>
                {c !== 'ALL' && <CategoryIcon category={c} size={26} />}
                {CATEGORY_LABEL[c]}
              </ChoiceButton>
            ))}
          </div>
        </Section>
      )}

      {isLocal ? (
        <Section title="이용 방법">
          <Toggle
            checked={filter.needDelivery}
            onChange={(needDelivery) => onChange({ needDelivery })}
            icon={<Bike size={16} className="text-forest/60" />}
            label="배달되는 곳"
          />
          <Toggle
            checked={filter.needWalkable}
            onChange={(needWalkable) => onChange({ needWalkable })}
            icon={<Footprints size={16} className="text-forest/60" />}
            label="걸어서 갈 수 있는 곳"
          />
          <p className="mt-1 px-2 text-xs text-forest/50">
            도교육청 근처에서 시켜 먹거나 걸어가서 먹는 곳이에요.
          </p>
        </Section>
      ) : (
        <>
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
                <ChoiceButton
                  key={p.value}
                  active={filter.maxPrice === p.value}
                  onClick={() => onChange({ maxPrice: p.value })}
                >
                  {p.label}
                </ChoiceButton>
              ))}
            </div>
          </Section>

          <Section title="시설">
            <Toggle
              checked={filter.needBeam}
              onChange={(needBeam) => onChange({ needBeam })}
              icon={<Video size={16} className="text-forest/60" />}
              label="빔프로젝터 보유"
            />
            <Toggle
              checked={filter.needPrivateRoom}
              onChange={(needPrivateRoom) => onChange({ needPrivateRoom })}
              icon={<DoorClosed size={16} className="text-forest/60" />}
              label="프라이빗 룸"
            />
            <Toggle
              checked={filter.needParking}
              onChange={(needParking) => onChange({ needParking })}
              icon={<Car size={16} className="text-forest/60" />}
              label="전용 주차장"
            />
          </Section>

          <Section title="행정서류">
            <Toggle
              checked={filter.needAdminDocs}
              onChange={(needAdminDocs) => onChange({ needAdminDocs })}
              icon={<FileText size={16} className="text-forest/60" />}
              label="행정서류 4종 완비 장소만 보기"
            />
            <p className="mt-1 px-2 text-xs text-forest/50">
              전자세금계산서 · 견적서 · 사업자등록증 · 관공서/법인카드 결제
            </p>
          </Section>
        </>
      )}
    </aside>
  );
}
