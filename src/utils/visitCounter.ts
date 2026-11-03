// 조회수: 무료 공개 카운터(abacus.jasoncameron.dev)를 사용. 방문자 정보는 보내지 않고 숫자만 올리고 받음.
// 같은 탭(세션)에서는 한 번만 세고, 내 컴퓨터(개발 중)에서는 세지 않고 숫자만 읽음.
const BASE = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'setana7714-gangwon-edu-dashboard';
const KEY = 'visits';
const SESSION_FLAG = 'visit-counted';

export async function countVisit(): Promise<number | null> {
  try {
    const isLive = window.location.hostname.endsWith('github.io');
    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(SESSION_FLAG) === '1';
    } catch {
      // 저장소를 못 쓰는 환경이면 매번 세지 않고 읽기만 함
      alreadyCounted = true;
    }
    const action = isLive && !alreadyCounted ? 'hit' : 'get';
    const res = await fetch(`${BASE}/${action}/${NAMESPACE}/${KEY}`);
    if (!res.ok) return null;
    const { value } = (await res.json()) as { value?: number };
    if (action === 'hit') {
      try {
        sessionStorage.setItem(SESSION_FLAG, '1');
      } catch {
        // 무시
      }
    }
    return typeof value === 'number' ? value : null;
  } catch {
    return null; // 카운터가 안 되면 숫자만 조용히 숨김
  }
}
