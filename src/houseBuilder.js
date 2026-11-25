import * as THREE from 'three';
import {
  cm,
  tagItem,
  createRoundedSlab,
  createCountryDoor,
  createCountryWindow,
  createFramedArt,
  createWallSwitchPanel,
  createFloorDoorstop,
} from './primitives.js';
import {
  createEntrywayShoeCabinet,
  createCountryKitchenZone,
  createDiningAndLoungeZone,
  createMasterBedroomZone,
  createSouthBedroomsZone,
  createBathroomsZone,
  createUtilityBalconyZone,
} from './furniture.js';
import { createSEBedroomUltraDetail } from './seBedroomDetail.js';
import { createDimensionsGroup } from './dimensions.js';

export const WALL_FULL_H = cm(285);

export function buildCountryResidence(mats, sectionClipPlane) {
  const root = new THREE.Group();
  const doorsRegistry = [];
  const lightsRegistry = [];

  // 4 Unified Perimeter Facade Groups so an entire wall (piers + sills + lintels + windows + curtains + wainscot + wall shelves)
  // ALWAYS hides or stays visible as ONE complete unit with smooth opacity transition — NEVER half-hidden!
  const facades = {
    N: { group: new THREE.Group(), alpha: 1, targetAlpha: 1, hidden: false, matEntries: [] },
    S: { group: new THREE.Group(), alpha: 1, targetAlpha: 1, hidden: false, matEntries: [] },
    E: { group: new THREE.Group(), alpha: 1, targetAlpha: 1, hidden: false, matEntries: [] },
    W: { group: new THREE.Group(), alpha: 1, targetAlpha: 1, hidden: false, matEntries: [] },
  };
  const interiorArchGroup = new THREE.Group();
  root.add(facades.N.group, facades.S.group, facades.E.group, facades.W.group, interiorArchGroup);

  // ---------------------------------------------------------------------------
  // 1. Presentation Plinth & Multi-Zone Architectural Flooring
  // ---------------------------------------------------------------------------
  const plinthGroup = new THREE.Group();
  const outerBase = new THREE.Mesh(
    new THREE.BoxGeometry(cm(960), cm(14), cm(1020)),
    new THREE.MeshStandardMaterial({ color: 0xe6dfd3, roughness: 0.92 })
  );
  outerBase.position.set(cm(445), -cm(7.5), cm(465));
  outerBase.receiveShadow = true;
  plinthGroup.add(outerBase);

  function addFloorPatch(x1, z1, x2, z2, mat, yTop = 0, label = null) {
    const w = cm(x2 - x1);
    const d = cm(z2 - z1);
    const h = cm(4);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(cm((x1 + x2) / 2), yTop - h / 2, cm((z1 + z2) / 2));
    m.receiveShadow = true;
    if (label) tagItem(m, label, `${Math.round(x2 - x1)} × ${Math.round(z2 - z1)} cm`);
    plinthGroup.add(m);
    return m;
  }

  // Entryway Foyer French Octagonal Tile Dust-Zone
  addFloorPatch(15, 265, 186, 396, mats.foyerTile, cm(0.1), '玄關落塵區（法式八角復古花磚）');
  const brassStripE = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(0.5), cm(131)), mats.antiqueBrass);
  brassStripE.position.set(cm(186), cm(0.2), cm(330.5));
  const brassStripS = new THREE.Mesh(new THREE.BoxGeometry(cm(171), cm(0.5), cm(1.2)), mats.antiqueBrass);
  brassStripS.position.set(cm(100.5), cm(0.2), cm(396));
  plinthGroup.add(brassStripE, brassStripS);

  // Main Whitewashed Natural Oak Plank Flooring + SE Bedroom Pale Ash-Oak Flooring (matching image_2.jpeg!)
  addFloorPatch(186, 269, 838, 557, mats.oakFloor, 0, '客餐廳地坪（淺白刷紋橡木寬版木地板）');
  addFloorPatch(15, 396, 186, 652, mats.oakFloor, 0, '開放式廚房地坪（淺白刷紋橡木木地板）');
  addFloorPatch(428, 15, 838, 259, mats.oakFloor, 0, '主臥室地坪（淺白刷紋橡木寬版木地板）');
  addFloorPatch(264, 567, 546, 803, mats.oakFloor, 0, '西南次臥地坪（淺白刷紋橡木寬版木地板）');
  addFloorPatch(556, 567, 838, 803, mats.paleAshFloor, 0, '東南次臥地坪（淺灰白刷紋橡木木地板・依設計圖配置）');

  // Dual Bathrooms Hexagonal Carrara Tile Flooring + Recessed Shower Pan
  addFloorPatch(109, 103, 258, 259, mats.bathFloorHex, -cm(0.4), '客用衛浴乾區地坪（卡拉拉白大理石六角磚）');
  addFloorPatch(109, 15, 218, 103, mats.marbleTop, -cm(1.8), '客浴洩水坡度淋浴石材地面');
  addFloorPatch(269, 15, 418, 259, mats.bathFloorHex, -cm(0.4), '主臥衛浴地坪（卡拉拉白大理石六角磚）');

  // SW Utility Balcony & NW Architectural Recess
  addFloorPatch(15, 665, 254, 803, mats.balconyTile, -cm(1.5), '工作陽台防滑復古磚地坪');
  addFloorPatch(15, 15, 94, 250, mats.balconyTile, -cm(1.5), '西北側建築退縮花台區');
  addFloorPatch(15, 815, 254, 855, mats.wallExterior, -cm(2.0));
  const voidSlab = new THREE.Mesh(
    new THREE.BoxGeometry(cm(770), cm(2), cm(115)),
    new THREE.MeshStandardMaterial({ color: 0xdfd8ca, roughness: 0.95 })
  );
  voidSlab.position.set(cm(410), -cm(2.5), cm(892));
  voidSlab.receiveShadow = true;
  plinthGroup.add(voidSlab);
  root.add(plinthGroup);

  // ---------------------------------------------------------------------------
  // 2. Calibrated 1:1 Original Blueprint Overlay Plane
  // ---------------------------------------------------------------------------
  const texLoader = new THREE.TextureLoader();
  const bpTex = texLoader.load('./floorplan.jpeg');
  bpTex.colorSpace = THREE.SRGBColorSpace;
  bpTex.anisotropy = 8;
  const bpMat = new THREE.MeshBasicMaterial({
    map: bpTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });
  const bpMesh = new THREE.Mesh(new THREE.PlaneGeometry(cm(998.08), cm(1411.64)), bpMat);
  bpMesh.rotation.x = -Math.PI / 2;
  bpMesh.position.set(cm(430.11), cm(2.5), cm(457.68));
  bpMesh.renderOrder = 15;
  bpMesh.visible = false;
  root.add(bpMesh);

  // ---------------------------------------------------------------------------
  // 3. Structural & Partition Walls (Full 285 cm Height, Unified Facade Grouping)
  // ---------------------------------------------------------------------------
  function addWall(x1, z1, x2, z2, y1 = 0, y2 = 285, facadeKey = null, customMat = null) {
    const w = cm(x2 - x1);
    const d = cm(z2 - z1);
    const h = cm(y2 - y1);
    const mat = customMat || mats.wallPlaster;
    const boxMats = [mat, mat, mats.wallCutCap, mat, mat, mat];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), boxMats);
    mesh.position.set(cm((x1 + x2) / 2), cm(y1) + h / 2, cm((z1 + z2) / 2));
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const targetParent = facadeKey && facades[facadeKey] ? facades[facadeKey].group : interiorArchGroup;
    targetParent.add(mesh);
    return mesh;
  }

  // --- North Exterior Facade ('N': Z = 0..15 & NW recess South wall) ---
  addWall(94, 0, 853, 15, 0, 285, 'N');
  addWall(0, 250, 109, 265, 0, 285, 'N');

  // --- West Exterior Facade ('W': X = 0..15) ---
  addWall(0, 15, 15, 265, 0, 285, 'W');
  addWall(0, 265, 15, 277, 0, 285, 'W');
  addWall(0, 277, 15, 375, 212, 285, 'W'); // Entrance door lintel
  addWall(0, 375, 15, 815, 0, 285, 'W');
  addWall(0, 815, 15, 955, 0, 125, 'W');
  addWall(15, 665, 58, 734, 0, 285, 'W'); // Balcony West pipe shaft

  // --- East Exterior Facade ('E': X = 838..853) ---
  addWall(838, 15, 853, 72, 0, 285, 'E');
  // Window 1: Master Bed East (Z = 72..228, sill 82, head 232)
  addWall(838, 72, 853, 228, 0, 82, 'E');
  addWall(838, 72, 853, 228, 232, 285, 'E');
  addWall(838, 228, 853, 273, 0, 285, 'E');
  // Window 2: Living Room East (Z = 273..488, sill 72, head 235)
  addWall(838, 273, 853, 488, 0, 72, 'E');
  addWall(838, 273, 853, 488, 235, 285, 'E');
  addWall(838, 488, 853, 601, 0, 285, 'E');
  // Window 3: SE Bedroom 3 East (Z = 601..758, sill 88 matching image_2.jpeg!, head 232)
  addWall(838, 601, 853, 758, 0, 88, 'E');
  addWall(838, 601, 853, 758, 232, 285, 'E');
  addWall(838, 758, 853, 818, 0, 285, 'E');

  // --- South Exterior Facade ('S': Z = 803..818) ---
  addWall(254, 803, 289, 818, 0, 285, 'S');
  // Window 4: SW Bedroom 2 South (X = 289..451, sill 82, head 232)
  addWall(289, 803, 451, 818, 0, 82, 'S');
  addWall(289, 803, 451, 818, 232, 285, 'S');
  addWall(451, 803, 853, 818, 0, 285, 'S');
  addWall(15, 803, 254, 815, 0, 112, 'S'); // Utility Balcony South parapet

  // --- Interior Structural & Partition Walls (Never half-hidden!) ---
  addWall(94, 15, 109, 265, 0, 285, null); // Guest Bath West wall
  addWall(15, 392, 84, 402, 0, 285, null); // Kitchen North return stub

  // North Wing South Wall (Z = 259..269)
  addWall(109, 259, 114, 269, 0, 285, null);
  addWall(114, 259, 184, 269, 212, 285, null);
  addWall(184, 259, 433, 269, 0, 285, null);
  addWall(433, 259, 512, 269, 212, 285, null);
  addWall(512, 259, 838, 269, 0, 285, null);

  // Bathroom Pipe Shaft & Divider Wall
  addWall(218, 15, 228, 105, 0, 285, null, mats.subwayTile);
  addWall(228, 95, 258, 105, 0, 285, null, mats.subwayTile);
  addWall(258, 15, 269, 259, 0, 285, null, mats.subwayTile);
  const pipeChaseCore = new THREE.Mesh(new THREE.BoxGeometry(cm(30), cm(280), cm(80)), mats.wallCutCap);
  pipeChaseCore.position.set(cm(243), cm(140), cm(55));
  interiorArchGroup.add(pipeChaseCore);

  // Master Bathroom East Wall (X = 418..428)
  addWall(418, 15, 428, 186, 0, 285, null);
  addWall(418, 186, 428, 254, 212, 285, null);
  addWall(418, 254, 428, 259, 0, 285, null);

  // Kitchen / Utility Balcony Wall (Z = 652..665)
  addWall(15, 652, 92, 665, 0, 285, null);
  addWall(92, 652, 172, 665, 212, 285, null);
  addWall(172, 652, 254, 665, 0, 285, null);

  // SW Bedroom 2 West Wall (X = 254..264)
  addWall(254, 557, 264, 803, 0, 285, null);

  // South Bedrooms North Wall (Z = 557..567)
  addWall(264, 557, 313, 567, 0, 285, null);
  addWall(313, 557, 393, 567, 212, 285, null);
  addWall(393, 557, 754, 567, 0, 285, null);
  addWall(754, 557, 834, 567, 212, 285, null);
  addWall(834, 557, 838, 567, 0, 285, null);

  // Partition Wall between Bed 2 & Bed 3 (X = 546..556)
  addWall(546, 567, 556, 803, 0, 285, null);

  // ---------------------------------------------------------------------------
  // 4. Multi-Tier Wainscoting, Baseboards, Toggle Switches & Doorstops
  // ---------------------------------------------------------------------------
  function addWainscoting(x1, z1, x2, z2, faceNormalX, faceNormalZ, facadeKey = null) {
    const isHoriz = Math.abs(x2 - x1) > Math.abs(z2 - z1);
    const len = cm(isHoriz ? Math.abs(x2 - x1) : Math.abs(z2 - z1));
    const h = cm(94);
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(isHoriz ? len : cm(1.4), h, isHoriz ? cm(1.4) : len),
      mats.beadboard
    );
    const cx = cm((x1 + x2) / 2) + faceNormalX * cm(0.7);
    const cz = cm((z1 + z2) / 2) + faceNormalZ * cm(0.7);
    panel.position.set(cx, h / 2, cz);

    // 2-tier country dado chair rail (lower cove necking + upper bullnose cap)
    const neck = new THREE.Mesh(
      new THREE.BoxGeometry(isHoriz ? len : cm(2.2), cm(2.0), isHoriz ? cm(2.2) : len),
      mats.whiteTrim
    );
    neck.position.set(cx + faceNormalX * cm(0.45), h + cm(1.0), cz + faceNormalZ * cm(0.45));
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(isHoriz ? len : cm(3.4), cm(2.4), isHoriz ? cm(3.4) : len),
      mats.whiteTrim
    );
    cap.position.set(cx + faceNormalX * cm(0.85), h + cm(3.1), cz + faceNormalZ * cm(0.85));

    // Stepped ogee baseboard + floor shoe molding
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(isHoriz ? len : cm(2.4), cm(12.5), isHoriz ? cm(2.4) : len),
      mats.whiteTrim
    );
    base.position.set(cx + faceNormalX * cm(0.42), cm(6.25), cz + faceNormalZ * cm(0.42));
    const shoe = new THREE.Mesh(
      new THREE.BoxGeometry(isHoriz ? len : cm(3.1), cm(1.8), isHoriz ? cm(3.1) : len),
      mats.whiteTrim
    );
    shoe.position.set(cx + faceNormalX * cm(0.75), cm(0.9), cz + faceNormalZ * cm(0.75));

    const parent = facadeKey && facades[facadeKey] ? facades[facadeKey].group : interiorArchGroup;
    for (const m of [panel, neck, cap, base, shoe]) {
      m.receiveShadow = true;
      m.castShadow = true;
      parent.add(m);
    }
  }

  addWainscoting(516, 269, 838, 269, 0, 1, null);
  addWainscoting(396, 557, 750, 557, 0, -1, null);
  addWainscoting(838, 490, 838, 556, -1, 0, 'E');
  addWainscoting(15, 376, 15, 392, 1, 0, 'W');
  addWainscoting(15, 265, 110, 265, 0, 1, 'N');
  addWainscoting(581, 259, 838, 259, 0, -1, null);
  addWainscoting(428, 15, 838, 15, 0, 1, 'N');
  addWainscoting(264, 569, 264, 742, 1, 0, null);

  // Balcony South Parapet Stone Coping Cap & Stainless Floor Drain
  const parapetCap = createRoundedSlab(cm(243), cm(16), cm(3.0), cm(0.8), mats.marbleTop, cm(0.35));
  parapetCap.position.set(cm(134.5), cm(112), cm(809));
  facades.S.group.add(parapetCap);
  const balcDrain = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.5), cm(4.5), cm(0.4), 16), mats.stainlessSteel);
  balcDrain.position.set(cm(86), -cm(1.3), cm(785));
  plinthGroup.add(balcDrain);

  // Entryway Woven Jute & Linen Bordered Welcome Mat
  const welcomeMat = createRoundedSlab(cm(56), cm(86), cm(1.1), cm(3), mats.juteRug, cm(0.3));
  welcomeMat.position.set(cm(52), cm(0.1), cm(326));
  const welcomeBorder = createRoundedSlab(cm(58), cm(88), cm(0.6), cm(3.2), mats.oatmealLinen, cm(0.2));
  welcomeBorder.position.set(cm(52), cm(0.1), cm(326));
  tagItem(welcomeMat, '玄關亞麻滾邊編織迎賓地墊', '88 × 58 cm｜天然黃麻編織與亞麻布包邊');
  plinthGroup.add(welcomeBorder, welcomeMat);

  // SE Bedroom minimalist white baseboard along West & North inner walls
  const seBaseW = new THREE.Mesh(new THREE.BoxGeometry(cm(1.2), cm(8), cm(128)), mats.pureMatteWhite);
  seBaseW.position.set(cm(556.6), cm(4), cm(631));
  interiorArchGroup.add(seBaseW);

  // Vintage Porcelain & Brass Toggle Light Switches + Wall Receptacles
  const switchPlacements = [
    [104, 122, 269.4, 0, 'switch', 2],     // Foyer / Guest Bath switch
    [522, 122, 269.4, 0, 'switch', 3],     // Living / Dining chandelier switch
    [405, 122, 556.6, Math.PI, 'switch', 2], // South corridor switch
    [746, 122, 567.4, 0, 'switch', 2],     // SE Study room switch
    [594, 68, 258.6, Math.PI, 'outlet', 1], // Master bedside outlet
    [775, 62, 258.6, Math.PI, 'outlet', 1], // Master vanity outlet
  ];
  for (const [sx, sy, sz, rotY, sType, gangs] of switchPlacements) {
    const sw = createWallSwitchPanel(mats, sType, gangs);
    sw.position.set(cm(sx), cm(sy), cm(sz));
    sw.rotation.y = rotY;
    interiorArchGroup.add(sw);
  }

  // Brass & Rubber Floor Doorstops behind Hinged Interior Doors
  for (const [dx, dz] of [[182, 198], [508, 190], [386, 636]]) {
    const ds = createFloorDoorstop(mats);
    ds.position.set(cm(dx), 0, cm(dz));
    plinthGroup.add(ds);
  }

  // Wall Botanical Artworks (Interior walls + Foyer North wall)
  const mArt0 = createFramedArt(cm(38), cm(48), mats.art0, mats);
  mArt0.rotation.y = Math.PI;
  mArt0.position.set(cm(626), cm(174), cm(257.5));
  const mArt1 = createFramedArt(cm(38), cm(48), mats.art1, mats);
  mArt1.rotation.y = Math.PI;
  mArt1.position.set(cm(673.5), cm(174), cm(257.5));
  const mArt2 = createFramedArt(cm(38), cm(48), mats.art2, mats);
  mArt2.rotation.y = Math.PI;
  mArt2.position.set(cm(721), cm(174), cm(257.5));

  const lArt1 = createFramedArt(cm(46), cm(58), mats.art0, mats);
  lArt1.rotation.y = Math.PI;
  lArt1.position.set(cm(544), cm(166), cm(555.5));
  const lArt2 = createFramedArt(cm(46), cm(58), mats.art2, mats);
  lArt2.rotation.y = Math.PI;
  lArt2.position.set(cm(606), cm(166), cm(555.5));
  const fArt = createFramedArt(cm(40), cm(50), mats.art3 || mats.art1, mats);
  fArt.position.set(cm(62), cm(168), cm(266.5));
  facades.N.group.add(fArt);
  interiorArchGroup.add(mArt0, mArt1, mArt2, lArt1, lArt2);

  // ---------------------------------------------------------------------------
  // 5. 7 Hinged Interactive Country Doors & Windows (Grouped with Host Facades)
  // ---------------------------------------------------------------------------
  // Main Entrance Door on West Facade ('W')
  facades.W.group.add(
    createCountryDoor(
      {
        name: '玄關純白鄉村風雙面線板大門',
        hingeX: cm(7.5),
        hingeZ: cm(277),
        width: cm(97),
        wallThick: cm(15),
        axis: 'z',
        leafDir: 1,
        openAngle: Math.PI * 0.48,
        style: 'entrance',
      },
      mats,
      doorsRegistry
    )
  );

  // 6 Interior Doors
  interiorArchGroup.add(
    createCountryDoor(
      {
        name: '客用衛浴長虹玻璃格柵門',
        hingeX: cm(114),
        hingeZ: cm(264),
        width: cm(70),
        wallThick: cm(10),
        axis: 'x',
        leafDir: 1,
        openAngle: Math.PI * 0.46,
        style: 'bath',
      },
      mats,
      doorsRegistry
    ),
    createCountryDoor(
      {
        name: '主臥衛浴長虹玻璃格柵門',
        hingeX: cm(423),
        hingeZ: cm(254),
        width: cm(68),
        wallThick: cm(10),
        axis: 'z',
        leafDir: -1,
        openAngle: Math.PI * 0.47,
        style: 'bath',
      },
      mats,
      doorsRegistry
    ),
    createCountryDoor(
      {
        name: '主臥室純白鄉村風房門',
        hingeX: cm(433),
        hingeZ: cm(264),
        width: cm(79),
        wallThick: cm(10),
        axis: 'x',
        leafDir: 1,
        openAngle: Math.PI * 0.47,
        style: 'panel',
      },
      mats,
      doorsRegistry
    ),
    createCountryDoor(
      {
        name: '廚房通往工作陽台鄉村風採光門',
        hingeX: cm(172),
        hingeZ: cm(658.5),
        width: cm(80),
        wallThick: cm(13),
        axis: 'x',
        leafDir: -1,
        openAngle: -Math.PI * 0.46,
        style: 'balcony',
      },
      mats,
      doorsRegistry
    ),
    createCountryDoor(
      {
        name: '西南次臥純白鄉村風房門',
        hingeX: cm(313),
        hingeZ: cm(562),
        width: cm(80),
        wallThick: cm(10),
        axis: 'x',
        leafDir: 1,
        openAngle: -Math.PI * 0.47,
        style: 'panel',
      },
      mats,
      doorsRegistry
    ),
    createCountryDoor(
      {
        name: '東南次臥純白極簡線板房門',
        hingeX: cm(834),
        hingeZ: cm(562),
        width: cm(80),
        wallThick: cm(10),
        axis: 'x',
        leafDir: -1,
        openAngle: Math.PI * 0.40, // slightly angled so it clears the tailored window curtain gracefully
        style: 'panel',
      },
      mats,
      doorsRegistry
    )
  );

  // Windows on East ('E') & South ('S') Facades (Note: SE Bedroom window is built in createSEBedroomUltraDetail!)
  facades.E.group.add(
    createCountryWindow(
      {
        name: '主臥東向鄉村風採光格柵窗',
        cx: cm(845.5),
        cz: cm(150),
        totalLen: cm(156),
        sillY: cm(82),
        headY: cm(232),
        wallThick: cm(15),
        wallAxis: 'z',
        inwardSign: -1,
        casementRatio: 0.37,
        casementAtStart: false,
      },
      mats
    ),
    createCountryWindow(
      {
        name: '客餐廳東向大面景觀格柵窗',
        cx: cm(845.5),
        cz: cm(380.5),
        totalLen: cm(215),
        sillY: cm(72),
        headY: cm(235),
        wallThick: cm(15),
        wallAxis: 'z',
        inwardSign: -1,
        casementRatio: 0.31,
        casementAtStart: true,
      },
      mats
    )
  );

  facades.S.group.add(
    createCountryWindow(
      {
        name: '西南次臥南向格柵採光窗',
        cx: cm(370),
        cz: cm(810.5),
        totalLen: cm(162),
        sillY: cm(82),
        headY: cm(232),
        wallThick: cm(15),
        wallAxis: 'x',
        inwardSign: -1,
        casementRatio: 0.37,
        casementAtStart: true,
      },
      mats
    )
  );

  // ---------------------------------------------------------------------------
  // 6. Ceiling Group (Coffered Beams + Carved Medallions + Recessed Downlights + Linear AC Vents)
  // ---------------------------------------------------------------------------
  const ceilingGroup = new THREE.Group();
  const mainCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(cm(845), cm(6), cm(812)),
    new THREE.MeshStandardMaterial({ color: 0xf8f7f4, roughness: 0.88 })
  );
  mainCeiling.position.set(cm(430), WALL_FULL_H + cm(3), cm(410));
  ceilingGroup.add(mainCeiling);

  for (const bx of [cm(345), cm(495), cm(655)]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(cm(10), cm(11), cm(286)), mats.whiteTrim);
    beam.position.set(bx, WALL_FULL_H - cm(5.5), cm(413));
    const beamCrown = new THREE.Mesh(new THREE.BoxGeometry(cm(13.5), cm(2.5), cm(286)), mats.whiteTrim);
    beamCrown.position.set(bx, WALL_FULL_H - cm(1.25), cm(413));
    ceilingGroup.add(beam, beamCrown);
  }

  // Carved Plaster Ceiling Medallions above Dining Chandelier & Kitchen Island Pendant
  for (const [mx, mz, mr] of [[578, 414, 24], [248, 452.5, 17]]) {
    const medOuter = new THREE.Mesh(new THREE.CylinderGeometry(cm(mr), cm(mr * 0.92), cm(1.8), 32), mats.whiteTrim);
    medOuter.position.set(cm(mx), WALL_FULL_H - cm(0.9), cm(mz));
    const medRing = new THREE.Mesh(new THREE.TorusGeometry(cm(mr * 0.68), cm(0.8), 10, 28), mats.whiteTrim);
    medRing.rotation.x = Math.PI / 2;
    medRing.position.set(cm(mx), WALL_FULL_H - cm(1.8), cm(mz));
    ceilingGroup.add(medOuter, medRing);
  }

  // Anti-Glare Recessed Architectural Downlights across Rooms
  for (const [lx, lz] of [
    [115, 330], [135, 515], [415, 340], [415, 490],
    [675, 140], [415, 685], [705, 675], [345, 165],
  ]) {
    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(cm(4.8), cm(4.8), cm(1.0), 20), mats.whiteTrim);
    bezel.position.set(cm(lx), WALL_FULL_H - cm(0.5), cm(lz));
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(cm(3.2), cm(3.2), cm(1.2), 18), mats.warmBulbEmissive);
    lens.position.set(cm(lx), WALL_FULL_H - cm(0.65), cm(lz));
    ceilingGroup.add(bezel, lens);
  }

  // Concealed Linear AC Slot Diffusers
  for (const [vx, vz, vLen] of [[585, 282, 140], [670, 30, 120]]) {
    const slotHousing = new THREE.Mesh(new THREE.BoxGeometry(cm(vLen), cm(1.2), cm(7.5)), mats.whiteTrim);
    slotHousing.position.set(cm(vx), WALL_FULL_H - cm(0.6), cm(vz));
    const slotGap = new THREE.Mesh(new THREE.BoxGeometry(cm(vLen - 6), cm(1.4), cm(2.2)), mats.castIronDark);
    slotGap.position.set(cm(vx), WALL_FULL_H - cm(0.7), cm(vz));
    ceilingGroup.add(slotHousing, slotGap);
  }

  ceilingGroup.visible = false;
  root.add(ceilingGroup);

  // ---------------------------------------------------------------------------
  // 7. Populate All Interior Country Furniture & Millwork Zones
  // ---------------------------------------------------------------------------
  const shoeCabinet = createEntrywayShoeCabinet(mats, lightsRegistry);
  shoeCabinet.position.set(cm(308), 0, cm(288.5));
  root.add(shoeCabinet);

  root.add(createCountryKitchenZone(mats, lightsRegistry));
  root.add(createDiningAndLoungeZone(mats, lightsRegistry));
  root.add(createMasterBedroomZone(mats, lightsRegistry));
  root.add(createBathroomsZone(mats, lightsRegistry));
  root.add(createSouthBedroomsZone(mats, lightsRegistry));
  root.add(createUtilityBalconyZone(mats));

  // Ultra-Detailed SE Bedroom (image_2.jpeg 1:1 reproduction!)
  const seDetail = createSEBedroomUltraDetail(mats, lightsRegistry);
  root.add(seDetail.roomGroup);
  facades.E.group.add(seDetail.eastWallAttachments);
  facades.S.group.add(seDetail.southWallAttachments);

  // ---------------------------------------------------------------------------
  // 8. Prepare Cloned Per-Facade Materials & Section Clipping Plane
  // ---------------------------------------------------------------------------
  function cloneMatForFacade(mat, entries) {
    const cloned = mat.clone();
    if (sectionClipPlane) {
      cloned.clippingPlanes = [sectionClipPlane];
      cloned.clipShadows = true;
    }
    entries.push({
      mat: cloned,
      baseOpacity: cloned.opacity !== undefined ? cloned.opacity : 1.0,
      wasTransparent: Boolean(cloned.transparent),
    });
    return cloned;
  }

  for (const key of ['N', 'S', 'E', 'W']) {
    const fac = facades[key];
    const cache = new Map();
    fac.group.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material = obj.material.map((m) => {
            if (!cache.has(m)) cache.set(m, cloneMatForFacade(m, fac.matEntries));
            return cache.get(m);
          });
        } else {
          const m = obj.material;
          if (!cache.has(m)) cache.set(m, cloneMatForFacade(m, fac.matEntries));
          obj.material = cache.get(m);
        }
      }
    });
  }

  // Attach manual section clipping plane to interior architecture too so manual slider cuts everything cleanly
  if (sectionClipPlane) {
    const intCache = new Map();
    interiorArchGroup.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const applyClip = (m) => {
          if (!intCache.has(m)) {
            const c = m.clone();
            c.clippingPlanes = [sectionClipPlane];
            c.clipShadows = true;
            intCache.set(m, c);
          }
          return intCache.get(m);
        };
        obj.material = Array.isArray(obj.material) ? obj.material.map(applyClip) : applyClip(obj.material);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9. 3D Architectural Dimension Annotations
  // ---------------------------------------------------------------------------
  const dimsGroup = createDimensionsGroup();
  root.add(dimsGroup);

  return {
    root,
    facades,
    doorsRegistry,
    lightsRegistry,
    blueprintMesh: bpMesh,
    blueprintMat: bpMat,
    ceilingGroup,
    dimsGroup,
  };
}
