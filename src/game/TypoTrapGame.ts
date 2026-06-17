import { Application, Text } from 'pixi.js';
import type { GameInstance } from './types';
import { GAME_CONFIG } from './constants';

export class TypoTrapGame implements GameInstance {
  private app: Application | null = null;

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application();

    await this.app.init({
      width: GAME_CONFIG.CANVAS_WIDTH,
      height: GAME_CONFIG.CANVAS_HEIGHT,
      backgroundColor: 0x1a1a2e,
    });

    container.appendChild(this.app.canvas);

    const label = new Text({
      text: 'Typo Trap',
      style: { fill: 0xffffff, fontSize: 48 },
    });
    label.anchor.set(0.5);
    label.x = this.app.screen.width / 2;
    label.y = this.app.screen.height / 2;
    this.app.stage.addChild(label);
  }

  start(): void {}

  pause(): void {}

  resume(): void {}

  destroy(): void {
    if (!this.app) return;

    this.app.destroy(true, { children: true, texture: true });
    this.app = null;
  }
}
