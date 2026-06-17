import type { GameInstance } from './types';

export class TypoTrapGame implements GameInstance {
  async init(_container: HTMLElement): Promise<void> {}

  start(): void {}

  pause(): void {}

  resume(): void {}

  destroy(): void {}
}
