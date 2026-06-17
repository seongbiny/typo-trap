import './style.css';
import { TypoTrapGame } from './game/TypoTrapGame';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App container not found');
}

const game = new TypoTrapGame();

await game.init(container);
game.start();
