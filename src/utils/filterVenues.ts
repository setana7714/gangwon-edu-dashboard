import type { Venue, Category } from '../types/venue';

export interface FilterState {
  category: Category;         // ALL, MEAL, CAFE, VENUE, LOCAL
  capacityGroup: number;      // 0: 전체, 2: 2~6인, 7: 7~15인, 16: 16~50인
  maxPrice: number;           // 0: 전체, 그 외: 1인당 가격 상한(원)
  needBeam: boolean;          // 빔프로젝터 필수
  needPrivateRoom: boolean;   // 프라이빗 룸 필수
  needParking: boolean;       // 주차장 필수
  needAdminDocs: boolean;     // 행정서류 4종 모두 지원 필수
  needDelivery: boolean;      // 배달 가능 (근처 밥집 전용)
  needWalkable: boolean;      // 걸어서 갈 수 있는 곳 (근처 밥집 전용)
  sortBy: 'RATING' | 'NAME' | 'DISTANCE';  // 평점순 / 이름순 / 가까운순
}

export const INITIAL_FILTER: FilterState = {
  category: 'ALL',
  capacityGroup: 0,
  maxPrice: 0,
  needBeam: false,
  needPrivateRoom: false,
  needParking: false,
  needAdminDocs: false,
  needDelivery: false,
  needWalkable: false,
  sortBy: 'RATING',
};

// 시트에 값이 채워진 항목만 조건으로 보여주기 위한 표시
export interface FilterAvailability {
  capacity: boolean;
  price: boolean;
  beam: boolean;
  privateRoom: boolean;
  parking: boolean;
  adminDocs: boolean;
  delivery: boolean;
  walkable: boolean;
}

export function getAvailability(venues: Venue[]): FilterAvailability {
  const business = venues.filter((v) => v.category !== 'LOCAL');
  const local = venues.filter((v) => v.category === 'LOCAL');
  return {
    capacity: business.some((v) => v.maxCapacity > 0),
    price: business.some((v) => v.pricePerPerson),
    beam: business.some((v) => v.hasBeamProjector !== undefined),
    privateRoom: business.some((v) => v.hasPrivateRoom !== undefined),
    parking: business.some((v) => v.hasParking !== undefined),
    adminDocs: business.some((v) => Object.values(v.adminDocs).some((d) => d !== undefined)),
    delivery: local.some((v) => v.delivery !== undefined),
    walkable: local.some((v) => v.walkMinutes),
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

export function filterVenues(venues: Venue[], filter: FilterState): Venue[] {
  const isLocal = filter.category === 'LOCAL';

  return venues.filter((v) => {
    // 1. 카테고리 필터 ('전체'는 업무 장소 전체 — 근처 밥집은 따로 봄)
    if (filter.category === 'ALL' ? v.category === 'LOCAL' : v.category !== filter.category) {
      return false;
    }

    // 근처 밥집은 배달·도보 조건만, 그 외는 업무용 조건만 적용
    if (isLocal) {
      if (filter.needDelivery && !v.delivery) return false;
      if (filter.needWalkable && !v.walkMinutes) return false;
      return true;
    }

    // 2. 인원 수용 필터
    if (filter.capacityGroup === 2 && !(v.minCapacity <= 6 && v.maxCapacity >= 2)) return false;
    if (filter.capacityGroup === 7 && !(v.minCapacity <= 15 && v.maxCapacity >= 7)) return false;
    if (filter.capacityGroup === 16 && !(v.minCapacity <= 50 && v.maxCapacity >= 16)) return false;

    // 3. 1인당 가격 필터 (가격 미기재 장소는 제외)
    if (filter.maxPrice > 0 && !(v.pricePerPerson && v.pricePerPerson <= filter.maxPrice)) return false;

    // 4. 필수 시설 필터
    if (filter.needBeam && !v.hasBeamProjector) return false;
    if (filter.needPrivateRoom && !v.hasPrivateRoom) return false;
    if (filter.needParking && !v.hasParking) return false;

    // 5. 행정 서류 필터 (4종 모두 지원 필요)
    if (filter.needAdminDocs && !hasAllAdminDocs(v)) return false;

    return true;
  }).sort((a, b) => {
    if (filter.sortBy === 'RATING' && a.rating !== b.rating) return b.rating - a.rating;
    if (filter.sortBy === 'DISTANCE') {
      // 근처 밥집은 도보, 그 외는 차량 기준. 소요 시간 미기재 장소는 뒤로
      const key = isLocal ? 'walkMinutes' : 'driveMinutes';
      const da = a[key] ?? Number.MAX_SAFE_INTEGER;
      const db = b[key] ?? Number.MAX_SAFE_INTEGER;
      if (da !== db) return da - db;
    }
    return a.name.localeCompare(b.name, 'ko');
  });
}
