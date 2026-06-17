export type GameStatus = 'ready' | 'playing' | 'correct' | 'gameOver' | 'clear';

export type GameOverReason = 'wrong' | 'timeout';

export interface Stage {
  id: number;
  answer: string;
  options: string[];
}

export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
}
