import { Bike } from 'lucide-react';
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

// 근처 밥집은 디자인 키트에 아이콘이 없어 민트 원 + 선 아이콘으로 대체
export function CategoryIcon({ category, size = 28 }: { category: Venue['category']; size?: number }) {
  if (category !== 'LOCAL') return <BrandIcon name={category} size={size} />;
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-mint"
      style={{ width: size, height: size }}
    >
      <Bike size={size * 0.6} />
    </span>
  );
}
