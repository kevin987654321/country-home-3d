import * as THREE from 'three';
import {
  cm,
  tagItem,
  enableShadows,
  createRoundedSlab,
  createCountryPillow,
  createShakerDoorFace,
  createDrawerFront,
} from './primitives.js';

/**
 * Ultra-Detailed South-East Bedroom (右下角房間 / 東南次臥)
 * Modeled 1:1 from both the floor plan (q4_bot_right) and the interior design render (image_2.jpeg):
 * - Room bounds: X = 556..838 cm, Z = 567..803 cm, Ceiling Y = 285 cm
 * - Returns { roomGroup, eastWallAttachments, southWallAttachments } so unified wall-hiding
 *   fades wall-mounted elements seamlessly with their host wall!
 */
export function createSEBedroomUltraDetail(mats, lightsRegistry) {
  const roomGroup = new THREE.Group();
  const eastWallAttachments = new THREE.Group(); // Pelmet beam + Recessed Double Window + Tailored Curtain
  const southWallAttachments = new THREE.Group(); // 3 Illuminated Floating Shelves + Books + U-Vase + Candle

  const whiteLacquer = mats.pureMatteWhite;

  // ===========================================================================
  // 1. East Wall Boxed Structural Beam & Recessed Curtain Pelmet (上方包樑與內藏窗簾盒)
  //    Spans Z = 567..803 cm, Y = 246..285 cm, projecting from X = 838 inward to X = 814 cm
  // ===========================================================================
  const pelmetGroup = new THREE.Group();
  // Front drop fascia & soffit (X = 814..825, Y = 246..285)
  const beamFront = new THREE.Mesh(
    new THREE.BoxGeometry(cm(11), cm(39), cm(236)),
    whiteLacquer
  );
  beamFront.position.set(cm(819.5), cm(265.5), cm(685));
  // Top inner ceiling filler above curtain track (X = 825..838, Y = 256..285)
  const beamTrackTop = new THREE.Mesh(
    new THREE.BoxGeometry(cm(13), cm(29), cm(236)),
    whiteLacquer
  );
  beamTrackTop.position.set(cm(831.5), cm(270.5), cm(685));
  pelmetGroup.add(beamFront, beamTrackTop);
  tagItem(pelmetGroup, '東南次臥包樑與隱藏式窗簾盒', '深 24 × 高 39 cm｜無縫純白木作包樑結合內嵌蛇形簾軌道');
  eastWallAttachments.add(pelmetGroup);

  // ===========================================================================
  // 2. East Wall Deep-Reveal Symmetric Double-Casement White Window (深窗龕雙扇純白氣密窗)
  //    Opening: X = 838..853 cm, Z = 601..758 cm (len 157 cm), Sill Y = 88 cm, Head Y = 232 cm
  // ===========================================================================
  const winGroup = new THREE.Group();
  const zStart = cm(601);
  const zEnd = cm(758);
  const zMid = (zStart + zEnd) / 2; // cm(679.5)
  const winLen = zEnd - zStart; // cm(157)
  const sillY = cm(88);
  const headY = cm(232);
  const winH = headY - sillY; // cm(144)
  const winMidY = (sillY + headY) / 2;

  // Deep matte-white reveal liner (窗龕四週純白內襯深框: X = 836.5..853.5)
  const revealDepth = cm(17);
  const revX = cm(845);
  const revTop = new THREE.Mesh(new THREE.BoxGeometry(revealDepth, cm(2.2), winLen + cm(2)), whiteLacquer);
  revTop.position.set(revX, headY - cm(1.1), zMid);
  const revSill = new THREE.Mesh(new THREE.BoxGeometry(revealDepth + cm(3.5), cm(2.6), winLen + cm(10)), whiteLacquer);
  revSill.position.set(revX - cm(1.5), sillY + cm(1.3), zMid);
  const revNorth = new THREE.Mesh(new THREE.BoxGeometry(revealDepth, winH, cm(2.2)), whiteLacquer);
  revNorth.position.set(revX, winMidY, zStart + cm(1.1));
  const revSouth = revNorth.clone();
  revSouth.position.z = zEnd - cm(1.1);
  winGroup.add(revTop, revSill, revNorth, revSouth);

  // Flat Minimalist Interior Architrave Casing on X = 837.2 cm (5.5 cm flat white trim matching image_2.jpeg!)
  const trimW = cm(5.5);
  const trimT = cm(1.4);
  const trimX = cm(837.3);
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(trimT, trimW, winLen + trimW * 2), whiteLacquer);
  tTop.position.set(trimX, headY + trimW * 0.42, zMid);
  const tBot = new THREE.Mesh(new THREE.BoxGeometry(trimT, cm(4.2), winLen + trimW * 2), whiteLacquer);
  tBot.position.set(trimX, sillY - cm(1.4), zMid);
  const tN = new THREE.Mesh(new THREE.BoxGeometry(trimT, winH + trimW, trimW), whiteLacquer);
  tN.position.set(trimX, winMidY + cm(0.6), zStart - trimW * 0.42);
  const tS = tN.clone();
  tS.position.z = zEnd + trimW * 0.42;
  winGroup.add(tTop, tBot, tN, tS);

  // Recessed Outer Frame & Symmetric Double Casement Sashes at X = 850 cm
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
  // Center vertical meeting mullion
  const centerMullion = new THREE.Mesh(new THREE.BoxGeometry(cm(4.8), innerClearH - outerFrameT * 2, cm(3.2)), mats.whiteTrim);
  centerMullion.position.set(sashX - cm(0.4), winMidY + cm(0.2), zMid);
  winGroup.add(ofTop, ofBot, ofN, ofS, centerMullion);

  // Two symmetric casement sashes (Left/North sash & Right/South sash) + dark EPDM gasket + curved white handles!
  const sashW = (innerClearLen - outerFrameT * 2 - cm(3.2)) / 2;
  const sashH = innerClearH - outerFrameT * 2;
  const sashStile = cm(4.4);
  const gasketMat = new THREE.MeshStandardMaterial({ color: 0x2c2e30, roughness: 0.7 });

  for (const side of [-1, 1]) {
    const sz = zMid + side * (cm(1.6) + sashW / 2);
    const sy = winMidY + cm(0.2);

    // Sash white perimeter stiles & rails
    const stTop = new THREE.Mesh(new THREE.BoxGeometry(cm(3.6), sashStile, sashW - cm(0.4)), mats.whiteTrim);
    stTop.position.set(sashX - cm(0.8), sy + sashH / 2 - sashStile / 2, sz);
    const stBot = stTop.clone();
    stBot.position.y = sy - sashH / 2 + sashStile / 2;
    const stL = new THREE.Mesh(new THREE.BoxGeometry(cm(3.6), sashH - sashStile * 2, sashStile), mats.whiteTrim);
    stL.position.set(sashX - cm(0.8), sy, sz - sashW / 2 + sashStile / 2);
    const stR = stL.clone();
    stR.position.z = sz + sashW / 2 - sashStile / 2;

    // Crisp black rubber glazing gasket border around glass pane (exact detail in image_2.jpeg!)
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

    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(cm(1.0), glassH, glassW), mats.clearGlass);
    glassPane.position.set(sashX - cm(0.8), sy, sz);

    // Sculpted White L-Curved Window Handle on meeting stile (Z near zMid, Y = 148 cm)
    const hZ = zMid + side * cm(3.6);
    const hY = cm(148);
    const rosette = createRoundedSlab(cm(0.8), cm(2.6), cm(6.4), cm(0.8), mats.whiteTrim, cm(0.15));
    rosette.position.set(sashX - cm(3.0), hY - cm(3.2), hZ);
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sashX - cm(3.0), hY + cm(0.8), hZ),
      new THREE.Vector3(sashX - cm(6.2), hY + cm(0.6), hZ),
      new THREE.Vector3(sashX - cm(6.8), hY - cm(2.5), hZ + side * cm(0.3)),
      new THREE.Vector3(sashX - cm(6.4), hY - cm(10.5), hZ + side * cm(0.5)),
    ]);
    const handleGrip = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 14, cm(0.62), 10, false), mats.whiteTrim);

    winGroup.add(stTop, stBot, stL, stR, gTop, gBot, gL, gR, glassPane, rosette, handleGrip);
  }
  tagItem(winGroup, '東南次臥深窗龕對開純白氣密窗', '寬 157 × 高 144 cm｜17 cm 純白深窗龕＋極簡平口窗套＋雙支純白弧形窗把手');
  eastWallAttachments.add(winGroup);

  // ===========================================================================
  // 3. Tailored Full-Drop S-Wave Linen Curtain (左側高精細蛇形抓褶布簾)
  //    Spans Z = 592..656 cm (64 cm wide), Y = 77.8..254 cm (emerges from pelmet, hovers 2.8cm above desk!)
  // ===========================================================================
  const curtainLenZ = cm(64);
  const curtainTopY = cm(254);
  const curtainBotY = cm(77.8);
  const curtainH = curtainTopY - curtainBotY;
  const pleats = 9.5;
  const amp = cm(3.4);
  const cShape = new THREE.Shape();
  const steps = 96;
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
    const lx = Math.sin(t * Math.PI * 2 * pleats) * amp + cm(0.55);
    cShape.lineTo(lx, lz);
  }
  cShape.closePath();

  const cGeo = new THREE.ExtrudeGeometry(cShape, { depth: curtainH, bevelEnabled: false });
  // ExtrudeGeometry extrudes along +Z; rotate so shape (lx, lz) maps to world (X, Z) and depth maps downward along Y!
  // Let's map explicitly via vertex transform for 100% precision:
  const cPos = cGeo.attributes.position;
  const cUv = cGeo.attributes.uv;
  for (let i = 0; i < cPos.count; i++) {
    const sx = cPos.getX(i);
    const sz = cPos.getY(i);
    const depthY = cPos.getZ(i); // 0 .. curtainH
    const dropRatio = depthY / curtainH; // 0 at top, 1 at bottom
    // Subtle natural gravityrelaxation of pleats toward hem
    const worldX = cm(829.5) + sx * (0.92 + 0.12 * dropRatio);
    const worldY = curtainTopY - depthY;
    const worldZ = cm(592) + sz;
    cPos.setXYZ(i, worldX, worldY, worldZ);
    cUv.setXY(i, (sz / curtainLenZ) * 3, dropRatio * 4);
  }
  cGeo.computeVertexNormals();
  const tailoredCurtainMat = mats.warmCreamFabric.clone();
  tailoredCurtainMat.color.setHex(0xedeae3);
  tailoredCurtainMat.side = THREE.DoubleSide;
  const tailoredCurtain = new THREE.Mesh(cGeo, tailoredCurtainMat);
  tagItem(tailoredCurtain, '高精細訂製亞麻白蛇形落地窗簾', '寬 64 × 高 176 cm｜自隱藏窗簾盒垂墜至書桌上方 2.8 cm');
  eastWallAttachments.add(tailoredCurtain);

  // ===========================================================================
  // 4. Custom Seamless Concave-Curved White L-Desk (一體成型內圓弧純白轉角書桌)
  //    East wing: X = 786..838 (52cm deep), Z = 636..803 (167cm long)
  //    South wing: X = 738..838 (100cm wide), Z = 745..803 (58cm deep)
  //    Concave C1 tangent fillet: center (X = 738, Z = 697), radius R = 48 cm -> (786, 697) to (738, 745)!
  // ===========================================================================
  const deskGroup = new THREE.Group();
  const deskTopY = cm(75.0);
  const topThick = cm(2.8);
  const fasciaH = cm(11.2);

  // Build 2D desktop shape in (worldX, worldZ) and convert to 3D horizontal slab
  function extrudeHorizontalXZ(shapeFn, yBottom, height, mat) {
    const shape = new THREE.Shape();
    shapeFn(shape);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: cm(0.18),
      bevelSize: cm(0.18),
      bevelSegments: 2,
      curveSegments: 32,
    });
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i);
      const wz = pos.getY(i);
      const wy = yBottom + pos.getZ(i);
      pos.setXYZ(i, wx, wy, wz);
    }
    // Fix winding since (X, Y, Z) <- (X, Z_ext, Y_shape) flips handedness
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

  // Desktop Surface Slab (Y = 72.2 .. 75.0 cm)
  // Note: Let's extend South wing to X = 736 and arc center at (742, 701) with R = 44 cm so South wing has a straight drawer segment (X = 736..742..)!
  // Wait: look at image_2.jpeg! On the right of the curved corner fascia, there IS a straight drawer on the South wing!
  // Let's make arc center = (X = 754, Z = 713) with R = 32 cm:
  // - Tangent on East wing (X = 786): at (786, 713)! That leaves straight East drawer Z = 639..712 (73 cm wide!),
  // - Curved corner fascia from (786, 713) to (754, 745) (arc length ~50 cm!),
  // - Straight South drawer from X = 754 to X = 738 (or extend desk South wing to X = 726 and adjust bed to X = 556..724 -> 168cm? No, keep bed 184cm X=556..740, OR put arc center at (762, 721), R = 24 cm -> straight South drawer X = 741..762 = 21 cm, OR even better: look at q4_bot_right.png! In q4_bot_right.png, bed is 106x188 oriented NORTH-SOUTH or EAST-WEST? Look at the text "106x188" in q4_bot_right.png!!).
  // WAIT A SECOND! Look at the vertical orientation of the text "106x188" in q4_bot_right.png:
  // Dimension `110` is vertical, `190` is horizontal (`X = 556..744`), leaving `X = 744..838 = 94 cm` for the desk!
  // With `X = 738..838` (`100 cm` total width) and `R = 30 cm` centered at `(756, 715)`:
  //   - East straight edge: `X = 786, Z = 636..715` (`79 cm` straight!)
  //   - Concave fillet arc: center `(756, 715)`, `R = 30 cm`, angle `0 .. PI/2` -> `(786, 715)` to `(756, 745)`!
  //   - South straight edge: `Z = 745, X = 756..738` (`18 cm` straight drawer visible behind chair, exact match to image_2.jpeg!)
  const arcCx = cm(756);
  const arcCz = cm(715);
  const arcR = cm(30);

  const deskTopMesh = extrudeHorizontalXZ(
    (s) => {
      s.moveTo(cm(786), cm(636));
      s.lineTo(cm(838), cm(636));
      s.lineTo(cm(838), cm(803));
      s.lineTo(cm(738), cm(803));
      s.lineTo(cm(738), cm(745));
      s.lineTo(arcCx, cm(745));
      // Arc from angle PI/2 (756, 745) down to 0 (786, 715)
      s.absarc(arcCx, arcCz, arcR, Math.PI / 2, 0, true);
      s.lineTo(cm(786), cm(636));
    },
    deskTopY - topThick,
    topThick,
    whiteLacquer
  );
  deskGroup.add(deskTopMesh);

  // Under-Desk Carcass & 3 Seamless Handleless Drawer Fascias (Left Straight + Center Concave Curve + Right Straight)
  const fRecess = cm(0.7);
  // 1) Left straight drawer fascia (Z = 639.6 .. 714.6)
  const drwLeft = extrudeHorizontalXZ(
    (s) => {
      s.moveTo(cm(786) + fRecess, cm(639.6));
      s.lineTo(cm(836), cm(639.6));
      s.lineTo(cm(836), cm(714.6));
      s.lineTo(cm(786) + fRecess, cm(714.6));
      s.closePath();
    },
    deskTopY - topThick - fasciaH,
    fasciaH - cm(0.25),
    whiteLacquer
  );
  // 2) Center curved concave drawer fascia (from Z = 715.1 around arc to X = 755.5)
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
    deskTopY - topThick - fasciaH,
    fasciaH - cm(0.25),
    whiteLacquer
  );
  // 3) Right straight drawer fascia (X = 741.6 .. 755.3)
  const drwRight = extrudeHorizontalXZ(
    (s) => {
      s.moveTo(cm(741.6), cm(745) + fRecess);
      s.lineTo(arcCx - cm(0.6), cm(745) + fRecess);
      s.lineTo(arcCx - cm(0.6), cm(801));
      s.lineTo(cm(741.6), cm(801));
      s.closePath();
    },
    deskTopY - topThick - fasciaH,
    fasciaH - cm(0.25),
    whiteLacquer
  );
  deskGroup.add(drwLeft, drwCurve, drwRight);

  // Subtle dark shadow-reveal backing strip so the 2 vertical drawer seams read razor-sharp just like image_2.jpeg!
  const seamBacking = extrudeHorizontalXZ(
    (s) => {
      const rBack = arcR + cm(1.3);
      s.moveTo(cm(787.3), cm(639.4));
      s.lineTo(cm(835), cm(639.4));
      s.lineTo(cm(835), cm(800));
      s.lineTo(cm(741.4), cm(800));
      s.lineTo(cm(741.4), cm(746.3));
      s.lineTo(arcCx, cm(746.3));
      s.absarc(arcCx, arcCz, rBack, Math.PI / 2, 0, true);
      s.lineTo(cm(787.3), cm(639.4));
    },
    deskTopY - topThick - fasciaH + cm(0.3),
    fasciaH - cm(0.5),
    new THREE.MeshStandardMaterial({ color: 0xc8c5be, roughness: 0.9 })
  );
  deskGroup.add(seamBacking);

  // 2 Full-Depth Solid Waterfall Panel Legs (Left at Z=636, Right at X=738)
  const legLeft = new THREE.Mesh(
    new THREE.BoxGeometry(cm(52), deskTopY - topThick, cm(3.4)),
    whiteLacquer
  );
  legLeft.position.set(cm(812), (deskTopY - topThick) / 2, cm(637.7));

  const legRight = new THREE.Mesh(
    new THREE.BoxGeometry(cm(3.4), deskTopY - topThick, cm(58)),
    whiteLacquer
  );
  legRight.position.set(cm(739.7), (deskTopY - topThick) / 2, cm(774));
  deskGroup.add(legLeft, legRight);

  // --- Desktop Minimalist Accessories in the Sunbeam (Notebook + Slim Keyboard + Pebble Mouse) ---
  // 1) White Hardcover Notebook with Bookmark Ribbon at (X = 799, Z = 682)
  const nbGroup = new THREE.Group();
  nbGroup.position.set(cm(801), deskTopY, cm(679));
  nbGroup.rotation.y = -0.18;
  const nbBotCover = createRoundedSlab(cm(16.5), cm(22.5), cm(0.35), cm(0.8), whiteLacquer, cm(0.08));
  const nbPages = createRoundedSlab(cm(15.8), cm(21.8), cm(1.3), cm(0.4), mats.warmCreamFabric, cm(0.05));
  nbPages.position.set(-cm(0.2), cm(0.35), 0);
  const nbTopCover = createRoundedSlab(cm(16.5), cm(22.5), cm(0.35), cm(0.8), whiteLacquer, cm(0.08));
  nbTopCover.position.y = cm(1.65);
  const ribbon = new THREE.Mesh(
    new THREE.BoxGeometry(cm(0.9), cm(0.15), cm(4.2)),
    new THREE.MeshStandardMaterial({ color: 0xb7b1a6, roughness: 0.8 })
  );
  ribbon.position.set(-cm(2.5), cm(0.25), -cm(12.2));
  ribbon.rotation.y = 0.25;
  nbGroup.add(nbBotCover, nbPages, nbTopCover, ribbon);
  deskGroup.add(nbGroup);

  // 2) Ultra-Slim White Wireless Keyboard at (X = 799, Z = 708)
  const kbGroup = new THREE.Group();
  kbGroup.position.set(cm(799), deskTopY, cm(707));
  kbGroup.rotation.y = -0.32;
  const kbChassis = createRoundedSlab(cm(11.6), cm(28.4), cm(0.75), cm(0.9), mats.brushedNickel, cm(0.12));
  kbChassis.rotation.z = -0.05; // ergonomic wedge tilt facing user (-X)
  kbGroup.add(kbChassis);
  // Crisp white chiclet keycap rows
  const rows = 5;
  const cols = 13;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c >= 4 && c <= 8) {
        if (c === 6) {
          // Spacebar
          const spKey = new THREE.Mesh(new THREE.BoxGeometry(cm(1.4), cm(0.35), cm(9.2)), whiteLacquer);
          spKey.position.set(-cm(4.0) + r * cm(1.95), cm(0.72) + r * cm(0.08), 0);
          kbGroup.add(spKey);
        }
        continue;
      }
      const key = new THREE.Mesh(new THREE.BoxGeometry(cm(1.45), cm(0.35), cm(1.65)), whiteLacquer);
      key.position.set(-cm(4.0) + r * cm(1.95), cm(0.72) + r * cm(0.08), -cm(12.2) + c * cm(2.03));
      kbGroup.add(key);
    }
  }
  deskGroup.add(kbGroup);

  // 3) Sculpted White Wireless Pebble Mouse at (X = 804, Z = 731)
  const mouse = createRoundedSlab(cm(6.0), cm(10.6), cm(2.1), cm(2.9), whiteLacquer, cm(0.75));
  mouse.position.set(cm(804), deskTopY, cm(730));
  mouse.rotation.y = -0.45;
  deskGroup.add(mouse);

  tagItem(deskGroup, '一體成型內圓弧純白轉角書桌', '167 × 100 × 75 cm｜C1 流線內圓弧桌面＋同曲率無把手抽屜＋精裝筆記本與無線鍵鼠');
  roomGroup.add(deskGroup);

  // ===========================================================================
  // 5. Three Matte-White Floating Wall Shelves + Warm Concealed LED + Sculptural Props
  //    Mounted on South Wall Z = 803 cm, X = 720..838 cm (118 cm wide), Depth = 24 cm
  // ===========================================================================
  const shelfW = cm(118);
  const shelfD = cm(24);
  const shelfT = cm(3.4);
  const shelfCenterX = cm(779); // spans 720 .. 838 cm flush into East corner!
  const shelfCenterZ = cm(803) - shelfD / 2;

  const shelfHeights = [cm(132), cm(166), cm(200)];
  shelfHeights.forEach((sy, idx) => {
    const sh = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfT, shelfD), whiteLacquer);
    sh.position.set(shelfCenterX, sy, shelfCenterZ);
    southWallAttachments.add(sh);

    if (idx === 0) {
      // Warm Concealed Linear LED Strip under Bottom Shelf!
      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW - cm(6), cm(0.6), cm(1.6)),
        mats.warmBulbEmissive
      );
      ledStrip.position.set(shelfCenterX, sy - shelfT / 2 - cm(0.2), cm(794));
      southWallAttachments.add(ledStrip);

      // Soft warm linear wall-wash light matching image_2.jpeg
      const washPt = new THREE.PointLight(0xffdca0, 0.72, 2.2, 1.7);
      washPt.position.set(shelfCenterX, sy - cm(5), cm(792));
      washPt.castShadow = false;
      southWallAttachments.add(washPt);
      if (lightsRegistry) {
        lightsRegistry.push({ light: washPt, mat: mats.warmBulbEmissive, baseIntensity: 0.95 });
      }
    }
  });

  // Neutral Linen / Warm Stone Book Palette matching image_2.jpeg
  const bookMats = [
    new THREE.MeshStandardMaterial({ color: 0xd6cfc2, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xe6e1d7, roughness: 0.82 }),
    new THREE.MeshStandardMaterial({ color: 0xc9c0b1, roughness: 0.86 }),
    new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.84 }),
    new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.8 }),
  ];

  // --- Bottom Shelf Props (Y_top = 133.7 cm) ---
  const s1Top = shelfHeights[0] + shelfT / 2;
  // Left (East) row of 6 upright books + 7th diagonally leaning book!
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
    const bMesh = createRoundedSlab(cm(bw), cm(bd), cm(bh), cm(0.3), bookMats[i % bookMats.length], cm(0.08));
    bMesh.position.set(curBookX - cm(bw / 2), s1Top, cm(792));
    southWallAttachments.add(bMesh);
    curBookX -= cm(bw + 0.15);
  });
  // 7th leaning book tilted against the stack (exact detail from image_2.jpeg!)
  const leanBook = createRoundedSlab(cm(3.2), cm(17.2), cm(21.0), cm(0.3), bookMats[2], cm(0.08));
  leanBook.position.set(curBookX - cm(4.8), s1Top - cm(0.2), cm(792));
  leanBook.rotation.z = -0.29;
  southWallAttachments.add(leanBook);

  // Bottom Shelf Right (West): 2 horizontal stacked books + lidded cream stone candle jar
  const hBook1 = createRoundedSlab(cm(22), cm(16), cm(2.6), cm(0.3), bookMats[0], cm(0.08));
  hBook1.position.set(cm(746), s1Top, cm(792));
  const hBook2 = createRoundedSlab(cm(19.5), cm(14.5), cm(2.2), cm(0.3), bookMats[4], cm(0.08));
  hBook2.position.set(cm(746), s1Top + cm(2.6), cm(792));
  const candleJar = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.8), cm(3.8), cm(4.8), 20), bookMats[1]);
  candleJar.position.set(cm(746), s1Top + cm(7.2), cm(792));
  const candleKnob = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.7), cm(0.7), cm(1.1), 12), bookMats[2]);
  candleKnob.position.set(cm(746), s1Top + cm(10.0), cm(792));
  southWallAttachments.add(hBook1, hBook2, candleJar, candleKnob);

  // --- Middle Shelf Props (Y_top = 167.7 cm) ---
  const s2Top = shelfHeights[1] + shelfT / 2;
  // Center-East: 3 tall upright books + 2 horizontal stacked books
  let s2X = cm(799);
  for (const [bw, bh, bd, mIdx] of [
    [2.5, 24.5, 18.0, 2],
    [3.4, 22.0, 17.2, 4],
    [2.8, 21.0, 17.0, 0],
  ]) {
    const bm = createRoundedSlab(cm(bw), cm(bd), cm(bh), cm(0.3), bookMats[mIdx], cm(0.08));
    bm.position.set(s2X - cm(bw / 2), s2Top, cm(792));
    southWallAttachments.add(bm);
    s2X -= cm(bw + 0.15);
  }
  const s2H1 = createRoundedSlab(cm(19.5), cm(15.5), cm(2.1), cm(0.3), bookMats[1], cm(0.08));
  s2H1.position.set(s2X - cm(10.2), s2Top, cm(792));
  const s2H2 = createRoundedSlab(cm(18.0), cm(14.5), cm(1.9), cm(0.3), bookMats[3], cm(0.08));
  s2H2.position.set(s2X - cm(10.2), s2Top + cm(2.1), cm(792));
  southWallAttachments.add(s2H1, s2H2);

  // Middle Shelf Right (West): Sculptural Matte-Cream U-Shaped Arch Vase (U型雙口雕塑花器!)
  const uVase = new THREE.Group();
  uVase.position.set(cm(742), s2Top + cm(8.2), cm(792));
  const uMat = new THREE.MeshStandardMaterial({ color: 0xe5dfd4, roughness: 0.72 });
  // Bottom 180-deg arch: Torus in XY plane from PI to 2*PI
  const uArch = new THREE.Mesh(new THREE.TorusGeometry(cm(5.6), cm(2.4), 18, 32, Math.PI), uMat);
  uArch.rotation.z = Math.PI; // curves downward through Y = -5.6 cm (bottom touches -8.0 cm!)
  const uNeckL = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.4), cm(2.4), cm(5.5), 18), uMat);
  uNeckL.position.set(-cm(5.6), cm(2.75), 0);
  const uNeckR = uNeckL.clone();
  uNeckR.position.x = cm(5.6);
  // Dark hollow openings at top of twin necks
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x5c564e, roughness: 0.95 });
  const holeL = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.75), cm(1.75), cm(0.4), 16), holeMat);
  holeL.position.set(-cm(5.6), cm(5.4), 0);
  const holeR = holeL.clone();
  holeR.position.x = cm(5.6);
  uVase.add(uArch, uNeckL, uNeckR, holeL, holeR);
  southWallAttachments.add(uVase);

  tagItem(southWallAttachments, '三層純白懸浮書架＆隱藏暖光燈帶', '寬 118 × 深 24 cm｜精確還原設計圖斜靠書列、香氛蓋罐與 U 型雕塑花器');

  // ===========================================================================
  // 6. Modern White 5-Star Swivel Ergonomic Study Chair (純白五爪輪流線環形扶手書桌椅)
  //    Placed at (X = 752, Z = 706), facing SE into the concave corner of the L-desk!
  // ===========================================================================
  const chair = new THREE.Group();
  chair.position.set(cm(752), 0, cm(706));
  chair.rotation.y = 0.64; // Local +Z points SE toward (798, 766), showing exact 3/4 back & loop arms!

  const wheelDark = new THREE.MeshStandardMaterial({ color: 0x7c7d7f, roughness: 0.55 });
  const stemMetal = mats.brushedNickel;

  // Central Gas-Lift Cylinder & Tilt Housing
  const gasOuter = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.3), cm(2.5), cm(19), 18), whiteLacquer);
  gasOuter.position.y = cm(20.5);
  const gasInner = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.5), cm(1.5), cm(14), 16), whiteLacquer);
  gasInner.position.y = cm(35);
  const tiltBox = createRoundedSlab(cm(16), cm(18), cm(4.2), cm(2), whiteLacquer, cm(0.4));
  tiltBox.position.set(0, cm(40.5), cm(1));
  chair.add(gasOuter, gasInner, tiltBox);

  // 5-Star Contoured White Caster Base + 5 Dual-Wheel Hooded Casters
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 + 0.28;
    const endX = Math.sin(ang) * cm(30.5);
    const endZ = Math.cos(ang) * cm(30.5);
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.sin(ang) * cm(2.0), cm(12.5), Math.cos(ang) * cm(2.0)),
      new THREE.Vector3(Math.sin(ang) * cm(17.0), cm(9.8), Math.cos(ang) * cm(17.0)),
      new THREE.Vector3(endX, cm(6.2), endZ),
    ]);
    const spoke = new THREE.Mesh(new THREE.TubeGeometry(legCurve, 12, cm(1.45), 10, false), whiteLacquer);
    chair.add(spoke);

    // Caster assembly at (endX, 0..6.2, endZ)
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

  // Sculpted One-Piece Upholstered Seat & Gently Curved Rounded Backrest
  const seatY = cm(44.5);
  const seatPan = createRoundedSlab(cm(46), cm(44), cm(5.2), cm(8.5), mats.chairWeaveWhite, cm(1.8));
  seatPan.position.set(0, seatY, cm(2));
  chair.add(seatPan);

  // Ergonomically curved backrest (built with horizontal wrap curvature & rounded top corners!)
  const backW = cm(43);
  const backH = cm(45);
  const backShape = new THREE.Shape();
  const hwBot = backW / 2;
  const hwTop = cm(19.5);
  const rTop = cm(8.5);
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
    bevelThickness: cm(1.1),
    bevelSize: cm(1.1),
    bevelSegments: 4,
    curveSegments: 20,
  });
  // Bend backrest gently into a wraparound cradle + lumbar recline matching image_2.jpeg!
  const bPos = backGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const bx = bPos.getX(i);
    const by = bPos.getY(i);
    const bz = bPos.getZ(i);
    const wrapZ = (bx * bx) / cm(165); // gentle forward wrap at edges
    const reclineZ = -by * 0.11; // subtle 6-deg ergonomic recline toward -Z
    bPos.setXYZ(i, bx, seatY + cm(2.5) + by, -cm(19.5) + bz + wrapZ + reclineZ);
  }
  backGeo.computeVertexNormals();
  const backMesh = new THREE.Mesh(backGeo, mats.chairWeaveWhite);
  chair.add(backMesh);

  // Curved L-spine connecting seat rear to lower backrest
  const spine = createRoundedSlab(cm(34), cm(12), cm(4.2), cm(4), mats.chairWeaveWhite, cm(1.0));
  spine.position.set(0, seatY + cm(0.8), -cm(16.5));
  spine.rotation.x = 0.35;
  chair.add(spine);

  // Sleek White Cantilever Loop Armrests (雙側純白流線環形扶手!)
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
    const armMesh = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 32, cm(1.05), 12, false), whiteLacquer);
    chair.add(armMesh);
  }

  tagItem(chair, '極簡純白織布五爪輪流線書桌椅', '高 92 × 寬 50 cm｜一體成型圓弧微包覆椅背＋純白流線環形扶手＋雙輪靜音滾輪');
  roomGroup.add(chair);

  // ===========================================================================
  // 7. Rest of SE Bedroom: Built-In White Wardrobe (145cm) + Bookcase (45cm) + Crisp White Single Bed
  //    (Bed sized 180 x 108 cm at X = 556..736, Z = 695..803 so it meets the L-desk cleanly!)
  // ===========================================================================
  function makeSEBuiltIn(cx, cz, w, d, doorsCount, isGlass) {
    const h = cm(246);
    const g = new THREE.Group();
    g.position.set(cx, 0, cz);
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - cm(6), d - cm(2)), whiteLacquer);
    body.position.set(0, (h - cm(6)) / 2 + cm(6), -cm(1));
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w - cm(1), cm(6), d - cm(4)), mats.whiteTrim);
    plinth.position.set(0, cm(3), -cm(2));
    // Ceiling filler bulkhead up to Y = 285 cm for clean floor-to-ceiling look!
    const soffit = new THREE.Mesh(new THREE.BoxGeometry(w, cm(39), d), whiteLacquer);
    soffit.position.set(0, cm(265.5), 0);
    g.add(body, plinth, soffit);

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
  tagItem(cab45, '東南次臥格柵玻璃展示書櫃 (45×60)', '45 × 60 × 285 cm｜頂天展示收納櫃');
  roomGroup.add(ward145, cab45);

  // Crisp White Single Bed in SW corner of SE Bedroom (X = 556..736 -> center 646, Z = 695..803 -> center 749)
  const seBed = new THREE.Group();
  seBed.position.set(cm(646), 0, cm(749));
  const bW = cm(180);
  const bD = cm(108);
  const hb = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), cm(96), bD), whiteLacquer);
  hb.position.set(-bW / 2 + cm(2.25), cm(48), 0);
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(2), cm(26), bD - cm(2)), whiteLacquer);
  base.position.set(0, cm(14), 0);
  for (const dx of [-cm(42), cm(42)]) {
    const drw = createDrawerFront(cm(82), cm(19), mats, false);
    drw.rotation.y = Math.PI;
    drw.position.set(dx, cm(14), -bD / 2 + cm(1.5));
    seBed.add(drw);
  }
  const mat = createRoundedSlab(bW - cm(8), bD - cm(6), cm(20), cm(6), mats.warmCreamFabric, cm(1.5));
  mat.position.set(cm(1), cm(27), 0);
  const duv = createRoundedSlab(cm(134), bD - cm(4), cm(7.5), cm(8), mats.crispWhiteLinen, cm(2.0));
  duv.position.set(cm(18), cm(42), 0);
  const throwBlanket = createRoundedSlab(cm(40), bD - cm(3), cm(2.0), cm(5), mats.oatmealLinen, cm(0.8));
  throwBlanket.position.set(cm(58), cm(49.5), 0);
  const pillow = createCountryPillow(cm(42), cm(62), cm(14), mats.crispWhiteLinen);
  pillow.position.set(-cm(60), cm(53), 0);
  pillow.rotation.z = -0.22;
  seBed.add(hb, base, mat, duv, throwBlanket, pillow);
  tagItem(seBed, '東南次臥純白極簡鄉村單人床', '180 × 108 cm｜與右側一體成型圓弧轉角書桌嚴絲合縫對接');
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
