// ============================================
// KALIMAT CRASH — map.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupWaveCanvas();
    initMap();
    setupHelpModal();

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    requestAnimationFrame(() => setTimeout(() => document.body.style.opacity = '1', 60));
});

// ==================== أمواج ====================

function setupWaveCanvas() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let w, h, t = 0;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    function drawWaves() {
        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
            const y = h * 0.68 + Math.sin(x * 0.012 + t) * 22;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fill();

        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
            const y = h * 0.73 + Math.sin(x * 0.018 + t * 1.4 + 1.2) * 18;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = 'rgba(200,240,255,0.05)';
        ctx.fill();

        t += 0.018;
        requestAnimationFrame(drawWaves);
    }
    drawWaves();
}


let mapCanvas, mapCtx;
let panX = 0, panY = 0;
let isDragging = false, lastMouseX = 0, lastMouseY = 0;
let levels = [];

const LEVEL_COUNT = 100;
const RADIUS = 30;          
const SPACING = 90;         
const MAP_W = 800;

const MODE_COLORS = {
    1: { fill: '#27ae60', shadow: '#1a7a44', border: '#a3e4d7', text: '#fff' },
    2: { fill: '#d4ac0d', shadow: '#9a7b05', border: '#f9e58a', text: '#fff' },
    3: { fill: '#7d3c98', shadow: '#5b2b72', border: '#d7bde2', text: '#fff' },
    4: { fill: '#c0392b', shadow: '#8e2218', border: '#f1948a', text: '#fff' },
};
const LOCKED_COLORS = { fill: '#5d6d7e', shadow: '#34495e', border: '#bdc3c7', text: 'rgba(255,255,255,0.5)' };

function generateSnakePath(count) {
    const pts = [];
    const mapHeight = (count - 1) * SPACING + RADIUS * 2 + 40;
    const centerX = MAP_W / 2;
    const amplitude = (MAP_W / 2) - RADIUS - 20; 

    for (let i = 0; i < count; i++) {

        const y = mapHeight - RADIUS - 20 - i * SPACING;

        const wave = Math.sin(i * Math.PI / 6) * amplitude * 0.45;
        const x = centerX + wave;
        pts.push({ x, y });
    }
    return { pts, mapHeight };
}

function initMap() {
    mapCanvas = document.getElementById('mapCanvas');
    mapCtx = mapCanvas.getContext('2d');
    levels = getAllLevels();

    function resize() {
        mapCanvas.width  = window.innerWidth;
        mapCanvas.height = window.innerHeight;

        const { mapHeight } = generateSnakePath(LEVEL_COUNT);

        panX = (mapCanvas.width  - MAP_W) / 2;
        panY = mapCanvas.height - mapHeight - 20;
        clampPan();
        drawMap();
    }

    window.addEventListener('resize', resize);
    resize();

    mapCanvas.addEventListener('mousedown', e => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        mapCanvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        panX += e.clientX - lastMouseX;
        panY += e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        clampPan();
        drawMap();
    });
    window.addEventListener('mouseup', () => { isDragging = false; mapCanvas.style.cursor = 'grab'; });

    mapCanvas.addEventListener('touchstart', e => {
        e.preventDefault();
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    }, { passive: false });
    mapCanvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!isDragging) return;
        panX += e.touches[0].clientX - lastMouseX;
        panY += e.touches[0].clientY - lastMouseY;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        clampPan();
        drawMap();
    }, { passive: false });
    mapCanvas.addEventListener('touchend', () => { isDragging = false; });

    mapCanvas.addEventListener('click', handleMapClick);

    window.addEventListener('keydown', e => {
        const s = 80;
        if (e.key === 'ArrowUp')    panY += s;
        if (e.key === 'ArrowDown')  panY -= s;
        clampPan();
        drawMap();
    });
}

function clampPan() {
    const { mapHeight } = generateSnakePath(LEVEL_COUNT);

    const minY = mapCanvas.height - mapHeight - 40;
    const maxY = 40;
    panY = Math.min(maxY, Math.max(minY, panY));

    panX = Math.min(40, Math.max(mapCanvas.width - MAP_W - 40, panX));
}

function drawMap() {
    const ctx = mapCtx;
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.save();
    ctx.translate(panX, panY);

    const { pts } = generateSnakePath(LEVEL_COUNT);

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {

        const prev = pts[i - 1], curr = pts[i];
        const cx = (prev.x + curr.x) / 2, cy = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
    }
    ctx.quadraticCurveTo(pts[pts.length-1].x, pts[pts.length-1].y, pts[pts.length-1].x, pts[pts.length-1].y);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 6;
    ctx.setLineDash([18, 14]);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < pts.length; i++) {
        if (i >= levels.length) break;
        drawLevelCircle(ctx, pts[i].x, pts[i].y, levels[i]);
    }

    ctx.restore();
}

function drawLevelCircle(ctx, x, y, lvl) {
    const r = RADIUS;
    const colors = lvl.unlocked ? MODE_COLORS[lvl.mode] : LOCKED_COLORS;

    ctx.beginPath();
    ctx.arc(x, y + 6, r, 0, Math.PI * 2);
    ctx.fillStyle = colors.shadow;
    ctx.fill();

    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
    grad.addColorStop(0, lightenColor(colors.fill, 40));
    grad.addColorStop(0.65, colors.fill);
    grad.addColorStop(1, colors.shadow);

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (lvl.unlocked) {
        ctx.font = `bold 15px 'Cairo', Tahoma, sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        ctx.fillText(lvl.id, x, y);
        ctx.shadowBlur = 0;
    } else {
        ctx.font = '17px serif';
        ctx.fillText('🔒', x, y - 4);
        ctx.font = `bold 10px 'Cairo', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(lvl.id, x, y + 12);
    }

    if (lvl.unlocked) {
        const nextLocked = levels[lvl.id] && !levels[lvl.id].unlocked;
        if (nextLocked || lvl.id === 100) {
            ctx.beginPath();
            ctx.arc(x + r - 4, y - r + 4, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#f1c40f';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function lightenColor(hex, amount) {
    try {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (n >> 16) + amount * 2);
        const g = Math.min(255, ((n >> 8) & 0xff) + amount * 2);
        const b = Math.min(255, (n & 0xff) + amount * 2);
        return `rgb(${r},${g},${b})`;
    } catch { return hex; }
}

function handleMapClick(e) {
    const rect = mapCanvas.getBoundingClientRect();
    const wx = (e.clientX - rect.left) * (mapCanvas.width / rect.width) - panX;
    const wy = (e.clientY - rect.top) * (mapCanvas.height / rect.height) - panY;

    const { pts } = generateSnakePath(LEVEL_COUNT);

    for (let i = 0; i < pts.length; i++) {
        const dx = pts[i].x - wx, dy = pts[i].y - wy;
        if (Math.sqrt(dx * dx + dy * dy) < RADIUS + 10) {
            const lvl = levels[i];
            if (!lvl) return;
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
    setTimeout(() => { t.style.opacity = '0'; }, 2200);
}


function setupHelpModal() {
    const btn   = document.getElementById('helpButton');
    const modal = document.getElementById('helpModal');
    const close = document.querySelector('.close-help');

    if (btn)   btn.addEventListener('click', () => modal.classList.add('open'));
    if (close) close.addEventListener('click', () => modal.classList.remove('open'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}