

document.addEventListener('DOMContentLoaded', () => {
    setupWaveCanvas();
    drawIslands();
    initMap();
    setupHelpModal();
    // Fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    requestAnimationFrame(() => setTimeout(() => document.body.style.opacity = '1', 60));
});

// ==================== WAVE ANIMATION ====================

function setupWaveCanvas() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let w, h, t = 0;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    function drawWaves() {
        ctx.clearRect(0, 0, w, h);

        // Wave 1 — light foam
        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
            const y = h * 0.68 + Math.sin(x * 0.012 + t) * 22;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fill();

        // Wave 2 — slightly different phase
        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
            const y = h * 0.73 + Math.sin(x * 0.018 + t * 1.4 + 1.2) * 18;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = 'rgba(200,240,255,0.05)';
        ctx.fill();

        // Wave 3 — small ripples
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
            const y = h * 0.55 + Math.sin(x * 0.025 + t * 0.8) * 12;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fill();

        t += 0.018;
        requestAnimationFrame(drawWaves);
    }
    drawWaves();
}

// ==================== ISLANDS (decorative) ====================

function drawIslands() {
    const layer = document.getElementById('islandsLayer');
    if (!layer) return;
    const islands = [
        { left: '8%',  top: '20%', size: 60 },
        { left: '75%', top: '15%', size: 45 },
        { left: '85%', top: '55%', size: 55 },
        { left: '5%',  top: '65%', size: 50 },
        { left: '50%', top: '80%', size: 40 },
    ];
    islands.forEach(isl => {
        const div = document.createElement('div');
        div.className = 'island';
        div.style.cssText = `
            left:${isl.left}; top:${isl.top};
            width:${isl.size}px; height:${isl.size * 0.45}px;
            background: radial-gradient(ellipse at 50% 60%, #5d9e4a, #3a7030);
            border-radius: 50%;
            box-shadow: 0 6px 0 #2a5022, 0 ${isl.size*0.25}px ${isl.size*0.4}px rgba(0,0,0,0.2);
            opacity: 0.7;
        `;
        // Palm tree
        const palm = document.createElement('div');
        palm.style.cssText = `
            position:absolute; left:42%; bottom:80%;
            width:4px; height:${isl.size*0.6}px;
            background: #7a5c35; border-radius:2px;
        `;
        // Leaves
        const leaf = document.createElement('div');
        leaf.style.cssText = `
            position:absolute; top:-10px; left:-12px;
            width:28px; height:12px;
            background: radial-gradient(ellipse, #5d9e4a, transparent);
            border-radius:50%; opacity:0.9;
        `;
        palm.appendChild(leaf);
        div.appendChild(palm);
        layer.appendChild(div);
    });
}

// ==================== MAP CANVAS ====================

let mapCanvas, mapCtx;
let panX = 0, panY = 0;
let isDragging = false, lastX = 0, lastY = 0;
let levels = [];

const MAP_W = 1800, MAP_H = 5800;
const RADIUS = 34;
const MODE_COLORS = {
    1: { fill: '#27ae60', shadow: '#1a7a44', border: '#a3e4d7' },
    2: { fill: '#d4ac0d', shadow: '#9a7b05', border: '#f9e58a' },
    3: { fill: '#7d3c98', shadow: '#5b2b72', border: '#d7bde2' },
    4: { fill: '#c0392b', shadow: '#8e2218', border: '#f1948a' },
};
const LOCKED_COLORS = { fill: '#7f8c8d', shadow: '#5d6d7e', border: '#bdc3c7' };

function initMap() {
    mapCanvas = document.getElementById('mapCanvas');
    mapCtx = mapCanvas.getContext('2d');
    levels = getAllLevels();

    function resize() {
        mapCanvas.width = window.innerWidth;
        mapCanvas.height = window.innerHeight;
        // Start view at bottom of path
        panX = mapCanvas.width / 2 - MAP_W / 2;
        panY = mapCanvas.height - MAP_H - 20;
        drawMap();
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse drag
    mapCanvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; mapCanvas.style.cursor = 'grabbing'; });
    window.addEventListener('mousemove', e => { if (!isDragging) return; e.preventDefault(); panX += e.clientX - lastX; panY += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; drawMap(); });
    window.addEventListener('mouseup', () => { isDragging = false; mapCanvas.style.cursor = 'grab'; });

    // Touch drag
    mapCanvas.addEventListener('touchstart', e => { e.preventDefault(); isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; }, { passive: false });
    mapCanvas.addEventListener('touchmove', e => { e.preventDefault(); if (!isDragging) return; panX += e.touches[0].clientX - lastX; panY += e.touches[0].clientY - lastY; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; drawMap(); }, { passive: false });
    mapCanvas.addEventListener('touchend', () => { isDragging = false; });

    // Click
    mapCanvas.addEventListener('click', handleClick);

    // Keyboard
    window.addEventListener('keydown', e => {
        const s = 70;
        if (e.key === 'ArrowUp')    panY += s;
        if (e.key === 'ArrowDown')  panY -= s;
        if (e.key === 'ArrowLeft')  panX += s;
        if (e.key === 'ArrowRight') panX -= s;
        drawMap();
    });
}

function generateSnakePath(count) {
    const pts = [];
    const startX = MAP_W / 2;
    const startY = MAP_H - 200;
    const stepY = (MAP_H - 400) / (count - 1);

    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const y = startY - i * stepY;
        const amplitude = 260 * (1 - t * 0.35);
        const x = startX + Math.sin(i * 0.08) * amplitude + Math.cos(i * 0.04) * 80;
        pts.push({ x, y });
    }
    return pts;
}

function drawMap() {
    const ctx = mapCtx;
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.save();
    ctx.translate(panX, panY);

    const pts = generateSnakePath(100);

    // Draw dashed connecting path
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1], c = pts[i];
        const cpx = (p.x + c.x) / 2, cpy = (p.y + c.y) / 2;
        ctx.quadraticCurveTo(p.x, p.y, cpx, cpy);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 7;
    ctx.setLineDash([22, 14]);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw level circles
    levels.forEach((lvl, i) => {
        if (i >= pts.length) return;
        drawLevelCircle(ctx, pts[i].x, pts[i].y, lvl);
    });

    ctx.restore();
}

function drawLevelCircle(ctx, x, y, lvl) {
    const r = RADIUS;
    const colors = lvl.unlocked ? MODE_COLORS[lvl.mode] : LOCKED_COLORS;

    // Outer glow
    ctx.beginPath();
    ctx.arc(x, y, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = lvl.unlocked
        ? `${colors.fill}22`
        : 'rgba(100,100,100,0.1)';
    ctx.fill();

    // Shadow bottom disc (3D effect)
    ctx.beginPath();
    ctx.arc(x, y + 7, r, 0, Math.PI * 2);
    ctx.fillStyle = colors.shadow;
    ctx.fill();

    // Main circle with gradient
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r + 4);
    grad.addColorStop(0, lighten(colors.fill, 35));
    grad.addColorStop(0.6, colors.fill);
    grad.addColorStop(1, colors.shadow);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Border ring
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Inner highlight
    ctx.beginPath();
    ctx.arc(x - r * 0.28, y - r * 0.28, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fill();

    // Text or lock icon
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (lvl.unlocked) {
        ctx.font = `bold 17px 'Cairo', Tahoma, sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 6;
        ctx.fillText(lvl.id, x, y);
        ctx.shadowBlur = 0;
    } else {
        ctx.font = `20px serif`;
        ctx.fillText('🔒', x, y - 5);
        ctx.font = `bold 12px 'Cairo', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(lvl.id, x, y + 14);
    }
}

function lighten(hex, pct) {
    // Simple lighten by mixing with white
    try {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (n >> 16) + pct * 2);
        const g = Math.min(255, ((n >> 8) & 0xff) + pct * 2);
        const b = Math.min(255, (n & 0xff) + pct * 2);
        return `rgb(${r},${g},${b})`;
    } catch { return hex; }
}

function handleClick(e) {
    const rect = mapCanvas.getBoundingClientRect();
    const wx = (e.clientX - rect.left) * (mapCanvas.width / rect.width) - panX;
    const wy = (e.clientY - rect.top) * (mapCanvas.height / rect.height) - panY;

    const pts = generateSnakePath(100);
    for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - wx, dy = pts[i].y - wy;
        if (Math.sqrt(dx * dx + dy * dy) < RADIUS + 8) {
            const lvl = levels[i];
            if (lvl.unlocked) {
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s';
                setTimeout(() => window.location.href = `game.html?level=${lvl.id}`, 250);
            } else {
                showMapToast('🔒 أكمل المستوى السابق أولاً');
            }
            return;
        }
    }
}

function showMapToast(msg) {
    let t = document.getElementById('mapToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'mapToast';
        t.style.cssText = `
            position:fixed; bottom:10%; left:50%; transform:translateX(-50%);
            background:rgba(10,25,45,0.95); color:#fff; padding:12px 28px;
            border-radius:44px; font-size:1rem; font-weight:700;
            font-family:'Cairo',sans-serif; z-index:999;
            border:1.5px solid rgba(255,255,255,0.15);
            box-shadow:0 8px 24px rgba(0,0,0,0.35);
            opacity:0; transition:opacity 0.25s;
        `;
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => t.style.opacity = '0', 2200);
}

// ==================== HELP MODAL ====================

function setupHelpModal() {
    const btn = document.getElementById('helpButton');
    const modal = document.getElementById('helpModal');
    const closeBtn = document.getElementById('closeHelp');

    btn.addEventListener('click', () => modal.classList.add('open'));
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}
