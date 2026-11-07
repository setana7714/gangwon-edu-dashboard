import { useState } from 'react';
import { Building2, Check, Copy, MapPin, Minus, Phone, Star, Users, UtensilsCrossed, Wallet } from 'lucide-react';
import { TAB_LABEL, type AdminDocsSupport, type Tab, type Venue } from '../types/venue';
import { hasAllAdminDocs, isRecommended, tabOf } from '../utils/filterVenues';
import { copyText } from '../utils/copyText';
import BrandIcon, { TabIcon } from './BrandIcon';

// 버튼(종류)별 파스텔 색 칩
const TAB_CHIP: Record<Tab, string> = {
  LOCAL: 'bg-butter/70',
  MEAL: 'bg-coral/30',
  GATHER: 'bg-blush',
  CAFE: 'bg-mint/60',
  VENUE: 'bg-sky',
};

// 내비 앱에 붙여 넣기 좋게 '강원특별자치도'부터 적힌 전체 주소로 만듦
const fullAddress = (address: string): string =>
  !address ? '' : address.startsWith('강원') ? address : `강원특별자치도 ${address}`;

const ADMIN_DOCS: { key: keyof AdminDocsSupport; label: string }[] = [
  { key: 'taxInvoice', label: '세금계산서' },
  { key: 'quotation', label: '견적서' },
  { key: 'businessReg', label: '사업자등록증' },
  { key: 'corpCard', label: '카드결제' },
];

// 지도 링크가 비어 있으면 네이버 지도 검색 결과로 연결
const mapLink = (venue: Venue): string =>
  venue.mapUrl || `https://map.naver.com/p/search/${encodeURIComponent(`춘천 ${venue.name}`)}`;

// 후기가 이보다 길면 접어서 보여줌
const SUMMARY_FOLD_LENGTH = 90;

export default function VenueCard({ venue }: { venue: Venue }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const tab = tabOf(venue);
  const longSummary = venue.reviewSummary.length > SUMMARY_FOLD_LENGTH;
  const docsUnknown = ADMIN_DOCS.every(({ key }) => venue.adminDocs[key] === undefined);
  // 근처 밥집은 업무용 정보(행정서류·수용 인원) 대신 메뉴·배달·도보 정보 위주로 표시
  const isLocal = tab === 'LOCAL';
  const badges = [
    venue.delivery && '배달 가능',
    venue.hasBeamProjector && '빔프로젝터',
    venue.hasPrivateRoom && '프라이빗 룸',
  ].filter((b): b is string => Boolean(b));
  const docsComplete = !isLocal && hasAllAdminDocs(venue);
  const distance = [
    venue.walkMinutes && `걸어서 ${venue.walkMinutes}분`,
    venue.driveMinutes && `차로 ${venue.driveMinutes}분`,
  ].filter(Boolean);
  // 비고: 주차·예약 안내 (값이 있는 것만)
  const notes = [venue.hasParking && '🅿️ 주차 가능', venue.reservation && `📞 ${venue.reservation}`].filter(Boolean);
  const address = fullAddress(venue.address);
  // 숫자만 남겨 폰에서 눌렀을 때 바로 전화 걸기 화면이 열리게 함
  const telHref = `tel:${venue.phone.replace(/[^\d+]/g, '')}`;

  const onCopy = async () => {
    setCopied((await copyText(address)) ? 'ok' : 'fail');
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <article className="flex flex-col rounded-card border-2 border-forest bg-white p-5 shadow-pop transition duration-200 motion-safe:animate-pop-in hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[7px_7px_0_0_#173B3F] odd:-rotate-[0.6deg] even:rotate-[0.6deg]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`flex items-center gap-1.5 rounded-full border-2 border-forest py-0.5 pl-0.5 pr-2.5 text-xs font-bold ${TAB_CHIP[tab]}`}>
            <TabIcon tab={tab} size={24} />
            {TAB_LABEL[tab]}
          </span>
          {isRecommended(venue) && (
            <span className="flex rotate-2 items-center gap-1 rounded-full border-2 border-forest bg-coral py-0.5 pl-0.5 pr-2.5 text-xs font-extrabold">
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

      <h3 className="mt-2 text-2xl leading-snug">{venue.name}</h3>
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
          {venue.phone ? (
            <a href={telHref} className="-my-1 py-1 font-bold text-forest underline underline-offset-2">
              {venue.phone}
            </a>
          ) : (
            <span className="text-forest/50">등록된 전화번호가 없어요</span>
          )}
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
          {docsComplete && <span className="rounded-full bg-butter px-2.5 py-1 text-xs font-bold">행정서류 완비</span>}
        </div>
      )}

      {notes.length > 0 && (
        <p className="mt-3 rounded-2xl border-2 border-dashed border-forest/40 bg-butter/30 px-3 py-2 text-xs font-bold">
          📝 비고 · {notes.join('  ')}
        </p>
      )}

      {!isLocal && !docsUnknown && (
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-2xl bg-vanilla p-3 text-xs">
          {ADMIN_DOCS.map(({ key, label }) => {
            const supported = venue.adminDocs[key];
            return (
              <li key={key} className={`flex items-center gap-1 ${supported ? 'font-medium' : 'text-forest/40'}`}>
                {supported ? <Check size={14} strokeWidth={3} /> : <Minus size={14} />}
                {label}
                <span className="sr-only">{supported ? '지원' : supported === false ? '미지원' : '확인 전'}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex-1 text-sm text-forest/80">
        <p className={`break-words ${longSummary && !expanded ? 'line-clamp-3' : ''}`}>{venue.reviewSummary}</p>
        {longSummary && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 text-xs font-bold underline underline-offset-2"
          >
            {expanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>

      {venue.verifiedAt && <p className="mt-2 text-xs text-forest/50">정보 확인일: {venue.verifiedAt}</p>}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {venue.phone && (
          <a
            href={telHref}
            className="btn-pop col-span-2 flex items-center justify-center gap-1.5 rounded-full bg-coral px-3 py-2 text-sm font-bold"
          >
            <Phone size={14} />
            {isLocal ? '전화로 주문·문의하기' : '전화로 자리 확인하기'}
          </a>
        )}
        <a
          href={mapLink(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pop flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-bold hover:bg-butter"
        >
          <MapPin size={14} />
          지도 보기
        </a>
        {address && (
          <button
            type="button"
            onClick={onCopy}
            title={address}
            className="btn-pop flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-bold hover:bg-butter"
          >
            {copied === 'ok' ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
            {copied === 'ok' ? '복사됐어요!' : copied === 'fail' ? '길게 눌러 복사' : '주소 복사'}
          </button>
        )}
      </div>
    </article>
  );
}
