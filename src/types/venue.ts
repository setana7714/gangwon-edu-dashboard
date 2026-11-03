// 한 곳(데이터 한 줄)의 종류. LOCAL 은 근처 밥집 파일(local.csv)의 줄
export type Category = 'LOCAL' | 'MEAL' | 'GATHER' | 'CAFE' | 'VENUE';

// 화면 맨 위 버튼 하나하나. 식사·근처 밥집 줄은 걸어서 10분 이내이거나 배달되면 '근처 밥집', 아니면 '식당'으로 나뉨
export type Tab = Category;

// 여부 값: true(지원) / false(미지원) / undefined(비어 있음 = 아직 확인 전)
export interface AdminDocsSupport {
  taxInvoice?: boolean;   // 전자세금계산서
  quotation?: boolean;    // 견적서/청구서
  businessReg?: boolean;  // 사업자등록증
  corpCard?: boolean;     // 관공서/법인카드 결제
}

export interface Venue {
  id: string;
  name: string;                   // 상호명
  category: Category;             // 종류 (근처 밥집 파일 / 식사 / 회식 / 카페 / 연수·대관)
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
  reservation?: string;           // 예약 안내 (예: 예약 가능, 예약 불가, 웨이팅 있음)
  adminDocs: AdminDocsSupport;    // 행정 서류 지원 객체
  pricePerPerson?: number;        // 1인당 가격(원)
  rating: number;                 // 포털 검증 평점 (예: 4.3)
  reviewCount: number;            // 리뷰 수
  reviewSummary: string;          // 검증 후기 요약
  mapUrl: string;                 // 네이버/카카오 지도 리뷰/상세 URL
  verifiedAt?: string;            // 최종 확인일
}

export const TAB_ORDER: Tab[] = ['LOCAL', 'MEAL', 'GATHER', 'CAFE', 'VENUE'];

export const TAB_LABEL: Record<Tab, string> = {
  LOCAL: '근처 밥집',
  MEAL: '식당',
  GATHER: '회식',
  CAFE: '카페',
  VENUE: '연수·대관',
};

// 버튼을 눌렀을 때 결과 위에 보여 줄 한 줄 소개
export const TAB_HINT: Record<Tab, string> = {
  LOCAL: '오늘 초근 때 뭐먹지?',
  MEAL: '차 타고 가서 먹는 곳이에요 🚗',
  GATHER: '다 같이 모이는 날엔 여기 🍻',
  CAFE: '차 한잔 하러 가볼까요 ☕',
  VENUE: '연수·행사 장소를 모아 뒀어요 🏢',
};

// 차로 시간 구간으로 묶어 보여 줄 버튼 (근처 밥집·연수·대관은 한 줄로 나열)
export const TAB_GROUPED: Record<Tab, boolean> = {
  LOCAL: false,
  MEAL: true,
  GATHER: true,
  CAFE: true,
  VENUE: false,
};
