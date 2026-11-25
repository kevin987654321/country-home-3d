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

// Extruded rounded rectangle centered in X/Z, bottom at y=0, height = h
export function createRoundedSlab(width, depth, height, radius, material, bevel = cm(0.4)) {
  const hw = width / 2 - bevel;
  const hd = depth / 2 - bevel;
  const r = Math.min(radius, hw * 0.95, hd * 0.95);

  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.absarc(hw - r, -hd + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw, hd - r);
  shape.absarc(hw - r, hd - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw + r, hd);
  shape.absarc(-hw + r, hd - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw, -hd + r);
  shape.absarc(-hw + r, -hd + r, r, Math.PI, Math.PI * 1.5, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.002, height - bevel * 2),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 12,
  });
  geo.rotateX(Math.PI / 2);
  // After rotateX(PI/2), Y goes from bevel down to -(height - bevel) -> shift up
  geo.computeBoundingBox();
  const minY = geo.boundingBox.min.y;
  geo.translate(0, -minY, 0);

  // Remap UVs cleanly for wood grain / marble along X-Z
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const pz = pos.getZ(i);
    uv.setXY(i, (px + width / 2) / Math.max(width, 0.5) + py * 0.2, (pz + depth / 2) / Math.max(depth, 0.5));
  }
  uv.needsUpdate = true;

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Turned Country Baluster Leg (車枳實木桌椅腳)
export function createTurnedLeg(height, maxRadius, material) {
  const pts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(maxRadius * 0.52, 0),
    new THREE.Vector2(maxRadius * 0.62, height * 0.04),
    new THREE.Vector2(maxRadius * 0.46, height * 0.08),
    new THREE.Vector2(maxRadius * 0.55, height * 0.14),
    new THREE.Vector2(maxRadius * 0.78, height * 0.34),
    new THREE.Vector2(maxRadius * 0.96, height * 0.54),
    new THREE.Vector2(maxRadius * 0.72, height * 0.68),
    new THREE.Vector2(maxRadius * 0.92, height * 0.73),
    new THREE.Vector2(maxRadius * 0.66, height * 0.78),
    new THREE.Vector2(maxRadius * 0.95, height * 0.84),
    new THREE.Vector2(maxRadius * 0.95, height),
    new THREE.Vector2(0, height),
  ];
  const geo = new THREE.LatheGeometry(pts, 18);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Authentic Country Shaker / Mullioned Glass Door Panel (facing +Z by default, centered X/Y)
export function createShakerDoorFace(w, h, mats, opts = {}) {
  const {
    glass = false,
    louver = false,
    knobSide = 'right', // 'left' | 'right' | 'none'
    knobYRatio = 0.5,
    frameW = cm(5.2),
    thick = cm(2.0),
  } = opts;

  const group = new THREE.Group();
  const railW = Math.min(frameW, w * 0.24);
  const innerW = Math.max(cm(4), w - railW * 2);
  const innerH = Math.max(cm(4), h - railW * 2);

  // Backing / core panel
  if (glass) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), innerH + cm(1), cm(0.6)), mats.clearGlass);
    group.add(pane);
    // Country cross mullions
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(cm(1.4), innerH, cm(1.2)), mats.creamShaker);
    group.add(vBar);
    const hBars = h > cm(65) ? 2 : 1;
    for (let i = 1; i <= hBars; i++) {
      const hb = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(1.4), cm(1.2)), mats.creamShaker);
      hb.position.y = -innerH / 2 + (innerH * i) / (hBars + 1);
      group.add(hb);
    }
  } else {
    const panelMat = louver ? mats.beadboardFine : mats.beadboard;
    const centerPanel = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(0.8), innerH + cm(0.8), thick * 0.55), panelMat);
    centerPanel.position.z = -thick * 0.15;
    group.add(centerPanel);

    if (louver) {
      // Subtle horizontal louver slats for shoe cabinet breathability
      const slats = Math.min(10, Math.floor(innerH / cm(3.8)));
      for (let s = 0; s < slats; s++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(innerW - cm(1), cm(1.2), cm(0.8)), mats.creamShaker);
        slat.position.set(0, -innerH * 0.38 + (s / Math.max(1, slats - 1)) * innerH * 0.76, cm(0.2));
        slat.rotation.x = 0.35;
        group.add(slat);
      }
    }
  }

  // Left & Right Stiles
  const leftStile = new THREE.Mesh(new THREE.BoxGeometry(railW, h, thick), mats.creamShaker);
  leftStile.position.x = -w / 2 + railW / 2;
  const rightStile = new THREE.Mesh(new THREE.BoxGeometry(railW, h, thick), mats.creamShaker);
  rightStile.position.x = w / 2 - railW / 2;
  // Top & Bottom Rails
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(innerW, railW, thick), mats.creamShaker);
  topRail.position.y = h / 2 - railW / 2;
  const botRail = new THREE.Mesh(new THREE.BoxGeometry(innerW, railW, thick), mats.creamShaker);
  botRail.position.y = -h / 2 + railW / 2;
  group.add(leftStile, rightStile, topRail, botRail);

  // Inner decorative country bead trim
  const beadMat = mats.whiteTrim;
  const bThick = cm(0.7);
  const topBead = new THREE.Mesh(new THREE.BoxGeometry(innerW, bThick, thick * 0.92), beadMat);
  topBead.position.y = innerH / 2 - bThick / 2;
  const botBead = topBead.clone();
  botBead.position.y = -innerH / 2 + bThick / 2;
  const lBead = new THREE.Mesh(new THREE.BoxGeometry(bThick, innerH, thick * 0.92), beadMat);
  lBead.position.x = -innerW / 2 + bThick / 2;
  const rBead = lBead.clone();
  rBead.position.x = innerW / 2 - bThick / 2;
  group.add(topBead, botBead, lBead, rBead);

  // Antique Brass Country Knob
  if (knobSide !== 'none') {
    const kx = knobSide === 'right' ? w / 2 - railW * 0.52 : -w / 2 + railW * 0.52;
    const ky = (knobYRatio - 0.5) * h;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.65), cm(1.4), 12), mats.antiqueBrass);
    stem.rotation.x = Math.PI / 2;
    stem.position.set(kx, ky, thick / 2 + cm(0.6));
    const head = new THREE.Mesh(new THREE.SphereGeometry(cm(1.15), 14, 12), mats.antiqueBrass);
    head.scale.set(1, 1, 0.72);
    head.position.set(kx, ky, thick / 2 + cm(1.4));
    group.add(stem, head);
  }

  return group;
}

// Country Drawer Front (facing +Z)
export function createDrawerFront(w, h, mats, cupPull = true) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(w - cm(0.4), h - cm(0.4), cm(2.0)), mats.creamShaker);
  g.add(body);
  if (h > cm(12)) {
    const inset = new THREE.Mesh(new THREE.BoxGeometry(w - cm(7), h - cm(6.5), cm(0.5)), mats.whiteTrim);
    inset.position.z = cm(0.95);
    g.add(inset);
  }
  if (cupPull) {
    // Classic country bin cup pull in antique brass
    const pull = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(2.4), cm(2.4), cm(1.2), 16, 1, false, 0, Math.PI),
      mats.antiqueBrass
    );
    pull.rotation.z = Math.PI / 2;
    pull.rotation.y = Math.PI / 2;
    pull.position.set(0, 0, cm(1.1));
    const plate = new THREE.Mesh(new THREE.BoxGeometry(cm(6.4), cm(2.2), cm(0.3)), mats.antiqueBrass);
    plate.position.set(0, 0, cm(1.05));
    g.add(plate, pull);
  } else {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(cm(1.1), 12, 10), mats.antiqueBrass);
    knob.position.set(0, 0, cm(1.8));
    g.add(knob);
  }
  return g;
}

/**
 * Full Interactive Hinged Country Door Assembly
 * Coordinates in meters.
 * axis: 'x' (opening runs along X, wall thickness along Z) or 'z' (opening runs along Z, wall thickness along X)
 */
export function createCountryDoor(config, mats, doorsRegistry) {
  const {
    name,
    hingeX,
    hingeZ,
    width, // clear leaf width
    height = cm(212),
    wallThick = cm(10),
    axis = 'x', // 'x' = leaf lies along +X or -X when closed; 'z' = leaf lies along +Z or -Z when closed
    leafDir = 1, // +1 or -1 along axis from hinge
    openAngle = Math.PI * 0.46, // signed rotation.y when open (matching blueprint!)
    style = 'panel', // 'panel' | 'bath' | 'entrance' | 'balcony'
  } = config;

  const root = new THREE.Group();
  root.position.set(hingeX, 0, hingeZ);

  // Door frame jambs & architrave molding (門框與雙面鄉村風線板門套)
  const jambThick = cm(2.2);
  const casingW = cm(7.0);
  const casingT = cm(1.6);

  const frameGroup = new THREE.Group();
  // Build in local space where opening spans [0 .. width] along +X, centered on Z=0
  const spanSign = leafDir;
  const cx = (spanSign * width) / 2;

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
  frameGroup.add(j1, j2, headJamb);

  // Architrave casings on both faces (+Z and -Z) with country header pediment cap!
  for (const zSide of [-1, 1]) {
    const zPos = zSide * (wallThick / 2 + casingT / 2);
    const cL = new THREE.Mesh(new THREE.BoxGeometry(casingW, height + casingW, casingT), mats.whiteTrim);
    cL.position.set(-spanSign * (casingW * 0.45), (height + casingW) / 2, zPos);
    const cR = new THREE.Mesh(new THREE.BoxGeometry(casingW, height + casingW, casingT), mats.whiteTrim);
    cR.position.set(spanSign * (width + casingW * 0.45), (height + casingW) / 2, zPos);
    const cTop = new THREE.Mesh(
      new THREE.BoxGeometry(width + casingW * 2.1, casingW * 1.15, casingT * 1.25),
      mats.whiteTrim
    );
    cTop.position.set(cx, height + casingW * 0.65, zPos + zSide * cm(0.2));
    // Crown lip over door header
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(width + casingW * 2.4, cm(2.2), casingT * 1.7),
      mats.whiteTrim
    );
    crown.position.set(cx, height + casingW * 1.25, zPos + zSide * cm(0.4));
    frameGroup.add(cL, cR, cTop, crown);
  }

  // Rotate frameGroup if axis === 'z'
  if (axis === 'z') {
    frameGroup.rotation.y = -Math.PI / 2;
  }
  root.add(frameGroup);

  // Hinged Door Leaf Pivot
  const pivot = new THREE.Group();
  const baseRotY = axis === 'z' ? -Math.PI / 2 : 0;
  pivot.rotation.y = baseRotY + openAngle;

  const leafThick = style === 'entrance' ? cm(4.8) : cm(4.0);
  const leafGroup = new THREE.Group();
  leafGroup.position.set((spanSign * width) / 2, height / 2, 0);

  const stileW = cm(10.5);
  const innerW = width - stileW * 2;
  const leafMat = style === 'entrance' ? mats.warmIvoryCabinet : mats.creamShaker;

  // Outer stiles & rails
  const stL = new THREE.Mesh(new THREE.BoxGeometry(stileW, height - cm(1), leafThick), leafMat);
  stL.position.x = -width / 2 + stileW / 2;
  const stR = new THREE.Mesh(new THREE.BoxGeometry(stileW, height - cm(1), leafThick), leafMat);
  stR.position.x = width / 2 - stileW / 2;
  const rTop = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(12), leafThick), leafMat);
  rTop.position.y = height / 2 - cm(6.5);
  const rMid = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(11), leafThick), leafMat);
  rMid.position.y = -cm(12);
  const rBot = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(18), leafThick), leafMat);
  rBot.position.y = -height / 2 + cm(9.5);
  leafGroup.add(stL, stR, rTop, rMid, rBot);

  // Upper & Lower Panels
  const upH = height / 2 - cm(6.5) - (-cm(12) + cm(5.5));
  const upY = (height / 2 - cm(12.5) + (-cm(6.5))) / 2;
  if (style === 'bath' || style === 'balcony' || style === 'entrance') {
    const glassMat = style === 'balcony' ? mats.clearGlass : mats.frostedGlass;
    const gPane = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), upH + cm(1), cm(1.0)), glassMat);
    gPane.position.y = upY;
    leafGroup.add(gPane);
    // Country muntin bars
    const mv = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), upH, cm(1.8)), mats.whiteTrim);
    mv.position.y = upY;
    const mh1 = new THREE.Mesh(new THREE.BoxGeometry(innerW, cm(1.6), cm(1.8)), mats.whiteTrim);
    mh1.position.y = upY + upH * 0.22;
    const mh2 = mh1.clone();
    mh2.position.y = upY - upH * 0.22;
    leafGroup.add(mv, mh1, mh2);
  } else {
    // Classic 2-over-2 or single upper raised country panel
    const upCore = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), upH + cm(1), leafThick * 0.48), mats.beadboardFine);
    upCore.position.y = upY;
    const upRaise = new THREE.Mesh(new THREE.BoxGeometry(innerW - cm(5), upH - cm(5), leafThick * 0.86), leafMat);
    upRaise.position.y = upY;
    leafGroup.add(upCore, upRaise);
  }

  // Lower raised panel
  const lowH = -cm(17.5) - (-height / 2 + cm(18.5));
  const lowY = (-cm(17.5) + (-height / 2 + cm(18.5))) / 2;
  const lowCore = new THREE.Mesh(new THREE.BoxGeometry(innerW + cm(1), lowH + cm(1), leafThick * 0.48), mats.whiteTrim);
  lowCore.position.y = lowY;
  const lowRaise = new THREE.Mesh(new THREE.BoxGeometry(innerW - cm(5), lowH - cm(5), leafThick * 0.86), leafMat);
  lowRaise.position.y = lowY;
  leafGroup.add(lowCore, lowRaise);

  // Antique Brass Lever Handles & Backplates on both faces
  const handleX = spanSign * (width / 2 - cm(6.2));
  const handleY = -height / 2 + cm(98);
  for (const side of [-1, 1]) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(cm(3.6), cm(15), cm(0.6)), mats.antiqueBrass);
    plate.position.set(handleX, handleY, side * (leafThick / 2 + cm(0.3)));
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.8), cm(0.9), cm(3.4), 12), mats.antiqueBrass);
    neck.rotation.x = Math.PI / 2;
    neck.position.set(handleX, handleY + cm(1.8), side * (leafThick / 2 + cm(1.8)));
    const lever = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.6), cm(10.5), 12), mats.antiqueBrass);
    lever.rotation.z = Math.PI / 2;
    lever.position.set(handleX - spanSign * cm(4.2), handleY + cm(1.8), side * (leafThick / 2 + cm(3.3)));
    leafGroup.add(plate, neck, lever);
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
      c.userData.inspectMeta = `寬 ${Math.round(width * 100)} × 高 ${Math.round(height * 100)} cm｜純白鄉村風立體線板門＋復古銅金把手`;
    }
  });

  if (doorsRegistry) doorsRegistry.push(doorRecord);
  enableShadows(root, true, true);
  return root;
}

/**
 * White Country Mullioned Composite Window (Fixed Picture Window + Outward Casement Sash + Sheer Curtains)
 * Placed centered at (cx, sillY..topY, cz).
 * wallAxis: 'z' (East/West wall running along Z, normal inward is -X or +X) or 'x' (North/South wall running along X)
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
    wallAxis = 'z', // 'z' for East/West wall, 'x' for South wall
    inwardSign = -1, // -1 means interior is -X (for East wall) or -Z (for South wall)
    casementRatio = 0.36, // portion of window that opens outward
    casementAtStart = false, // true = casement at lower coordinate end, false = at higher end
    hasCurtains = true,
  } = config;

  const winH = headY - sillY;
  const group = new THREE.Group();
  group.position.set(cx, sillY + winH / 2, cz);
  if (wallAxis === 'z') {
    // Rotate so local +X runs along Z, and local +Z points along +X (exterior for East wall when inwardSign = -1)
    group.rotation.y = -Math.PI / 2;
  }
  // Now in local coords: window width runs along local X [-totalLen/2 .. +totalLen/2], height [-winH/2 .. +winH/2]
  // If wallAxis === 'z': local +X -> world +Z, local +Z -> world -X! Wait: rotation.y = -PI/2 maps:
  // local (1,0,0) -> (0,0,1) (+Z)
  // local (0,0,1) -> (-1,0,0) (-X, which IS inward for East wall!).
  // Let's make `inDir` in local Z cleanly explicit:
  const localInZ = wallAxis === 'z' ? (inwardSign === -1 ? 1 : -1) : inwardSign;

  const frameT = cm(4.2);
  // Outer perimeter frame
  const topF = new THREE.Mesh(new THREE.BoxGeometry(totalLen, frameT, wallThick + cm(1.5)), mats.whiteTrim);
  topF.position.y = winH / 2 - frameT / 2;
  const botF = topF.clone();
  botF.position.y = -winH / 2 + frameT / 2;
  const leftF = new THREE.Mesh(new THREE.BoxGeometry(frameT, winH, wallThick + cm(1.5)), mats.whiteTrim);
  leftF.position.x = -totalLen / 2 + frameT / 2;
  const rightF = leftF.clone();
  rightF.position.x = totalLen / 2 - frameT / 2;
  group.add(topF, botF, leftF, rightF);

  // Deep Country Interior Window Sill (加厚白色鄉村風窗台板 + 下緣線板)
  const sillBoard = new THREE.Mesh(
    new THREE.BoxGeometry(totalLen + cm(12), cm(3.0), wallThick + cm(8)),
    mats.whiteTrim
  );
  sillBoard.position.set(0, -winH / 2 - cm(0.5), localInZ * cm(3.2));
  const sillApron = new THREE.Mesh(
    new THREE.BoxGeometry(totalLen + cm(8), cm(4.5), cm(1.8)),
    mats.whiteTrim
  );
  sillApron.position.set(0, -winH / 2 - cm(3.8), localInZ * (wallThick / 2 + cm(1.2)));
  group.add(sillBoard, sillApron);

  // Interior architrave trim
  const trimW = cm(5.8);
  const tL = new THREE.Mesh(new THREE.BoxGeometry(trimW, winH + trimW, cm(1.5)), mats.whiteTrim);
  tL.position.set(-totalLen / 2 - trimW * 0.35, trimW * 0.3, localInZ * (wallThick / 2 + cm(0.8)));
  const tR = tL.clone();
  tR.position.x = totalLen / 2 + trimW * 0.35;
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(totalLen + trimW * 2, trimW * 1.1, cm(2.0)), mats.whiteTrim);
  tTop.position.set(0, winH / 2 + trimW * 0.45, localInZ * (wallThick / 2 + cm(1.0)));
  group.add(tL, tR, tTop);

  // Split into Fixed section & Outward Casement section
  const casementW = totalLen * casementRatio;
  const fixedW = totalLen - casementW;
  const mullionX = casementAtStart ? -totalLen / 2 + casementW : totalLen / 2 - casementW;

  const centerMullion = new THREE.Mesh(
    new THREE.BoxGeometry(cm(4.0), winH - frameT * 2, wallThick * 0.85),
    mats.whiteTrim
  );
  centerMullion.position.x = mullionX;
  group.add(centerMullion);

  // Fixed Pane + Country Grid Muntins
  const fixedCenterX = casementAtStart ? mullionX + fixedW / 2 : -totalLen / 2 + fixedW / 2;
  const innerH = winH - frameT * 2;
  const fixedGlass = new THREE.Mesh(new THREE.BoxGeometry(fixedW - cm(4), innerH, cm(1.0)), mats.clearGlass);
  fixedGlass.position.x = fixedCenterX;
  group.add(fixedGlass);

  // Muntin grid on fixed window
  const vCols = fixedW > cm(110) ? 2 : 1;
  for (let c = 1; c <= vCols; c++) {
    const mb = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), innerH, cm(1.8)), mats.whiteTrim);
    mb.position.x = fixedCenterX - fixedW / 2 + (fixedW * c) / (vCols + 1);
    group.add(mb);
  }
  for (let r = 1; r <= 2; r++) {
    const hb = new THREE.Mesh(new THREE.BoxGeometry(fixedW - cm(4), cm(1.6), cm(1.8)), mats.whiteTrim);
    hb.position.set(fixedCenterX, -innerH / 2 + (innerH * r) / 3, 0);
    group.add(hb);
  }

  // Outward-Opening Casement Sash (外推格柵窗扇，微開 24° 呈現通風立體感，完全呼應平面圖外推斜線)
  const sashPivot = new THREE.Group();
  const sashHingeX = casementAtStart ? -totalLen / 2 + frameT : totalLen / 2 - frameT;
  const sashSpanSign = casementAtStart ? 1 : -1;
  sashPivot.position.set(sashHingeX, 0, -localInZ * (wallThick * 0.3));
  const sashLeafW = casementW - frameT - cm(2);
  const sashGroup = new THREE.Group();
  sashGroup.position.x = (sashSpanSign * sashLeafW) / 2;

  const sStile = cm(3.4);
  const sTop = new THREE.Mesh(new THREE.BoxGeometry(sashLeafW, sStile, cm(3.2)), mats.whiteTrim);
  sTop.position.y = innerH / 2 - sStile / 2;
  const sBot = sTop.clone();
  sBot.position.y = -innerH / 2 + sStile / 2;
  const sL = new THREE.Mesh(new THREE.BoxGeometry(sStile, innerH, cm(3.2)), mats.whiteTrim);
  sL.position.x = -sashLeafW / 2 + sStile / 2;
  const sR = sL.clone();
  sR.position.x = sashLeafW / 2 - sStile / 2;
  const sGlass = new THREE.Mesh(new THREE.BoxGeometry(sashLeafW - sStile * 2, innerH - sStile * 2, cm(0.8)), mats.clearGlass);
  // Horizontal muntin bars on casement
  const sh1 = new THREE.Mesh(new THREE.BoxGeometry(sashLeafW - sStile * 2, cm(1.5), cm(1.6)), mats.whiteTrim);
  sh1.position.y = innerH / 6;
  const sh2 = sh1.clone();
  sh2.position.y = -innerH / 6;
  // Brass casement latch handle inside
  const latch = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(5.5), cm(2.2)), mats.antiqueBrass);
  latch.position.set(sashSpanSign * (sashLeafW / 2 - cm(2.0)), -cm(8), localInZ * cm(2.2));
  sashGroup.add(sTop, sBot, sL, sR, sGlass, sh1, sh2, latch);
  sashPivot.add(sashGroup);
  // Swing outward (away from localInZ)
  sashPivot.rotation.y = -localInZ * sashSpanSign * 0.34;
  group.add(sashPivot);

  // Flowing Sheer White Country Linen Curtains + Brass/White Rod
  if (hasCurtains) {
    const curtainGroup = new THREE.Group();
    const rodLen = totalLen + cm(28);
    const rodY = winH / 2 + cm(11);
    const rodZ = localInZ * (wallThick / 2 + cm(7.5));
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(1.0), cm(1.0), rodLen, 14),
      mats.antiqueBrass
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, rodY, rodZ);
    curtainGroup.add(rod);

    for (const endSign of [-1, 1]) {
      const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(2.1), 14, 12), mats.antiqueBrass);
      finial.position.set(endSign * (rodLen / 2 + cm(1.2)), rodY, rodZ);
      const bracket = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.6), cm(0.6), cm(7.5), 10), mats.antiqueBrass);
      bracket.rotation.x = Math.PI / 2;
      bracket.position.set(endSign * (totalLen / 2 + cm(5)), rodY, localInZ * (wallThick / 2 + cm(3.8)));
      curtainGroup.add(finial, bracket);

      // Sinusoidal pleated sheer drape hanging down nearly to floor
      const drapeH = sillY + winH + cm(6);
      const drapeW = Math.min(cm(42), totalLen * 0.27);
      const waveShape = new THREE.Shape();
      const folds = 6;
      waveShape.moveTo(0, 0);
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const wx = t * drapeW;
        const wz = Math.sin(t * Math.PI * folds) * cm(2.6);
        if (i === 0) waveShape.moveTo(wx, wz);
        else waveShape.lineTo(wx, wz);
      }
      for (let i = 40; i >= 0; i--) {
        const t = i / 40;
        const wx = t * drapeW;
        const wz = Math.sin(t * Math.PI * folds) * cm(2.6) + cm(0.45);
        waveShape.lineTo(wx, wz);
      }
      waveShape.closePath();
      const drapeGeo = new THREE.ExtrudeGeometry(waveShape, { depth: drapeH, bevelEnabled: false });
      drapeGeo.rotateX(Math.PI / 2);
      const drapeMesh = new THREE.Mesh(drapeGeo, mats.sheerCurtain);
      const startX = endSign === -1 ? -totalLen / 2 - cm(8) : totalLen / 2 + cm(8) - drapeW;
      drapeMesh.position.set(startX, rodY, rodZ - cm(1.2));
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
    `寬 ${Math.round(totalLen * 100)} × 高 ${Math.round(winH * 100)} cm｜純白十字格柵窗＋外推通風窗扇＋亞麻透光紗簾`
  );
  enableShadows(group, true, true);
  return group;
}

// Plump Country Ruffled Pillow (飽滿荷葉邊枕頭)
export function createCountryPillow(w, d, h, material) {
  const geo = new THREE.SphereGeometry(0.5, 22, 16);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Superellipsoid squashed pillow shape with pinched corners
    const sx = Math.sign(x) * Math.pow(Math.abs(x * 2), 0.78) * (w / 2);
    const sz = Math.sign(z) * Math.pow(Math.abs(z * 2), 0.78) * (d / 2);
    const edgeFactor = 1 + 0.12 * (Math.abs(x) * 2) * (Math.abs(z) * 2);
    const sy = y * h * edgeFactor;
    pos.setXYZ(i, sx, sy, sz);
  }
  geo.computeVertexNormals();
  const group = new THREE.Group();
  const core = new THREE.Mesh(geo, material);
  // Subtle country flange rim around pillow perimeter
  const rim = new THREE.Mesh(new THREE.BoxGeometry(w + cm(3), cm(0.8), d + cm(3)), material);
  group.add(core, rim);
  enableShadows(group, true, true);
  return group;
}

// Country Spindle-Back Windsor Chair (白色溫莎餐椅 / 書桌椅，預設面向 +Z)
export function createWindsorChair(mats, cushionMat = null) {
  const g = new THREE.Group();
  const seatY = cm(45);
  const woodMat = mats.creamShaker;

  // Splayed turned legs + H-stretcher
  const legPositions = [
    [-cm(17), -cm(16), -0.07, 0.06],
    [cm(17), -cm(16), 0.07, 0.06],
    [-cm(18), cm(16), -0.06, -0.05],
    [cm(18), cm(16), 0.06, -0.05],
  ];
  for (const [lx, lz, rz, rx] of legPositions) {
    const leg = createTurnedLeg(seatY, cm(1.8), woodMat);
    leg.position.set(lx, 0, lz);
    leg.rotation.set(rx, 0, rz);
    g.add(leg);
  }
  const strL = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.8), cm(0.8), cm(32), 10), woodMat);
  strL.rotation.x = Math.PI / 2;
  strL.position.set(-cm(16.5), cm(15), 0);
  const strR = strL.clone();
  strR.position.x = cm(16.5);
  const strM = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.85), cm(0.85), cm(33), 10), woodMat);
  strM.rotation.z = Math.PI / 2;
  strM.position.set(0, cm(15), 0);
  g.add(strL, strR, strM);

  // Contoured saddle wood seat (natural oak contrast or cream white)
  const seat = createRoundedSlab(cm(44), cm(42), cm(3.2), cm(9), mats.naturalOak, cm(0.6));
  seat.position.y = seatY - cm(1);
  g.add(seat);

  if (cushionMat) {
    const pad = createRoundedSlab(cm(39), cm(37), cm(3.2), cm(7), cushionMat, cm(1.0));
    pad.position.set(0, seatY + cm(2.0), cm(0.5));
    g.add(pad);
  }

  // Curved Hoop / Bow Backrest + 7 Spindles
  const backH = cm(43);
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-cm(19), seatY + cm(1), -cm(12)),
    new THREE.Vector3(-cm(20), seatY + backH * 0.62, -cm(16.5)),
    new THREE.Vector3(-cm(13), seatY + backH * 0.96, -cm(18.5)),
    new THREE.Vector3(0, seatY + backH, -cm(19)),
    new THREE.Vector3(cm(13), seatY + backH * 0.96, -cm(18.5)),
    new THREE.Vector3(cm(20), seatY + backH * 0.62, -cm(16.5)),
    new THREE.Vector3(cm(19), seatY + cm(1), -cm(12)),
  ]);
  const bow = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 28, cm(1.35), 10, false), woodMat);
  g.add(bow);

  const numSpindles = 7;
  for (let i = 0; i < numSpindles; i++) {
    const t = 0.16 + (i / (numSpindles - 1)) * 0.68;
    const topPt = archCurve.getPoint(t);
    const botPt = new THREE.Vector3((i - 3) * cm(4.6), seatY + cm(1.5), -cm(15.5) + Math.abs(i - 3) * cm(0.6));
    const dir = new THREE.Vector3().subVectors(topPt, botPt);
    const len = dir.length();
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.52), cm(0.65), len, 8), woodMat);
    sp.position.copy(botPt).addScaledVector(dir, 0.5);
    sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.add(sp);
  }

  enableShadows(g, true, true);
  return g;
}

// French Country Upholstered Dining Chair (法式鄉村風亞麻軟墊餐椅，面向 +Z)
export function createCountryDiningChair(mats) {
  const g = new THREE.Group();
  const seatY = cm(45);
  const frameMat = mats.creamShaker;

  for (const [lx, lz] of [[-cm(19), -cm(18)], [cm(19), -cm(18)], [-cm(20), cm(18)], [cm(20), cm(18)]]) {
    const leg = createTurnedLeg(seatY - cm(2), cm(2.0), frameMat);
    leg.position.set(lx, 0, lz);
    g.add(leg);
  }
  // Apron rails
  const apron = createRoundedSlab(cm(46), cm(44), cm(5.5), cm(5), frameMat, cm(0.4));
  apron.position.y = seatY - cm(6);
  // Plush upholstered linen seat
  const cushion = createRoundedSlab(cm(47), cm(45), cm(6.5), cm(6), mats.warmCreamFabric, cm(1.8));
  cushion.position.y = seatY - cm(1);
  g.add(apron, cushion);

  // Carved oval/shield country backrest posts + padded medallion back
  for (const sx of [-cm(19), cm(19)]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.5), cm(1.8), cm(45), 12), frameMat);
    post.position.set(sx, seatY + cm(21), -cm(18.5));
    post.rotation.x = -0.09;
    const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(1.9), 10, 10), frameMat);
    finial.position.set(sx, seatY + cm(44), -cm(20.5));
    g.add(post, finial);
  }
  const backFrame = new THREE.Mesh(new THREE.CylinderGeometry(cm(18.5), cm(18.5), cm(3.2), 24), frameMat);
  backFrame.rotation.x = Math.PI / 2 - 0.09;
  backFrame.scale.set(1.02, 1, 1.18);
  backFrame.position.set(0, seatY + cm(25), -cm(19.5));

  const backPad = new THREE.Mesh(new THREE.CylinderGeometry(cm(15.5), cm(15.5), cm(4.2), 24), mats.crispWhiteLinen);
  backPad.rotation.x = Math.PI / 2 - 0.09;
  backPad.scale.set(1.0, 1, 1.16);
  backPad.position.set(0, seatY + cm(25), -cm(19.3));
  g.add(backFrame, backPad);

  enableShadows(g, true, true);
  return g;
}

// Potted Country Plant (橄欖樹 / 琴葉榕 / 室內觀葉盆栽，完美呼應平面圖閱讀角星形植栽符號)
export function createPottedPlant(mats, height = cm(95), potRadius = cm(16)) {
  const g = new THREE.Group();
  // Ribbed white ceramic country planter pot
  const potPts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(potRadius * 0.72, 0),
    new THREE.Vector2(potRadius * 0.96, height * 0.3),
    new THREE.Vector2(potRadius * 1.04, height * 0.32),
    new THREE.Vector2(potRadius * 1.04, height * 0.35),
    new THREE.Vector2(potRadius * 0.9, height * 0.35),
    new THREE.Vector2(potRadius * 0.88, height * 0.31),
    new THREE.Vector2(0, height * 0.31),
  ];
  const pot = new THREE.Mesh(new THREE.LatheGeometry(potPts, 20), mats.terracottaCream);
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(potRadius * 0.88, potRadius * 0.82, cm(2), 18), mats.soil);
  soil.position.y = height * 0.31;
  g.add(pot, soil);

  // Natural branching stems + star-arranged foliage leaves
  const stemBaseY = height * 0.31;
  const numFronds = 9;
  for (let i = 0; i < numFronds; i++) {
    const ang = (i / numFronds) * Math.PI * 2 + (i % 2) * 0.25;
    const reach = potRadius * (0.65 + (i % 3) * 0.45);
    const topH = stemBaseY + (height - stemBaseY) * (0.62 + ((i * 7) % 5) * 0.09);
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, stemBaseY, 0),
      new THREE.Vector3(Math.cos(ang) * reach * 0.45, (stemBaseY + topH) * 0.58, Math.sin(ang) * reach * 0.45),
      new THREE.Vector3(Math.cos(ang) * reach, topH, Math.sin(ang) * reach)
    );
    const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, cm(0.45), 6, false), mats.foliageSage);
    g.add(stem);

    // Leaves along frond
    for (let l = 2; l <= 6; l++) {
      const t = l / 6;
      const pt = curve.getPoint(t);
      const leafGeo = new THREE.SphereGeometry(cm(5.2) * (1.15 - t * 0.35), 8, 6);
      leafGeo.scale(1.6, 0.14, 0.62);
      const leaf = new THREE.Mesh(leafGeo, l % 2 === 0 ? mats.foliageSage : mats.foliageOlive);
      leaf.position.copy(pt);
      leaf.rotation.y = -ang + (l % 2 === 0 ? 0.5 : -0.5);
      leaf.rotation.z = -0.35 * t;
      g.add(leaf);
    }
  }
  enableShadows(g, true, true);
  return g;
}

// Country Pleated Ceramic Table Lamp (鄉村風百褶布罩檯燈，對應平面圖書桌 ⊕ 燈具符號)
export function createPleatedTableLamp(mats, lightsRegistry, height = cm(44)) {
  const g = new THREE.Group();
  const basePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(6.5), 0),
    new THREE.Vector2(cm(7.2), cm(2.0)),
    new THREE.Vector2(cm(5.2), cm(4.5)),
    new THREE.Vector2(cm(8.2), height * 0.28),
    new THREE.Vector2(cm(6.5), height * 0.48),
    new THREE.Vector2(cm(2.2), height * 0.56),
    new THREE.Vector2(cm(1.2), height * 0.65),
    new THREE.Vector2(0, height * 0.65),
  ];
  const base = new THREE.Mesh(new THREE.LatheGeometry(basePts, 20), mats.porcelainGloss);
  const brassNeck = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.1), cm(1.3), cm(4), 12), mats.antiqueBrass);
  brassNeck.position.y = height * 0.63;

  // Pleated fabric conical shade
  const shadeH = height * 0.42;
  const shadeGeo = new THREE.CylinderGeometry(cm(8.0), cm(13.5), shadeH, 28, 1, true);
  const pos = shadeGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const ang = Math.atan2(z, x);
    const rMod = 1 + Math.sin(ang * 14) * 0.045;
    pos.setX(i, x * rMod);
    pos.setZ(i, z * rMod);
  }
  shadeGeo.computeVertexNormals();
  const shadeMat = mats.milkGlassLamp.clone();
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.material.side = THREE.DoubleSide;
  shade.position.y = height * 0.78;

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(cm(2.4), 10, 10), mats.warmBulbEmissive);
  bulb.position.y = height * 0.73;

  const ptLight = new THREE.PointLight(0xffcf87, 0.55, 2.8, 1.8);
  ptLight.position.y = height * 0.75;
  ptLight.castShadow = false;
  g.add(base, brassNeck, shade, bulb, ptLight);

  if (lightsRegistry) {
    lightsRegistry.push({ light: ptLight, mat: shadeMat, baseIntensity: 0.95 });
  }
  enableShadows(g, true, true);
  return g;
}

// Framed Country Botanical Wall Art (白色立體畫框植物掛畫)
export function createFramedArt(w, h, artMat, mats) {
  const g = new THREE.Group();
  const frameT = cm(2.6);
  const depth = cm(2.2);
  const backing = new THREE.Mesh(new THREE.BoxGeometry(w, h, cm(0.8)), mats.whiteTrim);
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w - frameT * 1.8, h - frameT * 1.8), artMat);
  canvas.position.z = cm(0.55);

  const topB = new THREE.Mesh(new THREE.BoxGeometry(w, frameT, depth), mats.naturalOak);
  topB.position.set(0, h / 2 - frameT / 2, depth / 2 - cm(0.4));
  const botB = topB.clone();
  botB.position.y = -h / 2 + frameT / 2;
  const lB = new THREE.Mesh(new THREE.BoxGeometry(frameT, h - frameT * 2, depth), mats.naturalOak);
  lB.position.set(-w / 2 + frameT / 2, 0, depth / 2 - cm(0.4));
  const rB = lB.clone();
  rB.position.x = w / 2 - frameT / 2;

  g.add(backing, canvas, topB, botB, lB, rB);
  enableShadows(g, true, true);
  return g;
}
