import { Container, Graphics } from 'pixi.js';
import { createText } from '../ui/createText';
import { createButton } from '../ui/createButton';
import type { Stage } from '../types';
import { GAME_CONFIG } from '../constants';

const PROGRESS_BAR_X = 50;
const PROGRESS_BAR_Y = 80;
const PROGRESS_BAR_MAX_WIDTH = 700;
const PROGRESS_BAR_HEIGHT = 20;

const WORD_BTN_WIDTH = 160;
const WORD_BTN_HEIGHT = 70;
const WORD_BTN_GAP = 20;
const WORD_BTN_Y = 320;

export class PlayingScene extends Container {
  private progressBarFill: Graphics;

  constructor(
    stage: Stage,
    stageIndex: number,
    onSelectWord: (word: string) => void
  ) {
    super();

    // 단계 표시
    const stageLabel = createText(
      `${stageIndex + 1} / ${GAME_CONFIG.TOTAL_STAGE_COUNT}`,
      { fontSize: 26 }
    );
    stageLabel.anchor.set(0.5);
    stageLabel.x = GAME_CONFIG.CANVAS_WIDTH / 2;
    stageLabel.y = 45;

    // 프로그레스 바 배경
    const progressBg = new Graphics();
    progressBg.roundRect(PROGRESS_BAR_X, PROGRESS_BAR_Y, PROGRESS_BAR_MAX_WIDTH, PROGRESS_BAR_HEIGHT, 4);
    progressBg.fill(0x444444);

    // 프로그레스 바 채움
    this.progressBarFill = new Graphics();
    this.drawProgressBar(GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS);

    // 단어 버튼
    const totalBtnWidth =
      stage.options.length * WORD_BTN_WIDTH + (stage.options.length - 1) * WORD_BTN_GAP;
    const startX = (GAME_CONFIG.CANVAS_WIDTH - totalBtnWidth) / 2;

    const wordButtons = stage.options.map((word, i) => {
      const btn = createButton(word, () => onSelectWord(word), {
        width: WORD_BTN_WIDTH,
        height: WORD_BTN_HEIGHT,
        color: 0x334466,
        fontSize: 24,
      });
      btn.x = startX + i * (WORD_BTN_WIDTH + WORD_BTN_GAP);
      btn.y = WORD_BTN_Y;
      return btn;
    });

    this.addChild(stageLabel, progressBg, this.progressBarFill, ...wordButtons);
  }

  update(remainingTime: number): void {
    this.drawProgressBar(remainingTime);
  }

  private drawProgressBar(remainingTime: number): void {
    const ratio = Math.max(0, remainingTime / GAME_CONFIG.STAGE_TIME_LIMIT_SECONDS);
    const width = PROGRESS_BAR_MAX_WIDTH * ratio;

    this.progressBarFill.clear();
    if (width > 0) {
      this.progressBarFill.roundRect(PROGRESS_BAR_X, PROGRESS_BAR_Y, width, PROGRESS_BAR_HEIGHT, 4);
      this.progressBarFill.fill(ratio > 0.4 ? 0x00cc66 : 0xff6633);
    }
  }
}
