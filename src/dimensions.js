import * as THREE from 'three';
import { cm } from './primitives.js';

function makeLabelSprite(text, fontSize = 36, sub = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 88;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 88);

  // Subtle warm pill backdrop for crisp legibility at any angle
  ctx.font = `${sub ? '500' : '600'} ${fontSize}px "Inter", "Noto Sans TC", sans-serif`;
  const metrics = ctx.measureText(text);
  const pw = Math.min(244, metrics.width + 34);
  const ph = 52;
  const rx = (256 - pw) / 2;
  const ry = (88 - ph) / 2;

  ctx.fillStyle = sub ? 'rgba(250, 246, 238, 0.88)' : 'rgba(42, 35, 28, 0.84)';
  ctx.beginPath();
  ctx.roundRect(rx, ry, pw, ph, 26);
  ctx.fill();

  ctx.fillStyle = sub ? '#5c4d3c' : '#fcf8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 45);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  const scale = sub ? 0.56 : 0.44;
  sprite.scale.set(scale * (256 / 88), scale, 1);
  sprite.renderOrder = 20;
  return sprite;
}

export function createDimensionsGroup() {
  const group = new THREE.Group();
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x6b5a45,
    transparent: true,
    opacity: 0.78,
    depthTest: false,
  });

  const yLevel = cm(3.5);

  function addDim(x1, z1, x2, z2, label) {
    const p1 = new THREE.Vector3(cm(x1), yLevel, cm(z1));
    const p2 = new THREE.Vector3(cm(x2), yLevel, cm(z2));
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    if (len < 0.01) return;
    dir.normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x);

    // Main dimension line + architectural 45-deg tick marks
    const tick = cm(5.5);
    const slash1 = new THREE.Vector3().addVectors(dir, perp).normalize().multiplyScalar(tick);

    const pts = [
      p1.clone().sub(slash1),
      p1.clone().add(slash1),
      p1.clone(),
      p2.clone(),
      p2.clone().sub(slash1),
      p2.clone().add(slash1),
    ];
    // Build segments
    const segGeo = new THREE.BufferGeometry().setFromPoints([
      p1, p2,
      p1.clone().sub(slash1), p1.clone().add(slash1),
      p2.clone().sub(slash1), p2.clone().add(slash1),
      p1.clone().sub(perp.clone().multiplyScalar(cm(6))), p1.clone().add(perp.clone().multiplyScalar(cm(6))),
      p2.clone().sub(perp.clone().multiplyScalar(cm(6))), p2.clone().add(perp.clone().multiplyScalar(cm(6))),
    ]);
    const segs = new THREE.LineSegments(segGeo, lineMat);
    segs.renderOrder = 18;
    group.add(segs);

    const sp = makeLabelSprite(label);
    sp.position.copy(p1).add(p2).multiplyScalar(0.5);
    sp.position.y = yLevel + cm(8);
    group.add(sp);
  }

  // Central Horizontal Chain: 115 + 110 + 175 + 200 + 163
  addDim(78, 512, 193, 512, '115');
  addDim(193, 512, 303, 512, '110');
  addDim(303, 512, 478, 512, '175');
  addDim(478, 512, 678, 512, '200');
  addDim(678, 512, 838, 512, '163');

  // Entryway & Kitchen Vertical Chains
  addDim(188, 326, 428, 326, '240');
  addDim(170, 271, 170, 306, '35');
  addDim(170, 306, 170, 405, '100');
  addDim(170, 405, 170, 500, '95');
  addDim(170, 506, 170, 588, '85');
  addDim(170, 588, 170, 652, '65');
  addDim(96, 402, 96, 652, '250');
  addDim(254, 540, 304, 540, '50');
  // Diagonal 96 cm clearance between Entryway Cabinet SE corner and Dining Table NW corner!
  addDim(428, 306, 488, 372, '96');

  // Living / Dining Vertical Chain: 100 + 90 + 100
  addDim(520, 269, 520, 369, '100');
  addDim(520, 369, 520, 459, '90');
  addDim(520, 459, 520, 557, '100');

  // Master Bedroom Chains: 93 + 60 + 185 + 75, and 50 + 190 + 5, 165
  addDim(428, 118, 521, 118, '93');
  addDim(521, 118, 581, 118, '60');
  addDim(581, 118, 766, 118, '185');
  addDim(766, 118, 838, 118, '75');
  addDim(502, 94, 502, 259, '165');
  addDim(738, 15, 738, 64, '50');
  addDim(738, 64, 738, 254, '190');

  // South-West Bedroom 2: 40, 35, 109, 94, 190, 60+68+110
  addDim(264, 642, 304, 642, '40');
  addDim(402, 642, 437, 642, '35');
  addDim(437, 642, 546, 642, '109');
  addDim(264, 718, 358, 718, '94');
  addDim(358, 718, 546, 718, '190');
  addDim(436, 627, 436, 693, '68');
  addDim(436, 693, 436, 803, '110');

  // South-East Bedroom 3: 145, 45, 68, 110
  addDim(556, 642, 701, 642, '145');
  addDim(701, 642, 746, 642, '45');
  addDim(698, 627, 698, 693, '68');
  addDim(698, 693, 698, 803, '110');

  group.visible = false;
  return group;
}
