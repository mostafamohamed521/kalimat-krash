// ============================================
// KALIMAT CRASH — game-engine.js
// محرك اللعبة الكامل — 4 مودات
// ============================================

document.addEventListener('DOMContentLoaded', initGame);

// ==================== GLOBALS ====================
let currentLevel, levelData, currentMode;
let playerCoins = 100;
let targetWords = []; // [{word, found, color, path}]

// Mode 1 & 2
let gridRows = 5, gridCols = 5;
let letterGrid = []; // 2D array of chars
let usedCells = [];  // 2D bool
let wordPaths = new Map(); // word → [{r,c}]
let isSelecting = false;
let selPath = [];
let currentColor = null;

// Mode 3
let wsGrid = [];
let wsUsed = [];
let wsSelecting = false;
let wsSelPath = [];
let wsStart = null;

// Mode 4
let cwWords = [];
let cwGrid = [];       // 2D: {letter, wordIndices:[]} | null
let cwFoundFlags = [];
let cwActiveWordIdx = null;
let miniLetters = [];
let cwPickedIndices = [];

const WORD_COLORS = ['#e67e22','#2980b9','#8e44ad','#c0392b','#1abc9c','#d35400','#27ae60','#f39c12'];
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

    $('standardModeArea').style.display = (currentMode <= 2) ? 'flex' : 'none';
    $('multiModeArea').style.display    = (currentMode === 3) ? 'flex' : 'none';
    $('crosswordModeArea').style.display = (currentMode === 4) ? 'flex' : 'none';

    if      (currentMode === 1) initMode1();
    else if (currentMode === 2) initMode2();
    else if (currentMode === 3) initMode3();
    else                        initMode4();

    setupHintButtons();
    setupNavButtons();

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s';
    requestAnimationFrame(() => setTimeout(() => document.body.style.opacity = '1', 50));
}

// ==================== MODE 1: صورة + كلمات ====================

function initMode1() {
    const wrap = $('imageWrapper');
    const img = document.createElement('img');
    img.src = levelData.image;
    img.className = 'level-image';
    img.onerror = () => { img.style.display = 'none'; };
    wrap.appendChild(img);

    targetWords = levelData.words.map((w, i) => ({
        word: w, found: false, color: WORD_COLORS[i % WORD_COLORS.length]
    }));

    renderWordSlots();
    buildAndRenderStandardGrid(levelData.words);
    setupGridEvents();
}

// ==================== MODE 2: أمثال مصرية ====================

function initMode2() {
    const wrap = $('imageWrapper');
    wrap.classList.add('emoji-mode');
    const container = document.createElement('div');
    container.className = 'emoji-container';
    container.textContent = levelData.emojis.join('  ');
    wrap.appendChild(container);

    targetWords = levelData.words.map((w, i) => ({
        word: w, found: false, color: WORD_COLORS[i % WORD_COLORS.length]
    }));

    renderWordSlots();
    buildAndRenderStandardGrid(levelData.words);
    setupGridEvents();
}

// ---- بناء الجريد (المود 1 و2) بدقة بناءً على الكلمات فقط ----
function buildAndRenderStandardGrid(words) {
    const result = buildExactWordGrid(words);
    gridRows = result.rows;
    gridCols = result.cols;
    letterGrid = result.grid;
    wordPaths  = result.wordPaths;
    usedCells  = Array(gridRows).fill(null).map(() => Array(gridCols).fill(false));

    // Hill Climbing: يملأ الخلايا الفاضية بحروف عشوائية متنوعة
    const occupiedKeys = new Set();
    wordPaths.forEach(path => path.forEach(p => occupiedKeys.add(`${p.r},${p.c}`)));
    const improved = hillClimbingFillGrid(letterGrid, occupiedKeys);
    for (let r = 0; r < gridRows; r++)
        for (let c = 0; c < gridCols; c++)
            if (!occupiedKeys.has(`${r},${c}`)) letterGrid[r][c] = improved[r][c];

    renderStandardGrid();
}

function renderStandardGrid() {
    const grid = $('letterGrid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = letterGrid[r][c] || '';
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
            slot.style.color = '#fff';
        } else {
            slot.textContent = '؟'.repeat(tw.word.length);
        }
        container.appendChild(slot);
    });
}

// ---- أحداث الجريد (المود 1 و2) ----
function setupGridEvents() {
    const grid = $('letterGrid');

    const getCellFromEl = el => {
        if (!el || !el.classList.contains('grid-cell')) return null;
        return { r: +el.dataset.r, c: +el.dataset.c };
    };
    const getCellFromTouch = e => {
        const t = e.touches[0] || e.changedTouches[0];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        return getCellFromEl(el);
    };

    const startSelect = (r, c) => {
        if (usedCells[r]?.[c]) return;
        isSelecting = true;
        selPath = [{ r, c }];
        currentColor = null;
        highlightPath();
    };

    const moveSelect = (r, c) => {
        if (!isSelecting) return;
        if (usedCells[r]?.[c]) return;
        const last = selPath[selPath.length - 1];
        const prevIdx = selPath.findIndex(p => p.r === r && p.c === c);

        if (prevIdx !== -1 && prevIdx === selPath.length - 2) {
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

    grid.addEventListener('mousedown', e => { const p = getCellFromEl(e.target); if (p) { e.preventDefault(); startSelect(p.r, p.c); } });
    grid.addEventListener('mouseover', e => { const p = getCellFromEl(e.target); if (p) moveSelect(p.r, p.c); });
    window.addEventListener('mouseup', endSelect);

    grid.addEventListener('touchstart', e => { e.preventDefault(); const p = getCellFromTouch(e); if (p) startSelect(p.r, p.c); }, { passive: false });
    grid.addEventListener('touchmove',  e => { e.preventDefault(); const p = getCellFromTouch(e); if (p) moveSelect(p.r, p.c); }, { passive: false });
    grid.addEventListener('touchend',   endSelect);
}

function isAdjacent(r1, c1, r2, c2) {
    return (Math.abs(r1-r2) <= 1 && Math.abs(c1-c2) <= 1) && !(r1===r2 && c1===c2);
}

function highlightPath() {
    clearHighlights();
    if (!currentColor) {
        const partialWord = selPath.map(p => letterGrid[p.r][p.c]).join('');
        const match = targetWords.find(tw => !tw.found && tw.word.startsWith(partialWord));
        currentColor = match ? match.color : '#95a5a6';
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

// ==================== MODE 3: صور متعددة + بحث كلمات ====================

function initMode3() {
    const d = levelData;
    targetWords = d.words.map((w, i) => ({
        word: w, found: false, color: WORD_COLORS[i % WORD_COLORS.length]
    }));

    const imgSec = $('multiImagesSection');
    imgSec.style.gridTemplateColumns = 'repeat(4, 1fr)';
    d.images.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'multi-img-item';
        item.dataset.idx = i;
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

    const gs = d.gridSize || { rows: 8, cols: 8 };
    // نستخدم Constraint Propagation من algorithms.js
    wsGrid = buildWordSearchGrid(d.words, gs.rows, gs.cols);
    wsUsed = Array(gs.rows).fill(null).map(() => Array(gs.cols).fill(false));
    renderWordSearchGrid(gs.rows, gs.cols);
    setupWordSearchEvents(gs.rows, gs.cols);
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
    gridEl.addEventListener('touchmove',  e => { e.preventDefault(); const t = e.touches[0]; const p = getCellFromPoint(t.clientX, t.clientY); if (p) moveSel(p.r, p.c); }, { passive: false });
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
    const reversed = [...word].reverse().join('');
    const target = targetWords.find(tw =>
        (tw.word === word || tw.word === reversed) && !tw.found
    );
    if (!target) { if (word.length > 1) showToast('❌ ليست كلمة صحيحة'); return; }

    target.found = true;
    const idx = levelData.words.indexOf(target.word);
    if (idx !== -1) {
        const imgItem = document.querySelector(`.multi-img-item[data-idx="${idx}"]`);
        if (imgItem) imgItem.classList.add('found');
    }

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
    showToast(`✅ ${target.word}`);
    if (targetWords.every(t => t.found)) setTimeout(showCompletion, 700);
}

// ==================== MODE 4: كلمات متقاطعة ====================
// المنطق الكامل:
// 1) نبني الجريد من بيانات المستوى — كل خلية فيها حرف أو null
// 2) نعرض الجريد: الخلايا التي فيها حرف تظهر فارغة (مربع معتم)
//    إلا إذا كانت نقطة تقاطع محلولة — فتظهر الحرف مباشرة
// 3) اللاعب ينقر على خلية → نختار الكلمة التي تمر بها → تُضاء
//    وتنفتح لوحة الحروف أسفل الجريد
// 4) اللاعب يختار الحروف بالترتيب → تأكيد → إن صح تظهر الحروف في الجريد
// 5) الحروف المتشاركة بين كلمتين تظهر تلقائياً عند حل إحداهما
// 6) إذا خلية متقاطعة وكلتا الكلمتين محلولتان ← الحرف يبقى ظاهراً

// ---- متغيرات المود 4 ----
// cwWords      : [{word, clue, row, col, dir}]
// cwGrid       : 2D — الحرف الصحيح أو null (فراغ)
// cwReveal     : 2D boolean — هل الخلية مكشوفة للمشاهد
// cwFoundFlags : boolean[]
// cwActiveWordIdx, miniLetters, cwPickedIndices  (معرّفة في globals)

let cwReveal = [];   // 2D: true = الحرف ظاهر في الجريد
let cwMinR = 0, cwMinC = 0; // إزاحة الجريد المضغوط

function initMode4() {
    const raw  = levelData.crosswordWords;
    const rows = levelData.gridRows;
    const cols = levelData.gridCols;

    // بناء الجريد مع التحقق من التقاطعات
    const { grid, placedWords } = buildCrosswordGrid(raw, rows, cols);

    cwWords      = placedWords;
    cwGrid       = grid;
    cwFoundFlags = cwWords.map(() => false);
    cwActiveWordIdx = null;
    cwPickedIndices = [];

    if (cwWords.length === 0) {
        $('crosswordGridSection').innerHTML =
            '<p style="color:#fff;text-align:center;padding:20px">❌ لا توجد كلمات في هذا المستوى</p>';
        return;
    }

    // حساب حدود الجريد الفعلية (نضغط الفراغات الزائدة)
    cwMinR = rows; cwMinC = cols;
    let maxR = 0,  maxC  = 0;
    cwWords.forEach(({ word, row, col, dir }) => {
        const eR = dir === 'h' ? row          : row + word.length - 1;
        const eC = dir === 'h' ? col + word.length - 1 : col;
        if (row  < cwMinR) cwMinR = row;
        if (col  < cwMinC) cwMinC = col;
        if (eR   > maxR)   maxR   = eR;
        if (eC   > maxC)   maxC   = eC;
    });

    // مصفوفة الكشف — كل الخلايا مخفية في البداية
    cwReveal = Array(rows).fill(null).map(() => Array(cols).fill(false));

    renderCwGrid(cwMinR, cwMinC, maxR, maxC);
    setupCwEvents();
}

// ---- رسم الجريد ----
function renderCwGrid(minR, minC, maxR, maxC) {
    const sec = $('crosswordGridSection');
    sec.innerHTML = '';

    const usedRows = maxR - minR + 1;
    const usedCols = maxC - minC + 1;

    const wrap = document.createElement('div');
    wrap.className = 'cw-board';
    wrap.style.gridTemplateColumns = `repeat(${usedCols}, 1fr)`;
    wrap.style.gridTemplateRows    = `repeat(${usedRows}, 1fr)`;

    for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
            const cell = document.createElement('div');
            cell.dataset.r = r;
            cell.dataset.c = c;

            const letter = cwGrid[r] !== undefined ? cwGrid[r][c] : null;

            if (letter === null || letter === undefined) {
                // فراغ — لا خلية
                cell.className = 'cw-void';
            } else {
                cell.className = 'cw-cell';

                // رقم الكلمة التي تبدأ هنا
                const starterIdx = cwWords.findIndex(w => w.row === r && w.col === c);
                if (starterIdx !== -1) {
                    const numEl = document.createElement('span');
                    numEl.className = 'cw-num';
                    numEl.textContent = starterIdx + 1;
                    cell.appendChild(numEl);
                }

                // محتوى الخلية: إما مكشوف أو مخفي
                const letterEl = document.createElement('span');
                letterEl.className = 'cw-letter';
                if (cwReveal[r][c]) {
                    letterEl.textContent = letter;
                    cell.classList.add('revealed');
                } else {
                    letterEl.textContent = '';
                }
                cell.appendChild(letterEl);
            }

            wrap.appendChild(cell);
        }
    }

    sec.appendChild(wrap);
}

// ---- أحداث النقر على الجريد ----
function setupCwEvents() {
    $('crosswordGridSection').addEventListener('click', e => {
        const cell = e.target.closest('.cw-cell');
        if (!cell) return;

        const r = +cell.dataset.r;
        const c = +cell.dataset.c;

        // إيجاد الكلمة غير المحلولة التي تمر بهذه الخلية
        // إذا نقر مرة ثانية على نفس الخلية وفيها كلمتان → نبدّل بينهما
        const candidates = [];
        cwWords.forEach((wInfo, i) => {
            if (cwFoundFlags[i]) return;
            const cells = getCwWordCells(wInfo);
            if (cells.some(p => p.r === r && p.c === c)) candidates.push(i);
        });

        if (candidates.length === 0) return;

        // إذا كانت الكلمة النشطة في المرشحين → خذ التالية منهم (toggle)
        let nextIdx;
        if (cwActiveWordIdx !== null && candidates.includes(cwActiveWordIdx)) {
            const pos = candidates.indexOf(cwActiveWordIdx);
            nextIdx = candidates[(pos + 1) % candidates.length];
        } else {
            nextIdx = candidates[0];
        }

        cwActiveWordIdx = nextIdx;
        cwPickedIndices = [];
        highlightCwWord(cwActiveWordIdx);
        openCwPanel(cwActiveWordIdx);
    });
}

// ---- مساعد: إرجاع خلايا كلمة ----
function getCwWordCells(wInfo) {
    const cells = [];
    for (let i = 0; i < wInfo.word.length; i++) {
        cells.push({
            r: wInfo.dir === 'h' ? wInfo.row : wInfo.row + i,
            c: wInfo.dir === 'h' ? wInfo.col + i : wInfo.col
        });
    }
    return cells;
}

// ---- إضاءة الكلمة المختارة في الجريد ----
function highlightCwWord(wIdx) {
    // إزالة الإضاءة السابقة
    document.querySelectorAll('.cw-cell.cw-active').forEach(el => el.classList.remove('cw-active'));

    const wInfo = cwWords[wIdx];
    getCwWordCells(wInfo).forEach(({ r, c }) => {
        const el = document.querySelector(`.cw-cell[data-r="${r}"][data-c="${c}"]`);
        if (el && !el.classList.contains('cw-done')) el.classList.add('cw-active');
    });
}

// ---- فتح لوحة الإدخال لكلمة ----
function openCwPanel(wIdx) {
    const clueArea = $('crosswordClueArea');
    const clueImg  = $('clueImage');
    const miniWrap = $('miniGridWrapper');

    clueArea.style.display = 'flex';

    const wInfo = cwWords[wIdx];
    const word  = wInfo.word;

    // التلميح (إيموجي أو نص)
    clueImg.innerHTML = '';
    const clueEl = document.createElement('span');
    clueEl.className = 'cw-clue-icon';
    clueEl.textContent = wInfo.clue || '❓';
    const clueLabel = document.createElement('span');
    clueLabel.className = 'cw-clue-label';
    clueLabel.textContent = (wInfo.dir === 'h' ? '→ أفقي' : '↓ رأسي') + '  #' + (wIdx + 1);
    clueImg.appendChild(clueEl);
    clueImg.appendChild(clueLabel);

    // بناء حروف الاختيار: حروف الكلمة + حروف عشوائية زائدة
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const pool = [...word]; // حروف الكلمة
    const extraCount = Math.min(5, Math.max(3, word.length)); // حروف زائدة بحجم منطقي
    let attempts = 0;
    while (pool.length < word.length + extraCount && attempts < 200) {
        const ch = ARABIC[Math.floor(Math.random() * ARABIC.length)];
        if (!pool.includes(ch)) pool.push(ch);
        attempts++;
    }
    // خلط
    miniLetters = pool.sort(() => Math.random() - 0.5);

    miniWrap.innerHTML = '';

    // --- صف الإجابة ---
    const answerRow = document.createElement('div');
    answerRow.className = 'cw-answer-row';
    answerRow.id = 'cwAnswerRow';
    for (let i = 0; i < word.length; i++) {
        const box = document.createElement('div');
        box.className = 'cw-answer-box';
        box.dataset.pos = i;
        // إذا كان الحرف مكشوفاً بالفعل (تقاطع محلول) → نظهره ثابتاً
        const cells = getCwWordCells(wInfo);
        if (cwReveal[cells[i].r][cells[i].c]) {
            box.textContent = word[i];
            box.classList.add('cw-prefilled');
        }
        answerRow.appendChild(box);
    }
    miniWrap.appendChild(answerRow);

    // --- لوحة الحروف ---
    const letterBoard = document.createElement('div');
    letterBoard.className = 'cw-letter-board';
    const miniCols = Math.ceil(miniLetters.length / 2);
    letterBoard.style.gridTemplateColumns = `repeat(${miniCols}, 1fr)`;

    miniLetters.forEach((ch, i) => {
        const btn = document.createElement('div');
        btn.className = 'cw-letter-btn';
        btn.textContent = ch;
        btn.dataset.i   = i;
        btn.addEventListener('click', () => cwLetterPick(i, btn));
        letterBoard.appendChild(btn);
    });
    miniWrap.appendChild(letterBoard);

    // --- زر مسح الإجابة ---
    const clearBtn = document.createElement('button');
    clearBtn.className = 'cw-clear-btn';
    clearBtn.textContent = '✕ مسح';
    clearBtn.addEventListener('click', cwClearAnswer);
    miniWrap.appendChild(clearBtn);
}

// ---- اختيار حرف من اللوحة ----
function cwLetterPick(i, btn) {
    if (cwActiveWordIdx === null) return;
    const word = cwWords[cwActiveWordIdx].word;

    // لا تقبل أكثر من طول الكلمة ولا تكرار نفس الزر
    if (cwPickedIndices.includes(i)) return;

    // إيجاد أول خانة فارغة غير مملوءة مسبقاً
    const wInfo  = cwWords[cwActiveWordIdx];
    const wCells = getCwWordCells(wInfo);

    let targetPos = -1;
    for (let pos = 0; pos < word.length; pos++) {
        if (cwPickedIndices.length > pos) continue; // ممتلئة
        if (cwReveal[wCells[pos].r][wCells[pos].c]) continue; // مكشوفة مسبقاً (تقاطع)
        // هل تم ملء هذا الموضع في cwPickedIndices؟
        // cwPickedIndices[pos] = index في miniLetters
        if (cwPickedIndices[pos] !== undefined) continue;
        targetPos = pos;
        break;
    }

    // بناء قائمة المواضع الحرة (غير مكشوفة وغير مختارة)
    const freePositions = [];
    for (let pos = 0; pos < word.length; pos++) {
        if (cwReveal[wCells[pos].r][wCells[pos].c]) continue;
        if (cwPickedIndices[pos] !== undefined) continue;
        freePositions.push(pos);
    }

    if (freePositions.length === 0) return;
    const fillPos = freePositions[0];

    cwPickedIndices[fillPos] = i;
    btn.classList.add('cw-btn-used');

    // تحديث صف الإجابة
    refreshAnswerRow(wInfo, word, wCells);

    // إذا اكتمل المجموع → تحقق تلقائي
    const allFilled = isAnswerComplete(word, wCells);
    if (allFilled) setTimeout(confirmCwWord, 280);
}

function isAnswerComplete(word, wCells) {
    for (let pos = 0; pos < word.length; pos++) {
        if (cwReveal[wCells[pos].r][wCells[pos].c]) continue; // مكشوف تلقائياً
        if (cwPickedIndices[pos] === undefined) return false;
    }
    return true;
}

function refreshAnswerRow(wInfo, word, wCells) {
    const row = $('cwAnswerRow');
    if (!row) return;
    [...row.children].forEach((box, pos) => {
        if (box.classList.contains('cw-prefilled')) return; // ثابت
        if (cwPickedIndices[pos] !== undefined) {
            box.textContent = miniLetters[cwPickedIndices[pos]];
            box.classList.add('cw-box-filled');
        } else {
            box.textContent = '';
            box.classList.remove('cw-box-filled');
        }
    });
}

// ---- مسح الإجابة ----
function cwClearAnswer() {
    if (cwActiveWordIdx === null) return;
    cwPickedIndices = [];
    document.querySelectorAll('.cw-letter-btn').forEach(b => b.classList.remove('cw-btn-used'));
    const wInfo  = cwWords[cwActiveWordIdx];
    const wCells = getCwWordCells(wInfo);
    refreshAnswerRow(wInfo, wInfo.word, wCells);
}

// ---- تأكيد الإجابة ----
function confirmCwWord() {
    if (cwActiveWordIdx === null) return;
    const wInfo  = cwWords[cwActiveWordIdx];
    const word   = wInfo.word;
    const wCells = getCwWordCells(wInfo);

    // بناء الكلمة المُدخلة (مكشوفة مسبقاً + مختارة)
    let attempted = '';
    for (let pos = 0; pos < word.length; pos++) {
        if (cwReveal[wCells[pos].r][wCells[pos].c]) {
            attempted += cwGrid[wCells[pos].r][wCells[pos].c];
        } else if (cwPickedIndices[pos] !== undefined) {
            attempted += miniLetters[cwPickedIndices[pos]];
        } else {
            attempted += '?';
        }
    }

    if (attempted !== word) {
        // إجابة خاطئة — وميض أحمر
        const row = $('cwAnswerRow');
        if (row) {
            row.classList.add('cw-shake');
            [...row.children].forEach(b => {
                if (!b.classList.contains('cw-prefilled')) b.style.background = '#e74c3c44';
            });
            setTimeout(() => {
                row.classList.remove('cw-shake');
                [...row.children].forEach(b => { b.style.background = ''; });
            }, 650);
        }
        showToast('❌ إجابة خاطئة، حاول مرة أخرى');
        cwPickedIndices = [];
        document.querySelectorAll('.cw-letter-btn').forEach(b => b.classList.remove('cw-btn-used'));
        refreshAnswerRow(wInfo, word, wCells);
        return;
    }

    // ===== إجابة صحيحة =====
    cwFoundFlags[cwActiveWordIdx] = true;
    playerCoins += 3;
    saveCoins(playerCoins);
    updateCoins();

    // كشف حروف هذه الكلمة في cwReveal
    wCells.forEach(({ r, c }) => { cwReveal[r][c] = true; });

    // تحديث الجريد: ظهور الحروف + تلوين الكلمة المحلولة
    wCells.forEach(({ r, c }, pos) => {
        const el = document.querySelector(`.cw-cell[data-r="${r}"][data-c="${c}"]`);
        if (!el) return;
        el.classList.remove('cw-active');
        el.classList.add('cw-done');

        const letterEl = el.querySelector('.cw-letter');
        if (letterEl) {
            letterEl.textContent = cwGrid[r][c];
            // تأثير ظهور متتالي
            setTimeout(() => { el.classList.add('cw-reveal-anim'); }, pos * 80);
        }
    });

    showToast(`✅ ${word}`);

    // إخفاء اللوحة بعد لحظة
    setTimeout(() => {
        $('crosswordClueArea').style.display = 'none';
        cwActiveWordIdx = null;
        cwPickedIndices = [];
        document.querySelectorAll('.cw-cell.cw-active').forEach(el => el.classList.remove('cw-active'));
    }, 700);

    if (cwFoundFlags.every(Boolean)) setTimeout(showCompletion, 1000);
}

// ==================== تلميحات ====================
// تلميح حرف  (10 🪙): يكشف الحرف الأول من أول كلمة لم يجدها اللاعب بعد
//   - المود 1 & 2: يُضيء الخلية الأولى من مسار الكلمة في الجريد
//     [خوارزمية Best-First Search — تجد الخلية القريبة من المركز]
//   - المود 3: يُضيء الخلية التي تحتوي الحرف الأول في Word Search
//     [خوارزمية Best-First Search — تفضّل المواضع المركزية]
//   - المود 4: يضع الحرف الأول للكلمة غير المحلولة في صف الإجابة تلقائياً
//     (إن لم تكن كلمة مختارة → يختار أول كلمة غير محلولة أولاً)
//
// تلميح كلمة (20 🪙): يحل أول كلمة لم يجدها اللاعب بعد كاملاً
//   - المود 1 & 2: يُضيء المسار كاملاً ثم يحل الكلمة
//     [خوارزمية A* Search — تتبع المسار الأمثل]
//   - المود 3: يكشف مسار الكلمة كاملاً في Word Search بالتتبع المباشر
//   - المود 4: يختار أول كلمة غير محلولة ويملأها تلقائياً ويؤكدها

function setupHintButtons() {
    $('hintLetterBtn').addEventListener('click', hintLetter);
    $('hintWordBtn').addEventListener('click',   hintWord);
}

// ---- مساعد: إيجاد أول كلمة لم تُحل بعد (مشتركة بين المودات) ----
function getFirstUnfoundWord() {
    if (currentMode <= 2) return targetWords.find(t => !t.found) || null;
    if (currentMode === 3) return targetWords.find(t => !t.found) || null;
    if (currentMode === 4) {
        const idx = cwFoundFlags.findIndex(f => !f);
        return idx !== -1 ? { word: cwWords[idx].word, _cwIdx: idx } : null;
    }
    return null;
}

function hintLetter() {
    if (playerCoins < 10) { showToast('💰 لا تملك كوينز كافية'); return; }

    // ── المود 1 & 2 ──────────────────────────────────────────────
    if (currentMode <= 2) {
        // نجد أول كلمة لم تُحل
        const unfound = targetWords.find(t => !t.found);
        if (!unfound) { showToast('✨ أحسنت! كل الكلمات محلولة'); return; }

        // [Best-First Search]: نجد خلية الحرف الأول من مسار الكلمة
        const path = wordPaths.get(unfound.word);
        if (!path || path.length === 0) return;

        // الحرف الأول = path[0]
        const firstCell = path[0];
        const el = document.querySelector(`.grid-cell[data-r="${firstCell.r}"][data-c="${firstCell.c}"]`);
        if (!el) return;

        // خصم الكوينز بعد التحقق من وجود الكلمة
        playerCoins -= 10;
        saveCoins(playerCoins);
        updateCoins();

        // إضاءة الحرف الأول مع نبضة
        el.classList.add('hint-flash');
        el.style.background = unfound.color;
        el.style.color = '#fff';
        setTimeout(() => {
            el.classList.remove('hint-flash');
            if (!usedCells[firstCell.r][firstCell.c]) {
                el.style.background = '';
                el.style.color = '';
            }
        }, 1200);
        showToast(`💡 الحرف الأول من كلمة: "${unfound.word[0]}"`);

    // ── المود 3 ──────────────────────────────────────────────────
    } else if (currentMode === 3) {
        const unfound = targetWords.find(t => !t.found);
        if (!unfound) { showToast('✨ أحسنت! كل الكلمات محلولة'); return; }

        // [Best-First Search]: نجد خلية الحرف الأول للكلمة في الجريد
        const firstChar = unfound.word[0];
        const result = bestFirstSearchChar(wsGrid, firstChar, wsUsed);
        if (!result) return;

        playerCoins -= 10;
        saveCoins(playerCoins);
        updateCoins();

        const el = document.querySelector(`.ws-cell[data-r="${result.r}"][data-c="${result.c}"]`);
        if (el) {
            el.style.background = '#f1c40f';
            el.style.color = '#1e3c72';
            el.style.transform = 'scale(1.15)';
            setTimeout(() => {
                el.style.background = '';
                el.style.color = '';
                el.style.transform = '';
            }, 1200);
        }
        showToast(`💡 الحرف الأول من كلمة: "${firstChar}"`);

    // ── المود 4 ──────────────────────────────────────────────────
    } else if (currentMode === 4) {
        // نجد أول كلمة غير محلولة
        const unfoundIdx = cwFoundFlags.findIndex(f => !f);
        if (unfoundIdx === -1) { showToast('✨ أحسنت! كل الكلمات محلولة'); return; }

        playerCoins -= 10;
        saveCoins(playerCoins);
        updateCoins();

        // إذا لم تكن هذه الكلمة مختارة → نختارها أولاً
        if (cwActiveWordIdx !== unfoundIdx) {
            cwActiveWordIdx = unfoundIdx;
            cwPickedIndices = [];
            highlightCwWord(unfoundIdx);
            openCwPanel(unfoundIdx);
            // ننتظر قليلاً حتى تُبنى اللوحة ثم نضع الحرف الأول
            setTimeout(() => placeFirstLetterInPanel(unfoundIdx), 150);
        } else {
            placeFirstLetterInPanel(unfoundIdx);
        }
    }
}

// مساعد: يضع الحرف الأول للكلمة في لوحة الإدخال (للمود 4)
function placeFirstLetterInPanel(wIdx) {
    const wInfo  = cwWords[wIdx];
    const word   = wInfo.word;
    const wCells = getCwWordCells(wInfo);

    // نجد أول موضع فارغ (غير مكشوف وغير مختار)
    for (let pos = 0; pos < word.length; pos++) {
        if (cwReveal[wCells[pos].r][wCells[pos].c]) continue;
        if (cwPickedIndices[pos] !== undefined) continue;
        // الحرف الصحيح لهذا الموضع
        const ch = word[pos];
        // نجده في لوحة الحروف
        const pickedVals = Object.values(cwPickedIndices);
        const btnIdx = miniLetters.findIndex((l, i) => l === ch && !pickedVals.includes(i));
        if (btnIdx === -1) break;
        const btn = document.querySelector(`.cw-letter-btn[data-i="${btnIdx}"]`);
        if (btn) cwLetterPick(btnIdx, btn);
        showToast(`💡 الحرف الأول: "${ch}"`);
        break;
    }
}

function hintWord() {
    if (playerCoins < 20) { showToast('💰 لا تملك كوينز كافية'); return; }

    // ── المود 1 & 2 ──────────────────────────────────────────────
    if (currentMode <= 2) {
        const unfound = targetWords.find(t => !t.found);
        if (!unfound) { showToast('✨ أحسنت! كل الكلمات محلولة'); return; }

        playerCoins -= 20;
        saveCoins(playerCoins);
        updateCoins();

        // [A* Search]: نجد المسار الكامل للكلمة في الجريد
        const path = aStarFindWord(unfound.word, letterGrid, usedCells);
        if (path) {
            // نضيء المسار أولاً
            path.forEach(p => {
                const el = document.querySelector(`.grid-cell[data-r="${p.r}"][data-c="${p.c}"]`);
                if (el) { el.style.background = unfound.color; el.style.color = '#fff'; }
            });
            // ثم نحله بعد لحظة
            setTimeout(() => checkWord(unfound.word, path), 900);
        } else {
            showToast('❌ تعذّر إيجاد مسار الكلمة');
        }

    // ── المود 3 ──────────────────────────────────────────────────
    } else if (currentMode === 3) {
        const unfound = targetWords.find(t => !t.found);
        if (!unfound) { showToast('✨ أحسنت! كل الكلمات محلولة'); return; }

        playerCoins -= 20;
        saveCoins(playerCoins);
        updateCoins();

        // نبحث عن مسار الكلمة في wsGrid بالاتجاهات الثمانية
        const rows = wsGrid.length, cols = wsGrid[0].length;
        const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
        let foundPath = null;

        outer:
        for (let r = 0; r < rows && !foundPath; r++) {
            for (let c = 0; c < cols && !foundPath; c++) {
                if (wsGrid[r][c] !== unfound.word[0]) continue;
                for (const [dr, dc] of DIRS) {
                    let ok = true;
                    const cells = [];
                    for (let i = 0; i < unfound.word.length; i++) {
                        const nr = r + i * dr, nc = c + i * dc;
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) { ok = false; break; }
                        if (wsGrid[nr][nc] !== unfound.word[i]) { ok = false; break; }
                        cells.push({ r: nr, c: nc });
                    }
                    if (ok) { foundPath = cells; break outer; }
                }
            }
        }

        if (foundPath) {
            checkWsWord(unfound.word, foundPath);
        } else {
            showToast('❌ تعذّر إيجاد الكلمة');
        }

    // ── المود 4 ──────────────────────────────────────────────────
    } else if (currentMode === 4) {
        const unfoundIdx = cwFoundFlags.findIndex(f => !f);
        if (unfoundIdx === -1) { showToast('✨ أحسنت! كل الكلمات محلولة'); return; }

        playerCoins -= 20;
        saveCoins(playerCoins);
        updateCoins();

        // إذا لم تكن الكلمة مختارة → نختارها وننتظر بناء اللوحة
        if (cwActiveWordIdx !== unfoundIdx) {
            cwActiveWordIdx = unfoundIdx;
            cwPickedIndices = [];
            highlightCwWord(unfoundIdx);
            openCwPanel(unfoundIdx);
            setTimeout(() => solveActiveCwWord(), 200);
        } else {
            solveActiveCwWord();
        }
    }
}

// مساعد: يحل الكلمة النشطة كاملاً في المود 4
function solveActiveCwWord() {
    if (cwActiveWordIdx === null) return;
    const wInfo  = cwWords[cwActiveWordIdx];
    const word   = wInfo.word;
    const wCells = getCwWordCells(wInfo);

    cwPickedIndices = [];
    document.querySelectorAll('.cw-letter-btn').forEach(b => b.classList.remove('cw-btn-used'));

    for (let pos = 0; pos < word.length; pos++) {
        if (cwReveal[wCells[pos].r][wCells[pos].c]) continue;
        const ch = word[pos];
        const pickedVals = Object.values(cwPickedIndices);
        const btnIdx = miniLetters.findIndex((l, i) => l === ch && !pickedVals.includes(i));
        if (btnIdx !== -1) {
            cwPickedIndices[pos] = btnIdx;
            const btn = document.querySelector(`.cw-letter-btn[data-i="${btnIdx}"]`);
            if (btn) btn.classList.add('cw-btn-used');
        }
    }

    refreshAnswerRow(wInfo, word, wCells);
    setTimeout(confirmCwWord, 350);
}

// ==================== التنقل والإنجاز ====================

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
            location.href = next <= 100 ? `game.html?level=${next}` : 'map.html';
        }, 250);
    });
}

function showCompletion() {
    const modal = $('completionModal');
    modal.classList.add('show');
    $('earnedCoins').textContent = '3';
    unlockNextLevel(currentLevel.id);
    playerCoins += 3;
    saveCoins(playerCoins);
    updateCoins();
}

// ==================== أدوات مساعدة ====================

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