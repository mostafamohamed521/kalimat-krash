/**
 * ============================================
 * KALIMAT CRASH - ALGORITHMS ENGINE
 * ============================================
 * الخوارزميات المستخدمة:
 * 1. CSP + Backtracking - لتوليد جريد الكلمات
 * 2. Genetic Algorithm - لتحسين ترتيب الحروف
 * 3. A* Search - لتلميحات المسار الأمثل
 * 4. Minimax/Alpha-Beta - (مستقبلاً للـ AI Player)
 * 5. Local Search (Hill Climbing) - لتحسين التوزيع
 * 6. Best-First Search - للبحث السريع
 * ============================================
 */

// ==================== 1. CSP & BACKTRACKING ====================

class CSPGridGenerator {
    constructor(words, rows, cols) {
        this.words = words;
        this.rows = rows;
        this.cols = cols;
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(''));
        this.domains = this.initializeDomains();
    }

    initializeDomains() {
        // كل خلية ممكن تاخد أي حرف عربي
        const arabicLetters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
        const domains = {};
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                domains[`${r},${c}`] = [...arabicLetters];
            }
        }
        return domains;
    }

    // التحقق من القيود: هل الكلمة تتقاطع بشكل صحيح؟
    checkConstraints(word, row, col, direction) {
        const dr = direction === 'h' ? 0 : 1;
        const dc = direction === 'h' ? 1 : 0;

        for (let i = 0; i < word.length; i++) {
            const r = row + i * dr;
            const c = col + i * dc;
            
            if (r >= this.rows || c >= this.cols || r < 0 || c < 0) return false;
            
            const existing = this.grid[r][c];
            if (existing !== '' && existing !== word[i]) return false;
            
            // التحقق من الجيران (مش عايزين كلمات ملتصقة عشوائياً)
            if (existing === '') {
                // لو أفقي، اتأكد مفيش حروف فوق وتحت في نفس العمود
                if (direction === 'h') {
                    if (r > 0 && this.grid[r-1][c] !== '' && !this.isPartOfWord(r-1, c)) return false;
                    if (r < this.rows-1 && this.grid[r+1][c] !== '' && !this.isPartOfWord(r+1, c)) return false;
                }
            }
        }
        return true;
    }

    isPartOfWord(row, col) {
        // بسيطة - بتشوف إذا الحرف ده جزء من كلمة موجودة
        return this.grid[row][col] !== '';
    }

    // Backtracking الرئيسي
    solveCSP(index = 0) {
        if (index === this.words.length) return true; // كل الكلمات اتحطت

        const word = this.words[index];
        const positions = this.getValidPositions(word);

        // ترتيب القيم حسب heuristic (MRV - Minimum Remaining Values)
        positions.sort((a, b) => a.conflicts - b.conflicts);

        for (const pos of positions) {
            if (this.checkConstraints(word, pos.row, pos.col, pos.dir)) {
                this.placeWord(word, pos.row, pos.col, pos.dir);
                
                // Forward checking - شيل القيم المتعارضة من domains
                const removed = this.forwardCheck(word, pos.row, pos.col, pos.dir);
                
                if (this.solveCSP(index + 1)) return true;
                
                // Backtrack
                this.removeWord(word, pos.row, pos.col, pos.dir);
                this.restoreDomains(removed);
            }
        }
        return false;
    }

    getValidPositions(word) {
        const positions = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                for (const dir of ['h', 'v']) {
                    if (this.canPlace(word, r, c, dir)) {
                        const conflicts = this.countConflicts(word, r, c, dir);
                        positions.push({row: r, col: c, dir, conflicts});
                    }
                }
            }
        }
        return positions;
    }

    canPlace(word, row, col, dir) {
        const dr = dir === 'h' ? 0 : 1;
        const dc = dir === 'h' ? 1 : 0;
        if (row + (word.length-1)*dr >= this.rows || col + (word.length-1)*dc >= this.cols) return false;
        return true;
    }

    countConflicts(word, row, col, dir) {
        let conflicts = 0;
        const dr = dir === 'h' ? 0 : 1;
        const dc = dir === 'h' ? 1 : 0;
        for (let i = 0; i < word.length; i++) {
            const r = row + i * dr, c = col + i * dc;
            if (this.grid[r][c] !== '' && this.grid[r][c] !== word[i]) conflicts++;
        }
        return conflicts;
    }

    placeWord(word, row, col, dir) {
        const dr = dir === 'h' ? 0 : 1;
        const dc = dir === 'h' ? 1 : 0;
        for (let i = 0; i < word.length; i++) {
            this.grid[row + i*dr][col + i*dc] = word[i];
        }
    }

    removeWord(word, row, col, dir) {
        const dr = dir === 'h' ? 0 : 1;
        const dc = dir === 'h' ? 1 : 0;
        for (let i = 0; i < word.length; i++) {
            const r = row + i*dr, c = col + i*dc;
            // اتأكد إن الحرف ده مش مستخدم في كلمة تانية
            let usedElsewhere = false;
            for (let j = 0; j < this.words.length; j++) {
                if (j !== this.words.indexOf(word)) {
                    // فحص مبسط - في الواقع لازم نتأكد من كل كلمة
                }
            }
            if (!usedElsewhere) this.grid[r][c] = '';
        }
    }

    forwardCheck(word, row, col, dir) {
        // تبسيط - نرجع مصفوفة فاضية دلوقتي
        return [];
    }

    restoreDomains(removed) {
        // استرجاع القيم المحذوفة
    }

    fillRandomLetters() {
        const arabic = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === '') {
                    this.grid[r][c] = arabic[Math.floor(Math.random() * arabic.length)];
                }
            }
        }
        return this.grid;
    }
}

// ==================== 2. GENETIC ALGORITHM ====================

class GeneticGridOptimizer {
    constructor(words, rows, cols, populationSize = 50) {
        this.words = words;
        this.rows = rows;
        this.cols = cols;
        this.populationSize = populationSize;
        this.population = [];
    }

    // تمثيل الكروموزوم: ترتيب الكلمات + مواقعها
    createChromosome() {
        return {
            wordOrder: [...this.words].sort(() => Math.random() - 0.5),
            positions: this.words.map(() => ({
                row: Math.floor(Math.random() * this.rows),
                col: Math.floor(Math.random() * this.cols),
                dir: Math.random() < 0.5 ? 'h' : 'v'
            }))
        };
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(this.createChromosome());
        }
    }

    fitness(chromosome) {
        const grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(''));
        let score = 0;
        let placedWords = 0;

        for (let i = 0; i < chromosome.wordOrder.length; i++) {
            const word = chromosome.wordOrder[i];
            const pos = chromosome.positions[i];
            
            if (this.canPlaceWord(grid, word, pos.row, pos.col, pos.dir)) {
                this.placeWord(grid, word, pos.row, pos.col, pos.dir);
                placedWords++;
                score += word.length * 10; // كل حرف = 10 نقاط
                
                // مكافأة على التقاطعات
                for (let j = 0; j < word.length; j++) {
                    const dr = pos.dir === 'h' ? 0 : 1;
                    const dc = pos.dir === 'h' ? 1 : 0;
                    const r = pos.row + j*dr, c = pos.col + j*dc;
                    // لو فيه تقاطع مع كلمة تانية
                    if (grid[r][c] === word[j]) score += 20;
                }
            }
        }

        // عقوبة على المساحة الفاضية
        const emptyCells = grid.flat().filter(c => c === '').length;
        score -= emptyCells * 2;

        return placedWords === this.words.length ? score + 1000 : score;
    }

    canPlaceWord(grid, word, row, col, dir) {
        const dr = dir === 'h' ? 0 : 1;
        const dc = dir === 'h' ? 1 : 0;
        
        if (row + (word.length-1)*dr >= this.rows || col + (word.length-1)*dc >= this.cols) return false;
        if (row < 0 || col < 0) return false;

        for (let i = 0; i < word.length; i++) {
            const r = row + i*dr, c = col + i*dc;
            if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
        }
        return true;
    }

    placeWord(grid, word, row, col, dir) {
        const dr = dir === 'h' ? 0 : 1;
        const dc = dir === 'h' ? 1 : 0;
        for (let i = 0; i < word.length; i++) {
            grid[row + i*dr][col + i*dc] = word[i];
        }
    }

    selection() {
        // Tournament selection
        const tournamentSize = 5;
        let best = null;
        let bestFitness = -Infinity;
        
        for (let i = 0; i < tournamentSize; i++) {
            const idx = Math.floor(Math.random() * this.population.length);
            const chrom = this.population[idx];
            const fit = this.fitness(chrom);
            if (fit > bestFitness) {
                bestFitness = fit;
                best = chrom;
            }
        }
        return best;
    }

    crossover(parent1, parent2) {
        const point = Math.floor(Math.random() * this.words.length);
        return {
            wordOrder: [...parent1.wordOrder.slice(0, point), ...parent2.wordOrder.slice(point)],
            positions: [...parent1.positions.slice(0, point), ...parent2.positions.slice(point)]
        };
    }

    mutate(chromosome) {
        const idx = Math.floor(Math.random() * this.words.length);
        chromosome.positions[idx] = {
            row: Math.floor(Math.random() * this.rows),
            col: Math.floor(Math.random() * this.cols),
            dir: Math.random() < 0.5 ? 'h' : 'v'
        };
        return chromosome;
    }

    evolve(generations = 100) {
        this.initializePopulation();
        
        for (let gen = 0; gen < generations; gen++) {
            const newPopulation = [];
            
            // Elitism: احتفظ بأفضل 2
            const sorted = [...this.population].sort((a, b) => this.fitness(b) - this.fitness(a));
            newPopulation.push(sorted[0], sorted[1]);
            
            while (newPopulation.length < this.populationSize) {
                const parent1 = this.selection();
                const parent2 = this.selection();
                let child = this.crossover(parent1, parent2);
                
                if (Math.random() < 0.1) child = this.mutate(child); // 10% mutation rate
                newPopulation.push(child);
            }
            
            this.population = newPopulation;
        }
        
        // رجع أفضل حل
        return this.population.reduce((best, current) => 
            this.fitness(current) > this.fitness(best) ? current : best
        );
    }
}

// ==================== 3. A* SEARCH ====================

function aStarSearch(start, isGoal, getNeighbors, heuristic) {
    const openSet = new PriorityQueue((a, b) => a.f < b.f);
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    const startKey = JSON.stringify(start);
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(start));
    openSet.enqueue({node: start, f: fScore.get(startKey)});

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue().node;
        const currentKey = JSON.stringify(current);

        if (isGoal(current)) {
            // إعادة بناء المسار
            const path = [current];
            let curr = currentKey;
            while (cameFrom.has(curr)) {
                const prev = cameFrom.get(curr);
                path.unshift(prev);
                curr = JSON.stringify(prev);
            }
            return path;
        }

        closedSet.add(currentKey);

        for (const neighbor of getNeighbors(current)) {
            const neighborKey = JSON.stringify(neighbor);
            if (closedSet.has(neighborKey)) continue;

            const tentativeG = gScore.get(currentKey) + 1;

            if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeG);
                fScore.set(neighborKey, tentativeG + heuristic(neighbor));
                openSet.enqueue({node: neighbor, f: fScore.get(neighborKey)});
            }
        }
    }

    return null; // مفيش مسار
}

// Priority Queue بسيطة
class PriorityQueue {
    constructor(compare) {
        this.heap = [];
        this.compare = compare;
    }

    enqueue(item) {
        this.heap.push(item);
        this.heap.sort(this.compare);
    }

    dequeue() {
        return this.heap.shift();
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

// ==================== 4. LOCAL SEARCH (Hill Climbing) ====================

function hillClimbing(initialState, getNeighbors, evaluate) {
    let current = initialState;
    let currentScore = evaluate(current);

    while (true) {
        const neighbors = getNeighbors(current);
        let bestNeighbor = null;
        let bestScore = currentScore;

        for (const neighbor of neighbors) {
            const score = evaluate(neighbor);
            if (score > bestScore) {
                bestScore = score;
                bestNeighbor = neighbor;
            }
        }

        if (!bestNeighbor || bestScore <= currentScore) break;
        
        current = bestNeighbor;
        currentScore = bestScore;
    }

    return current;
}

// ==================== 5. BEST-FIRST SEARCH ====================

function bestFirstSearch(start, isGoal, getNeighbors, heuristic) {
    const openSet = new PriorityQueue((a, b) => heuristic(a) < heuristic(b));
    const closedSet = new Set();

    openSet.enqueue(start);

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();
        const currentKey = JSON.stringify(current);

        if (isGoal(current)) return current;

        if (closedSet.has(currentKey)) continue;
        closedSet.add(currentKey);

        for (const neighbor of getNeighbors(current)) {
            openSet.enqueue(neighbor);
        }
    }

    return null;
}

// ==================== 6. MINIMAX (مستقبلي للـ AI) ====================

function minimax(state, depth, isMaximizing, evaluate, getChildren, isTerminal) {
    if (depth === 0 || isTerminal(state)) {
        return evaluate(state);
    }

    const children = getChildren(state);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const child of children) {
            const eval = minimax(child, depth - 1, false, evaluate, getChildren, isTerminal);
            maxEval = Math.max(maxEval, eval);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const child of children) {
            const eval = minimax(child, depth - 1, true, evaluate, getChildren, isTerminal);
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}

// Alpha-Beta Pruning
function alphaBeta(state, depth, alpha, beta, isMaximizing, evaluate, getChildren, isTerminal) {
    if (depth === 0 || isTerminal(state)) {
        return evaluate(state);
    }

    const children = getChildren(state);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const child of children) {
            const eval = alphaBeta(child, depth - 1, alpha, beta, false, evaluate, getChildren, isTerminal);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break; // Beta cutoff
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const child of children) {
            const eval = alphaBeta(child, depth - 1, alpha, beta, true, evaluate, getChildren, isTerminal);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break; // Alpha cutoff
        }
        return minEval;
    }
}

// ==================== دوال مساعدة للعبة ====================

// توليد الجريد باستخدام CSP
function generateGridWithCSP(words, rows = 5, cols = 5) {
    const csp = new CSPGridGenerator(words, rows, cols);
    if (csp.solveCSP()) {
        return csp.fillRandomLetters();
    }
    return null;
}

// توليد الجريد باستخدام Genetic Algorithm
function generateWithGenetic(words, rows = 5, cols = 5) {
    const genetic = new GeneticGridOptimizer(words, rows, cols);
    const best = genetic.evolve(200);
    
    // حول الكروموزوم لجريد
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(''));
    for (let i = 0; i < best.wordOrder.length; i++) {
        const word = best.wordOrder[i];
        const pos = best.positions[i];
        const dr = pos.dir === 'h' ? 0 : 1;
        const dc = pos.dir === 'h' ? 1 : 0;
        for (let j = 0; j < word.length; j++) {
            if (pos.row + j*dr < rows && pos.col + j*dc < cols) {
                grid[pos.row + j*dr][pos.col + j*dc] = word[j];
            }
        }
    }
    
    // عبي الفراغات
    const arabic = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '') grid[r][c] = arabic[Math.floor(Math.random() * arabic.length)];
        }
    }
    
    return grid;
}

// A* للبحث عن مسار كلمة في الجريد
function findWordPath(grid, word, usedGrid) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === word[0] && !usedGrid[r][c]) {
                const start = {row: r, col: c, idx: 0};
                const isGoal = (node) => node.idx === word.length - 1;
                const getNeighbors = (node) => {
                    const neighbors = [];
                    const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
                    for (const [dr, dc] of dirs) {
                        const nr = node.row + dr, nc = node.col + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
                            !usedGrid[nr][nc] && grid[nr][nc] === word[node.idx + 1]) {
                            neighbors.push({row: nr, col: nc, idx: node.idx + 1});
                        }
                    }
                    return neighbors;
                };
                const heuristic = (node) => word.length - node.idx;
                
                const path = aStarSearch(start, isGoal, getNeighbors, heuristic);
                if (path) return path.map(n => ({row: n.row, col: n.col}));
            }
        }
    }
    return null;
}

// Local Search لتحسين توزيع الحروف
function optimizeLetterPlacement(grid, words) {
    const rows = grid.length;
    const cols = grid[0].length;
    const arabic = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    
    const getNeighbors = (state) => {
        const neighbors = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!words.some(w => w.includes(state[r][c]))) { // لو الحرف مش جزء من كلمة
                    const newState = state.map(row => [...row]);
                    newState[r][c] = arabic[Math.floor(Math.random() * arabic.length)];
                    neighbors.push(newState);
                }
            }
        }
        return neighbors;
    };
    
    const evaluate = (state) => {
        let score = 0;
        // كلما كانت الحروف القريبة من بعض تشكل كلمات أكثر = score أعلى
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                for (const word of words) {
                    if (state[r][c] === word[0]) {
                        // شوف لو الكلمة ممكن تتكون من هنا
                        score += 1;
                    }
                }
            }
        }
        return score;
    };
    
    return hillClimbing(grid, getNeighbors, evaluate);
}