import type { Venue } from '../types/venue';

// meetneat-icons.svg(640x160, 아이콘 4개가 한 줄) 원본을 그대로 두고 필요한 칸만 잘라서 보여줌
const SPRITE = { width: 640, height: 160, step: 160, offset: 18, box: 124 };

const ICON_INDEX = { MEAL: 0, CAFE: 1, VENUE: 2, PICK: 3 } as const;

export type BrandIconName = keyof typeof ICON_INDEX;

export default function BrandIcon({ name, size = 28 }: { name: BrandIconName; size?: number }) {
  const scale = size / SPRITE.box;
  const x = (SPRITE.offset + SPRITE.step * ICON_INDEX[name]) * scale;
  const y = SPRITE.offset * scale;

  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <img
        src="brand/meetneat-icons.svg"
        alt=""
        className="block max-w-none"
        style={{
          width: SPRITE.width * scale,
          height: SPRITE.height * scale,
          transform: `translate(${-x}px, ${-y}px)`,
        }}
      />
    </span>
  );
}

// 근처 밥집은 디자인 키트에 아이콘이 없어, 키트 아이콘과 같은 규칙(민트 원 + 굵은 선)으로 밥그릇을 그림
export function RiceBowlIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className="shrink-0">
      <circle cx="60" cy="60" r="58" fill="#9CE6D3" />
      <g fill="#FFF7E8" stroke="#173B3F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 58c1-15 11-24 24-24s23 9 24 24Z" />
        <path d="M28 58h64c0 20-13 33-32 33S28 78 28 58Z" fill="#FF8368" />
        <path d="M48 96h24" fill="none" />
      </g>
    </svg>
  );
}

export function CategoryIcon({ category, size = 28 }: { category: Venue['category']; size?: number }) {
  if (category === 'LOCAL') return <RiceBowlIcon size={size} />;
  return <BrandIcon name={category} size={size} />;
}
