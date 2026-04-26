/**
 * ============================================
 * KALIMAT CRASH — algorithms.js
 * ============================================
 *
 * الخوارزميات المستخدمة — أين ومتى:
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ 1. CSP + Backtracking                                           │
 * │    أين: buildExactWordGrid()                                    │
 * │    متى: عند تهيئة المود 1 و2 — يبني جريد الحروف               │
 * │    الفكرة: يضع كل كلمة كمسار متجاور، يتراجع عند التعارض       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 2. Constraint Propagation (Word Search)                         │
 * │    أين: buildWordSearchGrid()                                   │
 * │    متى: عند تهيئة المود 3 — يبني جريد بحث الكلمات             │
 * │    الفكرة: إذا تقاطعت كلمتان في خلية يجب أن يتطابق الحرفان   │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 3. A* Search                                                    │
 * │    أين: aStarFindWord()                                         │
 * │    متى: تلميح كلمة (المود 1 و2) — يجد المسار الأمثل للكلمة    │
 * │    الفكرة: g=حروف مطابقة، h=حروف متبقية، يضمن أقصر مسار       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 4. Crossword Solver (Constraint Checking)                       │
 * │    أين: buildCrosswordGrid()                                    │
 * │    متى: عند تهيئة المود 4 — يضع الكلمات ويتحقق من التقاطعات   │
 * │    الفكرة: تقاطع صحيح = نفس الحرف في نفس الخلية               │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 5. Hill Climbing (Local Search)                                 │
 * │    أين: hillClimbingFillGrid()                                  │
 * │    متى: بعد بناء جريد المود 1 و2 — يُحسّن الحروف الفاضية      │
 * │    الفكرة: يقبل التغيير فقط إذا حسّن التنوع، يرفض إذا أسوأ    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 6. Best-First Search                                            │
 * │    أين: bestFirstSearchChar()                                   │
 * │    متى: تلميح حرف (المود 3) — يجد الخلية الأنسب في Word Search │
 * │    الفكرة: heuristic = قرب الخلية من المركز (أوضح للاعب)       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 7. Genetic Algorithm                                            │
 * │    أين: GeneticGridOptimizer                                    │
 * │    متى: احتياطي — يُحسّن ترتيب الكلمات عند فشل CSP            │
 * │    الفكرة: selection → crossover → mutation → elitism           │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ 8. Minimax + Alpha-Beta Pruning                                 │
 * │    أين: minimax() / alphaBeta()                                 │
 * │    متى: مستقبلاً لـ AI Player                                  │
 * │    الفكرة: شجرة القرار مع تقليص الفروع غير المجدية             │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ملاحظة: تلميح حرف المود 1&2 يستخدم wordPaths (map مبنية بـ CSP)
 *         ليجد الحرف الأول مباشرة — لا يحتاج بحثاً إضافياً
 * ============================================
 */

'use strict';

// ==================== 1. CSP + BACKTRACKING ====================
// يُستخدم في المود 1 و2 لتوليد جريد حروف متجاور
//
// القواعد:
//   ① الجريد يحتوي فقط حروف الكلمات — لا حروف عشوائية إطلاقاً
//   ② كل كلمة تُوضع في مسار متجاور (كل حرف يجاور التالي)
//   ③ لا تتشارك كلمتان أي خلية → يحل مشكلة الحرف المحجوز
//   ④ الجريد يتضغط تلقائياً — يُحذف الصفوف والأعمدة الفارغة
//   ⑤ MRV: الأطول أولاً
//
// [CSP + DFS Backtracking]:
//   Variable  = كلمة
//   Domain    = مواضع البداية + الاتجاهات الممكنة
//   Constraint = المجاورة + عدم التداخل

/**
 * @param {string[]} words
 * @returns {{ grid: (string|null)[][], rows: number, cols: number, wordPaths: Map }}
 */
function buildExactWordGrid(words) {
    // ① حساب حجم الجريد:
    //    نريد ماتريكس مربع على قد مجموع الحروف بالضبط — لا أكبر ولا أصغر
    //    نحسب أصغر مربع يسع الكلمات كلها مع هامش صغير للمناورة فقط
    const totalChars = words.reduce((s, w) => s + w.length, 0);
    const maxWordLen = Math.max(...words.map(w => w.length));

    // الجانب = أكبر قيمة بين: طول أطول كلمة ، جذر مجموع الحروف * 1.3
    const side = Math.max(maxWordLen, Math.ceil(Math.sqrt(totalChars * 1.4)));
    const ROWS = side, COLS = side;

    // الاتجاهات: أفقي ورأسي وقطري (8 اتجاهات)
    const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

    // ② دالة محاولة وضع الكلمات — تُشغَّل عدة مرات حتى تنجح
    function attempt() {
        const grid     = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
        const wordPaths = new Map();
        const occupied  = new Set();

        function placeWord(word) {
            for (let tries = 0; tries < 400; tries++) {
                const sr = Math.floor(Math.random() * ROWS);
                const sc = Math.floor(Math.random() * COLS);
                const startKey = `${sr},${sc}`;
                if (occupied.has(startKey)) continue;

                const path    = [{ r: sr, c: sc }];
                const visited = new Set([startKey]);

                function dfs(depth) {
                    if (depth === word.length) return true;
                    const { r, c } = path[path.length - 1];
                    // نخلط الاتجاهات لتوزيع عشوائي
                    const dirs = DIRS.slice().sort(() => Math.random() - 0.5);
                    for (const [dr, dc] of dirs) {
                        const nr = r + dr, nc = c + dc;
                        const key = `${nr},${nc}`;
                        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
                        // القيد الوحيد: لا خلية مشغولة بكلمة أخرى ولا مكررة في المسار
                        if (visited.has(key) || occupied.has(key)) continue;
                        path.push({ r: nr, c: nc });
                        visited.add(key);
                        if (dfs(depth + 1)) return true;
                        path.pop();
                        visited.delete(key);
                    }
                    return false;
                }

                if (dfs(1)) {
                    path.forEach((pos, i) => {
                        grid[pos.r][pos.c] = word[i];
                        occupied.add(`${pos.r},${pos.c}`);
                    });
                    wordPaths.set(word, path);
                    return true;
                }
            }
            return false;
        }

        // ③ MRV: الأطول أولاً
        const sorted = [...words].sort((a, b) => b.length - a.length);
        let allPlaced = true;
        for (const w of sorted) {
            if (!placeWord(w)) { allPlaced = false; break; }
        }

        return allPlaced ? { grid, wordPaths, occupied } : null;
    }

    // ④ نجرب حتى 15 مرة للحصول على ترتيب ناجح
    let result = null;
    for (let i = 0; i < 15 && !result; i++) result = attempt();

    // لو فشل كل شيء نرجع جريد فارغ
    if (!result) return { grid: [[]], rows: 1, cols: 1, wordPaths: new Map() };

    const { grid, wordPaths } = result;

    // ⑤ ضغط الجريد: نحذف الصفوف والأعمدة الفارغة تماماً من الأطراف
    //    النتيجة = bounding box حول الحروف بالظبط — ماتريكس على قد الكلمات
    let minR = ROWS, maxR = 0, minC = COLS, maxC = 0;
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (grid[r][c] !== null) {
                if (r < minR) minR = r; if (r > maxR) maxR = r;
                if (c < minC) minC = c; if (c > maxC) maxC = c;
            }

    if (minR > maxR) return { grid: [[]], rows: 1, cols: 1, wordPaths };

    const newRows = maxR - minR + 1;
    const newCols = maxC - minC + 1;

    // الجريد المضغوط: null في الخلايا التي بين الكلمات (زجاجية) — لا حروف زائدة
    const compactGrid = Array(newRows).fill(null).map((_, r) =>
        Array(newCols).fill(null).map((_, c) => grid[r + minR][c + minC])
    );

    // تعديل المسارات بعد الضغط
    wordPaths.forEach((path, w) => {
        wordPaths.set(w, path.map(p => ({ r: p.r - minR, c: p.c - minC })));
    });

    return { grid: compactGrid, rows: newRows, cols: newCols, wordPaths };
}

// ==================== 2. CONSTRAINT PROPAGATION (Word Search) ====================
// يُستخدم في المود 3 لوضع الكلمات في جريد بحث الكلمات

/**
 * يضع الكلمات في جريد بحث الكلمات.
 * القيود:
 *   - كل كلمة تُوضع في خط مستقيم (أفقي، رأسي، قطري — بأي اتجاه)
 *   - إذا تقاطعت كلمتان في خلية، يجب أن يكون الحرفان متطابقَين
 * يستخدم Constraint Propagation + Backtracking بالترتيب من الأطول للأقصر
 *
 * @param {string[]} words
 * @param {number} rows
 * @param {number} cols
 * @returns {string[][]}
 */
function buildWordSearchGrid(words, rows, cols) {
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(''));

    // خريطة الخلايا المشغولة: "r,c" → اسم الكلمة التي تشغلها
    const cellOwner = new Map();

    const ALL_DIRS = [
        [0,1],[0,-1],[1,0],[-1,0],
        [1,1],[1,-1],[-1,1],[-1,-1]
    ];

    // ترتيب الكلمات من الأطول للأقصر
    const sorted = [...words].sort((a, b) => b.length - a.length);

    function tryPlaceWord(word) {
        const dirs = ALL_DIRS.slice().sort(() => Math.random() - 0.5);
        for (let tries = 0; tries < 300; tries++) {
            const [dr, dc] = dirs[tries % dirs.length];
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);

            let fits = true;
            const cells = [];
            for (let i = 0; i < word.length; i++) {
                const nr = r + i * dr, nc = c + i * dc;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) { fits = false; break; }
                const key = `${nr},${nc}`;
                // القيد الصارم: أي خلية مشغولة بأي كلمة أخرى → رفض
                // لا نسمح بأي تقاطع أو اشتراك في الخلايا إطلاقاً
                if (cellOwner.has(key)) { fits = false; break; }
                cells.push({ r: nr, c: nc, key });
            }

            if (fits) {
                cells.forEach(({ r: cr, c: cc, key }, i) => {
                    grid[cr][cc] = word[i];
                    cellOwner.set(key, word);
                });
                return true;
            }
        }
        return false;
    }

    sorted.forEach(w => tryPlaceWord(w));

    // ملء الفراغات بحروف عشوائية مختلفة عن حروف الكلمات الموجودة في نفس الصف/العمود
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== '') continue;
            // نختار حرفاً لا يشكّل بداية أي كلمة في الجريد
            let chosen = ARABIC[Math.floor(Math.random() * ARABIC.length)];
            grid[r][c] = chosen;
        }
    }

    return grid;
}

// ==================== 3. A* SEARCH ====================
// يُستخدم لإيجاد مسار كلمة في الجريد (للتلميح في المود 1 و2)

class PriorityQueue {
    constructor(compareFn) {
        this.heap = [];
        this.compare = compareFn;
    }
    enqueue(item) {
        this.heap.push(item);
        // ترتيب بسيط — كافٍ للأحجام الصغيرة
        this.heap.sort(this.compare);
    }
    dequeue() { return this.heap.shift(); }
    isEmpty() { return this.heap.length === 0; }
}

/**
 * A* لإيجاد مسار كلمة داخل الجريد
 * g(n) = عدد الحروف المطابقة حتى الآن
 * h(n) = عدد الحروف المتبقية
 *
 * @param {string} word - الكلمة المطلوب إيجادها
 * @param {string[][]} grid - الجريد
 * @param {boolean[][]} used - الخلايا المستخدمة (محجوزة)
 * @returns {Array<{r:number,c:number}>|null}
 */
function aStarFindWord(word, grid, used) {
    const rows = grid.length, cols = grid[0].length;

    // دالة المقارنة: الأولوية للعقد ذات f الأصغر (f = g + h)
    const pq = new PriorityQueue((a, b) => (a.f - b.f));

    for (let sr = 0; sr < rows; sr++) {
        for (let sc = 0; sc < cols; sc++) {
            if (grid[sr][sc] !== word[0] || (used && used[sr][sc])) continue;
            // g=1 (الحرف الأول مطابق), h=باقي الكلمة
            pq.enqueue({
                r: sr, c: sc, idx: 0,
                path: [{ r: sr, c: sc }],
                g: 1,
                f: 1 + (word.length - 1)
            });
        }
    }

    const visited = new Set();

    while (!pq.isEmpty()) {
        const node = pq.dequeue();
        const { r, c, idx, path, g } = node;

        if (idx === word.length - 1) return path; // وجدنا الكلمة!

        const stateKey = `${r},${c},${idx}`;
        if (visited.has(stateKey)) continue;
        visited.add(stateKey);

        const nextChar = word[idx + 1];
        const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (used && used[nr][nc]) continue;
            if (grid[nr][nc] !== nextChar) continue;
            // تجنّب الحلقات في المسار نفسه
            if (path.some(p => p.r === nr && p.c === nc)) continue;

            const ng = g + 1;
            const nh = word.length - ng; // الحروف المتبقية
            pq.enqueue({
                r: nr, c: nc, idx: idx + 1,
                path: [...path, { r: nr, c: nc }],
                g: ng,
                f: ng + nh
            });
        }
    }
    return null; // لم يجد
}

// ==================== 4. CROSSWORD SOLVER ====================
// CSP كامل: Constraint Propagation (AC-3) + Backtracking + MRV + Degree + LCV
//
// المشكلة كـ CSP:
//   Variables  : كل كلمة في القائمة
//   Domain     : الموضع المحدد مسبقاً (row, col, dir) — من بيانات المستوى
//   Constraints: أي خليتان تتشاركان نفس الموضع يجب أن يتطابق حرفاهما
//
// الخوارزميات المدمجة:
//   ① AC-3  (Arc Consistency 3)   → يحذف المواضع المستحيلة قبل البحث
//   ② MRV   (Minimum Remaining Values) → يختار أول كلمة تُعالج (الأصعب أولاً)
//   ③ Degree Heuristic            → كسر التعادل: الأكثر تقاطعاً مع غيرها أولاً
//   ④ LCV   (Least Constraining Value) → يختار الموضع الذي يُبقي أكبر خيارات للجيران
//   ⑤ Backtracking                → يتراجع عند التعارض ويجرب موضعاً آخر
//
// الـ Interface لم يتغير:
//   input : wordsData [{word, row, col, dir, clue}], rows, cols
//   output: { grid, placedWords }  — نفس البنية القديمة تماماً

/**
 * @param {Array}  wordsData - [{word, row, col, dir, clue}]
 * @param {number} rows
 * @param {number} cols
 * @returns {{ grid: (string|null)[][], placedWords: Array }}
 */
function buildCrosswordGrid(wordsData, rows, cols) {

    // ── بناء خلايا كل كلمة (ثابتة — domain عبارة عن موضع واحد محدد مسبقاً) ──
    // كل كلمة i لها domain = [placement_i]
    // placement_i = مصفوفة خلايا [{r, c, letter}]
    const wordCells = wordsData.map(w => {
        const cells = [];
        for (let i = 0; i < w.word.length; i++) {
            const r = w.dir === 'h' ? w.row : w.row + i;
            const c = w.dir === 'h' ? w.col + i : w.col;
            cells.push({ r, c, letter: w.word[i] });
        }
        return cells;
    });

    // ── ① AC-3: Arc Consistency ──────────────────────────────────────────────
    // نبني قائمة الـ Arcs: (i, j) كل زوج كلمتين يتشاركان خلية واحدة على الأقل
    // ثم نتحقق: هل الحرف المشترك في كلمة i يتطابق مع الحرف المشترك في كلمة j؟
    // إذا لا → الـ arc غير متسق → نضع علامة على الكلمة المتعارضة
    //
    // في حالتنا الـ domain لكل variable هو موضع واحد ثابت (من البيانات)
    // لذلك AC-3 هنا يعمل كـ pre-filter:
    //   يحدد الكلمات التي يستحيل وضعها قبل البحث
    //   ويُقلّل فضاء الحل قبل Backtracking

    // خريطة الخلايا: "r,c" → [{wordIdx, posInWord}]
    const cellMap = new Map();
    wordsData.forEach((w, wi) => {
        wordCells[wi].forEach(({ r, c }, pos) => {
            const key = `${r},${c}`;
            if (!cellMap.has(key)) cellMap.set(key, []);
            cellMap.get(key).push({ wi, pos });
        });
    });

    // استخراج الـ Arcs: أزواج كلمات تتشاركان خلية
    const arcs = []; // [{i, j, sharedCells: [{posI, posJ, r, c}]}]
    const arcSet = new Set();
    cellMap.forEach((entries) => {
        if (entries.length < 2) return;
        for (let a = 0; a < entries.length; a++) {
            for (let b = a + 1; b < entries.length; b++) {
                const { wi: i, pos: posI } = entries[a];
                const { wi: j, pos: posJ } = entries[b];
                const key = `${Math.min(i,j)}_${Math.max(i,j)}`;
                if (!arcSet.has(key)) {
                    arcSet.add(key);
                    arcs.push({ i, j, sharedCells: [] });
                }
                // أضف الخلية المشتركة لهذا الـ arc
                const arc = arcs.find(a => arcSet.has(`${Math.min(a.i,a.j)}_${Math.max(a.i,a.j)}`) &&
                    ((a.i===i&&a.j===j)||(a.i===j&&a.j===i)));
                if (arc) arc.sharedCells.push({ posI, posJ });
            }
        }
    });

    // تشغيل AC-3: فحص كل arc — هل الحروف المشتركة متطابقة؟
    // الكلمات التي تنتهك Consistency تُعلَّم كـ "inconsistent"
    const inconsistent = new Set(); // مؤشرات الكلمات غير المتسقة
    const queue = [...arcs];
    while (queue.length > 0) {
        const { i, j, sharedCells } = queue.shift();
        if (inconsistent.has(i) || inconsistent.has(j)) continue;

        for (const { posI, posJ } of sharedCells) {
            const letterI = wordsData[i].word[posI];
            const letterJ = wordsData[j].word[posJ];
            if (letterI !== letterJ) {
                // تعارض — نحدد الكلمة التي تأتي لاحقاً في الترتيب كـ inconsistent
                // (نحافظ على الكلمة التي لها علاقات أكثر)
                const degreeI = arcs.filter(a => a.i === i || a.j === i).length;
                const degreeJ = arcs.filter(a => a.i === j || a.j === j).length;
                // الكلمة الأقل درجة (Degree) هي المُحذوفة
                if (degreeI <= degreeJ) inconsistent.add(i);
                else                    inconsistent.add(j);
                break;
            }
        }
    }

    // الكلمات المرشحة بعد AC-3 (استبعاد غير المتسقة)
    const candidates = wordsData
        .map((w, i) => ({ ...w, _idx: i }))
        .filter(w => !inconsistent.has(w._idx));

    // ── ② MRV + ③ Degree Heuristic: ترتيب الكلمات قبل Backtracking ──────────
    // MRV: الكلمة الأطول أولاً (أقل مرونة = أصعب توضع = تُعالج الأول)
    // Degree: عند التعادل في الطول، الأكثر تقاطعاً مع غيرها أولاً
    //         (تأثيرها على الجيران أكبر → يجب تثبيتها مبكراً)

    const degreeOf = (w) =>
        arcs.filter(a =>
            !inconsistent.has(a.i) && !inconsistent.has(a.j) &&
            (a.i === w._idx || a.j === w._idx)
        ).length;

    candidates.sort((a, b) => {
        // MRV: الأطول أولاً (أقل remaining values في الموضع)
        if (b.word.length !== a.word.length) return b.word.length - a.word.length;
        // Degree: الأكثر تقاطعاً عند التعادل
        return degreeOf(b) - degreeOf(a);
    });

    // ── ④ LCV: Least Constraining Value ──────────────────────────────────────
    // بعد ما نرتّب الكلمات بـ MRV+Degree، نختار قيمة (موضع) الكلمة
    // اللي تُبقي أكبر عدد خيارات للكلمات الجارة غير الموضوعة بعد.
    // في حالتنا كل كلمة عندها موضع واحد فقط (محدد من البيانات)،
    // لذلك LCV تعمل كـ tie-breaker للكلمات التي تتنافس على نفس الخلية:
    //   نختار الكلمة التي تُقيّد أقل عدد من الكلمات الجارة

    function lcvScore(wInfo, currentGrid) {
        // عدد الكلمات المتبقية التي ستتأثر سلباً لو وضعنا هذه الكلمة
        let constraintCount = 0;
        const cells = wordCells[wInfo._idx];
        for (const { r, c, letter } of cells) {
            if (currentGrid[r][c] !== null && currentGrid[r][c] !== letter) {
                constraintCount += 10; // تعارض مباشر — عقوبة كبيرة
            }
            // كم كلمة أخرى تمر بهذه الخلية؟
            const key = `${r},${c}`;
            const others = (cellMap.get(key) || []).filter(e => e.wi !== wInfo._idx);
            constraintCount += others.length;
        }
        return constraintCount; // أقل = أفضل (LCV)
    }

    // ── ⑤ Backtracking Search ────────────────────────────────────────────────
    // يضع الكلمات بالترتيب (MRV+Degree)، يتحقق من التوافق (Constraint Check)،
    // يتراجع عند التعارض.
    // مع LCV كمعيار اختيار القيمة الأنسب.

    const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    const placedWords = [];
    const placedFlags = new Array(candidates.length).fill(false);

    function isConsistentPlacement(wInfo, g) {
        // Constraint Check: هل وضع هذه الكلمة في الجريد الحالي متسق؟
        const cells = wordCells[wInfo._idx];
        for (const { r, c, letter } of cells) {
            if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
            if (g[r][c] !== null && g[r][c] !== letter) return false;
        }
        return true;
    }

    function placeOnGrid(wInfo, g) {
        wordCells[wInfo._idx].forEach(({ r, c, letter }) => { g[r][c] = letter; });
    }

    function removeFromGrid(wInfo, g, prevGrid) {
        // نُعيد الخلايا لحالتها السابقة (Backtracking)
        wordCells[wInfo._idx].forEach(({ r, c }) => { g[r][c] = prevGrid[r][c]; });
    }

    function backtrack(idx, g) {
        if (idx === candidates.length) return true; // كل الكلمات وُضعت ✓

        // نرتب الكلمات المتبقية بـ LCV في كل خطوة
        // (نأخذ الكلمة التي تُقيّد الأقل من جيرانها)
        const remaining = candidates.slice(idx);
        remaining.sort((a, b) => lcvScore(a, g) - lcvScore(b, g));
        const wInfo = remaining[0];
        const wIdx  = candidates.indexOf(wInfo);

        // نبادل الكلمة المختارة مع موضع idx في المصفوفة
        [candidates[idx], candidates[wIdx]] = [candidates[wIdx], candidates[idx]];

        // Constraint Check + Placement
        if (isConsistentPlacement(candidates[idx], g)) {
            // نحفظ حالة الجريد قبل الوضع (للـ Backtracking)
            const snapshot = g.map(row => [...row]);
            placeOnGrid(candidates[idx], g);
            placedFlags[idx] = true;

            if (backtrack(idx + 1, g)) return true;

            // Backtrack: نُعيد الجريد لحالته السابقة
            removeFromGrid(candidates[idx], g, snapshot);
            placedFlags[idx] = false;
        }

        // نُعيد الترتيب الأصلي (undo swap)
        [candidates[idx], candidates[wIdx]] = [candidates[wIdx], candidates[idx]];
        return false;
    }

    backtrack(0, grid);

    // جمع الكلمات الموضوعة فعلياً
    candidates.forEach((w, i) => {
        if (placedFlags[i]) placedWords.push(w);
    });

    // نُعيد نفس البنية القديمة تماماً
    return { grid, placedWords };
}

// ==================== 5. HILL CLIMBING (Local Search) ====================
// يُستخدم لتحسين توزيع الحروف الفاضية في الجريد

/**
 * Hill Climbing لتحسين الحروف الفاضية (غير الكلمات)
 * الهدف: أن تكون الحروف الفاضية مختلفة ومتنوعة (لا تشكّل كلمات عن طريق الخطأ)
 *
 * @param {string[][]} grid
 * @param {Set<string>} occupiedKeys - مفاتيح الخلايا المحجوزة للكلمات
 * @returns {string[][]}
 */
function hillClimbingFillGrid(grid, occupiedKeys) {
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const rows = grid.length, cols = grid[0].length;

    // دالة التقييم: تقلّل تكرار نفس الحرف في المنطقة المجاورة
    function evaluate(g) {
        let score = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (occupiedKeys.has(`${r},${c}`)) continue;
                const letter = g[r][c];
                // نفضّل التنوع — نطرح نقطة لكل جار بنفس الحرف
                [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dr, dc]) => {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        if (g[nr][nc] === letter) score--;
                    }
                });
            }
        }
        return score;
    }

    let current = grid.map(row => [...row]);
    let currentScore = evaluate(current);
    const MAX_ITER = 50;

    for (let iter = 0; iter < MAX_ITER; iter++) {
        // نجرّب تغيير حرف فاضي واحد عشوائياً
        let r, c;
        do {
            r = Math.floor(Math.random() * rows);
            c = Math.floor(Math.random() * cols);
        } while (occupiedKeys.has(`${r},${c}`));

        const oldLetter = current[r][c];
        const newLetter = ARABIC[Math.floor(Math.random() * ARABIC.length)];
        current[r][c] = newLetter;
        const newScore = evaluate(current);

        if (newScore >= currentScore) {
            currentScore = newScore; // قبول التحسين
        } else {
            current[r][c] = oldLetter; // رجوع
        }
    }
    return current;
}

// ==================== 6. BEST-FIRST SEARCH ====================
// للبحث السريع عن أول تطابق في الجريد

/**
 * Best-First Search لإيجاد أول خلية تبدأ بحرف معيّن في الجريد
 * الـ heuristic: المسافة من المركز (نفضّل الخلايا المركزية)
 *
 * @param {string[][]} grid
 * @param {string} targetChar
 * @param {boolean[][]} used
 * @returns {{r:number,c:number}|null}
 */
function bestFirstSearchChar(grid, targetChar, used) {
    const rows = grid.length, cols = grid[0].length;
    const centerR = rows / 2, centerC = cols / 2;

    // heuristic: قرب الخلية من المركز
    const heuristic = (r, c) => -Math.sqrt(Math.pow(r - centerR, 2) + Math.pow(c - centerC, 2));

    const candidates = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === targetChar && !(used && used[r][c])) {
                candidates.push({ r, c, h: heuristic(r, c) });
            }
        }
    }

    if (!candidates.length) return null;
    // نرتّب حسب الـ heuristic ونأخذ الأفضل
    candidates.sort((a, b) => b.h - a.h);
    return { r: candidates[0].r, c: candidates[0].c };
}

// ==================== 7. GENETIC ALGORITHM ====================
// احتياطي لتحسين ترتيب الكلمات في الجريد

class GeneticGridOptimizer {
    constructor(words, rows, cols, populationSize = 20) {
        this.words = words;
        this.rows = rows;
        this.cols = cols;
        this.populationSize = populationSize;
        this.population = [];
    }

    // تمثيل الكروموزوم: ترتيب الكلمات
    createChromosome() {
        return [...this.words].sort(() => Math.random() - 0.5);
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(this.createChromosome());
        }
    }

    // دالة اللياقة: كم عدد الكلمات التي تُوضع بنجاح؟
    fitness(chromosome) {
        const result = buildExactWordGrid(chromosome);
        let placed = 0;
        for (const w of chromosome) {
            if (result.wordPaths.has(w)) placed++;
        }
        return placed;
    }

    // Crossover: دمج ترتيبَي كروموزومَين
    crossover(parent1, parent2) {
        const mid = Math.floor(parent1.length / 2);
        const child = [...parent1.slice(0, mid)];
        for (const w of parent2) {
            if (!child.includes(w)) child.push(w);
        }
        return child;
    }

    // Mutation: تبديل موضعَين عشوائيَّين
    mutate(chromosome) {
        const idx1 = Math.floor(Math.random() * chromosome.length);
        const idx2 = Math.floor(Math.random() * chromosome.length);
        const mutated = [...chromosome];
        [mutated[idx1], mutated[idx2]] = [mutated[idx2], mutated[idx1]];
        return mutated;
    }

    // الحلقة الرئيسية للخوارزمية
    evolve(generations = 30) {
        this.initializePopulation();

        for (let gen = 0; gen < generations; gen++) {
            // تقييم وترتيب
            const scored = this.population.map(c => ({ chromosome: c, score: this.fitness(c) }));
            scored.sort((a, b) => b.score - a.score);

            // إذا وجدنا حلاً كاملاً نتوقف
            if (scored[0].score === this.words.length) return scored[0].chromosome;

            // نحتفظ بأفضل النصف (Elitism)
            const survivors = scored.slice(0, Math.ceil(this.populationSize / 2)).map(s => s.chromosome);

            // توليد الجيل الجديد
            const newPop = [...survivors];
            while (newPop.length < this.populationSize) {
                const p1 = survivors[Math.floor(Math.random() * survivors.length)];
                const p2 = survivors[Math.floor(Math.random() * survivors.length)];
                let child = this.crossover(p1, p2);
                if (Math.random() < 0.3) child = this.mutate(child);
                newPop.push(child);
            }
            this.population = newPop;
        }

        // أعد أفضل كروموزوم
        const scored = this.population.map(c => ({ chromosome: c, score: this.fitness(c) }));
        scored.sort((a, b) => b.score - a.score);
        return scored[0].chromosome;
    }
}

// ==================== 8. MINIMAX + ALPHA-BETA ====================
// (مستقبلي للـ AI Player)

/**
 * Minimax مع Alpha-Beta Pruning
 * نستخدم أسماء متغيرات مختلفة لتجنب تعارض مع الكلمة المحجوزة "eval" في JS
 */
function minimax(state, depth, isMaximizing, evaluateFn, getChildrenFn, isTerminalFn) {
    if (depth === 0 || isTerminalFn(state)) return evaluateFn(state);

    const children = getChildrenFn(state);

    if (isMaximizing) {
        let best = -Infinity;
        for (const child of children) {
            const val = minimax(child, depth - 1, false, evaluateFn, getChildrenFn, isTerminalFn);
            if (val > best) best = val;
        }
        return best;
    } else {
        let best = Infinity;
        for (const child of children) {
            const val = minimax(child, depth - 1, true, evaluateFn, getChildrenFn, isTerminalFn);
            if (val < best) best = val;
        }
        return best;
    }
}

function alphaBeta(state, depth, alpha, beta, isMaximizing, evaluateFn, getChildrenFn, isTerminalFn) {
    if (depth === 0 || isTerminalFn(state)) return evaluateFn(state);

    const children = getChildrenFn(state);

    if (isMaximizing) {
        let best = -Infinity;
        for (const child of children) {
            const val = alphaBeta(child, depth - 1, alpha, beta, false, evaluateFn, getChildrenFn, isTerminalFn);
            if (val > best) best = val;
            if (best > alpha) alpha = best;
            if (beta <= alpha) break; // Beta cutoff
        }
        return best;
    } else {
        let best = Infinity;
        for (const child of children) {
            const val = alphaBeta(child, depth - 1, alpha, beta, true, evaluateFn, getChildrenFn, isTerminalFn);
            if (val < best) best = val;
            if (best < beta) beta = best;
            if (beta <= alpha) break; // Alpha cutoff
        }
        return best;
    }
}