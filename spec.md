# Typo Trap Spec

## 1. 기술 스택

Typo Trap은 Pixi.js를 사용하는 독립형 웹 미니게임 프로젝트로 개발한다.

```txt
Vite
TypeScript
Pixi.js
ESLint
Prettier
```

초기 버전에서는 React를 사용하지 않는다.
게임 자체의 완성도를 먼저 확보한다.

## 2. 프로젝트 구조

추천 구조는 다음과 같다.

```txt
typo-trap/
├─ public/
├─ src/
│  ├─ main.ts
│  ├─ game/
│  │  ├─ TypoTrapGame.ts
│  │  ├─ constants.ts
│  │  ├─ types.ts
│  │  ├─ data/
│  │  │  └─ stages.ts
│  │  ├─ scenes/
│  │  │  ├─ ReadyScene.ts
│  │  │  ├─ PlayingScene.ts
│  │  │  ├─ CorrectScene.ts
│  │  │  ├─ GameOverScene.ts
│  │  │  └─ ClearScene.ts
│  │  └─ ui/
│  │     ├─ createText.ts
│  │     └─ createButton.ts
│  ├─ shared/
│  │  └─ utils/
│  └─ style.css
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ eslint.config.js
├─ prettier.config.js
├─ prd.md
├─ spec.md
├─ CLAUDE.md
└─ README.md
```

## 3. 실행 방식

브라우저에서 `#app` DOM 요소를 찾고, 해당 DOM에 Pixi.js canvas를 붙인다.

```ts
const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App container not found');
}

const game = new TypoTrapGame();

await game.init(container);
game.start();
```

## 4. 게임 생명주기 인터페이스

게임 클래스는 아래 생명주기를 가진다.

```ts
export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
}
```

`TypoTrapGame`은 이 인터페이스를 구현한다.

## 5. 주요 클래스

### 5.1 TypoTrapGame

역할:

* Pixi Application 생성
* 게임 상태 관리
* Scene 전환 관리
* ticker 관리
* 리소스 정리

주요 메서드:

```ts
class TypoTrapGame implements GameInstance {
  async init(container: HTMLElement): Promise<void>;
  start(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}
```

책임:

* Pixi 앱 초기화
* 현재 게임 상태 저장
* 현재 스테이지 인덱스 저장
* 남은 시간 관리
* 정답/오답 판정
* 화면 전환
* destroy 시 app과 이벤트 정리

## 6. 게임 상태 타입

```ts
export type GameStatus =
  | 'ready'
  | 'playing'
  | 'correct'
  | 'gameOver'
  | 'clear';
```

상태 설명:

```txt
ready       시작 전
playing     문제 풀이 중
correct     정답 선택 후 다음 단계 대기
gameOver    오답 또는 시간 초과
clear       모든 단계 완료
```

## 7. 스테이지 데이터 타입

```ts
export interface Stage {
  id: number;
  answer: string;
  options: string[];
}
```

예시:

```ts
export const stages: Stage[] = [
  {
    id: 1,
    answer: '사자',
    options: ['사자', '샤자', '사쟈', '샂자'],
  },
  {
    id: 2,
    answer: '바다',
    options: ['바다', '바따', '받아', '바댜'],
  },
];
```

## 8. 게임 규칙 상수

```ts
export const GAME_CONFIG = {
  TOTAL_STAGE_COUNT: 5,
  STAGE_TIME_LIMIT_SECONDS: 3,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
};
```

## 9. 상태 전환 규칙

```txt
ready
  └─ start button click
      → playing

playing
  ├─ correct answer click
  │   → correct
  ├─ wrong answer click
  │   → gameOver
  └─ time over
      → gameOver

correct
  ├─ next button click and next stage exists
  │   → playing
  └─ next button click and no next stage
      → clear

gameOver
  └─ restart button click
      → ready

clear
  └─ restart button click
      → ready
```

### 10. 타이머 규칙

* 각 스테이지의 제한 시간은 3초다.
* `playing` 상태일 때만 시간이 감소한다.
* 남은 시간은 숫자 텍스트보다 Progress Bar로 표시한다.
* Progress Bar는 스테이지 시작 시 100%로 시작한다.
* 시간이 지날수록 Progress Bar의 너비가 줄어든다.
* 남은 시간이 0 이하가 되면 `gameOver` 상태로 전환한다.
* `correct`, `gameOver`, `clear` 상태에서는 Progress Bar가 더 이상 줄어들지 않는다.
* 다음 단계로 이동하면 Progress Bar는 다시 100%로 초기화된다.

Progress Bar 계산 방식:

```
const progressRatio = remainingTime / GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS;
const progressWidth = maxProgressBarWidth * progressRatio;
```

예시:

```
remainingTime = 3.0 → progressRatio = 1.0 → 100%
remainingTime = 1.5 → progressRatio = 0.5 → 50%
remainingTime = 0.0 → progressRatio = 0.0 → 0%
```

### PlayingScene 역할 수정

PlayingScene의 역할:

* 현재 단계 표시
* 남은 시간을 Progress Bar로 표시
* 단어 옵션 표시

PlayingScene은 `remainingTime` 값을 받아 Progress Bar의 너비를 계산해 렌더링한다.

## 11. 클릭 판정 규칙

단어 클릭 시 다음 규칙을 따른다.

```ts
if (clickedWord === currentStage.answer) {
  setStatus('correct');
} else {
  setStatus('gameOver');
}
```

정답 클릭 후에는 자동으로 다음 단계로 넘어가지 않는다.
플레이어가 다음 단계 버튼을 눌러야 한다.

## 12. Scene 설계

### 12.1 ReadyScene

역할:

* 게임 제목 표시
* 규칙 설명 표시
* 시작 버튼 표시

이벤트:

* 시작 버튼 클릭 시 `onStart` 호출

### 12.2 PlayingScene

역할:

* 현재 단계 표시
* 남은 시간 표시
* 단어 옵션 표시

이벤트:

* 단어 클릭 시 `onSelectWord(word)` 호출

### 12.3 CorrectScene

역할:

* 정답 피드백 표시
* 다음 단계 버튼 표시

이벤트:

* 다음 단계 버튼 클릭 시 `onNext` 호출

### 12.4 GameOverScene

역할:

* 게임 오버 표시
* 실패 이유 표시
* 다시 시작 버튼 표시

이벤트:

* 다시 시작 버튼 클릭 시 `onRestart` 호출

### 12.5 ClearScene

역할:

* 전체 클리어 표시
* 다시 시작 버튼 표시

이벤트:

* 다시 시작 버튼 클릭 시 `onRestart` 호출

## 13. 렌더링 규칙

초기 버전에서는 복잡한 디자인을 하지 않는다.

기본 렌더링 기준:

```txt
배경: 단색
텍스트: Pixi Text
버튼: Pixi Graphics + Pixi Text
단어 보기: 클릭 가능한 텍스트 또는 버튼
```

## 14. 이벤트 정리 규칙

Pixi 객체에 이벤트를 등록했다면 scene 제거 또는 destroy 시 정리해야 한다.

예시:

```ts
button.removeAllListeners();
```

Scene을 교체할 때는 기존 scene container를 stage에서 제거하고 destroy한다.

```ts
this.app.stage.removeChildren();
```

또는 scene container 단위로 관리한다.

## 15. destroy 규칙

`destroy()`는 안전하게 여러 번 호출되어도 치명적인 에러가 나지 않아야 한다.

권장 방식:

```ts
destroy(): void {
  if (!this.app) return;

  this.app.destroy(true, {
    children: true,
    texture: true,
  });

  this.app = null;
}
```

주의:

* `app.init()`이 끝나기 전에 destroy하지 않도록 한다.
* 이벤트 리스너와 Pixi 리소스를 정리한다.
* destroy 이후 같은 인스턴스를 다시 사용하지 않는다.

## 16. 개발 순서

### Step 1. 프로젝트 생성

* GitHub에 `typo-trap` 저장소 생성
* 로컬 clone
* Vite + TypeScript 프로젝트 생성
* Pixi.js 설치
* ESLint / Prettier 설정

### Step 2. 기본 Pixi 화면 띄우기

* `#app`에 Pixi canvas 연결
* 배경 화면 표시
* 기본 텍스트 표시

### Step 3. TypoTrapGame 클래스 생성

* init/start/pause/resume/destroy 메서드 작성
* Pixi Application 생성 로직 이동

### Step 4. 게임 상태 추가

* ready
* playing
* correct
* gameOver
* clear

### Step 5. 스테이지 데이터 추가

* stages.ts 작성
* 5개 스테이지 데이터 추가
* 정답과 보기 데이터 구성

### Step 6. 화면 전환 구현

* ReadyScene
* PlayingScene
* CorrectScene
* GameOverScene
* ClearScene

### Step 7. 게임 규칙 구현

* 3초 타이머
* 정답 판정
* 오답 판정
* 시간 초과
* 다음 단계
* 클리어
* 다시 시작

### Step 8. 리소스 정리

* scene 전환 시 기존 화면 정리
* destroy 안정화
* 콘솔 에러 확인

## 17. 테스트 체크리스트

수동 테스트 기준:

```txt
[ ] 시작 화면이 보인다.
[ ] 시작 버튼 클릭 시 1단계가 시작된다.
[ ] 3초 타이머가 감소한다.
[ ] 정답 클릭 시 정답 화면이 나온다.
[ ] 다음 버튼 클릭 시 다음 단계로 이동한다.
[ ] 오답 클릭 시 게임 오버가 나온다.
[ ] 시간 초과 시 게임 오버가 나온다.
[ ] 다시 시작 버튼이 동작한다.
[ ] 5단계 완료 시 클리어 화면이 나온다.
[ ] 새로고침 후에도 정상 실행된다.
[ ] 콘솔에 치명적인 에러가 없다.
```

## 18. 초기 버전에서 하지 않을 것

* React 도입
* 라우팅
* 로그인
* 랭킹
* 점수 시스템
* 사운드
* 복잡한 애니메이션
* 반응형 UI 고도화
* 모노레포 구성
* 외부 서버 연동
