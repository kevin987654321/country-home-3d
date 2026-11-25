import * as THREE from 'three';

export const cm = (v) => v * 0.01;

// Helper to tag interactive/inspectable furniture & architectural elements
export function tagItem(obj, title, meta) {
  obj.userData.inspectTitle = title;
  obj.userData.inspectMeta = meta;
  return obj;
}

export function enableShadows(root, cast = true, receive = true) {
  root.traverse((child) => {
    if (child.isMesh) {
      if (child.material && child.material.transparent && child.material.opacity < 0.65) {
        child.castShadow = false;
      } else {
        child.castShadow = cast;
      }
      child.receiveShadow = receive;
    }
  });
  return root;
}

const _slabGeoCache = new Map();
const _panelGeoCache = new Map();
const _legGeoCache = new Map();
const _bookGeoCache = new Map();

// Extruded rounded rectangle centered in X/Z, bottom at y=0, height = h
export function createRoundedSlab(width, depth, height, radius, material, bevel = cm(0.4)) {
  const safeBevel = Math.min(bevel, width * 0.22, depth * 0.22, height * 0.42);
  const key = `${width.toFixed(4)}_${depth.toFixed(4)}_${height.toFixed(4)}_${radius.toFixed(4)}_${safeBevel.toFixed(4)}`;
  let geo = _slabGeoCache.get(key);
  if (!geo) {
    const hw = Math.max(0.001, width / 2 - safeBevel);
    const hd = Math.max(0.001, depth / 2 - safeBevel);
    const r = Math.min(radius, hw * 0.95, hd * 0.95);

    const shape = new THREE.Shape();
    shape.moveTo(-hw + r, -hd);
    shape.lineTo(hw - r, -hd);
    if (r > 0.0005) shape.absarc(hw - r, -hd + r, r, -Math.PI / 2, 0, false);
    shape.lineTo(hw, hd - r);
    if (r > 0.0005) shape.absarc(hw - r, hd - r, r, 0, Math.PI / 2, false);
    shape.lineTo(-hw + r, hd);
    if (r > 0.0005) shape.absarc(-hw + r, hd - r, r, Math.PI / 2, Math.PI, false);
    shape.lineTo(-hw, -hd + r);
    if (r > 0.0005) shape.absarc(-hw + r, -hd + r, r, Math.PI, Math.PI * 1.5, false);

    geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.0015, height - safeBevel * 2),
      bevelEnabled: safeBevel > 0.0002,
      bevelThickness: safeBevel,
      bevelSize: safeBevel,
      bevelSegments: 2,
      curveSegments: 12,
    });
    geo.rotateX(Math.PI / 2);
    geo.computeBoundingBox();
    const minY = geo.boundingBox.min.y;
    geo.translate(0, -minY, 0);

    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = pos.getZ(i);
      uv.setXY(i, (px + width / 2) / Math.max(width, 0.5) + py * 0.2, (pz + depth / 2) / Math.max(depth, 0.5));
    }
    uv.needsUpdate = true;
    _slabGeoCache.set(key, geo);
  }

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// True Beveled Fielded Raised Panel (立體斜邊凸芯門板, centered in X/Y, total thickness = thick along Z)
export function createRaisedPanel(w, h, thick, material, bevelW = cm(2.6)) {
  const bw = Math.min(bevelW, w * 0.28, h * 0.28);
  const key = `${w.toFixed(4)}_${h.toFixed(4)}_${thick.toFixed(4)}_${bw.toFixed(4)}`;
  let geo = _panelGeoCache.get(key);
  if (!geo) {
    const hw = Math.max(0.002, w / 2 - bw);
    const hh = Math.max(0.002, h / 2 - bw);
    const sh = new THREE.Shape();
    sh.moveTo(-hw, -hh);
    sh.lineTo(hw, -hh);
    sh.lineTo(hw, hh);
    sh.lineTo(-hw, hh);
    sh.closePath();

    geo = new THREE.ExtrudeGeometry(sh, {
      depth: Math.max(0.002, thick * 0.34),
      bevelEnabled: true,
      bevelThickness: thick * 0.33,
      bevelSize: bw,
      bevelSegments: 2,
    });
    geo.computeBoundingBox();
    const centerZ = (geo.boundingBox.min.z + geo.boundingBox.max.z) / 2;
    geo.translate(0, 0, -centerZ);
    _panelGeoCache.set(key, geo);
  }
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Turned Country Baluster Leg (高精度車枳實木桌椅腳，含細緻雙環珠線與選配黃銅腳套)
export function createTurnedLeg(height, maxRadius, material, brassFerrule = false) {
  const key = `${height.toFixed(4)}_${maxRadius.toFixed(4)}`;
  let geo = _legGeoCache.get(key);
  if (!geo) {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(maxRadius * 0.48, 0),
      new THREE.Vector2(maxRadius * 0.62, height * 0.035),
      new THREE.Vector2(maxRadius * 0.44, height * 0.075),
      new THREE.Vector2(maxRadius * 0.64, height * 0.115),
      new THREE.Vector2(maxRadius * 0.50, height * 0.15),
      new THREE.Vector2(maxRadius * 0.80, height * 0.33),
      new THREE.Vector2(maxRadius * 0.98, height * 0.52),
      new THREE.Vector2(maxRadius * 0.84, height * 0.63),
      new THREE.Vector2(maxRadius * 0.66, height * 0.68),
      new THREE.Vector2(maxRadius * 0.94, height * 0.725),
      new THREE.Vector2(maxRadius * 0.64, height * 0.77),
      new THREE.Vector2(maxRadius * 0.92, height * 0.815),
      new THREE.Vector2(maxRadius * 0.72, height * 0.845),
      new THREE.Vector2(maxRadius * 0.96, height * 0.87),
      new THREE.Vector2(maxRadius * 0.96, height),
      new THREE.Vector2(0, height),
    ];
    geo = new THREE.LatheGeometry(pts, 20);
    _legGeoCache.set(key, geo);
  }
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (!brassFerrule) return mesh;

  const grp = new THREE.Group();
  grp.add(mesh);
  return grp;
}

// Authentic Hardcover Book with Overhanging Cover Boards, Spine Headbands & Recessed Cream Page Block
export function createHardcoverBook(spineThick, depth, height, coverMat, pageMat) {
  const key = `${spineThick.toFixed(4)}_${depth.toFixed(4)}_${height.toFixed(4)}`;
  let parts = _bookGeoCache.get(key);
  if (!parts) {
    const boardT = Math.min(cm(0.28), spineThick * 0.14);
    const innerT = Math.max(cm(0.4), spineThick - boardT * 2);
    parts = {
      boardT,
      boardGeo: new THREE.BoxGeometry(boardT, height, depth),
      spineGeo: new THREE.CylinderGeometry(spineThick / 2, spineThick / 2, height, 10, 1, false, 0, Math.PI),
      pagesGeo: new THREE.BoxGeometry(innerT, height - cm(0.6), depth - cm(0.65)),
      bandGeo: new THREE.BoxGeometry(spineThick + cm(0.08), cm(0.22), cm(0.4)),
    };
    _bookGeoCache.set(key, parts);
  }
  const g = new THREE.Group();
  const boardL = new THREE.Mesh(parts.boardGeo, coverMat);
  boardL.position.set(-spineThick / 2 + parts.boardT / 2, height / 2, 0);
  const boardR = new THREE.Mesh(parts.boardGeo, coverMat);
  boardR.position.set(spineThick / 2 - parts.boardT / 2, height / 2, 0);
  const spine = new THREE.Mesh(parts.spineGeo, coverMat);
  spine.position.set(0, height / 2, depth / 2 - cm(0.25));
  const pages = new THREE.Mesh(parts.pagesGeo, pageMat);
  pages.position.set(0, height / 2, -cm(0.15));
  const band1 = new THREE.Mesh(parts.bandGeo, coverMat);
  band1.position.set(0, height * 0.78, depth / 2 - cm(0.1));
  const band2 = new THREE.Mesh(parts.bandGeo, coverMat);
  band2.position.set(0, height * 0.22, depth / 2 - cm(0.1));
  g.add(boardL, boardR, spine, pages, band1, band2);
  return g;
}

// Authentic Country Shaker / Mullioned Glass / Louvered Cabinet Door Face (facing +Z, centered X/Y)
export function createShakerDoorFace(w, h, mats, opts = {}) {
  const {
    glass = false,
    louver = false,
    knobSide = 'right',
    knobYRatio = 0.5,
    frameW = cm(5.2),
    thick = cm(2.1),
  } = opts;

  const group = new THREE.Group();
  const railW = Math.min(frameW, w * 0.24);
  const innerW = Math.max(cm(4), w - railW * 2);
  const innerH = Math.max(cm(4), h - railW * 2);

  if (glass) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), innerH + cm(1), cm(0.5)), mats.clearGlass);
    group.add(pane);
    // Putty-chamfered country cross mullions
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(cm(1.35), innerH, cm(1.3)), mats.creamShaker);
    const vBead = new THREE.Mesh(new THREE.BoxGeometry(cm(0.75), innerH, cm(1.6)), mats.whiteTrim);
    group.add(vBar, vBead);
    const hBars = h > cm(65) ? 2 : 1;
    for (let i = 1; i <= hBars; i++) {
      const yPos = -innerH / 2 + (innerH * i) / (hBars + 1);
      const hb = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(1.35), cm(1.3)), mats.creamShaker);
      hb.position.y = yPos;
      const hBead = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(0.75), cm(1.6)), mats.whiteTrim);
      hBead.position.y = yPos;
      group.add(hb, hBead);
    }
  } else {
    const panelMat = louver ? mats.creamShaker : mats.beadboard;
    const centerPanel = new THREE.Mesh(
      new THREE.BoxGeometry(innerW + cm(0.8), innerH + cm(0.8), thick * 0.52),
      panelMat
    );
    centerPanel.position.z = -thick * 0.16;
    group.add(centerPanel);

    if (louver) {
      // Crisp 3D angled louver blades inside recessed frame
      const slats = Math.min(14, Math.max(4, Math.floor(innerH / cm(3.2))));
      const spanH = innerH * 0.84;
      for (let s = 0; s < slats; s++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(innerW - cm(0.8), cm(1.35), cm(0.95)), mats.creamShaker);
        slat.position.set(0, -spanH / 2 + (s / Math.max(1, slats - 1)) * spanH, cm(0.22));
        slat.rotation.x = 0.42;
        group.add(slat);
      }
    }
  }

  // Left & Right Stiles + Top & Bottom Rails (with micro-chamfered cope-and-stick seam)
  const leftStile = new THREE.Mesh(new THREE.BoxGeometry(railW, h, thick), mats.creamShaker);
  leftStile.position.x = -w / 2 + railW / 2;
  const rightStile = new THREE.Mesh(new THREE.BoxGeometry(railW, h, thick), mats.creamShaker);
  rightStile.position.x = w / 2 - railW / 2;
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(innerW, railW, thick * 0.98), mats.creamShaker);
  topRail.position.y = h / 2 - railW / 2;
  const botRail = new THREE.Mesh(new THREE.BoxGeometry(innerW, railW, thick * 0.98), mats.creamShaker);
  botRail.position.y = -h / 2 + railW / 2;
  group.add(leftStile, rightStile, topRail, botRail);

  // Inner decorative stepped ogee sticking bead
  const beadMat = mats.whiteTrim;
  const bThick = cm(0.75);
  const topBead = new THREE.Mesh(new THREE.BoxGeometry(innerW, bThick, thick * 0.94), beadMat);
  topBead.position.y = innerH / 2 - bThick / 2;
  const botBead = topBead.clone();
  botBead.position.y = -innerH / 2 + bThick / 2;
  const lBead = new THREE.Mesh(new THREE.BoxGeometry(bThick, innerH - bThick * 2, thick * 0.94), beadMat);
  lBead.position.x = -innerW / 2 + bThick / 2;
  const rBead = lBead.clone();
  rBead.position.x = innerW / 2 - bThick / 2;
  group.add(topBead, botBead, lBead, rBead);

  // Stepped Rosette + Turned Antique Brass Country Knob
  if (knobSide !== 'none') {
    const kx = knobSide === 'right' ? w / 2 - railW * 0.52 : -w / 2 + railW * 0.52;
    const ky = (knobYRatio - 0.5) * h;
    const rosette = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.15), cm(1.3), cm(0.35), 16), mats.antiqueBrass);
    rosette.rotation.x = Math.PI / 2;
    rosette.position.set(kx, ky, thick / 2 + cm(0.16));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.4), cm(0.6), cm(1.2), 14), mats.antiqueBrass);
    stem.rotation.x = Math.PI / 2;
    stem.position.set(kx, ky, thick / 2 + cm(0.75));
    const head = new THREE.Mesh(new THREE.SphereGeometry(cm(1.2), 16, 12), mats.antiqueBrass);
    head.scale.set(1, 1, 0.72);
    head.position.set(kx, ky, thick / 2 + cm(1.55));
    const capRing = new THREE.Mesh(new THREE.TorusGeometry(cm(0.55), cm(0.12), 8, 16), mats.antiqueBrass);
    capRing.position.set(kx, ky, thick / 2 + cm(2.35));
    group.add(rosette, stem, head, capRing);
  }

  return group;
}

// Country Drawer Front with True Hollow Sculpted Bin Cup Pull (立體中空復古貝殼拉手, facing +Z)
export function createDrawerFront(w, h, mats, cupPull = true) {
  const g = new THREE.Group();
  const body = createRoundedSlab(w - cm(0.4), h - cm(0.4), cm(2.1), cm(0.4), mats.creamShaker, cm(0.2));
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0, -cm(1.05));
  g.add(body);

  if (h > cm(12)) {
    // Framed Shaker recess on tall drawers
    const inset = new THREE.Mesh(
      new THREE.BoxGeometry(w - cm(8.4), h - cm(7.2), cm(0.55)),
      mats.beadboardFine
    );
    inset.position.z = cm(0.95);
    const beadFrame = new THREE.Mesh(
      new THREE.BoxGeometry(w - cm(7.2), h - cm(6.0), cm(0.35)),
      mats.whiteTrim
    );
    beadFrame.position.z = cm(0.98);
    g.add(beadFrame, inset);
  }

  if (cupPull) {
    // Authentic Country Bin Cup Pull: Flange Backplate + 2 Mounting Screws + Hollow Quarter-Sphere Hood
    const plate = createRoundedSlab(cm(8.2), cm(3.0), cm(0.35), cm(1.2), mats.antiqueBrass, cm(0.08));
    plate.rotation.x = Math.PI / 2;
    plate.position.set(0, 0, cm(1.05));

    const hood = new THREE.Mesh(
      new THREE.SphereGeometry(cm(2.6), 18, 12, 0, Math.PI, 0, Math.PI * 0.52),
      mats.antiqueBrass
    );
    hood.scale.set(1.18, 0.78, 0.78);
    hood.position.set(0, -cm(0.25), cm(1.2));

    for (const sx of [-cm(3.2), cm(3.2)]) {
      const screw = new THREE.Mesh(new THREE.SphereGeometry(cm(0.28), 8, 8), mats.antiqueBrass);
      screw.position.set(sx, 0, cm(1.38));
      g.add(screw);
    }
    g.add(plate, hood);
  } else {
    const ros = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.05), cm(1.2), cm(0.3), 14), mats.antiqueBrass);
    ros.rotation.x = Math.PI / 2;
    ros.position.set(0, 0, cm(1.2));
    const knob = new THREE.Mesh(new THREE.SphereGeometry(cm(1.15), 16, 12), mats.antiqueBrass);
    knob.scale.set(1, 1, 0.74);
    knob.position.set(0, 0, cm(1.95));
    g.add(ros, knob);
  }
  return g;
}

// Country Toggle Light Switch & Wall Outlet Plate (復古純白陶瓷邊框＋黃銅撥桿開關／壁插面板，預設面向 +Z)
export function createWallSwitchPanel(mats, type = 'switch', gangs = 2) {
  const g = new THREE.Group();
  const pw = gangs >= 2 ? cm(11.8) : cm(7.6);
  const ph = cm(12.0);
  const plate = createRoundedSlab(pw, ph, cm(0.85), cm(0.8), mats.porcelainGloss, cm(0.2));
  plate.rotation.x = Math.PI / 2;
  g.add(plate);

  if (type === 'switch') {
    for (let i = 0; i < gangs; i++) {
      const sx = gangs === 1 ? 0 : (i - (gangs - 1) / 2) * cm(4.2);
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.85), cm(1.0), cm(0.35), 14), mats.antiqueBrass);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(sx, 0, cm(0.95));
      const toggle = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.22), cm(0.35), cm(1.45), 10), mats.antiqueBrass);
      toggle.rotation.x = Math.PI / 2 - 0.36;
      toggle.position.set(sx, cm(0.25), cm(1.55));
      g.add(collar, toggle);
    }
  } else {
    // Duplex grounded wall receptacle
    for (const sy of [-cm(2.3), cm(2.3)]) {
      const socketFace = createRoundedSlab(cm(3.6), cm(3.0), cm(0.3), cm(1.1), mats.whiteTrim, cm(0.05));
      socketFace.rotation.x = Math.PI / 2;
      socketFace.position.set(0, sy, cm(0.85));
      for (const slotX of [-cm(0.75), cm(0.75)]) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(cm(0.22), cm(0.95), cm(0.2)), mats.castIronDark);
        slot.position.set(slotX, sy + cm(0.25), cm(1.18));
        g.add(slot);
      }
      const ground = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.22), cm(0.22), cm(0.2), 10), mats.castIronDark);
      ground.rotation.x = Math.PI / 2;
      ground.position.set(0, sy - cm(0.68), cm(1.18));
      g.add(socketFace, ground);
    }
  }
  enableShadows(g, false, true);
  return g;
}

// Brass & Rubber Floor-Mounted Doorstop (黃銅防撞地面門擋)
export function createFloorDoorstop(mats) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.9), cm(2.2), cm(0.6), 16), mats.antiqueBrass);
  base.position.y = cm(0.3);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.35), cm(1.5), cm(2.8), 16), mats.antiqueBrass);
  body.position.y = cm(2.0);
  const bumper = new THREE.Mesh(new THREE.TorusGeometry(cm(1.42), cm(0.35), 10, 18), mats.rubberGasket);
  bumper.rotation.x = Math.PI / 2;
  bumper.position.y = cm(2.2);
  g.add(base, body, bumper);
  enableShadows(g, true, true);
  return g;
}

/**
 * Full Interactive Hinged Country Door Assembly (Ultra-Fine Architectural Carpentry & Hardware)
 */
export function createCountryDoor(config, mats, doorsRegistry) {
  const {
    name,
    hingeX,
    hingeZ,
    width,
    height = cm(212),
    wallThick = cm(10),
    axis = 'x',
    leafDir = 1,
    openAngle = Math.PI * 0.46,
    style = 'panel', // 'panel' | 'bath' | 'entrance' | 'balcony'
  } = config;

  const root = new THREE.Group();
  root.position.set(hingeX, 0, hingeZ);

  const jambThick = cm(2.2);
  const casingW = cm(7.2);
  const casingT = cm(1.7);

  const frameGroup = new THREE.Group();
  const spanSign = leafDir;
  const cx = (spanSign * width) / 2;

  // Jamb liners + center doorstop rabbet bead inside jamb!
  const sideJambGeo = new THREE.BoxGeometry(jambThick, height, wallThick + cm(0.8));
  const j1 = new THREE.Mesh(sideJambGeo, mats.whiteTrim);
  j1.position.set(-spanSign * (jambThick * 0.4), height / 2, 0);
  const j2 = new THREE.Mesh(sideJambGeo, mats.whiteTrim);
  j2.position.set(spanSign * (width + jambThick * 0.4), height / 2, 0);
  const headJamb = new THREE.Mesh(
    new THREE.BoxGeometry(width + jambThick * 2, jambThick, wallThick + cm(0.8)),
    mats.whiteTrim
  );
  headJamb.position.set(cx, height + jambThick / 2, 0);

  // Doorstop rabbet strip inside jambs
  const stopL = new THREE.Mesh(new THREE.BoxGeometry(cm(1.1), height, cm(1.4)), mats.whiteTrim);
  stopL.position.set(spanSign * cm(0.3), height / 2, 0);
  const stopR = stopL.clone();
  stopR.position.x = spanSign * (width - cm(0.3));
  const stopTop = new THREE.Mesh(new THREE.BoxGeometry(width, cm(1.1), cm(1.4)), mats.whiteTrim);
  stopTop.position.set(cx, height - cm(0.3), 0);

  // Brass strike plate on latch jamb at handle height (Y = 98 cm)
  const strikePlate = new THREE.Mesh(new THREE.BoxGeometry(cm(0.4), cm(8.5), cm(2.8)), mats.antiqueBrass);
  strikePlate.position.set(spanSign * (width - cm(0.1)), cm(98), 0);
  frameGroup.add(j1, j2, headJamb, stopL, stopR, stopTop, strikePlate);

  // Entrance / Bathroom Marble & Brass Threshold Sill
  if (style === 'entrance' || style === 'bath' || style === 'balcony') {
    const threshMat = style === 'entrance' ? mats.antiqueBrass : mats.marbleTop;
    const thresh = createRoundedSlab(width + cm(2), wallThick + cm(2), cm(1.4), cm(0.4), threshMat, cm(0.25));
    thresh.position.set(cx, 0, 0);
    frameGroup.add(thresh);
  }

  // Architrave Casings on Both Faces (+Z and -Z) with Carved Plinth Blocks & Coffered Header Pediment!
  const plinthH = cm(14.5);
  for (const zSide of [-1, 1]) {
    const zPos = zSide * (wallThick / 2 + casingT / 2);

    // Base plinth blocks (門套雕花踢腳座塊)
    const pBlockL = new THREE.Mesh(
      new THREE.BoxGeometry(casingW + cm(1.0), plinthH, casingT * 1.32),
      mats.whiteTrim
    );
    pBlockL.position.set(-spanSign * (casingW * 0.45), plinthH / 2, zPos + zSide * cm(0.22));
    const pBlockR = pBlockL.clone();
    pBlockR.position.x = spanSign * (width + casingW * 0.45);

    // Profiled vertical architraves (stepped outer backband + inner molding)
    const cH = height + casingW - plinthH;
    const cL = new THREE.Mesh(new THREE.BoxGeometry(casingW, cH, casingT), mats.whiteTrim);
    cL.position.set(-spanSign * (casingW * 0.45), plinthH + cH / 2, zPos);
    const cR = cL.clone();
    cR.position.x = spanSign * (width + casingW * 0.45);

    const backbandL = new THREE.Mesh(new THREE.BoxGeometry(cm(1.8), cH, casingT * 1.28), mats.whiteTrim);
    backbandL.position.set(-spanSign * (casingW * 0.95 - cm(0.9)), plinthH + cH / 2, zPos + zSide * cm(0.18));
    const backbandR = backbandL.clone();
    backbandR.position.x = spanSign * (width + casingW * 0.95 - cm(0.9));

    // Header frieze + bead lip + crown cornice pediment
    const cTop = new THREE.Mesh(
      new THREE.BoxGeometry(width + casingW * 2.1, casingW * 1.15, casingT * 1.25),
      mats.whiteTrim
    );
    cTop.position.set(cx, height + casingW * 0.65, zPos + zSide * cm(0.2));
    const neckMold = new THREE.Mesh(
      new THREE.BoxGeometry(width + casingW * 2.25, cm(1.2), casingT * 1.48),
      mats.whiteTrim
    );
    neckMold.position.set(cx, height + casingW * 1.15, zPos + zSide * cm(0.32));
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(width + casingW * 2.5, cm(2.4), casingT * 1.85),
      mats.whiteTrim
    );
    crown.position.set(cx, height + casingW * 1.32, zPos + zSide * cm(0.52));

    frameGroup.add(pBlockL, pBlockR, cL, cR, backbandL, backbandR, cTop, neckMold, crown);
  }

  // 3 Antique Brass 5-Knuckle Butt Hinges with Ball Finials along the hinge line!
  for (const hy of [cm(28), cm(106), height - cm(26)]) {
    const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.62), cm(0.62), cm(8.8), 12), mats.antiqueBrass);
    knuckle.position.set(0, hy, 0);
    const pinTop = new THREE.Mesh(new THREE.SphereGeometry(cm(0.75), 10, 10), mats.antiqueBrass);
    pinTop.position.set(0, hy + cm(4.8), 0);
    const pinBot = pinTop.clone();
    pinBot.position.y = hy - cm(4.8);
    frameGroup.add(knuckle, pinTop, pinBot);
  }

  if (axis === 'z') {
    frameGroup.rotation.y = -Math.PI / 2;
  }
  root.add(frameGroup);

  // Hinged Door Leaf Pivot
  const pivot = new THREE.Group();
  const baseRotY = axis === 'z' ? -Math.PI / 2 : 0;
  pivot.rotation.y = baseRotY + openAngle;

  const leafThick = style === 'entrance' ? cm(5.0) : cm(4.2);
  const leafGroup = new THREE.Group();
  leafGroup.position.set((spanSign * width) / 2, height / 2, 0);

  const stileW = cm(10.8);
  const innerW = width - stileW * 2;
  const leafMat = style === 'entrance' ? mats.warmIvoryCabinet : mats.creamShaker;

  // Outer stiles & rails
  const stL = new THREE.Mesh(new THREE.BoxGeometry(stileW, height - cm(1), leafThick), leafMat);
  stL.position.x = -width / 2 + stileW / 2;
  const stR = new THREE.Mesh(new THREE.BoxGeometry(stileW, height - cm(1), leafThick), leafMat);
  stR.position.x = width / 2 - stileW / 2;
  const rTop = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(12.5), leafThick), leafMat);
  rTop.position.y = height / 2 - cm(6.75);
  const rMid = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(11.5), leafThick), leafMat);
  rMid.position.y = -cm(12);
  const rBot = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(18.5), leafThick), leafMat);
  rBot.position.y = -height / 2 + cm(9.75);
  leafGroup.add(stL, stR, rTop, rMid, rBot);

  // Upper & Lower Panels
  const upH = height / 2 - cm(6.5) - (-cm(12) + cm(5.5));
  const upY = (height / 2 - cm(12.5) + (-cm(6.5))) / 2;
  if (style === 'bath' || style === 'balcony') {
    const glassMat = style === 'balcony' ? mats.clearGlass : mats.frostedGlass;
    const gPane = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(0.8), upH + cm(0.8), cm(1.0)), glassMat);
    gPane.position.y = upY;
    leafGroup.add(gPane);

    if (style === 'bath') {
      // Physical 3D vertical reeded ribs for authentic Fluted Changhong Glass (立體長虹玻璃肋條)
      const numReeds = Math.floor(innerW / cm(2.6));
      for (let r = 0; r < numReeds; r++) {
        const rx = -innerW / 2 + cm(1.3) + r * cm(2.6);
        const reed = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.75), upH - cm(1), 8), mats.frostedGlass);
        reed.position.set(rx, upY, 0);
        leafGroup.add(reed);
      }
    }

    // Putty-profiled country muntin bars
    const mv = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), upH, cm(2.0)), mats.whiteTrim);
    mv.position.y = upY;
    const mh1 = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(1.6), cm(2.0)), mats.whiteTrim);
    mh1.position.y = upY + upH * 0.22;
    const mh2 = mh1.clone();
    mh2.position.y = upY - upH * 0.22;
    leafGroup.add(mv, mh1, mh2);
  } else if (style === 'entrance') {
    // Classic 2-column vertical split raised panels + brass peephole & ring knocker on Entrance Door!
    const centerMullion = new THREE.Mesh(new THREE.BoxGeometry(cm(7.5), upH + cm(2), leafThick), leafMat);
    centerMullion.position.y = upY;
    leafGroup.add(centerMullion);
    const colW = (innerW - cm(7.5)) / 2;
    for (const sx of [-(colW + cm(7.5)) / 2, (colW + cm(7.5)) / 2]) {
      const rp = createRaisedPanel(colW - cm(1.6), upH - cm(2.4), leafThick * 0.92, leafMat, cm(3.0));
      rp.position.set(sx, upY, 0);
      leafGroup.add(rp);
    }
    // Brass Peephole Viewer & Traditional Country Ring Knocker
    const peep = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.9), cm(0.9), leafThick + cm(0.8), 14), mats.antiqueBrass);
    peep.rotation.x = Math.PI / 2;
    peep.position.set(0, height / 2 - cm(56), 0);
    const knockerRing = new THREE.Mesh(new THREE.TorusGeometry(cm(3.6), cm(0.55), 10, 20), mats.antiqueBrass);
    knockerRing.position.set(0, height / 2 - cm(64), -leafThick / 2 - cm(0.6));
    leafGroup.add(peep, knockerRing);
  } else {
    // True Beveled Fielded Upper Raised Panel + Recessed Perimeter Sticking Molding
    const upCore = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), upH + cm(1), leafThick * 0.36), mats.whiteTrim);
    upCore.position.y = upY;
    const upRaise = createRaisedPanel(innerW - cm(2.2), upH - cm(2.2), leafThick * 0.9, leafMat, cm(3.4));
    upRaise.position.y = upY;
    leafGroup.add(upCore, upRaise);
  }

  // Lower Panel (Breathable Louver Grille on Bathroom Doors, True Beveled Raised Panel on others!)
  const lowH = -cm(17.5) - (-height / 2 + cm(18.5));
  const lowY = (-cm(17.5) + (-height / 2 + cm(18.5))) / 2;
  const lowCore = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), lowH + cm(1), leafThick * 0.36), mats.whiteTrim);
  lowCore.position.y = lowY;
  leafGroup.add(lowCore);

  if (style === 'bath') {
    const slats = 8;
    for (let s = 0; s < slats; s++) {
      const sy = lowY - lowH * 0.36 + (s / (slats - 1)) * lowH * 0.72;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(innerW - cm(4), cm(1.6), leafThick * 0.78), leafMat);
      blade.position.set(0, sy, 0);
      blade.rotation.x = 0.38;
      leafGroup.add(blade);
    }
  } else {
    const lowRaise = createRaisedPanel(innerW - cm(2.2), lowH - cm(2.2), leafThick * 0.9, leafMat, cm(3.2));
    lowRaise.position.y = lowY;
    leafGroup.add(lowRaise);
  }

  // Edge Mortise Lock Faceplate & Brass Latch Bolt on Closing Edge of Door Leaf!
  const handleX = spanSign * (width / 2 - cm(6.2));
  const handleY = -height / 2 + cm(98);
  const edgeFaceplate = new THREE.Mesh(new THREE.BoxGeometry(cm(0.35), cm(15.5), cm(2.4)), mats.antiqueBrass);
  edgeFaceplate.position.set(spanSign * (width / 2 + cm(0.1)), handleY, 0);
  const latchBolt = new THREE.Mesh(new THREE.BoxGeometry(cm(1.1), cm(2.6), cm(1.2)), mats.antiqueBrass);
  latchBolt.position.set(spanSign * (width / 2 + cm(0.55)), handleY + cm(1.8), 0);
  leafGroup.add(edgeFaceplate, latchBolt);

  // Sculpted Antique Brass Escutcheon Backplates, Ergonomic Curved Lever Handles & Keyhole / Privacy Turn
  for (const side of [-1, 1]) {
    const plate = createRoundedSlab(cm(4.0), cm(17.5), cm(0.65), cm(1.4), mats.antiqueBrass, cm(0.16));
    plate.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    plate.position.set(handleX, handleY, side * (leafThick / 2));

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.95), cm(1.25), cm(2.2), 14), mats.antiqueBrass);
    neck.rotation.x = Math.PI / 2;
    neck.position.set(handleX, handleY + cm(2.0), side * (leafThick / 2 + cm(1.4)));

    // Ergonomic S-curved country brass lever grip
    const zGrip = side * (leafThick / 2 + cm(3.4));
    const leverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(handleX, handleY + cm(2.0), side * (leafThick / 2 + cm(2.2))),
      new THREE.Vector3(handleX, handleY + cm(2.0), zGrip),
      new THREE.Vector3(handleX - spanSign * cm(4.2), handleY + cm(2.2), zGrip + side * cm(0.4)),
      new THREE.Vector3(handleX - spanSign * cm(10.2), handleY + cm(1.5), zGrip),
    ]);
    const lever = new THREE.Mesh(new THREE.TubeGeometry(leverCurve, 16, cm(0.76), 12, false), mats.antiqueBrass);
    const leverTip = new THREE.Mesh(new THREE.SphereGeometry(cm(0.88), 12, 10), mats.antiqueBrass);
    leverTip.position.set(handleX - spanSign * cm(10.2), handleY + cm(1.5), zGrip);

    // Lower keyhole or bathroom thumbturn knob
    const thumb = new THREE.Mesh(
      style === 'bath'
        ? new THREE.BoxGeometry(cm(1.8), cm(0.65), cm(1.1))
        : new THREE.CylinderGeometry(cm(0.55), cm(0.55), cm(0.5), 12),
      style === 'bath' ? mats.antiqueBrass : mats.castIronDark
    );
    if (style !== 'bath') thumb.rotation.x = Math.PI / 2;
    thumb.position.set(handleX, handleY - cm(4.2), side * (leafThick / 2 + cm(0.85)));

    // Entrance upper deadbolt cylinder
    if (style === 'entrance') {
      const deadbolt = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.1), cm(2.2), cm(1.4), 18), mats.antiqueBrass);
      deadbolt.rotation.x = Math.PI / 2;
      deadbolt.position.set(handleX, handleY + cm(13.5), side * (leafThick / 2 + cm(0.7)));
      leafGroup.add(deadbolt);
    }

    leafGroup.add(plate, neck, lever, leverTip, thumb);
  }

  // Subtle floor blueprint door-swing arc line
  const arcPts = [];
  const segs = 28;
  for (let i = 0; i <= segs; i++) {
    const ang = baseRotY + (openAngle * i) / segs;
    const r = width * spanSign;
    arcPts.push(new THREE.Vector3(Math.cos(ang) * r, cm(0.4), -Math.sin(ang) * r));
  }
  const arcLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(arcPts),
    new THREE.LineBasicMaterial({ color: 0xb5a48b, transparent: true, opacity: 0.45 })
  );
  root.add(arcLine);

  pivot.add(leafGroup);
  root.add(pivot);

  const doorRecord = {
    name,
    pivot,
    baseRotY,
    blueprintAngle: baseRotY + openAngle,
    fullOpenAngle: baseRotY + Math.sign(openAngle) * Math.PI * 0.49,
    closedAngle: baseRotY,
    targetAngle: baseRotY + openAngle,
    isOpen: true,
    arcLine,
  };

  leafGroup.traverse((c) => {
    if (c.isMesh) {
      c.userData.doorRecord = doorRecord;
      c.userData.inspectTitle = `${name}（點擊可開關門扇）`;
      c.userData.inspectMeta = `寬 ${Math.round(width * 100)} × 高 ${Math.round(height * 100)} cm｜立體斜邊凸芯線板門＋三組黃銅活頁鉸鏈＋雕花門套座塊`;
    }
  });

  if (doorsRegistry) doorsRegistry.push(doorRecord);
  enableShadows(root, true, true);
  return root;
}

/**
 * White Country Mullioned Composite Window (Ultra-Detailed Frame, EPDM Gaskets, Friction Stays, Exterior Drip Sill & Ring-Hung Curtains)
 */
export function createCountryWindow(config, mats, cutawayWallsList) {
  const {
    name = '鄉村風複合式格柵採光窗',
    cx,
    cz,
    totalLen,
    sillY = cm(82),
    headY = cm(232),
    wallThick = cm(15),
    wallAxis = 'z',
    inwardSign = -1,
    casementRatio = 0.36,
    casementAtStart = false,
    hasCurtains = true,
  } = config;

  const winH = headY - sillY;
  const group = new THREE.Group();
  group.position.set(cx, sillY + winH / 2, cz);
  if (wallAxis === 'z') {
    group.rotation.y = -Math.PI / 2;
  }
  const localInZ = wallAxis === 'z' ? (inwardSign === -1 ? 1 : -1) : inwardSign;

  const frameT = cm(4.2);
  // Outer perimeter window frame
  const topF = new THREE.Mesh(new THREE.BoxGeometry(totalLen, frameT, wallThick + cm(1.6)), mats.whiteTrim);
  topF.position.y = winH / 2 - frameT / 2;
  const botF = topF.clone();
  botF.position.y = -winH / 2 + frameT / 2;
  const leftF = new THREE.Mesh(new THREE.BoxGeometry(frameT, winH, wallThick + cm(1.6)), mats.whiteTrim);
  leftF.position.x = -totalLen / 2 + frameT / 2;
  const rightF = leftF.clone();
  rightF.position.x = totalLen / 2 - frameT / 2;
  group.add(topF, botF, leftF, rightF);

  // Interior Bullnose Country Window Sill + Profiled Apron + Corbel Ears
  const sillBoard = createRoundedSlab(totalLen + cm(14), wallThick + cm(9), cm(3.2), cm(1.4), mats.whiteTrim, cm(0.6));
  sillBoard.position.set(0, -winH / 2 - cm(2.2), localInZ * cm(3.6));
  const sillApron = new THREE.Mesh(new THREE.BoxGeometry(totalLen + cm(9), cm(4.8), cm(1.9)), mats.whiteTrim);
  sillApron.position.set(0, -winH / 2 - cm(4.4), localInZ * (wallThick / 2 + cm(1.3)));
  const sillBead = new THREE.Mesh(new THREE.BoxGeometry(totalLen + cm(10.5), cm(1.3), cm(2.4)), mats.whiteTrim);
  sillBead.position.set(0, -winH / 2 - cm(2.4), localInZ * (wallThick / 2 + cm(1.6)));

  // Exterior Sloped Weather Drip Sill (外牆斜坡防雨滴水窗台)
  const extSill = new THREE.Mesh(new THREE.BoxGeometry(totalLen + cm(6), cm(2.8), cm(6.5)), mats.wallExterior);
  extSill.position.set(0, -winH / 2 - cm(1.0), -localInZ * (wallThick / 2 + cm(2.4)));
  extSill.rotation.x = localInZ * 0.16;
  group.add(sillBoard, sillApron, sillBead, extSill);

  // Interior Stepped Architrave Casing + Header Crown
  const trimW = cm(6.0);
  const tL = new THREE.Mesh(new THREE.BoxGeometry(trimW, winH + trimW, cm(1.6)), mats.whiteTrim);
  tL.position.set(-totalLen / 2 - trimW * 0.35, trimW * 0.3, localInZ * (wallThick / 2 + cm(0.8)));
  const tR = tL.clone();
  tR.position.x = totalLen / 2 + trimW * 0.35;
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(totalLen + trimW * 2.1, trimW * 1.15, cm(2.1)), mats.whiteTrim);
  tTop.position.set(0, winH / 2 + trimW * 0.45, localInZ * (wallThick / 2 + cm(1.05)));
  const tCrown = new THREE.Mesh(new THREE.BoxGeometry(totalLen + trimW * 2.4, cm(2.0), cm(3.1)), mats.whiteTrim);
  tCrown.position.set(0, winH / 2 + trimW * 1.08, localInZ * (wallThick / 2 + cm(1.5)));
  group.add(tL, tR, tTop, tCrown);

  // Split into Fixed Picture Section & Outward Casement Sash
  const casementW = totalLen * casementRatio;
  const fixedW = totalLen - casementW;
  const mullionX = casementAtStart ? -totalLen / 2 + casementW : totalLen / 2 - casementW;

  const centerMullion = new THREE.Mesh(
    new THREE.BoxGeometry(cm(4.2), winH - frameT * 2, wallThick * 0.86),
    mats.whiteTrim
  );
  centerMullion.position.x = mullionX;
  group.add(centerMullion);

  // Fixed Pane + EPDM Rubber Glazing Gasket + Country Grid Muntins
  const fixedCenterX = casementAtStart ? mullionX + fixedW / 2 : -totalLen / 2 + fixedW / 2;
  const innerH = winH - frameT * 2;
  const fGlassW = fixedW - cm(4.2);
  const fixedGlass = new THREE.Mesh(new THREE.BoxGeometry(fGlassW, innerH, cm(1.0)), mats.clearGlass);
  fixedGlass.position.x = fixedCenterX;
  const fgTop = new THREE.Mesh(new THREE.BoxGeometry(fGlassW, cm(0.5), cm(1.6)), mats.rubberGasket);
  fgTop.position.set(fixedCenterX, innerH / 2 - cm(0.25), 0);
  const fgBot = fgTop.clone();
  fgBot.position.y = -innerH / 2 + cm(0.25);
  group.add(fixedGlass, fgTop, fgBot);

  const vCols = fixedW > cm(110) ? 2 : 1;
  for (let c = 1; c <= vCols; c++) {
    const mb = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), innerH, cm(2.0)), mats.whiteTrim);
    mb.position.x = fixedCenterX - fixedW / 2 + (fixedW * c) / (vCols + 1);
    group.add(mb);
  }
  for (let r = 1; r <= 2; r++) {
    const hb = new THREE.Mesh(new THREE.BoxGeometry(fGlassW, cm(1.6), cm(2.0)), mats.whiteTrim);
    hb.position.set(fixedCenterX, -innerH / 2 + (innerH * r) / 3, 0);
    group.add(hb);
  }

  // Outward-Opening Casement Sash + Stainless Friction Stay Arms + Sculpted Brass Locking Handle
  const sashPivot = new THREE.Group();
  const sashHingeX = casementAtStart ? -totalLen / 2 + frameT : totalLen / 2 - frameT;
  const sashSpanSign = casementAtStart ? 1 : -1;
  sashPivot.position.set(sashHingeX, 0, -localInZ * (wallThick * 0.3));
  const sashLeafW = casementW - frameT - cm(2);
  const sashGroup = new THREE.Group();
  sashGroup.position.x = (sashSpanSign * sashLeafW) / 2;

  const sStile = cm(3.6);
  const sTop = new THREE.Mesh(new THREE.BoxGeometry(sashLeafW, sStile, cm(3.4)), mats.whiteTrim);
  sTop.position.y = innerH / 2 - sStile / 2;
  const sBot = sTop.clone();
  sBot.position.y = -innerH / 2 + sStile / 2;
  const sL = new THREE.Mesh(new THREE.BoxGeometry(sStile, innerH, cm(3.4)), mats.whiteTrim);
  sL.position.x = -sashLeafW / 2 + sStile / 2;
  const sR = sL.clone();
  sR.position.x = sashLeafW / 2 - sStile / 2;
  const sGlass = new THREE.Mesh(
    new THREE.BoxGeometry(sashLeafW - sStile * 2, innerH - sStile * 2, cm(0.9)),
    mats.clearGlass
  );
  const sh1 = new THREE.Mesh(new THREE.BoxGeometry(sashLeafW - sStile * 2, cm(1.5), cm(1.8)), mats.whiteTrim);
  sh1.position.y = innerH / 6;
  const sh2 = sh1.clone();
  sh2.position.y = -innerH / 6;

  // Sculpted Antique Brass Casement Locking Handle
  const hx = sashSpanSign * (sashLeafW / 2 - cm(1.9));
  const latchPlate = new THREE.Mesh(new THREE.BoxGeometry(cm(1.3), cm(6.2), cm(0.6)), mats.antiqueBrass);
  latchPlate.position.set(hx, -cm(6), localInZ * cm(1.9));
  const latchGrip = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.55), cm(8.2), 10), mats.antiqueBrass);
  latchGrip.position.set(hx, -cm(10), localInZ * cm(3.1));
  latchGrip.rotation.x = localInZ * 0.22;

  sashGroup.add(sTop, sBot, sL, sR, sGlass, sh1, sh2, latchPlate, latchGrip);
  sashPivot.add(sashGroup);
  sashPivot.rotation.y = -localInZ * sashSpanSign * 0.34;
  group.add(sashPivot);

  // Stainless Friction Stay Link Bars visible in the open casement gap
  for (const stayY of [innerH / 2 - cm(2), -innerH / 2 + cm(2)]) {
    const stay = new THREE.Mesh(new THREE.BoxGeometry(cm(16), cm(0.6), cm(1.2)), mats.stainlessSteel);
    stay.position.set(sashHingeX + sashSpanSign * cm(9), stayY, -localInZ * (wallThick * 0.42));
    stay.rotation.y = -localInZ * sashSpanSign * 0.17;
    group.add(stay);
  }

  // Ring-Hung Flowing Country Linen Curtains + Brass Rod, Acorn Finials & Curtain Rings
  if (hasCurtains) {
    const curtainGroup = new THREE.Group();
    const rodLen = totalLen + cm(30);
    const rodY = winH / 2 + cm(11.5);
    const rodZ = localInZ * (wallThick / 2 + cm(7.8));
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.0), cm(1.0), rodLen, 16), mats.antiqueBrass);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, rodY, rodZ);
    curtainGroup.add(rod);

    // Center support bracket on wide windows
    if (totalLen > cm(180)) {
      const cBrk = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.55), cm(0.55), cm(7.8), 10), mats.antiqueBrass);
      cBrk.rotation.x = Math.PI / 2;
      cBrk.position.set(0, rodY, localInZ * (wallThick / 2 + cm(3.9)));
      curtainGroup.add(cBrk);
    }

    for (const endSign of [-1, 1]) {
      // Multi-tier turned brass finial
      const finNeck = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.3), cm(0.9), cm(1.8), 14), mats.antiqueBrass);
      finNeck.rotation.z = Math.PI / 2;
      finNeck.position.set(endSign * (rodLen / 2 + cm(0.8)), rodY, rodZ);
      const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(2.2), 16, 12), mats.antiqueBrass);
      finial.scale.set(1.25, 1, 1);
      finial.position.set(endSign * (rodLen / 2 + cm(2.4)), rodY, rodZ);

      const wallRos = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.8), cm(2.0), cm(0.6), 14), mats.antiqueBrass);
      wallRos.rotation.x = Math.PI / 2;
      wallRos.position.set(endSign * (totalLen / 2 + cm(5.5)), rodY, localInZ * (wallThick / 2 + cm(0.3)));
      const bracket = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.58), cm(0.58), cm(7.8), 10), mats.antiqueBrass);
      bracket.rotation.x = Math.PI / 2;
      bracket.position.set(endSign * (totalLen / 2 + cm(5.5)), rodY, localInZ * (wallThick / 2 + cm(4.0)));
      curtainGroup.add(finNeck, finial, wallRos, bracket);

      // Sinusoidal pleated sheer drape + Individual Brass Curtain Rings on Rod!
      const drapeH = sillY + winH + cm(6.5);
      const drapeW = Math.min(cm(44), totalLen * 0.27);
      const startX = endSign === -1 ? -totalLen / 2 - cm(8.5) : totalLen / 2 + cm(8.5) - drapeW;
      const folds = 6.5;

      // Brass curtain rings clipped along each crest
      const numRings = 7;
      for (let r = 0; r < numRings; r++) {
        const rx = startX + cm(2) + (r / (numRings - 1)) * (drapeW - cm(4));
        const ring = new THREE.Mesh(new THREE.TorusGeometry(cm(1.65), cm(0.24), 8, 16), mats.antiqueBrass);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(rx, rodY, rodZ);
        curtainGroup.add(ring);
      }

      const waveShape = new THREE.Shape();
      for (let i = 0; i <= 48; i++) {
        const t = i / 48;
        const wx = t * drapeW;
        const wz = Math.sin(t * Math.PI * folds) * cm(2.8);
        if (i === 0) waveShape.moveTo(wx, wz);
        else waveShape.lineTo(wx, wz);
      }
      for (let i = 48; i >= 0; i--) {
        const t = i / 48;
        const wx = t * drapeW;
        const wz = Math.sin(t * Math.PI * folds) * cm(2.8) + cm(0.48);
        waveShape.lineTo(wx, wz);
      }
      waveShape.closePath();
      const drapeGeo = new THREE.ExtrudeGeometry(waveShape, { depth: drapeH, bevelEnabled: false });
      drapeGeo.rotateX(Math.PI / 2);
      const drapeMesh = new THREE.Mesh(drapeGeo, mats.sheerCurtain);
      drapeMesh.position.set(startX, rodY - cm(1.4), rodZ - cm(1.2));
      drapeMesh.castShadow = false;
      curtainGroup.add(drapeMesh);
    }
    group.add(curtainGroup);
    if (cutawayWallsList) {
      group.userData.curtainGroup = curtainGroup;
    }
  }

  tagItem(
    group,
    name,
    `寬 ${Math.round(totalLen * 100)} × 高 ${Math.round(winH * 100)} cm｜純白十字格柵窗＋不鏽鋼連桿外推扇＋銅環透光亞麻落地紗簾`
  );
  enableShadows(group, true, true);
  return group;
}

// Plump Country Ruffled & Piped Pillow (飽滿立體滾邊／荷葉邊枕頭)
export function createCountryPillow(w, d, h, material, opts = {}) {
  const { flanged = true, buttoned = false, buttonMat = null } = opts;
  const geo = new THREE.SphereGeometry(0.5, 26, 20);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const sx = Math.sign(x) * Math.pow(Math.abs(x * 2), 0.76) * (w / 2);
    const sz = Math.sign(z) * Math.pow(Math.abs(z * 2), 0.76) * (d / 2);
    const cornerPinch = 1 + 0.14 * (Math.abs(x) * 2) * (Math.abs(z) * 2);
    // Subtle center plush dimple when buttoned
    const centerDimple = buttoned ? 1 - 0.28 * Math.exp(-(x * x + z * z) * 18) : 1;
    const sy = y * h * cornerPinch * centerDimple;
    pos.setXYZ(i, sx, sy, sz);
  }
  geo.computeVertexNormals();
  const group = new THREE.Group();
  const core = new THREE.Mesh(geo, material);
  group.add(core);

  if (flanged) {
    // Soft wavy country linen flange / welt border around equator
    const rimGeo = new THREE.CylinderGeometry(0.5, 0.5, cm(0.65), 36);
    const rPos = rimGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const rx = rPos.getX(i);
      const ry = rPos.getY(i);
      const rz = rPos.getZ(i);
      const ang = Math.atan2(rz, rx);
      const sx = Math.sign(rx) * Math.pow(Math.abs(rx * 2), 0.78) * (w / 2 + cm(2.0));
      const sz = Math.sign(rz) * Math.pow(Math.abs(rz * 2), 0.78) * (d / 2 + cm(2.0));
      const ruffle = Math.sin(ang * 16) * cm(0.32);
      rPos.setXYZ(i, sx, ry + ruffle, sz);
    }
    rimGeo.computeVertexNormals();
    group.add(new THREE.Mesh(rimGeo, material));
  }

  if (buttoned) {
    const bMat = buttonMat || material;
    for (const side of [-1, 1]) {
      const btn = new THREE.Mesh(new THREE.SphereGeometry(cm(0.95), 12, 10), bMat);
      btn.scale.set(1, 0.45, 1);
      btn.position.y = side * (h * 0.36);
      group.add(btn);
    }
  }

  enableShadows(group, true, true);
  return group;
}

// Country Spindle-Back Windsor Chair (白色溫莎餐椅／書桌椅，含雕刻馬鞍座板、竹節車枳腳、後斜撐桿與綁帶軟墊)
export function createWindsorChair(mats, cushionMat = null) {
  const g = new THREE.Group();
  const seatY = cm(45);
  const woodMat = mats.creamShaker;

  // Splayed turned legs + bulbous H-stretcher
  const legPositions = [
    [-cm(17), -cm(16), -0.08, 0.07],
    [cm(17), -cm(16), 0.08, 0.07],
    [-cm(18), cm(16), -0.07, -0.06],
    [cm(18), cm(16), 0.07, -0.06],
  ];
  for (const [lx, lz, rz, rx] of legPositions) {
    const leg = createTurnedLeg(seatY, cm(1.85), woodMat);
    leg.position.set(lx, 0, lz);
    leg.rotation.set(rx, 0, rz);
    g.add(leg);
  }
  const strL = createTurnedLeg(cm(32.5), cm(0.95), woodMat);
  strL.rotation.x = Math.PI / 2;
  strL.position.set(-cm(16.8), cm(15), -cm(16.2));
  const strR = createTurnedLeg(cm(32.5), cm(0.95), woodMat);
  strR.rotation.x = Math.PI / 2;
  strR.position.set(cm(16.8), cm(15), -cm(16.2));
  const strM = createTurnedLeg(cm(33.5), cm(1.05), woodMat);
  strM.rotation.z = -Math.PI / 2;
  strM.position.set(-cm(16.8), cm(15), 0);
  g.add(strL, strR, strM);

  // Contoured saddle solid-oak seat
  const seat = createRoundedSlab(cm(44.5), cm(42.5), cm(3.4), cm(9.5), mats.naturalOak, cm(0.75));
  seat.position.y = seatY - cm(1.2);
  g.add(seat);

  if (cushionMat) {
    const pad = createRoundedSlab(cm(39), cm(37), cm(3.4), cm(7.5), cushionMat, cm(1.1));
    pad.position.set(0, seatY + cm(2.0), cm(0.8));
    g.add(pad);
    // Fabric tie straps knotted around rear spindles
    for (const tx of [-cm(13.5), cm(13.5)]) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), cm(0.5), cm(5.5)), cushionMat);
      tie.position.set(tx, seatY + cm(3.2), -cm(17.8));
      g.add(tie);
    }
  }

  // Steam-Bent Hoop / Bow Backrest + 7 Tapered Spindles + 2 Rear Diagonal Brace Spindles
  const backH = cm(44);
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-cm(19), seatY + cm(1), -cm(12)),
    new THREE.Vector3(-cm(20.2), seatY + backH * 0.62, -cm(16.8)),
    new THREE.Vector3(-cm(13), seatY + backH * 0.96, -cm(18.8)),
    new THREE.Vector3(0, seatY + backH, -cm(19.4)),
    new THREE.Vector3(cm(13), seatY + backH * 0.96, -cm(18.8)),
    new THREE.Vector3(cm(20.2), seatY + backH * 0.62, -cm(16.8)),
    new THREE.Vector3(cm(19), seatY + cm(1), -cm(12)),
  ]);
  const bow = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 32, cm(1.38), 12, false), woodMat);
  g.add(bow);

  const numSpindles = 7;
  for (let i = 0; i < numSpindles; i++) {
    const t = 0.16 + (i / (numSpindles - 1)) * 0.68;
    const topPt = archCurve.getPoint(t);
    const botPt = new THREE.Vector3((i - 3) * cm(4.6), seatY + cm(1.5), -cm(15.5) + Math.abs(i - 3) * cm(0.6));
    const dir = new THREE.Vector3().subVectors(topPt, botPt);
    const len = dir.length();
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.48), cm(0.66), len, 10), woodMat);
    sp.position.copy(botPt).addScaledVector(dir, 0.5);
    sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.add(sp);
  }

  // 2 Angled Rear Tail-Brace Spindles (經典溫莎椅雙後斜撐結構)
  for (const side of [-1, 1]) {
    const topBrace = archCurve.getPoint(0.5 + side * 0.08);
    const botBrace = new THREE.Vector3(side * cm(4.2), seatY + cm(1.2), -cm(19.8));
    const dir = new THREE.Vector3().subVectors(topBrace, botBrace);
    const brace = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.58), dir.length(), 8), woodMat);
    brace.position.copy(botBrace).addScaledVector(dir, 0.5);
    brace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.add(brace);
  }

  enableShadows(g, true, true);
  return g;
}

// French Country Medallion Upholstered Dining Chair (法式路易十六鄉村風雕花圓背軟墊餐椅，面向 +Z)
export function createCountryDiningChair(mats) {
  const g = new THREE.Group();
  const seatY = cm(45);
  const frameMat = mats.creamShaker;

  for (const [lx, lz] of [[-cm(19), -cm(18)], [cm(19), -cm(18)], [-cm(20), cm(18)], [cm(20), cm(18)]]) {
    const leg = createTurnedLeg(seatY - cm(5.5), cm(2.05), frameMat);
    leg.position.set(lx, 0, lz);
    // Louis XVI carved rosette corner block at top of each leg
    const block = new THREE.Mesh(new THREE.BoxGeometry(cm(4.6), cm(5.8), cm(4.6)), mats.whiteTrim);
    block.position.set(lx, seatY - cm(3.2), lz);
    const ros = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.4), cm(1.4), cm(5.1), 12), frameMat);
    ros.rotation.x = Math.PI / 2;
    ros.position.set(lx, seatY - cm(3.2), lz);
    g.add(leg, block, ros);
  }

  // Molded scalloped apron rails
  const apron = createRoundedSlab(cm(46), cm(44), cm(5.6), cm(5), frameMat, cm(0.5));
  apron.position.y = seatY - cm(6.0);
  const apronBead = createRoundedSlab(cm(47), cm(45), cm(1.2), cm(5.2), mats.whiteTrim, cm(0.2));
  apronBead.position.y = seatY - cm(6.2);

  // Plush piped-welt linen seat cushion
  const cushion = createRoundedSlab(cm(46.5), cm(44.5), cm(6.8), cm(6.5), mats.warmCreamFabric, cm(2.0));
  cushion.position.y = seatY - cm(1.0);
  const welt = createRoundedSlab(cm(47.2), cm(45.2), cm(0.8), cm(6.8), mats.crispWhiteLinen, cm(0.3));
  welt.position.y = seatY + cm(4.8);
  g.add(apron, apronBead, cushion, welt);

  // Fluted upright stiles + acorn finials + Carved Oval Medallion Backrest + Ribbon Crest!
  for (const sx of [-cm(19.2), cm(19.2)]) {
    const post = createTurnedLeg(cm(45), cm(1.75), frameMat);
    post.position.set(sx, seatY - cm(1), -cm(18.2));
    post.rotation.x = -0.09;
    const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(1.95), 14, 12), mats.whiteTrim);
    finial.scale.set(1, 1.32, 1);
    finial.position.set(sx, seatY + cm(44.5), -cm(22.2));
    g.add(post, finial);
  }

  const backFrame = new THREE.Mesh(new THREE.TorusGeometry(cm(17.2), cm(2.1), 14, 32), frameMat);
  backFrame.rotation.y = 0;
  backFrame.rotation.x = -0.09;
  backFrame.scale.set(1.02, 1.18, 0.85);
  backFrame.position.set(0, seatY + cm(25.5), -cm(20.2));

  const backCore = new THREE.Mesh(new THREE.CylinderGeometry(cm(16.2), cm(16.2), cm(2.8), 28), frameMat);
  backCore.rotation.x = Math.PI / 2 - 0.09;
  backCore.scale.set(1.02, 1, 1.18);
  backCore.position.set(0, seatY + cm(25.5), -cm(20.4));

  const backPad = new THREE.Mesh(new THREE.SphereGeometry(cm(15.6), 24, 18), mats.crispWhiteLinen);
  backPad.rotation.x = -0.09;
  backPad.scale.set(1.0, 1.16, 0.24);
  backPad.position.set(0, seatY + cm(25.5), -cm(19.6));

  // Carved top floral/ribbon crest ornament on medallion crown
  const crest = new THREE.Mesh(new THREE.SphereGeometry(cm(2.8), 14, 10), mats.whiteTrim);
  crest.scale.set(1.65, 0.75, 0.55);
  crest.position.set(0, seatY + cm(46.2), -cm(22.1));

  g.add(backFrame, backCore, backPad, crest);
  enableShadows(g, true, true);
  return g;
}

// Potted Country Botanical Tree / Planter (立體瓦楞白陶盆＋接水底盤＋分枝木質樹幹＋寫實雙色葉片)
export function createPottedPlant(mats, height = cm(95), potRadius = cm(16)) {
  const g = new THREE.Group();
  const potH = height * 0.34;

  // Ceramic drainage saucer at base
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(potRadius * 0.88, potRadius * 0.76, cm(2.2), 24),
    mats.terracottaCream
  );
  saucer.position.y = cm(1.1);
  g.add(saucer);

  // Ribbed country ceramic planter pot with rolled collar rim
  const potPts = [
    new THREE.Vector2(0, cm(1.5)),
    new THREE.Vector2(potRadius * 0.72, cm(1.5)),
    new THREE.Vector2(potRadius * 0.86, potH * 0.45),
    new THREE.Vector2(potRadius * 0.96, potH * 0.86),
    new THREE.Vector2(potRadius * 1.05, potH * 0.91),
    new THREE.Vector2(potRadius * 1.05, potH),
    new THREE.Vector2(potRadius * 0.9, potH),
    new THREE.Vector2(potRadius * 0.87, potH * 0.88),
    new THREE.Vector2(0, potH * 0.88),
  ];
  const pot = new THREE.Mesh(new THREE.LatheGeometry(potPts, 26), mats.terracottaCream);
  // Subtle decorative horizontal belly rings on planter
  for (const ry of [potH * 0.42, potH * 0.68]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(potRadius * (ry < potH * 0.5 ? 0.84 : 0.91), cm(0.4), 8, 26),
      mats.whiteTrim
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = ry;
    g.add(ring);
  }

  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(potRadius * 0.88, potRadius * 0.82, cm(2.2), 22),
    mats.soil
  );
  soil.position.y = potH * 0.88;
  g.add(pot, soil);

  // Woody central main trunk + branching olive/fiddle-leaf fronds
  const stemBaseY = potH * 0.88;
  const trunkTopY = stemBaseY + (height - stemBaseY) * 0.42;
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, stemBaseY, 0),
    new THREE.Vector3(cm(1.2), (stemBaseY + trunkTopY) * 0.5, -cm(0.8)),
    new THREE.Vector3(-cm(0.6), trunkTopY, cm(0.6)),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 10, potRadius * 0.085, 8, false), mats.woodBark || mats.warmWalnutAccent));

  // Pointed botanical leaf geometry (shared across plant for crispness & speed!)
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(cm(2.6), cm(3.2), 0, cm(9.2));
  leafShape.quadraticCurveTo(-cm(2.6), cm(3.2), 0, 0);
  const baseLeafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: cm(0.18), bevelEnabled: false, curveSegments: 8 });
  baseLeafGeo.rotateX(Math.PI * 0.42);

  const numFronds = 11;
  for (let i = 0; i < numFronds; i++) {
    const ang = (i / numFronds) * Math.PI * 2 + (i % 2) * 0.22;
    const reach = potRadius * (0.68 + (i % 3) * 0.46);
    const startY = stemBaseY + (trunkTopY - stemBaseY) * (0.35 + (i % 3) * 0.3);
    const topH = stemBaseY + (height - stemBaseY) * (0.62 + ((i * 7) % 5) * 0.09);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, startY, 0),
      new THREE.Vector3(Math.cos(ang) * reach * 0.48, (startY + topH) * 0.58, Math.sin(ang) * reach * 0.48),
      new THREE.Vector3(Math.cos(ang) * reach, topH, Math.sin(ang) * reach)
    );
    const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, cm(0.38), 6, false), mats.woodBark || mats.foliageSage);
    g.add(stem);

    for (let l = 2; l <= 6; l++) {
      const t = l / 6;
      const pt = curve.getPoint(t);
      const scale = (potRadius / cm(16)) * (1.08 - t * 0.28);
      const leaf = new THREE.Mesh(baseLeafGeo, l % 2 === 0 ? mats.foliageSage : mats.foliageOlive);
      leaf.scale.setScalar(scale);
      leaf.position.copy(pt);
      leaf.rotation.y = -ang + Math.PI / 2 + (l % 2 === 0 ? 0.58 : -0.58);
      leaf.rotation.z = (l % 2 === 0 ? 0.28 : -0.28) * t;
      g.add(leaf);
    }
  }
  enableShadows(g, true, true);
  return g;
}

// Country Pleated Ceramic Table Lamp (高精度百褶燈罩陶瓷檯燈：黃銅底座、旋鈕開關、燈架頂珠與滾邊百褶罩)
export function createPleatedTableLamp(mats, lightsRegistry, height = cm(44)) {
  const g = new THREE.Group();

  // Stepped Antique Brass Plinth Ring
  const brassPlinth = new THREE.Mesh(new THREE.CylinderGeometry(cm(6.8), cm(7.4), cm(1.6), 24), mats.antiqueBrass);
  brassPlinth.position.y = cm(0.8);
  g.add(brassPlinth);

  const basePts = [
    new THREE.Vector2(0, cm(1.5)),
    new THREE.Vector2(cm(6.4), cm(1.5)),
    new THREE.Vector2(cm(5.0), cm(4.2)),
    new THREE.Vector2(cm(8.5), height * 0.28),
    new THREE.Vector2(cm(7.2), height * 0.46),
    new THREE.Vector2(cm(2.4), height * 0.57),
    new THREE.Vector2(cm(1.4), height * 0.64),
    new THREE.Vector2(0, height * 0.64),
  ];
  const base = new THREE.Mesh(new THREE.LatheGeometry(basePts, 26), mats.porcelainGloss);
  const brassNeck = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.15), cm(1.45), cm(4.8), 16), mats.antiqueBrass);
  brassNeck.position.y = height * 0.64;

  // Vintage brass rotary turn-key switch on socket!
  const turnKey = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.22), cm(0.22), cm(2.6), 10), mats.antiqueBrass);
  turnKey.rotation.z = Math.PI / 2;
  turnKey.position.set(cm(1.5), height * 0.65, 0);
  const keyPaddle = new THREE.Mesh(new THREE.BoxGeometry(cm(1.1), cm(0.75), cm(0.2)), mats.antiqueBrass);
  keyPaddle.position.set(cm(2.8), height * 0.65, 0);

  // Knife-pleated conical fabric shade + top/bottom trim rings + top brass finial
  const shadeH = height * 0.42;
  const shadeGeo = new THREE.CylinderGeometry(cm(8.0), cm(13.8), shadeH, 48, 1, true);
  const pos = shadeGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const ang = Math.atan2(z, x);
    const rMod = 1 + Math.sin(ang * 20) * 0.048;
    pos.setX(i, x * rMod);
    pos.setZ(i, z * rMod);
  }
  shadeGeo.computeVertexNormals();
  const shadeMat = mats.milkGlassLamp.clone();
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.material.side = THREE.DoubleSide;
  shade.position.y = height * 0.79;

  // Spider spokes & top finial cap
  const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(1.05), 14, 12), mats.antiqueBrass);
  finial.scale.set(1, 1.35, 1);
  finial.position.y = height * 1.015;
  for (let s = 0; s < 3; s++) {
    const sa = (s / 3) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.14), cm(0.14), cm(8.0), 6), mats.antiqueBrass);
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = sa;
    spoke.position.set(Math.cos(sa) * cm(4.0), height * 0.99, -Math.sin(sa) * cm(4.0));
    g.add(spoke);
  }

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(cm(2.5), 12, 12), mats.warmBulbEmissive);
  bulb.position.y = height * 0.74;

  const ptLight = new THREE.PointLight(0xffcf87, 0.55, 2.8, 1.8);
  ptLight.position.y = height * 0.75;
  ptLight.castShadow = false;
  g.add(base, brassNeck, turnKey, keyPaddle, shade, finial, bulb, ptLight);

  if (lightsRegistry) {
    lightsRegistry.push({ light: ptLight, mat: shadeMat, baseIntensity: 0.95 });
  }
  enableShadows(g, true, true);
  return g;
}

// Framed Country Botanical Wall Art (雙層斜切卡紙＋實木外框與內金線壓條掛畫)
export function createFramedArt(w, h, artMat, mats) {
  const g = new THREE.Group();
  const frameT = cm(2.6);
  const depth = cm(2.4);
  const backing = new THREE.Mesh(new THREE.BoxGeometry(w, h, cm(0.7)), mats.whiteTrim);
  const matBoard = new THREE.Mesh(
    new THREE.BoxGeometry(w - frameT * 1.6, h - frameT * 1.6, cm(0.35)),
    mats.creamShaker
  );
  matBoard.position.z = cm(0.45);
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w - frameT * 2.1, h - frameT * 2.1), artMat);
  canvas.position.z = cm(0.68);

  // Outer stepped oak frame + inner antique brass fillet lip
  const topB = new THREE.Mesh(new THREE.BoxGeometry(w, frameT, depth), mats.naturalOak);
  topB.position.set(0, h / 2 - frameT / 2, depth / 2 - cm(0.35));
  const botB = topB.clone();
  botB.position.y = -h / 2 + frameT / 2;
  const lB = new THREE.Mesh(new THREE.BoxGeometry(frameT, h - frameT * 2, depth), mats.naturalOak);
  lB.position.set(-w / 2 + frameT / 2, 0, depth / 2 - cm(0.35));
  const rB = lB.clone();
  rB.position.x = w / 2 - frameT / 2;

  const lipW = cm(0.45);
  const inW = w - frameT * 2;
  const inH = h - frameT * 2;
  const lipT = new THREE.Mesh(new THREE.BoxGeometry(inW, lipW, cm(1.3)), mats.antiqueBrass);
  lipT.position.set(0, inH / 2 - lipW / 2, cm(0.75));
  const lipBo = lipT.clone();
  lipBo.position.y = -inH / 2 + lipW / 2;
  const lipL = new THREE.Mesh(new THREE.BoxGeometry(lipW, inH - lipW * 2, cm(1.3)), mats.antiqueBrass);
  lipL.position.set(-inW / 2 + lipW / 2, 0, cm(0.75));
  const lipR = lipL.clone();
  lipR.position.x = inW / 2 - lipW / 2;

  g.add(backing, matBoard, canvas, topB, botB, lB, rB, lipT, lipBo, lipL, lipR);
  enableShadows(g, true, true);
  return g;
}
