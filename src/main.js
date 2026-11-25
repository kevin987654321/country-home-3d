import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMaterials } from './materials.js';
import { buildCountryResidence } from './houseBuilder.js';
import { cm } from './primitives.js';

// =============================================================================
// 1. Renderer, Scene & Cameras Setup
// =============================================================================
const container = document.getElementById('canvas-container');
const loaderFill = document.getElementById('loader-bar-fill');
const loaderStatus = document.getElementById('loader-status');
const loadingScreen = document.getElementById('loading-screen');

loaderFill.style.width = '40%';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.88;
renderer.localClippingEnabled = false;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xede6da);

// Horizontal GPU section clipping plane for smooth manual wall-height slicing
const sectionClipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), cm(295));

// Soft interior global bounce lighting via PMREM RoomEnvironment
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;
scene.environmentIntensity = 0.28;

const HOUSE_CENTER = new THREE.Vector3(cm(435), cm(95), cm(418));

// Perspective Camera (Orbit & First-Person Walk)
const perspCam = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.06, 60);
perspCam.position.set(cm(445), cm(920), cm(1180));

// Orthographic Camera (1:1 Top-Down Blueprint Alignment View)
const orthoHalfH = 5.4;
function makeOrthoCam() {
  const aspect = window.innerWidth / window.innerHeight;
  const cam = new THREE.OrthographicCamera(
    -orthoHalfH * aspect,
    orthoHalfH * aspect,
    orthoHalfH,
    -orthoHalfH,
    0.1,
    40
  );
  cam.position.set(cm(435), 14, cm(425));
  cam.up.set(0, 0, -1);
  cam.lookAt(cm(435), 0, cm(425));
  return cam;
}
const orthoCam = makeOrthoCam();
let activeCamera = perspCam;

const controls = new OrbitControls(perspCam, renderer.domElement);
controls.target.copy(HOUSE_CENTER);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 0.55;
controls.maxDistance = 22;
controls.update();

// =============================================================================
// 2. Natural Sun & Atmosphere Lighting System
// =============================================================================
const hemiLight = new THREE.HemisphereLight(0xfffdf8, 0xd2c3ad, 0.46);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff7e8, 1.42);
sunLight.position.set(13.5, 13.5, 4.8); // Crisp Eastern daylight streaming through East windows onto L-desk!
sunLight.target.position.set(cm(435), 0, cm(418));
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 2;
sunLight.shadow.camera.far = 32;
sunLight.shadow.camera.left = -7.2;
sunLight.shadow.camera.right = 7.2;
sunLight.shadow.camera.top = 7.2;
sunLight.shadow.camera.bottom = -7.2;
sunLight.shadow.bias = -0.00035;
sunLight.shadow.normalBias = 0.016;
scene.add(sunLight, sunLight.target);

const fillLight = new THREE.DirectionalLight(0xf6efe4, 0.22);
fillLight.position.set(-6, 9, 11);
scene.add(fillLight);

const roomWashLights = [
  new THREE.PointLight(0xffe0b2, 0.14, 6.5, 1.6),
  new THREE.PointLight(0xffe0b2, 0.14, 6.5, 1.6),
  new THREE.PointLight(0xffe0b2, 0.14, 5.2, 1.6),
  new THREE.PointLight(0xfff6eb, 0.24, 5.0, 1.5), // Soft daylight bounce inside SE study room!
];
roomWashLights[0].position.set(cm(190), cm(245), cm(420));
roomWashLights[1].position.set(cm(640), cm(245), cm(150));
roomWashLights[2].position.set(cm(405), cm(245), cm(685));
roomWashLights[3].position.set(cm(710), cm(235), cm(675));
roomWashLights.forEach((l) => scene.add(l));

// =============================================================================
// 3. Build 1:1 White Country Residence & SE Study Detail
// =============================================================================
loaderFill.style.width = '72%';
loaderStatus.textContent = '正在組裝純白企口護牆板、圓弧轉角書桌與全室訂製家具…';

const mats = createMaterials();
const house = buildCountryResidence(mats, sectionClipPlane);
scene.add(house.root);

loaderFill.style.width = '100%';
requestAnimationFrame(() => {
  loadingScreen.classList.add('fade-out');
  loadingScreen.style.display = 'none';
});

// =============================================================================
// 4. Lighting Presets (Morning Crisp / Afternoon Golden / Cozy Evening)
// =============================================================================
let currentLightPreset = 'morning';

function applyLightingPreset(preset) {
  currentLightPreset = preset;
  if (preset === 'morning') {
    scene.background.setHex(0xede6da);
    scene.environmentIntensity = 0.28;
    renderer.toneMappingExposure = 0.88;
    hemiLight.color.setHex(0xfffdf8);
    hemiLight.groundColor.setHex(0xd2c3ad);
    hemiLight.intensity = 0.46;
    sunLight.color.setHex(0xfff7e8);
    sunLight.intensity = 1.42;
    sunLight.position.set(13.5, 11.8, 5.2);
    fillLight.intensity = 0.22;
    house.lightsRegistry.forEach(({ light, mat, baseIntensity }) => {
      light.intensity = baseIntensity * 0.42;
      if (mat && mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.35;
    });
    roomWashLights[0].intensity = 0.14;
    roomWashLights[1].intensity = 0.14;
    roomWashLights[2].intensity = 0.14;
    roomWashLights[3].intensity = 0.24;
  } else if (preset === 'afternoon') {
    scene.background.setHex(0xe7dac7);
    scene.environmentIntensity = 0.25;
    renderer.toneMappingExposure = 0.88;
    hemiLight.color.setHex(0xffefd8);
    hemiLight.groundColor.setHex(0xc9b296);
    hemiLight.intensity = 0.42;
    sunLight.color.setHex(0xffda9e);
    sunLight.intensity = 1.65;
    sunLight.position.set(10.5, 8.2, 11.5);
    fillLight.intensity = 0.18;
    house.lightsRegistry.forEach(({ light, mat, baseIntensity }) => {
      light.intensity = baseIntensity * 0.75;
      if (mat && mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.65;
    });
    roomWashLights.forEach((l) => (l.intensity = 0.26));
  } else if (preset === 'evening') {
    scene.background.setHex(0x1e222d);
    scene.environmentIntensity = 0.12;
    renderer.toneMappingExposure = 1.05;
    hemiLight.color.setHex(0x526488);
    hemiLight.groundColor.setHex(0x28211b);
    hemiLight.intensity = 0.24;
    sunLight.color.setHex(0x88a4d6);
    sunLight.intensity = 0.22;
    sunLight.position.set(-10, 12, -8);
    fillLight.intensity = 0.06;
    house.lightsRegistry.forEach(({ light, mat, baseIntensity }) => {
      light.intensity = baseIntensity * 1.65;
      if (mat && mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 1.25;
    });
    roomWashLights.forEach((l) => (l.intensity = 0.78));
  }
}
applyLightingPreset('morning');

// =============================================================================
// 5. Upgraded Unified Smooth Wall-Hiding & Section Clipping Engine
//    - Never hides half a wall: interior walls stay 100% intact; partial/grazing/high-overhead angles DO NOT hide!
//    - Smooth animated transition: obstructing outer facades smoothly dissolve (opacity 1.0 <-> 0.0 over ~0.38s)
// =============================================================================
let viewMode = 'orbit'; // 'orbit' | 'ortho' | 'walk'
let targetManualWallCm = 285;
let smoothManualWallCm = 285;
let autoCutawayEnabled = true;
let userCeilingEnabled = false;

const sliderWall = document.getElementById('slider-wall-height');
const valWall = document.getElementById('val-wall-height');
const chkAutoCutaway = document.getElementById('chk-auto-cutaway');

function smoothstep01(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

function updateWallVisibility(dt) {
  const camPos = activeCamera.position;
  const target = controls.target;

  // Check if camera is physically inside the apartment at eye/room level
  const isCameraInsideRoom =
    viewMode === 'walk' ||
    (viewMode === 'orbit' &&
      camPos.y < cm(248) &&
      camPos.x > cm(14) &&
      camPos.x < cm(839) &&
      camPos.z > cm(14) &&
      camPos.z < cm(804));

  house.ceilingGroup.visible = userCeilingEnabled || isCameraInsideRoom;

  // 1. Smoothly interpolate manual section clip plane (only enable GPU clipping when < 284.5 cm for fast shaders!)
  const effectiveManualTarget = viewMode === 'walk' ? 285 : targetManualWallCm;
  const clipDiff = effectiveManualTarget - smoothManualWallCm;
  if (Math.abs(clipDiff) > 0.05) {
    smoothManualWallCm += clipDiff * Math.min(1, dt * 10.0);
  } else {
    smoothManualWallCm = effectiveManualTarget;
  }
  const needsClip = smoothManualWallCm < 284.5;
  if (renderer.localClippingEnabled !== needsClip) {
    renderer.localClippingEnabled = needsClip;
  }
  sectionClipPlane.constant = needsClip ? cm(smoothManualWallCm) : cm(298);

  // 2. Determine which of the 4 outer perimeter facades unambiguously block camera -> target
  const toTarget = new THREE.Vector3().subVectors(target, camPos);
  const horizDist = Math.hypot(toTarget.x, toTarget.z);
  const dy = camPos.y - target.y;
  const elevRatio = dy / Math.max(0.05, horizDist);

  // Facade geometric rules: [key, isCameraClearlyOutside, isTargetInside, inwardDirX, inwardDirZ]
  const rules = [
    ['N', camPos.z < cm(2), target.z > cm(25), 0, 1],
    ['S', camPos.z > cm(816), target.z < cm(792), 0, -1],
    ['E', camPos.x > cm(850), target.x < cm(826), -1, 0],
    ['W', camPos.x < cm(2), target.x > cm(25), 1, 0],
  ];

  for (const [key, isOut, isTargetIn, inX, inZ] of rules) {
    const fac = house.facades[key];

    if (!autoCutawayEnabled || viewMode !== 'orbit' || isCameraInsideRoom) {
      fac.hidden = false;
    } else {
      // Alignment between horizontal view ray and inward normal (1.0 = dead-on perpendicular, 0.0 = parallel/sideways)
      const align = (toTarget.x * inX + toTarget.z * inZ) / Math.max(0.05, horizDist);

      if (!fac.hidden) {
        // Strict threshold: only hide when clearly outside, facing squarely inward (>0.54), and not steep overhead (<1.28)
        // Marginal / diagonal / half-wall situations stay UNHIDDEN!
        fac.hidden = isOut && isTargetIn && align > 0.54 && elevRatio < 1.28;
      } else {
        // Hysteresis so rotating near boundary never flickers
        if (!isOut || !isTargetIn || align < 0.38 || elevRatio > 1.45) {
          fac.hidden = false;
        }
      }
    }

    fac.targetAlpha = fac.hidden ? 0.0 : 1.0;

    // Smooth animated transition (~0.36s ease)
    const delta = fac.targetAlpha - fac.alpha;
    if (Math.abs(delta) > 0.002) {
      const step = delta * Math.min(1, dt * 7.8) + Math.sign(delta) * dt * 0.45;
      if (Math.abs(step) >= Math.abs(delta)) {
        fac.alpha = fac.targetAlpha;
      } else {
        fac.alpha += step;
      }

      const eased = smoothstep01(fac.alpha);
      if (eased <= 0.01) {
        fac.group.visible = false;
      } else {
        fac.group.visible = true;
        const isSolid = eased >= 0.995;
        for (const entry of fac.matEntries) {
          if (isSolid) {
            entry.mat.transparent = entry.wasTransparent;
            entry.mat.opacity = entry.baseOpacity;
            entry.mat.depthWrite = !entry.wasTransparent;
          } else {
            entry.mat.transparent = true;
            entry.mat.opacity = entry.baseOpacity * eased;
            entry.mat.depthWrite = eased > 0.72 && !entry.wasTransparent;
          }
          entry.mat.needsUpdate = true;
        }
      }
    }
  }
}

function syncWallLabel() {
  valWall.textContent = targetManualWallCm >= 285 ? '全高 285 cm' : `${targetManualWallCm} cm`;
}

sliderWall.addEventListener('input', (e) => {
  targetManualWallCm = Number(e.target.value);
  syncWallLabel();
});

chkAutoCutaway.addEventListener('change', (e) => {
  autoCutawayEnabled = e.target.checked;
});

// =============================================================================
// 6. Room Presets & Smooth Camera Tweening (Including Exact image_2.jpeg Angle!)
// =============================================================================
const ROOM_PRESETS = {
  overview: {
    pos: [cm(450), cm(910), cm(1160)],
    target: [cm(435), cm(85), cm(420)],
    fov: 42,
    desc: '全室鳥瞰視角｜3 房 2 廳 2 衛 1 廚＋工作陽台，嚴格依照平面圖尺寸（1 cm 精度）與開門方向建模。',
  },
  seDesign: {
    pos: [cm(596), cm(128), cm(646)],
    target: [cm(792), cm(114), cm(734)],
    fov: 58,
    desc: '右下角房間（1:1 設計圖視角）｜隱藏窗簾盒與蛇形落地簾、深窗龕雙扇純白氣密窗、C1 流線內圓弧轉角書桌、三層暖光懸浮書架（含斜靠書列與 U 型雕塑花器）及純白五爪輪扶手椅。',
  },
  bedSE: {
    pos: [cm(625), cm(255), cm(475)],
    target: [cm(712), cm(85), cm(708)],
    fov: 43,
    desc: '東南次臥全景｜145 cm 頂天衣櫃＋45 cm 展示櫃＋純白單人床＋右側一體成型內圓弧書桌與懸浮層板書牆。',
  },
  master: {
    pos: [cm(470), cm(250), cm(355)],
    target: [cm(655), cm(85), cm(155)],
    fov: 43,
    desc: '主臥室套房｜Queen Size 純白企口高背雙人床＋60 × 165 cm 衣櫃與精準 60 × 30 cm 橢圓弧轉角層架＋東側梳妝桌。',
  },
  living: {
    pos: [cm(340), cm(240), cm(520)],
    target: [cm(645), cm(88), cm(385)],
    fov: 43,
    desc: '客餐廳核心生活區｜200 × 90 cm 圓角白橡木大餐桌＋五燈古典吊燈＋東北角陽光單椅閱讀角落與星形觀葉盆栽。',
  },
  kitchen: {
    pos: [cm(415), cm(245), cm(445)],
    target: [cm(135), cm(100), cm(520)],
    fov: 43,
    desc: '開放式鄉村風廚房與吧台｜250 cm 廚具（陶瓷農舍水槽＋雙口爐＋壁爐油煙機）＋85 cm 雙門冰箱＋110 × 95 cm 車枳中島桌。',
  },
  foyer: {
    pos: [cm(145), cm(215), cm(495)],
    target: [cm(295), cm(105), cm(292)],
    fov: 43,
    desc: '玄關與端景鞋櫃區｜法式八角復古花磚落塵區＋240 × 35 cm 純白百葉鏤空端景鞋櫃（底部懸空照明＋白橡木檯面）。',
  },
  bedSW: {
    pos: [cm(325), cm(260), cm(510)],
    target: [cm(415), cm(75), cm(715)],
    fov: 43,
    desc: '西南次臥室｜40 cm 門側高櫃＋35 cm 格柵玻璃書櫃＋109 cm 雙門衣櫃＋純白護欄單人床＋94 × 60 cm 書桌。',
  },
  masterBath: {
    pos: [cm(465), cm(295), cm(295)],
    target: [cm(338), cm(68), cm(125)],
    fov: 43,
    desc: '主臥專屬衛浴｜149 × 75 cm 企口裙邊嵌入式浴缸＋白橡木泡澡托盤＋卡拉拉六角磚＋橢圓下嵌盆浴櫃與圓拱銅鏡。',
  },
  guestBath: {
    pos: [cm(145), cm(310), cm(330)],
    target: [cm(195), cm(78), cm(135)],
    fov: 43,
    desc: '客用乾濕分離衛浴｜無框清玻淋浴間（洩水石材地面＋復古銅金花灑）＋獨立管道間＋純白鄉村風浴櫃。',
  },
  balcony: {
    pos: [cm(135), cm(295), cm(960)],
    target: [cm(135), cm(75), cm(725)],
    fov: 43,
    desc: '西南工作陽台與外牆細部｜防滑復古地磚＋洗脫烘衣塔＋陶瓷洗滌槽＋南向女兒牆外雙台分離式冷氣室外機。',
  },
};

let camTween = null;
const zoneDescEl = document.getElementById('active-zone-desc');

function flyToPreset(key) {
  const p = ROOM_PRESETS[key];
  if (!p) return;
  if (viewMode !== 'orbit') setViewMode('orbit');

  zoneDescEl.textContent = p.desc;
  document.querySelectorAll('.room-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.room === key);
  });

  camTween = {
    startPos: perspCam.position.clone(),
    endPos: new THREE.Vector3(...p.pos),
    startTarget: controls.target.clone(),
    endTarget: new THREE.Vector3(...p.target),
    startFov: perspCam.fov,
    endFov: p.fov || 43,
    t: 0,
    duration: 0.82,
  };
}

document.querySelectorAll('.room-pill').forEach((btn) => {
  btn.addEventListener('click', () => flyToPreset(btn.dataset.room));
});

// =============================================================================
// 7. View Mode Switching: 3D Orbit / Top-Down Ortho / First-Person Walk
// =============================================================================
const walkHintEl = document.getElementById('walk-hint');
const walkState = {
  yaw: -Math.PI * 0.5,
  pitch: -0.04,
  dragging: false,
  lastX: 0,
  lastY: 0,
  keys: new Set(),
};

function setViewMode(mode) {
  viewMode = mode;
  camTween = null;
  document.querySelectorAll('[data-mode]').forEach((b) => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });

  if (mode === 'orbit') {
    activeCamera = perspCam;
    controls.object = perspCam;
    controls.enabled = true;
    controls.enableRotate = true;
    walkHintEl.classList.add('hidden');
    controls.update();
  } else if (mode === 'ortho') {
    activeCamera = orthoCam;
    controls.object = orthoCam;
    controls.enabled = true;
    controls.enableRotate = false;
    orthoCam.position.set(cm(435), 14, cm(435));
    orthoCam.up.set(0, 0, -1);
    controls.target.set(cm(435), 0, cm(435));
    orthoCam.zoom = 1.0;
    orthoCam.updateProjectionMatrix();
    controls.update();
    walkHintEl.classList.add('hidden');
  } else if (mode === 'walk') {
    activeCamera = perspCam;
    controls.enabled = false;
    perspCam.fov = 52;
    perspCam.updateProjectionMatrix();
    perspCam.position.set(cm(155), cm(160), cm(355));
    walkState.yaw = -Math.PI * 0.46;
    walkState.pitch = -0.04;
    syncWalkCameraRotation();
    walkHintEl.classList.remove('hidden');
  }
}

function syncWalkCameraRotation() {
  const euler = new THREE.Euler(walkState.pitch, walkState.yaw, 0, 'YXZ');
  perspCam.quaternion.setFromEuler(euler);
}

document.querySelectorAll('[data-mode]').forEach((btn) => {
  btn.addEventListener('click', () => setViewMode(btn.dataset.mode));
});

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (viewMode === 'walk' && e.button === 0) {
    walkState.dragging = true;
    walkState.lastX = e.clientX;
    walkState.lastY = e.clientY;
  }
});
window.addEventListener('pointermove', (e) => {
  if (viewMode === 'walk' && walkState.dragging) {
    const dx = e.clientX - walkState.lastX;
    const dy = e.clientY - walkState.lastY;
    walkState.lastX = e.clientX;
    walkState.lastY = e.clientY;
    walkState.yaw -= dx * 0.0032;
    walkState.pitch = Math.max(-1.1, Math.min(1.0, walkState.pitch - dy * 0.0028));
    syncWalkCameraRotation();
  }
});
window.addEventListener('pointerup', () => {
  walkState.dragging = false;
});
window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'escape' && viewMode === 'walk') {
    setViewMode('orbit');
    return;
  }
  if (k === 'h' && document.activeElement.tagName !== 'INPUT') {
    document.body.classList.toggle('ui-collapsed');
  }
  walkState.keys.add(k);
});
window.addEventListener('keyup', (e) => {
  walkState.keys.delete(e.key.toLowerCase());
});

// =============================================================================
// 8. UI Controls: Lighting, Blueprint Overlay, Doors, Dimensions, Ceiling, Export
// =============================================================================
document.querySelectorAll('[data-light]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-light]').forEach((b) => b.classList.toggle('active', b === btn));
    applyLightingPreset(btn.dataset.light);
  });
});

const sliderBp = document.getElementById('slider-blueprint');
const valBp = document.getElementById('val-blueprint');
sliderBp.addEventListener('input', (e) => {
  const pct = Number(e.target.value);
  valBp.textContent = `${pct}%`;
  house.blueprintMesh.visible = pct > 0;
  house.blueprintMat.opacity = (pct / 100) * 0.88;
});

const btnDoors = document.getElementById('btn-doors-toggle');
let doorsGlobalMode = 'blueprint';
btnDoors.addEventListener('click', () => {
  if (doorsGlobalMode === 'blueprint') {
    doorsGlobalMode = 'closed';
    house.doorsRegistry.forEach((d) => {
      d.isOpen = false;
      d.targetAngle = d.closedAngle;
      d.arcLine.visible = false;
    });
    btnDoors.innerHTML = '<span class="chip-dot"></span>門片：全室關閉（可單擊門扇）';
  } else {
    doorsGlobalMode = 'blueprint';
    house.doorsRegistry.forEach((d) => {
      d.isOpen = true;
      d.targetAngle = d.blueprintAngle;
      d.arcLine.visible = true;
    });
    btnDoors.innerHTML = '<span class="chip-dot active"></span>門片：依平面圖半開';
  }
});

const btnDims = document.getElementById('btn-dims-toggle');
btnDims.addEventListener('click', () => {
  house.dimsGroup.visible = !house.dimsGroup.visible;
  btnDims.querySelector('.chip-dot').classList.toggle('active', house.dimsGroup.visible);
});

const btnCeiling = document.getElementById('btn-wireframe-ceiling');
btnCeiling.addEventListener('click', () => {
  userCeilingEnabled = !userCeilingEnabled;
  btnCeiling.querySelector('.chip-dot').classList.toggle('active', userCeilingEnabled);
});

document.getElementById('btn-toggle-ui').addEventListener('click', () => {
  document.body.classList.toggle('ui-collapsed');
});

document.getElementById('btn-snapshot').addEventListener('click', () => {
  renderer.render(scene, activeCamera);
  const link = document.createElement('a');
  link.download = `純白鄉村風3D模型_${currentLightPreset}.png`;
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
});

// =============================================================================
// 9. Raycast Object Inspector, Door Click-to-Swing & Double-Click Focus
// =============================================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const tooltip = document.getElementById('inspector-tooltip');
const inspTitle = document.getElementById('insp-title');
const inspMeta = document.getElementById('insp-meta');

let pointerDownPos = { x: 0, y: 0 };

function isObjectFadedOut(obj) {
  let p = obj;
  while (p) {
    if (!p.visible) return true;
    for (const key of ['N', 'S', 'E', 'W']) {
      if (p === house.facades[key].group && house.facades[key].alpha < 0.5) {
        return true;
      }
    }
    p = p.parent;
  }
  return false;
}

function findInspectable(hitObj) {
  let cur = hitObj;
  while (cur && cur !== scene) {
    if (cur.userData && (cur.userData.doorRecord || cur.userData.inspectTitle)) {
      return cur.userData;
    }
    cur = cur.parent;
  }
  return null;
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('pointermove', (e) => {
  if (e.buttons !== 0) {
    tooltip.classList.add('hidden');
    return;
  }
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, activeCamera);
  const hits = raycaster.intersectObjects(house.root.children, true);

  let found = null;
  for (const h of hits) {
    if (h.point.y > sectionClipPlane.constant) continue;
    if (isObjectFadedOut(h.object)) continue;
    const data = findInspectable(h.object);
    if (data && data.inspectTitle) {
      found = data;
      break;
    }
  }

  if (found) {
    inspTitle.textContent = found.inspectTitle;
    inspMeta.textContent = found.inspectMeta || '';
    tooltip.style.left = `${Math.min(window.innerWidth - 255, e.clientX + 14)}px`;
    tooltip.style.top = `${Math.min(window.innerHeight - 85, e.clientY + 14)}px`;
    tooltip.classList.remove('hidden');
    renderer.domElement.style.cursor = found.doorRecord ? 'pointer' : 'grab';
  } else {
    tooltip.classList.add('hidden');
    renderer.domElement.style.cursor = 'grab';
  }
});

renderer.domElement.addEventListener('click', (e) => {
  if (Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y) > 5) return;
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, activeCamera);
  const hits = raycaster.intersectObjects(house.root.children, true);
  for (const h of hits) {
    if (isObjectFadedOut(h.object)) continue;
    const data = findInspectable(h.object);
    if (data && data.doorRecord) {
      const dr = data.doorRecord;
      dr.isOpen = !dr.isOpen;
      dr.targetAngle = dr.isOpen ? dr.blueprintAngle : dr.closedAngle;
      dr.arcLine.visible = dr.isOpen;
      break;
    }
  }
});

renderer.domElement.addEventListener('dblclick', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, activeCamera);
  const hits = raycaster.intersectObjects(house.root.children, true);
  const valid = hits.find((h) => !isObjectFadedOut(h.object) && h.object !== house.blueprintMesh);
  if (!valid) return;

  if (viewMode === 'walk') {
    perspCam.position.set(valid.point.x, cm(160), valid.point.z);
  } else if (viewMode === 'orbit') {
    const offset = new THREE.Vector3().subVectors(perspCam.position, controls.target);
    const clampedLen = Math.max(2.2, Math.min(6.0, offset.length() * 0.68));
    offset.setLength(clampedLen);
    const endTarget = valid.point.clone();
    endTarget.y = Math.min(cm(110), Math.max(cm(45), endTarget.y));
    camTween = {
      startPos: perspCam.position.clone(),
      endPos: endTarget.clone().add(offset),
      startTarget: controls.target.clone(),
      endTarget,
      startFov: perspCam.fov,
      endFov: 43,
      t: 0,
      duration: 0.65,
    };
  }
});

// =============================================================================
// 10. Live Calibrated 2D Floorplan Minimap + Click-to-Teleport
// =============================================================================
const mmCanvas = document.getElementById('minimap-canvas');
const mmCtx = mmCanvas.getContext('2d');
const mmImgEl = document.querySelector('.minimap-img');
if (mmImgEl) mmImgEl.style.display = 'none';

mmCanvas.width = 440;
mmCanvas.height = 472;
const MM_CROP = { x: 32, y: 162, w: 660, h: 708 };
const BP_SCALE_CM_PER_PX = 823.0 / 597.0;

const bpImg = new Image();
bpImg.src = '/floorplan.jpeg';
let bpImgLoaded = false;
bpImg.onload = () => {
  bpImgLoaded = true;
};

function worldToMinimap(xMeters, zMeters) {
  const xCm = xMeters * 100;
  const zCm = zMeters * 100;
  const imgPxX = 50 + xCm / BP_SCALE_CM_PER_PX;
  const imgPxY = 180 + zCm / BP_SCALE_CM_PER_PX;
  const u = ((imgPxX - MM_CROP.x) / MM_CROP.w) * mmCanvas.width;
  const v = ((imgPxY - MM_CROP.y) / MM_CROP.h) * mmCanvas.height;
  return { u, v };
}

function drawMinimap() {
  mmCtx.clearRect(0, 0, mmCanvas.width, mmCanvas.height);
  if (bpImgLoaded) {
    mmCtx.fillStyle = '#ffffff';
    mmCtx.fillRect(0, 0, mmCanvas.width, mmCanvas.height);
    mmCtx.globalAlpha = 0.88;
    mmCtx.drawImage(
      bpImg,
      MM_CROP.x,
      MM_CROP.y,
      MM_CROP.w,
      MM_CROP.h,
      0,
      0,
      mmCanvas.width,
      mmCanvas.height
    );
    mmCtx.globalAlpha = 1.0;
  }

  const refPos = viewMode === 'walk' ? perspCam.position : controls.target;
  const { u, v } = worldToMinimap(refPos.x, refPos.z);

  const forward = new THREE.Vector3();
  activeCamera.getWorldDirection(forward);
  const angle = Math.atan2(forward.z, forward.x);

  mmCtx.save();
  mmCtx.translate(u, v);
  mmCtx.rotate(angle);
  mmCtx.fillStyle = 'rgba(160, 118, 66, 0.28)';
  mmCtx.beginPath();
  mmCtx.moveTo(0, 0);
  mmCtx.arc(0, 0, 56, -0.45, 0.45);
  mmCtx.closePath();
  mmCtx.fill();
  mmCtx.restore();

  mmCtx.fillStyle = '#8b6234';
  mmCtx.beginPath();
  mmCtx.arc(u, v, 7.5, 0, Math.PI * 2);
  mmCtx.fill();
  mmCtx.strokeStyle = '#ffffff';
  mmCtx.lineWidth = 2.5;
  mmCtx.stroke();
}

mmCanvas.addEventListener('click', (e) => {
  const rect = mmCanvas.getBoundingClientRect();
  const nx = (e.clientX - rect.left) / rect.width;
  const ny = (e.clientY - rect.top) / rect.height;
  const imgX = MM_CROP.x + nx * MM_CROP.w;
  const imgY = MM_CROP.y + ny * MM_CROP.h;
  const worldX = cm((imgX - 50) * BP_SCALE_CM_PER_PX);
  const worldZ = cm((imgY - 180) * BP_SCALE_CM_PER_PX);

  if (viewMode === 'walk') {
    perspCam.position.set(worldX, cm(160), worldZ);
  } else if (viewMode === 'ortho') {
    orthoCam.position.x = worldX;
    orthoCam.position.z = worldZ;
    controls.target.set(worldX, 0, worldZ);
  } else {
    const delta = new THREE.Vector3(worldX - controls.target.x, 0, worldZ - controls.target.z);
    camTween = {
      startPos: perspCam.position.clone(),
      endPos: perspCam.position.clone().add(delta),
      startTarget: controls.target.clone(),
      endTarget: new THREE.Vector3(worldX, cm(85), worldZ),
      startFov: perspCam.fov,
      endFov: 43,
      t: 0,
      duration: 0.6,
    };
  }
});

// =============================================================================
// 11. Optional URL Query Preset (?room=seDesign) & Main Render Loop
// =============================================================================
const urlParams = new URLSearchParams(window.location.search);
const initialRoomParam = urlParams.get('room');
if (urlParams.get('clean') === '1') {
  document.body.classList.add('ui-collapsed');
  document.getElementById('brand-header').style.display = 'none';
  document.getElementById('controls-legend').style.display = 'none';
}
if (initialRoomParam && ROOM_PRESETS[initialRoomParam]) {
  const p = ROOM_PRESETS[initialRoomParam];
  perspCam.position.set(...p.pos);
  controls.target.set(...p.target);
  perspCam.fov = p.fov || 43;
  perspCam.updateProjectionMatrix();
  controls.update();
  zoneDescEl.textContent = p.desc;
  document.querySelectorAll('.room-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.room === initialRoomParam);
  });
}

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  perspCam.aspect = w / h;
  perspCam.updateProjectionMatrix();

  const aspect = w / h;
  orthoCam.left = -orthoHalfH * aspect;
  orthoCam.right = orthoHalfH * aspect;
  orthoCam.top = orthoHalfH;
  orthoCam.bottom = -orthoHalfH;
  orthoCam.updateProjectionMatrix();

  renderer.setSize(w, h);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (camTween) {
    camTween.t += dt / camTween.duration;
    const k = Math.min(1, camTween.t);
    const ease = 1 - Math.pow(1 - k, 3);
    perspCam.position.lerpVectors(camTween.startPos, camTween.endPos, ease);
    controls.target.lerpVectors(camTween.startTarget, camTween.endTarget, ease);
    if (camTween.startFov !== camTween.endFov) {
      perspCam.fov = camTween.startFov + (camTween.endFov - camTween.startFov) * ease;
      perspCam.updateProjectionMatrix();
    }
    if (k >= 1) camTween = null;
  }

  if (viewMode === 'walk') {
    const speed = 2.1 * dt;
    const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), walkState.yaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), walkState.yaw);
    if (walkState.keys.has('w') || walkState.keys.has('arrowup')) perspCam.position.addScaledVector(fwd, speed);
    if (walkState.keys.has('s') || walkState.keys.has('arrowdown')) perspCam.position.addScaledVector(fwd, -speed);
    if (walkState.keys.has('a') || walkState.keys.has('arrowleft')) perspCam.position.addScaledVector(right, -speed);
    if (walkState.keys.has('d') || walkState.keys.has('arrowright')) perspCam.position.addScaledVector(right, speed);
    perspCam.position.x = Math.max(cm(25), Math.min(cm(828), perspCam.position.x));
    perspCam.position.z = Math.max(cm(25), Math.min(cm(795), perspCam.position.z));
    perspCam.position.y = cm(160);
  } else {
    controls.update();
  }

  for (const dr of house.doorsRegistry) {
    const diff = dr.targetAngle - dr.pivot.rotation.y;
    if (Math.abs(diff) > 0.001) {
      dr.pivot.rotation.y += diff * Math.min(1, dt * 8.5);
    }
  }

  updateWallVisibility(dt);
  drawMinimap();
  renderer.render(scene, activeCamera);
}

animate();
