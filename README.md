# 은쑥이의 교육청도 식후경

강원특별자치도교육청 근처의 밥집·식당·회식 장소·카페·연수·대관을 모아 보여 주는 개인 사이트.

- 기술 스택: Vite + React + TypeScript + Tailwind CSS + Lucide React
- 공개 주소: https://setana7714.github.io/gangwon-edu-dashboard/ (`main` 에 push 하면 GitHub Actions 가 자동 배포)

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 배포용 파일 생성
```

## 장소 목록 관리 (구글 시트는 쓰지 않음)

목록은 두 파일이 전부이고, 요청을 받아 Claude 가 수정해 올림.

| 파일 | 내용 |
|---|---|
| `public/data/venues.csv` | 식당·회식·카페·연수·대관 (`카테고리` 열: 식사 / 회식 / 카페 / 연수·대관) |
| `public/data/local.csv` | 근처 밥집 후보 (전부 같은 종류로 읽음) |

- 첫 행(열 이름)은 한글 그대로 둠. 읽는 기준이 열 이름임.
- 여부 칸은 `Y` / `N`, 시간·가격은 숫자만. 모르는 칸은 비워 둠(비어 있으면 화면에 나오지 않음).
- `예약` 열: 예약 가능 / 예약 불가 / 웨이팅 있음 등 → 카드의 비고에 표시.

## 어느 버튼에 들어가는가

- 🍚 근처 밥집: 식당 줄 중 `도보(분)` 이 10분 이내이거나 `배달` 이 Y 인 곳 (기준은 `src/utils/filterVenues.ts` 의 `WALK_LIMIT_MIN`)
- 🍽 식당: 위에 해당하지 않는 식당 줄
- 🍻 회식 / ☕ 카페 / 🏢 연수·대관: `카테고리` 열 값 그대로
- 식당·회식·카페는 `도교육청에서 차로(분)` 으로 5·10·15·20분 구간으로 묶어 보여 줌

## 조회수

푸터의 조회수는 무료 카운터(abacus.jasoncameron.dev)를 사용. 사이트를 열 때마다 1씩 오르고, 내 컴퓨터에서 개발할 때는 오르지 않음 (`src/utils/visitCounter.ts`).
