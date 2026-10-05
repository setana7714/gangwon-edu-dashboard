import { Building2, Check, MapPin, Minus, Phone, Star, Users, UtensilsCrossed, Wallet } from 'lucide-react';
import { CATEGORY_LABEL, type AdminDocsSupport, type Venue } from '../types/venue';
import { hasAllAdminDocs, isRecommended } from '../utils/filterVenues';
import BrandIcon, { CategoryIcon } from './BrandIcon';

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
  // 근처 밥집은 업무용 정보(행정서류·수용 인원) 대신 메뉴·배달·도보 정보 위주로 표시
  const isLocal = venue.category === 'LOCAL';
  const badges = [
    venue.delivery && '배달 가능',
    venue.walkMinutes && `걸어서 ${venue.walkMinutes}분`,
    venue.hasBeamProjector && '빔프로젝터',
    venue.hasPrivateRoom && '프라이빗 룸',
    venue.hasParking && '주차 가능',
  ].filter((b): b is string => Boolean(b));
  const docsComplete = !isLocal && hasAllAdminDocs(venue);
  const distance = [
    venue.walkMinutes && `걸어서 ${venue.walkMinutes}분`,
    venue.driveMinutes && `차로 ${venue.driveMinutes}분`,
  ].filter(Boolean);

  return (
    <article className="flex flex-col rounded-card border border-sage bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1.5 rounded-full border border-sage bg-vanilla py-0.5 pl-0.5 pr-2.5 text-xs font-bold">
            <CategoryIcon category={venue.category} size={24} />
            {CATEGORY_LABEL[venue.category]}
          </span>
          {isRecommended(venue) && (
            <span className="flex items-center gap-1 rounded-full bg-coral py-0.5 pl-0.5 pr-2.5 text-xs font-bold">
              <BrandIcon name="PICK" size={24} />
              추천 픽
            </span>
          )}
        </div>
        {venue.rating > 0 && (
          <div className="flex shrink-0 items-center gap-1 text-sm font-bold">
            <Star size={16} className="fill-coral text-coral" />
            {venue.rating.toFixed(1)}
            {venue.reviewCount > 0 && <span className="text-xs font-normal text-forest/50">({venue.reviewCount})</span>}
          </div>
        )}
      </div>

      <h3 className="mt-2 text-lg font-extrabold leading-snug">{venue.name}</h3>
      {venue.subCategory && <p className="text-xs text-forest/60">{venue.subCategory}</p>}

      <dl className="mt-3 space-y-1.5 text-sm text-forest/80">
        {venue.menu && (
          <div className="flex items-start gap-2">
            <UtensilsCrossed size={15} className="mt-0.5 shrink-0 text-forest/50" />
            <span className="font-medium text-forest">{venue.menu}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Phone size={15} className="shrink-0 text-forest/50" />
          <a href={`tel:${venue.phone}`} className="font-bold text-forest underline-offset-2 hover:underline">
            {venue.phone}
          </a>
        </div>
        {venue.address && (
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 fill-mint text-forest" />
            <span>
              {venue.address}
              {distance.length > 0 && (
                <span className="block text-xs font-medium text-forest/60">도교육청에서 {distance.join(' · ')}</span>
              )}
            </span>
          </div>
        )}
        {venue.nearby && (
          <div className="flex items-start gap-2">
            <Building2 size={15} className="mt-0.5 shrink-0 text-forest/50" />
            <span>인근: {venue.nearby}</span>
          </div>
        )}
        {venue.maxCapacity > 0 && (
          <div className="flex items-center gap-2">
            <Users size={15} className="shrink-0 text-forest/50" />
            <span>
              {venue.minCapacity > 0 ? `${venue.minCapacity}~${venue.maxCapacity}인` : `최대 ${venue.maxCapacity}인`}
            </span>
          </div>
        )}
        {venue.pricePerPerson && (
          <div className="flex items-center gap-2">
            <Wallet size={15} className="shrink-0 text-forest/50" />
            <span>1인당 약 {venue.pricePerPerson.toLocaleString('ko-KR')}원</span>
          </div>
        )}
      </dl>

      {(badges.length > 0 || docsComplete) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span key={b} className="rounded-full bg-sage px-2.5 py-1 text-xs font-bold">
              {b}
            </span>
          ))}
          {docsComplete && <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-bold">행정서류 완비</span>}
        </div>
      )}

      {!isLocal && (
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-2xl bg-vanilla p-3 text-xs">
          {ADMIN_DOCS.map(({ key, label }) => {
            const supported = venue.adminDocs[key];
            return (
              <li key={key} className={`flex items-center gap-1 ${supported ? 'font-medium' : 'text-forest/40'}`}>
                {supported ? <Check size={14} strokeWidth={3} /> : <Minus size={14} />}
                {label}
                <span className="sr-only">{supported ? '지원' : '미지원'}</span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-3 flex-1 text-sm text-forest/80">{venue.reviewSummary}</p>

      {venue.verifiedAt && <p className="mt-2 text-xs text-forest/50">정보 확인일: {venue.verifiedAt}</p>}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2">
        <a
          href={`tel:${venue.phone}`}
          className="flex items-center justify-center gap-1.5 rounded-full bg-coral px-3 py-2 text-sm font-bold transition hover:brightness-95"
        >
          <Phone size={14} />
          {isLocal ? '전화로 주문·문의하기' : '전화로 자리 확인하기'}
        </a>
        <a
          href={mapLink(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-full border border-forest px-3 py-2 text-sm font-bold transition hover:bg-forest hover:text-vanilla"
        >
          <MapPin size={14} />
          지도에서 살펴보기
        </a>
      </div>
    </article>
  );
}
