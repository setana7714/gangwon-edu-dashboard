// 조회수: 무료 공개 카운터(abacus.jasoncameron.dev)를 사용. 방문자 정보는 보내지 않고 숫자만 올리고 받음.
// 사이트를 열 때마다(새로고침·재방문 포함) 1씩 올림. 내 컴퓨터(개발 중)에서는 올리지 않고 숫자만 읽음.
const BASE = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'setana7714-gangwon-edu-dashboard';
const KEY = 'visits';

export async function countVisit(): Promise<number | null> {
  try {
    const isLive = window.location.hostname.endsWith('github.io');
    const res = await fetch(`${BASE}/${isLive ? 'hit' : 'get'}/${NAMESPACE}/${KEY}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const { value } = (await res.json()) as { value?: number };
    return typeof value === 'number' ? value : null;
  } catch {
    return null; // 카운터가 안 되면 숫자만 조용히 숨김
  }
}
