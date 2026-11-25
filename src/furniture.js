import * as THREE from 'three';
import {
  cm,
  tagItem,
  enableShadows,
  createRoundedSlab,
  createTurnedLeg,
  createShakerDoorFace,
  createDrawerFront,
  createCountryPillow,
  createWindsorChair,
  createCountryDiningChair,
  createPottedPlant,
  createPleatedTableLamp,
} from './primitives.js';

// 1. Entryway 240 x 35 cm White Country Shoe & Display Cabinet (玄關端景收納高櫃)
export function createEntrywayShoeCabinet(mats, lightsRegistry) {
  const g = new THREE.Group();
  const W = cm(240);
  const D = cm(35);
  const H = cm(242);

  // Floating toe-kick recessed plinth (bottom 16 cm open for everyday shoes)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(W - cm(8), cm(4), D - cm(8)), mats.whiteTrim);
  plinth.position.set(0, cm(16), -cm(2));
  g.add(plinth);

  // Subtleeveryday shoes neatly placed in floating bottom bay
  for (let i = 0; i < 3; i++) {
    const shoeX = -cm(75) + i * cm(34);
    for (const pairOff of [-cm(5.5), cm(5.5)]) {
      const sole = createRoundedSlab(cm(9.5), cm(23), cm(2.2), cm(4), mats.warmWalnutAccent, cm(0.3));
      sole.position.set(shoeX + pairOff, cm(0.2), cm(2));
      const upper = createRoundedSlab(cm(8.8), cm(15), cm(5.2), cm(4), i === 1 ? mats.oatmealLinen : mats.creamShaker, cm(0.8));
      upper.position.set(shoeX + pairOff, cm(2.2), -cm(1));
      g.add(sole, upper);
    }
  }

  // Lower Cabinet Body (y = 18..96 cm) — 4 louvered Shaker doors
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

  // Middle Open Country Display Niche (y = 96..144 cm) with Natural Oak Counter & Beadboard Back
  const counterTop = createRoundedSlab(W + cm(2), D + cm(2.5), cm(3.2), cm(1.5), mats.naturalOak, cm(0.4));
  counterTop.position.set(0, cm(96), cm(0.5));
  const nicheBack = new THREE.Mesh(new THREE.BoxGeometry(W - cm(4), cm(46), cm(2)), mats.beadboard);
  nicheBack.position.set(0, cm(121), -D / 2 + cm(2));
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(cm(3), cm(46), D - cm(2)), mats.creamShaker);
  sideL.position.set(-W / 2 + cm(1.5), cm(121), -cm(1));
  const sideR = sideL.clone();
  sideR.position.x = W / 2 - cm(1.5);
  g.add(counterTop, nicheBack, sideL, sideR);

  // Niche Props: Ceramic Pitcher with Baby's Breath, Rattan Key Tray, Scented Diffuser & Mini Art
  const tray = createRoundedSlab(cm(32), cm(20), cm(3.5), cm(5), mats.rattan, cm(0.5));
  tray.position.set(-cm(62), cm(99.2), cm(2));
  const vasePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(5.5), 0),
    new THREE.Vector2(cm(8.0), cm(9)),
    new THREE.Vector2(cm(4.5), cm(19)),
    new THREE.Vector2(cm(5.6), cm(23)),
    new THREE.Vector2(0, cm(23)),
  ];
  const vase = new THREE.Mesh(new THREE.LatheGeometry(vasePts, 16), mats.porcelainGloss);
  vase.position.set(cm(58), cm(99.2), cm(0));
  // Delicate white baby's breath floral cloud
  for (let b = 0; b < 16; b++) {
    const ang = (b / 16) * Math.PI * 2;
    const r = cm(3 + (b % 3) * 2.8);
    const floret = new THREE.Mesh(new THREE.SphereGeometry(cm(1.8), 8, 8), mats.crispWhiteLinen);
    floret.position.set(cm(58) + Math.cos(ang) * r, cm(125 + (b % 4) * 2.2), Math.sin(ang) * r);
    g.add(floret);
  }
  // Stacked decorative books in center of niche
  const bk1 = createRoundedSlab(cm(24), cm(17), cm(3.0), cm(1), mats.sageCountryThrow, cm(0.2));
  bk1.position.set(0, cm(99.2), cm(1));
  const bk2 = createRoundedSlab(cm(21), cm(15), cm(2.6), cm(1), mats.crispWhiteLinen, cm(0.2));
  bk2.position.set(0, cm(102.2), cm(1));
  bk2.rotation.y = 0.12;
  g.add(tray, vase, bk1, bk2);

  // Warm LED strip under upper cabinet & under toe-kick
  const ledBar = new THREE.Mesh(new THREE.BoxGeometry(W - cm(16), cm(0.8), cm(2.0)), mats.warmBulbEmissive);
  ledBar.position.set(0, cm(143.5), cm(4));
  const nicheLight = new THREE.PointLight(0xffd596, 0.45, 2.2, 1.8);
  nicheLight.position.set(0, cm(136), cm(10));
  g.add(ledBar, nicheLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: nicheLight, mat: mats.warmBulbEmissive, baseIntensity: 0.7 });
  }

  // Upper Cabinet Body (y = 144..234 cm) — 4 Mullioned Glass & Shaker Doors + Crown Cornice
  const upH = cm(90);
  const upBody = new THREE.Mesh(new THREE.BoxGeometry(W, upH, D - cm(2)), mats.warmIvoryCabinet);
  upBody.position.set(0, cm(144) + upH / 2, -cm(1));
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

  // Stepped Country Crown Molding Cap
  const crown1 = new THREE.Mesh(new THREE.BoxGeometry(W + cm(4), cm(4), D + cm(2)), mats.whiteTrim);
  crown1.position.set(0, cm(236), cm(0.5));
  const crown2 = new THREE.Mesh(new THREE.BoxGeometry(W + cm(8), cm(4), D + cm(5)), mats.whiteTrim);
  crown2.position.set(0, cm(240), cm(1.8));
  g.add(crown1, crown2);

  tagItem(g, '玄關純白鄉村風端景鞋櫃', '240 × 35 × 242 cm｜底部懸空照明＋百葉透氣門＋白橡木端景檯面＋十字格柵玻璃上櫃');
  enableShadows(g, true, true);
  return g;
}

// 2. Country Kitchen Counter (250 cm) + Farmhouse Sink + 2-Burner Stove + Chimney Hood + Fridge Cluster + 110x95 Island
export function createCountryKitchenZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // A. West Kitchen Countertop & Base Cabinets: X = 15..78 cm (63cm deep), Z = 402..652 cm (250cm long)
  const kGroup = new THREE.Group();
  const kLen = cm(250);
  const kDepth = cm(63);
  const counterH = cm(88);
  // Center of kitchen run in world: X = 46.5 cm, Z = 527 cm
  kGroup.position.set(cm(46.5), 0, cm(527));

  // Recessed toe-kick
  const toe = new THREE.Mesh(new THREE.BoxGeometry(kDepth - cm(6), cm(10), kLen), mats.whiteTrim);
  toe.position.set(-cm(3), cm(5), 0);
  // Base cabinet carcass (split around farmhouse sink at Z_local = -65 cm)
  const carcass = new THREE.Mesh(new THREE.BoxGeometry(kDepth - cm(2), cm(75), kLen), mats.warmIvoryCabinet);
  carcass.position.set(-cm(1), cm(47.5), 0);
  kGroup.add(toe, carcass);

  // Shaker Cabinet Doors & Drawers facing East (+X)
  const bayW = kLen / 4;
  for (let b = 0; b < 4; b++) {
    const bz = -kLen / 2 + bayW * (b + 0.5);
    if (b === 0 || b === 1) {
      // Sink at b=0.6: put apron sink at Z_local = -62 cm, doors below
      if (b === 0) {
        const lowDoorL = createShakerDoorFace(bayW * 0.48, cm(50), mats, { knobSide: 'right', knobYRatio: 0.8 });
        lowDoorL.rotation.y = Math.PI / 2;
        lowDoorL.position.set(kDepth / 2, cm(36), bz - bayW * 0.24);
        const lowDoorR = createShakerDoorFace(bayW * 0.48, cm(50), mats, { knobSide: 'left', knobYRatio: 0.8 });
        lowDoorR.rotation.y = Math.PI / 2;
        lowDoorR.position.set(kDepth / 2, cm(36), bz + bayW * 0.24);
        kGroup.add(lowDoorL, lowDoorR);
      } else {
        // 3-drawer stack in center prep zone
        for (let d = 0; d < 3; d++) {
          const dh = d === 2 ? cm(17) : cm(27);
          const dy = d === 0 ? cm(24) : d === 1 ? cm(52) : cm(75);
          const drw = createDrawerFront(bayW - cm(1), dh, mats, true);
          drw.rotation.y = Math.PI / 2;
          drw.position.set(kDepth / 2, dy, bz);
          kGroup.add(drw);
        }
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

  // Marble Countertop with cutout around Farmhouse Sink (Z_local = -92 .. -32 cm)
  const topNorth = createRoundedSlab(kDepth + cm(2), cm(32), cm(3.4), cm(1), mats.marbleTop, cm(0.3));
  topNorth.position.set(0, cm(85), -kLen / 2 + cm(16));
  const topSouth = createRoundedSlab(kDepth + cm(2), cm(158), cm(3.4), cm(1), mats.marbleTop, cm(0.3));
  topSouth.position.set(0, cm(85), kLen / 2 - cm(79));
  const topBackStrip = new THREE.Mesh(new THREE.BoxGeometry(cm(12), cm(3.4), cm(62)), mats.marbleTop);
  topBackStrip.position.set(-kDepth / 2 + cm(6), cm(86.7), -cm(62));
  kGroup.add(topNorth, topSouth, topBackStrip);

  // White Ceramic Apron-Front Farmhouse Sink (鄉村風陶瓷農舍水槽, exact blueprint position Z ~ 465 cm -> local -62 cm)
  const sinkZ = -cm(62);
  const apronFront = createRoundedSlab(cm(8), cm(58), cm(22), cm(2.5), mats.porcelainGloss, cm(0.6));
  apronFront.position.set(kDepth / 2 - cm(1.5), cm(66), sinkZ);
  const sinkWallL = new THREE.Mesh(new THREE.BoxGeometry(cm(48), cm(20), cm(3.5)), mats.porcelainGloss);
  sinkWallL.position.set(cm(3), cm(77), sinkZ - cm(27.5));
  const sinkWallR = sinkWallL.clone();
  sinkWallR.position.z = sinkZ + cm(27.5);
  const sinkBottom = new THREE.Mesh(new THREE.BoxGeometry(cm(48), cm(2.5), cm(56)), mats.porcelainGloss);
  sinkBottom.position.set(cm(3), cm(67.5), sinkZ);
  const drain = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.8), cm(2.8), cm(0.6), 16), mats.antiqueBrass);
  drain.position.set(cm(3), cm(69), sinkZ);
  kGroup.add(apronFront, sinkWallL, sinkWallR, sinkBottom, drain);

  // Gooseneck Antique Brass Country Bridge Faucet
  const faucetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-kDepth / 2 + cm(7), cm(88), sinkZ),
    new THREE.Vector3(-kDepth / 2 + cm(7), cm(108), sinkZ),
    new THREE.Vector3(-kDepth / 2 + cm(17), cm(114), sinkZ),
    new THREE.Vector3(-kDepth / 2 + cm(24), cm(104), sinkZ),
  ]);
  const spout = new THREE.Mesh(new THREE.TubeGeometry(faucetCurve, 20, cm(0.95), 10, false), mats.antiqueBrass);
  const hBaseL = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.6), cm(2.0), cm(5), 12), mats.antiqueBrass);
  hBaseL.position.set(-kDepth / 2 + cm(7), cm(90.5), sinkZ - cm(9));
  const hBaseR = hBaseL.clone();
  hBaseR.position.z = sinkZ + cm(9);
  kGroup.add(spout, hBaseL, hBaseR);

  // 2-Burner Country Cooktop (雙口爐 at South end Z ~ 602 cm -> local +75 cm, exact match to q3_bot_left!)
  const stoveZ = cm(75);
  const cooktopPlate = createRoundedSlab(cm(50), cm(58), cm(1.6), cm(2.5), mats.porcelainGloss, cm(0.3));
  cooktopPlate.position.set(cm(1), cm(88.2), stoveZ);
  kGroup.add(cooktopPlate);
  for (const bzOff of [-cm(14), cm(14)]) {
    const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(cm(9.5), cm(0.75), 8, 24), mats.castIronDark);
    ringOuter.rotation.x = Math.PI / 2;
    ringOuter.position.set(cm(1), cm(90.3), stoveZ + bzOff);
    const burnerCap = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.2), cm(4.6), cm(1.4), 16), mats.castIronDark);
    burnerCap.position.set(cm(1), cm(90.1), stoveZ + bzOff);
    kGroup.add(ringOuter, burnerCap);
    for (let k = 0; k < 4; k++) {
      const grate = new THREE.Mesh(new THREE.BoxGeometry(cm(19), cm(0.9), cm(0.9)), mats.castIronDark);
      grate.rotation.y = (k * Math.PI) / 4;
      grate.position.set(cm(1), cm(90.6), stoveZ + bzOff);
      kGroup.add(grate);
    }
  }
  // White Enamel Country Kettle on North burner
  const kettleBody = new THREE.Mesh(new THREE.CylinderGeometry(cm(6.5), cm(9.2), cm(11), 18), mats.creamShaker);
  kettleBody.position.set(cm(1), cm(96.5), stoveZ - cm(14));
  const kettleHandle = new THREE.Mesh(new THREE.TorusGeometry(cm(5.5), cm(0.6), 8, 16, Math.PI), mats.antiqueBrass);
  kettleHandle.position.set(cm(1), cm(102), stoveZ - cm(14));
  kGroup.add(kettleBody, kettleHandle);

  // White Subway Tile Backsplash along West Kitchen Wall + Brass Utensil Rail
  const backsplash = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(66), kLen - cm(2)), mats.subwayTile);
  backsplash.position.set(-kDepth / 2 + cm(0.6), cm(121), 0);
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.45), cm(0.45), cm(90), 10), mats.antiqueBrass);
  rail.rotation.x = Math.PI / 2;
  rail.position.set(-kDepth / 2 + cm(3.2), cm(132), cm(5));
  // Wooden cutting board leaning against backsplash
  const board = createRoundedSlab(cm(2.0), cm(26), cm(34), cm(3), mats.naturalOak, cm(0.3));
  board.position.set(-kDepth / 2 + cm(4), cm(88.4), cm(8));
  board.rotation.z = -0.14;
  kGroup.add(backsplash, rail, board);

  // Upper Mullioned Country Wall Cabinets (North half) & Country Chimney Range Hood (South over stove)
  const upCabLen = cm(145);
  const upCabD = cm(36);
  const upCabH = cm(82);
  const upCab = new THREE.Mesh(new THREE.BoxGeometry(upCabD, upCabH, upCabLen), mats.warmIvoryCabinet);
  upCab.position.set(-kDepth / 2 + upCabD / 2, cm(194), -kLen / 2 + upCabLen / 2 + cm(2));
  kGroup.add(upCab);
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
  const upCrown = new THREE.Mesh(new THREE.BoxGeometry(upCabD + cm(4), cm(5), upCabLen + cm(4)), mats.whiteTrim);
  upCrown.position.set(-kDepth / 2 + upCabD / 2 + cm(1), cm(237.5), -kLen / 2 + upCabLen / 2 + cm(2));
  kGroup.add(upCrown);

  // Sculpted White Country Chimney Range Hood (壁爐造型抽油煙機 + 橡木飾條)
  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(-kDepth / 2, cm(156), stoveZ);
  const hoodMantel = new THREE.Mesh(new THREE.BoxGeometry(cm(52), cm(6.5), cm(76)), mats.naturalOak);
  hoodMantel.position.set(cm(26), 0, 0);
  const hoodCanopy = new THREE.Mesh(new THREE.CylinderGeometry(cm(24), cm(38), cm(38), 4, 1), mats.creamShaker);
  hoodCanopy.rotation.y = Math.PI / 4;
  hoodCanopy.scale.set(0.82, 1, 1.35);
  hoodCanopy.position.set(cm(23), cm(22), 0);
  const hoodFlue = new THREE.Mesh(new THREE.BoxGeometry(cm(30), cm(54), cm(38)), mats.beadboardFine);
  hoodFlue.position.set(cm(15), cm(66), 0);
  hoodGroup.add(hoodMantel, hoodCanopy, hoodFlue);
  kGroup.add(hoodGroup);

  tagItem(kGroup, '純白鄉村風一字型廚具組', '長 250 × 深 63 cm｜陶瓷農舍水槽＋雙口爐＋壁爐造型油煙機＋鐵道磚防濺板');
  zone.add(kGroup);

  // B. Refrigerator + 5cm Beadboard Partition + 50cm Side Cabinet + 65cm Tall Oven/Pantry Tower
  const fridgeCluster = new THREE.Group();
  // 5 cm North Partition (X = 176..254, Z = 500..506 cm)
  const northPart = new THREE.Mesh(new THREE.BoxGeometry(cm(78), cm(240), cm(5.5)), mats.beadboard);
  northPart.position.set(cm(215), cm(120), cm(503));
  // Cream-White Retro Country French-Door Refrigerator (X = 179..250, Z = 507..588 cm -> 81cm wide!)
  const fridgeBody = createRoundedSlab(cm(68), cm(80), cm(184), cm(4), mats.creamShaker, cm(0.8));
  fridgeBody.position.set(cm(215), cm(0), cm(547.5));
  // French upper doors & lower freezer drawer facing West (-X)
  for (const zOff of [-cm(19.5), cm(19.5)]) {
    const fDoor = createRoundedSlab(cm(4.0), cm(38), cm(112), cm(2.5), mats.porcelainGloss, cm(0.6));
    fDoor.position.set(cm(179.5), cm(68), cm(547.5) + zOff);
    const fHandle = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.75), cm(48), 10), mats.antiqueBrass);
    fHandle.position.set(cm(176.5), cm(118), cm(547.5) + (zOff < 0 ? cm(13) : -cm(13)));
    fridgeCluster.add(fDoor, fHandle);
  }
  const fDrawer = createRoundedSlab(cm(4.0), cm(77.5), cm(62), cm(2.5), mats.porcelainGloss, cm(0.6));
  fDrawer.position.set(cm(179.5), cm(3), cm(547.5));
  const fBotHandle = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.75), cm(0.75), cm(56), 10), mats.antiqueBrass);
  fBotHandle.rotation.x = Math.PI / 2;
  fBotHandle.position.set(cm(176.5), cm(56), cm(547.5));
  // Over-fridge bridge Shaker cabinet (y = 186..240)
  const fridgeBridge = new THREE.Mesh(new THREE.BoxGeometry(cm(74), cm(54), cm(82)), mats.warmIvoryCabinet);
  fridgeBridge.position.set(cm(217), cm(213), cm(547.5));
  fridgeCluster.add(northPart, fridgeBody, fDrawer, fBotHandle, fridgeBridge);

  // 65 cm South Tall Appliance / Oven Pantry Tower (X = 186..254, Z = 588..652 cm, facing West -X)
  const pantryH = cm(240);
  const pantryBody = new THREE.Mesh(new THREE.BoxGeometry(cm(68), pantryH, cm(64)), mats.warmIvoryCabinet);
  pantryBody.position.set(cm(220), pantryH / 2, cm(620));
  // Built-in White & Brass Country Oven at ergonomic height (y = 78..136)
  const ovenFrame = new THREE.Mesh(new THREE.BoxGeometry(cm(2.5), cm(56), cm(58)), mats.creamShaker);
  ovenFrame.position.set(cm(185), cm(106), cm(620));
  const ovenWindow = new THREE.Mesh(new THREE.BoxGeometry(cm(3.0), cm(34), cm(44)), mats.castIronDark);
  ovenWindow.position.set(cm(184.5), cm(103), cm(620));
  const ovenBar = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.7), cm(0.7), cm(48), 10), mats.antiqueBrass);
  ovenBar.rotation.x = Math.PI / 2;
  ovenBar.position.set(cm(182.2), cm(126), cm(620));
  const pLowDoor = createShakerDoorFace(cm(60), cm(72), mats, { knobSide: 'right', knobYRatio: 0.82 });
  pLowDoor.rotation.y = -Math.PI / 2;
  pLowDoor.position.set(cm(185), cm(39), cm(620));
  const pTopDoor = createShakerDoorFace(cm(60), cm(96), mats, { knobSide: 'right', knobYRatio: 0.16 });
  pTopDoor.rotation.y = -Math.PI / 2;
  pTopDoor.position.set(cm(185), cm(186), cm(620));
  fridgeCluster.add(pantryBody, ovenFrame, ovenWindow, ovenBar, pLowDoor, pTopDoor);

  // 50 cm Side Coffee/Sideboard Cabinet (X = 254..304, Z = 500..557 cm, facing East +X / North)
  const sideCab = new THREE.Mesh(new THREE.BoxGeometry(cm(50), cm(92), cm(57)), mats.warmIvoryCabinet);
  sideCab.position.set(cm(279), cm(46), cm(528.5));
  const sideCabTop = createRoundedSlab(cm(52), cm(59), cm(3.0), cm(1.5), mats.naturalOak, cm(0.3));
  sideCabTop.position.set(cm(279), cm(92), cm(528.5));
  const sideCabDoor = createShakerDoorFace(cm(53), cm(82), mats, { knobSide: 'right', knobYRatio: 0.82 });
  sideCabDoor.rotation.y = Math.PI / 2;
  sideCabDoor.position.set(cm(304.5), cm(46), cm(528.5));
  // Ceramic coffee canisters on top + upper wall hutch
  for (let c = 0; c < 2; c++) {
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.2), cm(5.2), cm(14 - c * 2), 14), mats.porcelainGloss);
    jar.position.set(cm(279), cm(102 - c), cm(516 + c * 18));
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(cm(5.5), cm(5.5), cm(2.2), 14), mats.naturalOak);
    lid.position.set(cm(279), cm(109.5 - c * 2), cm(516 + c * 18));
    fridgeCluster.add(jar, lid);
  }
  fridgeCluster.add(sideCab, sideCabTop, sideCabDoor);
  tagItem(fridgeCluster, '純白復古冰箱與電器餐邊櫃組', '85 cm 雙門冰箱＋65 cm 嵌入式烤箱電器高櫃＋50 cm 轉角咖啡餐邊櫃');
  zone.add(fridgeCluster);

  // C. 110 x 95 cm Turned-Leg Country Breakfast Island Table (X = 193..303, Z = 405..500 cm)
  const island = new THREE.Group();
  const iW = cm(110);
  const iD = cm(95);
  const iH = cm(78);
  island.position.set(cm(248), 0, cm(452.5));

  const iTop = createRoundedSlab(iW, iD, cm(3.8), cm(14), mats.naturalOak, cm(0.6));
  iTop.position.y = iH - cm(3.8);
  const iApron = createRoundedSlab(iW - cm(16), iD - cm(16), cm(8.5), cm(6), mats.creamShaker, cm(0.3));
  iApron.position.y = iH - cm(11.5);
  const lowShelf = createRoundedSlab(iW - cm(22), iD - cm(22), cm(2.2), cm(4), mats.creamShaker, cm(0.3));
  lowShelf.position.y = cm(18);
  island.add(iTop, iApron, lowShelf);

  for (const [lx, lz] of [
    [-iW / 2 + cm(12), -iD / 2 + cm(12)],
    [iW / 2 - cm(12), -iD / 2 + cm(12)],
    [-iW / 2 + cm(12), iD / 2 - cm(12)],
    [iW / 2 - cm(12), iD / 2 - cm(12)],
  ]) {
    const leg = createTurnedLeg(iH - cm(3.5), cm(3.4), mats.creamShaker);
    leg.position.set(lx, 0, lz);
    island.add(leg);
  }

  // 2-tier porcelain fruit/pastry stand on island
  const standStem = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.6), cm(1.2), cm(24), 12), mats.antiqueBrass);
  standStem.position.y = iH + cm(12);
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(cm(13), cm(11), cm(1.2), 20), mats.porcelainGloss);
  tier1.position.y = iH + cm(6);
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(cm(9.5), cm(8), cm(1.2), 20), mats.porcelainGloss);
  tier2.position.y = iH + cm(18);
  island.add(standStem, tier1, tier2);

  // 2 White Windsor Chairs on West and East sides (exact match to q1_top_left!)
  const chairW = createWindsorChair(mats, mats.warmCreamFabric);
  chairW.rotation.y = Math.PI / 2; // facing East (+X) into island
  chairW.position.set(-iW / 2 - cm(10), 0, 0);
  const chairE = createWindsorChair(mats, mats.warmCreamFabric);
  chairE.rotation.y = -Math.PI / 2; // facing West (-X) into island
  chairE.position.set(iW / 2 + cm(10), 0, 0);
  island.add(chairW, chairE);

  // Overhead Fluted Milk-Glass Country Pendant Lamp
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.35), cm(0.35), cm(85), 8), mats.antiqueBrass);
  cord.position.y = cm(238);
  const shadePts = [
    new THREE.Vector2(cm(2), cm(18)),
    new THREE.Vector2(cm(6), cm(15)),
    new THREE.Vector2(cm(17), cm(3)),
    new THREE.Vector2(cm(19), 0),
  ];
  const pShadeMat = mats.milkGlassLamp.clone();
  const pShade = new THREE.Mesh(new THREE.LatheGeometry(shadePts, 24), pShadeMat);
  pShade.material.side = THREE.DoubleSide;
  pShade.position.y = cm(186);
  const pLight = new THREE.PointLight(0xffd699, 0.65, 3.8, 1.7);
  pLight.position.y = cm(182);
  island.add(cord, pShade, pLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: pLight, mat: pShadeMat, baseIntensity: 1.05 });
  }

  tagItem(island, '鄉村風白橡木中島早午餐桌＆溫莎椅', '110 × 95 cm｜車枳桌腳＋圓角實木檯面＋雙側純白溫莎餐椅＋牛奶玻璃吊燈');
  zone.add(island);

  enableShadows(zone, true, true);
  return zone;
}

// 3. Living & Dining Zone: 200 x 90 cm Country Table + 4 Chairs + Chandelier + NE Barrel Lounge Reading Corner
export function createDiningAndLoungeZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // A. 200 x 90 cm Rounded-Corner Country Dining & Gathering Table (X = 478..678, Z = 369..459 -> center 578, 414)
  const diningGroup = new THREE.Group();
  diningGroup.position.set(cm(578), 0, cm(414));
  const tW = cm(200);
  const tD = cm(90);
  const tH = cm(75);

  const tabletop = createRoundedSlab(tW, tD, cm(4.2), cm(17), mats.naturalOak, cm(0.7));
  tabletop.position.y = tH - cm(4.2);
  const apron = createRoundedSlab(tW - cm(26), tD - cm(22), cm(8.5), cm(8), mats.creamShaker, cm(0.4));
  apron.position.y = tH - cm(12);
  diningGroup.add(tabletop, apron);

  for (const [lx, lz] of [
    [-tW / 2 + cm(18), -tD / 2 + cm(15)],
    [tW / 2 - cm(18), -tD / 2 + cm(15)],
    [-tW / 2 + cm(18), tD / 2 - cm(15)],
    [tW / 2 - cm(18), tD / 2 - cm(15)],
  ]) {
    const leg = createTurnedLeg(tH - cm(3.8), cm(3.8), mats.creamShaker);
    leg.position.set(lx, 0, lz);
    diningGroup.add(leg);
  }

  // Oatmeal Linen Table Runner + Ceramic Vase with Olive Branches + Tea Set & Open Book
  const runner = createRoundedSlab(cm(138), cm(32), cm(0.5), cm(2), mats.oatmealLinen, cm(0.1));
  runner.position.y = tH + cm(0.1);
  const vasePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(cm(6.5), 0),
    new THREE.Vector2(cm(9.5), cm(11)),
    new THREE.Vector2(cm(5.0), cm(22)),
    new THREE.Vector2(cm(6.2), cm(26)),
    new THREE.Vector2(0, cm(26)),
  ];
  const centerVase = new THREE.Mesh(new THREE.LatheGeometry(vasePts, 18), mats.porcelainGloss);
  centerVase.position.set(cm(12), tH + cm(0.5), 0);
  diningGroup.add(runner, centerVase);

  // Olive sprigs in dining vase
  for (let b = 0; b < 6; b++) {
    const ang = (b / 6) * Math.PI * 2;
    const twig = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cm(12), tH + cm(22), 0),
      new THREE.Vector3(cm(12) + Math.cos(ang) * cm(10), tH + cm(36), Math.sin(ang) * cm(10)),
      new THREE.Vector3(cm(12) + Math.cos(ang) * cm(19), tH + cm(44 + (b % 2) * 5), Math.sin(ang) * cm(19)),
    ]);
    diningGroup.add(new THREE.Mesh(new THREE.TubeGeometry(twig, 8, cm(0.3), 6, false), mats.foliageSage));
    for (let lf = 1; lf <= 4; lf++) {
      const pt = twig.getPoint(lf / 4);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(cm(2.6), 6, 6), mats.foliageOlive);
      leaf.scale.set(1.8, 0.2, 0.7);
      leaf.position.copy(pt);
      leaf.rotation.y = -ang;
      diningGroup.add(leaf);
    }
  }

  // Open book & teacup on West side where blueprint shows seated reader!
  const openBook = createRoundedSlab(cm(28), cm(20), cm(1.6), cm(1), mats.crispWhiteLinen, cm(0.2));
  openBook.position.set(-cm(42), tH + cm(0.5), -cm(18));
  openBook.rotation.y = 0.08;
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(cm(6.5), cm(5), cm(0.9), 16), mats.porcelainGloss);
  saucer.position.set(-cm(16), tH + cm(0.8), -cm(16));
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.0), cm(3.0), cm(5.5), 16), mats.porcelainGloss);
  cup.position.set(-cm(16), tH + cm(3.8), -cm(16));
  diningGroup.add(openBook, saucer, cup);

  // 4 French Country Upholstered Dining Chairs (2 North facing +Z, 2 South facing -Z — exact blueprint offsets!)
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

  // 3-Arm French Country White & Brass Milk-Glass Chandelier above Dining Table
  const chand = new THREE.Group();
  chand.position.y = cm(212);
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(cm(7), cm(5), cm(4), 16), mats.antiqueBrass);
  canopy.position.y = cm(68);
  const downrod = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.8), cm(0.8), cm(68), 10), mats.antiqueBrass);
  downrod.position.y = cm(34);
  const hub = new THREE.Mesh(new THREE.SphereGeometry(cm(4.5), 14, 12), mats.creamShaker);
  chand.add(canopy, downrod, hub);

  const chandShadeMat = mats.milkGlassLamp.clone();
  for (let a = 0; a < 5; a++) {
    const ang = (a / 5) * Math.PI * 2;
    const r = cm(34);
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -cm(2), 0),
      new THREE.Vector3(Math.cos(ang) * r * 0.55, -cm(11), Math.sin(ang) * r * 0.55),
      new THREE.Vector3(Math.cos(ang) * r, cm(3), Math.sin(ang) * r),
    ]);
    const arm = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 14, cm(0.65), 8, false), mats.antiqueBrass);
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.5), cm(9.5), cm(11), 18, 1, true), chandShadeMat);
    bell.material.side = THREE.DoubleSide;
    bell.position.set(Math.cos(ang) * r, cm(8), Math.sin(ang) * r);
    chand.add(arm, bell);
  }
  const chandLight = new THREE.PointLight(0xffd89c, 0.9, 6.2, 1.6);
  chandLight.position.y = -cm(5);
  chand.add(chandLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: chandLight, mat: chandShadeMat, baseIntensity: 1.45 });
  }
  diningGroup.add(chand);

  tagItem(diningGroup, '法式鄉村風圓角白橡木大餐桌組', '200 × 90 cm｜車枳實木桌腳＋4 張亞麻軟墊鄉村餐椅＋五燈古典吊燈');
  zone.add(diningGroup);

  // B. NE Sunlit Lounge Reading Corner (Exact Blueprint Position & Angle!)
  const loungeGroup = new THREE.Group();
  // Round braided jute/cream rug underneath reading corner
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(cm(84), cm(84), cm(0.8), 40), mats.juteRug);
  rug.position.set(cm(742), cm(0.4), cm(350));
  zone.add(rug);

  // White Bouclé Curved Barrel Armchair at (755, 344) facing SW (-132 deg / -2.3 rad)
  const chair = new THREE.Group();
  chair.position.set(cm(758), 0, cm(346));
  chair.rotation.y = -Math.PI * 0.74; // faces SW into living/dining room just like blueprint!

  // Turned oak bun feet
  for (let f = 0; f < 4; f++) {
    const a = (f / 4) * Math.PI * 2 + Math.PI / 4;
    const foot = createTurnedLeg(cm(11), cm(2.8), mats.naturalOak);
    foot.position.set(Math.cos(a) * cm(31), 0, Math.sin(a) * cm(31));
    chair.add(foot);
  }
  // Base drum & plush seat cushion
  const baseSeat = new THREE.Mesh(new THREE.CylinderGeometry(cm(41), cm(39), cm(26), 28), mats.warmCreamFabric);
  baseSeat.position.y = cm(23);
  const plushSeat = new THREE.Mesh(new THREE.CylinderGeometry(cm(34), cm(34), cm(13), 24), mats.crispWhiteLinen);
  plushSeat.position.set(0, cm(38), cm(4));
  // Curved wraparound barrel backrest (220 deg arc around -Z and sides)
  const barrelBack = new THREE.Mesh(
    new THREE.CylinderGeometry(cm(43), cm(41), cm(48), 28, 1, false, Math.PI * 0.68, Math.PI * 1.64),
    mats.warmCreamFabric
  );
  barrelBack.position.y = cm(52);
  // Inner padded channel back
  const innerBack = new THREE.Mesh(
    new THREE.CylinderGeometry(cm(34), cm(33), cm(44), 24, 1, false, Math.PI * 0.72, Math.PI * 1.56),
    mats.crispWhiteLinen
  );
  innerBack.position.y = cm(52);
  // Accent lumbar pillow + draped oatmeal knit throw
  const throwPillow = createCountryPillow(cm(36), cm(14), cm(28), mats.sageCountryThrow);
  throwPillow.position.set(-cm(4), cm(50), -cm(18));
  throwPillow.rotation.x = 0.25;
  const knitThrow = createRoundedSlab(cm(28), cm(44), cm(3.2), cm(6), mats.oatmealLinen, cm(1.0));
  knitThrow.position.set(cm(32), cm(58), cm(8));
  knitThrow.rotation.z = -0.65;

  chair.add(baseSeat, plushSeat, barrelBack, innerBack, throwPillow, knitThrow);
  tagItem(chair, '陽光閱讀角純白弧形單人主人椅', '寬 86 × 深 84 cm｜純白圈圈紗圓弧包覆椅身＋鼠尾草綠抱枕＋針織披毯');
  loungeGroup.add(chair);

  // Round Pedestal Country Side Table & Lush Potted Plant (Exact Blueprint Position X=688, Z=296!)
  const sideTable = new THREE.Group();
  sideTable.position.set(cm(686), 0, cm(296));
  const stBase = new THREE.Mesh(new THREE.CylinderGeometry(cm(15), cm(17), cm(3.5), 20), mats.creamShaker);
  stBase.position.y = cm(1.75);
  const stPed = createTurnedLeg(cm(52), cm(4.2), mats.creamShaker);
  stPed.position.y = cm(3);
  const stTop = new THREE.Mesh(new THREE.CylinderGeometry(cm(23), cm(23), cm(2.8), 28), mats.naturalOak);
  stTop.position.y = cm(55);
  sideTable.add(stBase, stPed, stTop);

  // Star-leaf potted indoor plant right on/beside the round corner as drawn on the blueprint!
  const cornerPlant = createPottedPlant(mats, cm(52), cm(10));
  cornerPlant.position.y = cm(56.4);
  sideTable.add(cornerPlant);
  tagItem(sideTable, '車枳圓形邊几＆室內觀葉盆栽', 'Ø46 × 高 56 cm｜完全對應平面圖右上閱讀角圓几與星形植栽配置');
  loungeGroup.add(sideTable);

  // Tall White Turned-Wood Country Floor Lamp in NE corner (X = 808, Z = 294)
  const floorLamp = new THREE.Group();
  floorLamp.position.set(cm(808), 0, cm(294));
  const flBase = new THREE.Mesh(new THREE.CylinderGeometry(cm(15), cm(17), cm(3.5), 20), mats.creamShaker);
  flBase.position.y = cm(1.75);
  const flPole = createTurnedLeg(cm(148), cm(2.8), mats.creamShaker);
  flPole.position.y = cm(3.5);
  const flShadeMat = mats.milkGlassLamp.clone();
  const flShade = new THREE.Mesh(new THREE.CylinderGeometry(cm(14), cm(22), cm(26), 24, 1, true), flShadeMat);
  flShade.material.side = THREE.DoubleSide;
  flShade.position.y = cm(154);
  const flLight = new THREE.PointLight(0xffd28e, 0.55, 3.6, 1.8);
  flLight.position.y = cm(150);
  floorLamp.add(flBase, flPole, flShade, flLight);
  if (lightsRegistry) {
    lightsRegistry.push({ light: flLight, mat: flShadeMat, baseIntensity: 1.0 });
  }
  loungeGroup.add(floorLamp);

  zone.add(loungeGroup);
  enableShadows(zone, true, true);
  return zone;
}

// 4. Master Bedroom Suite: Queen Bed (185x190) + Curved Wardrobe (60x165 + R30 curve) + East Vanity Desk (72x50)
export function createMasterBedroomZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // A. Queen Size White Country Bed: X = 581..766 (185cm), Z = 64..254 (190cm, 5cm gap from South wall Z=259)
  // Headboard at South (+Z = 254), foot at North (Z = 64)
  const bed = new THREE.Group();
  bed.position.set(cm(673.5), 0, cm(159));
  const bW = cm(185);
  const bL = cm(190);

  // Carved Beadboard Headboard at +Z
  const hbH = cm(124);
  const hbCore = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(10), hbH - cm(18), cm(4.5)), mats.beadboard);
  hbCore.position.set(0, hbH / 2 + cm(2), bL / 2 - cm(2.5));
  const hbCrown = new THREE.Mesh(new THREE.BoxGeometry(bW + cm(4), cm(6.5), cm(8.0)), mats.whiteTrim);
  hbCrown.position.set(0, hbH, bL / 2 - cm(2.5));
  bed.add(hbCore, hbCrown);

  // 4 Turned Posts with Acorn Finials
  for (const sx of [-bW / 2 + cm(3.5), bW / 2 - cm(3.5)]) {
    const hPost = new THREE.Mesh(new THREE.BoxGeometry(cm(7), hbH + cm(2), cm(7)), mats.creamShaker);
    hPost.position.set(sx, (hbH + cm(2)) / 2, bL / 2 - cm(2.5));
    const finial = new THREE.Mesh(new THREE.SphereGeometry(cm(3.8), 14, 12), mats.whiteTrim);
    finial.scale.set(1, 1.35, 1);
    finial.position.set(sx, hbH + cm(6.5), bL / 2 - cm(2.5));

    const fPost = new THREE.Mesh(new THREE.BoxGeometry(cm(6.5), cm(46), cm(6.5)), mats.creamShaker);
    fPost.position.set(sx, cm(23), -bL / 2 + cm(3));
    const fFinial = finial.clone();
    fFinial.scale.set(0.85, 1.15, 0.85);
    fFinial.position.set(sx, cm(49), -bL / 2 + cm(3));
    bed.add(hPost, finial, fPost, fFinial);
  }

  // Footboard & Side Rails
  const fbCore = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(10), cm(30), cm(4.0)), mats.beadboardFine);
  fbCore.position.set(0, cm(26), -bL / 2 + cm(3));
  const fbCap = new THREE.Mesh(new THREE.BoxGeometry(bW + cm(2), cm(4.0), cm(6.8)), mats.whiteTrim);
  fbCap.position.set(0, cm(43), -bL / 2 + cm(3));
  const frameBox = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(4), cm(22), bL - cm(6)), mats.creamShaker);
  frameBox.position.set(0, cm(22), 0);
  bed.add(fbCore, fbCap, frameBox);

  // Mattress + Crisp White Waffle Duvet + Folded Turn-Down Sheet Corner (matching blueprint!)
  const mattress = createRoundedSlab(cm(178), cm(182), cm(24), cm(8), mats.warmCreamFabric, cm(2.0));
  mattress.position.set(0, cm(31), 0);
  const duvet = createRoundedSlab(cm(182), cm(138), cm(9), cm(10), mats.crispWhiteLinen, cm(2.5));
  duvet.position.set(0, cm(49), -cm(19));
  // Diagonal folded blanket flap on East side matching the blueprint's angled fold line!
  const foldFlap = createRoundedSlab(cm(68), cm(36), cm(3.2), cm(4), mats.crispWhiteLinen, cm(0.8));
  foldFlap.position.set(cm(46), cm(57.2), cm(32));
  foldFlap.rotation.y = -0.46;
  // Oatmeal knit bed runner near foot
  const bedRunner = createRoundedSlab(cm(184), cm(42), cm(2.4), cm(5), mats.oatmealLinen, cm(0.8));
  bedRunner.position.set(0, cm(57.2), -cm(60));
  bed.add(mattress, duvet, foldFlap, bedRunner);

  // 2 Large Ruffled Country Pillows + 2 Accent Cushions (at +Z headboard)
  for (const px of [-cm(44), cm(44)]) {
    const backPillow = createCountryPillow(cm(68), cm(42), cm(15), mats.warmCreamFabric);
    backPillow.position.set(px, cm(62), cm(68));
    backPillow.rotation.x = -0.32;
    const frontPillow = createCountryPillow(cm(62), cm(38), cm(14), mats.crispWhiteLinen);
    frontPillow.position.set(px, cm(59), cm(52));
    frontPillow.rotation.x = -0.18;
    bed.add(backPillow, frontPillow);
  }
  const lumbar = createCountryPillow(cm(48), cm(24), cm(13), mats.sageCountryThrow);
  lumbar.position.set(0, cm(60), cm(38));
  lumbar.rotation.x = -0.15;
  bed.add(lumbar);

  // Soft bedroom rug extending around Queen bed
  const masterRug = createRoundedSlab(cm(225), cm(175), cm(0.8), cm(8), mats.warmCreamFabric, cm(0.2));
  masterRug.position.set(0, cm(0.3), -cm(18));
  bed.add(masterRug);

  tagItem(bed, '主臥純白鄉村風雙人加大床組 (Queen Size)', '185 × 190 cm（對應床墊 182×188）｜企口高背床頭板＋橡實柱頭＋純白華夫格寢具');
  zone.add(bed);

  // B. Master Wardrobe (60 x 165 cm, X = 521..581, Z = 94..259) + Exact 60 x 30 cm Curved North Corner Unit (Z = 64..94)!
  const wardGroup = new THREE.Group();
  const wD = cm(60);
  const wLen = cm(165);
  const wH = cm(242);
  // Main body strictly X = 522..581, Z = 94..259
  const wardBody = new THREE.Mesh(new THREE.BoxGeometry(cm(59), wH - cm(12), wLen), mats.warmIvoryCabinet);
  wardBody.position.set(cm(551.5), (wH - cm(12)) / 2 + cm(6), cm(176.5));
  const wardPlinth = new THREE.Mesh(new THREE.BoxGeometry(cm(57), cm(6), wLen), mats.whiteTrim);
  wardPlinth.position.set(cm(552.5), cm(3), cm(176.5));
  // Crown flush on East (X = 581) and South (Z = 259), subtle 2cm lip only on West front (X = 519..581)
  const wardCrown = new THREE.Mesh(new THREE.BoxGeometry(cm(62), cm(6), wLen), mats.whiteTrim);
  wardCrown.position.set(cm(550), wH - cm(3), cm(176.5));
  wardGroup.add(wardBody, wardPlinth, wardCrown);

  // 3 Shaker Wardrobe Doors facing West (-X) into the 93 cm dressing corridor
  const mdW = wLen / 3;
  for (let i = 0; i < 3; i++) {
    const dz = cm(94) + mdW * (i + 0.5);
    const face = createShakerDoorFace(mdW - cm(0.8), wH - cm(16), mats, {
      louver: i === 1,
      knobSide: i === 2 ? 'left' : 'right',
      knobYRatio: 0.46,
    });
    face.rotation.y = -Math.PI / 2;
    face.position.set(cm(521), wH / 2, dz);
    wardGroup.add(face);
  }

  // Exact Bounded Quarter-Ellipse North Transition Unit: strictly inside X = [521..581] cm, Z = [64..94] cm!
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
      const wx = pos.getX(i);
      const wz = pos.getY(i);
      const wy = yBottom + pos.getZ(i);
      pos.setXYZ(i, wx, wy, wz);
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

  // East back panel strictly Z = 64..94, X = 578.5..581
  const curveBack = new THREE.Mesh(new THREE.BoxGeometry(cm(2.5), wH - cm(6), cm(30)), mats.warmIvoryCabinet);
  curveBack.position.set(cm(579.75), (wH - cm(6)) / 2, cm(79));
  // Plinth & Top Crown strictly bounded to 60x30 / 61x30.5 cm
  const cPlinth = makeQuarterEllipseSlab(57, 28.5, 0, cm(6), mats.whiteTrim);
  const cCrown = makeQuarterEllipseSlab(61, 30.2, wH - cm(6), cm(6), mats.whiteTrim);
  wardGroup.add(curveBack, cPlinth, cCrown);

  for (let s = 0; s < 5; s++) {
    const sy = cm(6) + (s / 4) * (wH - cm(14.5));
    const qShelf = makeQuarterEllipseSlab(59, 29.5, sy, cm(2.4), s === 2 ? mats.naturalOak : mats.warmIvoryCabinet);
    wardGroup.add(qShelf);
    if (s >= 1 && s <= 3) {
      const decor = new THREE.Mesh(
        new THREE.CylinderGeometry(cm(3.2), cm(2.8), cm(9.5), 14),
        s === 2 ? mats.porcelainGloss : mats.sageCountryThrow
      );
      decor.position.set(cm(564), sy + cm(7.2), cm(83));
      wardGroup.add(decor);
    }
  }

  tagItem(wardGroup, '主臥純白鄉村風衣櫃＋精準圓弧轉角展示櫃', '深 60 × 長 165 cm＋北側 60 × 30 cm 橢圓弧緩衝層架（嚴格對齊床邊與衣櫃邊界）');
  zone.add(wardGroup);

  // C. Master East Bedside Vanity / Study Desk (X = 766..838 -> 72cm wide, Z = 209..259 -> 50cm deep)
  const vanity = createCountryStudyDesk(cm(72), cm(50), mats, {
    lampLocalX: -cm(22), // SW corner of desk matching ⊕ crosshair on blueprint!
    lampLocalZ: cm(13),
    lightsRegistry,
    hasMirrorOnSouthWall: true,
  });
  vanity.position.set(cm(802), 0, cm(234));
  // Upholstered chair tucked North of desk facing South (+Z) into desk, exact to blueprint!
  const vChair = createWindsorChair(mats, mats.crispWhiteLinen);
  vChair.position.set(cm(802), 0, cm(192)); // faces +Z (South) into vanity!
  tagItem(vanity, '主臥鄉村風梳妝書桌組', '75 × 50 cm｜車枳桌腳＋百褶陶瓷檯燈（對應平面圖 ⊕ 燈位）＋圓拱壁鏡');
  zone.add(vanity, vChair);

  enableShadows(zone, true, true);
  return zone;
}

// Reusable Country Study / Vanity Desk (facing -Z by default so user sits at -Z looking +Z toward South wall!)
export function createCountryStudyDesk(w, d, mats, opts = {}) {
  const { lampLocalX = -w * 0.32, lampLocalZ = d * 0.24, lightsRegistry = null, hasMirrorOnSouthWall = false } = opts;
  const g = new THREE.Group();
  const h = cm(75);

  const top = createRoundedSlab(w, d, cm(3.0), cm(3), mats.naturalOak, cm(0.4));
  top.position.y = h - cm(3.0);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(w - cm(10), cm(11), d - cm(8)), mats.creamShaker);
  apron.position.y = h - cm(8.5);
  g.add(top, apron);

  const numDrw = w > cm(80) ? 2 : 1;
  const drwW = (w - cm(12)) / numDrw;
  for (let i = 0; i < numDrw; i++) {
    const df = createDrawerFront(drwW - cm(1), cm(9.5), mats, true);
    df.rotation.y = Math.PI; // face -Z (North, where chair sits!)
    df.position.set(-w / 2 + cm(6) + drwW * (i + 0.5), h - cm(8.5), -d / 2 + cm(3.5));
    g.add(df);
  }

  for (const [lx, lz] of [
    [-w / 2 + cm(6), -d / 2 + cm(6)],
    [w / 2 - cm(6), -d / 2 + cm(6)],
    [-w / 2 + cm(6), d / 2 - cm(6)],
    [w / 2 - cm(6), d / 2 - cm(6)],
  ]) {
    const leg = createTurnedLeg(h - cm(2.8), cm(2.4), mats.creamShaker);
    leg.position.set(lx, 0, lz);
    g.add(leg);
  }

  // Pleated Ceramic Table Lamp at exact blueprint ⊕ mark
  const lamp = createPleatedTableLamp(mats, lightsRegistry, cm(42));
  lamp.position.set(lampLocalX, h, lampLocalZ);
  g.add(lamp);

  // Open notebook / books on opposite side
  const book1 = createRoundedSlab(cm(21), cm(16), cm(2.2), cm(1), mats.crispWhiteLinen, cm(0.2));
  book1.position.set(-lampLocalX * 0.65, h, cm(2));
  g.add(book1);

  if (hasMirrorOnSouthWall) {
    // Oval White-Framed Country Vanity Mirror mounted on South wall (+Z)
    const mFrame = new THREE.Mesh(new THREE.CylinderGeometry(cm(22), cm(22), cm(2.2), 28), mats.whiteTrim);
    mFrame.rotation.x = Math.PI / 2;
    mFrame.scale.set(0.95, 1, 1.32);
    mFrame.position.set(0, cm(128), d / 2 - cm(1.2));
    const mGlass = new THREE.Mesh(new THREE.CylinderGeometry(cm(18.5), cm(18.5), cm(2.5), 28), mats.mirror);
    mGlass.rotation.x = Math.PI / 2;
    mGlass.scale.set(0.95, 1, 1.32);
    mGlass.position.set(0, cm(128), d / 2 - cm(1.1));
    g.add(mFrame, mGlass);
  }

  enableShadows(g, true, true);
  return g;
}

// 5. South Bedrooms (Bedroom 2 SW & Bedroom 3 SE)
export function createSouthBedroomsZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // Helper: Country Wardrobe / Bookcase along North wall facing South (+Z)
  function makeBuiltIn(cx, cz, w, d, doorsCount, isBookcase, label) {
    const h = cm(242);
    const unit = new THREE.Group();
    unit.position.set(cx, 0, cz);
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - cm(8), d - cm(2)), mats.warmIvoryCabinet);
    body.position.set(0, (h - cm(8)) / 2 + cm(4), -cm(1));
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w - cm(2), cm(6), d - cm(4)), mats.whiteTrim);
    plinth.position.set(0, cm(3), -cm(2));
    const crown = new THREE.Mesh(new THREE.BoxGeometry(w + cm(3), cm(6), d + cm(3)), mats.whiteTrim);
    crown.position.set(0, h - cm(1), cm(1));
    unit.add(body, plinth, crown);

    if (isBookcase) {
      // Lower Shaker door + Upper Glass/Open Country Bookcase with books
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
    tagItem(unit, label, `寬 ${Math.round(w * 100)} × 深 ${Math.round(d * 100)} × 高 242 cm｜純白鄉村風頂天系統櫃`);
    return unit;
  }

  // Helper: Country Single Daybed / Bed (188 x 110 cm) against South wall (+Z)
  function makeSingleBed(cx, cz, headAtEast, throwMat, label) {
    const bW = cm(188);
    const bD = cm(110);
    const g = new THREE.Group();
    g.position.set(cx, 0, cz);
    const headSign = headAtEast ? 1 : -1;

    // Headboard at headSign * bW/2, Footboard at -headSign * bW/2, Back guard rail along +Z (South wall)
    const hb = new THREE.Mesh(new THREE.BoxGeometry(cm(5), cm(102), bD), mats.beadboard);
    hb.position.set(headSign * (bW / 2 - cm(2.5)), cm(51), 0);
    const hbCap = new THREE.Mesh(new THREE.BoxGeometry(cm(7.5), cm(5), bD + cm(4)), mats.whiteTrim);
    hbCap.position.set(headSign * (bW / 2 - cm(2.5)), cm(103), 0);

    const fb = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), cm(62), bD), mats.beadboardFine);
    fb.position.set(-headSign * (bW / 2 - cm(2.25)), cm(31), 0);
    const fbCap = new THREE.Mesh(new THREE.BoxGeometry(cm(6.5), cm(4), bD + cm(3)), mats.whiteTrim);
    fbCap.position.set(-headSign * (bW / 2 - cm(2.25)), cm(63), 0);

    const wallRail = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(6), cm(78), cm(4)), mats.beadboard);
    wallRail.position.set(0, cm(39), bD / 2 - cm(2));
    const base = new THREE.Mesh(new THREE.BoxGeometry(bW - cm(4), cm(26), bD - cm(4)), mats.creamShaker);
    base.position.set(0, cm(15), 0);
    g.add(hb, hbCap, fb, fbCap, wallRail, base);

    // 2 Country Under-Bed Storage Drawers facing North (-Z)
    for (const dx of [-cm(44), cm(44)]) {
      const drw = createDrawerFront(cm(84), cm(19), mats, true);
      drw.rotation.y = Math.PI;
      drw.position.set(dx, cm(14), -bD / 2 + cm(2));
      g.add(drw);
    }

    // Mattress + Crisp White Duvet + Angled Folded Corner + Ruffled Pillow
    const mat = createRoundedSlab(bW - cm(10), bD - cm(8), cm(20), cm(6), mats.warmCreamFabric, cm(1.5));
    mat.position.set(0, cm(28), -cm(1));
    const duv = createRoundedSlab(cm(138), bD - cm(6), cm(7.5), cm(8), mats.crispWhiteLinen, cm(2.0));
    duv.position.set(-headSign * cm(18), cm(43), -cm(1));
    const throwBlanket = createRoundedSlab(cm(42), bD - cm(5), cm(2.2), cm(5), throwMat, cm(0.8));
    throwBlanket.position.set(-headSign * cm(60), cm(50.5), -cm(1));

    const pillow = createCountryPillow(cm(42), cm(64), cm(14), mats.crispWhiteLinen);
    pillow.position.set(headSign * cm(64), cm(54), 0);
    pillow.rotation.z = headSign * 0.22;
    const cushion = createCountryPillow(cm(28), cm(38), cm(12), throwMat);
    cushion.position.set(headSign * cm(44), cm(53), cm(16));

    g.add(mat, duv, throwBlanket, pillow, cushion);
    tagItem(g, label, '188 × 110 cm（單人加大 106×188）｜純白企口靠牆護欄床架＋床下雙抽屜收納');
    return g;
  }

  // --- SW Bedroom 2 (X = 264..546, Z = 567..803) ---
  zone.add(makeBuiltIn(cm(284), cm(597), cm(40), cm(60), 1, false, '西南次臥門側收納高櫃 (40×60)'));
  zone.add(makeBuiltIn(cm(419.5), cm(597), cm(35), cm(60), 1, true, '西南次臥格柵玻璃書櫃 (35×60)'));
  zone.add(makeBuiltIn(cm(491.5), cm(597), cm(109), cm(60), 2, false, '西南次臥雙門鄉村風衣櫃 (109×60)'));
  zone.add(makeSingleBed(cm(452), cm(748), true, mats.sageCountryThrow, '西南次臥純白鄉村風單人床'));

  const deskSW = createCountryStudyDesk(cm(94), cm(60), mats, {
    lampLocalX: -cm(31), // SW corner ⊕ symbol!
    lampLocalZ: cm(16),
    lightsRegistry,
  });
  deskSW.position.set(cm(311), 0, cm(773));
  tagItem(deskSW, '西南次臥鄉村風書桌 (94×60)', '94 × 60 cm｜白橡木桌面＋雙抽屜＋百褶陶瓷檯燈（對應平面圖左下 ⊕ 燈位）');
  const chairSW = createWindsorChair(mats, mats.warmCreamFabric);
  chairSW.position.set(cm(311), 0, cm(726));
  zone.add(deskSW, chairSW);

  enableShadows(zone, true, true);
  return zone;
}

// 6. Dual Bathrooms (Guest Bath Walk-In Shower & Master Bath Alcove Tub + Vanities + Toilets)
export function createBathroomsZone(mats, lightsRegistry) {
  const zone = new THREE.Group();

  // Helper: Skirted White Ceramic Toilet
  function makeToilet(facingDirX) {
    const t = new THREE.Group();
    const tank = createRoundedSlab(cm(20), cm(40), cm(42), cm(4), mats.porcelainGloss, cm(0.8));
    tank.position.set(-facingDirX * cm(22), cm(38), 0);
    const lid = createRoundedSlab(cm(22), cm(42), cm(3), cm(4), mats.porcelainGloss, cm(0.5));
    lid.position.set(-facingDirX * cm(22), cm(80), 0);
    const base = createRoundedSlab(cm(52), cm(37), cm(39), cm(16), mats.porcelainGloss, cm(1.5));
    base.position.set(facingDirX * cm(2), 0, 0);
    const seat = createRoundedSlab(cm(44), cm(37), cm(3.2), cm(16), mats.porcelainGloss, cm(0.8));
    seat.position.set(facingDirX * cm(5), cm(39), 0);
    const flushBtn = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.2), cm(2.2), cm(1.2), 14), mats.antiqueBrass);
    flushBtn.position.set(-facingDirX * cm(22), cm(83.2), 0);
    t.add(tank, lid, base, seat, flushBtn);
    tagItem(t, '純白一體式陶瓷馬桶', '省水靜音緩降蓋板＋復古銅金按鍵');
    return t;
  }

  // Helper: Country Bathroom Vanity with Oval Undermount Sink & Arched Mirror + Sconce
  function makeBathVanity(w, d, wallAtEast, lightsReg, label) {
    const v = new THREE.Group();
    const h = cm(84);
    const sign = wallAtEast ? 1 : -1; // wall with faucet & mirror is at +X (Guest Bath) or -X (Master Bath)

    const body = new THREE.Mesh(new THREE.BoxGeometry(w - cm(2), h - cm(12), d - cm(2)), mats.creamShaker);
    body.position.set(0, (h - cm(12)) / 2 + cm(8), 0);
    // Turned vanity legs
    for (const [lx, lz] of [[-w / 2 + cm(4), -d / 2 + cm(4)], [w / 2 - cm(4), -d / 2 + cm(4)], [-w / 2 + cm(4), d / 2 - cm(4)], [w / 2 - cm(4), d / 2 - cm(4)]]) {
      const leg = createTurnedLeg(cm(10), cm(2.0), mats.creamShaker);
      leg.position.set(lx, 0, lz);
      v.add(leg);
    }
    const door = createShakerDoorFace(d - cm(6), h - cm(20), mats, { knobSide: 'right', knobYRatio: 0.78 });
    door.rotation.y = -sign * (Math.PI / 2);
    door.position.set(-sign * (w / 2), h / 2 + cm(2), 0);
    const top = createRoundedSlab(w + cm(2), d + cm(2), cm(3.2), cm(1.5), mats.marbleTop, cm(0.3));
    top.position.set(0, h - cm(3.2), 0);

    // Oval undermount sink rim & recessed basin (exact match to double-oval sink drawing in q1_top_left!)
    const basinOuter = new THREE.Mesh(new THREE.CylinderGeometry(cm(19), cm(16), cm(12), 24), mats.porcelainGloss);
    basinOuter.scale.set(0.82, 1, 1.18);
    basinOuter.position.set(-sign * cm(2), h - cm(6.5), 0);
    const basinRim = new THREE.Mesh(new THREE.TorusGeometry(cm(18), cm(1.4), 10, 28), mats.porcelainGloss);
    basinRim.rotation.x = Math.PI / 2;
    basinRim.scale.set(0.82, 1.18, 1);
    basinRim.position.set(-sign * cm(2), h + cm(0.3), 0);

    // Arched brass faucet mounted on divider wall side
    const fSpout = new THREE.Mesh(new THREE.TorusGeometry(cm(7), cm(0.8), 8, 16, Math.PI), mats.antiqueBrass);
    fSpout.rotation.y = sign > 0 ? Math.PI : 0;
    fSpout.position.set(sign * (w / 2 - cm(10)), h + cm(6), 0);
    const fPost = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.2), cm(1.5), cm(7), 12), mats.antiqueBrass);
    fPost.position.set(sign * (w / 2 - cm(3)), h + cm(3), 0);

    // Arched Brass/White Mirror on divider wall
    const mirFrame = new THREE.Mesh(new THREE.CylinderGeometry(cm(24), cm(24), cm(2.0), 28), mats.antiqueBrass);
    mirFrame.rotation.z = Math.PI / 2;
    mirFrame.scale.set(1.32, 1, 0.92);
    mirFrame.position.set(sign * (w / 2 - cm(1)), cm(142), 0);
    const mirGlass = new THREE.Mesh(new THREE.CylinderGeometry(cm(22), cm(22), cm(2.3), 28), mats.mirror);
    mirGlass.rotation.z = Math.PI / 2;
    mirGlass.scale.set(1.32, 1, 0.92);
    mirGlass.position.set(sign * (w / 2 - cm(1)), cm(142), 0);

    // Warm Sconce above mirror
    const scMat = mats.milkGlassLamp.clone();
    const sconce = new THREE.Mesh(new THREE.SphereGeometry(cm(5.5), 14, 12), scMat);
    sconce.position.set(sign * (w / 2 - cm(7)), cm(184), 0);
    const scLight = new THREE.PointLight(0xffd79b, 0.45, 2.8, 1.8);
    scLight.position.set(-sign * cm(10), cm(175), 0);
    if (lightsReg) {
      lightsReg.push({ light: scLight, mat: scMat, baseIntensity: 0.85 });
    }

    v.add(body, door, top, basinOuter, basinRim, fSpout, fPost, mirFrame, mirGlass, sconce, scLight);
    tagItem(v, label, `${Math.round(w * 100)} × ${Math.round(d * 100)} cm｜卡拉卡塔石紋檯面＋橢圓陶瓷下嵌盆＋復古銅金龍頭與圓拱鏡`);
    return v;
  }

  // --- Guest Bathroom (NW: X = 109..258, Z = 15..259) ---
  // Walk-In Glass Shower (X = 109..218, Z = 15..103)
  const showerCurb = new THREE.Mesh(new THREE.BoxGeometry(cm(109), cm(5), cm(6)), mats.marbleTop);
  showerCurb.position.set(cm(163.5), cm(2.5), cm(103));
  const showerScreen = new THREE.Mesh(new THREE.BoxGeometry(cm(72), cm(200), cm(1.2)), mats.clearGlass);
  showerScreen.position.set(cm(182), cm(105), cm(103));
  const showerDoor = new THREE.Mesh(new THREE.BoxGeometry(cm(37), cm(200), cm(1.2)), mats.clearGlass);
  showerDoor.position.set(cm(127.5), cm(105), cm(103));
  const showerBar = new THREE.Mesh(new THREE.BoxGeometry(cm(109), cm(2.2), cm(2.5)), mats.antiqueBrass);
  showerBar.position.set(cm(163.5), cm(205), cm(103));
  // Brass rain showerhead on East pipe-shaft wall (X = 218, Z = 58)
  const riser = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.8), cm(0.8), cm(105), 10), mats.antiqueBrass);
  riser.position.set(cm(214), cm(158), cm(58));
  const rainHead = new THREE.Mesh(new THREE.CylinderGeometry(cm(11), cm(11), cm(1.4), 20), mats.antiqueBrass);
  rainHead.position.set(cm(195), cm(206), cm(58));
  const mixer = new THREE.Mesh(new THREE.BoxGeometry(cm(5), cm(8), cm(18)), mats.antiqueBrass);
  mixer.position.set(cm(215), cm(108), cm(58));
  zone.add(showerCurb, showerScreen, showerDoor, showerBar, riser, rainHead, mixer);

  const guestToilet = makeToilet(-1); // faces West (-X), back against X = 258
  guestToilet.position.set(cm(226), 0, cm(146));
  const guestVanity = makeBathVanity(cm(58), cm(66), true, lightsRegistry, '客浴純白鄉村風洗手台浴櫃');
  guestVanity.position.set(cm(229), 0, cm(225));
  zone.add(guestToilet, guestVanity);

  // --- Master En-Suite Bathroom (X = 269..418, Z = 15..259) ---
  // Built-In Country Paneled Bathtub: X = 269..418 (149cm), Z = 15..90 (75cm)
  const tubGroup = new THREE.Group();
  tubGroup.position.set(cm(343.5), 0, cm(52.5));
  const tubDeckH = cm(56);
  // Outer Shaker paneled apron + marble rim deck + inner sculpted porcelain tub basin
  const tubApron = new THREE.Mesh(new THREE.BoxGeometry(cm(149), tubDeckH - cm(3), cm(4)), mats.beadboardFine);
  tubApron.position.set(0, (tubDeckH - cm(3)) / 2, cm(35.5));
  const rimN = new THREE.Mesh(new THREE.BoxGeometry(cm(149), tubDeckH, cm(9)), mats.porcelainGloss);
  rimN.position.set(0, tubDeckH / 2, -cm(33));
  const rimS = rimN.clone();
  rimS.position.z = cm(33);
  const rimW = new THREE.Mesh(new THREE.BoxGeometry(cm(12), tubDeckH, cm(57)), mats.porcelainGloss);
  rimW.position.set(-cm(68.5), tubDeckH / 2, 0);
  const rimE = rimW.clone();
  rimE.position.x = cm(68.5);
  const tubFloor = new THREE.Mesh(new THREE.BoxGeometry(cm(126), cm(8), cm(58)), mats.porcelainGloss);
  tubFloor.position.set(0, cm(4), 0);
  const tubDrain = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.6), cm(2.6), cm(0.6), 16), mats.antiqueBrass);
  tubDrain.position.set(-cm(42), cm(8.3), 0);
  // Brass tub filler on West pipe-shaft side (-X) matching blueprint!
  const tubSpout = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.4), cm(1.4), cm(14), 12), mats.antiqueBrass);
  tubSpout.rotation.z = Math.PI / 2;
  tubSpout.position.set(-cm(66), tubDeckH + cm(6), 0);
  // Natural Oak Country Bath Caddy Tray across tub
  const caddy = createRoundedSlab(cm(22), cm(74), cm(2.0), cm(2), mats.naturalOak, cm(0.3));
  caddy.position.set(cm(12), tubDeckH + cm(0.2), 0);
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.5), cm(3.5), cm(7), 14), mats.creamShaker);
  candle.position.set(cm(12), tubDeckH + cm(5.5), -cm(14));
  tubGroup.add(tubApron, rimN, rimS, rimW, rimE, tubFloor, tubDrain, tubSpout, caddy, candle);
  tagItem(tubGroup, '主衛嵌入式純白鄉村風浴缸', '149 × 75 cm｜企口線板浴缸裙邊＋復古銅金出水龍頭＋白橡木泡澡托盤');
  zone.add(tubGroup);

  const masterToilet = makeToilet(1); // faces East (+X), back against X = 269
  masterToilet.position.set(cm(301), 0, cm(135));
  const masterVanity = makeBathVanity(cm(58), cm(68), false, lightsRegistry, '主衛純白鄉村風洗手台浴櫃');
  masterVanity.position.set(cm(298), 0, cm(224));
  zone.add(masterToilet, masterVanity);

  enableShadows(zone, true, true);
  return zone;
}

// 7. SW Utility Balcony (Laundry Washer/Dryer + Utility Sink + Herb Planters) & 2 Outdoor AC Units
export function createUtilityBalconyZone(mats) {
  const zone = new THREE.Group();

  // Stacked White Front-Load Washer & Dryer tucked cleanly on East side of Utility Balcony (X = 216, Z = 702)
  const laundry = new THREE.Group();
  laundry.position.set(cm(218), 0, cm(702));
  for (let tier = 0; tier < 2; tier++) {
    const wy = tier * cm(86);
    const box = createRoundedSlab(cm(60), cm(60), cm(84), cm(3), mats.creamShaker, cm(0.5));
    box.position.y = wy;
    const drumFrame = new THREE.Mesh(new THREE.TorusGeometry(cm(17), cm(2.4), 10, 24), mats.antiqueBrass);
    drumFrame.rotation.y = Math.PI / 2;
    drumFrame.position.set(-cm(30.5), wy + cm(42), 0);
    const drumGlass = new THREE.Mesh(new THREE.CylinderGeometry(cm(16), cm(16), cm(3), 24), mats.castIronDark);
    drumGlass.rotation.z = Math.PI / 2;
    drumGlass.position.set(-cm(29.5), wy + cm(42), 0);
    laundry.add(box, drumFrame, drumGlass);
  }
  tagItem(laundry, '工作陽台純白洗脫烘衣塔', '60 × 60 × 170 cm｜上下堆疊滾筒洗衣機與乾衣機');
  zone.add(laundry);

  // Country Utility Ceramic Washbasin on West side next to pipe shaft (X = 48, Z = 768)
  const sinkUnit = new THREE.Group();
  sinkUnit.position.set(cm(52), 0, cm(768));
  const sCab = new THREE.Mesh(new THREE.BoxGeometry(cm(54), cm(78), cm(48)), mats.creamShaker);
  sCab.position.y = cm(39);
  const sTop = createRoundedSlab(cm(56), cm(50), cm(14), cm(3), mats.porcelainGloss, cm(0.5));
  sTop.position.y = cm(74);
  sinkUnit.add(sCab, sTop);
  zone.add(sinkUnit);

  // Potted Herbs on Balcony + NW Planter Recess Greenery
  const balconyPlant = createPottedPlant(mats, cm(78), cm(14));
  balconyPlant.position.set(cm(118), 0, cm(772));
  zone.add(balconyPlant);

  // 2 Outdoor AC Condenser Units mounted outside South Balcony Wall (Z = 816..848, exact match to q3_bot_left!)
  for (const acX of [cm(88), cm(186)]) {
    const ac = new THREE.Group();
    ac.position.set(acX, cm(22), cm(832));
    const casing = createRoundedSlab(cm(78), cm(30), cm(58), cm(2.5), mats.warmIvoryCabinet, cm(0.4));
    const fanRing = new THREE.Mesh(new THREE.CylinderGeometry(cm(20), cm(20), cm(3), 24), mats.castIronDark);
    fanRing.rotation.x = Math.PI / 2;
    fanRing.position.set(-cm(10), cm(29), cm(14.5));
    // Louver grille bars
    for (let g = -4; g <= 4; g++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(cm(42), cm(0.8), cm(1.2)), mats.whiteTrim);
      bar.position.set(-cm(10), cm(29) + g * cm(4.5), cm(15.5));
      ac.add(bar);
    }
    ac.add(casing, fanRing);
    tagItem(ac, '分離式冷氣室外機', '依原始平面圖位置配置於西南工作陽台外牆支架');
    zone.add(ac);
  }

  enableShadows(zone, true, true);
  return zone;
}
