# CLAUDE.md

## 프로젝트 개요

Typo Trap은 Pixi.js로 만드는 독립형 웹 미니게임이다.

플레이어는 제한 시간 안에 여러 한글 단어 중에서 오타가 없는 올바른 단어를 찾아 클릭해야 한다.

이 프로젝트는 독립적인 미니게임 프로젝트이며, 모노레포나 다른 플랫폼에 포함되는 것을 전제로 하지 않는다.

## 현재 목표

초기 목표는 Typo Trap 게임의 기본 플레이 흐름을 완성하는 것이다.

현재 단계에서는 아래 작업을 하지 않는다.

* React 도입
* React Router 도입
* Supabase 연동
* 로그인 기능
* 랭킹 시스템
* 점수 저장
* 모노레포 구성
* 외부 서버 연동
* 복잡한 디자인 시스템 구축

게임 자체가 안정적으로 실행되고, 시작부터 클리어 또는 게임 오버까지의 흐름이 완성되는 것을 우선한다.

## 기술 스택

이 프로젝트는 아래 기술을 사용한다.

* Vite
* TypeScript
* Pixi.js
* ESLint
* Prettier

초기 버전에서는 React를 사용하지 않는다.

## 게임 규칙

* 게임은 총 5단계로 구성한다.
* 각 단계의 제한 시간은 3초다.
* 각 단계에는 정답 단어 1개와 오타 단어 여러 개가 표시된다.
* 플레이어는 제한 시간 안에 오타가 없는 정답 단어를 클릭해야 한다.
* 오답을 클릭하면 즉시 게임 오버가 된다.
* 제한 시간이 끝나도 게임 오버가 된다.
* 정답을 클릭하면 바로 다음 단계로 넘어가지 않고, 정답 화면을 보여준다.
* 정답 화면에서 다음 단계 버튼을 클릭하면 다음 단계로 이동한다.
* 5단계를 모두 통과하면 클리어 화면을 보여준다.
* 초기 버전에서는 점수 시스템을 만들지 않는다.

## 단어 규칙

* 단어는 한글만 사용한다.
* 초등학생도 알 수 있는 쉬운 단어를 우선 사용한다.
* 정답 단어는 2~4글자 단어를 우선 사용한다.
* 오타 단어는 정답과 비슷하게 보이는 글자로 만든다.
* 초기 버전에서는 한 글자 빠짐, 글자 추가, 순서 바뀜 방식의 오타를 사용하지 않는다.
* 오타는 정답과 정확히 일치하면 안 된다.

예시:

```txt
사자 → 샤자
바다 → 바따
토끼 → 도끼
나무 → 나므
고양이 → 고양니
```

## 화면 구성

게임은 아래 화면으로 구성한다.

```txt
ready       시작 화면
playing     게임 진행 화면
correct     정답 화면
gameOver    게임 오버 화면
clear       클리어 화면
```

### 시작 화면

시작 화면에는 아래 요소를 표시한다.

* 게임 제목
* 간단한 규칙 설명
* 시작 버튼

예시 문구:

```txt
3초 안에 오타 없는 단어를 찾아라!
틀리면 바로 게임 오버!
```

### 게임 진행 화면

게임 진행 화면에는 아래 요소를 표시한다.

* 현재 단계
* 남은 시간을 나타내는 Progress Bar
* 단어 보기 목록
* 클릭 가능한 단어 버튼 또는 텍스트

남은 시간은 숫자 텍스트보다 Progress Bar를 우선 사용한다.

Progress Bar는 스테이지 시작 시 100%로 시작하고, 3초 동안 점점 줄어든다. Progress Bar가 모두 줄어들면 시간 초과로 게임 오버가 된다.

### 정답 화면

정답 화면에는 아래 요소를 표시한다.

* 정답 피드백
* 다음 단계 버튼

정답을 맞혀도 자동으로 다음 단계로 넘어가지 않는다. 반드시 사용자가 다음 단계 버튼을 클릭해야 한다.

### 게임 오버 화면

게임 오버 화면에는 아래 요소를 표시한다.

* 게임 오버 문구
* 실패 이유
* 다시 시작 버튼

실패 이유는 아래 두 가지 중 하나다.

* 오답 클릭
* 시간 초과

### 클리어 화면

클리어 화면에는 아래 요소를 표시한다.

* 클리어 문구
* 다시 시작 버튼

## 추천 프로젝트 구조

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

## 게임 생명주기

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

`TypoTrapGame` 클래스는 이 인터페이스를 구현한다.

## 게임 상태 타입

```ts
export type GameStatus =
  | 'ready'
  | 'playing'
  | 'correct'
  | 'gameOver'
  | 'clear';
```

## 개발 규칙

* 게임 로직은 단순하고 명확하게 작성한다.
* 초기에 불필요한 추상화를 만들지 않는다.
* 단어 데이터는 게임 로직과 분리해서 관리한다.
* 게임 상태 전환은 명확하게 관리한다.
* 화면 렌더링과 상태 변경 로직은 가능한 한 분리한다.
* Pixi.js 리소스 정리를 항상 고려한다.
* `destroy()`는 여러 번 호출되어도 치명적인 에러가 나지 않도록 작성한다.
* 요청받기 전까지 복잡한 디자인 작업을 하지 않는다.
* UI 라이브러리를 설치하지 않는다.
* React를 도입하지 않는다.

## TypeScript 작성 규칙

* TypeScript를 사용한다.
* 가능한 한 `any` 사용을 피한다.
* 짧은 이름보다 의미가 명확한 이름을 사용한다.
* 반복되는 값은 상수로 분리한다.
* 게임 설정 값은 `constants.ts`에 둔다.
* 공통 타입은 `types.ts`에 둔다.
* 스테이지 데이터는 `data/stages.ts`에 둔다.

## Pixi.js 작성 규칙

* Pixi Application은 `TypoTrapGame.init()`에서 초기화한다.
* Pixi canvas는 전달받은 container에 붙인다.
* 기본 텍스트는 Pixi Text를 사용한다.
* 기본 버튼은 Pixi Graphics와 Pixi Text를 조합해서 만든다.
* 타이머 Progress Bar는 Pixi Graphics로 그린다.
* Progress Bar의 너비는 남은 시간 비율로 계산한다.
* 다음 단계로 이동하면 Progress Bar를 다시 100%로 초기화한다.
* `playing` 상태가 아닐 때는 Progress Bar를 업데이트하지 않는다.
* Scene 전환 시 이전 Scene의 container를 제거하거나 destroy한다.
* 이벤트 리스너는 Scene 제거 또는 destroy 시 정리한다.
* Pixi 리소스는 `destroy()`에서 정리한다.
* `app.init()`이 완료되기 전에 `destroy()`가 호출되지 않도록 주의한다.

## Progress Bar 규칙

남은 시간은 Progress Bar로 표현한다.

계산 방식은 아래와 같다.

```ts
const progressRatio = remainingTime / GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS;
const progressWidth = maxProgressBarWidth * progressRatio;
```

예시:

```txt
remainingTime = 3.0 → progressRatio = 1.0 → 100%
remainingTime = 1.5 → progressRatio = 0.5 → 50%
remainingTime = 0.0 → progressRatio = 0.0 → 0%
```

## 문서 관리 규칙

아래 문서를 계속 최신 상태로 유지한다.

* `prd.md`: 제품 요구사항과 게임 규칙
* `spec.md`: 기술 명세와 구현 방식
* `README.md`: 프로젝트 소개, 설치 방법, 실행 방법
* `CLAUDE.md`: Claude Code가 따라야 할 프로젝트 규칙

## Git 브랜치 규칙

간단한 브랜치 전략을 사용한다.

```txt
main
feat/init-project
feat/game-core
feat/stage-data
feat/scenes
feat/timer
fix/game-destroy
docs/update-spec
chore/eslint-prettier
```

## 커밋 메시지 예시

```txt
chore: initialize typo-trap project
docs: add prd and spec
feat: add pixi app lifecycle
feat: implement ready scene
feat: implement playing scene
feat: add progress bar timer
feat: add stage timer
fix: cleanup pixi resources on destroy
```

## 초기 버전에서 하지 않을 것

초기 버전에서는 아래 기능을 만들지 않는다.

* React
* React Router
* Zustand
* Supabase
* 로그인
* 랭킹 시스템
* 점수 시스템
* 모노레포
* 멀티플레이
* 사운드 시스템
* 복잡한 애니메이션 시스템
* 디자인 시스템
* Tailwind CSS
* 외부 서버 연동

## 첫 번째 마일스톤 완료 기준

첫 번째 마일스톤은 아래 조건을 모두 만족하면 완료로 본다.

* `pnpm dev`로 앱이 실행된다.
* 브라우저에 Pixi canvas가 표시된다.
* 시작 화면이 표시된다.
* 시작 버튼을 누르면 게임이 시작된다.
* 5단계를 플레이할 수 있다.
* 남은 시간이 Progress Bar로 표시된다.
* Progress Bar가 3초 동안 줄어든다.
* 정답 클릭 시 정답 화면이 표시된다.
* 다음 버튼 클릭 시 다음 단계로 이동한다.
* 오답 클릭 시 게임 오버가 표시된다.
* 시간 초과 시 게임 오버가 표시된다.
* 5단계를 모두 통과하면 클리어 화면이 표시된다.
* 다시 시작 버튼이 동작한다.
* 콘솔에 치명적인 에러가 없다.
