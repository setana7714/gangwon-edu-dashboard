import Papa from 'papaparse';
import type { Venue } from '../types/venue';
import { GOOGLE_SHEET_CSV_URL, GOOGLE_SHEET_LOCAL_CSV_URL } from '../config';

const FALLBACK_CSV_URL = 'data/venues.csv';
const FALLBACK_LOCAL_CSV_URL = 'data/local.csv';
// 시트를 거치지 않고 바로 반영할 보충·수정분 (상호명 기준으로 시트 내용과 합침)
const EXTRA_CSV_URL = 'data/venues-extra.csv';
const EXTRA_LOCAL_CSV_URL = 'data/local-extra.csv';

type CsvRow = Record<string, string | undefined>;

const text = (value: string | undefined): string => (value ?? '').trim();

// 빈 칸은 '미지원'이 아니라 '아직 확인 전'(undefined)으로 구분
const toBool = (value: string | undefined): boolean | undefined =>
  text(value) ? ['y', 'yes', 'o', 'true', '1', '예', '가능'].includes(text(value).toLowerCase()) : undefined;

// "30명", "15,000원" 처럼 단위가 붙어 있어도 숫자만 읽음
const toNumber = (value: string | undefined): number => Number(text(value).replace(/[^\d.]/g, '')) || 0;

function toCategory(value: string | undefined): Venue['category'] {
  const v = text(value).toUpperCase();
  if (v.includes('근처') || v.includes('밥집') || v.includes('배달') || v === 'LOCAL') return 'LOCAL';
  if (v.includes('카페') || v === 'CAFE') return 'CAFE';
  if (v.includes('연수') || v.includes('대관') || v === 'VENUE') return 'VENUE';
  return 'MEAL';
}

// 업무 장소 시트와 근처 밥집 시트(열이 더 적음) 양쪽 양식을 모두 읽음
function rowToVenue(row: CsvRow, index: number): Venue {
  return {
    id: text(row['번호']) || String(index + 1),
    name: text(row['상호명']),
    category: toCategory(row['카테고리']),
    subCategory: text(row['세부 분류']) || undefined,
    menu: text(row['대표 메뉴']) || undefined,
    nearby: text(row['주요 인근 기관']) || undefined,
    phone: text(row['예약 전화번호']) || text(row['전화번호']),
    address: text(row['주소']),
    driveMinutes: toNumber(row['도교육청에서 차로(분)']) || undefined,
    walkMinutes: toNumber(row['도보(분)']) || undefined,
    delivery: toBool(row['배달']),
    minCapacity: toNumber(row['최소 인원']),
    maxCapacity: toNumber(row['최대 인원']),
    hasBeamProjector: toBool(row['빔프로젝터']),
    hasPrivateRoom: toBool(row['프라이빗 룸']),
    hasParking: toBool(row['전용 주차']),
    adminDocs: {
      taxInvoice: toBool(row['세금계산서']),
      quotation: toBool(row['견적서']),
      businessReg: toBool(row['사업자등록증']),
      corpCard: toBool(row['카드결제']),
    },
    pricePerPerson: toNumber(row['1인당 가격(원)']) || undefined,
    rating: toNumber(row['검증 평점']) || toNumber(row['평점']),
    reviewCount: toNumber(row['리뷰 수']),
    reviewSummary: text(row['검증 후기']) || text(row['한마디']),
    mapUrl: text(row['지도 링크']),
    verifiedAt: text(row['최종 확인일']) || undefined,
  };
}

async function loadRows(url: string): Promise<CsvRow[] | null> {
  // 브라우저에 저장된 예전 목록 대신 항상 최신 내용을 받음
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const { data, meta } = Papa.parse<CsvRow>(await res.text(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.replace(/^\uFEFF/, '').trim(),
  });
  // 시트 양식이 아닌 응답(오류 페이지 등)을 걸러냄
  if (!meta.fields?.includes('상호명')) return null;
  return data.filter((r) => text(r['상호명']));
}

// 보충 파일의 행을 상호명 기준으로 합침: 같은 상호면 보충 파일의 '채워진 칸'만 덮어쓰고, 없는 상호는 뒤에 추가
function mergeRows(base: CsvRow[], extra: CsvRow[]): CsvRow[] {
  const merged = base.map((r) => ({ ...r }));
  for (const add of extra) {
    const name = text(add['상호명']);
    const target = merged.find((r) => text(r['상호명']) === name);
    const filled = Object.fromEntries(Object.entries(add).filter(([, v]) => text(v)));
    if (target) Object.assign(target, filled);
    else merged.push(filled);
  }
  return merged;
}

async function loadFirst(urls: string[]): Promise<CsvRow[]> {
  for (const url of urls.filter(Boolean)) {
    const rows = await loadRows(url).catch(() => null);
    if (rows && rows.length > 0) return rows;
  }
  return [];
}

// 시트(없으면 예비 파일) + 보충 파일 → 장소 목록. 전화번호와 주소가 모두 없는 행은 제외
async function loadMerged(sheetUrl: string, fallbackUrl: string, extraUrl: string): Promise<Venue[]> {
  const [base, extra] = await Promise.all([loadFirst([sheetUrl, fallbackUrl]), loadFirst([extraUrl])]);
  return mergeRows(base, extra)
    .map(rowToVenue)
    .filter((v) => v.name && (v.phone || v.address));
}

async function loadBusinessVenues(): Promise<Venue[]> {
  const venues = await loadMerged(GOOGLE_SHEET_CSV_URL, FALLBACK_CSV_URL, EXTRA_CSV_URL);
  if (venues.length === 0) throw new Error('장소 데이터를 불러오지 못했습니다.');
  return venues;
}

// 근처 밥집 시트의 행은 카테고리 열이 없어도 모두 근처 밥집으로 처리
async function loadLocalVenues(): Promise<Venue[]> {
  const venues = await loadMerged(GOOGLE_SHEET_LOCAL_CSV_URL, FALLBACK_LOCAL_CSV_URL, EXTRA_LOCAL_CSV_URL);
  return venues.map((v, i) => ({ ...v, id: `local-${i + 1}`, category: 'LOCAL' }));
}

export async function loadVenues(): Promise<Venue[]> {
  const [business, local] = await Promise.all([loadBusinessVenues(), loadLocalVenues()]);
  return [...business, ...local];
}
