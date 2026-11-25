import * as THREE from 'three';
import {
  cm,
  tagItem,
  enableShadows,
  createRoundedSlab,
  createTurnedLeg,
  createHardcoverBook,
  createShakerDoorFace,
  createDrawerFront,
  createCountryPillow,
  createWindsorChair,
  createCountryDiningChair,
  createPottedPlant,
} from './primitives.js';

// 1. Entryway 240 x 35 cm White Country Shoe & Display Cabinet (玄關端景收納高櫃 — 極精細升級版)
export function createEntrywayShoeCabinet(mats, lightsRegistry) {
  const g = new THREE.Group();
  const W = cm(240);
  const D = cm(35);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(W - cm(6), cm(3.8), D - cm(7)), mats.whiteTrim);
  plinth.position.set(0, cm(16.1), -cm(1.8));
  const toeLed = new THREE.Mesh(new THREE.BoxGeometry(W - cm(24), cm(0.6), cm(1.2)), mats.warmBulbEmissive);
  toeLed.position.set(0, cm(14.0), cm(9.5));
  g.add(plinth, toeLed);

  // 3 Pairs of Sculpted Everyday Shoes in Floating Bottom Bay (Leather Loafers, Sneakers, Woven Mules)
  const shoeConfigs = [
    { x: -cm(76), style: 'loafer', mat: mats.warmWalnutAccent },
    { x: -cm(38), style: 'sneaker', mat: mats.creamShaker },
    { x: cm(2), style: 'mule', mat: mats.oatmealLinen },
  ];
  for (const cfg of shoeConfigs) {
    for (const side of [-1, 1]) {
      const sh = new THREE.Group();
      sh.position.set(cfg.x + side * cm(5.8), 0, cm(2));
      sh.rotation.y = side * 0.04;
      const sole = createRoundedSlab(cm(9.2), cm(24.5), cm(1.4), cm(4.2), mats.rubberGasket, cm(0.25));
      const heel = createRoundedSlab(cm(8.6), cm(7.2), cm(1.2), cm(3.2), mats.rubberGasket, cm(0.2));
      heel.position.set(0, cm(0.1), -cm(8.2));
      const vamp = createRoundedSlab(cm(8.6), cm(15.5), cm(5.4), cm(4.0), cfg.mat, cm(1.4));
      vamp.position.set(0, cm(1.4), cm(3.2));
      sh.add(sole, heel, vamp);

      if (cfg.style === 'loafer') {
        const quarter = createRoundedSlab(cm(8.4), cm(11.0), cm(5.8), cm(3.6), cfg.mat, cm(0.8));
        quarter.position.set(0, cm(1.4), -cm(6.2));
        const opening = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.1), cm(2.8), cm(2.2), 14), mats.castIronDark);
        opening.scale.set(0.9, 1, 1.35);
        opening.position.set(0, cm(6.3), -cm(5.5));
        const bit = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.22), cm(0.22), cm(5.6), 8), mats.antiqueBrass);
        bit.rotation.z = Math.PI / 2;
        bit.position.set(0, cm(6.9), cm(1.2));
        sh.add(quarter, opening, bit);
      } else if (cfg.style === 'sneaker') {
        const collar = createRoundedSlab(cm(8.6), cm(11.5), cm(6.4), cm(3.8), mats.pureMatteWhite, cm(0.9));
        collar.position.set(0, cm(1.4), -cm(6.0));
        const toeCap = createRoundedSlab(cm(8.7), cm(6.5), cm(3.8), cm(3.8), mats.pureMatteWhite, cm(1.1));
        toeCap.position.set(0, cm(1.4), cm(8.0));
        for (let l = 0; l < 3; l++) {
          const lace = new THREE.Mesh(new THREE.BoxGeometry(cm(4.6), cm(0.35), cm(0.65)), mats.crispWhiteLinen);
          lace.position.set(0, cm(6.85), cm(0.5 + l * 1.6));
          sh.add(lace);
        }
        sh.add(collar, toeCap);
      } else {
        const strap = createRoundedSlab(cm(8.8), cm(8.5), cm(4.8), cm(2.5), mats.rattan, cm(0.9));
        strap.position.set(0, cm(2.2), cm(0.5));
        sh.add(strap);
      }
      g.add(sh);
    }
  }

  const lowH = cm(78);
  const lowBody = new THREE.Mesh(new THREE.BoxGeometry(W, lowH, D - cm(2)), mats.warmIvoryCabinet);
  lowBody.position.set(0, cm(18) + lowH / 2, -cm(1));
  g.add(lowBody);

  const doorW = (W - cm(6)) / 4;
  for (let i = 0; i < 4; i++) {
    const dx = -W / 2 + cm(3) + doorW * (i + 0.5);
    const door = createShakerDoorFace(doorW - cm(0.6), lowH - cm(4), mats, {
      louver: true,
      knobSide: i % 2 === 0 ? 'right' : 'left',
      knobYRatio: 0.78,
    });
    door.position.set(dx, cm(18) + lowH / 2, D / 2 - cm(1));
    g.add(door);
  }

  // Middle Open Country Display Niche (y = 96..144 cm)
  const counterTop = createRoundedSlab(W + cm(2.4), D + cm(2.8), cm(3.2), cm(1.5), mats.naturalOak, cm(0.5));
  counterTop.position.set(0, cm(96), cm(0.6));
  const nicheBack = new THREE.Mesh(new THREE.BoxGeometry(W - cm(4), cm(46), cm(2)), mats.beadboard);
  nicheBack.position.set(0, cm(121), -D / 2 + cm(2));
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(cm(3), cm(46), D - cm(2)), mats.creamShaker);
  sideL.position.set(-W / 2 + cm(1.5), cm(121), -cm(1));
  const sideR = sideL.clone();
  sideR.position.x = W / 2 - cm(1.5);
  g.add(counterTop, nicheBack, sideL, sideR);

  // Rattan Key Tray + Brass Keys & Leather Fob + Reed Diffuser + Pitcher Vase + Hardcover Books
  const trayX = -cm(66), trayZ = cm(2);
  const trayRim = createRoundedSlab(cm(31.5), cm(20.5), cm(3.0), cm(5.0), mats.rattan, cm(0.6));
  trayRim.position.set(trayX, cm(99.2), trayZ);
  const keyFob = createRoundedSlab(cm(3.2), cm(6.5), cm(0.7), cm(1.4), mats.warmWalnutAccent, cm(0.2));
  keyFob.position.set(trayX - cm(4), cm(102.3), trayZ);
  keyFob.rotation.y = 0.35;
  const keyRing = new THREE.Mesh(new THREE.TorusGeometry(cm(1.3), cm(0.18), 8, 16), mats.antiqueBrass);
  keyRing.rotation.x = Math.PI / 2;
  keyRing.position.set(trayX, cm(102.5), trayZ + cm(1.8));
  for (let k = 0; k < 2; k++) {
    const kBlade = new THREE.Mesh(new THREE.BoxGeometry(cm(4.2), cm(0.22), cm(0.65)), mats.antiqueBrass);
    kBlade.position.set(trayX + cm(2.8), cm(102.5), trayZ + cm(1.4 + k * 0.9));
    kBlade.rotation.y = -0.2 + k * 0.35;
    g.add(kBlade);
  }
  g.add(trayRim, keyFob, keyRing);

  const diffX = -cm(26), diffZ = cm(1);
  const diffBottle = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.2), cm(3.6), cm(9.5), 8), mats.amberGlass);
  diffBottle.position.set(diffX, cm(104.0), diffZ);
  const diffCollar = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.5), cm(1.8), cm(2.2), 14), mats.antiqueBrass);
  diffCollar.position.set(diffX, cm(109.6), diffZ);
  g.add(diffBottle, diffCollar);
  for (let r = 0; r < 5; r++) {
    const ra = (r / 5) * Math.PI * 2;
    const reed = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.14), cm(0.14), cm(21), 6), mats.rattan);
    reed.position.set(diffX + Math.cos(ra) * cm(1.4), cm(116), diffZ + Math.sin(ra) * cm(1.4));
    reed.rotation.set(Math.sin(ra) * 0.16, 0, -Math.cos(ra) * 0.16);
    g.add(reed);
  }

  const bk1 = createHardcoverBook(cm(3.2), cm(18), cm(25), mats.sageCountryThrow, mats.warmCreamFabric);
  bk1.rotation.z = Math.PI / 2;
  bk1.rotation.y = 0.06;
  bk1.position.set(cm(12), cm(100.8), cm(1));
  const bk2 = createHardcoverBook(cm(2.6), cm(16), cm(22), mats.crispWhiteLinen, mats.warmCreamFabric);
  bk2.rotation.z = Math.PI / 2;
  bk2.rotation.y = -0.14;
  bk2.position.set(cm(12), cm(103.8), cm(1));
  g.add(bk1, bk2);

  const vaseX = cm(62);
  const vasePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(5.5), 0),
    new THREE.Vector2(cm(8.4), cm(8.5)),
    new THREE.Vector2(cm(7.6), cm(14)),
    new THREE.Vector2(cm(4.4), cm(19.5)),
    new THREE.Vector2(cm(5.8), cm(23.5)),
    new THREE.Vector2(cm(5.1), cm(23.5)),
    new THREE.Vector2(cm(3.9), cm(19.5)),
    new THREE.Vector2(0, cm(18.5)),
  ];
  const vase = new THREE.Mesh(new THREE.LatheGeometry(vasePts, 22), mats.porcelainGloss);
  vase.position.set(vaseX, cm(99.2), 0);
  const pHandleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(vaseX + cm(4.6), cm(120.5), 0),
    new THREE.Vector3(vaseX + cm(10.2), cm(118.5), 0),
    new THREE.Vector3(vaseX + cm(10.5), cm(110.0), 0),
    new THREE.Vector3(vaseX + cm(6.8), cm(106.5), 0),
  ]);
  const pHandle = new THREE.Mesh(new THREE.TubeGeometry(pHandleCurve, 16, cm(0.75), 10, false), mats.porcelainGloss);
  g.add(vase, pHandle);

  for (let b = 0; b < 20; b++) {
    const ang = (b / 20) * Math.PI * 2;
    const rad = cm(2.5 + (b % 4) * 2.5);
    const topY = cm(126 + (b % 5) * 2.1);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.12), cm(0.15), cm(12), 5), mats.foliageSage);
    stem.position.set(vaseX + Math.cos(ang) * rad * 0.55, topY - cm(5), Math.sin(ang) * rad * 0.55);
    stem.rotation.set(Math.sin(ang) * 0.28, 0, -Math.cos(ang) * 0.28);
    const floret = new THREE.Mesh(new THREE.SphereGeometry(cm(1.55), 8, 8), mats.crispWhiteLinen);
    floret.position.set(vaseX + Math.cos(ang) * rad, topY, Math.sin(ang) * rad);
    g.add(stem, floret);
  }

  const ledBar = new THREE.Mesh(new THREE.BoxGeometry(W - cm(14), cm(0.8), cm(2.2)), mats.warmBulbEmissive);
  ledBar.position.set(0, cm(143.6), cm(4));
  const nicheLight = new THREE.PointLight(0xffd596, 0.45, 2.2, 1.8);
  nicheLight.position.set(0, cm(136), cm(10));
  g.add(ledBar, nicheLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: nicheLight, mat: mats.warmBulbEmissive, baseIntensity: 0.7 });
  }

  // Upper Cabinet Body + Visible Interior Shelves & Porcelain Teapots behind Glass Doors
  const upH = cm(90);
  const upBody = new THREE.Mesh(new THREE.BoxGeometry(W, upH, D - cm(8)), mats.warmIvoryCabinet);
  upBody.position.set(0, cm(144) + upH / 2, -cm(4));
  for (const sy of [cm(172), cm(200)]) {
    const inShelf = new THREE.Mesh(new THREE.BoxGeometry(doorW * 2 - cm(2), cm(1.6), D - cm(8)), mats.whiteTrim);
    inShelf.position.set(0, sy, -cm(1));
    const teapot = new THREE.Mesh(new THREE.SphereGeometry(cm(5.5), 14, 12), mats.porcelainGloss);
    teapot.scale.set(1.1, 0.85, 1.0);
    teapot.position.set(sy > cm(185) ? -cm(18) : cm(18), sy + cm(5.2), cm(1));
    g.add(inShelf, teapot);
  }
  g.add(upBody);

  for (let i = 0; i < 4; i++) {
    const dx = -W / 2 + cm(3) + doorW * (i + 0.5);
    const door = createShakerDoorFace(doorW - cm(0.6), upH - cm(4), mats, {
      glass: i === 1 || i === 2,
      knobSide: i % 2 === 0 ? 'right' : 'left',
      knobYRatio: 0.2,
    });
    door.position.set(dx, cm(144) + upH / 2, D / 2 - cm(1));
    g.add(door);
  }

  const crown1 = new THREE.Mesh(new THREE.BoxGeometry(W + cm(3.5), cm(3.2), D + cm(2)), mats.whiteTrim);
  crown1.position.set(0, cm(235.6), cm(0.5));
  const crown2 = new THREE.Mesh(new THREE.BoxGeometry(W + cm(6.5), cm(2.8), D + cm(4)), mats.whiteTrim);
  crown2.position.set(0, cm(238.6), cm(1.4));
  const crown3 = new THREE.Mesh(new THREE.BoxGeometry(W + cm(9.5), cm(2.2), D + cm(6)), mats.whiteTrim);
  crown3.position.set(0, cm(241.1), cm(2.2));
  g.add(crown1, crown2, crown3);

  tagItem(g, '玄關純白鄉村風端景鞋櫃', '240 × 35 × 242 cm｜底部懸空照明與精緻鞋履＋百葉透氣門＋擴香鑰匙端景檯面＋格柵玻璃展示上櫃');
  enableShadows(g, true, true);
  return g;
}

// 2. Country Kitchen Counter (250 cm) + Farmhouse Sink + Bridge Faucet + Cookware + Bell Hood + Fridge + Oven + Island
export function createCountryKitchenZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  const kGroup = new THREE.Group();
  const kLen = cm(250);
  const kDepth = cm(63);
  kGroup.position.set(cm(46.5), 0, cm(527));

  const toe = new THREE.Mesh(new THREE.BoxGeometry(kDepth - cm(6), cm(10), kLen), mats.whiteTrim);
  toe.position.set(-cm(3), cm(5), 0);
  const carcNorth = new THREE.Mesh(new THREE.BoxGeometry(kDepth - cm(2), cm(75), cm(32)), mats.warmIvoryCabinet);
  carcNorth.position.set(-cm(1), cm(47.5), -kLen / 2 + cm(16));
  const carcUnderSink = new THREE.Mesh(new THREE.BoxGeometry(kDepth - cm(2), cm(54), cm(60)), mats.warmIvoryCabinet);
  carcUnderSink.position.set(-cm(1), cm(37), -cm(63));
  const carcSouth = new THREE.Mesh(new THREE.BoxGeometry(kDepth - cm(2), cm(75), cm(158)), mats.warmIvoryCabinet);
  carcSouth.position.set(-cm(1), cm(47.5), kLen / 2 - cm(79));
  kGroup.add(toe, carcNorth, carcUnderSink, carcSouth);

  const bayW = kLen / 4;
  for (let b = 0; b < 4; b++) {
    const bz = -kLen / 2 + bayW * (b + 0.5);
    if (b === 0) {
      const lowDoorL = createShakerDoorFace(bayW * 0.48, cm(50), mats, { knobSide: 'right', knobYRatio: 0.8 });
      lowDoorL.rotation.y = Math.PI / 2;
      lowDoorL.position.set(kDepth / 2, cm(36), bz - bayW * 0.24);
      const lowDoorR = createShakerDoorFace(bayW * 0.48, cm(50), mats, { knobSide: 'left', knobYRatio: 0.8 });
      lowDoorR.rotation.y = Math.PI / 2;
      lowDoorR.position.set(kDepth / 2, cm(36), bz + bayW * 0.24);
      kGroup.add(lowDoorL, lowDoorR);
    } else if (b === 1) {
      for (let d = 0; d < 3; d++) {
        const dh = d === 2 ? cm(17) : cm(27);
        const dy = d === 0 ? cm(24) : d === 1 ? cm(52) : cm(75);
        const drw = createDrawerFront(bayW - cm(1), dh, mats, true);
        drw.rotation.y = Math.PI / 2;
        drw.position.set(kDepth / 2, dy, bz);
        kGroup.add(drw);
      }
    } else {
      const dL = createShakerDoorFace(bayW * 0.49, cm(56), mats, { knobSide: 'right', knobYRatio: 0.82 });
      dL.rotation.y = Math.PI / 2;
      dL.position.set(kDepth / 2, cm(39), bz - bayW * 0.25);
      const dR = createShakerDoorFace(bayW * 0.49, cm(56), mats, { knobSide: 'left', knobYRatio: 0.82 });
      dR.rotation.y = Math.PI / 2;
      dR.position.set(kDepth / 2, cm(39), bz + bayW * 0.25);
      const topDrw = createDrawerFront(bayW - cm(1), cm(16), mats, true);
      topDrw.rotation.y = Math.PI / 2;
      topDrw.position.set(kDepth / 2, cm(76), bz);
      kGroup.add(dL, dR, topDrw);
    }
  }

  // Calacatta Marble Countertop with Cutout around Farmhouse Sink
  const topNorth = createRoundedSlab(kDepth + cm(2.5), cm(33), cm(3.4), cm(1.2), mats.marbleTop, cm(0.45));
  topNorth.position.set(cm(0.5), cm(85), -kLen / 2 + cm(16.5));
  const topSouth = createRoundedSlab(kDepth + cm(2.5), cm(158), cm(3.4), cm(1.2), mats.marbleTop, cm(0.45));
  topSouth.position.set(cm(0.5), cm(85), kLen / 2 - cm(79));
  const topBackStrip = new THREE.Mesh(new THREE.BoxGeometry(cm(13), cm(3.4), cm(62)), mats.marbleTop);
  topBackStrip.position.set(-kDepth / 2 + cm(6.5), cm(86.7), -cm(62));
  kGroup.add(topNorth, topSouth, topBackStrip);

  // Fluted Apron-Front Ceramic Farmhouse Sink + Stainless Strainer + Amber Soap Dispenser
  const sinkZ = -cm(62);
  const apronFront = createRoundedSlab(cm(7.5), cm(59), cm(22.5), cm(2.6), mats.porcelainGloss, cm(0.7));
  apronFront.position.set(kDepth / 2 - cm(1.2), cm(65.8), sinkZ);
  const apronInset = createRoundedSlab(cm(1.2), cm(50), cm(15), cm(1.8), mats.whiteTrim, cm(0.3));
  apronInset.position.set(kDepth / 2 + cm(2.1), cm(69.5), sinkZ);
  const sinkWallL = new THREE.Mesh(new THREE.BoxGeometry(cm(48), cm(20), cm(3.5)), mats.porcelainGloss);
  sinkWallL.position.set(cm(3), cm(77), sinkZ - cm(27.8));
  const sinkWallR = sinkWallL.clone();
  sinkWallR.position.z = sinkZ + cm(27.8);
  const sinkWallBack = new THREE.Mesh(new THREE.BoxGeometry(cm(3.5), cm(20), cm(58)), mats.porcelainGloss);
  sinkWallBack.position.set(-cm(19.5), cm(77), sinkZ);
  const sinkBottom = new THREE.Mesh(new THREE.BoxGeometry(cm(48), cm(2.5), cm(56)), mats.porcelainGloss);
  sinkBottom.position.set(cm(3), cm(67.2), sinkZ);
  const drainRim = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.2), cm(4.2), cm(0.5), 20), mats.stainlessSteel);
  drainRim.position.set(cm(2), cm(68.6), sinkZ);
  const drainPlug = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.4), cm(2.4), cm(0.8), 16), mats.antiqueBrass);
  drainPlug.position.set(cm(2), cm(68.8), sinkZ);
  const soapBottle = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.2), cm(3.4), cm(12.5), 16), mats.amberGlass);
  soapBottle.position.set(-kDepth / 2 + cm(7), cm(94.6), sinkZ - cm(19));
  const soapPump = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.8), cm(1.1), cm(3.5), 12), mats.antiqueBrass);
  soapPump.position.set(-kDepth / 2 + cm(7), cm(102.2), sinkZ - cm(19));
  kGroup.add(apronFront, apronInset, sinkWallL, sinkWallR, sinkWallBack, sinkBottom, drainRim, drainPlug, soapBottle, soapPump);

  // Antique Brass Bridge Faucet with Porcelain-Indexed Cross Handles & Side Sprayer
  const fx = -kDepth / 2 + cm(7);
  const bridgeBar = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.85), cm(0.85), cm(18), 12), mats.antiqueBrass);
  bridgeBar.rotation.x = Math.PI / 2;
  bridgeBar.position.set(fx, cm(95.5), sinkZ);
  for (const zOff of [-cm(9), cm(9)]) {
    const riser = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.1), cm(1.7), cm(8.5), 14), mats.antiqueBrass);
    riser.position.set(fx, cm(92.5), sinkZ + zOff);
    const cross1 = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.45), cm(6.2), 10), mats.antiqueBrass);
    cross1.rotation.x = Math.PI / 2;
    cross1.position.set(fx, cm(98.2), sinkZ + zOff);
    const cross2 = cross1.clone();
    cross2.rotation.z = Math.PI / 2;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.95), cm(0.95), cm(0.8), 12), mats.porcelainGloss);
    cap.position.set(fx, cm(98.6), sinkZ + zOff);
    kGroup.add(riser, cross1, cross2, cap);
  }
  const faucetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(fx, cm(95.5), sinkZ),
    new THREE.Vector3(fx, cm(112), sinkZ),
    new THREE.Vector3(fx + cm(11), cm(118), sinkZ),
    new THREE.Vector3(fx + cm(19), cm(107), sinkZ),
  ]);
  const spout = new THREE.Mesh(new THREE.TubeGeometry(faucetCurve, 24, cm(0.95), 12, false), mats.antiqueBrass);
  const aerator = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.25), cm(1.05), cm(1.8), 14), mats.antiqueBrass);
  aerator.position.set(fx + cm(19.2), cm(106.2), sinkZ);
  aerator.rotation.z = 0.42;
  const sprayer = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.3), cm(1.6), cm(9.5), 14), mats.antiqueBrass);
  sprayer.position.set(fx, cm(93), sinkZ + cm(19));
  kGroup.add(bridgeBar, spout, aerator, sprayer);

  // 2-Burner Gas Cooktop + Ignition Knobs + Enamel Gooseneck Kettle + Cast-Iron Dutch Oven
  const stoveZ = cm(75);
  const cooktopPlate = createRoundedSlab(cm(50), cm(58), cm(1.6), cm(2.5), mats.porcelainGloss, cm(0.3));
  cooktopPlate.position.set(cm(1), cm(88.2), stoveZ);
  kGroup.add(cooktopPlate);
  for (const kz of [-cm(8), cm(8)]) {
    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.8), cm(2.0), cm(0.5), 16), mats.stainlessSteel);
    bezel.position.set(cm(22.5), cm(90.0), stoveZ + kz);
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.35), cm(1.45), cm(1.5), 16), mats.antiqueBrass);
    knob.position.set(cm(22.5), cm(90.9), stoveZ + kz);
    kGroup.add(bezel, knob);
  }
  for (const bzOff of [-cm(14.5), cm(14.5)]) {
    const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(cm(9.8), cm(0.75), 10, 28), mats.castIronDark);
    ringOuter.rotation.x = Math.PI / 2;
    ringOuter.position.set(-cm(1), cm(90.4), stoveZ + bzOff);
    const brassSpreader = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.5), cm(4.8), cm(1.1), 20), mats.antiqueBrass);
    brassSpreader.position.set(-cm(1), cm(90.0), stoveZ + bzOff);
    const burnerCap = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.3), cm(4.0), cm(0.6), 20), mats.castIronDark);
    burnerCap.position.set(-cm(1), cm(90.7), stoveZ + bzOff);
    kGroup.add(ringOuter, brassSpreader, burnerCap);
    for (let k = 0; k < 4; k++) {
      const grate = new THREE.Mesh(new THREE.BoxGeometry(cm(20.5), cm(1.1), cm(0.85)), mats.castIronDark);
      grate.rotation.y = (k * Math.PI) / 4;
      grate.position.set(-cm(1), cm(90.9), stoveZ + bzOff);
      kGroup.add(grate);
    }
  }

  const ketZ = stoveZ - cm(14.5);
  const kettlePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(9.2), 0),
    new THREE.Vector2(cm(9.8), cm(3.5)),
    new THREE.Vector2(cm(8.2), cm(9.8)),
    new THREE.Vector2(cm(5.8), cm(11.5)),
    new THREE.Vector2(0, cm(11.5)),
  ];
  const kettleBody = new THREE.Mesh(new THREE.LatheGeometry(kettlePts, 24), mats.porcelainGloss);
  kettleBody.position.set(-cm(1), cm(91.5), ketZ);
  const ketLidKnob = new THREE.Mesh(new THREE.SphereGeometry(cm(1.2), 12, 10), mats.antiqueBrass);
  ketLidKnob.position.set(-cm(1), cm(103.8), ketZ);
  const ketSpoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(cm(6.5), cm(95), ketZ),
    new THREE.Vector3(cm(12.0), cm(99), ketZ),
    new THREE.Vector3(cm(13.5), cm(103.5), ketZ),
  ]);
  const ketSpout = new THREE.Mesh(new THREE.TubeGeometry(ketSpoutCurve, 12, cm(0.95), 10, false), mats.porcelainGloss);
  const kettleHandle = new THREE.Mesh(new THREE.TorusGeometry(cm(6.2), cm(0.5), 10, 20, Math.PI), mats.antiqueBrass);
  kettleHandle.rotation.y = Math.PI / 2;
  kettleHandle.position.set(-cm(1), cm(102.5), ketZ);
  const ketWoodGrip = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.95), cm(0.95), cm(6.5), 12), mats.naturalOak);
  ketWoodGrip.rotation.x = Math.PI / 2;
  ketWoodGrip.position.set(-cm(1), cm(108.7), ketZ);
  kGroup.add(kettleBody, ketLidKnob, ketSpout, kettleHandle, ketWoodGrip);

  const potZ = stoveZ + cm(14.5);
  const dutchPot = new THREE.Mesh(new THREE.CylinderGeometry(cm(10.8), cm(9.8), cm(10.5), 26), mats.creamShaker);
  dutchPot.position.set(-cm(1), cm(96.8), potZ);
  const dutchLid = new THREE.Mesh(new THREE.CylinderGeometry(cm(10.2), cm(11.1), cm(2.2), 26), mats.porcelainGloss);
  dutchLid.position.set(-cm(1), cm(103.0), potZ);
  const dutchKnob = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.9), cm(1.2), cm(1.6), 16), mats.antiqueBrass);
  dutchKnob.position.set(-cm(1), cm(104.8), potZ);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.TorusGeometry(cm(2.1), cm(0.48), 8, 14, Math.PI), mats.creamShaker);
    ear.rotation.z = -side * (Math.PI / 2);
    ear.rotation.x = Math.PI / 2;
    ear.position.set(-cm(1), cm(100.2), potZ + side * cm(10.6));
    kGroup.add(ear);
  }
  kGroup.add(dutchPot, dutchLid, dutchKnob);

  // Subway Backsplash + Brass Utensil Rail with Hanging Copper Pan, Ladle & Spatula + Oak Board & Spice Mills
  const backsplash = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(66), kLen - cm(2)), mats.subwayTile);
  backsplash.position.set(-kDepth / 2 + cm(0.6), cm(121), 0);
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.45), cm(96), 12), mats.antiqueBrass);
  rail.rotation.x = Math.PI / 2;
  rail.position.set(-kDepth / 2 + cm(3.4), cm(134), cm(8));
  for (const [uz, type] of [[-cm(16), 'ladle'], [cm(2), 'spatula'], [cm(24), 'copperPan']]) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.22), cm(0.22), cm(18), 8), mats.antiqueBrass);
    stem.position.set(-kDepth / 2 + cm(3.4), cm(124), uz);
    kGroup.add(stem);
    if (type === 'ladle') {
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(cm(3.2), 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.antiqueBrass);
      bowl.rotation.z = Math.PI / 2;
      bowl.position.set(-kDepth / 2 + cm(4.2), cm(114.5), uz);
      kGroup.add(bowl);
    } else if (type === 'spatula') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(cm(0.3), cm(7.5), cm(5.2)), mats.stainlessSteel);
      blade.position.set(-kDepth / 2 + cm(3.4), cm(113), uz);
      kGroup.add(blade);
    } else {
      const pan = new THREE.Mesh(new THREE.CylinderGeometry(cm(8.5), cm(7.6), cm(3.4), 22), mats.copperAccent);
      pan.rotation.z = Math.PI / 2;
      pan.position.set(-kDepth / 2 + cm(3.2), cm(111), uz);
      kGroup.add(pan);
    }
  }
  const board = createRoundedSlab(cm(2.2), cm(26), cm(34), cm(3.5), mats.naturalOak, cm(0.35));
  board.position.set(-kDepth / 2 + cm(4.2), cm(88.4), -cm(12));
  board.rotation.z = -0.14;
  for (let m = 0; m < 2; m++) {
    const mill = createTurnedLeg(cm(15 - m * 2.5), cm(2.2), m === 0 ? mats.naturalOak : mats.creamShaker);
    mill.position.set(-kDepth / 2 + cm(11), cm(88.4), cm(38 + m * 6.5));
    kGroup.add(mill);
  }
  kGroup.add(backsplash, rail, board);

  // Upper Mullioned Wall Cabinets with Visible Porcelain Dinnerware Inside Glass Door
  const upCabLen = cm(145), upCabD = cm(36), upCabH = cm(82);
  const upCab = new THREE.Mesh(new THREE.BoxGeometry(upCabD - cm(6), upCabH, upCabLen), mats.warmIvoryCabinet);
  upCab.position.set(-kDepth / 2 + (upCabD - cm(6)) / 2, cm(194), -kLen / 2 + upCabLen / 2 + cm(2));
  kGroup.add(upCab);
  const midGlassZ = -kLen / 2 + cm(2) + upCabLen * 0.5;
  for (const sy of [cm(176), cm(204)]) {
    const sh = new THREE.Mesh(new THREE.BoxGeometry(upCabD - cm(4), cm(1.5), upCabLen / 3 - cm(2)), mats.whiteTrim);
    sh.position.set(-kDepth / 2 + upCabD / 2 - cm(1), sy, midGlassZ);
    const plateStack = new THREE.Mesh(new THREE.CylinderGeometry(cm(9.5), cm(7.5), cm(5.5), 18), mats.porcelainGloss);
    plateStack.position.set(-kDepth / 2 + cm(18), sy + cm(3.5), midGlassZ - cm(6));
    const bowlStack = new THREE.Mesh(new THREE.CylinderGeometry(cm(6.5), cm(4.2), cm(6.5), 16), mats.porcelainGloss);
    bowlStack.position.set(-kDepth / 2 + cm(18), sy + cm(4.0), midGlassZ + cm(9));
    kGroup.add(sh, plateStack, bowlStack);
  }
  for (let i = 0; i < 3; i++) {
    const dw = upCabLen / 3;
    const face = createShakerDoorFace(dw - cm(0.8), upCabH - cm(4), mats, {
      glass: i === 1,
      knobSide: i === 0 ? 'right' : 'left',
      knobYRatio: 0.16,
    });
    face.rotation.y = Math.PI / 2;
    face.position.set(-kDepth / 2 + upCabD + cm(0.8), cm(194), -kLen / 2 + cm(2) + dw * (i + 0.5));
    kGroup.add(face);
  }
  const upCrown = new THREE.Mesh(new THREE.BoxGeometry(upCabD + cm(5), cm(5.5), upCabLen + cm(5)), mats.whiteTrim);
  upCrown.position.set(-kDepth / 2 + upCabD / 2 + cm(1.5), cm(237.8), -kLen / 2 + upCabLen / 2 + cm(2));
  kGroup.add(upCrown);

  // Sculpted Curved Bell Country Chimney Range Hood + Corbels + Baffle Filter
  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(-kDepth / 2, cm(156), stoveZ);
  const hoodMantel = createRoundedSlab(cm(53), cm(78), cm(6.8), cm(1.5), mats.naturalOak, cm(0.5));
  hoodMantel.position.set(cm(26.5), -cm(1.0), 0);
  for (const czOff of [-cm(34), cm(34)]) {
    const corbel = createRoundedSlab(cm(18), cm(5.5), cm(14), cm(2), mats.whiteTrim, cm(0.4));
    corbel.position.set(cm(9), -cm(14.5), czOff);
    hoodGroup.add(corbel);
  }
  for (let t = 0; t < 6; t++) {
    const frac = t / 5;
    const tierD = cm(50 - frac * 19);
    const tierW = cm(74 - frac * 34);
    const tier = createRoundedSlab(tierD, tierW, cm(6.8), cm(2), mats.creamShaker, cm(0.5));
    tier.position.set(tierD / 2, cm(5.8 + t * 6.0), 0);
    hoodGroup.add(tier);
  }
  const hoodFlue = new THREE.Mesh(new THREE.BoxGeometry(cm(31), cm(84), cm(40)), mats.beadboardFine);
  hoodFlue.position.set(cm(15.5), cm(83), 0);
  const baffleFilter = new THREE.Mesh(new THREE.BoxGeometry(cm(38), cm(0.8), cm(58)), mats.stainlessSteel);
  baffleFilter.position.set(cm(24), -cm(1.2), 0);
  hoodGroup.add(hoodMantel, hoodFlue, baffleFilter);
  kGroup.add(hoodGroup);

  tagItem(kGroup, '純白鄉村風一字型精細廚具組', '長 250 × 深 63 cm｜農舍圍裙水槽＋橋式十字把龍頭＋雙口爐琺瑯鑄鐵鍋＋弧形壁爐油煙機＋銅桿掛廚具');
  zone.add(kGroup);

  // B. Retro French-Door Refrigerator + Built-In Analog-Gauge Oven Tower + Pour-Over Coffee Sideboard
  const fridgeCluster = new THREE.Group();
  const northPart = new THREE.Mesh(new THREE.BoxGeometry(cm(78), cm(242), cm(5.5)), mats.beadboard);
  northPart.position.set(cm(215), cm(121), cm(503));
  const fridgeBody = createRoundedSlab(cm(68), cm(80), cm(184), cm(4), mats.creamShaker, cm(0.8));
  fridgeBody.position.set(cm(215), 0, cm(547.5));
  for (const zOff of [-cm(19.5), cm(19.5)]) {
    const gasket = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(111), cm(37.2)), mats.rubberGasket);
    gasket.position.set(cm(180.8), cm(124), cm(547.5) + zOff);
    const fDoor = createRoundedSlab(cm(4.0), cm(38), cm(112), cm(2.8), mats.porcelainGloss, cm(0.7));
    fDoor.position.set(cm(179.2), cm(68), cm(547.5) + zOff);
    const hz = cm(547.5) + (zOff < 0 ? cm(14) : -cm(14));
    const fHandle = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.72), cm(0.72), cm(52), 12), mats.antiqueBrass);
    fHandle.position.set(cm(175.8), cm(118), hz);
    for (const hy of [cm(96), cm(140)]) {
      const standOff = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.65), cm(0.85), cm(3.4), 10), mats.antiqueBrass);
      standOff.rotation.z = Math.PI / 2;
      standOff.position.set(cm(177.5), hy, hz);
      fridgeCluster.add(standOff);
    }
    fridgeCluster.add(gasket, fDoor, fHandle);
  }
  const fDrawer = createRoundedSlab(cm(4.0), cm(77.5), cm(62), cm(2.8), mats.porcelainGloss, cm(0.7));
  fDrawer.position.set(cm(179.2), cm(3), cm(547.5));
  const fBotHandle = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.72), cm(0.72), cm(58), 12), mats.antiqueBrass);
  fBotHandle.rotation.x = Math.PI / 2;
  fBotHandle.position.set(cm(175.8), cm(56), cm(547.5));
  const fridgeBridge = new THREE.Mesh(new THREE.BoxGeometry(cm(72), cm(54), cm(82)), mats.warmIvoryCabinet);
  fridgeBridge.position.set(cm(218), cm(213), cm(547.5));
  for (const bzOff of [-cm(20), cm(20)]) {
    const bd = createShakerDoorFace(cm(39.5), cm(50), mats, { knobSide: bzOff < 0 ? 'right' : 'left', knobYRatio: 0.22 });
    bd.rotation.y = -Math.PI / 2;
    bd.position.set(cm(181.5), cm(213), cm(547.5) + bzOff);
    fridgeCluster.add(bd);
  }
  fridgeCluster.add(northPart, fridgeBody, fDrawer, fBotHandle, fridgeBridge);

  const pantryH = cm(240);
  const pantryBody = new THREE.Mesh(new THREE.BoxGeometry(cm(68), pantryH, cm(64)), mats.warmIvoryCabinet);
  pantryBody.position.set(cm(220), pantryH / 2, cm(620));
  const ovenFrame = createRoundedSlab(cm(2.8), cm(59), cm(58), cm(1.5), mats.creamShaker, cm(0.35));
  ovenFrame.position.set(cm(185), cm(78), cm(620));
  const ovenCavity = new THREE.Mesh(new THREE.BoxGeometry(cm(8), cm(33), cm(44)), mats.castIronDark);
  ovenCavity.position.set(cm(188), cm(101), cm(620));
  const ovenRack = new THREE.Mesh(new THREE.BoxGeometry(cm(6), cm(0.6), cm(42)), mats.stainlessSteel);
  ovenRack.position.set(cm(186.5), cm(100), cm(620));
  const ovenWindow = new THREE.Mesh(new THREE.BoxGeometry(cm(0.8), cm(33), cm(44)), mats.darkApplianceGlass);
  ovenWindow.position.set(cm(184.6), cm(101), cm(620));
  const ovenBar = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.72), cm(0.72), cm(50), 12), mats.antiqueBrass);
  ovenBar.rotation.x = Math.PI / 2;
  ovenBar.position.set(cm(181.8), cm(123), cm(620));
  const dialRing = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.0), cm(3.0), cm(0.8), 20), mats.antiqueBrass);
  dialRing.rotation.z = Math.PI / 2;
  dialRing.position.set(cm(184.5), cm(130.5), cm(620));
  for (const kz of [-cm(15), cm(15)]) {
    const oKnob = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.6), cm(1.8), cm(1.8), 16), mats.antiqueBrass);
    oKnob.rotation.z = Math.PI / 2;
    oKnob.position.set(cm(184.0), cm(130.5), cm(620) + kz);
    fridgeCluster.add(oKnob);
  }
  const pLowDoor = createShakerDoorFace(cm(60), cm(72), mats, { knobSide: 'right', knobYRatio: 0.82 });
  pLowDoor.rotation.y = -Math.PI / 2;
  pLowDoor.position.set(cm(185), cm(39), cm(620));
  const pTopDoor = createShakerDoorFace(cm(60), cm(96), mats, { knobSide: 'right', knobYRatio: 0.16 });
  pTopDoor.rotation.y = -Math.PI / 2;
  pTopDoor.position.set(cm(185), cm(187), cm(620));
  const towerCrown = new THREE.Mesh(new THREE.BoxGeometry(cm(76), cm(5), cm(150)), mats.whiteTrim);
  towerCrown.position.set(cm(218), cm(242.5), cm(580));
  fridgeCluster.add(pantryBody, ovenFrame, ovenCavity, ovenRack, ovenWindow, ovenBar, dialRing, pLowDoor, pTopDoor, towerCrown);

  const sideCab = new THREE.Mesh(new THREE.BoxGeometry(cm(50), cm(92), cm(57)), mats.warmIvoryCabinet);
  sideCab.position.set(cm(279), cm(46), cm(528.5));
  const sideCabTop = createRoundedSlab(cm(52.5), cm(59.5), cm(3.0), cm(1.5), mats.naturalOak, cm(0.4));
  sideCabTop.position.set(cm(279), cm(92), cm(528.5));
  const sideCabDoor = createShakerDoorFace(cm(53), cm(66), mats, { knobSide: 'right', knobYRatio: 0.82 });
  sideCabDoor.rotation.y = Math.PI / 2;
  sideCabDoor.position.set(cm(304.5), cm(39), cm(528.5));
  const sideCabDrw = createDrawerFront(cm(53), cm(16), mats, true);
  sideCabDrw.rotation.y = Math.PI / 2;
  sideCabDrw.position.set(cm(304.5), cm(82), cm(528.5));
  const carafe = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.6), cm(5.8), cm(10.5), 18), mats.clearGlass);
  carafe.position.set(cm(282), cm(100.2), cm(540));
  const v60 = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.4), cm(2.0), cm(7.5), 18), mats.porcelainGloss);
  v60.position.set(cm(282), cm(109.0), cm(540));
  for (let c = 0; c < 2; c++) {
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.0), cm(5.0), cm(13.5 - c * 2), 18), mats.porcelainGloss);
    jar.position.set(cm(276), cm(101.8 - c), cm(513 + c * 13));
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.3), cm(5.3), cm(2.0), 18), mats.naturalOak);
    lid.position.set(cm(276), cm(109.2 - c * 2), cm(513 + c * 13));
    fridgeCluster.add(jar, lid);
  }
  fridgeCluster.add(sideCab, sideCabTop, sideCabDoor, sideCabDrw, carafe, v60);
  tagItem(fridgeCluster, '純白復古冰箱、指針式嵌入烤箱與手沖咖啡櫃組', '85 cm 法式雙門冰箱＋65 cm 指針錶盤烤箱高櫃＋50 cm 手沖咖啡餐邊櫃');
  zone.add(fridgeCluster);

  // C. 110 x 95 cm Turned-Leg Breakfast Island Table (Slatted Shelf + Rattan Baskets + Pastry Stand)
  const island = new THREE.Group();
  const iW = cm(110), iD = cm(95), iH = cm(78);
  island.position.set(cm(248), 0, cm(452.5));
  const iTop = createRoundedSlab(iW, iD, cm(4.0), cm(14), mats.naturalOak, cm(0.65));
  iTop.position.y = iH - cm(4.0);
  const iApron = createRoundedSlab(iW - cm(16), iD - cm(16), cm(8.8), cm(6), mats.creamShaker, cm(0.35));
  iApron.position.y = iH - cm(12.0);
  const islDrw = createDrawerFront(cm(52), cm(7.2), mats, true);
  islDrw.position.set(0, iH - cm(7.8), (iD - cm(16)) / 2 + cm(0.8));
  island.add(iTop, iApron, islDrw);

  for (let s = -4; s <= 4; s++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(cm(6.5), cm(1.5), iD - cm(24)), mats.naturalOak);
    slat.position.set(s * cm(9.0), cm(18.5), 0);
    island.add(slat);
  }
  for (const bz of [-cm(17), cm(17)]) {
    const basket = createRoundedSlab(cm(34), cm(28), cm(15.5), cm(4), mats.rattan, cm(0.8));
    basket.position.set(0, cm(19.3), bz);
    const liner = createRoundedSlab(cm(35.5), cm(29.5), cm(3.0), cm(4.2), mats.crispWhiteLinen, cm(0.6));
    liner.position.set(0, cm(32.8), bz);
    island.add(basket, liner);
  }
  for (const [lx, lz] of [
    [-iW / 2 + cm(12), -iD / 2 + cm(12)],
    [iW / 2 - cm(12), -iD / 2 + cm(12)],
    [-iW / 2 + cm(12), iD / 2 - cm(12)],
    [iW / 2 - cm(12), iD / 2 - cm(12)],
  ]) {
    const leg = createTurnedLeg(iH - cm(3.8), cm(3.5), mats.creamShaker);
    leg.position.set(lx, 0, lz);
    island.add(leg);
  }

  const standStem = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.55), cm(1.1), cm(25), 14), mats.antiqueBrass);
  standStem.position.y = iH + cm(12.5);
  const standRing = new THREE.Mesh(new THREE.TorusGeometry(cm(2.2), cm(0.32), 8, 18), mats.antiqueBrass);
  standRing.position.y = iH + cm(26.5);
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(cm(13.8), cm(10.5), cm(1.5), 24), mats.porcelainGloss);
  tier1.position.y = iH + cm(6);
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(cm(10.0), cm(7.8), cm(1.4), 24), mats.porcelainGloss);
  tier2.position.y = iH + cm(18);
  island.add(standStem, standRing, tier1, tier2);
  for (let f = 0; f < 4; f++) {
    const fa = (f / 4) * Math.PI * 2;
    const pastry = new THREE.Mesh(new THREE.SphereGeometry(cm(2.6), 12, 10), mats.warmWalnutAccent);
    pastry.scale.set(1.35, 0.72, 0.85);
    pastry.position.set(Math.cos(fa) * cm(6.5), iH + cm(8.2), Math.sin(fa) * cm(6.5));
    island.add(pastry);
  }
  for (const sx of [-cm(32), cm(32)]) {
    const matPad = new THREE.Mesh(new THREE.CylinderGeometry(cm(15), cm(15), cm(0.4), 24), mats.oatmealLinen);
    matPad.position.set(sx, iH + cm(0.2), 0);
    const bPlate = new THREE.Mesh(new THREE.CylinderGeometry(cm(10.5), cm(8.2), cm(1.1), 22), mats.porcelainGloss);
    bPlate.position.set(sx, iH + cm(0.9), 0);
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.6), cm(3.2), cm(7.8), 16), mats.porcelainGloss);
    mug.position.set(sx * 0.78, iH + cm(3.9), (sx < 0 ? 1 : -1) * cm(18));
    island.add(matPad, bPlate, mug);
  }

  const chairW = createWindsorChair(mats, mats.warmCreamFabric);
  chairW.rotation.y = Math.PI / 2;
  chairW.position.set(-iW / 2 - cm(10), 0, 0);
  const chairE = createWindsorChair(mats, mats.warmCreamFabric);
  chairE.rotation.y = -Math.PI / 2;
  chairE.position.set(iW / 2 + cm(10), 0, 0);
  island.add(chairW, chairE);

  const ceilRose = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.5), cm(6.2), cm(2.4), 18), mats.antiqueBrass);
  ceilRose.position.y = cm(283.5);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.32), cm(0.32), cm(82), 8), mats.antiqueBrass);
  cord.position.y = cm(242);
  const gallery = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.2), cm(5.4), cm(4.8), 16), mats.antiqueBrass);
  gallery.position.y = cm(204);
  const shadePts = [
    new THREE.Vector2(cm(3.2), cm(17)),
    new THREE.Vector2(cm(7.5), cm(14)),
    new THREE.Vector2(cm(17.5), cm(3.2)),
    new THREE.Vector2(cm(20.2), 0),
  ];
  const pShadeMat = mats.milkGlassLamp.clone();
  const shadeGeo = new THREE.LatheGeometry(shadePts, 36);
  const sPos = shadeGeo.attributes.position;
  for (let i = 0; i < sPos.count; i++) {
    const x = sPos.getX(i), z = sPos.getZ(i);
    const wave = 1 + Math.sin(Math.atan2(z, x) * 16) * 0.035;
    sPos.setX(i, x * wave);
    sPos.setZ(i, z * wave);
  }
  shadeGeo.computeVertexNormals();
  const pShade = new THREE.Mesh(shadeGeo, pShadeMat);
  pShade.material.side = THREE.DoubleSide;
  pShade.position.y = cm(186);
  const pLight = new THREE.PointLight(0xffd699, 0.65, 3.8, 1.7);
  pLight.position.y = cm(182);
  island.add(ceilRose, cord, gallery, pShade, pLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: pLight, mat: pShadeMat, baseIntensity: 1.05 });
  }

  tagItem(island, '鄉村風白橡木格柵中島桌＆溫莎餐椅', '110 × 95 cm｜車枳桌腳＋實木格柵下層架與藤編收納籃＋雙層點心架＋波浪牛奶玻璃吊燈');
  zone.add(island);
  enableShadows(zone, true, true);
  return zone;
}

// 3. Living & Dining Zone: 200 x 90 cm Country Table + Candlesticks + Open Book & Glasses + Chandelier + Channel-Tufted Bouclé Barrel Chair
export function createDiningAndLoungeZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // A. 200 x 90 cm Rounded-Corner Country Dining & Gathering Table
  const diningGroup = new THREE.Group();
  diningGroup.position.set(cm(578), 0, cm(414));
  const tW = cm(200), tD = cm(90), tH = cm(75);

  const tabletop = createRoundedSlab(tW, tD, cm(4.2), cm(17), mats.naturalOak, cm(0.75));
  tabletop.position.y = tH - cm(4.2);
  const apron = createRoundedSlab(tW - cm(26), tD - cm(22), cm(8.8), cm(8), mats.creamShaker, cm(0.45));
  apron.position.y = tH - cm(12.2);
  const apronBead = createRoundedSlab(tW - cm(24.5), tD - cm(20.5), cm(1.3), cm(8.2), mats.whiteTrim, cm(0.2));
  apronBead.position.y = tH - cm(12.5);
  diningGroup.add(tabletop, apron, apronBead);

  for (const [lx, lz] of [
    [-tW / 2 + cm(18), -tD / 2 + cm(15)],
    [tW / 2 - cm(18), -tD / 2 + cm(15)],
    [-tW / 2 + cm(18), tD / 2 - cm(15)],
    [tW / 2 - cm(18), tD / 2 - cm(15)],
  ]) {
    const leg = createTurnedLeg(tH - cm(3.8), cm(3.9), mats.creamShaker);
    leg.position.set(lx, 0, lz);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.1), cm(1.9), cm(3.2), 16), mats.antiqueBrass);
    ferrule.position.set(lx, cm(1.6), lz);
    diningGroup.add(leg, ferrule);
  }

  // Fringed Oatmeal Linen Table Runner + Two-Handled Amphora Vase + Olive Sprigs + Brass Taper Candlesticks
  const runner = createRoundedSlab(cm(144), cm(32), cm(0.45), cm(1.5), mats.oatmealLinen, cm(0.1));
  runner.position.y = tH + cm(0.08);
  for (const endSign of [-1, 1]) {
    for (let t = -5; t <= 5; t++) {
      const tassel = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.22), cm(0.32), cm(3.2), 6), mats.warmCreamFabric);
      tassel.rotation.z = Math.PI / 2;
      tassel.position.set(endSign * cm(73.5), tH + cm(0.28), t * cm(2.7));
      diningGroup.add(tassel);
    }
  }

  const vaseX = cm(14);
  const vasePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(6.5), 0),
    new THREE.Vector2(cm(5.2), cm(2.5)),
    new THREE.Vector2(cm(9.8), cm(11.5)),
    new THREE.Vector2(cm(4.8), cm(22.0)),
    new THREE.Vector2(cm(6.4), cm(26.2)),
    new THREE.Vector2(cm(5.6), cm(26.2)),
    new THREE.Vector2(cm(4.2), cm(21.8)),
    new THREE.Vector2(0, cm(20.5)),
  ];
  const centerVase = new THREE.Mesh(new THREE.LatheGeometry(vasePts, 24), mats.porcelainGloss);
  centerVase.position.set(vaseX, tH + cm(0.5), 0);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.TorusGeometry(cm(3.2), cm(0.5), 8, 16, Math.PI * 1.15), mats.porcelainGloss);
    ear.rotation.z = side < 0 ? Math.PI * 0.48 : -Math.PI * 0.48;
    ear.position.set(vaseX + side * cm(6.4), tH + cm(19.5), 0);
    diningGroup.add(ear);
  }
  diningGroup.add(runner, centerVase);

  // Olive branches + pointed leaves + tiny sage olives
  for (let b = 0; b < 7; b++) {
    const ang = (b / 7) * Math.PI * 2;
    const twig = new THREE.CatmullRomCurve3([
      new THREE.Vector3(vaseX, tH + cm(22), 0),
      new THREE.Vector3(vaseX + Math.cos(ang) * cm(10), tH + cm(36), Math.sin(ang) * cm(10)),
      new THREE.Vector3(vaseX + Math.cos(ang) * cm(19.5), tH + cm(44 + (b % 2) * 5), Math.sin(ang) * cm(19.5)),
    ]);
    diningGroup.add(new THREE.Mesh(new THREE.TubeGeometry(twig, 10, cm(0.28), 6, false), mats.woodBark));
    for (let lf = 1; lf <= 4; lf++) {
      const pt = twig.getPoint(lf / 4);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(cm(2.5), 8, 6), lf % 2 === 0 ? mats.foliageOlive : mats.foliageSage);
      leaf.scale.set(2.0, 0.18, 0.65);
      leaf.position.copy(pt);
      leaf.rotation.y = -ang + (lf % 2 === 0 ? 0.45 : -0.45);
      diningGroup.add(leaf);
    }
  }

  // Pair of Turned Brass Taper Candlesticks with Ivory Beeswax Candles
  for (const [cx, cz, ch] of [[cm(38), -cm(5), cm(16)], [cm(46), cm(5), cm(12.5)]]) {
    const stick = createTurnedLeg(ch, cm(2.6), mats.antiqueBrass);
    stick.position.set(cx, tH + cm(0.5), cz);
    const taper = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.95), cm(13), 12), mats.creamShaker);
    taper.position.set(cx, tH + ch + cm(6.5), cz);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(cm(0.65), 8, 8), mats.warmBulbEmissive);
    flame.scale.set(0.65, 1.8, 0.65);
    flame.position.set(cx, tH + ch + cm(13.8), cz);
    diningGroup.add(stick, taper, flame);
  }

  // Reader's Place Setting on West Side: Curved-Page Open Hardcover Book + Wire Reading Glasses + Handled Teacup & Saucer + Teapot
  const bx = -cm(42), bz = -cm(18);
  const coverBoard = createRoundedSlab(cm(30), cm(21), cm(0.45), cm(0.8), mats.sageCountryThrow, cm(0.1));
  coverBoard.position.set(bx, tH + cm(0.45), bz);
  coverBoard.rotation.y = 0.08;
  for (const pSide of [-1, 1]) {
    const pageArc = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, cm(0.5), 0),
      new THREE.Vector3(pSide * cm(6.8), cm(2.1), 0),
      new THREE.Vector3(pSide * cm(13.8), cm(0.9), 0),
    ]);
    const pageGeo = new THREE.ExtrudeGeometry(
      new THREE.Shape(pageArc.getPoints(12).concat([
        new THREE.Vector2(pSide * cm(13.8), cm(0.2)),
        new THREE.Vector2(pSide * cm(6.8), cm(1.2)),
        new THREE.Vector2(0, cm(0.1)),
      ])),
      { depth: cm(19.6), bevelEnabled: false }
    );
    const pageMesh = new THREE.Mesh(pageGeo, mats.crispWhiteLinen);
    pageMesh.position.set(bx, tH + cm(0.75), bz - cm(9.8));
    pageMesh.rotation.y = 0.08;
    diningGroup.add(pageMesh);
  }
  // Delicate brass reading spectacles resting beside open book!
  for (const lxOff of [-cm(3.0), cm(3.0)]) {
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(cm(2.2), cm(0.16), 8, 18), mats.antiqueBrass);
    lensRing.rotation.x = Math.PI / 2;
    lensRing.position.set(-cm(42) + lxOff, tH + cm(0.65), cm(2));
    diningGroup.add(lensRing);
  }
  const bridgeSpec = new THREE.Mesh(new THREE.BoxGeometry(cm(1.8), cm(0.18), cm(0.18)), mats.antiqueBrass);
  bridgeSpec.position.set(-cm(42), tH + cm(0.65), cm(2));
  diningGroup.add(coverBoard, bridgeSpec);

  // Handled Teacup + Saucer + Brass Spoon + Country Porcelain Teapot
  const tx = -cm(16), tz = -cm(16);
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(cm(6.8), cm(4.6), cm(1.0), 20), mats.porcelainGloss);
  saucer.position.set(tx, tH + cm(0.9), tz);
  const cupPts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(2.6), 0),
    new THREE.Vector2(cm(4.2), cm(5.4)),
    new THREE.Vector2(cm(3.8), cm(5.4)),
    new THREE.Vector2(cm(2.3), cm(0.6)),
    new THREE.Vector2(0, cm(0.6)),
  ];
  const cup = new THREE.Mesh(new THREE.LatheGeometry(cupPts, 20), mats.porcelainGloss);
  cup.position.set(tx, tH + cm(1.3), tz);
  const cupEar = new THREE.Mesh(new THREE.TorusGeometry(cm(1.6), cm(0.32), 8, 14, Math.PI * 1.1), mats.porcelainGloss);
  cupEar.rotation.z = -Math.PI / 2;
  cupEar.position.set(tx + cm(4.0), tH + cm(4.2), tz);
  const teaDisc = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.5), cm(3.5), cm(0.2), 16), mats.amberGlass);
  teaDisc.position.set(tx, tH + cm(5.6), tz);
  const spoon = new THREE.Mesh(new THREE.BoxGeometry(cm(9.5), cm(0.18), cm(0.7)), mats.antiqueBrass);
  spoon.position.set(tx, tH + cm(1.45), tz + cm(4.4));
  spoon.rotation.y = 0.15;
  diningGroup.add(saucer, cup, cupEar, teaDisc, spoon);

  // 4 French Country Medallion Upholstered Dining Chairs
  const cNW = createCountryDiningChair(mats);
  cNW.position.set(-cm(42), 0, -tD / 2 - cm(10));
  const cNE = createCountryDiningChair(mats);
  cNE.position.set(cm(28), 0, -tD / 2 - cm(10));
  const cSW = createCountryDiningChair(mats);
  cSW.rotation.y = Math.PI;
  cSW.position.set(-cm(40), 0, tD / 2 + cm(10));
  const cSE = createCountryDiningChair(mats);
  cSE.rotation.y = Math.PI;
  cSE.position.set(cm(32), 0, tD / 2 + cm(10));
  diningGroup.add(cNW, cNE, cSW, cSE);

  // 5-Arm French Country Chandelier with Linked Chain, Turned Baluster Column, Drip Bobeches & Fluted Glass Bells
  const chand = new THREE.Group();
  chand.position.y = cm(210);
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(cm(7.5), cm(5.2), cm(4.2), 20), mats.antiqueBrass);
  canopy.position.y = cm(71);
  // Individual brass chain links from ceiling canopy to chandelier loop
  for (let lk = 0; lk < 11; lk++) {
    const link = new THREE.Mesh(new THREE.TorusGeometry(cm(1.35), cm(0.28), 6, 12), mats.antiqueBrass);
    link.scale.set(0.75, 1.35, 1);
    link.rotation.y = (lk % 2) * (Math.PI / 2);
    link.position.y = cm(38 + lk * 3.0);
    chand.add(link);
  }
  const column = createTurnedLeg(cm(38), cm(4.4), mats.creamShaker);
  column.position.y = cm(1);
  const finialDrop = new THREE.Mesh(new THREE.SphereGeometry(cm(2.4), 14, 12), mats.antiqueBrass);
  finialDrop.scale.set(1, 1.4, 1);
  finialDrop.position.y = -cm(2.5);
  chand.add(canopy, column, finialDrop);

  const chandShadeMat = mats.milkGlassLamp.clone();
  for (let a = 0; a < 5; a++) {
    const ang = (a / 5) * Math.PI * 2;
    const r = cm(35);
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * cm(3), cm(4), Math.sin(ang) * cm(3)),
      new THREE.Vector3(Math.cos(ang) * r * 0.45, -cm(9.5), Math.sin(ang) * r * 0.45),
      new THREE.Vector3(Math.cos(ang) * r * 0.85, -cm(5.5), Math.sin(ang) * r * 0.85),
      new THREE.Vector3(Math.cos(ang) * r, cm(4), Math.sin(ang) * r),
    ]);
    const arm = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 18, cm(0.62), 10, false), mats.antiqueBrass);
    const bobeche = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.2), cm(2.2), cm(1.6), 16), mats.antiqueBrass);
    bobeche.position.set(Math.cos(ang) * r, cm(4.2), Math.sin(ang) * r);
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.6), cm(9.8), cm(11.5), 24, 1, true), chandShadeMat);
    bell.material.side = THREE.DoubleSide;
    bell.position.set(Math.cos(ang) * r, cm(10.5), Math.sin(ang) * r);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(cm(2.0), 10, 10), mats.warmBulbEmissive);
    bulb.position.set(Math.cos(ang) * r, cm(8.8), Math.sin(ang) * r);
    chand.add(arm, bobeche, bell, bulb);
  }
  const chandLight = new THREE.PointLight(0xffd89c, 0.9, 6.2, 1.6);
  chandLight.position.y = -cm(5);
  chand.add(chandLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: chandLight, mat: chandShadeMat, baseIntensity: 1.45 });
  }
  diningGroup.add(chand);

  tagItem(diningGroup, '法式鄉村風圓角白橡木大餐桌組', '200 × 90 cm｜黃銅腳套車枳桌腳＋路易十六雕花圓背餐椅＋流蘇桌旗燭台書茶組＋鎖鏈五燈古典吊燈');
  zone.add(diningGroup);

  // B. NE Sunlit Lounge Reading Corner (Channel-Tufted Bouclé Barrel Armchair + Pie-Crust Pedestal Table + Floor Lamp)
  const loungeGroup = new THREE.Group();
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(cm(84), cm(84), cm(0.85), 48), mats.juteRug);
  rug.position.set(cm(742), cm(0.42), cm(350));
  const rugTrim = new THREE.Mesh(new THREE.TorusGeometry(cm(84), cm(0.65), 8, 48), mats.oatmealLinen);
  rugTrim.rotation.x = Math.PI / 2;
  rugTrim.position.set(cm(742), cm(0.65), cm(350));
  zone.add(rug, rugTrim);

  const chair = new THREE.Group();
  chair.position.set(cm(758), 0, cm(346));
  chair.rotation.y = -Math.PI * 0.74;

  const chairBoucle = mats.boucleWhite || mats.warmCreamFabric;
  for (let f = 0; f < 4; f++) {
    const a = (f / 4) * Math.PI * 2 + Math.PI / 4;
    const foot = createTurnedLeg(cm(11), cm(2.9), mats.naturalOak);
    foot.position.set(Math.cos(a) * cm(31), 0, Math.sin(a) * cm(31));
    chair.add(foot);
  }
  const baseSeat = new THREE.Mesh(new THREE.CylinderGeometry(cm(41), cm(39), cm(26), 32), chairBoucle);
  baseSeat.position.y = cm(23);
  const seatWelt = new THREE.Mesh(new THREE.TorusGeometry(cm(34.5), cm(0.75), 10, 32), mats.crispWhiteLinen);
  seatWelt.rotation.x = Math.PI / 2;
  seatWelt.position.set(0, cm(44.2), cm(4));
  const plushSeat = new THREE.Mesh(new THREE.CylinderGeometry(cm(34.5), cm(34), cm(13.5), 28), mats.crispWhiteLinen);
  plushSeat.position.set(0, cm(38), cm(4));

  // True Hollow C-Shaped Wraparound Bouclé Barrel Shell + 9 Aligned Vertical Channel-Tufted Inner Ribs!
  const rOut = cm(42.5), rIn = cm(33.5);
  const startA = -Math.PI * 1.08, endA = Math.PI * 0.08; // wraps 208 deg around -Z, open at +Z front!
  const cArcShape = new THREE.Shape();
  cArcShape.absarc(0, 0, rOut, startA, endA, false);
  cArcShape.absarc(0, 0, rIn, endA, startA, true);
  cArcShape.closePath();
  const barrelGeo = new THREE.ExtrudeGeometry(cArcShape, {
    depth: cm(44),
    bevelEnabled: true,
    bevelThickness: cm(2.4),
    bevelSize: cm(1.8),
    bevelSegments: 4,
    curveSegments: 32,
  });
  barrelGeo.rotateX(Math.PI / 2);
  barrelGeo.computeBoundingBox();
  barrelGeo.translate(0, -barrelGeo.boundingBox.min.y + cm(26), 0);
  const barrelBack = new THREE.Mesh(barrelGeo, chairBoucle);

  const numChannels = 9;
  for (let c = 0; c < numChannels; c++) {
    const ca = startA + 0.14 + (c / (numChannels - 1)) * (endA - startA - 0.28);
    // Note: after rotateX(PI/2), shape (x = R*cos(a), y = R*sin(a)) maps to world (x = R*cos(a), z = R*sin(a))!
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.2), cm(3.9), cm(36), 14), mats.crispWhiteLinen);
    rib.position.set(Math.cos(ca) * cm(32.2), cm(54), Math.sin(ca) * cm(32.2));
    chair.add(rib);
  }

  const throwPillow = createCountryPillow(cm(37), cm(15), cm(27), mats.sageCountryThrow, { buttoned: true });
  throwPillow.position.set(-cm(3), cm(51), -cm(18));
  throwPillow.rotation.x = 0.26;
  const drapeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(cm(18), cm(47), cm(10)),
    new THREE.Vector3(cm(35), cm(76), cm(9)),
    new THREE.Vector3(cm(44.5), cm(61), cm(10)),
    new THREE.Vector3(cm(45.5), cm(34), cm(12)),
  ]);
  const knitThrow = new THREE.Mesh(
    new THREE.TubeGeometry(drapeCurve, 22, cm(5.5), 10, false),
    mats.cableKnitOatmeal || mats.oatmealLinen
  );
  knitThrow.scale.set(0.55, 1, 2.2);

  chair.add(baseSeat, plushSeat, seatWelt, barrelBack, throwPillow, knitThrow);
  tagItem(chair, '陽光閱讀角純白圈圈紗直紋包覆主人椅', '寬 87 × 深 85 cm｜九道立體直向絎縫靠背＋純白圈圈紗圓弧椅身＋鼠尾草綠拉釦抱枕＋麻花針織披毯');
  loungeGroup.add(chair);

  // Pie-Crust Lipped Round Pedestal Side Table + Lush Potted Plant
  const sideTable = new THREE.Group();
  sideTable.position.set(cm(686), 0, cm(296));
  const stBase = new THREE.Mesh(new THREE.CylinderGeometry(cm(14), cm(17.5), cm(3.8), 24), mats.creamShaker);
  stBase.position.y = cm(1.9);
  for (let f = 0; f < 3; f++) {
    const fa = (f / 3) * Math.PI * 2;
    const claw = createRoundedSlab(cm(6), cm(15), cm(3.2), cm(2), mats.creamShaker, cm(0.4));
    claw.position.set(Math.sin(fa) * cm(13), cm(0.2), Math.cos(fa) * cm(13));
    claw.rotation.y = fa;
    sideTable.add(claw);
  }
  const stPed = createTurnedLeg(cm(51.5), cm(4.4), mats.creamShaker);
  stPed.position.y = cm(3.2);
  const stTop = new THREE.Mesh(new THREE.CylinderGeometry(cm(23.5), cm(22.5), cm(2.6), 32), mats.naturalOak);
  stTop.position.y = cm(55);
  const stRim = new THREE.Mesh(new THREE.TorusGeometry(cm(23.2), cm(0.75), 10, 32), mats.naturalOak);
  stRim.rotation.x = Math.PI / 2;
  stRim.position.y = cm(56.4);
  sideTable.add(stBase, stPed, stTop, stRim);

  const cornerPlant = createPottedPlant(mats, cm(54), cm(10.5));
  cornerPlant.position.set(-cm(2), cm(56.3), -cm(2));
  sideTable.add(cornerPlant);
  tagItem(sideTable, '三足雕花車枳盤邊圓几＆室內觀葉樹', 'Ø47 × 高 57 cm｜微翹實木盤邊＋三足車枳柱座＋瓦楞陶盆觀葉植栽');
  loungeGroup.add(sideTable);

  // Turned-Wood Country Floor Lamp with Brass Pull-Chain Switch & Pleated Empire Shade
  const floorLamp = new THREE.Group();
  floorLamp.position.set(cm(808), 0, cm(294));
  const flBase = new THREE.Mesh(new THREE.CylinderGeometry(cm(15), cm(17.5), cm(3.8), 24), mats.creamShaker);
  flBase.position.y = cm(1.9);
  const flPole = createTurnedLeg(cm(148), cm(3.0), mats.creamShaker);
  flPole.position.y = cm(3.6);
  const pullChain = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.12), cm(0.12), cm(16), 6), mats.antiqueBrass);
  pullChain.position.set(cm(5.5), cm(138), cm(2));
  const pullAcorn = new THREE.Mesh(new THREE.SphereGeometry(cm(0.75), 10, 10), mats.antiqueBrass);
  pullAcorn.scale.set(1, 1.4, 1);
  pullAcorn.position.set(cm(5.5), cm(129.8), cm(2));

  const flShadeMat = mats.milkGlassLamp.clone();
  const flShadeGeo = new THREE.CylinderGeometry(cm(14), cm(23), cm(27), 44, 1, true);
  const fPos = flShadeGeo.attributes.position;
  for (let i = 0; i < fPos.count; i++) {
    const x = fPos.getX(i), z = fPos.getZ(i);
    const rMod = 1 + Math.sin(Math.atan2(z, x) * 22) * 0.038;
    fPos.setX(i, x * rMod);
    fPos.setZ(i, z * rMod);
  }
  flShadeGeo.computeVertexNormals();
  const flShade = new THREE.Mesh(flShadeGeo, flShadeMat);
  flShade.material.side = THREE.DoubleSide;
  flShade.position.y = cm(155);
  const flFinial = new THREE.Mesh(new THREE.SphereGeometry(cm(1.4), 12, 12), mats.antiqueBrass);
  flFinial.position.y = cm(170.5);
  const flLight = new THREE.PointLight(0xffd28e, 0.55, 3.6, 1.8);
  flLight.position.y = cm(150);
  floorLamp.add(flBase, flPole, pullChain, pullAcorn, flShade, flFinial, flLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: flLight, mat: flShadeMat, baseIntensity: 1.0 });
  }
  tagItem(floorLamp, '車枳實木百褶立燈', '高 171 cm｜純白車枳燈桿＋黃銅拉珠開關＋百褶透光布罩');
  loungeGroup.add(floorLamp);

  zone.add(loungeGroup);
  enableShadows(zone, true, true);
  return zone;
}
