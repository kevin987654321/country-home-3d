import * as THREE from 'three';
import {
  cm,
  tagItem,
  enableShadows,
  createRoundedSlab,
  createRaisedPanel,
  createHardcoverBook,
  createCountryPillow,
  createShakerDoorFace,
  createDrawerFront,
} from './primitives.js';

/**
 * Ultra-Detailed South-East Bedroom (右下角房間 / 東南次臥)
 * Modeled 1:1 from both the floor plan (q4_bot_right) and the interior design render (image_2.jpeg)
 */
export function createSEBedroomUltraDetail(mats, lightsRegistry) {
  const roomGroup = new THREE.Group();
  const eastWallAttachments = new THREE.Group();
  const southWallAttachments = new THREE.Group();

  const whiteLacquer = mats.pureMatteWhite;

  // 1. East Wall Boxed Structural Beam & Recessed Curtain Pelmet + Concealed Aluminum Track
  const pelmetGroup = new THREE.Group();
  const beamFront = new THREE.Mesh(new THREE.BoxGeometry(cm(11), cm(39), cm(236)), whiteLacquer);
  beamFront.position.set(cm(819.5), cm(265.5), cm(685));
  const beamTrackTop = new THREE.Mesh(new THREE.BoxGeometry(cm(13), cm(29), cm(236)), whiteLacquer);
  beamTrackTop.position.set(cm(831.5), cm(270.5), cm(685));
  const trackRail = new THREE.Mesh(new THREE.BoxGeometry(cm(2.2), cm(1.2), cm(220)), mats.brushedNickel);
  trackRail.position.set(cm(829.5), cm(255.4), cm(685));
  pelmetGroup.add(beamFront, beamTrackTop, trackRail);
  tagItem(pelmetGroup, '東南次臥包樑與隱藏式靜音軌道窗簾盒', '深 24 × 高 39 cm｜無縫純白木作包樑結合內嵌鋁合金靜音滑軌');
  eastWallAttachments.add(pelmetGroup);

  // 2. East Wall Deep-Reveal Symmetric Double-Casement White Window
  const winGroup = new THREE.Group();
  const zStart = cm(601), zEnd = cm(758);
  const zMid = (zStart + zEnd) / 2;
  const winLen = zEnd - zStart;
  const sillY = cm(88), headY = cm(232);
  const winH = headY - sillY;
  const winMidY = (sillY + headY) / 2;

  const revealDepth = cm(17);
  const revX = cm(845);
  const revTop = new THREE.Mesh(new THREE.BoxGeometry(revealDepth, cm(2.2), winLen + cm(2)), whiteLacquer);
  revTop.position.set(revX, headY - cm(1.1), zMid);
  const revSill = createRoundedSlab(revealDepth + cm(3.8), winLen + cm(10), cm(2.6), cm(0.8), whiteLacquer, cm(0.35));
  revSill.position.set(revX - cm(1.5), sillY, zMid);
  const revNorth = new THREE.Mesh(new THREE.BoxGeometry(revealDepth, winH, cm(2.2)), whiteLacquer);
  revNorth.position.set(revX, winMidY, zStart + cm(1.1));
  const revSouth = revNorth.clone();
  revSouth.position.z = zEnd - cm(1.1);
  winGroup.add(revTop, revSill, revNorth, revSouth);

  const trimW = cm(5.5), trimT = cm(1.4), trimX = cm(837.3);
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(trimT, trimW, winLen + trimW * 2), whiteLacquer);
  tTop.position.set(trimX, headY + trimW * 0.42, zMid);
  const tBot = new THREE.Mesh(new THREE.BoxGeometry(trimT, cm(4.2), winLen + trimW * 2), whiteLacquer);
  tBot.position.set(trimX, sillY - cm(1.4), zMid);
  const tN = new THREE.Mesh(new THREE.BoxGeometry(trimT, winH + trimW, trimW), whiteLacquer);
  tN.position.set(trimX, winMidY + cm(0.6), zStart - trimW * 0.42);
  const tS = tN.clone();
  tS.position.z = zEnd + trimW * 0.42;
  winGroup.add(tTop, tBot, tN, tS);

  const sashX = cm(850);
  const outerFrameT = cm(3.8);
  const innerClearH = winH - cm(4.8);
  const innerClearLen = winLen - cm(4.4);

  const ofTop = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), outerFrameT, innerClearLen), mats.whiteTrim);
  ofTop.position.set(sashX, headY - cm(2.2) - outerFrameT / 2, zMid);
  const ofBot = ofTop.clone();
  ofBot.position.y = sillY + cm(2.6) + outerFrameT / 2;
  const ofN = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), innerClearH, outerFrameT), mats.whiteTrim);
  ofN.position.set(sashX, winMidY + cm(0.2), zStart + cm(2.2) + outerFrameT / 2);
  const ofS = ofN.clone();
  ofS.position.z = zEnd - cm(2.2) - outerFrameT / 2;
  const centerMullion = new THREE.Mesh(new THREE.BoxGeometry(cm(4.8), innerClearH - outerFrameT * 2, cm(3.2)), mats.whiteTrim);
  centerMullion.position.set(sashX - cm(0.4), winMidY + cm(0.2), zMid);
  winGroup.add(ofTop, ofBot, ofN, ofS, centerMullion);

  const sashW = (innerClearLen - outerFrameT * 2 - cm(3.2)) / 2;
  const sashH = innerClearH - outerFrameT * 2;
  const sashStile = cm(4.4);
  const gasketMat = mats.rubberGasket;

  for (const side of [-1, 1]) {
    const sz = zMid + side * (cm(1.6) + sashW / 2);
    const sy = winMidY + cm(0.2);

    const stTop = new THREE.Mesh(new THREE.BoxGeometry(cm(3.6), sashStile, sashW - cm(0.4)), mats.whiteTrim);
    stTop.position.set(sashX - cm(0.8), sy + sashH / 2 - sashStile / 2, sz);
    const stBot = stTop.clone();
    stBot.position.y = sy - sashH / 2 + sashStile / 2;
    const stL = new THREE.Mesh(new THREE.BoxGeometry(cm(3.6), sashH - sashStile * 2, sashStile), mats.whiteTrim);
    stL.position.set(sashX - cm(0.8), sy, sz - sashW / 2 + sashStile / 2);
    const stR = stL.clone();
    stR.position.z = sz + sashW / 2 - sashStile / 2;

    const outerHingeZ = sz + side * (sashW / 2 - cm(0.2));
    for (const hyOff of [-sashH * 0.34, sashH * 0.34]) {
      const hBarrel = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.55), cm(0.55), cm(7.5), 10), mats.whiteTrim);
      hBarrel.position.set(sashX - cm(2.7), sy + hyOff, outerHingeZ);
      winGroup.add(hBarrel);
    }

    const glassW = sashW - sashStile * 2;
    const glassH = sashH - sashStile * 2;
    const gTop = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), cm(0.45), glassW), gasketMat);
    gTop.position.set(sashX - cm(1.2), sy + glassH / 2 - cm(0.2), sz);
    const gBot = gTop.clone();
    gBot.position.y = sy - glassH / 2 + cm(0.2);
    const gL = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), glassH, cm(0.45)), gasketMat);
    gL.position.set(sashX - cm(1.2), sy, sz - glassW / 2 + cm(0.2));
    const gR = gL.clone();
    gR.position.z = sz + glassW / 2 - cm(0.2);

    const spacerBot = new THREE.Mesh(new THREE.BoxGeometry(cm(0.9), cm(0.35), glassW - cm(0.8)), mats.stainlessSteel);
    spacerBot.position.set(sashX - cm(0.8), sy - glassH / 2 + cm(0.55), sz);
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), glassH, glassW), mats.clearGlass);
    glassPane.position.set(sashX - cm(0.8), sy, sz);

    const hZ = zMid + side * cm(3.6), hY = cm(148);
    const rosette = createRoundedSlab(cm(0.8), cm(2.6), cm(6.4), cm(0.8), mats.whiteTrim, cm(0.15));
    rosette.position.set(sashX - cm(3.0), hY - cm(3.2), hZ);
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sashX - cm(3.0), hY + cm(0.8), hZ),
      new THREE.Vector3(sashX - cm(6.2), hY + cm(0.6), hZ),
      new THREE.Vector3(sashX - cm(6.8), hY - cm(2.5), hZ + side * cm(0.3)),
      new THREE.Vector3(sashX - cm(6.4), hY - cm(10.5), hZ + side * cm(0.5)),
    ]);
    const handleGrip = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 16, cm(0.62), 10, false), mats.whiteTrim);

    winGroup.add(stTop, stBot, stL, stR, gTop, gBot, gL, gR, spacerBot, glassPane, rosette, handleGrip);
  }
  tagItem(winGroup, '東南次臥深窗龕雙層中空氣密窗', '寬 157 × 高 144 cm｜17 cm 純白深窗龕＋EPDM 膠條與雙層玻璃隔條＋純白弧形把手與活頁');
  eastWallAttachments.add(winGroup);

  // 3. Tailored Full-Drop S-Wave Linen Curtain
  const curtainLenZ = cm(64), curtainTopY = cm(254.5), curtainBotY = cm(77.8);
  const curtainH = curtainTopY - curtainBotY;
  const pleats = 9.5, amp = cm(3.4);
  const cShape = new THREE.Shape();
  const steps = 112;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lz = t * curtainLenZ;
    const lx = Math.sin(t * Math.PI * 2 * pleats) * amp;
    if (i === 0) cShape.moveTo(lx, lz);
    else cShape.lineTo(lx, lz);
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const lz = t * curtainLenZ;
    const lx = Math.sin(t * Math.PI * 2 * pleats) * amp + cm(0.58);
    cShape.lineTo(lx, lz);
  }
  cShape.closePath();

  const cGeo = new THREE.ExtrudeGeometry(cShape, { depth: curtainH, bevelEnabled: false, steps: 8 });
  const cPos = cGeo.attributes.position;
  const cUv = cGeo.attributes.uv;
  for (let i = 0; i < cPos.count; i++) {
    const sx = cPos.getX(i), sz = cPos.getY(i), depthY = cPos.getZ(i);
    const dropRatio = depthY / curtainH;
    cPos.setXYZ(i, cm(829.5) + sx * (0.9 + 0.14 * dropRatio), curtainTopY - depthY, cm(592) + sz);
    cUv.setXY(i, (sz / curtainLenZ) * 3, dropRatio * 4);
  }
  cGeo.computeVertexNormals();
  const tailoredCurtainMat = mats.warmCreamFabric.clone();
  tailoredCurtainMat.color.setHex(0xedeae3);
  tailoredCurtainMat.side = THREE.DoubleSide;
  const tailoredCurtain = new THREE.Mesh(cGeo, tailoredCurtainMat);
  tagItem(tailoredCurtain, '高精細訂製亞麻白蛇形落地窗簾', '寬 64 × 高 177 cm｜自隱藏軌道垂墜至書桌上方 2.8 cm，具自然重力波浪垂墜感');
  eastWallAttachments.add(tailoredCurtain);

  // 4. Custom Seamless Concave-Curved White L-Desk + Finger-Pull Reveal + Notebook/Pen/Keyboard/Mouse
  const deskGroup = new THREE.Group();
  const deskTopY = cm(75.0), topThick = cm(2.8), fasciaH = cm(11.2);

  function extrudeHorizontalXZ(shapeFn, yBottom, height, mat) {
    const shape = new THREE.Shape();
    shapeFn(shape);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: cm(0.18),
      bevelSize: cm(0.18),
      bevelSegments: 2,
      curveSegments: 36,
    });
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(i, pos.getX(i), yBottom + pos.getZ(i), pos.getY(i));
    }
    const idx = geo.index;
    if (idx) {
      for (let i = 0; i < idx.count; i += 3) {
        const tmp = idx.getX(i + 1);
        idx.setX(i + 1, idx.getX(i + 2));
        idx.setX(i + 2, tmp);
      }
    } else {
      for (let i = 0; i < pos.count; i += 3) {
        const tx = pos.getX(i + 1), ty = pos.getY(i + 1), tz = pos.getZ(i + 1);
        pos.setXYZ(i + 1, pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));
        pos.setXYZ(i + 2, tx, ty, tz);
      }
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, mat);
  }

  const arcCx = cm(756), arcCz = cm(715), arcR = cm(30);
  const deskTopMesh = extrudeHorizontalXZ(
    (s) => {
      s.moveTo(cm(786), cm(636));
      s.lineTo(cm(838), cm(636));
      s.lineTo(cm(838), cm(803));
      s.lineTo(cm(738), cm(803));
      s.lineTo(cm(738), cm(745));
      s.lineTo(arcCx, cm(745));
      s.absarc(arcCx, arcCz, arcR, Math.PI / 2, 0, true);
      s.lineTo(cm(786), cm(636));
    },
    deskTopY - topThick,
    topThick,
    whiteLacquer
  );
  deskGroup.add(deskTopMesh);

  const fRecess = cm(0.7), drwH = fasciaH - cm(0.65), drwY = deskTopY - topThick - fasciaH;
  const drwLeft = extrudeHorizontalXZ(
    (s) => {
      s.moveTo(cm(786) + fRecess, cm(639.6));
      s.lineTo(cm(836), cm(639.6));
      s.lineTo(cm(836), cm(714.6));
      s.lineTo(cm(786) + fRecess, cm(714.6));
      s.closePath();
    },
    drwY,
    drwH,
    whiteLacquer
  );
  const drwCurve = extrudeHorizontalXZ(
    (s) => {
      const rIn = arcR + fRecess;
      s.moveTo(arcCx + rIn, arcCz + cm(0.2));
      s.lineTo(cm(836), arcCz + cm(0.2));
      s.lineTo(cm(836), cm(801));
      s.lineTo(arcCx - cm(0.2), cm(801));
      s.lineTo(arcCx - cm(0.2), arcCz + rIn);
      s.absarc(arcCx, arcCz, rIn, Math.PI / 2, 0, true);
    },
    drwY,
    drwH,
    whiteLacquer
  );
  const drwRight = extrudeHorizontalXZ(
    (s) => {
      s.moveTo(cm(741.6), cm(745) + fRecess);
      s.lineTo(arcCx - cm(0.6), cm(745) + fRecess);
      s.lineTo(arcCx - cm(0.6), cm(801));
      s.lineTo(cm(741.6), cm(801));
      s.closePath();
    },
    drwY,
    drwH,
    whiteLacquer
  );
  const seamBacking = extrudeHorizontalXZ(
    (s) => {
      const rBack = arcR + cm(1.35);
      s.moveTo(cm(787.4), cm(639.4));
      s.lineTo(cm(835), cm(639.4));
      s.lineTo(cm(835), cm(800));
      s.lineTo(cm(741.4), cm(800));
      s.lineTo(cm(741.4), cm(746.4));
      s.lineTo(arcCx, cm(746.4));
      s.absarc(arcCx, arcCz, rBack, Math.PI / 2, 0, true);
      s.lineTo(cm(787.4), cm(639.4));
    },
    drwY + cm(0.3),
    fasciaH - cm(0.3),
    new THREE.MeshStandardMaterial({ color: 0xc5c1b9, roughness: 0.9 })
  );
  const legLeft = new THREE.Mesh(new THREE.BoxGeometry(cm(52), deskTopY - topThick, cm(3.4)), whiteLacquer);
  legLeft.position.set(cm(812), (deskTopY - topThick) / 2, cm(637.7));
  const legRight = new THREE.Mesh(new THREE.BoxGeometry(cm(3.4), deskTopY - topThick, cm(58)), whiteLacquer);
  legRight.position.set(cm(739.7), (deskTopY - topThick) / 2, cm(774));
  deskGroup.add(drwLeft, drwCurve, drwRight, seamBacking, legLeft, legRight);

  const nbGroup = new THREE.Group();
  nbGroup.position.set(cm(801), deskTopY, cm(679));
  nbGroup.rotation.y = -0.18;
  const nbBotCover = createRoundedSlab(cm(16.5), cm(22.5), cm(0.35), cm(0.8), whiteLacquer, cm(0.08));
  const nbPages = createRoundedSlab(cm(15.8), cm(21.8), cm(1.3), cm(0.4), mats.warmCreamFabric, cm(0.05));
  nbPages.position.set(-cm(0.2), cm(0.35), 0);
  const nbTopCover = createRoundedSlab(cm(16.5), cm(22.5), cm(0.35), cm(0.8), whiteLacquer, cm(0.08));
  nbTopCover.position.y = cm(1.65);
  const nbSpine = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.98), cm(0.98), cm(22.5), 12), whiteLacquer);
  nbSpine.rotation.x = Math.PI / 2;
  nbSpine.position.set(cm(8.0), cm(1.0), 0);
  const ribbon = new THREE.Mesh(
    new THREE.BoxGeometry(cm(0.9), cm(0.15), cm(4.2)),
    new THREE.MeshStandardMaterial({ color: 0xb7b1a6, roughness: 0.8 })
  );
  ribbon.position.set(-cm(2.5), cm(0.25), -cm(12.2));
  ribbon.rotation.y = 0.25;
  const penBody = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.48), cm(0.42), cm(13.8), 12), whiteLacquer);
  penBody.rotation.x = Math.PI / 2;
  penBody.position.set(-cm(10.8), cm(0.48), cm(1.0));
  const penClip = new THREE.Mesh(new THREE.BoxGeometry(cm(0.22), cm(0.28), cm(3.8)), mats.brushedNickel);
  penClip.position.set(-cm(10.8), cm(1.02), -cm(3.2));
  nbGroup.add(nbBotCover, nbPages, nbTopCover, nbSpine, ribbon, penBody, penClip);
  deskGroup.add(nbGroup);

  const kbGroup = new THREE.Group();
  kbGroup.position.set(cm(799), deskTopY, cm(707));
  kbGroup.rotation.y = -0.32;
  const kbChassis = createRoundedSlab(cm(11.6), cm(28.4), cm(0.75), cm(0.9), mats.brushedNickel, cm(0.12));
  kbChassis.rotation.z = -0.05;
  kbGroup.add(kbChassis);
  const sharedKeyGeo = new THREE.BoxGeometry(cm(1.42), cm(0.34), cm(1.62));
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 13; c++) {
      if (r === 0 && c >= 4 && c <= 8) {
        if (c === 6) {
          const spKey = new THREE.Mesh(new THREE.BoxGeometry(cm(1.42), cm(0.34), cm(9.2)), whiteLacquer);
          spKey.position.set(-cm(4.0) + r * cm(1.95), cm(0.72) + r * cm(0.08), 0);
          kbGroup.add(spKey);
        }
        continue;
      }
      const key = new THREE.Mesh(sharedKeyGeo, whiteLacquer);
      key.position.set(-cm(4.0) + r * cm(1.95), cm(0.72) + r * cm(0.08), -cm(12.2) + c * cm(2.03));
      kbGroup.add(key);
    }
  }
  deskGroup.add(kbGroup);

  const mouseGrp = new THREE.Group();
  mouseGrp.position.set(cm(804), deskTopY, cm(730));
  mouseGrp.rotation.y = -0.45;
  const mouse = createRoundedSlab(cm(5.9), cm(10.6), cm(2.15), cm(2.9), whiteLacquer, cm(0.8));
  const scrollWheel = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.75), cm(0.35), 14), mats.brushedNickel);
  scrollWheel.rotation.z = Math.PI / 2;
  scrollWheel.position.set(0, cm(1.85), -cm(2.8));
  mouseGrp.add(mouse, scrollWheel);
  deskGroup.add(mouseGrp);

  tagItem(deskGroup, '一體成型內圓弧純白轉角書桌', '167 × 100 × 75 cm｜C1 流線內圓弧桌面＋斜切指槽無把手抽屜＋精裝筆記本鋼筆與無線鍵鼠');
  roomGroup.add(deskGroup);

  // 5. Three Matte-White Floating Wall Shelves + Concealed LED + Hardcover Books & Sculptural U-Vase
  const shelfW = cm(118), shelfD = cm(24), shelfT = cm(3.4);
  const shelfCenterX = cm(779);
  const shelfCenterZ = cm(803) - shelfD / 2;

  const shelfHeights = [cm(132), cm(166), cm(200)];
  shelfHeights.forEach((sy, idx) => {
    const sh = createRoundedSlab(shelfW, shelfD, shelfT, cm(0.6), whiteLacquer, cm(0.18));
    sh.position.set(shelfCenterX, sy - shelfT / 2, shelfCenterZ);
    southWallAttachments.add(sh);

    if (idx === 0) {
      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW - cm(6), cm(0.6), cm(1.6)),
        mats.warmBulbEmissive
      );
      ledStrip.position.set(shelfCenterX, sy - shelfT / 2 - cm(0.2), cm(794));
      southWallAttachments.add(ledStrip);

      const washPt = new THREE.PointLight(0xffdca0, 0.72, 2.2, 1.7);
      washPt.position.set(shelfCenterX, sy - cm(5), cm(792));
      washPt.castShadow = false;
      southWallAttachments.add(washPt);
      if (lightsRegistry) {
        lightsRegistry.push({ light: washPt, mat: mats.warmBulbEmissive, baseIntensity: 0.95 });
      }
    }
  });

  const bookMats = [
    new THREE.MeshStandardMaterial({ color: 0xd6cfc2, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xe6e1d7, roughness: 0.82 }),
    new THREE.MeshStandardMaterial({ color: 0xc9c0b1, roughness: 0.86 }),
    new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.84 }),
    new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.8 }),
  ];

  // Bottom Shelf Props: 6 Upright Hardcover Books + 7th Leaning Hardcover Book + Stacked Books & Lidded Candle Jar
  const s1Top = shelfHeights[0] + shelfT / 2;
  let curBookX = cm(835.5);
  const s1Books = [
    [2.6, 22.0, 17.5],
    [3.1, 21.2, 17.0],
    [2.2, 22.4, 17.8],
    [3.4, 20.5, 16.8],
    [2.8, 22.8, 17.6],
    [3.0, 21.6, 17.2],
  ];
  s1Books.forEach(([bw, bh, bd], i) => {
    const bMesh = createHardcoverBook(cm(bw), cm(bd), cm(bh), bookMats[i % bookMats.length], mats.crispWhiteLinen);
    bMesh.rotation.y = Math.PI;
    bMesh.position.set(curBookX - cm(bw / 2), s1Top, cm(792));
    southWallAttachments.add(bMesh);
    curBookX -= cm(bw + 0.15);
  });
  const leanBook = createHardcoverBook(cm(3.2), cm(17.2), cm(21.0), bookMats[2], mats.crispWhiteLinen);
  leanBook.rotation.y = Math.PI;
  leanBook.rotation.z = 0.29;
  leanBook.position.set(curBookX - cm(4.8), s1Top - cm(0.1), cm(792));
  southWallAttachments.add(leanBook);

  const hBook1 = createHardcoverBook(cm(2.6), cm(16), cm(22), bookMats[0], mats.crispWhiteLinen);
  hBook1.rotation.z = Math.PI / 2;
  hBook1.position.set(cm(746), s1Top + cm(1.3), cm(792));
  const hBook2 = createHardcoverBook(cm(2.2), cm(14.5), cm(19.5), bookMats[4], mats.crispWhiteLinen);
  hBook2.rotation.z = Math.PI / 2;
  hBook2.position.set(cm(746), s1Top + cm(3.7), cm(792));
  const candleJar = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.8), cm(3.8), cm(4.8), 22), bookMats[1]);
  candleJar.position.set(cm(746), s1Top + cm(7.2), cm(792));
  const candleLid = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.95), cm(3.95), cm(0.55), 22), bookMats[2]);
  candleLid.position.set(cm(746), s1Top + cm(9.7), cm(792));
  const candleKnob = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.65), cm(1.1), 14), bookMats[2]);
  candleKnob.position.set(cm(746), s1Top + cm(10.3), cm(792));
  southWallAttachments.add(hBook1, hBook2, candleJar, candleLid, candleKnob);

  // Middle Shelf Props: 3 Tall Hardcover Books + 2 Horizontal Hardcover Books + Sculptural U-Shaped Arch Vase
  const s2Top = shelfHeights[1] + shelfT / 2;
  let s2X = cm(799);
  for (const [bw, bh, bd, mIdx] of [
    [2.5, 24.5, 18.0, 2],
    [3.4, 22.0, 17.2, 4],
    [2.8, 21.0, 17.0, 0],
  ]) {
    const bm = createHardcoverBook(cm(bw), cm(bd), cm(bh), bookMats[mIdx], mats.crispWhiteLinen);
    bm.rotation.y = Math.PI;
    bm.position.set(s2X - cm(bw / 2), s2Top, cm(792));
    southWallAttachments.add(bm);
    s2X -= cm(bw + 0.15);
  }
  const s2H1 = createHardcoverBook(cm(2.1), cm(15.5), cm(19.5), bookMats[1], mats.crispWhiteLinen);
  s2H1.rotation.z = Math.PI / 2;
  s2H1.position.set(s2X - cm(10.2), s2Top + cm(1.05), cm(792));
  const s2H2 = createHardcoverBook(cm(1.9), cm(14.5), cm(18.0), bookMats[3], mats.crispWhiteLinen);
  s2H2.rotation.z = Math.PI / 2;
  s2H2.position.set(s2X - cm(10.2), s2Top + cm(3.05), cm(792));
  southWallAttachments.add(s2H1, s2H2);

  const uVase = new THREE.Group();
  uVase.position.set(cm(742), s2Top + cm(8.2), cm(792));
  const uMat = new THREE.MeshStandardMaterial({ color: 0xe5dfd4, roughness: 0.72 });
  const uArch = new THREE.Mesh(new THREE.TorusGeometry(cm(5.6), cm(2.4), 22, 36, Math.PI), uMat);
  uArch.rotation.z = Math.PI;
  const uNeckL = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.4), cm(2.4), cm(5.5), 22), uMat);
  uNeckL.position.set(-cm(5.6), cm(2.75), 0);
  const uNeckR = uNeckL.clone();
  uNeckR.position.x = cm(5.6);
  const rimL = new THREE.Mesh(new THREE.TorusGeometry(cm(2.08), cm(0.32), 10, 22), uMat);
  rimL.rotation.x = Math.PI / 2;
  rimL.position.set(-cm(5.6), cm(5.5), 0);
  const rimR = rimL.clone();
  rimR.position.x = cm(5.6);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x4f4942, roughness: 0.95 });
  const holeL = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.8), cm(1.8), cm(0.5), 18), holeMat);
  holeL.position.set(-cm(5.6), cm(5.35), 0);
  const holeR = holeL.clone();
  holeR.position.x = cm(5.6);
  uVase.add(uArch, uNeckL, uNeckR, rimL, rimR, holeL, holeR);
  southWallAttachments.add(uVase);

  tagItem(southWallAttachments, '三層純白懸浮書架＆精裝書殼雕塑花器組', '寬 118 × 深 24 cm｜隱藏暖光燈帶＋雙層書殼精裝書列＋香氛蓋罐與 U 型雙口陶瓷花器');

  // 6. Modern White 5-Star Swivel Ergonomic Study Chair (with Tilt Tension Cylinder & Height Paddle Lever!)
  const chair = new THREE.Group();
  chair.position.set(cm(752), 0, cm(706));
  chair.rotation.y = 0.64;

  const wheelDark = new THREE.MeshStandardMaterial({ color: 0x76787a, roughness: 0.55 });
  const stemMetal = mats.brushedNickel;

  const gasOuter = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.3), cm(2.5), cm(19), 20), whiteLacquer);
  gasOuter.position.y = cm(20.5);
  const gasInner = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.5), cm(1.5), cm(14), 18), stemMetal);
  gasInner.position.y = cm(35);
  const tiltBox = createRoundedSlab(cm(16), cm(18), cm(4.2), cm(2), whiteLacquer, cm(0.4));
  tiltBox.position.set(0, cm(40.5), cm(1));
  // Pneumatic height-adjustment paddle lever & tilt tension knob under seat!
  const leverRod = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.32), cm(0.32), cm(15), 8), stemMetal);
  leverRod.rotation.z = Math.PI / 2;
  leverRod.position.set(cm(11), cm(42.2), cm(2));
  const leverPaddle = createRoundedSlab(cm(4.5), cm(2.8), cm(0.8), cm(0.8), whiteLacquer, cm(0.2));
  leverPaddle.position.set(cm(18.5), cm(41.8), cm(2));
  const tensionKnob = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.1), cm(2.4), cm(5.5), 14), whiteLacquer);
  tensionKnob.position.set(0, cm(39.0), cm(7.5));
  tensionKnob.rotation.x = 0.5;
  chair.add(gasOuter, gasInner, tiltBox, leverRod, leverPaddle, tensionKnob);

  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 + 0.28;
    const endX = Math.sin(ang) * cm(30.5);
    const endZ = Math.cos(ang) * cm(30.5);
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.sin(ang) * cm(2.0), cm(12.5), Math.cos(ang) * cm(2.0)),
      new THREE.Vector3(Math.sin(ang) * cm(17.0), cm(9.8), Math.cos(ang) * cm(17.0)),
      new THREE.Vector3(endX, cm(6.2), endZ),
    ]);
    const spoke = new THREE.Mesh(new THREE.TubeGeometry(legCurve, 14, cm(1.45), 10, false), whiteLacquer);
    chair.add(spoke);

    const caster = new THREE.Group();
    caster.position.set(endX, 0, endZ);
    caster.rotation.y = ang + 0.4;
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.6), cm(0.6), cm(2.4), 10), stemMetal);
    pin.position.y = cm(5.2);
    const hood = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(2.6), cm(2.6), cm(2.9), 16, 1, false, 0, Math.PI),
      whiteLacquer
    );
    hood.rotation.z = Math.PI / 2;
    hood.position.set(0, cm(2.8), -cm(0.6));
    for (const wx of [-cm(1.15), cm(1.15)]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.65), cm(2.65), cm(0.75), 20), wheelDark);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, cm(2.65), -cm(0.6));
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.7), cm(1.7), cm(0.82), 16), whiteLacquer);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(wx, cm(2.65), -cm(0.6));
      caster.add(wheel, hub);
    }
    caster.add(pin, hood);
    chair.add(caster);
  }

  const seatY = cm(44.5);
  const seatPan = createRoundedSlab(cm(46), cm(44), cm(5.4), cm(8.5), mats.chairWeaveWhite, cm(1.9));
  seatPan.position.set(0, seatY, cm(2));
  chair.add(seatPan);

  const backW = cm(43), backH = cm(45);
  const backShape = new THREE.Shape();
  const hwBot = backW / 2, hwTop = cm(19.5), rTop = cm(8.5);
  backShape.moveTo(-hwBot + cm(5), 0);
  backShape.lineTo(hwBot - cm(5), 0);
  backShape.quadraticCurveTo(hwBot, 0, hwBot - cm(0.5), cm(8));
  backShape.lineTo(hwTop, backH - rTop);
  backShape.quadraticCurveTo(hwTop, backH, hwTop - rTop, backH);
  backShape.lineTo(-hwTop + rTop, backH);
  backShape.quadraticCurveTo(-hwTop, backH, -hwTop, backH - rTop);
  backShape.lineTo(-hwBot + cm(0.5), cm(8));
  backShape.quadraticCurveTo(-hwBot, 0, -hwBot + cm(5), 0);

  const backGeo = new THREE.ExtrudeGeometry(backShape, {
    depth: cm(3.8),
    bevelEnabled: true,
    bevelThickness: cm(1.15),
    bevelSize: cm(1.15),
    bevelSegments: 4,
    curveSegments: 22,
  });
  const bPos = backGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const bx = bPos.getX(i), by = bPos.getY(i), bz = bPos.getZ(i);
    const wrapZ = (bx * bx) / cm(165);
    const reclineZ = -by * 0.11;
    bPos.setXYZ(i, bx, seatY + cm(2.5) + by, -cm(19.5) + bz + wrapZ + reclineZ);
  }
  backGeo.computeVertexNormals();
  chair.add(new THREE.Mesh(backGeo, mats.chairWeaveWhite));

  const spine = createRoundedSlab(cm(34), cm(12), cm(4.2), cm(4), mats.chairWeaveWhite, cm(1.0));
  spine.position.set(0, seatY + cm(0.8), -cm(16.5));
  spine.rotation.x = 0.35;
  chair.add(spine);

  for (const side of [-1, 1]) {
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * cm(19.8), seatY + cm(14.5), -cm(19.5)),
      new THREE.Vector3(side * cm(23.5), seatY + cm(15.2), -cm(18.0)),
      new THREE.Vector3(side * cm(24.0), seatY + cm(17.8), -cm(6.0)),
      new THREE.Vector3(side * cm(23.4), seatY + cm(17.6), cm(11.5)),
      new THREE.Vector3(side * cm(22.4), seatY + cm(13.0), cm(14.5)),
      new THREE.Vector3(side * cm(20.2), seatY + cm(2.2), cm(12.0)),
      new THREE.Vector3(side * cm(15.5), seatY + cm(0.5), cm(10.0)),
    ]);
    const armMesh = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 34, cm(1.05), 12, false), whiteLacquer);
    chair.add(armMesh);
  }

  tagItem(chair, '極簡純白織布五爪輪流線書桌椅', '高 92 × 寬 50 cm｜微包覆人體工學椅背＋純白環形扶手＋氣壓升降撥桿與雙輪靜音滾輪');
  roomGroup.add(chair);

  // 7. Rest of SE Bedroom: Built-In Wardrobe (145cm) + Glass Display Bookcase (45cm with Interior Books!) + Single Bed
  function makeSEBuiltIn(cx, cz, w, d, doorsCount, isGlass) {
    const h = cm(246);
    const g = new THREE.Group();
    g.position.set(cx, 0, cz);
    const bodyD = isGlass ? d - cm(12) : d - cm(2);
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - cm(6), bodyD), whiteLacquer);
    body.position.set(0, (h - cm(6)) / 2 + cm(6), isGlass ? -cm(6) : -cm(1));
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w - cm(1), cm(6), d - cm(4)), mats.whiteTrim);
    plinth.position.set(0, cm(3), -cm(2));
    const soffit = new THREE.Mesh(new THREE.BoxGeometry(w, cm(39), d), whiteLacquer);
    soffit.position.set(0, cm(265.5), 0);
    g.add(body, plinth, soffit);

    if (isGlass) {
      for (const sx of [-w / 2 + cm(1.2), w / 2 - cm(1.2)]) {
        const sw = new THREE.Mesh(new THREE.BoxGeometry(cm(2.4), h - cm(6), d - cm(2)), whiteLacquer);
        sw.position.set(sx, (h - cm(6)) / 2 + cm(6), -cm(1));
        g.add(sw);
      }
      for (let s = 0; s < 4; s++) {
        const sy = cm(56 + s * 46);
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - cm(4), cm(2.0), d - cm(5)), mats.naturalOak);
        shelf.position.set(0, sy, cm(1));
        g.add(shelf);
        if (s % 2 === 0) {
          for (let b = 0; b < 5; b++) {
            const bk = createHardcoverBook(cm(3.0), cm(17), cm(22), bookMats[(b + s) % bookMats.length], mats.crispWhiteLinen);
            bk.position.set(-cm(9) + b * cm(3.4), sy + cm(1.0), cm(16));
            g.add(bk);
          }
        } else {
          const vessel = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.5), cm(5.5), cm(16), 18), mats.porcelainGloss);
          vessel.position.set(0, sy + cm(9.0), cm(15));
          g.add(vessel);
        }
      }
    }

    const dw = (w - cm(2)) / doorsCount;
    for (let i = 0; i < doorsCount; i++) {
      const dx = -w / 2 + cm(1) + dw * (i + 0.5);
      const face = createShakerDoorFace(dw - cm(0.5), h - cm(12), mats, {
        glass: isGlass,
        knobSide: i % 2 === 0 ? 'right' : 'left',
        knobYRatio: 0.46,
      });
      face.position.set(dx, h / 2 + cm(3), d / 2 - cm(1));
      g.add(face);
    }
    return g;
  }

  const ward145 = makeSEBuiltIn(cm(628.5), cm(597), cm(145), cm(60), 3, false);
  tagItem(ward145, '東南次臥三門純白頂天大衣櫃 (145×60)', '145 × 60 × 285 cm｜頂天無縫收樑純白鄉村線板衣櫃');
  const cab45 = makeSEBuiltIn(cm(723.5), cm(597), cm(45), cm(60), 1, true);
  tagItem(cab45, '東南次臥格柵玻璃展示書櫃 (45×60)', '45 × 60 × 285 cm｜內建實木層板與精裝藏書展示櫃');
  roomGroup.add(ward145, cab45);

  // Tailored Crisp White Single Bed (180 x 108 cm) with Framed Headboard, Piped Mattress & Layered Bedding
  const seBed = new THREE.Group();
  seBed.position.set(cm(646), 0, cm(749));
  const bW = cm(180), bD = cm(108);
  const hb = new THREE.Mesh(new THREE.BoxGeometry(cm(4.8), cm(96), bD), whiteLacquer);
  hb.position.set(-bW / 2 + cm(2.4), cm(48), 0);
  const hbPanel = createRaisedPanel(bD - cm(14), cm(76), cm(5.8), mats.creamShaker, cm(2.5));
  hbPanel.rotation.y = Math.PI / 2;
  hbPanel.position.set(-bW / 2 + cm(2.6), cm(52), 0);
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(2), cm(26), bD - cm(2)), whiteLacquer);
  base.position.set(0, cm(14), 0);
  for (const dx of [-cm(42), cm(42)]) {
    const drw = createDrawerFront(cm(82), cm(19), mats, false);
    drw.rotation.y = Math.PI;
    drw.position.set(dx, cm(14), -bD / 2 + cm(1.5));
    seBed.add(drw);
  }
  const mat = createRoundedSlab(bW - cm(8), bD - cm(6), cm(20), cm(6), mats.warmCreamFabric, cm(1.6));
  mat.position.set(cm(1), cm(27), 0);
  const duv = createRoundedSlab(cm(134), bD - cm(4), cm(8.0), cm(8), mats.crispWhiteLinen, cm(2.2));
  duv.position.set(cm(18), cm(42), 0);
  const cuff = createRoundedSlab(cm(22), bD - cm(3.5), cm(2.2), cm(4), mats.crispWhiteLinen, cm(0.8));
  cuff.position.set(-cm(36), cm(49.2), 0);
  const throwBlanket = createRoundedSlab(cm(40), bD - cm(3), cm(2.4), cm(5), mats.cableKnitOatmeal || mats.oatmealLinen, cm(0.85));
  throwBlanket.position.set(cm(58), cm(49.8), 0);
  const pillow = createCountryPillow(cm(42), cm(62), cm(14.5), mats.crispWhiteLinen, { flanged: true });
  pillow.position.set(-cm(60), cm(53.5), 0);
  pillow.rotation.z = -0.22;
  const accentPillow = createCountryPillow(cm(26), cm(38), cm(12), mats.oatmealLinen, { buttoned: true });
  accentPillow.position.set(-cm(42), cm(52.5), cm(14));
  seBed.add(hb, hbPanel, base, mat, duv, cuff, throwBlanket, pillow, accentPillow);
  tagItem(seBed, '東南次臥純白極簡鄉村線板單人床', '180 × 108 cm｜立體框線床頭板＋滾邊床墊＋反摺羽絨被與麻花針織蓋毯');
  roomGroup.add(seBed);

  enableShadows(roomGroup, true, true);
  enableShadows(eastWallAttachments, true, true);
  enableShadows(southWallAttachments, true, true);

  return {
    roomGroup,
    eastWallAttachments,
    southWallAttachments,
  };
}
