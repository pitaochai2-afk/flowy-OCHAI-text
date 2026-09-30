const zone = document.getElementById('scene');
const canvas = document.getElementById('morph-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let particles = [];
let mouse = { x: null, y: null, radius: 30 };

function init() {
  canvas.width = zone.clientWidth;
  canvas.height = zone.clientHeight;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OCHAI', canvas.width / 2, canvas.height / 2);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];

  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const alphaIndex = (y * canvas.width + x) * 4 + 3;
      if (imgData.data[alphaIndex] > 128) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: x,
          baseY: y,
          vx: 0, vy: 0
        });
      }
    }
  }
}

function loop() {
  ctx.fillStyle = 'rgba(4,4,6,0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    let dx = mouse.x - p.x;
    let dy = mouse.y - p.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {
      let force = (mouse.radius - dist) / mouse.radius;
      let angle = Math.atan2(dy, dx);
      p.vx = Math.cos(angle) * force * 4;
      p.vy = Math.sin(angle) * force * 4;
    }

    p.vx += (p.baseX - p.x) * 0.08;
    p.vy += (p.baseY - p.y) * 0.08;
    p.vx *= 0.82; p.vy *= 0.82;
    p.x += p.vx; p.y += p.vy;

    ctx.fillStyle = '#00ffaa';
    ctx.fillRect(p.x, p.y, 1.5, 1.5);
  });

  requestAnimationFrame(loop);
}

zone.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

zone.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

zone.addEventListener('touchmove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
}, { passive: true });

zone.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

init();
loop();
