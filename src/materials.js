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

  // 1. Whitewashed Light Oak Plank Floor (淺白刷紋橡木地板 — 溫潤木紋襯托純白鄉村線板)
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
        const baseR = 222 + tone;
        const baseG = 203 + tone;
        const baseB = 177 + Math.floor(tone * 0.85);
        ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
        ctx.fillRect(x + 1, y + 1, plankW - 2, plankLen - 2);

        // Subtle cathedral & linear wood grain + whitewash streaks
        for (let i = 0; i < 65; i++) {
          const gx = x + 3 + rand() * (plankW - 6);
          const isWhitewash = rand() > 0.58;
          ctx.strokeStyle = isWhitewash
            ? `rgba(248, 243, 234, ${0.15 + rand() * 0.16})`
            : `rgba(154, 124, 88, ${0.12 + rand() * 0.16})`;
          ctx.lineWidth = 0.8 + rand() * 1.7;
          ctx.beginPath();
          ctx.moveTo(gx, y + 2);
          ctx.bezierCurveTo(
            gx + (rand() - 0.5) * 8,
            y + plankLen * 0.33,
            gx + (rand() - 0.5) * 8,
            y + plankLen * 0.66,
            gx + (rand() - 0.5) * 4,
            y + plankLen - 2
          );
          ctx.stroke();
        }

        // Plank bevel joint lines
        ctx.strokeStyle = 'rgba(128, 102, 74, 0.52)';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(x + 0.75, y + 0.75, plankW - 1.5, plankLen - 1.5);
      }
    }
  });

  const oakBumpCanvas = makeCanvas(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, w, h);
    const cols = 8;
    const plankW = w / cols;
    for (let c = 0; c < cols; c++) {
      const x = c * plankW;
      const offset = (c % 3) * 310 + (c % 2) * 170;
      const plankLen = 512;
      for (let r = -1; r < 3; r++) {
        const y = r * plankLen + (offset % plankLen);
        ctx.strokeStyle = '#303030';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(x + 1, y + 1, plankW - 2, plankLen - 2);
        for (let i = 0; i < 30; i++) {
          const gx = x + 3 + rand() * (plankW - 6);
          ctx.strokeStyle = 'rgba(110,110,110,0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx, y + 2);
          ctx.lineTo(gx, y + plankLen - 2);
          ctx.stroke();
        }
      }
    }
  });

  // 2. Natural Warm White-Oak Tabletop Wood (鄉村風白橡木實木桌面)
  const tabletopOakCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#DFCBB0';
    ctx.fillRect(0, 0, w, h);
    const boards = 6;
    const bh = h / boards;
    for (let b = 0; b < boards; b++) {
      const y = b * bh;
      const shift = Math.floor((rand() - 0.5) * 10);
      ctx.fillStyle = `rgb(${224 + shift}, ${204 + shift}, ${177 + shift})`;
      ctx.fillRect(0, y, w, bh);
      for (let i = 0; i < 70; i++) {
        const gy = y + rand() * bh;
        ctx.strokeStyle = rand() > 0.45
          ? `rgba(248, 242, 232, ${0.12 + rand() * 0.14})`
          : `rgba(166, 136, 98, ${0.09 + rand() * 0.13})`;
        ctx.lineWidth = 0.8 + rand() * 1.8;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(w * 0.33, gy + (rand() - 0.5) * 7, w * 0.66, gy + (rand() - 0.5) * 7, w, gy);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(155, 128, 96, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });

  // 3. Entryway French Country Octagonal Cabochon Tile (玄關法式八角花磚)
  const foyerTileCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#D9D2C5'; // grout
    ctx.fillRect(0, 0, w, h);
    const n = 4;
    const cell = w / n;
    const cut = cell * 0.21;
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        const x = ix * cell;
        const y = iy * cell;
        const pad = 2.2;
        ctx.fillStyle = (ix + iy) % 2 === 0 ? '#F9F6F0' : '#F4EFE6';
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
    // Diamond cabochons at intersections (warm sage-taupe country tone)
    ctx.fillStyle = '#9BA08E';
    for (let ix = 0; ix <= n; ix++) {
      for (let iy = 0; iy <= n; iy++) {
        const cx = ix * cell;
        const cy = iy * cell;
        const r = cut - 2.2;
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

  // 4. White Country Beadboard / Vertical V-Groove Paneling (白色企口板)
  const beadboardColor = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#FAF8F3';
    ctx.fillRect(0, 0, w, h);
    const strips = 16;
    const sw = w / strips;
    for (let i = 0; i < strips; i++) {
      const x = i * sw;
      // Subtle highlight + groove shadow
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.fillRect(x + 1.5, 0, 2, h);
      ctx.fillStyle = 'rgba(195, 186, 172, 0.55)';
      ctx.fillRect(x, 0, 1.8, h);
      // Secondary micro bead line typical of classic country beadboard
      ctx.fillStyle = 'rgba(206, 198, 184, 0.38)';
      ctx.fillRect(x + 6, 0, 1.1, h);
    }
  });

  const beadboardBump = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#B0B0B0';
    ctx.fillRect(0, 0, w, h);
    const strips = 16;
    const sw = w / strips;
    for (let i = 0; i < strips; i++) {
      const x = i * sw;
      ctx.fillStyle = '#383838';
      ctx.fillRect(x, 0, 2.2, h);
      ctx.fillStyle = '#686868';
      ctx.fillRect(x + 6, 0, 1.4, h);
    }
  });

  // 5. White Subway Tile (廚房防濺板與衛浴鐵道磚)
  const subwayCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#DDD7CC';
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
        const v = 249 + Math.floor((rand() - 0.5) * 6);
        ctx.fillStyle = `rgb(${v}, ${v - 2}, ${v - 5})`;
        ctx.fillRect(x + 2, y + 2, tw - 4, th - 4);
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x + 3, y + 3, tw - 6, th - 6);
      }
    }
  });

  // 6. Bathroom Hexagonal Carrara Mosaic Floor Tile (大理石六角地磚)
  const hexTileCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#D5CFC5';
    ctx.fillRect(0, 0, w, h);
    const r = 24;
    const dx = r * 1.732;
    const dy = r * 1.5;
    for (let row = -1; row < h / dy + 2; row++) {
      for (let col = -1; col < w / dx + 2; col++) {
        const cx = col * dx + (row % 2 ? dx * 0.5 : 0);
        const cy = row * dy;
        const shade = 244 + Math.floor((rand() - 0.5) * 10);
        ctx.fillStyle = `rgb(${shade}, ${shade - 1}, ${shade - 4})`;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ang = (Math.PI / 3) * k + Math.PI / 6;
          const px = cx + (r - 1.8) * Math.cos(ang);
          const py = cy + (r - 1.8) * Math.sin(ang);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        if (rand() > 0.5) {
          ctx.strokeStyle = 'rgba(185, 180, 174, 0.35)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(cx - r * 0.5, cy - r * 0.2);
          ctx.lineTo(cx + r * 0.45, cy + r * 0.3);
          ctx.stroke();
        }
      }
    }
  });

  // 7. Calacatta Warm White Marble / Quartz Countertop (暖白石紋檯面)
  const marbleCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#FAF8F4';
    ctx.fillRect(0, 0, w, h);
    for (let v = 0; v < 14; v++) {
      let vx = rand() * w;
      let vy = 0;
      ctx.strokeStyle = v % 3 === 0
        ? 'rgba(196, 174, 142, 0.22)'
        : 'rgba(182, 178, 172, 0.26)';
      ctx.lineWidth = 1 + rand() * 3.2;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      for (let s = 1; s <= 8; s++) {
        vx += (rand() - 0.45) * 75;
        vy = (s / 8) * h;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }
  });

  // 8. Crisp White Waffle Linen & Oatmeal Woven Fabric (純白華夫格與亞麻布料)
  const waffleBump = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#A8A8A8';
    ctx.fillRect(0, 0, w, h);
    const step = 8;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        ctx.fillStyle = '#6A6A6A';
        ctx.fillRect(x + 1, y + 1, step - 3, step - 3);
      }
    }
  });

  // 9. Braided Natural Jute & Cream Round Rug Texture (編織圓地毯紋理)
  const rugCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#EDE4D5';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    for (let rad = 8; rad < w * 0.5; rad += 5.5) {
      ctx.strokeStyle = Math.floor(rad / 18) % 3 === 0
        ? 'rgba(214, 198, 173, 0.85)'
        : 'rgba(244, 238, 228, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // 10. Outdoor Balcony Rustic Tile (工作陽台復古防滑地磚)
  const balconyTileCanvas = makeCanvas(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#C9C0B4';
    ctx.fillRect(0, 0, w, h);
    const n = 6;
    const s = w / n;
    for (let ix = 0; ix < n; ix++) {
      for (let iy = 0; iy < n; iy++) {
        const d = Math.floor((rand() - 0.5) * 10);
        ctx.fillStyle = `rgb(${224 + d}, ${214 + d}, ${201 + d})`;
        ctx.fillRect(ix * s + 2, iy * s + 2, s - 4, s - 4);
      }
    }
  });

  // 11. Hand-Painted Country Botanical Art Canvases (鄉村風植物水彩畫)
  function createBotanicalArt(variant = 0) {
    const c = makeCanvas(256, 320, (ctx, w, h) => {
      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(0, 0, w, h);
      // Matboard border
      ctx.strokeStyle = '#E6DECFE0';
      ctx.lineWidth = 24;
      ctx.strokeRect(12, 12, w - 24, h - 24);
      ctx.strokeStyle = '#C8BA9F';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(28, 28, w - 56, h - 56);

      // Stem & olive/eucalyptus leaves
      ctx.save();
      ctx.translate(w * 0.5, h * 0.82);
      ctx.strokeStyle = '#6D7A5E';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(variant % 2 === 0 ? -16 : 16, -95, variant % 2 === 0 ? 10 : -8, -195);
      ctx.stroke();

      const leafColors = ['#8B9A7B', '#738264', '#A4B096', '#98A286'];
      for (let i = 0; i < 11; i++) {
        const t = (i + 1) / 12;
        const ly = -t * 185;
        const lx = (variant % 2 === 0 ? -6 : 6) * Math.sin(t * Math.PI);
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(side * (0.55 + (i % 3) * 0.12));
          ctx.fillStyle = leafColors[(i + variant) % leafColors.length];
          ctx.beginPath();
          ctx.ellipse(side * 14, -4, 15, 6.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      // Delicate white country blossoms
      if (variant !== 1) {
        for (const [bx, by] of [[-12, -145], [14, -168], [0, -195]]) {
          ctx.fillStyle = '#FFFDF9';
          for (let p = 0; p < 5; p++) {
            const a = (p / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(bx + Math.cos(a) * 6, by + Math.sin(a) * 6, 5.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#D4B475';
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65 });
  }

  // Fine plaster bump
  const plasterBump = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 3500; i++) {
      const v = 115 + Math.floor(rand() * 26);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(rand() * w, rand() * h, 2, 2);
    }
  });
  const plasterBumpTex = makeTex(plasterBump, 8, 8, false);

  return {
    // Architectural Walls & Moldings
    wallPlaster: new THREE.MeshStandardMaterial({
      color: 0xf5f1e8,
      roughness: 0.86,
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
      roughness: 0.34,
      metalness: 0.02,
    }),
    creamShaker: new THREE.MeshStandardMaterial({
      color: 0xf9f6ef,
      roughness: 0.36,
      metalness: 0.02,
    }),
    warmIvoryCabinet: new THREE.MeshStandardMaterial({
      color: 0xf4efe5,
      roughness: 0.38,
      metalness: 0.02,
    }),
    beadboard: new THREE.MeshStandardMaterial({
      map: makeTex(beadboardColor, 4, 2),
      bumpMap: makeTex(beadboardBump, 4, 2, false),
      bumpScale: 0.008,
      roughness: 0.4,
    }),
    beadboardFine: new THREE.MeshStandardMaterial({
      map: makeTex(beadboardColor, 2, 1),
      bumpMap: makeTex(beadboardBump, 2, 1, false),
      bumpScale: 0.006,
      roughness: 0.38,
    }),

    // Floors & Tiles
    oakFloor: new THREE.MeshStandardMaterial({
      map: makeTex(oakColorCanvas, 3.6, 3.6),
      bumpMap: makeTex(oakBumpCanvas, 3.6, 3.6, false),
      bumpScale: 0.006,
      roughness: 0.52,
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
            for (let i = 0; i < 70; i++) {
              const gx = x + 3 + rand() * (plankW - 6);
              ctx.strokeStyle = rand() > 0.5
                ? `rgba(244, 241, 236, ${0.16 + rand() * 0.16})`
                : `rgba(162, 152, 138, ${0.11 + rand() * 0.14})`;
              ctx.lineWidth = 0.8 + rand() * 1.6;
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
            ctx.strokeStyle = 'rgba(142, 133, 121, 0.44)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 0.75, y + 0.75, plankW - 1.5, plankLen - 1.5);
          }
        }
      });
      return new THREE.MeshStandardMaterial({
        map: makeTex(ashCanvas, 2.2, 2.2),
        bumpMap: makeTex(oakBumpCanvas, 2.2, 2.2, false),
        bumpScale: 0.005,
        roughness: 0.56,
        metalness: 0.01,
      });
    })(),
    pureMatteWhite: new THREE.MeshStandardMaterial({
      color: 0xf8f8f6,
      roughness: 0.42,
      metalness: 0.01,
    }),
    chairWeaveWhite: new THREE.MeshStandardMaterial({
      color: 0xf2f0ec,
      roughness: 0.86,
      bumpMap: makeTex(waffleBump, 14, 14, false),
      bumpScale: 0.004,
    }),
    foyerTile: new THREE.MeshStandardMaterial({
      map: makeTex(foyerTileCanvas, 2.2, 1.8),
      roughness: 0.42,
      metalness: 0.03,
    }),
    bathFloorHex: new THREE.MeshStandardMaterial({
      map: makeTex(hexTileCanvas, 2.2, 2.2),
      roughness: 0.45,
      metalness: 0.03,
    }),
    subwayTile: new THREE.MeshStandardMaterial({
      map: makeTex(subwayCanvas, 3.2, 2.2),
      roughness: 0.25,
      metalness: 0.04,
    }),
    balconyTile: new THREE.MeshStandardMaterial({
      map: makeTex(balconyTileCanvas, 2.5, 2.0),
      roughness: 0.72,
    }),
    marbleTop: new THREE.MeshStandardMaterial({
      map: makeTex(marbleCanvas, 1.5, 1.5),
      roughness: 0.22,
      metalness: 0.03,
    }),

    // Woods
    naturalOak: new THREE.MeshStandardMaterial({
      map: makeTex(tabletopOakCanvas, 1, 1),
      roughness: 0.46,
      metalness: 0.02,
    }),
    warmWalnutAccent: new THREE.MeshStandardMaterial({
      color: 0xb59572,
      roughness: 0.52,
    }),
    rattan: new THREE.MeshStandardMaterial({
      color: 0xd4ba94,
      roughness: 0.78,
      bumpMap: makeTex(waffleBump, 6, 6, false),
      bumpScale: 0.008,
    }),

    // Fabrics & Upholstery (White Country Palette)
    crispWhiteLinen: new THREE.MeshStandardMaterial({
      color: 0xfcfbf8,
      roughness: 0.88,
      bumpMap: makeTex(waffleBump, 8, 8, false),
      bumpScale: 0.007,
    }),
    warmCreamFabric: new THREE.MeshStandardMaterial({
      color: 0xf3ede2,
      roughness: 0.9,
      bumpMap: makeTex(waffleBump, 6, 6, false),
      bumpScale: 0.006,
    }),
    oatmealLinen: new THREE.MeshStandardMaterial({
      color: 0xe5dccb,
      roughness: 0.92,
      bumpMap: makeTex(waffleBump, 5, 5, false),
      bumpScale: 0.008,
    }),
    sageCountryThrow: new THREE.MeshStandardMaterial({
      color: 0xcbd1c0,
      roughness: 0.9,
      bumpMap: makeTex(waffleBump, 5, 5, false),
      bumpScale: 0.007,
    }),
    dustyChambrayThrow: new THREE.MeshStandardMaterial({
      color: 0xd5dce0,
      roughness: 0.9,
      bumpMap: makeTex(waffleBump, 5, 5, false),
      bumpScale: 0.007,
    }),
    sheerCurtain: new THREE.MeshPhysicalMaterial({
      color: 0xfffefb,
      roughness: 0.82,
      transmission: 0.48,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    }),
    juteRug: new THREE.MeshStandardMaterial({
      map: makeTex(rugCanvas, 1, 1),
      bumpMap: makeTex(waffleBump, 10, 10, false),
      bumpScale: 0.01,
      roughness: 0.95,
    }),

    // Metals, Ceramics & Glass
    antiqueBrass: new THREE.MeshStandardMaterial({
      color: 0xc8a96e,
      roughness: 0.3,
      metalness: 0.82,
    }),
    brushedNickel: new THREE.MeshStandardMaterial({
      color: 0xd8d8d4,
      roughness: 0.28,
      metalness: 0.85,
    }),
    castIronDark: new THREE.MeshStandardMaterial({
      color: 0x333230,
      roughness: 0.58,
      metalness: 0.55,
    }),
    porcelainGloss: new THREE.MeshPhysicalMaterial({
      color: 0xfdfcfa,
      roughness: 0.12,
      metalness: 0.0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
    }),
    mirror: new THREE.MeshStandardMaterial({
      color: 0xf2f5f7,
      roughness: 0.04,
      metalness: 0.96,
    }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: 0xf4f9fa,
      roughness: 0.06,
      metalness: 0.0,
      transmission: 0.86,
      transparent: true,
      opacity: 0.34,
      ior: 1.5,
    }),
    frostedGlass: new THREE.MeshPhysicalMaterial({
      color: 0xf7f8f6,
      roughness: 0.42,
      transmission: 0.65,
      transparent: true,
      opacity: 0.68,
      bumpMap: makeTex(beadboardBump, 6, 1, false),
      bumpScale: 0.005,
    }),
    milkGlassLamp: new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      emissive: 0xffdf9e,
      emissiveIntensity: 0.45,
      roughness: 0.32,
    }),
    warmBulbEmissive: new THREE.MeshStandardMaterial({
      color: 0xfff6e0,
      emissive: 0xffcf78,
      emissiveIntensity: 1.1,
      roughness: 0.2,
    }),

    // Botanicals & Props
    foliageSage: new THREE.MeshStandardMaterial({
      color: 0x6f8362,
      roughness: 0.72,
      side: THREE.DoubleSide,
    }),
    foliageOlive: new THREE.MeshStandardMaterial({
      color: 0x859476,
      roughness: 0.75,
      side: THREE.DoubleSide,
    }),
    terracottaCream: new THREE.MeshStandardMaterial({
      color: 0xebe3d5,
      roughness: 0.76,
    }),
    soil: new THREE.MeshStandardMaterial({
      color: 0x56483a,
      roughness: 0.95,
    }),
    art0: createBotanicalArt(0),
    art1: createBotanicalArt(1),
    art2: createBotanicalArt(2),
  };
}
