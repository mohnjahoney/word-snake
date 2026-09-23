import './style.css';

type Point = { x: number; y: number };
type Direction = Point;
type Tile = { letter: string; seeded: boolean } | null;
type Collected = { letter: string; position: Point; id: number };

const SIZE = 12;
const SNAKE_LENGTH = 8;
const RUN_SECONDS = 60;
const STEP_MS = 185;

const SHORT_WORDS = [
  'ace', 'act', 'air', 'and', 'ant', 'arc', 'are', 'art', 'ate', 'bad', 'bar', 'bed', 'bee',
  'big', 'bit', 'box', 'boy', 'car', 'cat', 'cow', 'cup', 'day', 'dog', 'dry', 'ear', 'eat',
  'egg', 'end', 'far', 'few', 'fit', 'fox', 'fun', 'get', 'god', 'hat', 'hen', 'her', 'hit',
  'hot', 'ice', 'job', 'key', 'leg', 'let', 'lid', 'log', 'man', 'map', 'may', 'mix', 'net',
  'new', 'now', 'one', 'out', 'pan', 'pen', 'pet', 'pie', 'pig', 'pin', 'pot', 'red', 'run',
  'sad', 'sea', 'set', 'sit', 'sky', 'sun', 'tea', 'the', 'tie', 'top', 'toy', 'try', 'use',
  'van', 'war', 'way', 'web', 'win', 'wood', 'yes', 'you'
];

const FOUR_WORDS = [
  'area', 'bake', 'ball', 'band', 'bank', 'bare', 'base', 'beam', 'bear', 'beat', 'bell', 'best',
  'bird', 'blue', 'boat', 'book', 'boot', 'born', 'both', 'bowl', 'cake', 'calm', 'came', 'camp',
  'care', 'case', 'city', 'club', 'cold', 'come', 'cook', 'cool', 'dark', 'data', 'dear', 'deep',
  'door', 'down', 'draw', 'dream', 'dress', 'drop', 'easy', 'edge', 'else', 'even', 'face', 'fact',
  'fall', 'farm', 'fast', 'feel', 'feet', 'fill', 'film', 'find', 'fire', 'fish', 'five', 'food',
  'foot', 'form', 'four', 'free', 'from', 'game', 'gate', 'give', 'glad', 'goal', 'gold', 'good',
  'gray', 'grow', 'half', 'hand', 'hang', 'hard', 'have', 'head', 'hear', 'heat', 'help', 'here',
  'high', 'home', 'hope', 'hour', 'idea', 'into', 'iron', 'jump', 'keep', 'kind', 'king', 'kite',
  'lake', 'land', 'last', 'late', 'lead', 'left', 'life', 'line', 'lion', 'list', 'live', 'long',
  'look', 'love', 'main', 'make', 'many', 'meal', 'meet', 'milk', 'mind', 'moon', 'more', 'most',
  'move', 'name', 'near', 'need', 'next', 'nice', 'nine', 'open', 'over', 'page', 'park', 'part',
  'play', 'rain', 'read', 'real', 'road', 'rock', 'room', 'rose', 'rule', 'safe', 'same', 'sand',
  'save', 'seat', 'sell', 'send', 'ship', 'shoe', 'shop', 'show', 'sick', 'side', 'sing', 'size',
  'slow', 'snow', 'song', 'star', 'stay', 'step', 'stop', 'sure', 'swim', 'take', 'talk', 'team',
  'tell', 'than', 'that', 'them', 'then', 'they', 'thin', 'this', 'time', 'town', 'tree', 'true',
  'turn', 'unit', 'upon', 'very', 'walk', 'wall', 'warm', 'wash', 'wave', 'week', 'well', 'west',
  'what', 'when', 'whom', 'wide', 'wild', 'will', 'wind', 'wine', 'wish', 'with', 'word', 'work',
  'yard', 'year', 'your', 'zero'
];

const FIVE_WORDS = [
  'apple', 'beach', 'black', 'brain', 'bread', 'break', 'bring', 'brown', 'carry', 'chair', 'charm',
  'child', 'clean', 'clear', 'clock', 'cloud', 'color', 'could', 'dance', 'dream', 'early', 'earth',
  'eight', 'enjoy', 'every', 'field', 'first', 'floor', 'focus', 'found', 'front', 'fruit', 'giant',
  ' given', 'green', 'group', 'happy', 'heart', 'house', 'human', 'jolly', 'judge', 'laugh', 'learn',
  'light', 'lucky', 'magic', 'maybe', 'money', 'month', 'mouse', 'music', 'night', 'ocean', 'paint',
  'party', 'peace', 'phone', 'place', 'plant', 'point', 'power', 'quick', 'quiet', 'radio', 'raise',
  'reach', 'river', 'round', 'royal', 'scale', 'score', 'serve', 'share', 'sheep', 'short', 'sleep',
  'small', 'smile', 'sound', 'space', 'spell', 'sport', 'start', 'steam', 'stone', 'store', 'story',
  'sweet', 'table', 'teach', 'thank', 'there', 'thing', 'think', 'third', 'three', 'tiger', 'today',
  'touch', 'tower', 'train', 'trust', 'under', 'until', 'visit', 'voice', 'watch', 'water', 'where',
  'which', 'white', 'whole', 'world', 'write', 'young'
].map((word) => word.trim());

const WORDS = new Set([...SHORT_WORDS, ...FOUR_WORDS, ...FIVE_WORDS]);
const SEEDED = ['stone', 'apple', 'light', 'dream', 'water', 'train', 'score', 'green', 'play', 'heart', 'star', 'moon'];
const LETTERS = 'EEEEEEEEAAAAAAAARRRRRIIIIIIIOTTTTTNNNNNSSSSSLLLLCCCCUUUUDDDDPPPMMHHGGYBKVWFXQJZ';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">A word game in motion</p>
        <h1>Word Snake</h1>
      </div>
      <div class="stats" aria-label="Game stats">
        <div><span>Score</span><strong id="score">0</strong></div>
        <div><span>Time</span><strong id="time">60</strong></div>
      </div>
    </header>

    <section class="game-layout">
      <div class="board-wrap">
        <canvas id="board" aria-label="Word Snake game board"></canvas>
        <div id="overlay" class="overlay">
          <p class="eyebrow">60 second prototype</p>
          <h2>Find your line.</h2>
          <p>Steer over letters, spot a word, then choose it before time runs out.</p>
          <button id="start">Start run</button>
        </div>
      </div>

      <aside class="side-panel">
        <div class="panel-section sequence-section">
          <div class="section-heading"><span>Snake sequence</span><span id="sequence-count">0 / ${SNAKE_LENGTH}</span></div>
          <div id="sequence" class="sequence" aria-live="polite"><span class="muted">Collect letters to begin</span></div>
        </div>

        <div class="panel-section candidates-section">
          <div class="section-heading"><span>Choose a word</span><span>Enter to confirm</span></div>
          <div id="candidates" class="candidates"><span class="muted">Words will appear here</span></div>
        </div>

        <div class="controls">
          <p><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> steer</p>
          <p><kbd>Tab</kbd> choose <kbd>Enter</kbd> score</p>
        </div>
        <button id="reset" class="secondary">Reset board</button>
      </aside>
    </section>

    <footer><span id="message">Seeded with word paths. Find one.</span><span>Prototype rules: 60 seconds · fixed 8-letter window</span></footer>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#board')!;
const ctx = canvas.getContext('2d')!;
const scoreEl = document.querySelector<HTMLElement>('#score')!;
const timeEl = document.querySelector<HTMLElement>('#time')!;
const sequenceEl = document.querySelector<HTMLElement>('#sequence')!;
const sequenceCountEl = document.querySelector<HTMLElement>('#sequence-count')!;
const candidatesEl = document.querySelector<HTMLElement>('#candidates')!;
const messageEl = document.querySelector<HTMLElement>('#message')!;
const overlayEl = document.querySelector<HTMLElement>('#overlay')!;
const startButton = document.querySelector<HTMLButtonElement>('#start')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;

const directions: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 }
};

let board: Tile[][];
let snake: Point[];
let sequence: Collected[];
let direction: Direction;
let queuedDirection: Direction;
let selectedIndex = 0;
let score = 0;
let remaining = RUN_SECONDS;
let running = false;
let tickTimer: number | undefined;
let clockTimer: number | undefined;
let lastStep = 0;
let nextId = 1;
let floatingScore: { text: string; x: number; y: number; born: number } | null = null;

function samePoint(a: Point, b: Point) { return a.x === b.x && a.y === b.y; }
function key(point: Point) { return `${point.x},${point.y}`; }

function emptyBoard(): Tile[][] {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));
}

function canPlace(grid: Tile[][], word: string, start: Point, delta: Direction) {
  for (let index = 0; index < word.length; index += 1) {
    const x = start.x + delta.x * index;
    const y = start.y + delta.y * index;
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return false;
    const tile = grid[y][x];
    if (tile && tile.letter !== word[index]) return false;
  }
  return true;
}

function placeWord(grid: Tile[][], word: string, seeded = true) {
  const options: { start: Point; delta: Direction }[] = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      for (const delta of [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }]) {
        if (canPlace(grid, word, { x, y }, delta)) options.push({ start: { x, y }, delta });
      }
    }
  }
  if (options.length === 0) return false;
  const choice = options[Math.floor(Math.random() * options.length)];
  for (let index = 0; index < word.length; index += 1) {
    const x = choice.start.x + choice.delta.x * index;
    const y = choice.start.y + choice.delta.y * index;
    grid[y][x] = { letter: word[index].toUpperCase(), seeded };
  }
  return true;
}

function createBoard() {
  const grid = emptyBoard();
  const seededWords = [...SEEDED].sort((a, b) => b.length - a.length);
  seededWords.forEach((word) => placeWord(grid, word));
  for (let index = 0; index < 50; index += 1) {
    const word = index < 14 ? FOUR_WORDS[Math.floor(Math.random() * FOUR_WORDS.length)] : SHORT_WORDS[Math.floor(Math.random() * SHORT_WORDS.length)];
    placeWord(grid, word, true);
  }
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!grid[y][x]) grid[y][x] = { letter: LETTERS[Math.floor(Math.random() * LETTERS.length)], seeded: false };
    }
  }
  return grid;
}

function resetState() {
  board = createBoard();
  snake = Array.from({ length: SNAKE_LENGTH }, (_, index) => ({ x: 5 - index, y: 10 }));
  direction = { x: 0, y: -1 };
  queuedDirection = direction;
  sequence = [];
  selectedIndex = 0;
  score = 0;
  remaining = RUN_SECONDS;
  running = false;
  floatingScore = null;
  if (tickTimer) window.clearInterval(tickTimer);
  if (clockTimer) window.clearInterval(clockTimer);
  tickTimer = undefined;
  clockTimer = undefined;
  overlayEl.classList.remove('hidden');
  overlayEl.querySelector('h2')!.textContent = 'Find your line.';
  overlayEl.querySelector('p:not(.eyebrow)')!.textContent = 'Steer over letters, spot a word, then choose it before time runs out.';
  startButton.textContent = 'Start run';
  messageEl.textContent = 'Seeded with word paths. Find one.';
  updateUI();
  draw();
}

function startRun() {
  if (running) return;
  running = true;
  overlayEl.classList.add('hidden');
  lastStep = performance.now();
  tickTimer = window.setInterval(step, STEP_MS);
  clockTimer = window.setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) endRun();
    updateUI();
  }, 1000);
  messageEl.textContent = 'Steer, scan, choose.';
}

function endRun() {
  running = false;
  if (tickTimer) window.clearInterval(tickTimer);
  if (clockTimer) window.clearInterval(clockTimer);
  tickTimer = undefined;
  clockTimer = undefined;
  overlayEl.classList.remove('hidden');
  overlayEl.querySelector('h2')!.textContent = 'Time. Nice run.';
  overlayEl.querySelector('p:not(.eyebrow)')!.textContent = `You scored ${score.toLocaleString()} points.`;
  startButton.textContent = 'Run it again';
  messageEl.textContent = 'Choose reset board for a fresh layout.';
  draw();
}

function setDirection(next: Direction) {
  if (next.x + direction.x === 0 && next.y + direction.y === 0) return;
  queuedDirection = next;
}

function step() {
  if (!running) return;
  direction = queuedDirection;
  const head = snake[0];
  const next = { x: head.x + direction.x, y: head.y + direction.y };
  if (next.x < 0 || next.x >= SIZE || next.y < 0 || next.y >= SIZE) {
    messageEl.textContent = 'Boundary hit — keep going from the other side.';
    direction = { x: -direction.x, y: -direction.y };
    queuedDirection = direction;
    return;
  }
  snake = [next, ...snake].slice(0, SNAKE_LENGTH);
  const tile = board[next.y][next.x];
  if (tile) {
    sequence.push({ letter: tile.letter, position: next, id: nextId++ });
    if (sequence.length > SNAKE_LENGTH) sequence.shift();
    board[next.y][next.x] = null;
    selectedIndex = 0;
  }
  updateUI();
  draw();
}

function candidates() {
  const text = sequence.map((item) => item.letter.toLowerCase()).join('');
  const found = new Map<string, { start: number; end: number }>();
  for (let start = 0; start < text.length; start += 1) {
    for (let end = start + 3; end <= text.length; end += 1) {
      const word = text.slice(start, end);
      if (WORDS.has(word)) found.set(word, { start, end });
    }
  }
  return [...found.entries()]
    .map(([word, range]) => ({ word, ...range }))
    .sort((a, b) => b.word.length - a.word.length || a.start - b.start);
}

function confirmWord() {
  const options = candidates();
  if (!options.length) return;
  const selected = options[selectedIndex % options.length];
  const points = selected.word.length === 3 ? 10 : selected.word.length === 4 ? 25 : 50 + (selected.word.length - 5) * 25;
  score += points;
  const removedIds = new Set(sequence.slice(selected.start, selected.end).map((item) => item.id));
  sequence = sequence.filter((item) => !removedIds.has(item.id));
  floatingScore = { text: `+${points}`, x: canvas.width * 0.52, y: canvas.height * 0.38, born: performance.now() };
  messageEl.textContent = `${selected.word.toUpperCase()} confirmed — keep searching.`;
  selectedIndex = 0;
  updateUI();
  draw();
}

function cycleCandidate() {
  const options = candidates();
  if (options.length) selectedIndex = (selectedIndex + 1) % options.length;
  updateUI();
  draw();
}

function resizeCanvas() {
  const size = Math.min(720, Math.max(300, Math.floor(canvas.parentElement!.clientWidth)));
  const ratio = window.devicePixelRatio || 1;
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

function draw() {
  const width = canvas.clientWidth || 600;
  const cell = width / SIZE;
  ctx.clearRect(0, 0, width, width);
  ctx.fillStyle = '#f3efe7';
  ctx.fillRect(0, 0, width, width);

  ctx.strokeStyle = 'rgba(68, 69, 61, .09)';
  ctx.lineWidth = 1;
  for (let index = 0; index <= SIZE; index += 1) {
    ctx.beginPath(); ctx.moveTo(index * cell, 0); ctx.lineTo(index * cell, width); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, index * cell); ctx.lineTo(width, index * cell); ctx.stroke();
  }

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const tile = board[y][x];
      if (!tile) continue;
      const center = { x: x * cell + cell / 2, y: y * cell + cell / 2 };
      ctx.fillStyle = tile.seeded ? '#fff8df' : '#ffffff';
      ctx.beginPath(); ctx.arc(center.x, center.y, cell * 0.29, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = tile.seeded ? 'rgba(238, 158, 76, .42)' : 'rgba(43, 53, 47, .12)';
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#26352f';
      ctx.font = `700 ${cell * 0.29}px ui-rounded, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tile.letter, center.x, center.y + 1);
    }
  }

  if (snake.length > 1) {
    ctx.strokeStyle = 'rgba(35, 112, 92, .42)';
    ctx.lineWidth = cell * 0.16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    snake.slice().reverse().forEach((point, index) => {
      const x = point.x * cell + cell / 2;
      const y = point.y * cell + cell / 2;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  snake.forEach((point, index) => {
    const center = { x: point.x * cell + cell / 2, y: point.y * cell + cell / 2 };
    ctx.fillStyle = index === 0 ? '#195b4b' : 'rgba(43, 133, 106, .64)';
    ctx.beginPath(); ctx.arc(center.x, center.y, cell * 0.36, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .62)'; ctx.lineWidth = 2; ctx.stroke();
  });

  if (floatingScore) {
    const age = performance.now() - floatingScore.born;
    if (age < 1000) {
      ctx.globalAlpha = 1 - age / 1000;
      ctx.fillStyle = '#d47932';
      ctx.font = '800 26px ui-rounded, system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(floatingScore.text, floatingScore.x, floatingScore.y - age * 0.04);
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    } else floatingScore = null;
  }
}

function updateUI() {
  scoreEl.textContent = score.toLocaleString();
  timeEl.textContent = String(Math.max(0, remaining));
  timeEl.classList.toggle('urgent', remaining <= 10);
  sequenceCountEl.textContent = `${sequence.length} / ${SNAKE_LENGTH}`;
  sequenceEl.innerHTML = sequence.length
    ? sequence.map((item) => `<span class="sequence-letter">${item.letter}</span>`).join('')
    : '<span class="muted">Collect letters to begin</span>';

  const options = candidates();
  candidatesEl.innerHTML = options.length
    ? options.map((item, index) => `<button class="candidate ${index === selectedIndex ? 'selected' : ''}" data-index="${index}"><span>${item.word.toUpperCase()}</span><small>+${item.word.length === 3 ? 10 : item.word.length === 4 ? 25 : 50}</small></button>`).join('')
    : '<span class="muted">Words will appear here</span>';
  candidatesEl.querySelectorAll<HTMLButtonElement>('.candidate').forEach((button) => {
    button.addEventListener('click', () => {
      selectedIndex = Number(button.dataset.index || 0);
      confirmWord();
    });
  });
}

window.addEventListener('keydown', (event) => {
  const next = directions[event.key] || directions[event.key.toLowerCase()];
  if (next) {
    event.preventDefault();
    setDirection(next);
    if (!running) startRun();
  } else if (event.key === 'Tab') {
    event.preventDefault(); cycleCandidate();
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); confirmWord();
  }
});
startButton.addEventListener('click', () => { resetState(); startRun(); });
resetButton.addEventListener('click', resetState);
window.addEventListener('resize', resizeCanvas);

resetState();
resizeCanvas();
