export type Category = 'ALL' | 'MEAL' | 'CAFE' | 'VENUE' | 'LOCAL';

// 여부 값: true(지원) / false(미지원) / undefined(시트가 비어 있음 = 아직 확인 전)
export interface AdminDocsSupport {
  taxInvoice?: boolean;   // 전자세금계산서
  quotation?: boolean;    // 견적서/청구서
  businessReg?: boolean;  // 사업자등록증
  corpCard?: boolean;     // 관공서/법인카드 결제
}

export interface Venue {
  id: string;
  name: string;                   // 상호명
  category: Exclude<Category, 'ALL'>; // 카테고리 (식사/카페/연수대관/근처 밥집)
  subCategory?: string;           // 상세 분류 (예: 한정식, 숯불구이, 회의실)
  menu?: string;                  // 대표 메뉴
  nearby?: string;                // 주요 인근 기관
  phone: string;                  // 예약 전화번호
  address: string;                // 주소
  driveMinutes?: number;          // 도교육청에서 차로 걸리는 시간(분)
  walkMinutes?: number;           // 도교육청에서 걸어서 걸리는 시간(분)
  delivery?: boolean;             // 배달 가능 여부
  minCapacity: number;            // 최소 수용 인원 (0: 미기재)
  maxCapacity: number;            // 최대 수용 인원 (0: 미기재)
  hasBeamProjector?: boolean;     // 빔프로젝터/스크린 보유 여부
  hasPrivateRoom?: boolean;       // 프라이빗 룸 보유 여부
  hasParking?: boolean;           // 전용 주차장 보유 여부
  adminDocs: AdminDocsSupport;    // 행정 서류 지원 객체
  pricePerPerson?: number;        // 1인당 가격(원)
  rating: number;                 // 포털 검증 평점 (예: 4.3)
  reviewCount: number;            // 리뷰 수
  reviewSummary: string;          // 검증 후기 요약
  mapUrl: string;                 // 네이버/카카오 지도 리뷰/상세 URL
  verifiedAt?: string;            // 최종 확인일
}

export const CATEGORY_LABEL: Record<Category, string> = {
  ALL: '전체',
  MEAL: '식사',
  CAFE: '카페',
  VENUE: '연수·대관',
  LOCAL: '근처 밥집',
};
