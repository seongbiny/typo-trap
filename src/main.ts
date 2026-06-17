import './style.css';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App container not found');
}

// Step 2에서 TypoTrapGame 연결 예정
container.innerHTML = '<p style="color: white;">Typo Trap</p>';
