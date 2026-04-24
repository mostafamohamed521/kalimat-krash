// ============================================
// KALIMAT CRASH — game-engine.js
// Handles all 4 game modes completely
// ============================================

document.addEventListener('DOMContentLoaded', initGame);

// ==================== GLOBALS ====================
let currentLevel, levelData, currentMode;
let playerCoins = 100;
let targetWords = []; // [{word, found, color}]

// Mode 1 & 2
let gridRows = 5, gridCols = 5;
let letterGrid = []; // 2D array of chars
let usedCells = [];  // 2D bool array
let isSelecting = false;
let selPath = [];    // [{r,c}]
let selStart = null;
let currentColor = null;

// Word colors (matching screenshot orange, blue, purple, etc.)
const WORD_COLORS = ['#e67e22','#2980b9','#8e44ad','#c0392b','#1abc9c','#d35400','#27ae60','#f39c12'];

// Mode 3
let wsGrid = [];
let wsUsed = [];
let wsSelecting = false;
let wsSelPath = [];

// Mode 4
let cwWords = [];      // array of word objects from data
let cwGrid = [];       // 2D [{letter, wordIdx, posInWord}|null]
let cwFoundFlags = []; // bool per word
let cwActiveWordIdx = null;
let cwAnswer = [];     // picked letters (indices into miniLetters)
let miniLetters = [];

// DOM shortcuts
const $ = id => document.getElementById(id);

// ==================== INIT ====================

function initGame() {
    const params = new URLSearchParams(location.search);
    const levelId = parseInt(params.get('level')) || 1;
    const allLevels = getAllLevels();
    currentLevel = allLevels.find(l => l.id === levelId);
    if (!currentLevel) { location.href = 'map.html'; return; }

    levelData = currentLevel.data;
    currentMode = currentLevel.mode;
    playerCoins = loadCoins();

    $('levelDisplayText').textContent = `مستوى ${levelId}`;
    $('modeDisplayText').textContent = ['','صورة وكلمات','أمثال مصرية','صور متعددة','كلمات متقاطعة'][currentMode];
    updateCoins();

    // Show correct area
    $('standardModeArea').style.display = (currentMode <= 2) ? 'flex' : 'none';
    $('multiModeArea').style.display    = (currentMode === 3) ? 'flex' : 'none';
    $('crosswordModeArea').style.display = (currentMode === 4) ? 'flex' : 'none';

    if (currentMode === 1) initMode1();
    else if (currentMode === 2) initMode2();
    else if (currentMode === 3) initMode3();
    else initMode4();

    setupHintButtons();
    setupNavButtons();

    // Fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s';
    requestAnimationFrame(() => setTimeout(() => document.body.style.opacity = '1', 50));
}

// ==================== MODE 1: Single Image ====================

function initMode1() {
    // Image
    const wrap = $('imageWrapper');
    const img = document.createElement('img');
    img.src = levelData.image;
    img.className = 'level-image';
    img.onerror = () => { img.src = ''; img.style.display = 'none'; };
    wrap.appendChild(img);

    targetWords = levelData.words.map((w, i) => ({ word: w, found: false, color: WORD_COLORS[i % WORD_COLORS.length] }));
    renderWordSlots();
    buildStandardGrid(levelData.words);
    renderStandardGrid();
    setupGridEvents();
}

// ==================== MODE 2: Emojis / Proverbs ====================

function initMode2() {
    const wrap = $('imageWrapper');
    wrap.classList.add('emoji-mode');
    const container = document.createElement('div');
    container.className = 'emoji-container';
    container.textContent = levelData.emojis.join('  ');
    wrap.appendChild(container);

    targetWords = levelData.words.map((w, i) => ({ word: w, found: false, color: WORD_COLORS[i % WORD_COLORS.length] }));
    renderWordSlots();
    buildStandardGrid(levelData.words);
    renderStandardGrid();
    setupGridEvents();
}

// ---- Standard grid builder (Mode 1 & 2): CSP-based adjacent path ----

function buildStandardGrid(words) {
    const totalChars = words.reduce((s, w) => s + w.length, 0);
    gridCols = Math.max(4, Math.ceil(Math.sqrt(totalChars * 1.8)));
    gridRows = Math.max(4, Math.ceil(totalChars * 1.8 / gridCols));

    letterGrid = Array(gridRows).fill(null).map(() => Array(gridCols).fill(''));
    usedCells  = Array(gridRows).fill(null).map(() => Array(gridCols).fill(false));

    // Place each word as an adjacent random walk (CSP-inspired backtracking)
    const DIRS = [[0,1],[0,-1],[1,0],[-1,0]];
    const placed = {};  // cell key → true

    for (const word of words) {
        let wordPlaced = false;
        // Try up to 200 random starting positions
        for (let attempt = 0; attempt < 200 && !wordPlaced; attempt++) {
            const sr = Math.floor(Math.random() * gridRows);
            const sc = Math.floor(Math.random() * gridCols);
            if (placed[`${sr},${sc}`]) continue;

            // Random walk backtracking
            const path = [{r: sr, c: sc}];
            const visited = new Set([`${sr},${sc}`]);

            const dfs = depth => {
                if (depth === word.length) return true;
                const {r, c} = path[path.length - 1];
                const shuffled = DIRS.slice().sort(() => Math.random() - 0.5);
                for (const [dr, dc] of shuffled) {
                    const nr = r + dr, nc = c + dc;
                    const key = `${nr},${nc}`;
                    if (nr < 0 || nr >= gridRows || nc < 0 || nc >= gridCols) continue;
                    if (visited.has(key) || placed[key]) continue;
                    path.push({r: nr, c: nc});
                    visited.add(key);
                    if (dfs(depth + 1)) return true;
                    path.pop();
                    visited.delete(key);
                }
                return false;
            };

            if (dfs(1)) {
                path.forEach((pos, i) => {
                    letterGrid[pos.r][pos.c] = word[i];
                    placed[`${pos.r},${pos.c}`] = true;
                });
                wordPlaced = true;
            }
        }
    }

    // Fill empty cells with random Arabic letters
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    for (let r = 0; r < gridRows; r++)
        for (let c = 0; c < gridCols; c++)
            if (!letterGrid[r][c])
                letterGrid[r][c] = ARABIC[Math.floor(Math.random() * ARABIC.length)];
}

function renderStandardGrid() {
    const grid = $('letterGrid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = letterGrid[r][c];
            cell.dataset.r = r;
            cell.dataset.c = c;
            grid.appendChild(cell);
        }
    }
}

function renderWordSlots() {
    const container = $('targetWordsContainer');
    if (!container) return;
    container.innerHTML = '';
    targetWords.forEach(tw => {
        const slot = document.createElement('div');
        slot.className = `word-slot${tw.found ? ' found' : ''}`;
        if (tw.found) {
            slot.textContent = tw.word;
            slot.style.background = tw.color;
        } else {
            slot.textContent = '؟'.repeat(tw.word.length);
        }
        container.appendChild(slot);
    });
}

// ---- Grid interaction (Mode 1 & 2): select adjacent cells ----

function setupGridEvents() {
    const grid = $('letterGrid');

    const getCell = e => {
        // Works for both mouse and touch
        let el = e.target;
        if (!el.classList.contains('grid-cell')) return null;
        return { r: +el.dataset.r, c: +el.dataset.c };
    };

    const getTouchCell = e => {
        const touch = e.touches[0] || e.changedTouches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!el || !el.classList.contains('grid-cell')) return null;
        return { r: +el.dataset.r, c: +el.dataset.c };
    };

    const startSelect = (r, c) => {
        if (usedCells[r]?.[c]) return;
        isSelecting = true;
        selPath = [{ r, c }];
        currentColor = null; // assigned on first valid move
        highlightPath();
    };

    const moveSelect = (r, c) => {
        if (!isSelecting) return;
        if (usedCells[r]?.[c]) return;
        const last = selPath[selPath.length - 1];
        const prevIdx = selPath.findIndex(p => p.r === r && p.c === c);

        if (prevIdx !== -1 && prevIdx === selPath.length - 2) {
            // Backtrack
            selPath.pop();
        } else if (prevIdx === -1 && isAdjacent(last.r, last.c, r, c)) {
            selPath.push({ r, c });
        }
        highlightPath();
    };

    const endSelect = () => {
        if (!isSelecting) return;
        isSelecting = false;
        const word = selPath.map(p => letterGrid[p.r][p.c]).join('');
        checkWord(word, selPath);
        clearHighlights();
        selPath = [];
    };

    // Mouse
    grid.addEventListener('mousedown', e => { const p = getCell(e); if (p) { e.preventDefault(); startSelect(p.r, p.c); } });
    grid.addEventListener('mouseover', e => { const p = getCell(e); if (p) moveSelect(p.r, p.c); });
    window.addEventListener('mouseup', endSelect);

    // Touch
    grid.addEventListener('touchstart', e => { e.preventDefault(); const p = getTouchCell(e); if (p) startSelect(p.r, p.c); }, { passive: false });
    grid.addEventListener('touchmove', e => { e.preventDefault(); const p = getTouchCell(e); if (p) moveSelect(p.r, p.c); }, { passive: false });
    grid.addEventListener('touchend', endSelect);
}

function isAdjacent(r1, c1, r2, c2) {
    return (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) && !(r1 === r2 && c1 === c2);
}

function highlightPath() {
    clearHighlights();
    // Figure out if this path starts a known word
    if (!currentColor) {
        const partialWord = selPath.map(p => letterGrid[p.r][p.c]).join('');
        const match = targetWords.find(tw => !tw.found && tw.word.startsWith(partialWord));
        if (match) currentColor = match.color;
        else currentColor = '#e67e22';
    }
    selPath.forEach(p => {
        const cell = document.querySelector(`.grid-cell[data-r="${p.r}"][data-c="${p.c}"]`);
        if (cell) { cell.style.background = currentColor; cell.style.color = '#fff'; }
    });
}

function clearHighlights() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        const r = +cell.dataset.r, c = +cell.dataset.c;
        if (!usedCells[r]?.[c]) { cell.style.background = ''; cell.style.color = ''; }
    });
}

function checkWord(word, path) {
    const target = targetWords.find(tw => tw.word === word && !tw.found);
    if (!target) {
        if (word.length > 1) showToast('❌ ليست كلمة صحيحة');
        return;
    }
    target.found = true;
    path.forEach(p => {
        usedCells[p.r][p.c] = true;
        const cell = document.querySelector(`.grid-cell[data-r="${p.r}"][data-c="${p.c}"]`);
        if (cell) { cell.style.background = target.color; cell.style.color = '#fff'; cell.classList.add('used'); }
    });
    playerCoins += 3;
    saveCoins(playerCoins);
    updateCoins();
    renderWordSlots();
    showToast(`✅ ${target.word}`);
    if (targetWords.every(t => t.found)) setTimeout(showCompletion, 600);
}

// ==================== MODE 3: Multi-Image Word-Search ====================

function initMode3() {
    const d = levelData;
    targetWords = d.words.map((w, i) => ({ word: w, found: false, color: WORD_COLORS[i % WORD_COLORS.length] }));

    // Render image grid (2 rows × 4 cols)
    const imgSec = $('multiImagesSection');
    imgSec.style.gridTemplateColumns = 'repeat(4, 1fr)';
    d.images.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'multi-img-item';
        item.dataset.idx = i;
        // If it looks like an emoji use it as text, else as <img>
        if (/\p{Emoji}/u.test(img)) {
            item.textContent = img;
        } else {
            const el = document.createElement('img');
            el.src = img;
            el.onerror = () => { item.textContent = '🖼️'; };
            item.appendChild(el);
        }
        imgSec.appendChild(item);
    });

    // Build word-search grid using CSP (horizontal, vertical, diagonal)
    const gs = d.gridSize || { rows: 8, cols: 8 };
    wsGrid = buildWordSearchGrid(d.words, gs.rows, gs.cols);
    wsUsed = Array(gs.rows).fill(null).map(() => Array(gs.cols).fill(false));
    renderWordSearchGrid(gs.rows, gs.cols);
    setupWordSearchEvents(gs.rows, gs.cols);
}

function buildWordSearchGrid(words, rows, cols) {
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(''));

    const DIRS = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    // Constraint Satisfaction: place each word with backtracking
    const placed = []; // [{word, r, c, dr, dc}]

    const placeWord = (word) => {
        // Shuffle dirs and starting positions
        const dirs = DIRS.slice().sort(() => Math.random() - 0.5);
        for (let tries = 0; tries < 150; tries++) {
            const dr = dirs[tries % dirs.length][0];
            const dc = dirs[tries % dirs.length][1];
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);

            // Check if word fits
            let fits = true;
            const cells = [];
            for (let i = 0; i < word.length; i++) {
                const nr = r + i * dr, nc = c + i * dc;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) { fits = false; break; }
                if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { fits = false; break; }
                cells.push({ r: nr, c: nc });
            }
            if (!fits) continue;

            cells.forEach((pos, i) => { grid[pos.r][pos.c] = word[i]; });
            placed.push({ word, r, c, dr, dc });
            return true;
        }
        return false;
    };

    // Sort words longest first (helps CSP)
    const sorted = [...words].sort((a, b) => b.length - a.length);
    sorted.forEach(w => placeWord(w));

    // Fill remaining with random Arabic
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (!grid[r][c]) grid[r][c] = ARABIC[Math.floor(Math.random() * ARABIC.length)];

    return grid;
}

function renderWordSearchGrid(rows, cols) {
    const gridEl = $('wordsearchGrid');
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.textContent = wsGrid[r][c];
            cell.dataset.r = r;
            cell.dataset.c = c;
            gridEl.appendChild(cell);
        }
    }
}

function setupWordSearchEvents(rows, cols) {
    const gridEl = $('wordsearchGrid');
    let wsStart = null;

    const getCellFromPoint = (x, y) => {
        const el = document.elementFromPoint(x, y);
        if (!el || !el.classList.contains('ws-cell')) return null;
        return { r: +el.dataset.r, c: +el.dataset.c };
    };

    const startSel = (r, c) => {
        wsSelecting = true;
        wsStart = { r, c };
        wsSelPath = [{ r, c }];
        highlightWsPath();
    };

    const moveSel = (r, c) => {
        if (!wsSelecting || !wsStart) return;
        // Constrain to same row, col, or diagonal
        const dr = r - wsStart.r, dc = c - wsStart.c;
        const absDr = Math.abs(dr), absDc = Math.abs(dc);
        if (!(dr === 0 || dc === 0 || absDr === absDc)) return;

        const steps = Math.max(absDr, absDc);
        const stepR = steps === 0 ? 0 : dr / steps;
        const stepC = steps === 0 ? 0 : dc / steps;

        wsSelPath = [];
        for (let i = 0; i <= steps; i++) {
            wsSelPath.push({ r: wsStart.r + i * stepR, c: wsStart.c + i * stepC });
        }
        highlightWsPath();
    };

    const endSel = () => {
        if (!wsSelecting) return;
        wsSelecting = false;
        const word = wsSelPath.map(p => wsGrid[p.r][p.c]).join('');
        checkWsWord(word, wsSelPath);
        clearWsHighlights();
        wsSelPath = [];
        wsStart = null;
    };

    gridEl.addEventListener('mousedown', e => { const p = getCellFromPoint(e.clientX, e.clientY); if (p) { e.preventDefault(); startSel(p.r, p.c); } });
    gridEl.addEventListener('mouseover', e => { const p = getCellFromPoint(e.clientX, e.clientY); if (p && wsSelecting) moveSel(p.r, p.c); });
    window.addEventListener('mouseup', endSel);

    gridEl.addEventListener('touchstart', e => { e.preventDefault(); const t = e.touches[0]; const p = getCellFromPoint(t.clientX, t.clientY); if (p) startSel(p.r, p.c); }, { passive: false });
    gridEl.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0]; const p = getCellFromPoint(t.clientX, t.clientY); if (p) moveSel(p.r, p.c); }, { passive: false });
    gridEl.addEventListener('touchend', endSel);
}

function highlightWsPath() {
    clearWsHighlights();
    wsSelPath.forEach(p => {
        const cell = document.querySelector(`.ws-cell[data-r="${p.r}"][data-c="${p.c}"]`);
        if (cell) cell.classList.add('selecting');
    });
}

function clearWsHighlights() {
    document.querySelectorAll('.ws-cell.selecting').forEach(c => c.classList.remove('selecting'));
}

function checkWsWord(word, path) {
    const target = targetWords.find(tw => (tw.word === word || tw.word === [...word].reverse().join('')) && !tw.found);
    if (!target) { if (word.length > 1) showToast('❌ ليست كلمة صحيحة'); return; }

    target.found = true;
    const matchedWord = target.word;
    const idx = levelData.words.indexOf(matchedWord);

    // Mark found on image
    if (idx !== -1) {
        const imgItem = document.querySelector(`.multi-img-item[data-idx="${idx}"]`);
        if (imgItem) imgItem.classList.add('found');
    }

    // Color the path
    path.forEach(p => {
        const cell = document.querySelector(`.ws-cell[data-r="${p.r}"][data-c="${p.c}"]`);
        if (cell) {
            cell.style.background = target.color + '80';
            cell.style.color = '#fff';
            cell.classList.add('found-word');
        }
    });

    playerCoins += 3;
    saveCoins(playerCoins);
    updateCoins();
    showToast(`✅ ${matchedWord}`);
    if (targetWords.every(t => t.found)) setTimeout(showCompletion, 700);
}

// ==================== MODE 4: Crossword ====================

function initMode4() {
    cwWords = levelData.crosswordWords;
    const rows = levelData.gridRows, cols = levelData.gridCols;
    cwGrid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    cwFoundFlags = cwWords.map(() => false);
    cwActiveWordIdx = null;
    cwAnswer = [];

    // Fill cwGrid
    cwWords.forEach((wInfo, wIdx) => {
        const { word, row, col, dir } = wInfo;
        for (let i = 0; i < word.length; i++) {
            const r = dir === 'h' ? row : row + i;
            const c = dir === 'h' ? col + i : col;
            cwGrid[r][c] = { letter: word[i], wordIdx: wIdx, posInWord: i };
        }
    });

    renderCwGrid(rows, cols);
    setupCwEvents();
}

function renderCwGrid(rows, cols) {
    const sec = $('crosswordGridSection');
    sec.innerHTML = '';

    const gridDiv = document.createElement('div');
    gridDiv.className = 'crossword-main-grid';
    gridDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.dataset.r = r;
            cell.dataset.c = c;
            const data = cwGrid[r][c];
            if (data) {
                cell.className = 'cw-cell';
                cell.textContent = ''; // hidden until solved
            } else {
                cell.className = 'cw-cell empty';
            }
            gridDiv.appendChild(cell);
        }
    }
    sec.appendChild(gridDiv);
}

function setupCwEvents() {
    document.querySelectorAll('.cw-cell:not(.empty)').forEach(cell => {
        cell.addEventListener('click', () => {
            const r = +cell.dataset.r, c = +cell.dataset.c;
            const data = cwGrid[r][c];
            if (!data) return;
            const wIdx = data.wordIdx;
            if (cwFoundFlags[wIdx]) return;
            cwActiveWordIdx = wIdx;
            cwAnswer = [];
            showCwClue(wIdx);
            highlightCwWord(wIdx);
        });
    });
}

function highlightCwWord(wIdx) {
    document.querySelectorAll('.cw-cell').forEach(c => c.classList.remove('active-word'));
    const wInfo = cwWords[wIdx];
    for (let i = 0; i < wInfo.word.length; i++) {
        const r = wInfo.dir === 'h' ? wInfo.row : wInfo.row + i;
        const c = wInfo.dir === 'h' ? wInfo.col + i : wInfo.col;
        const cell = document.querySelector(`.cw-cell[data-r="${r}"][data-c="${c}"]`);
        if (cell) cell.classList.add('active-word');
    }
}

function showCwClue(wIdx) {
    const clueArea = $('crosswordClueArea');
    const clueImg  = $('clueImage');
    const miniWrap = $('miniGridWrapper');
    clueArea.style.display = 'flex';

    const wInfo = cwWords[wIdx];
    clueImg.textContent = wInfo.clue || '❓';

    // Build mini grid (word length + 4 extra letters = 2 rows × ceil((len+4)/2) cols)
    const word = wInfo.word;
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const extras = 4;
    const allLetters = [...word.split('')];
    while (allLetters.length < word.length + extras) {
        allLetters.push(ARABIC[Math.floor(Math.random() * ARABIC.length)]);
    }
    // Shuffle
    miniLetters = allLetters.sort(() => Math.random() - 0.5);

    const miniCols = Math.ceil(miniLetters.length / 2);

    miniWrap.innerHTML = '';

    // Answer row
    const answerRow = document.createElement('div');
    answerRow.className = 'answer-row';
    answerRow.id = 'answerRow';
    for (let i = 0; i < word.length; i++) {
        const box = document.createElement('div');
        box.className = 'answer-box';
        box.dataset.pos = i;
        answerRow.appendChild(box);
    }
    miniWrap.appendChild(answerRow);

    // Mini letter grid
    const miniGrid = document.createElement('div');
    miniGrid.className = 'mini-letter-grid';
    miniGrid.style.gridTemplateColumns = `repeat(${miniCols}, 1fr)`;
    miniLetters.forEach((l, i) => {
        const cell = document.createElement('div');
        cell.className = 'mini-cell';
        cell.textContent = l;
        cell.dataset.i = i;
        cell.addEventListener('click', () => onMiniCellClick(i, cell));
        miniGrid.appendChild(cell);
    });
    miniWrap.appendChild(miniGrid);

    // Confirm button
    const btn = document.createElement('button');
    btn.className = 'confirm-word-btn';
    btn.textContent = 'تأكيد';
    btn.addEventListener('click', confirmCwWord);
    miniWrap.appendChild(btn);
}

let cwPickedIndices = [];

function onMiniCellClick(i, cell) {
    if (cwPickedIndices.includes(i)) {
        // Deselect
        cwPickedIndices = cwPickedIndices.filter(x => x !== i);
        cell.classList.remove('selected');
    } else {
        const word = cwWords[cwActiveWordIdx].word;
        if (cwPickedIndices.length >= word.length) return;
        cwPickedIndices.push(i);
        cell.classList.add('selected');
    }
    // Update answer row
    const answerRow = $('answerRow');
    if (!answerRow) return;
    [...answerRow.children].forEach((box, pos) => {
        if (cwPickedIndices[pos] !== undefined) {
            box.textContent = miniLetters[cwPickedIndices[pos]];
            box.classList.add('filled');
        } else {
            box.textContent = '';
            box.classList.remove('filled');
        }
    });
}

function confirmCwWord() {
    if (cwActiveWordIdx === null) return;
    const wInfo = cwWords[cwActiveWordIdx];
    const attempted = cwPickedIndices.map(i => miniLetters[i]).join('');

    if (attempted !== wInfo.word) {
        // Wrong — flash red
        document.querySelectorAll('.answer-box.filled').forEach(b => {
            b.style.background = '#e74c3c';
            b.style.borderColor = '#c0392b';
        });
        setTimeout(() => {
            document.querySelectorAll('.answer-box.filled').forEach(b => {
                b.style.background = '';
                b.style.borderColor = '';
            });
        }, 700);
        showToast('❌ إجابة خاطئة، حاول مرة أخرى');
        // Reset picks
        cwPickedIndices = [];
        document.querySelectorAll('.mini-cell.selected').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('.answer-box').forEach(b => { b.textContent = ''; b.classList.remove('filled'); });
        return;
    }

    // Correct!
    cwFoundFlags[cwActiveWordIdx] = true;
    playerCoins += 3;
    saveCoins(playerCoins);
    updateCoins();

    // Mark answer row gold
    document.querySelectorAll('.answer-box').forEach(b => { b.classList.add('filled-correct'); b.style.background = '#d4ac0d'; });

    // Mark crossword cells as completed
    for (let i = 0; i < wInfo.word.length; i++) {
        const r = wInfo.dir === 'h' ? wInfo.row : wInfo.row + i;
        const c = wInfo.dir === 'h' ? wInfo.col + i : wInfo.col;
        const cell = document.querySelector(`.cw-cell[data-r="${r}"][data-c="${c}"]`);
        if (cell) { cell.classList.add('completed'); cell.textContent = wInfo.word[i]; }
    }

    showToast(`✅ ${wInfo.word}`);

    // Hide clue after short delay
    setTimeout(() => {
        $('crosswordClueArea').style.display = 'none';
        cwActiveWordIdx = null;
        cwPickedIndices = [];
    }, 900);

    if (cwFoundFlags.every(Boolean)) setTimeout(showCompletion, 1000);
}

// ==================== HINTS ====================

function setupHintButtons() {
    $('hintLetterBtn').addEventListener('click', hintLetter);
    $('hintWordBtn').addEventListener('click', hintWord);
}

function hintLetter() {
    if (playerCoins < 10) { showToast('💰 لا تملك كوينز كافية'); return; }
    if (currentMode === 4) { showToast('التلميح غير متاح هنا'); return; }
    playerCoins -= 10;
    saveCoins(playerCoins);
    updateCoins();

    if (currentMode <= 2) {
        // Flash a random unfound letter
        const cells = [];
        for (let r = 0; r < gridRows; r++)
            for (let c = 0; c < gridCols; c++)
                if (!usedCells[r][c]) cells.push({ r, c });
        if (!cells.length) return;
        const pick = cells[Math.floor(Math.random() * cells.length)];
        const el = document.querySelector(`.grid-cell[data-r="${pick.r}"][data-c="${pick.c}"]`);
        if (el) { el.classList.add('hint-flash'); setTimeout(() => el.classList.remove('hint-flash'), 700); }
    } else if (currentMode === 3) {
        // Flash a random ws cell from an unfound word
        const unfound = targetWords.filter(t => !t.found);
        if (!unfound.length) return;
        const target = unfound[Math.floor(Math.random() * unfound.length)];
        const idx = levelData.words.indexOf(target.word);
        if (idx < 0) return;
        const wInfo = levelData;
        // Just flash a random cell with the first char
        const firstChar = target.word[0];
        const candidates = [];
        for (let r = 0; r < wsGrid.length; r++)
            for (let c = 0; c < wsGrid[r].length; c++)
                if (wsGrid[r][c] === firstChar) candidates.push({ r, c });
        if (!candidates.length) return;
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        const el = document.querySelector(`.ws-cell[data-r="${pick.r}"][data-c="${pick.c}"]`);
        if (el) { el.style.background = '#f1c40f'; el.style.color = '#1e3c72'; setTimeout(() => { el.style.background = ''; el.style.color = ''; }, 800); }
    }
}

function hintWord() {
    if (playerCoins < 20) { showToast('💰 لا تملك كوينز كافية'); return; }
    if (currentMode === 4) { showToast('التلميح غير متاح هنا'); return; }
    playerCoins -= 20;
    saveCoins(playerCoins);
    updateCoins();

    const unfound = targetWords.find(t => !t.found);
    if (!unfound) return;

    if (currentMode <= 2) {
        // Use A* to find path and highlight
        const path = findWordPath(unfound.word, letterGrid, usedCells);
        if (path) {
            path.forEach(p => {
                const el = document.querySelector(`.grid-cell[data-r="${p.r}"][data-c="${p.c}"]`);
                if (el) { el.style.background = unfound.color + 'aa'; el.style.color = '#fff'; }
            });
            setTimeout(clearHighlights, 1000);
        }
    }
}

// A* path finder
function findWordPath(word, grid, used) {
    const rows = grid.length, cols = grid[0].length;
    for (let sr = 0; sr < rows; sr++) {
        for (let sc = 0; sc < cols; sc++) {
            if (grid[sr][sc] !== word[0] || used[sr][sc]) continue;
            const path = [{r:sr, c:sc}];
            const vis = new Set([`${sr},${sc}`]);
            const dfs = depth => {
                if (depth === word.length) return true;
                const {r, c} = path[path.length - 1];
                const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
                for (const [dr, dc] of dirs) {
                    const nr = r + dr, nc = c + dc;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                    if (vis.has(`${nr},${nc}`) || used[nr][nc]) continue;
                    if (grid[nr][nc] !== word[depth]) continue;
                    path.push({r:nr, c:nc}); vis.add(`${nr},${nc}`);
                    if (dfs(depth + 1)) return true;
                    path.pop(); vis.delete(`${nr},${nc}`);
                }
                return false;
            };
            if (dfs(1)) return path;
        }
    }
    return null;
}

// ==================== NAV & COMPLETION ====================

function setupNavButtons() {
    $('backToMapBtn').addEventListener('click', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s';
        setTimeout(() => location.href = 'map.html', 250);
    });
    $('nextLevelBtn').addEventListener('click', () => {
        const next = currentLevel.id + 1;
        unlockNextLevel(currentLevel.id);
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (next <= 100) location.href = `game.html?level=${next}`;
            else location.href = 'map.html';
        }, 250);
    });
}

function showCompletion() {
    const modal = $('completionModal');
    modal.classList.add('show');
    $('earnedCoins').textContent = '3';
    unlockNextLevel(currentLevel.id);
}

// ==================== UTILS ====================

function updateCoins() {
    $('coinAmount').textContent = playerCoins;
}

let toastTimer = null;
function showToast(msg, duration = 1800) {
    if (toastTimer) clearTimeout(toastTimer);
    const toast = $('messageToast');
    $('toastMessage').textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}
