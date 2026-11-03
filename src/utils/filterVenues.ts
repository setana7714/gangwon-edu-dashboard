import type { Tab, Venue } from '../types/venue';

// '근처 밥집'으로 보는 도보 기준(분). 이 이내이거나 배달이 되면 근처 밥집, 아니면 식당
export const WALK_LIMIT_MIN = 10;

export type SortBy = 'RATING' | 'NAME' | 'DISTANCE';

export interface FilterState {
  tab: Tab;
  capacityGroup: number;      // 0: 전체, 2: 2~6인, 7: 7~15인, 16: 16~50인
  maxPrice: number;           // 0: 전체, 그 외: 1인당 가격 상한(원)
  needBeam: boolean;          // 빔프로젝터 필수
  needPrivateRoom: boolean;   // 프라이빗 룸 필수
  needParking: boolean;       // 주차장 필수
  needAdminDocs: boolean;     // 행정서류 4종 모두 지원 필수
  needDelivery: boolean;      // 배달 가능 (근처 밥집 전용)
  sortBy: SortBy;             // 평점순 / 이름순 / 가까운순
}

// 근처 밥집은 가까운 순, 나머지는 평점순이 기본
export const defaultSort = (tab: Tab): SortBy => (tab === 'LOCAL' ? 'DISTANCE' : 'RATING');

export const INITIAL_FILTER: FilterState = {
  tab: 'LOCAL',
  capacityGroup: 0,
  maxPrice: 0,
  needBeam: false,
  needPrivateRoom: false,
  needParking: false,
  needAdminDocs: false,
  needDelivery: false,
  sortBy: 'DISTANCE',
};

// 이 장소가 어느 버튼에 들어가는지
export function tabOf(v: Venue): Tab {
  if (v.category === 'MEAL' || v.category === 'LOCAL') {
    const walkable = v.walkMinutes !== undefined && v.walkMinutes <= WALK_LIMIT_MIN;
    return walkable || v.delivery === true ? 'LOCAL' : 'MEAL';
  }
  return v.category;
}

// 시트에 값이 채워진 항목만 조건으로 보여주기 위한 표시
export interface FilterAvailability {
  capacity: boolean;
  price: boolean;
  beam: boolean;
  privateRoom: boolean;
  parking: boolean;
  adminDocs: boolean;
  delivery: boolean;
}

export function getAvailability(tabVenues: Venue[]): FilterAvailability {
  return {
    capacity: tabVenues.some((v) => v.maxCapacity > 0),
    price: tabVenues.some((v) => v.pricePerPerson),
    beam: tabVenues.some((v) => v.hasBeamProjector !== undefined),
    privateRoom: tabVenues.some((v) => v.hasPrivateRoom !== undefined),
    parking: tabVenues.some((v) => v.hasParking !== undefined),
    adminDocs: tabVenues.some((v) => Object.values(v.adminDocs).some((d) => d !== undefined)),
    delivery: tabVenues.some((v) => v.delivery === true),
  };
}

export function hasAllAdminDocs(v: Venue): boolean {
  const { taxInvoice, quotation, businessReg, corpCard } = v.adminDocs;
  return Boolean(taxInvoice && quotation && businessReg && corpCard);
}

// 추천 픽 배지 기준: 평점 4.5 이상이면서 평가 10건 이상
export function isRecommended(v: Venue): boolean {
  return v.rating >= 4.5 && v.reviewCount >= 10;
}

// 가까운 정도: 근처 밥집은 걸어서 걸리는 시간, 나머지는 차로 걸리는 시간 (모르면 맨 뒤)
function distanceKey(v: Venue, tab: Tab): number {
  if (tab === 'LOCAL') return v.walkMinutes ?? 100 + (v.driveMinutes ?? 99);
  return v.driveMinutes ?? 999;
}

export function filterVenues(venues: Venue[], filter: FilterState): Venue[] {
  const { tab } = filter;

  return venues
    .filter((v) => tabOf(v) === tab)
    .filter((v) => {
      // 근처 밥집은 배달 조건만, 나머지는 업무용 조건을 적용
      if (tab === 'LOCAL') return !(filter.needDelivery && !v.delivery);

      if (filter.capacityGroup === 2 && !(v.minCapacity <= 6 && v.maxCapacity >= 2)) return false;
      if (filter.capacityGroup === 7 && !(v.minCapacity <= 15 && v.maxCapacity >= 7)) return false;
      if (filter.capacityGroup === 16 && !(v.minCapacity <= 50 && v.maxCapacity >= 16)) return false;
      // 가격 미기재 장소는 가격 조건에서 제외
      if (filter.maxPrice > 0 && !(v.pricePerPerson && v.pricePerPerson <= filter.maxPrice)) return false;
      if (filter.needBeam && !v.hasBeamProjector) return false;
      if (filter.needPrivateRoom && !v.hasPrivateRoom) return false;
      if (filter.needParking && !v.hasParking) return false;
      if (filter.needAdminDocs && !hasAllAdminDocs(v)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'RATING' && a.rating !== b.rating) return b.rating - a.rating;
      if (filter.sortBy === 'DISTANCE') {
        const diff = distanceKey(a, tab) - distanceKey(b, tab);
        if (diff !== 0) return diff;
      }
      return a.name.localeCompare(b.name, 'ko');
    });
}

export interface VenueGroup {
  key: string;
  label: string;
  venues: Venue[];
}

const DRIVE_BANDS = [
  { max: 5, label: '🚗 차로 5분 이내' },
  { max: 10, label: '🚗 차로 10분 이내' },
  { max: 15, label: '🚗 차로 15분 이내' },
  { max: 20, label: '🚗 차로 20분 이내' },
  { max: Infinity, label: '🚗 차로 21분 이상' },
];

// 차로 시간 구간별로 묶음 (구간 안 순서는 들어온 순서 그대로). 빈 구간은 만들지 않음
export function groupByDrive(venues: Venue[]): VenueGroup[] {
  const groups: VenueGroup[] = DRIVE_BANDS.map((b, i) => ({ key: `band-${i}`, label: b.label, venues: [] }));
  const unknown: VenueGroup = { key: 'unknown', label: '📍 위치 확인 중', venues: [] };

  for (const v of venues) {
    if (v.driveMinutes === undefined) {
      unknown.venues.push(v);
      continue;
    }
    const idx = DRIVE_BANDS.findIndex((b) => v.driveMinutes! <= b.max);
    groups[idx].venues.push(v);
  }
  return [...groups, unknown].filter((g) => g.venues.length > 0);
}
