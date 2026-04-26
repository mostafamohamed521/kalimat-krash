'use strict';


/**
 * @param {string[]} words
 * @returns {{ grid: (string|null)[][], rows: number, cols: number, wordPaths: Map }}
 */
function buildExactWordGrid(words) {
   
    const totalChars = words.reduce((s, w) => s + w.length, 0);
    const maxWordLen = Math.max(...words.map(w => w.length));

    const side = Math.max(maxWordLen, Math.ceil(Math.sqrt(totalChars * 1.4)));
    const ROWS = side, COLS = side;

    const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

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

                    const dirs = DIRS.slice().sort(() => Math.random() - 0.5);
                    for (const [dr, dc] of dirs) {
                        const nr = r + dr, nc = c + dc;
                        const key = `${nr},${nc}`;
                        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;

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

        const sorted = [...words].sort((a, b) => b.length - a.length);
        let allPlaced = true;
        for (const w of sorted) {
            if (!placeWord(w)) { allPlaced = false; break; }
        }

        return allPlaced ? { grid, wordPaths, occupied } : null;
    }

    let result = null;
    for (let i = 0; i < 15 && !result; i++) result = attempt();

    if (!result) return { grid: [[]], rows: 1, cols: 1, wordPaths: new Map() };

    const { grid, wordPaths } = result;

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

    const compactGrid = Array(newRows).fill(null).map((_, r) =>
        Array(newCols).fill(null).map((_, c) => grid[r + minR][c + minC])
    );

    wordPaths.forEach((path, w) => {
        wordPaths.set(w, path.map(p => ({ r: p.r - minR, c: p.c - minC })));
    });

    return { grid: compactGrid, rows: newRows, cols: newCols, wordPaths };
}

// ==================== 2. CONSTRAINT PROPAGATION (Word Search) ====================

/**
 * @param {string[]} words
 * @param {number} rows
 * @param {number} cols
 * @returns {string[][]}
 */
function buildWordSearchGrid(words, rows, cols) {
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(''));

    const cellOwner = new Map();

    const ALL_DIRS = [
        [0,1],[0,-1],[1,0],[-1,0],
        [1,1],[1,-1],[-1,1],[-1,-1]
    ];

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

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== '') continue;

            let chosen = ARABIC[Math.floor(Math.random() * ARABIC.length)];
            grid[r][c] = chosen;
        }
    }

    return grid;
}

// ==================== 3. A* SEARCH ====================

class PriorityQueue {
    constructor(compareFn) {
        this.heap = [];
        this.compare = compareFn;
    }
    enqueue(item) {
        this.heap.push(item);

        this.heap.sort(this.compare);
    }
    dequeue() { return this.heap.shift(); }
    isEmpty() { return this.heap.length === 0; }
}

/**
 * @param {string} word 
 * @param {string[][]} grid 
 * @param {boolean[][]} used 
 * @returns {Array<{r:number,c:number}>|null}
 */
function aStarFindWord(word, grid, used) {
    const rows = grid.length, cols = grid[0].length;

    const pq = new PriorityQueue((a, b) => (a.f - b.f));

    for (let sr = 0; sr < rows; sr++) {
        for (let sc = 0; sc < cols; sc++) {
            if (grid[sr][sc] !== word[0] || (used && used[sr][sc])) continue;

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

        if (idx === word.length - 1) return path;

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

            if (path.some(p => p.r === nr && p.c === nc)) continue;

            const ng = g + 1;
            const nh = word.length - ng; 
            pq.enqueue({
                r: nr, c: nc, idx: idx + 1,
                path: [...path, { r: nr, c: nc }],
                g: ng,
                f: ng + nh
            });
        }
    }
    return null; 
}

// ==================== 4. CROSSWORD SOLVER ====================

/**
 * @param {Array}  wordsData - [{word, row, col, dir, clue}]
 * @param {number} rows
 * @param {number} cols
 * @returns {{ grid: (string|null)[][], placedWords: Array }}
 */
function buildCrosswordGrid(wordsData, rows, cols) {

    const wordCells = wordsData.map(w => {
        const cells = [];
        for (let i = 0; i < w.word.length; i++) {
            const r = w.dir === 'h' ? w.row : w.row + i;
            const c = w.dir === 'h' ? w.col + i : w.col;
            cells.push({ r, c, letter: w.word[i] });
        }
        return cells;
    });


    const cellMap = new Map();
    wordsData.forEach((w, wi) => {
        wordCells[wi].forEach(({ r, c }, pos) => {
            const key = `${r},${c}`;
            if (!cellMap.has(key)) cellMap.set(key, []);
            cellMap.get(key).push({ wi, pos });
        });
    });

    const arcs = []; 
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
                const arc = arcs.find(a => arcSet.has(`${Math.min(a.i,a.j)}_${Math.max(a.i,a.j)}`) &&
                    ((a.i===i&&a.j===j)||(a.i===j&&a.j===i)));
                if (arc) arc.sharedCells.push({ posI, posJ });
            }
        }
    });

 
    const inconsistent = new Set(); 
    const queue = [...arcs];
    while (queue.length > 0) {
        const { i, j, sharedCells } = queue.shift();
        if (inconsistent.has(i) || inconsistent.has(j)) continue;

        for (const { posI, posJ } of sharedCells) {
            const letterI = wordsData[i].word[posI];
            const letterJ = wordsData[j].word[posJ];
            if (letterI !== letterJ) {
            
                const degreeI = arcs.filter(a => a.i === i || a.j === i).length;
                const degreeJ = arcs.filter(a => a.i === j || a.j === j).length;

                if (degreeI <= degreeJ) inconsistent.add(i);
                else                    inconsistent.add(j);
                break;
            }
        }
    }

    const candidates = wordsData
        .map((w, i) => ({ ...w, _idx: i }))
        .filter(w => !inconsistent.has(w._idx));


    const degreeOf = (w) =>
        arcs.filter(a =>
            !inconsistent.has(a.i) && !inconsistent.has(a.j) &&
            (a.i === w._idx || a.j === w._idx)
        ).length;

    candidates.sort((a, b) => {

        if (b.word.length !== a.word.length) return b.word.length - a.word.length;

        return degreeOf(b) - degreeOf(a);
    });


    function lcvScore(wInfo, currentGrid) {

        let constraintCount = 0;
        const cells = wordCells[wInfo._idx];
        for (const { r, c, letter } of cells) {
            if (currentGrid[r][c] !== null && currentGrid[r][c] !== letter) {
                constraintCount += 10; 
            }

            const key = `${r},${c}`;
            const others = (cellMap.get(key) || []).filter(e => e.wi !== wInfo._idx);
            constraintCount += others.length;
        }
        return constraintCount; 
    }

    // ──  Backtracking Search ──────────────────
 

    const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    const placedWords = [];
    const placedFlags = new Array(candidates.length).fill(false);

    function isConsistentPlacement(wInfo, g) {

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

        wordCells[wInfo._idx].forEach(({ r, c }) => { g[r][c] = prevGrid[r][c]; });
    }

    function backtrack(idx, g) {
        if (idx === candidates.length) return true; 

   
        const remaining = candidates.slice(idx);
        remaining.sort((a, b) => lcvScore(a, g) - lcvScore(b, g));
        const wInfo = remaining[0];
        const wIdx  = candidates.indexOf(wInfo);

        [candidates[idx], candidates[wIdx]] = [candidates[wIdx], candidates[idx]];

        // Constraint Check + Placement
        if (isConsistentPlacement(candidates[idx], g)) {

            const snapshot = g.map(row => [...row]);
            placeOnGrid(candidates[idx], g);
            placedFlags[idx] = true;

            if (backtrack(idx + 1, g)) return true;

            removeFromGrid(candidates[idx], g, snapshot);
            placedFlags[idx] = false;
        }

        [candidates[idx], candidates[wIdx]] = [candidates[wIdx], candidates[idx]];
        return false;
    }

    backtrack(0, grid);

    candidates.forEach((w, i) => {
        if (placedFlags[i]) placedWords.push(w);
    });

    return { grid, placedWords };
}

// ==================== 5. HILL CLIMBING (Local Search) ====================

/**
 * @param {string[][]} grid
 * @param {Set<string>} occupiedKeys 
 * @returns {string[][]}
 */
function hillClimbingFillGrid(grid, occupiedKeys) {
    const ARABIC = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const rows = grid.length, cols = grid[0].length;

    function evaluate(g) {
        let score = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (occupiedKeys.has(`${r},${c}`)) continue;
                const letter = g[r][c];

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
            currentScore = newScore; 
        } else {
            current[r][c] = oldLetter;
        }
    }
    return current;
}

// ==================== 6. BEST-FIRST SEARCH ====================

/**
 * @param {string[][]} grid
 * @param {string} targetChar
 * @param {boolean[][]} used
 * @returns {{r:number,c:number}|null}
 */
function bestFirstSearchChar(grid, targetChar, used) {
    const rows = grid.length, cols = grid[0].length;
    const centerR = rows / 2, centerC = cols / 2;

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

    candidates.sort((a, b) => b.h - a.h);
    return { r: candidates[0].r, c: candidates[0].c };
}

// ==================== 7. GENETIC ALGORITHM ====================

class GeneticGridOptimizer {
    constructor(words, rows, cols, populationSize = 20) {
        this.words = words;
        this.rows = rows;
        this.cols = cols;
        this.populationSize = populationSize;
        this.population = [];
    }

    createChromosome() {
        return [...this.words].sort(() => Math.random() - 0.5);
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(this.createChromosome());
        }
    }

    fitness(chromosome) {
        const result = buildExactWordGrid(chromosome);
        let placed = 0;
        for (const w of chromosome) {
            if (result.wordPaths.has(w)) placed++;
        }
        return placed;
    }

    crossover(parent1, parent2) {
        const mid = Math.floor(parent1.length / 2);
        const child = [...parent1.slice(0, mid)];
        for (const w of parent2) {
            if (!child.includes(w)) child.push(w);
        }
        return child;
    }

    mutate(chromosome) {
        const idx1 = Math.floor(Math.random() * chromosome.length);
        const idx2 = Math.floor(Math.random() * chromosome.length);
        const mutated = [...chromosome];
        [mutated[idx1], mutated[idx2]] = [mutated[idx2], mutated[idx1]];
        return mutated;
    }

    evolve(generations = 30) {
        this.initializePopulation();

        for (let gen = 0; gen < generations; gen++) {

            const scored = this.population.map(c => ({ chromosome: c, score: this.fitness(c) }));
            scored.sort((a, b) => b.score - a.score);

            if (scored[0].score === this.words.length) return scored[0].chromosome;

            const survivors = scored.slice(0, Math.ceil(this.populationSize / 2)).map(s => s.chromosome);

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

        const scored = this.population.map(c => ({ chromosome: c, score: this.fitness(c) }));
        scored.sort((a, b) => b.score - a.score);
        return scored[0].chromosome;
    }
}

// ==================== 8. MINIMAX + ALPHA-BETA ====================

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
            if (beta <= alpha) break; 
        }
        return best;
    }
}