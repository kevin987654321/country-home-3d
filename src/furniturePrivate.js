import * as THREE from 'three';
import {
  cm,
  tagItem,
  enableShadows,
  createRoundedSlab,
  createRaisedPanel,
  createTurnedLeg,
  createHardcoverBook,
  createShakerDoorFace,
  createDrawerFront,
  createCountryPillow,
  createWindsorChair,
  createPottedPlant,
  createPleatedTableLamp,
} from './primitives.js';

// 4. Master Bedroom Suite: Queen Bed (185x190) + Curved Wardrobe (60x165 + R30 curve) + East Vanity Desk (72x50)
export function createMasterBedroomZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // A. Queen Size White Country Bed: X = 581..766 (185cm), Z = 64..254 (190cm)
  const bed = new THREE.Group();
  bed.position.set(cm(673.5), 0, cm(159));
  const bW = cm(185), bL = cm(190);

  // Triple-Coffered Beadboard Headboard at +Z with Stepped Country Cornice
  const hbH = cm(126);
  const hbCore = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(10), hbH - cm(18), cm(4.6)), mats.beadboard);
  hbCore.position.set(0, hbH / 2 + cm(2), bL / 2 - cm(2.5));
  for (const mx of [-cm(58), 0, cm(58)]) {
    if (mx !== 0) {
      const stile = new THREE.Mesh(new THREE.BoxGeometry(cm(5.5), hbH - cm(20), cm(5.6)), mats.creamShaker);
      stile.position.set(mx * 0.52, hbH / 2 + cm(2), bL / 2 - cm(2.5));
      bed.add(stile);
    }
  }
  const hbTopRail = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(8), cm(9.0), cm(5.8)), mats.creamShaker);
  hbTopRail.position.set(0, hbH - cm(6.5), bL / 2 - cm(2.5));
  const hbCrown = new THREE.Mesh(new THREE.BoxGeometry(bW + cm(5), cm(6.2), cm(8.8)), mats.whiteTrim);
  hbCrown.position.set(0, hbH + cm(0.5), bL / 2 - cm(2.5));
  bed.add(hbCore, hbTopRail, hbCrown);

  // 4 Fluted Corner Posts with Multi-Ring Turned Acorn Finials
  for (const sx of [-bW / 2 + cm(3.6), bW / 2 - cm(3.6)]) {
    const hPost = new THREE.Mesh(new THREE.BoxGeometry(cm(7.2), hbH + cm(2), cm(7.2)), mats.creamShaker);
    hPost.position.set(sx, (hbH + cm(2)) / 2, bL / 2 - cm(2.5));
    const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.2), cm(2.4), cm(2.2), 16), mats.whiteTrim);
    neckRing.position.set(sx, hbH + cm(4.2), bL / 2 - cm(2.5));
    const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(3.6), 16, 14), mats.whiteTrim);
    finial.scale.set(1, 1.38, 1);
    finial.position.set(sx, hbH + cm(9.2), bL / 2 - cm(2.5));

    const fPost = new THREE.Mesh(new THREE.BoxGeometry(cm(6.8), cm(47), cm(6.8)), mats.creamShaker);
    fPost.position.set(sx, cm(23.5), -bL / 2 + cm(3));
    const fFinial = finial.clone();
    fFinial.scale.set(0.84, 1.18, 0.84);
    fFinial.position.set(sx, cm(50.5), -bL / 2 + cm(3));
    bed.add(hPost, neckRing, finial, fPost, fFinial);
  }

  // Footboard with Beveled Raised Panels & Side Molded Rails
  const fbCore = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(10), cm(31), cm(4.0)), mats.beadboardFine);
  fbCore.position.set(0, cm(26), -bL / 2 + cm(3));
  for (const fx of [-cm(42), cm(42)]) {
    const rp = createRaisedPanel(cm(74), cm(21), cm(5.0), mats.creamShaker, cm(2.5));
    rp.position.set(fx, cm(26), -bL / 2 + cm(3));
    bed.add(rp);
  }
  const fbCap = new THREE.Mesh(new THREE.BoxGeometry(bW + cm(2), cm(4.2), cm(7.2)), mats.whiteTrim);
  fbCap.position.set(0, cm(43.5), -bL / 2 + cm(3));
  const frameBox = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(4), cm(22), bL - cm(6)), mats.creamShaker);
  frameBox.position.set(0, cm(22), 0);
  bed.add(fbCore, fbCap, frameBox);

  // Piped Quilted Mattress + Organic Voluminous Waffle Duvet + Turn-Down Sheet Flap + Draped Cable-Knit Runner!
  const mattress = createRoundedSlab(cm(178), cm(182), cm(24), cm(8), mats.warmCreamFabric, cm(2.2));
  mattress.position.set(0, cm(31), 0);
  const matPiping = createRoundedSlab(cm(179.2), cm(183.2), cm(0.9), cm(8.2), mats.crispWhiteLinen, cm(0.3));
  matPiping.position.set(0, cm(53.8), 0);

  const duvet = createRoundedSlab(cm(183), cm(138), cm(9.5), cm(10), mats.crispWhiteLinen, cm(2.8));
  duvet.position.set(0, cm(49), -cm(19));
  const foldFlap = createRoundedSlab(cm(68), cm(36), cm(3.2), cm(4), mats.crispWhiteLinen, cm(0.9));
  foldFlap.position.set(cm(46), cm(57.6), cm(32));
  foldFlap.rotation.y = -0.46;

  // Cable-knit bed runner across foot with side overhang drops!
  const knitMat = mats.cableKnitOatmeal || mats.oatmealLinen;
  const bedRunner = createRoundedSlab(cm(185), cm(42), cm(2.5), cm(5), knitMat, cm(0.9));
  bedRunner.position.set(0, cm(57.6), -cm(60));
  for (const side of [-1, 1]) {
    const drop = createRoundedSlab(cm(2.6), cm(41), cm(18), cm(3), knitMat, cm(0.8));
    drop.position.set(side * cm(92), cm(41.5), -cm(60));
    bed.add(drop);
  }
  bed.add(mattress, matPiping, duvet, foldFlap, bedRunner);

  // 4 Layered Ruffled Euro Shams & Sleeping Pillows + Button-Tufted Sage Lumbar Cushion
  for (const px of [-cm(44), cm(44)]) {
    const backPillow = createCountryPillow(cm(68), cm(42), cm(15.5), mats.warmCreamFabric, { flanged: true });
    backPillow.position.set(px, cm(62.5), cm(68));
    backPillow.rotation.x = -0.34;
    const frontPillow = createCountryPillow(cm(62), cm(38), cm(14.5), mats.crispWhiteLinen, { flanged: true });
    frontPillow.position.set(px, cm(59.5), cm(51.5));
    frontPillow.rotation.x = -0.18;
    bed.add(backPillow, frontPillow);
  }
  const lumbar = createCountryPillow(cm(48), cm(24), cm(13.5), mats.sageCountryThrow, { flanged: false, buttoned: true });
  lumbar.position.set(0, cm(60.5), cm(37));
  lumbar.rotation.x = -0.15;
  bed.add(lumbar);

  const masterRug = createRoundedSlab(cm(226), cm(176), cm(0.85), cm(6), mats.warmCreamFabric, cm(0.25));
  masterRug.position.set(0, cm(0.3), -cm(18));
  bed.add(masterRug);

  tagItem(bed, '主臥純白鄉村風雙人加大床組 (Queen Size)', '185 × 190 cm｜三格企口高背床頭板＋車枳橡實柱頭＋滾邊床墊與麻花針織床尾巾');
  zone.add(bed);

  // B. Master Wardrobe (60 x 165 cm) + Exact Bounded 60 x 30 cm Quarter-Ellipse North Shelving Unit
  const wardGroup = new THREE.Group();
  const wLen = cm(165), wH = cm(242);
  const wardBody = new THREE.Mesh(new THREE.BoxGeometry(cm(59), wH - cm(12), wLen), mats.warmIvoryCabinet);
  wardBody.position.set(cm(551.5), (wH - cm(12)) / 2 + cm(6), cm(176.5));
  const wardPlinth = new THREE.Mesh(new THREE.BoxGeometry(cm(57), cm(6), wLen), mats.whiteTrim);
  wardPlinth.position.set(cm(552.5), cm(3), cm(176.5));
  const wardCrown = new THREE.Mesh(new THREE.BoxGeometry(cm(62), cm(6), wLen), mats.whiteTrim);
  wardCrown.position.set(cm(550), wH - cm(3), cm(176.5));
  wardGroup.add(wardBody, wardPlinth, wardCrown);

  // 3 Shaker Wardrobe Doors + Bottom Apparel Drawers facing West (-X)
  const mdW = wLen / 3;
  for (let i = 0; i < 3; i++) {
    const dz = cm(94) + mdW * (i + 0.5);
    const face = createShakerDoorFace(mdW - cm(0.8), wH - cm(52), mats, {
      louver: i === 1,
      knobSide: i === 2 ? 'left' : 'right',
      knobYRatio: 0.42,
    });
    face.rotation.y = -Math.PI / 2;
    face.position.set(cm(521), cm(142), dz);
    const lowDrw = createDrawerFront(mdW - cm(1.0), cm(34), mats, true);
    lowDrw.rotation.y = -Math.PI / 2;
    lowDrw.position.set(cm(521), cm(24), dz);
    wardGroup.add(face, lowDrw);
  }

  function makeQuarterEllipseSlab(rxCm, rzCm, yBottom, thick, mat) {
    const sh = new THREE.Shape();
    sh.moveTo(cm(581), cm(94));
    sh.lineTo(cm(581 - rxCm), cm(94));
    const segs = 28;
    for (let k = 1; k <= segs; k++) {
      const t = (k / segs) * (Math.PI / 2);
      sh.lineTo(cm(581) - cm(rxCm) * Math.cos(t), cm(94) - cm(rzCm) * Math.sin(t));
    }
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false });
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
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, mat);
  }

  const curveBack = new THREE.Mesh(new THREE.BoxGeometry(cm(2.5), wH - cm(6), cm(30)), mats.warmIvoryCabinet);
  curveBack.position.set(cm(579.75), (wH - cm(6)) / 2, cm(79));
  const cPlinth = makeQuarterEllipseSlab(57, 28.5, 0, cm(6), mats.whiteTrim);
  const cCrown = makeQuarterEllipseSlab(61, 30.2, wH - cm(6), cm(6), mats.whiteTrim);
  wardGroup.add(curveBack, cPlinth, cCrown);

  for (let s = 0; s < 5; s++) {
    const sy = cm(6) + (s / 4) * (wH - cm(14.5));
    const qShelf = makeQuarterEllipseSlab(59, 29.5, sy, cm(2.4), s === 2 ? mats.naturalOak : mats.warmIvoryCabinet);
    wardGroup.add(qShelf);
    if (s === 1) {
      const b1 = createHardcoverBook(cm(2.6), cm(14), cm(19), mats.sageCountryThrow, mats.warmCreamFabric);
      b1.rotation.z = Math.PI / 2;
      b1.position.set(cm(560), sy + cm(3.7), cm(83));
      wardGroup.add(b1);
    } else if (s === 2) {
      // Perfume tray + 2 crystal/amber flacons at waist height
      const pTray = new THREE.Mesh(new THREE.CylinderGeometry(cm(8.5), cm(8.5), cm(0.8), 20), mats.antiqueBrass);
      pTray.position.set(cm(560), sy + cm(2.8), cm(83));
      const flac1 = new THREE.Mesh(new THREE.BoxGeometry(cm(3.6), cm(7.5), cm(2.4)), mats.amberGlass);
      flac1.position.set(cm(558), sy + cm(6.8), cm(82));
      const cap1 = new THREE.Mesh(new THREE.SphereGeometry(cm(1.1), 10, 10), mats.antiqueBrass);
      cap1.position.set(cm(558), sy + cm(11.4), cm(82));
      wardGroup.add(pTray, flac1, cap1);
    } else if (s === 3) {
      const budVase = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.2), cm(3.6), cm(11), 16), mats.porcelainGloss);
      budVase.position.set(cm(563), sy + cm(7.9), cm(83));
      const sprig = new THREE.Mesh(new THREE.SphereGeometry(cm(3.8), 10, 8), mats.foliageSage);
      sprig.position.set(cm(563), sy + cm(15.5), cm(83));
      wardGroup.add(budVase, sprig);
    }
  }

  tagItem(wardGroup, '主臥純白鄉村風三門抽屜衣櫃＋橢圓弧展示櫃', '深 60 × 長 165 cm＋北側 60 × 30 cm 橢圓弧香氛書籍展示層架');
  zone.add(wardGroup);

  // C. Master East Bedside Vanity / Study Desk (X = 766..838 -> 72cm wide, Z = 209..259 -> 50cm deep)
  const vanity = createCountryStudyDesk(cm(72), cm(50), mats, {
    lampLocalX: -cm(22),
    lampLocalZ: cm(13),
    lightsRegistry,
    hasMirrorOnSouthWall: true,
    isVanity: true,
  });
  vanity.position.set(cm(802), 0, cm(234));
  const vChair = createWindsorChair(mats, mats.crispWhiteLinen);
  vChair.position.set(cm(802), 0, cm(192));
  tagItem(vanity, '主臥鄉村風雕花壁鏡梳妝桌組', '75 × 50 cm｜車枳桌腳＋百褶陶瓷檯燈＋蝴蝶結雕花橢圓壁鏡＋珠寶盒與香水瓶');
  zone.add(vanity, vChair);

  enableShadows(zone, true, true);
  return zone;
}

// Reusable Country Study / Vanity Desk (with Jewelry Box / Pencil Cup, Books & Carved Mirror)
export function createCountryStudyDesk(w, d, mats, opts = {}) {
  const {
    lampLocalX = -w * 0.32,
    lampLocalZ = d * 0.24,
    lightsRegistry = null,
    hasMirrorOnSouthWall = false,
    isVanity = false,
  } = opts;
  const g = new THREE.Group();
  const h = cm(75);

  const top = createRoundedSlab(w, d, cm(3.2), cm(3), mats.naturalOak, cm(0.5));
  top.position.y = h - cm(3.2);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(w - cm(10), cm(11.2), d - cm(8)), mats.creamShaker);
  apron.position.y = h - cm(8.8);
  g.add(top, apron);

  const numDrw = w > cm(80) ? 2 : 1;
  const drwW = (w - cm(12)) / numDrw;
  for (let i = 0; i < numDrw; i++) {
    const df = createDrawerFront(drwW - cm(1), cm(9.6), mats, true);
    df.rotation.y = Math.PI;
    df.position.set(-w / 2 + cm(6) + drwW * (i + 0.5), h - cm(8.8), -d / 2 + cm(3.5));
    g.add(df);
  }

  for (const [lx, lz] of [
    [-w / 2 + cm(6), -d / 2 + cm(6)],
    [w / 2 - cm(6), -d / 2 + cm(6)],
    [-w / 2 + cm(6), d / 2 - cm(6)],
    [w / 2 - cm(6), d / 2 - cm(6)],
  ]) {
    const leg = createTurnedLeg(h - cm(3.0), cm(2.5), mats.creamShaker);
    leg.position.set(lx, 0, lz);
    g.add(leg);
  }

  const lamp = createPleatedTableLamp(mats, lightsRegistry, cm(42));
  lamp.position.set(lampLocalX, h, lampLocalZ);
  g.add(lamp);

  // Open journal + Brass pen + either Jewelry Box & Perfume (Master Vanity) or Pencil Cup & Textbooks (SW Study)
  const book1 = createHardcoverBook(cm(2.2), cm(16), cm(21.5), mats.crispWhiteLinen, mats.warmCreamFabric);
  book1.rotation.z = Math.PI / 2;
  book1.rotation.y = -0.08;
  book1.position.set(-lampLocalX * 0.55, h + cm(1.1), -cm(2));
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.32), cm(0.24), cm(13.5), 10), mats.antiqueBrass);
  pen.rotation.x = Math.PI / 2;
  pen.rotation.z = 0.28;
  pen.position.set(-lampLocalX * 0.15, h + cm(0.35), -cm(3));
  g.add(book1, pen);

  if (isVanity) {
    const jBox = createRoundedSlab(cm(13), cm(9.5), cm(5.2), cm(1.4), mats.creamShaker, cm(0.35));
    jBox.position.set(cm(19), h, cm(12));
    const jTrim = new THREE.Mesh(new THREE.BoxGeometry(cm(13.2), cm(0.45), cm(9.7)), mats.antiqueBrass);
    jTrim.position.set(cm(19), h + cm(3.6), cm(12));
    const perfume = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.2), cm(2.5), cm(6.5), 10), mats.clearGlass);
    perfume.position.set(cm(6), h + cm(3.25), cm(14));
    const pCap = new THREE.Mesh(new THREE.SphereGeometry(cm(0.95), 10, 10), mats.antiqueBrass);
    pCap.position.set(cm(6), h + cm(7.2), cm(14));
    g.add(jBox, jTrim, perfume, pCap);
  } else {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.6), cm(3.2), cm(9.5), 16), mats.porcelainGloss);
    cup.position.set(w * 0.32, h + cm(4.75), cm(14));
    for (let p = 0; p < 3; p++) {
      const pencil = new THREE.Mesh(
        new THREE.CylinderGeometry(cm(0.28), cm(0.28), cm(13.5), 8),
        p === 0 ? mats.antiqueBrass : mats.naturalOak
      );
      pencil.position.set(w * 0.32 + (p - 1) * cm(1.1), h + cm(9.0), cm(14));
      pencil.rotation.z = (p - 1) * 0.14;
      g.add(pencil);
    }
    g.add(cup);
  }

  if (hasMirrorOnSouthWall) {
    const mFrame = new THREE.Mesh(new THREE.TorusGeometry(cm(20), cm(2.2), 14, 32), mats.whiteTrim);
    mFrame.scale.set(0.95, 1.32, 0.75);
    mFrame.position.set(0, cm(128), d / 2 - cm(1.2));
    const mBack = new THREE.Mesh(new THREE.CylinderGeometry(cm(20), cm(20), cm(1.6), 32), mats.whiteTrim);
    mBack.rotation.x = Math.PI / 2;
    mBack.scale.set(0.95, 1, 1.32);
    mBack.position.set(0, cm(128), d / 2 - cm(1.6));
    const mGlass = new THREE.Mesh(new THREE.CylinderGeometry(cm(18.6), cm(18.6), cm(1.8), 32), mats.mirror);
    mGlass.rotation.x = Math.PI / 2;
    mGlass.scale.set(0.95, 1, 1.32);
    mGlass.position.set(0, cm(128), d / 2 - cm(1.4));
    // Carved ribbon-bow crest on top of vanity mirror
    const crest = new THREE.Mesh(new THREE.SphereGeometry(cm(3.0), 12, 10), mats.antiqueBrass);
    crest.scale.set(1.8, 0.75, 0.5);
    crest.position.set(0, cm(155.5), d / 2 - cm(1.0));
    g.add(mFrame, mBack, mGlass, crest);
  }

  enableShadows(g, true, true);
  return g;
}

// 5. South-West Bedroom 2 (Built-In Bookcase with Interior Books + Coffered Daybed + Study Desk)
export function createSouthBedroomsZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  function makeBuiltIn(cx, cz, w, d, doorsCount, isBookcase, label) {
    const h = cm(242);
    const unit = new THREE.Group();
    unit.position.set(cx, 0, cz);
    const bodyD = isBookcase ? d - cm(12) : d - cm(2);
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - cm(8), bodyD), mats.warmIvoryCabinet);
    body.position.set(0, (h - cm(8)) / 2 + cm(4), isBookcase ? -cm(6) : -cm(1));
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w - cm(2), cm(6), d - cm(4)), mats.whiteTrim);
    plinth.position.set(0, cm(3), -cm(2));
    const crown1 = new THREE.Mesh(new THREE.BoxGeometry(w + cm(3), cm(3.5), d + cm(2.5)), mats.whiteTrim);
    crown1.position.set(0, h - cm(2.2), cm(0.8));
    const crown2 = new THREE.Mesh(new THREE.BoxGeometry(w + cm(5.5), cm(2.8), d + cm(4.5)), mats.whiteTrim);
    crown2.position.set(0, h + cm(0.8), cm(1.8));
    unit.add(body, plinth, crown1, crown2);

    if (isBookcase) {
      // Side walls of upper glass bookcase + 3 interior oak shelves populated with hardcover books!
      for (const sx of [-w / 2 + cm(1.2), w / 2 - cm(1.2)]) {
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(cm(2.4), cm(144), d - cm(2)), mats.warmIvoryCabinet);
        sideWall.position.set(sx, cm(162), -cm(1));
        unit.add(sideWall);
      }
      const lowCarcass = new THREE.Mesh(new THREE.BoxGeometry(w, cm(84), d - cm(2)), mats.warmIvoryCabinet);
      lowCarcass.position.set(0, cm(46), -cm(1));
      unit.add(lowCarcass);

      const bookPalette = [mats.sageCountryThrow, mats.oatmealLinen, mats.dustyChambrayThrow, mats.warmWalnutAccent];
      for (let s = 0; s < 3; s++) {
        const sy = cm(96 + s * 42);
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - cm(4), cm(2.0), d - cm(5)), mats.naturalOak);
        shelf.position.set(0, sy, cm(1));
        unit.add(shelf);
        for (let b = 0; b < 5; b++) {
          const bk = createHardcoverBook(
            cm(2.8),
            cm(16.5),
            cm(20 + ((b + s) % 3) * 2.2),
            bookPalette[(b + s) % bookPalette.length],
            mats.crispWhiteLinen
          );
          bk.position.set(-w / 2 + cm(6.5) + b * cm(3.3), sy + cm(1.0), cm(16));
          unit.add(bk);
        }
      }
      const lowD = createShakerDoorFace(w - cm(2), cm(82), mats, { knobSide: 'right', knobYRatio: 0.82 });
      lowD.position.set(0, cm(47), d / 2 - cm(1));
      const upGlass = createShakerDoorFace(w - cm(2), cm(142), mats, { glass: true, knobSide: 'right', knobYRatio: 0.16 });
      upGlass.position.set(0, cm(162), d / 2 - cm(1));
      unit.add(lowD, upGlass);
    } else {
      const dw = (w - cm(3)) / doorsCount;
      for (let i = 0; i < doorsCount; i++) {
        const dx = -w / 2 + cm(1.5) + dw * (i + 0.5);
        const face = createShakerDoorFace(dw - cm(0.6), h - cm(20), mats, {
          knobSide: i % 2 === 0 ? 'right' : 'left',
          knobYRatio: 0.46,
        });
        face.position.set(dx, h / 2, d / 2 - cm(1));
        unit.add(face);
      }
    }
    tagItem(unit, label, `寬 ${Math.round(w * 100)} × 深 ${Math.round(d * 100)} × 高 242 cm｜純白鄉村風頂天線板系統櫃`);
    return unit;
  }

  // Coffered Country Single Daybed (188 x 110 cm) against South wall (+Z)
  function makeSingleBed(cx, cz, headAtEast, throwMat, label) {
    const bW = cm(188), bD = cm(110);
    const g = new THREE.Group();
    g.position.set(cx, 0, cz);
    const headSign = headAtEast ? 1 : -1;

    const hb = new THREE.Mesh(new THREE.BoxGeometry(cm(5.2), cm(102), bD), mats.beadboard);
    hb.position.set(headSign * (bW / 2 - cm(2.6)), cm(51), 0);
    const hbCap = new THREE.Mesh(new THREE.BoxGeometry(cm(8.0), cm(5.2), bD + cm(4)), mats.whiteTrim);
    hbCap.position.set(headSign * (bW / 2 - cm(2.6)), cm(103), 0);

    const fb = new THREE.Mesh(new THREE.BoxGeometry(cm(4.6), cm(62), bD), mats.beadboardFine);
    fb.position.set(-headSign * (bW / 2 - cm(2.3)), cm(31), 0);
    const fbCap = new THREE.Mesh(new THREE.BoxGeometry(cm(6.8), cm(4.2), bD + cm(3)), mats.whiteTrim);
    fbCap.position.set(-headSign * (bW / 2 - cm(2.3)), cm(63), 0);

    // Corner posts with turned ball finials
    for (const zCorner of [-bD / 2 + cm(2.5), bD / 2 - cm(2.5)]) {
      const finH = new THREE.Mesh(new THREE.SphereGeometry(cm(2.8), 12, 10), mats.whiteTrim);
      finH.position.set(headSign * (bW / 2 - cm(2.6)), cm(108), zCorner);
      const finF = new THREE.Mesh(new THREE.SphereGeometry(cm(2.4), 12, 10), mats.whiteTrim);
      finF.position.set(-headSign * (bW / 2 - cm(2.3)), cm(67.2), zCorner);
      g.add(finH, finF);
    }

    const wallRail = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(6), cm(78), cm(4.2)), mats.beadboard);
    wallRail.position.set(0, cm(39), bD / 2 - cm(2.1));
    const wallCap = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(4), cm(3.8), cm(6.2)), mats.whiteTrim);
    wallCap.position.set(0, cm(79), bD / 2 - cm(2.1));
    const base = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(4), cm(26), bD - cm(4)), mats.creamShaker);
    base.position.set(0, cm(15), 0);
    g.add(hb, hbCap, fb, fbCap, wallRail, wallCap, base);

    for (const dx of [-cm(44), cm(44)]) {
      const drw = createDrawerFront(cm(84), cm(19), mats, true);
      drw.rotation.y = Math.PI;
      drw.position.set(dx, cm(14), -bD / 2 + cm(2));
      g.add(drw);
    }

    const mat = createRoundedSlab(bW - cm(10), bD - cm(8), cm(20), cm(6), mats.warmCreamFabric, cm(1.6));
    mat.position.set(0, cm(28), -cm(1));
    const duv = createRoundedSlab(cm(138), bD - cm(6), cm(8.0), cm(8), mats.crispWhiteLinen, cm(2.2));
    duv.position.set(-headSign * cm(18), cm(43), -cm(1));
    const cuff = createRoundedSlab(cm(24), bD - cm(5.5), cm(2.4), cm(4), mats.crispWhiteLinen, cm(0.8));
    cuff.position.set(headSign * cm(38), cm(50.2), -cm(1));
    const throwBlanket = createRoundedSlab(cm(42), bD - cm(5), cm(2.4), cm(5), throwMat, cm(0.85));
    throwBlanket.position.set(-headSign * cm(60), cm(50.8), -cm(1));

    const pillow = createCountryPillow(cm(42), cm(64), cm(14.5), mats.crispWhiteLinen, { flanged: true });
    pillow.position.set(headSign * cm(64), cm(54.5), 0);
    pillow.rotation.z = headSign * 0.22;
    const cushion = createCountryPillow(cm(28), cm(38), cm(12.5), throwMat, { buttoned: true });
    cushion.position.set(headSign * cm(44), cm(53.5), cm(16));

    g.add(mat, duv, cuff, throwBlanket, pillow, cushion);
    tagItem(g, label, '188 × 110 cm｜三面企口護欄柱頭床架＋貝殼拉手雙抽屜＋華夫格與針織寢具');
    return g;
  }

  zone.add(makeBuiltIn(cm(284), cm(597), cm(40), cm(60), 1, false, '西南次臥門側收納高櫃 (40×60)'));
  zone.add(makeBuiltIn(cm(419.5), cm(597), cm(35), cm(60), 1, true, '西南次臥格柵玻璃展示書櫃 (35×60)'));
  zone.add(makeBuiltIn(cm(491.5), cm(597), cm(109), cm(60), 2, false, '西南次臥雙門鄉村風衣櫃 (109×60)'));
  zone.add(makeSingleBed(cm(452), cm(748), true, mats.sageCountryThrow, '西南次臥純白鄉村風護欄單人床'));

  const deskSW = createCountryStudyDesk(cm(94), cm(60), mats, {
    lampLocalX: -cm(31),
    lampLocalZ: cm(16),
    lightsRegistry,
  });
  deskSW.position.set(cm(311), 0, cm(773));
  tagItem(deskSW, '西南次臥鄉村風實木書桌 (94×60)', '94 × 60 cm｜白橡木桌面＋雙貝殼拉手抽屜＋百褶陶瓷檯燈＋筆筒與筆記本');
  const chairSW = createWindsorChair(mats, mats.warmCreamFabric);
  chairSW.position.set(cm(311), 0, cm(726));
  zone.add(deskSW, chairSW);

  enableShadows(zone, true, true);
  return zone;
}

// 6. Dual Bathrooms (True Cutout Undermount Vanities, Hollow-Rim Toilets, Rain Shower Column & Paneled Soaking Tub)
export function createBathroomsZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // Helper: Contoured Skirted White Ceramic Toilet with Hollow Rim, Water Seal, Dual-Flush & TP Holder
  function makeToilet(facingDirX) {
    const t = new THREE.Group();
    const tank = createRoundedSlab(cm(19.5), cm(39), cm(41), cm(4.5), mats.porcelainGloss, cm(0.9));
    tank.position.set(-facingDirX * cm(21.5), cm(38), 0);
    const lid = createRoundedSlab(cm(21.5), cm(41), cm(3.2), cm(4.5), mats.porcelainGloss, cm(0.6));
    lid.position.set(-facingDirX * cm(21.5), cm(79), 0);

    // Sculpted skirted pedestal base + hollow upper bowl cavity + water surface
    const pedestal = createRoundedSlab(cm(48), cm(35), cm(33), cm(15), mats.porcelainGloss, cm(1.5));
    pedestal.position.set(facingDirX * cm(1), 0, 0);

    // Hollow oval bowl rim & seat ring via ExtrudeGeometry with inner elliptical hole!
    const rimShape = new THREE.Shape();
    rimShape.absellipse(0, 0, cm(23), cm(18.2), 0, Math.PI * 2, false, 0);
    const rimHole = new THREE.Path();
    rimHole.absellipse(facingDirX * cm(1.5), 0, cm(15.5), cm(12.2), 0, Math.PI * 2, true, 0);
    rimShape.holes.push(rimHole);
    const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
      depth: cm(6.5),
      bevelEnabled: true,
      bevelThickness: cm(0.8),
      bevelSize: cm(0.8),
      bevelSegments: 3,
      curveSegments: 24,
    });
    rimGeo.rotateX(Math.PI / 2);
    const bowlRim = new THREE.Mesh(rimGeo, mats.porcelainGloss);
    bowlRim.position.set(facingDirX * cm(4), cm(39.5), 0);

    const water = new THREE.Mesh(new THREE.CylinderGeometry(cm(13), cm(10), cm(0.5), 20), mats.waterSurface);
    water.scale.set(1.15, 1, 0.85);
    water.position.set(facingDirX * cm(5), cm(33.6), 0);

    // Soft-close seat ring + hinge barrels
    const seatGeo = new THREE.ExtrudeGeometry(rimShape, {
      depth: cm(1.6),
      bevelEnabled: true,
      bevelThickness: cm(0.45),
      bevelSize: cm(0.45),
      bevelSegments: 2,
      curveSegments: 24,
    });
    seatGeo.rotateX(Math.PI / 2);
    const seatRing = new THREE.Mesh(seatGeo, mats.porcelainGloss);
    seatRing.position.set(facingDirX * cm(4.2), cm(41.6), 0);
    for (const hz of [-cm(8), cm(8)]) {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.8), cm(0.8), cm(2.4), 10), mats.antiqueBrass);
      hinge.rotation.x = Math.PI / 2;
      hinge.position.set(-facingDirX * cm(11), cm(41.2), hz);
      t.add(hinge);
    }

    // Concentric Dual-Flush Brass Button + Angle Stop Supply Valve
    const flushOuter = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.4), cm(2.4), cm(0.8), 18), mats.antiqueBrass);
    flushOuter.position.set(-facingDirX * cm(21.5), cm(82.5), 0);
    const flushInner = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.2), cm(1.2), cm(1.1), 16), mats.porcelainGloss);
    flushInner.position.set(-facingDirX * cm(21.5), cm(82.7), 0);
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.9), cm(0.9), cm(5.5), 10), mats.antiqueBrass);
    valve.rotation.z = Math.PI / 2;
    valve.position.set(-facingDirX * cm(29), cm(18), cm(14));

    t.add(tank, lid, pedestal, bowlRim, water, seatRing, flushOuter, flushInner, valve);
    tagItem(t, '純白一體式鏤空內膽陶瓷馬桶', '真實內凹水封釉面盆體＋雙段式省水銅金按鍵＋緩降座圈與三角凡爾');
    return t;
  }

  // Helper: Country Bathroom Vanity with TRUE Cutout Marble Countertop, recessed basin, 3-Hole Brass Faucet & Towel Bar
  function makeBathVanity(w, d, wallAtEast, lightsReg, label) {
    const v = new THREE.Group();
    const h = cm(84);
    const sign = wallAtEast ? 1 : -1;

    // Hollow-top cabinet walls so undermount basin is cleanly recessed inside!
    const cabH = h - cm(12);
    const pBack = new THREE.Mesh(new THREE.BoxGeometry(cm(2.2), cabH, d - cm(2)), mats.creamShaker);
    pBack.position.set(sign * (w / 2 - cm(2)), cabH / 2 + cm(8), 0);
    const pFrontLow = new THREE.Mesh(new THREE.BoxGeometry(cm(2.2), cabH - cm(16), d - cm(2)), mats.creamShaker);
    pFrontLow.position.set(-sign * (w / 2 - cm(1.5)), (cabH - cm(16)) / 2 + cm(8), 0);
    const pSideN = new THREE.Mesh(new THREE.BoxGeometry(w - cm(2), cabH, cm(2.4)), mats.creamShaker);
    pSideN.position.set(0, cabH / 2 + cm(8), -d / 2 + cm(2.2));
    const pSideS = pSideN.clone();
    pSideS.position.z = d / 2 - cm(2.2);
    const pBot = new THREE.Mesh(new THREE.BoxGeometry(w - cm(2), cm(2.5), d - cm(2)), mats.creamShaker);
    pBot.position.set(0, cm(9.2), 0);
    v.add(pBack, pFrontLow, pSideN, pSideS, pBot);

    for (const [lx, lz] of [
      [-w / 2 + cm(4), -d / 2 + cm(4)],
      [w / 2 - cm(4), -d / 2 + cm(4)],
      [-w / 2 + cm(4), d / 2 - cm(4)],
      [w / 2 - cm(4), d / 2 - cm(4)],
    ]) {
      const leg = createTurnedLeg(cm(10), cm(2.1), mats.creamShaker);
      leg.position.set(lx, 0, lz);
      v.add(leg);
    }

    const falseDrw = createDrawerFront(d - cm(6), cm(13.5), mats, true);
    falseDrw.rotation.y = -sign * (Math.PI / 2);
    falseDrw.position.set(-sign * (w / 2), h - cm(11.5), 0);
    const door = createShakerDoorFace(d - cm(6), h - cm(34), mats, { knobSide: 'right', knobYRatio: 0.78 });
    door.rotation.y = -sign * (Math.PI / 2);
    door.position.set(-sign * (w / 2), cm(35), 0);
    v.add(falseDrw, door);

    // Calacatta Marble Countertop with TRUE Elliptical Undermount Cutout Hole + Backsplash Lip!
    const topW = w + cm(2.5), topD = d + cm(2.5);
    const topShape = new THREE.Shape();
    topShape.moveTo(-topW / 2, -topD / 2);
    topShape.lineTo(topW / 2, -topD / 2);
    topShape.lineTo(topW / 2, topD / 2);
    topShape.lineTo(-topW / 2, topD / 2);
    topShape.closePath();

    const sinkCx = -sign * cm(3.0);
    const holePath = new THREE.Path();
    holePath.absellipse(sinkCx, 0, cm(15.2), cm(20.5), 0, Math.PI * 2, true, 0);
    topShape.holes.push(holePath);

    const topGeo = new THREE.ExtrudeGeometry(topShape, {
      depth: cm(3.0),
      bevelEnabled: true,
      bevelThickness: cm(0.35),
      bevelSize: cm(0.35),
      bevelSegments: 2,
      curveSegments: 28,
    });
    topGeo.rotateX(Math.PI / 2);
    const topMesh = new THREE.Mesh(topGeo, mats.marbleTop);
    topMesh.position.set(0, h, 0);
    const splash = new THREE.Mesh(new THREE.BoxGeometry(cm(1.8), cm(9.5), topD), mats.marbleTop);
    splash.position.set(sign * (w / 2 - cm(0.9)), h + cm(4.75), 0);

    // Recessed Porcelain Undermount Basin Bowl + Brass Pop-Up Drain & Overflow Hole!
    const bowlWall = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(16.2), cm(12.5), cm(15), 28, 1, true),
      mats.porcelainGloss
    );
    bowlWall.material.side = THREE.DoubleSide;
    bowlWall.scale.set(0.96, 1, 1.3);
    bowlWall.position.set(sinkCx, h - cm(9.5), 0);
    const bowlBot = new THREE.Mesh(new THREE.CylinderGeometry(cm(12.6), cm(12.6), cm(1.5), 28), mats.porcelainGloss);
    bowlBot.scale.set(0.96, 1, 1.3);
    bowlBot.position.set(sinkCx, h - cm(17.0), 0);
    const popDrain = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.2), cm(2.2), cm(0.8), 16), mats.antiqueBrass);
    popDrain.position.set(sinkCx, h - cm(16.1), 0);
    v.add(topMesh, splash, bowlWall, bowlBot, popDrain);

    // 3-Hole Antique Brass Widespread Gooseneck Faucet + Hot/Cold Cross Handles
    const fx = sign * (w / 2 - cm(6.5));
    const fCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(fx, h + cm(0.2), 0),
      new THREE.Vector3(fx, h + cm(12.5), 0),
      new THREE.Vector3(fx - sign * cm(6.5), h + cm(15.2), 0),
      new THREE.Vector3(fx - sign * cm(11.5), h + cm(9.5), 0),
    ]);
    const fSpout = new THREE.Mesh(new THREE.TubeGeometry(fCurve, 20, cm(0.78), 10, false), mats.antiqueBrass);
    for (const hz of [-cm(10), cm(10)]) {
      const hBase = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.2), cm(1.6), cm(3.8), 14), mats.antiqueBrass);
      hBase.position.set(fx, h + cm(2.0), hz);
      const hCross = new THREE.Mesh(new THREE.BoxGeometry(cm(4.8), cm(0.65), cm(1.0)), mats.antiqueBrass);
      hCross.position.set(fx, h + cm(4.2), hz);
      v.add(hBase, hCross);
    }

    // Countertop Soap Dispenser & Ceramic Toothbrush Tumbler
    const soap = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.6), cm(2.9), cm(10.5), 14), mats.amberGlass);
    soap.position.set(fx - sign * cm(2), h + cm(5.4), -cm(23));
    const tumbler = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.8), cm(2.4), cm(8.8), 14), mats.porcelainGloss);
    tumbler.position.set(fx - sign * cm(2), h + cm(4.5), cm(23));
    v.add(fSpout, soap, tumbler);

    // Beveled Arched Brass Mirror + Swan-Neck Milk-Glass Sconce
    const mirRing = new THREE.Mesh(new THREE.TorusGeometry(cm(22.5), cm(1.3), 12, 32), mats.antiqueBrass);
    mirRing.rotation.y = Math.PI / 2;
    mirRing.scale.set(0.92, 1.32, 1);
    mirRing.position.set(sign * (w / 2 - cm(1.2)), cm(142), 0);
    const mirGlass = new THREE.Mesh(new THREE.CylinderGeometry(cm(22), cm(22), cm(1.6), 32), mats.mirror);
    mirGlass.rotation.z = Math.PI / 2;
    mirGlass.scale.set(1.32, 1, 0.92);
    mirGlass.position.set(sign * (w / 2 - cm(1.0)), cm(142), 0);

    const scRos = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.2), cm(3.5), cm(1.2), 16), mats.antiqueBrass);
    scRos.rotation.z = Math.PI / 2;
    scRos.position.set(sign * (w / 2 - cm(0.6)), cm(185), 0);
    const scArm = new THREE.Mesh(new THREE.TorusGeometry(cm(4.2), cm(0.5), 8, 16, Math.PI), mats.antiqueBrass);
    scArm.rotation.y = sign > 0 ? Math.PI : 0;
    scArm.position.set(sign * (w / 2 - cm(4.8)), cm(185), 0);
    const scMat = mats.milkGlassLamp.clone();
    const sconce = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.5), cm(7.2), cm(9.5), 20, 1, true), scMat);
    sconce.material.side = THREE.DoubleSide;
    sconce.position.set(sign * (w / 2 - cm(9.0)), cm(181), 0);
    const scLight = new THREE.PointLight(0xffd79b, 0.45, 2.8, 1.8);
    scLight.position.set(-sign * cm(10), cm(175), 0);
    if (lightsReg) {
      lightsReg.push({ light: scLight, mat: scMat, baseIntensity: 0.85 });
    }

    v.add(mirRing, mirGlass, scRos, scArm, sconce, scLight);
    tagItem(v, label, `${Math.round(w * 100)} × ${Math.round(d * 100)} cm｜真開孔卡拉卡塔石紋檯面＋橢圓下嵌陶瓷盆＋三孔復古銅金龍頭與壁燈`);
    return v;
  }

  // --- Guest Bathroom (NW: X = 109..258, Z = 15..259) ---
  // Linear Stainless Trench Drain + Frameless Glass Enclosure with Clamps & Pull Handle + Exposed Rain Shower & Hose
  const trenchDrain = new THREE.Mesh(new THREE.BoxGeometry(cm(68), cm(0.4), cm(5.5)), mats.stainlessSteel);
  trenchDrain.position.set(cm(165), -cm(1.5), cm(30));
  const showerCurb = new THREE.Mesh(new THREE.BoxGeometry(cm(109), cm(5.2), cm(6.2)), mats.marbleTop);
  showerCurb.position.set(cm(163.5), cm(2.6), cm(103));
  const showerScreen = new THREE.Mesh(new THREE.BoxGeometry(cm(71.5), cm(200), cm(1.2)), mats.clearGlass);
  showerScreen.position.set(cm(182.2), cm(105), cm(103));
  const showerDoor = new THREE.Mesh(new THREE.BoxGeometry(cm(36.5), cm(200), cm(1.2)), mats.clearGlass);
  showerDoor.position.set(cm(127.5), cm(105), cm(103));
  const showerBar = new THREE.Mesh(new THREE.BoxGeometry(cm(109), cm(2.2), cm(2.5)), mats.antiqueBrass);
  showerBar.position.set(cm(163.5), cm(205), cm(103));
  // Brass glass hinges & vertical tubular pull handle on shower door
  for (const hy of [cm(38), cm(175)]) {
    const gHinge = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), cm(5.5), cm(2.4)), mats.antiqueBrass);
    gHinge.position.set(cm(110.8), hy, cm(103));
    zone.add(gHinge);
  }
  const sPull = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.75), cm(36), 12), mats.antiqueBrass);
  sPull.position.set(cm(141), cm(105), cm(105.2));

  // Exposed Brass Thermostatic Rain Shower Column + Handheld Wand & Draped Hose + Corner Marble Shelf & Bottles
  const riser = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.85), cm(0.85), cm(105), 12), mats.antiqueBrass);
  riser.position.set(cm(214), cm(158), cm(58));
  const gooseneckTop = new THREE.Mesh(new THREE.TorusGeometry(cm(9.5), cm(0.85), 8, 16, Math.PI), mats.antiqueBrass);
  gooseneckTop.position.set(cm(204.5), cm(210), cm(58));
  const rainHead = new THREE.Mesh(new THREE.CylinderGeometry(cm(12), cm(12), cm(1.4), 24), mats.antiqueBrass);
  rainHead.position.set(cm(195), cm(207), cm(58));
  const mixer = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.2), cm(2.2), cm(22), 14), mats.antiqueBrass);
  mixer.rotation.x = Math.PI / 2;
  mixer.position.set(cm(214.5), cm(108), cm(58));
  // Handheld shower wand + flexible draped brass hose
  const handWand = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.4), cm(0.9), cm(18), 12), mats.porcelainGloss);
  handWand.position.set(cm(212), cm(138), cm(46));
  handWand.rotation.z = 0.22;
  const hoseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(cm(214), cm(106), cm(54)),
    new THREE.Vector3(cm(212), cm(84), cm(50)),
    new THREE.Vector3(cm(212), cm(129), cm(46)),
  ]);
  const hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 18, cm(0.48), 8, false), mats.antiqueBrass);
  // Corner toiletries shelf + 3 amber bottles
  const cShelf = new THREE.Mesh(new THREE.BoxGeometry(cm(22), cm(1.6), cm(14)), mats.marbleTop);
  cShelf.position.set(cm(120), cm(124), cm(22));
  for (let b = 0; b < 3; b++) {
    const bot = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.2), cm(2.2), cm(11 - b * 1.2), 12), mats.amberGlass);
    bot.position.set(cm(114 + b * 6), cm(130.3 - b * 0.6), cm(22));
    zone.add(bot);
  }
  zone.add(
    trenchDrain, showerCurb, showerScreen, showerDoor, showerBar, sPull,
    riser, gooseneckTop, rainHead, mixer, handWand, hose, cShelf
  );

  const guestToilet = makeToilet(-1);
  guestToilet.position.set(cm(226), 0, cm(146));
  const guestVanity = makeBathVanity(cm(58), cm(66), true, lightsRegistry, '客浴純白鄉村風真開孔洗手台浴櫃');
  guestVanity.position.set(cm(229), 0, cm(225));
  // Wall towel bar + folded waffle bath towel on West wall of Guest Bath
  const gTowelBar = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.55), cm(0.55), cm(52), 10), mats.antiqueBrass);
  gTowelBar.rotation.x = Math.PI / 2;
  gTowelBar.position.set(cm(112.5), cm(118), cm(175));
  const gTowel = createRoundedSlab(cm(3.2), cm(42), cm(34), cm(1.5), mats.crispWhiteLinen, cm(0.6));
  gTowel.position.set(cm(112.5), cm(84), cm(175));
  zone.add(guestToilet, guestVanity, gTowelBar, gTowel);

  // --- Master En-Suite Bathroom (X = 269..418, Z = 15..259) ---
  // Coffered Alcove Bathtub (149 x 75 cm) with Sloped Interior Backrest, Roman Tub Filler, Oak Caddy & Bath Mat
  const tubGroup = new THREE.Group();
  tubGroup.position.set(cm(343.5), 0, cm(52.5));
  const tubDeckH = cm(56);
  const tubApron = new THREE.Mesh(new THREE.BoxGeometry(cm(149), tubDeckH - cm(6), cm(3.5)), mats.beadboardFine);
  tubApron.position.set(0, (tubDeckH - cm(6)) / 2 + cm(4), cm(35.5));
  const tubToe = new THREE.Mesh(new THREE.BoxGeometry(cm(149), cm(5), cm(4)), mats.whiteTrim);
  tubToe.position.set(0, cm(2.5), cm(34));
  for (const px of [-cm(46), cm(46)]) {
    const rp = createRaisedPanel(cm(46), cm(34), cm(4.6), mats.creamShaker, cm(2.2));
    rp.position.set(px, cm(29), cm(35.8));
    tubGroup.add(rp);
  }
  const rimN = new THREE.Mesh(new THREE.BoxGeometry(cm(149), tubDeckH, cm(9.5)), mats.marbleTop);
  rimN.position.set(0, tubDeckH / 2, -cm(32.8));
  const rimS = rimN.clone();
  rimS.position.z = cm(32.8);
  const rimW = new THREE.Mesh(new THREE.BoxGeometry(cm(12.5), tubDeckH, cm(56)), mats.marbleTop);
  rimW.position.set(-cm(68.25), tubDeckH / 2, 0);
  const rimE = rimW.clone();
  rimE.position.x = cm(68.25);
  // Sloped ergonomic backrest at East end + glazed porcelain floor + brass overflow & pop-up drain
  const backrest = new THREE.Mesh(new THREE.BoxGeometry(cm(22), cm(46), cm(55)), mats.porcelainGloss);
  backrest.position.set(cm(56), cm(25), 0);
  backrest.rotation.z = 0.28;
  const tubFloor = new THREE.Mesh(new THREE.BoxGeometry(cm(126), cm(8), cm(56)), mats.porcelainGloss);
  tubFloor.position.set(0, cm(4), 0);
  const tubDrain = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.8), cm(2.8), cm(0.7), 18), mats.antiqueBrass);
  tubDrain.position.set(-cm(46), cm(8.35), 0);
  const overflow = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.4), cm(2.4), cm(0.8), 16), mats.antiqueBrass);
  overflow.rotation.z = Math.PI / 2;
  overflow.position.set(-cm(61.8), cm(42), 0);

  // Wall-Mounted Roman Brass Tub Spout + Hot/Cold Cross Valves + Porcelain Hand Shower
  const tubSpout = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.3), cm(1.6), cm(16), 14), mats.antiqueBrass);
  tubSpout.rotation.z = Math.PI / 2;
  tubSpout.position.set(-cm(66), tubDeckH + cm(8), 0);
  for (const vz of [-cm(11), cm(11)]) {
    const vStem = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.2), cm(1.5), cm(5), 12), mats.antiqueBrass);
    vStem.rotation.z = Math.PI / 2;
    vStem.position.set(-cm(71), tubDeckH + cm(8), vz);
    const vCross = new THREE.Mesh(new THREE.BoxGeometry(cm(0.8), cm(5.2), cm(1.0)), mats.antiqueBrass);
    vCross.position.set(-cm(68), tubDeckH + cm(8), vz);
    tubGroup.add(vStem, vCross);
  }

  // Slatted Solid-Oak Bath Caddy Tray + Open Book + Scented Candle + Waffle Cotton Bath Mat on Floor!
  const caddy = createRoundedSlab(cm(23), cm(74.5), cm(2.0), cm(2), mats.naturalOak, cm(0.35));
  caddy.position.set(cm(12), tubDeckH + cm(0.2), 0);
  const caddyBook = createHardcoverBook(cm(1.8), cm(13), cm(18), mats.crispWhiteLinen, mats.warmCreamFabric);
  caddyBook.rotation.z = Math.PI / 2;
  caddyBook.position.set(cm(12), tubDeckH + cm(3.1), cm(8));
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.4), cm(3.4), cm(7.2), 16), mats.amberGlass);
  candle.position.set(cm(12), tubDeckH + cm(5.8), -cm(16));
  const bathMat = createRoundedSlab(cm(72), cm(44), cm(1.1), cm(3), mats.crispWhiteLinen, cm(0.35));
  bathMat.position.set(cm(8), -cm(0.2), cm(62));

  tubGroup.add(
    tubApron, tubToe, rimN, rimS, rimW, rimE, backrest, tubFloor,
    tubDrain, overflow, tubSpout, caddy, caddyBook, candle, bathMat
  );
  tagItem(tubGroup, '主衛嵌入式立體線板浴缸＆泡澡木盤', '149 × 75 cm｜凸芯線板裙邊＋石材檯面＋人體工學斜靠背＋三孔銅金浴缸龍頭＋白橡木托盤');
  zone.add(tubGroup);

  const masterToilet = makeToilet(1);
  masterToilet.position.set(cm(301), 0, cm(135));
  // Brass Toilet Paper Holder + White Roll next to Master Toilet
  const tpRoll = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.2), cm(5.2), cm(11), 18), mats.crispWhiteLinen);
  tpRoll.position.set(cm(275), cm(66), cm(164));
  tpRoll.rotation.x = Math.PI / 2;
  const masterVanity = makeBathVanity(cm(58), cm(68), false, lightsRegistry, '主衛純白鄉村風真開孔洗手台浴櫃');
  masterVanity.position.set(cm(298), 0, cm(224));
  zone.add(masterToilet, tpRoll, masterVanity);

  enableShadows(zone, true, true);
  return zone;
}

// 7. SW Utility Balcony (Stacked Washer/Dryer + Washboard Sink + Drying Rack + NW Greenery) & 2 Exterior AC Units
export function createUtilityBalconyZone(mats) {
  const zone = new THREE.Group();

  // A. Stacked Front-Load Washer & Heat-Pump Dryer Tower with Pull-Out Folding Shelf, LED Panel & Inner Stainless Drum!
  const laundry = new THREE.Group();
  laundry.position.set(cm(218), 0, cm(702));
  for (let tier = 0; tier < 2; tier++) {
    const wy = tier * cm(87);
    const box = createRoundedSlab(cm(60), cm(60), cm(84), cm(3), mats.creamShaker, cm(0.5));
    box.position.y = wy;

    // Top-left detergent dispenser drawer seam + Top-center rotary program dial + Top-right digital LED display
    const dispDrw = new THREE.Mesh(new THREE.BoxGeometry(cm(0.8), cm(9.5), cm(17)), mats.whiteTrim);
    dispDrw.position.set(-cm(30.2), wy + cm(75), -cm(18));
    const progDial = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.4), cm(2.6), cm(1.8), 18), mats.antiqueBrass);
    progDial.rotation.z = Math.PI / 2;
    progDial.position.set(-cm(30.6), wy + cm(75), 0);
    const ledPanel = new THREE.Mesh(new THREE.BoxGeometry(cm(0.6), cm(5.5), cm(16)), mats.digitalLed);
    ledPanel.position.set(-cm(30.2), wy + cm(75), cm(16));

    // Recessed Perforated Stainless-Steel Inner Drum + 3 Tumbling Lifter Baffles + Concave Glass Porthole!
    const innerDrum = new THREE.Mesh(new THREE.CylinderGeometry(cm(16.5), cm(16.5), cm(8), 24), mats.stainlessSteel);
    innerDrum.rotation.z = Math.PI / 2;
    innerDrum.position.set(-cm(26.5), wy + cm(40), 0);
    const drumFrame = new THREE.Mesh(new THREE.TorusGeometry(cm(17.8), cm(2.3), 12, 28), mats.antiqueBrass);
    drumFrame.rotation.y = Math.PI / 2;
    drumFrame.position.set(-cm(30.6), wy + cm(40), 0);
    const drumGlass = new THREE.Mesh(
      new THREE.SphereGeometry(cm(16.2), 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.36),
      mats.darkApplianceGlass
    );
    drumGlass.rotation.z = -Math.PI / 2;
    drumGlass.position.set(-cm(32.5), wy + cm(40), 0);
    const doorHinge = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), cm(10), cm(3.2)), mats.antiqueBrass);
    doorHinge.position.set(-cm(30.5), wy + cm(40), -cm(19));

    laundry.add(box, dispDrw, progDial, ledPanel, innerDrum, drumFrame, drumGlass, doorHinge);
  }
  // Middle Pull-Out Stacking Kit Shelf between Washer and Dryer
  const midStackShelf = createRoundedSlab(cm(61), cm(61), cm(3.0), cm(2), mats.naturalOak, cm(0.35));
  midStackShelf.position.y = cm(84);
  laundry.add(midStackShelf);

  // Woven Rattan Laundry Hamper with Linen Liner beside Washer Tower
  const hamper = new THREE.Mesh(new THREE.CylinderGeometry(cm(18), cm(15), cm(46), 22), mats.rattan);
  hamper.position.set(cm(212), cm(23), cm(762));
  const hamperLiner = new THREE.Mesh(new THREE.TorusGeometry(cm(17.8), cm(2.0), 10, 22), mats.crispWhiteLinen);
  hamperLiner.rotation.x = Math.PI / 2;
  hamperLiner.position.set(cm(212), cm(46), cm(762));
  zone.add(hamper, hamperLiner);

  tagItem(laundry, '工作陽台純白數位洗脫烘衣塔', '60 × 60 × 171 cm｜內層不鏽鋼滾筒＋旋鈕與數位面板＋實木抽拉摺衣層板＋藤編洗衣籃');
  zone.add(laundry);

  // B. Country Utility Ceramic Washboard Sink & Louvered Cabinet (True Hollow Basin + Ribbed Washboard + Drain!)
  const sinkUnit = new THREE.Group();
  sinkUnit.position.set(cm(52), 0, cm(768));
  const sCab = new THREE.Mesh(new THREE.BoxGeometry(cm(54), cm(68), cm(48)), mats.warmIvoryCabinet);
  sCab.position.y = cm(34);
  for (const dx of [-cm(13), cm(13)]) {
    const ld = createShakerDoorFace(cm(25), cm(62), mats, { louver: true, knobSide: dx < 0 ? 'right' : 'left' });
    ld.rotation.y = Math.PI;
    ld.position.set(dx, cm(35), -cm(24.5));
    sinkUnit.add(ld);
  }
  // Hollow ceramic basin walls + floor + brass strainer drain + angled ribbed scrubbing board
  const sFloor = new THREE.Mesh(new THREE.BoxGeometry(cm(54), cm(3), cm(48)), mats.porcelainGloss);
  sFloor.position.y = cm(69.5);
  const sWallL = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), cm(17), cm(50)), mats.porcelainGloss);
  sWallL.position.set(-cm(25.75), cm(78.5), 0);
  const sWallR = sWallL.clone();
  sWallR.position.x = cm(25.75);
  const sWallFront = new THREE.Mesh(new THREE.BoxGeometry(cm(47), cm(17), cm(4.5)), mats.porcelainGloss);
  sWallFront.position.set(0, cm(78.5), -cm(22.75));
  const sWallBack = new THREE.Mesh(new THREE.BoxGeometry(cm(47), cm(17), cm(7.5)), mats.porcelainGloss);
  sWallBack.position.set(0, cm(78.5), cm(21.25));
  const sDrain = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.6), cm(2.6), cm(0.6), 16), mats.antiqueBrass);
  sDrain.position.set(cm(6), cm(71.2), cm(4));
  // Angled ribbed ceramic washboard inside front half of basin
  const wbSlope = new THREE.Mesh(new THREE.BoxGeometry(cm(22), cm(1.8), cm(19)), mats.porcelainGloss);
  wbSlope.position.set(-cm(11), cm(78.0), -cm(11.5));
  wbSlope.rotation.x = -0.46;
  for (let r = 0; r < 6; r++) {
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.45), cm(20), 8), mats.whiteTrim);
    rib.rotation.z = Math.PI / 2;
    rib.position.set(-cm(11), cm(81.6) - r * cm(1.25), -cm(17.5) + r * cm(2.4));
    sinkUnit.add(rib);
  }
  const uFaucet = new THREE.Mesh(new THREE.TorusGeometry(cm(6.5), cm(0.7), 8, 16, Math.PI), mats.antiqueBrass);
  uFaucet.rotation.y = Math.PI / 2;
  uFaucet.position.set(cm(6), cm(93.5), cm(14));
  const uPost = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.1), cm(1.3), cm(7.5), 10), mats.antiqueBrass);
  uPost.position.set(cm(6), cm(90.2), cm(20.5));
  sinkUnit.add(sCab, sFloor, sWallL, sWallR, sWallFront, sWallBack, sDrain, wbSlope, uFaucet, uPost);
  tagItem(sinkUnit, '工作陽台立體鏤空搓衣板陶瓷洗衣槽', '56 × 50 cm｜真實深槽＋斜紋陶瓷手洗搓衣板＋百葉收納底櫃＋鵝頸銅龍頭');
  zone.add(sinkUnit);

  // C. Overhead Balcony Clothes Drying Pole with Wooden Hangers & Crisp White Linen Shirts
  const dryPole = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.0), cm(1.0), cm(128), 12), mats.antiqueBrass);
  dryPole.rotation.z = Math.PI / 2;
  dryPole.position.set(cm(132), cm(214), cm(736));
  for (const sx of [cm(78), cm(186)]) {
    const rodDrop = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.45), cm(68), 8), mats.antiqueBrass);
    rodDrop.position.set(sx, cm(248), cm(736));
    zone.add(rodDrop);
  }
  for (let h = 0; h < 3; h++) {
    const hx = cm(106 + h * 24);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(cm(1.8), cm(0.22), 6, 12, Math.PI * 1.3), mats.antiqueBrass);
    hook.position.set(hx, cm(213), cm(736));
    const hanger = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(2.2), cm(38)), mats.naturalOak);
    hanger.position.set(hx, cm(208.5), cm(736));
    const shirt = createRoundedSlab(cm(3.2), cm(39), cm(52), cm(4), h === 1 ? mats.oatmealLinen : mats.crispWhiteLinen, cm(1.0));
    shirt.position.set(hx, cm(156), cm(736));
    zone.add(hook, hanger, shirt);
  }
  zone.add(dryPole);

  // D. Potted Balcony Herbs + NW Architectural Planter Recess Greenery (X = 54, Z = 120..215)
  const balconyPlant = createPottedPlant(mats, cm(82), cm(14.5));
  balconyPlant.position.set(cm(118), 0, cm(772));
  const nwTree1 = createPottedPlant(mats, cm(115), cm(18));
  nwTree1.position.set(cm(54), 0, cm(208));
  const nwTree2 = createPottedPlant(mats, cm(88), cm(15));
  nwTree2.position.set(cm(52), 0, cm(140));
  zone.add(balconyPlant, nwTree1, nwTree2);

  // E. 2 Exterior Split-System AC Condenser Units on Steel Wall Brackets with 3-Blade Axial Fans & Copper Piping!
  for (const acX of [cm(88), cm(186)]) {
    const ac = new THREE.Group();
    ac.position.set(acX, cm(22), cm(832));

    // Heavy-duty L-shaped wall mounting steel brackets bolted to South parapet
    for (const bx of [-cm(28), cm(28)]) {
      const vArm = new THREE.Mesh(new THREE.BoxGeometry(cm(3.2), cm(42), cm(2.5)), mats.castIronDark);
      vArm.position.set(bx, -cm(4), -cm(15.5));
      const hArm = new THREE.Mesh(new THREE.BoxGeometry(cm(3.2), cm(2.8), cm(34)), mats.castIronDark);
      hArm.position.set(bx, -cm(1.4), cm(0));
      const strut = new THREE.Mesh(new THREE.BoxGeometry(cm(2.4), cm(30), cm(1.8)), mats.castIronDark);
      strut.position.set(bx, -cm(12), -cm(6));
      strut.rotation.x = 0.72;
      ac.add(vArm, hArm, strut);
    }

    const casing = createRoundedSlab(cm(78), cm(30), cm(58), cm(2.5), mats.warmIvoryCabinet, cm(0.45));
    const topCap = createRoundedSlab(cm(79.5), cm(31.5), cm(2.2), cm(2.6), mats.whiteTrim, cm(0.35));
    topCap.position.y = cm(57.2);

    // Recessed Dark Shroud + 3-Blade Aerodynamic Axial Fan + Protective Grille Bars!
    const shroud = new THREE.Mesh(new THREE.CylinderGeometry(cm(21), cm(21), cm(4), 28), mats.castIronDark);
    shroud.rotation.x = Math.PI / 2;
    shroud.position.set(-cm(10), cm(29), cm(13.8));
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.5), cm(4.2), cm(4.5), 16), mats.stainlessSteel);
    fanHub.rotation.x = Math.PI / 2;
    fanHub.position.set(-cm(10), cm(29), cm(14.2));
    for (let b = 0; b < 3; b++) {
      const ba = (b / 3) * Math.PI * 2 + 0.4;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(cm(8.5), cm(13.2), cm(0.45)), mats.stainlessSteel);
      blade.position.set(-cm(10) + Math.cos(ba) * cm(9.5), cm(29) + Math.sin(ba) * cm(9.5), cm(13.6));
      blade.rotation.z = ba - Math.PI / 2;
      blade.rotation.y = 0.26;
      ac.add(blade);
    }
    for (let g = -5; g <= 5; g++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(cm(43), cm(0.65), cm(0.8)), mats.whiteTrim);
      bar.position.set(-cm(10), cm(29) + g * cm(3.8), cm(15.6));
      ac.add(bar);
    }
    const grilleRing = new THREE.Mesh(new THREE.TorusGeometry(cm(21.2), cm(0.8), 10, 28), mats.whiteTrim);
    grilleRing.position.set(-cm(10), cm(29), cm(15.5));

    // Right-side valve cover + Insulated copper refrigerant line entering parapet wall
    const valveBox = createRoundedSlab(cm(6.5), cm(14), cm(22), cm(1.5), mats.warmIvoryCabinet, cm(0.3));
    valveBox.position.set(cm(40.5), cm(12), cm(2));
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cm(41), cm(14), -cm(2)),
      new THREE.Vector3(cm(43), cm(14), -cm(12)),
      new THREE.Vector3(cm(38), cm(24), -cm(17)),
    ]);
    const copperLine = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 12, cm(1.4), 8, false), mats.oatmealLinen);

    ac.add(casing, topCap, shroud, fanHub, grilleRing, valveBox, copperLine);
    tagItem(ac, '分離式冷氣室外機（含三葉渦流風扇、冷媒管與三角鐵架）', '依原始平面圖位置配置於西南工作陽台女兒牆外側支架');
    zone.add(ac);
  }

  enableShadows(zone, true, true);
  return zone;
}
