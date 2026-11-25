import * as THREE from 'three';

function makeCanvas(w, h, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, w, h);
  return canvas;
}

function makeTex(canvas, repeatX = 1, repeatY = 1, isSRGB = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  if (isSRGB) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Deterministic pseudo-random for crisp repeatable grain
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createMaterials() {
  const rand = mulberry32(202611);

  // 1. Whitewashed Light Oak Plank Floor (淺白刷紋橡木寬版地板 — 細膩山紋、髓線與V型導角縫)
  const oakColorCanvas = makeCanvas(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#DECBB2';
    ctx.fillRect(0, 0, w, h);
    const cols = 8;
    const plankW = w / cols;
    for (let c = 0; c < cols; c++) {
      const x = c * plankW;
      const offset = (c % 3) * 310 + (c % 2) * 170;
      const plankLen = 512;
      for (let r = -1; r < 3; r++) {
        const y = r * plankLen + (offset % plankLen);
        const tone = Math.floor((rand() - 0.5) * 16);
        const baseR = 223 + tone;
        const baseG = 204 + tone;
        const baseB = 178 + Math.floor(tone * 0.85);
        ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
        ctx.fillRect(x + 1, y + 1, plankW - 2, plankLen - 2);

        // Cathedral heartwood arches + fine whitewash pore streaks
        for (let i = 0; i < 85; i++) {
          const gx = x + 3 + rand() * (plankW - 6);
          const isWhitewash = rand() > 0.56;
          ctx.strokeStyle = isWhitewash
            ? `rgba(249, 245, 237, ${0.15 + rand() * 0.17})`
            : `rgba(152, 121, 86, ${0.11 + rand() * 0.16})`;
          ctx.lineWidth = 0.65 + rand() * 1.65;
          ctx.beginPath();
          ctx.moveTo(gx, y + 2);
          ctx.bezierCurveTo(
            gx + (rand() - 0.5) * 10,
            y + plankLen * 0.33,
            gx + (rand() - 0.5) * 10,
            y + plankLen * 0.66,
            gx + (rand() - 0.5) * 4,
            y + plankLen - 2
          );
          ctx.stroke();
        }

        // Occasional delicate pin-knot for authentic European oak realism
        if (rand() > 0.62) {
          const kx = x + 22 + rand() * (plankW - 44);
          const ky = y + 60 + rand() * (plankLen - 120);
          const grad = ctx.createRadialGradient(kx, ky, 1, kx, ky, 9);
          grad.addColorStop(0, 'rgba(122, 92, 60, 0.55)');
          grad.addColorStop(0.5, 'rgba(158, 126, 90, 0.25)');
          grad.addColorStop(1, 'rgba(222, 203, 177, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(kx, ky, 6, 11, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Micro-bevel plank joints + highlight lip
        ctx.strokeStyle = 'rgba(255, 251, 244, 0.38)';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(x + 2.0, y + 2.0, plankW - 4.0, plankLen - 4.0);
        ctx.strokeStyle = 'rgba(124, 98, 70, 0.56)';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(x + 0.75, y + 0.75, plankW - 1.5, plankLen - 1.5);
      }
    }
  });

  const oakBumpCanvas = makeCanvas(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#909090';
    ctx.fillRect(0, 0, w, h);
    const cols = 8;
    const plankW = w / cols;
    for (let c = 0; c < cols; c++) {
      const x = c * plankW;
      const offset = (c % 3) * 310 + (c % 2) * 170;
      const plankLen = 512;
      for (let r = -1; r < 3; r++) {
        const y = r * plankLen + (offset % plankLen);
        ctx.strokeStyle = '#262626';
        ctx.lineWidth = 2.4;
        ctx.strokeRect(x + 1, y + 1, plankW - 2, plankLen - 2);
        for (let i = 0; i < 48; i++) {
          const gx = x + 3 + rand() * (plankW - 6);
          ctx.strokeStyle = rand() > 0.5 ? 'rgba(112,112,112,0.42)' : 'rgba(168,168,168,0.32)';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(gx, y + 2);
          ctx.lineTo(gx + (rand() - 0.5) * 3, y + plankLen - 2);
          ctx.stroke();
        }
      }
    }
  });

  // 2. Natural Warm White-Oak Furniture Wood (鄉村風白橡木實木桌面與扶手)
  const tabletopOakCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#DFCBB0';
    ctx.fillRect(0, 0, w, h);
    const boards = 7;
    const bh = h / boards;
    for (let b = 0; b < boards; b++) {
      const y = b * bh;
      const shift = Math.floor((rand() - 0.5) * 10);
      ctx.fillStyle = `rgb(${225 + shift}, ${205 + shift}, ${178 + shift})`;
      ctx.fillRect(0, y, w, bh);
      for (let i = 0; i < 85; i++) {
        const gy = y + rand() * bh;
        ctx.strokeStyle = rand() > 0.44
          ? `rgba(249, 243, 234, ${0.13 + rand() * 0.15})`
          : `rgba(162, 132, 95, ${0.10 + rand() * 0.14})`;
        ctx.lineWidth = 0.7 + rand() * 1.7;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(w * 0.33, gy + (rand() - 0.5) * 8, w * 0.66, gy + (rand() - 0.5) * 8, w, gy);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(150, 122, 90, 0.30)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });

  const tabletopOakBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) {
      const gy = rand() * h;
      ctx.strokeStyle = rand() > 0.5 ? 'rgba(116,116,116,0.4)' : 'rgba(64,64,64,0.32)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy + (rand() - 0.5) * 4);
      ctx.stroke();
    }
  });

  // 3. Entryway French Country Octagonal Cabochon Tile + Relief Bump (玄關法式八角復古花磚＋立體磚縫凹凸圖)
  const foyerTileCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#CFC7B8';
    ctx.fillRect(0, 0, w, h);
    const n = 4;
    const cell = w / n;
    const cut = cell * 0.21;
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        const x = ix * cell;
        const y = iy * cell;
        const pad = 2.4;
        ctx.fillStyle = (ix + iy) % 2 === 0 ? '#FAF7F1' : '#F3EEE4';
        ctx.beginPath();
        ctx.moveTo(x + cut + pad, y + pad);
        ctx.lineTo(x + cell - cut - pad, y + pad);
        ctx.lineTo(x + cell - pad, y + cut + pad);
        ctx.lineTo(x + cell - pad, y + cell - cut - pad);
        ctx.lineTo(x + cell - cut - pad, y + cell - pad);
        ctx.lineTo(x + cut + pad, y + cell - pad);
        ctx.lineTo(x + pad, y + cell - cut - pad);
        ctx.lineTo(x + pad, y + cut + pad);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.65)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
    for (let ix = 0; ix <= n; ix++) {
      for (let iy = 0; iy <= n; iy++) {
        const cx = ix * cell;
        const cy = iy * cell;
        const r = cut - 2.4;
        ctx.fillStyle = '#939986';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
        ctx.fill();
      }
    }
  });

  const foyerTileBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#3A3A3A';
    ctx.fillRect(0, 0, w, h);
    const n = 4;
    const cell = w / n;
    const cut = cell * 0.21;
    ctx.fillStyle = '#C8C8C8';
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        const x = ix * cell;
        const y = iy * cell;
        const pad = 3.0;
        ctx.beginPath();
        ctx.moveTo(x + cut + pad, y + pad);
        ctx.lineTo(x + cell - cut - pad, y + pad);
        ctx.lineTo(x + cell - pad, y + cut + pad);
        ctx.lineTo(x + cell - pad, y + cell - cut - pad);
        ctx.lineTo(x + cell - cut - pad, y + cell - pad);
        ctx.lineTo(x + cut + pad, y + cell - pad);
        ctx.lineTo(x + pad, y + cell - cut - pad);
        ctx.lineTo(x + pad, y + cut + pad);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.fillStyle = '#BCBCBC';
    for (let ix = 0; ix <= n; ix++) {
      for (let iy = 0; iy <= n; iy++) {
        const cx = ix * cell;
        const cy = iy * cell;
        const r = cut - 3.0;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
        ctx.fill();
      }
    }
  });

  // 4. White Country Beadboard / Vertical V-Groove Paneling (白色雙線珠槽企口板)
  const beadboardColor = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#FAF8F3';
    ctx.fillRect(0, 0, w, h);
    const strips = 16;
    const sw = w / strips;
    for (let i = 0; i < strips; i++) {
      const x = i * sw;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillRect(x + 1.8, 0, 2.2, h);
      ctx.fillStyle = 'rgba(188, 179, 165, 0.58)';
      ctx.fillRect(x, 0, 1.9, h);
      ctx.fillStyle = 'rgba(202, 194, 180, 0.42)';
      ctx.fillRect(x + 6.2, 0, 1.2, h);
    }
  });

  const beadboardBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#B8B8B8';
    ctx.fillRect(0, 0, w, h);
    const strips = 16;
    const sw = w / strips;
    for (let i = 0; i < strips; i++) {
      const x = i * sw;
      ctx.fillStyle = '#2E2E2E';
      ctx.fillRect(x, 0, 2.4, h);
      ctx.fillStyle = '#5E5E5E';
      ctx.fillRect(x + 6.2, 0, 1.5, h);
    }
  });

  // 5. Pillowed White Subway Tile + Grout Bump (立體斜邊亮面鐵道磚)
  const subwayCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#D6D0C4';
    ctx.fillRect(0, 0, w, h);
    const rows = 12;
    const cols = 4;
    const th = h / rows;
    const tw = w / cols;
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * (tw * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * tw + off;
        const y = r * th;
        const v = 250 + Math.floor((rand() - 0.5) * 5);
        ctx.fillStyle = `rgb(${v}, ${v - 1}, ${v - 4})`;
        ctx.fillRect(x + 2, y + 2, tw - 4, th - 4);
        ctx.strokeStyle = 'rgba(255,255,255,0.82)';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(x + 3.5, y + 3.5, tw - 7, th - 7);
      }
    }
  });

  const subwayBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#353535';
    ctx.fillRect(0, 0, w, h);
    const rows = 12;
    const cols = 4;
    const th = h / rows;
    const tw = w / cols;
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * (tw * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * tw + off;
        const y = r * th;
        ctx.fillStyle = '#9A9A9A';
        ctx.fillRect(x + 2.2, y + 2.2, tw - 4.4, th - 4.4);
        ctx.fillStyle = '#D4D4D4';
        ctx.fillRect(x + 5.5, y + 4.8, tw - 11, th - 9.6);
      }
    }
  });

  // 6. Bathroom Hexagonal Carrara Mosaic Floor Tile + Bump (卡拉拉白大理石六角磚＋立體填縫)
  const hexTileCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#CEC8BE';
    ctx.fillRect(0, 0, w, h);
    const r = 24;
    const dx = r * 1.732;
    const dy = r * 1.5;
    for (let row = -1; row < h / dy + 2; row++) {
      for (let col = -1; col < w / dx + 2; col++) {
        const cx = col * dx + (row % 2 ? dx * 0.5 : 0);
        const cy = row * dy;
        const shade = 245 + Math.floor((rand() - 0.5) * 10);
        ctx.fillStyle = `rgb(${shade}, ${shade - 1}, ${shade - 3})`;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ang = (Math.PI / 3) * k + Math.PI / 6;
          const px = cx + (r - 1.9) * Math.cos(ang);
          const py = cy + (r - 1.9) * Math.sin(ang);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        if (rand() > 0.42) {
          ctx.strokeStyle = 'rgba(176, 172, 166, 0.38)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - r * 0.52, cy - r * 0.22);
          ctx.quadraticCurveTo(cx, cy + (rand() - 0.5) * 8, cx + r * 0.48, cy + r * 0.3);
          ctx.stroke();
        }
      }
    }
  });

  const hexTileBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#383838';
    ctx.fillRect(0, 0, w, h);
    const r = 24;
    const dx = r * 1.732;
    const dy = r * 1.5;
    ctx.fillStyle = '#C8C8C8';
    for (let row = -1; row < h / dy + 2; row++) {
      for (let col = -1; col < w / dx + 2; col++) {
        const cx = col * dx + (row % 2 ? dx * 0.5 : 0);
        const cy = row * dy;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ang = (Math.PI / 3) * k + Math.PI / 6;
          const px = cx + (r - 2.3) * Math.cos(ang);
          const py = cy + (r - 2.3) * Math.sin(ang);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  });

  // 7. Calacatta Warm White Marble Countertop (卡拉卡塔暖金石紋檯面)
  const marbleCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#FAF8F4';
    ctx.fillRect(0, 0, w, h);
    for (let v = 0; v < 16; v++) {
      let vx = rand() * w;
      let vy = 0;
      ctx.strokeStyle = v % 3 === 0
        ? 'rgba(194, 170, 136, 0.24)'
        : 'rgba(176, 172, 166, 0.28)';
      ctx.lineWidth = 0.9 + rand() * 3.0;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      for (let s = 1; s <= 10; s++) {
        vx += (rand() - 0.46) * 65;
        vy = (s / 10) * h;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }
  });

  // 8. Fine Textile Bump Maps: Waffle Weave, Chunky Cable-Knit & French Bouclé
  const waffleBump = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#ACACAC';
    ctx.fillRect(0, 0, w, h);
    const step = 8;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        ctx.fillStyle = '#626262';
        ctx.fillRect(x + 1, y + 1, step - 3, step - 3);
        ctx.fillStyle = '#D4D4D4';
        ctx.fillRect(x, y, step - 1, 1);
      }
    }
  });

  const knitBump = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#787878';
    ctx.fillRect(0, 0, w, h);
    const cols = 12;
    const cw = w / cols;
    for (let c = 0; c < cols; c++) {
      const cx = c * cw + cw * 0.5;
      for (let y = 0; y < h; y += 10) {
        ctx.strokeStyle = '#DCDCDC';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx - cw * 0.34, y + 7);
        ctx.lineTo(cx, y + 1);
        ctx.lineTo(cx + cw * 0.34, y + 7);
        ctx.stroke();
      }
    }
  });

  const boucleBump = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#868686';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 2400; i++) {
      const bx = rand() * w;
      const by = rand() * h;
      const br = 1.4 + rand() * 2.2;
      const val = 105 + Math.floor(rand() * 125);
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 9. Braided Natural Jute & Cream Round Rug Texture (同心麻編圓毯紋理)
  const rugCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#EDE4D5';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    for (let rad = 6; rad < w * 0.5; rad += 5.0) {
      ctx.strokeStyle = Math.floor(rad / 16) % 3 === 0
        ? 'rgba(210, 193, 166, 0.88)'
        : 'rgba(245, 239, 229, 0.92)';
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // 10. Outdoor Balcony Rustic Anti-Slip Tile + Grout Bump
  const balconyTileCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#BFB6A9';
    ctx.fillRect(0, 0, w, h);
    const n = 6;
    const s = w / n;
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        const d = Math.floor((rand() - 0.5) * 12);
        ctx.fillStyle = `rgb(${224 + d}, ${214 + d}, ${201 + d})`;
        ctx.fillRect(ix * s + 2.2, iy * s + 2.2, s - 4.4, s - 4.4);
      }
    }
  });

  const balconyTileBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#383838';
    ctx.fillRect(0, 0, w, h);
    const n = 6;
    const s = w / n;
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        ctx.fillStyle = '#B8B8B8';
        ctx.fillRect(ix * s + 2.6, iy * s + 2.6, s - 5.2, s - 5.2);
      }
    }
  });

  // 11. Hand-Painted Country Botanical Art Canvases (4 Curated Variants)
  function createBotanicalArt(variant = 0) {
    const c = makeCanvas(256, 320, (ctx, w, h) => {
      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#EAE2D3';
      ctx.lineWidth = 26;
      ctx.strokeRect(13, 13, w - 26, h - 26);
      ctx.strokeStyle = '#C5B69B';
      ctx.lineWidth = 1.3;
      ctx.strokeRect(29, 29, w - 58, h - 58);

      ctx.save();
      ctx.translate(w * 0.5, h * 0.83);
      ctx.strokeStyle = '#69775A';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(variant % 2 === 0 ? -18 : 18, -98, variant % 2 === 0 ? 11 : -10, -198);
      ctx.stroke();

      const leafColors = ['#8A997A', '#718062', '#A2AE94', '#95A083'];
      for (let i = 0; i < 12; i++) {
        const t = (i + 1) / 13;
        const ly = -t * 188;
        const lx = (variant % 2 === 0 ? -7 : 7) * Math.sin(t * Math.PI);
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(side * (0.52 + (i % 3) * 0.13));
          ctx.fillStyle = leafColors[(i + variant) % leafColors.length];
          ctx.beginPath();
          ctx.ellipse(side * 14, -4, 15.5, 6.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,252,245,0.45)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(side * 2, -4);
          ctx.lineTo(side * 24, -4);
          ctx.stroke();
          ctx.restore();
        }
      }
      if (variant !== 1) {
        for (const [bx, by] of [[-12, -148], [14, -170], [0, -198]]) {
          ctx.fillStyle = '#FFFDF9';
          for (let p = 0; p < 5; p++) {
            const a = (p / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(bx + Math.cos(a) * 6.2, by + Math.sin(a) * 6.2, 5.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#D4B475';
          ctx.beginPath();
          ctx.arc(bx, by, 3.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.62 });
  }

  // Fine plaster bump
  const plasterBump = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 3800; i++) {
      const v = 114 + Math.floor(rand() * 28);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(rand() * w, rand() * h, 2, 2);
    }
  });
  const plasterBumpTex = makeTex(plasterBump, 8, 8, false);

  return {
    // Architectural Walls & Moldings
    wallPlaster: new THREE.MeshStandardMaterial({
      color: 0xf5f1e8,
      roughness: 0.85,
      metalness: 0.0,
      bumpMap: plasterBumpTex,
      bumpScale: 0.004,
    }),
    wallExterior: new THREE.MeshStandardMaterial({
      color: 0xe8e0d2,
      roughness: 0.9,
      bumpMap: plasterBumpTex,
      bumpScale: 0.005,
    }),
    wallCutCap: new THREE.MeshStandardMaterial({
      color: 0xc2b49f,
      roughness: 0.78,
    }),
    whiteTrim: new THREE.MeshStandardMaterial({
      color: 0xfdfcf9,
      roughness: 0.32,
      metalness: 0.02,
    }),
    creamShaker: new THREE.MeshStandardMaterial({
      color: 0xf9f6ef,
      roughness: 0.35,
      metalness: 0.02,
    }),
    warmIvoryCabinet: new THREE.MeshStandardMaterial({
      color: 0xf4efe5,
      roughness: 0.37,
      metalness: 0.02,
    }),
    beadboard: new THREE.MeshStandardMaterial({
      map: makeTex(beadboardColor, 4, 2),
      bumpMap: makeTex(beadboardBump, 4, 2, false),
      bumpScale: 0.009,
      roughness: 0.38,
    }),
    beadboardFine: new THREE.MeshStandardMaterial({
      map: makeTex(beadboardColor, 2, 1),
      bumpMap: makeTex(beadboardBump, 2, 1, false),
      bumpScale: 0.007,
      roughness: 0.36,
    }),

    // Floors & Tiles (All with Physical Grout Relief Bump Maps!)
    oakFloor: new THREE.MeshStandardMaterial({
      map: makeTex(oakColorCanvas, 3.6, 3.6),
      bumpMap: makeTex(oakBumpCanvas, 3.6, 3.6, false),
      bumpScale: 0.007,
      roughness: 0.5,
      metalness: 0.02,
    }),
    paleAshFloor: (() => {
      const ashCanvas = makeCanvas(1024, 1024, (ctx, w, h) => {
        ctx.fillStyle = '#DBD5CB';
        ctx.fillRect(0, 0, w, h);
        const cols = 8;
        const plankW = w / cols;
        for (let c = 0; c < cols; c++) {
          const x = c * plankW;
          const offset = (c % 3) * 290 + (c % 2) * 180;
          const plankLen = 512;
          for (let r = -1; r < 3; r++) {
            const y = r * plankLen + (offset % plankLen);
            const tone = Math.floor((rand() - 0.5) * 12);
            ctx.fillStyle = `rgb(${218 + tone}, ${212 + tone}, ${202 + tone})`;
            ctx.fillRect(x + 1, y + 1, plankW - 2, plankLen - 2);
            for (let i = 0; i < 80; i++) {
              const gx = x + 3 + rand() * (plankW - 6);
              ctx.strokeStyle = rand() > 0.5
                ? `rgba(245, 242, 237, ${0.17 + rand() * 0.16})`
                : `rgba(160, 150, 136, ${0.11 + rand() * 0.14})`;
              ctx.lineWidth = 0.75 + rand() * 1.55;
              ctx.beginPath();
              ctx.moveTo(gx, y + 2);
              ctx.bezierCurveTo(
                gx + (rand() - 0.5) * 9,
                y + plankLen * 0.35,
                gx + (rand() - 0.5) * 9,
                y + plankLen * 0.68,
                gx + (rand() - 0.5) * 4,
                y + plankLen - 2
              );
              ctx.stroke();
            }
            ctx.strokeStyle = 'rgba(140, 131, 119, 0.46)';
            ctx.lineWidth = 1.6;
            ctx.strokeRect(x + 0.75, y + 0.75, plankW - 1.5, plankLen - 1.5);
          }
        }
      });
      return new THREE.MeshStandardMaterial({
        map: makeTex(ashCanvas, 2.2, 2.2),
        bumpMap: makeTex(oakBumpCanvas, 2.2, 2.2, false),
        bumpScale: 0.006,
        roughness: 0.54,
        metalness: 0.01,
      });
    })(),
    pureMatteWhite: new THREE.MeshStandardMaterial({
      color: 0xf8f8f6,
      roughness: 0.4,
      metalness: 0.01,
    }),
    chairWeaveWhite: new THREE.MeshStandardMaterial({
      color: 0xf2f0ec,
      roughness: 0.85,
      bumpMap: makeTex(waffleBump, 16, 16, false),
      bumpScale: 0.0045,
    }),
    foyerTile: new THREE.MeshStandardMaterial({
      map: makeTex(foyerTileCanvas, 2.2, 1.8),
      bumpMap: makeTex(foyerTileBump, 2.2, 1.8, false),
      bumpScale: 0.006,
      roughness: 0.38,
      metalness: 0.03,
    }),
    bathFloorHex: new THREE.MeshStandardMaterial({
      map: makeTex(hexTileCanvas, 2.2, 2.2),
      bumpMap: makeTex(hexTileBump, 2.2, 2.2, false),
      bumpScale: 0.006,
      roughness: 0.42,
      metalness: 0.03,
    }),
    subwayTile: new THREE.MeshStandardMaterial({
      map: makeTex(subwayCanvas, 3.2, 2.2),
      bumpMap: makeTex(subwayBump, 3.2, 2.2, false),
      bumpScale: 0.007,
      roughness: 0.22,
      metalness: 0.04,
    }),
    balconyTile: new THREE.MeshStandardMaterial({
      map: makeTex(balconyTileCanvas, 2.5, 2.0),
      bumpMap: makeTex(balconyTileBump, 2.5, 2.0, false),
      bumpScale: 0.007,
      roughness: 0.72,
    }),
    marbleTop: new THREE.MeshStandardMaterial({
      map: makeTex(marbleCanvas, 1.5, 1.5),
      roughness: 0.19,
      metalness: 0.03,
    }),

    // Woods
    naturalOak: new THREE.MeshStandardMaterial({
      map: makeTex(tabletopOakCanvas, 1, 1),
      bumpMap: makeTex(tabletopOakBump, 1, 1, false),
      bumpScale: 0.0035,
      roughness: 0.44,
      metalness: 0.02,
    }),
    warmWalnutAccent: new THREE.MeshStandardMaterial({
      color: 0xa6835e,
      roughness: 0.48,
      bumpMap: makeTex(tabletopOakBump, 2, 2, false),
      bumpScale: 0.003,
    }),
    rattan: new THREE.MeshStandardMaterial({
      color: 0xd4ba94,
      roughness: 0.78,
      bumpMap: makeTex(waffleBump, 9, 9, false),
      bumpScale: 0.01,
    }),

    // Fabrics & Upholstery (White Country Palette)
    crispWhiteLinen: new THREE.MeshStandardMaterial({
      color: 0xfcfbf8,
      roughness: 0.87,
      bumpMap: makeTex(waffleBump, 9, 9, false),
      bumpScale: 0.007,
    }),
    warmCreamFabric: new THREE.MeshStandardMaterial({
      color: 0xf3ede2,
      roughness: 0.89,
      bumpMap: makeTex(waffleBump, 7, 7, false),
      bumpScale: 0.006,
    }),
    boucleWhite: new THREE.MeshStandardMaterial({
      color: 0xf6f2ea,
      roughness: 0.92,
      bumpMap: makeTex(boucleBump, 6, 6, false),
      bumpScale: 0.011,
    }),
    oatmealLinen: new THREE.MeshStandardMaterial({
      color: 0xe5dccb,
      roughness: 0.92,
      bumpMap: makeTex(waffleBump, 6, 6, false),
      bumpScale: 0.008,
    }),
    cableKnitOatmeal: new THREE.MeshStandardMaterial({
      color: 0xe4dac7,
      roughness: 0.94,
      bumpMap: makeTex(knitBump, 4, 4, false),
      bumpScale: 0.013,
    }),
    sageCountryThrow: new THREE.MeshStandardMaterial({
      color: 0xc8d0bd,
      roughness: 0.9,
      bumpMap: makeTex(knitBump, 5, 5, false),
      bumpScale: 0.009,
    }),
    dustyChambrayThrow: new THREE.MeshStandardMaterial({
      color: 0xd5dce0,
      roughness: 0.9,
      bumpMap: makeTex(waffleBump, 5, 5, false),
      bumpScale: 0.007,
    }),
    sheerCurtain: new THREE.MeshStandardMaterial({
      color: 0xfffefb,
      roughness: 0.84,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    }),
    juteRug: new THREE.MeshStandardMaterial({
      map: makeTex(rugCanvas, 1, 1),
      bumpMap: makeTex(waffleBump, 12, 12, false),
      bumpScale: 0.011,
      roughness: 0.95,
    }),

    // Metals, Appliances, Ceramics & Glass
    antiqueBrass: new THREE.MeshStandardMaterial({
      color: 0xc9a86a,
      roughness: 0.27,
      metalness: 0.85,
    }),
    copperAccent: new THREE.MeshStandardMaterial({
      color: 0xc9835b,
      roughness: 0.26,
      metalness: 0.86,
    }),
    brushedNickel: new THREE.MeshStandardMaterial({
      color: 0xd9d9d5,
      roughness: 0.26,
      metalness: 0.86,
    }),
    stainlessSteel: new THREE.MeshStandardMaterial({
      color: 0xcfcfcd,
      roughness: 0.22,
      metalness: 0.9,
    }),
    castIronDark: new THREE.MeshStandardMaterial({
      color: 0x2f2e2c,
      roughness: 0.56,
      metalness: 0.58,
    }),
    darkApplianceGlass: new THREE.MeshPhysicalMaterial({
      color: 0x1e2022,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.86,
    }),
    rubberGasket: new THREE.MeshStandardMaterial({
      color: 0x2a2c2e,
      roughness: 0.78,
      metalness: 0.05,
    }),
    porcelainGloss: new THREE.MeshPhysicalMaterial({
      color: 0xfdfcfa,
      roughness: 0.1,
      metalness: 0.0,
      clearcoat: 0.78,
      clearcoatRoughness: 0.08,
    }),
    amberGlass: new THREE.MeshPhysicalMaterial({
      color: 0x9b642c,
      roughness: 0.1,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.82,
    }),
    waterSurface: new THREE.MeshPhysicalMaterial({
      color: 0xdcf0f4,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.58,
    }),
    mirror: new THREE.MeshStandardMaterial({
      color: 0xf2f5f7,
      roughness: 0.03,
      metalness: 0.97,
    }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: 0xeef6f8,
      roughness: 0.06,
      metalness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.28,
    }),
    frostedGlass: new THREE.MeshPhysicalMaterial({
      color: 0xf6f8f6,
      roughness: 0.36,
      clearcoat: 0.5,
      transparent: true,
      opacity: 0.72,
      bumpMap: makeTex(beadboardBump, 9, 1, false),
      bumpScale: 0.008,
    }),
    milkGlassLamp: new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      emissive: 0xffdf9e,
      emissiveIntensity: 0.45,
      roughness: 0.3,
    }),
    warmBulbEmissive: new THREE.MeshStandardMaterial({
      color: 0xfff6e0,
      emissive: 0xffcf78,
      emissiveIntensity: 1.1,
      roughness: 0.2,
    }),
    digitalLed: new THREE.MeshStandardMaterial({
      color: 0x16181a,
      emissive: 0xffdfaa,
      emissiveIntensity: 0.55,
      roughness: 0.2,
    }),

    // Botanicals & Props
    foliageSage: new THREE.MeshStandardMaterial({
      color: 0x6b805d,
      roughness: 0.68,
      side: THREE.DoubleSide,
    }),
    foliageOlive: new THREE.MeshStandardMaterial({
      color: 0x849474,
      roughness: 0.72,
      side: THREE.DoubleSide,
    }),
    woodBark: new THREE.MeshStandardMaterial({
      color: 0x74604c,
      roughness: 0.88,
    }),
    terracottaCream: new THREE.MeshStandardMaterial({
      color: 0xebe3d5,
      roughness: 0.74,
    }),
    soil: new THREE.MeshStandardMaterial({
      color: 0x514335,
      roughness: 0.95,
    }),
    art0: createBotanicalArt(0),
    art1: createBotanicalArt(1),
    art2: createBotanicalArt(2),
    art3: createBotanicalArt(3),
  };
}
