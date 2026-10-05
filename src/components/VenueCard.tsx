import { Building2, Car, Check, ExternalLink, MapPin, Phone, Star, Users, Wallet, X } from 'lucide-react';
import { CATEGORY_LABEL, type AdminDocsSupport, type Venue } from '../types/venue';
import { hasAllAdminDocs } from '../utils/filterVenues';

const CATEGORY_STYLE: Record<Venue['category'], string> = {
  MEAL: 'bg-orange-100 text-orange-800',
  CAFE: 'bg-emerald-100 text-emerald-800',
  VENUE: 'bg-violet-100 text-violet-800',
};

const ADMIN_DOCS: { key: keyof AdminDocsSupport; label: string }[] = [
  { key: 'taxInvoice', label: '세금계산서' },
  { key: 'quotation', label: '견적서' },
  { key: 'businessReg', label: '사업자등록증' },
  { key: 'corpCard', label: '카드결제' },
];

// 지도 링크가 비어 있으면 네이버 지도 검색 결과로 연결
const mapLink = (venue: Venue): string =>
  venue.mapUrl || `https://map.naver.com/p/search/${encodeURIComponent(`춘천 ${venue.name}`)}`;

export default function VenueCard({ venue }: { venue: Venue }) {
  const badges = [
    venue.hasBeamProjector && '빔프로젝터',
    venue.hasPrivateRoom && '프라이빗 룸',
    venue.hasParking && '주차 가능',
  ].filter((b): b is string => Boolean(b));
  const docsComplete = hasAllAdminDocs(venue);

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_STYLE[venue.category]}`}>
              {CATEGORY_LABEL[venue.category]}
            </span>
            {venue.subCategory && <span className="text-xs text-slate-500">{venue.subCategory}</span>}
          </div>
          <h3 className="mt-1.5 text-lg font-bold text-slate-900">{venue.name}</h3>
        </div>
        {venue.rating > 0 && (
          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-800">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {venue.rating.toFixed(1)}
            {venue.reviewCount > 0 && (
              <span className="text-xs font-normal text-slate-400">({venue.reviewCount})</span>
            )}
          </div>
        )}
      </div>

      <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Phone size={15} className="shrink-0 text-blue-700" />
          <a href={`tel:${venue.phone}`} className="font-semibold text-blue-700 hover:underline">
            {venue.phone}
          </a>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
          <span>{venue.address}</span>
        </div>
        {venue.driveMinutes && (
          <div className="flex items-center gap-2">
            <Car size={15} className="shrink-0 text-slate-400" />
            <span>도교육청에서 차로 {venue.driveMinutes}분</span>
          </div>
        )}
        {venue.nearby && (
          <div className="flex items-start gap-2">
            <Building2 size={15} className="mt-0.5 shrink-0 text-slate-400" />
            <span>인근: {venue.nearby}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users size={15} className="shrink-0 text-slate-400" />
          <span>
            {venue.minCapacity > 0 ? `${venue.minCapacity}~${venue.maxCapacity}인` : `최대 ${venue.maxCapacity}인`}
          </span>
        </div>
        {venue.pricePerPerson && (
          <div className="flex items-center gap-2">
            <Wallet size={15} className="shrink-0 text-slate-400" />
            <span>1인당 약 {venue.pricePerPerson.toLocaleString('ko-KR')}원</span>
          </div>
        )}
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {badges.map((b) => (
          <span key={b} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {b}
          </span>
        ))}
        {docsComplete && (
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">행정서류 완비</span>
        )}
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg bg-slate-50 p-3 text-xs">
        {ADMIN_DOCS.map(({ key, label }) => {
          const supported = venue.adminDocs[key];
          return (
            <li key={key} className={`flex items-center gap-1 ${supported ? 'text-slate-700' : 'text-slate-400'}`}>
              {supported ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <X size={14} className="text-red-400" />
              )}
              {label}
              <span className="sr-only">{supported ? '지원' : '미지원'}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{venue.reviewSummary}</p>

      {venue.verifiedAt && <p className="mt-2 text-xs text-slate-400">정보 확인일: {venue.verifiedAt}</p>}

      <a
        href={mapLink(venue)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
      >
        네이버/카카오 지도 리뷰 보기
        <ExternalLink size={14} />
      </a>
    </article>
  );
}
