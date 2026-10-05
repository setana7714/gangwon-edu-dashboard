import type { Venue, Category } from '../types/venue';

export interface FilterState {
  keyword: string;            // 상호명·주소·인근 기관 검색어
  category: Category;         // ALL, MEAL, CAFE, VENUE
  capacityGroup: number;      // 0: 전체, 2: 2~6인, 7: 7~15인, 16: 16~50인
  maxPrice: number;           // 0: 전체, 그 외: 1인당 가격 상한(원)
  needBeam: boolean;          // 빔프로젝터 필수
  needPrivateRoom: boolean;   // 프라이빗 룸 필수
  needParking: boolean;       // 주차장 필수
  needAdminDocs: boolean;     // 행정서류 4종 모두 지원 필수
  sortBy: 'RATING' | 'NAME' | 'DISTANCE';  // 평점순 / 이름순 / 가까운순
}

export const INITIAL_FILTER: FilterState = {
  keyword: '',
  category: 'ALL',
  capacityGroup: 0,
  maxPrice: 0,
  needBeam: false,
  needPrivateRoom: false,
  needParking: false,
  needAdminDocs: false,
  sortBy: 'RATING',
};

export function hasAllAdminDocs(v: Venue): boolean {
  const { taxInvoice, quotation, businessReg, corpCard } = v.adminDocs;
  return taxInvoice && quotation && businessReg && corpCard;
}

export function filterVenues(venues: Venue[], filter: FilterState): Venue[] {
  const keyword = filter.keyword.trim().toLowerCase();

  return venues.filter((v) => {
    // 0. 검색어 필터
    if (keyword) {
      const haystack = [v.name, v.subCategory, v.address, v.nearby].join(' ').toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }

    // 1. 카테고리 필터
    if (filter.category !== 'ALL' && v.category !== filter.category) {
      return false;
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
    if (filter.sortBy === 'RATING') return b.rating - a.rating;
    if (filter.sortBy === 'DISTANCE') {
      // 소요 시간 미기재 장소는 뒤로
      const da = a.driveMinutes ?? Number.MAX_SAFE_INTEGER;
      const db = b.driveMinutes ?? Number.MAX_SAFE_INTEGER;
      if (da !== db) return da - db;
    }
    return a.name.localeCompare(b.name, 'ko');
  });
}
