import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MockupConfig, MaterialStyle, PackagingShapeKey } from '../../types';

// Software WebGL detection guard following Three.js guidelines
export const isSoftwareGlRenderer = (renderer: THREE.WebGLRenderer): boolean => {
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
};

/**
 * Creates high-fidelity 2D canvas texture for wrapping around 3D packaging.
 * Generates crisp typography, gold foil accents, certification badges, and logo.
 */
export const createPackagingLabelTexture = (
  config: MockupConfig,
  shapeKey: PackagingShapeKey,
  maxAnisotropy: number = 8,
  logoImgElement: HTMLImageElement | null = null
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  const { width, height } = canvas;
  const baseColor = config.color || '#C9B896';
  const isKraft = config.materialStyle === 'kraft';

  // 1. Background Fill
  if (isKraft) {
    ctx.fillStyle = '#C29B63';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0,0,0,0.035)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() * 3 + 1, 1);
    }
  } else {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle luxury gradient sheen on label
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(255,255,255,0.08)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Central Label Panel Frame
  const padX = width * 0.16;
  const padY = height * 0.10;
  const labelW = width - padX * 2;
  const labelH = height - padY * 2;

  const isDarkBase = isColorDark(baseColor);
  ctx.fillStyle = isDarkBase ? '#121214' : '#FFFFFF';
  roundRect(ctx, padX, padY, labelW, labelH, 24);
  ctx.fill();

  // 3. Gold / Rose Gold Foil Accent Border
  const foilGrad = ctx.createLinearGradient(padX, padY, padX + labelW, padY + labelH);
  foilGrad.addColorStop(0, '#D4AF37');
  foilGrad.addColorStop(0.3, '#FFF2B2');
  foilGrad.addColorStop(0.6, '#AA771C');
  foilGrad.addColorStop(1, '#E6C665');
  ctx.strokeStyle = foilGrad;
  ctx.lineWidth = 6;
  roundRect(ctx, padX + 8, padY + 8, labelW - 16, labelH - 16, 18);
  ctx.stroke();

  // Subtle inner decorative line
  ctx.strokeStyle = isDarkBase ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.45)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, padX + 16, padY + 16, labelW - 32, labelH - 32, 14);
  ctx.stroke();

  // 4. Brand Logo
  const centerX = width / 2;
  let cursorY = padY + 65;

  if (logoImgElement && logoImgElement.complete && logoImgElement.naturalWidth > 0) {
    const maxLogoSize = 130 * (config.logoScale || 1);
    const aspect = logoImgElement.naturalWidth / logoImgElement.naturalHeight;
    let lw = maxLogoSize;
    let lh = maxLogoSize / aspect;
    if (lh > maxLogoSize) {
      lh = maxLogoSize;
      lw = maxLogoSize * aspect;
    }
    const logoX = centerX - lw / 2 + (config.logoX || 0) * 2;
    const logoY = cursorY + (config.logoY || 0) * 1.5;
    ctx.drawImage(logoImgElement, logoX, logoY, lw, lh);
    cursorY = logoY + lh + 35;
  } else {
    // Elegant procedural emblem icon
    ctx.save();
    ctx.translate(centerX, cursorY + 20);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('O', 0, 0);
    ctx.restore();
    cursorY += 65;
  }

  // 5. Product Brand Title
  const brandName = (config.prodName || 'BRAND NAME').toUpperCase();
  ctx.fillStyle = isDarkBase ? '#FFFFFF' : '#18181A';
  ctx.font = `bold ${Math.max(34, (config.textSize || 15) * 2.8)}px "${config.textFont || 'Space Grotesk'}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(brandName, centerX, cursorY);
  cursorY += 50;

  // 6. Subtitle / Product Tagline (Gold foil tracking)
  const tagLine = (config.prodTag || 'PREMIUM QUALITY GUARANTEED').toUpperCase();
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 16px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(tagLine, centerX, cursorY);
  cursorY += 35;

  // 7. Divider Ribbon Line
  ctx.strokeStyle = isDarkBase ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 140, cursorY);
  ctx.lineTo(centerX + 140, cursorY);
  ctx.stroke();

  // Little diamond in center of divider
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.moveTo(centerX, cursorY - 5);
  ctx.lineTo(centerX + 5, cursorY);
  ctx.lineTo(centerX, cursorY + 5);
  ctx.lineTo(centerX - 5, cursorY);
  ctx.closePath();
  ctx.fill();
  cursorY += 28;

  // 8. Flavor / Variant Note
  ctx.fillStyle = isDarkBase ? 'rgba(255,255,255,0.7)' : '#4B5563';
  ctx.font = '500 15px "Inter", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('100% PURE NATURAL INGREDIENTS', centerX, cursorY);

  // 9. Bottom Certification Badges & Netto
  const bottomY = padY + labelH - 55;
  
  // Left Badge: HALAL & BPOM
  ctx.textAlign = 'left';
  ctx.fillStyle = isDarkBase ? 'rgba(255,255,255,0.6)' : '#6B7280';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.fillText('P-IRT · HALAL ID · BPOM RI', padX + 35, bottomY);
  ctx.font = 'normal 10px "Inter", sans-serif';
  ctx.fillText('INDONESIA OFFICIAL REGISTERED', padX + 35, bottomY + 16);

  // Right Badge: Netto Volume
  ctx.textAlign = 'right';
  ctx.fillStyle = isDarkBase ? '#FFFFFF' : '#111827';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.fillText('NETTO: 350g', padX + labelW - 35, bottomY + 4);
  ctx.font = '500 10px "Inter", sans-serif';
  ctx.fillStyle = isDarkBase ? 'rgba(255,255,255,0.6)' : '#6B7280';
  ctx.fillText('12.3 OZ (FLUID)', padX + labelW - 35, bottomY + 20);

  // Center bottom brand mark
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('OBEECREATIVES OS • 2026', centerX, bottomY + 14);

  // Construct Three.js CanvasTexture with high visual fidelity settings
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
};

/**
 * Procedural Contact Shadow Ground Disc Texture
 */
export const createContactShadowTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const cx = 256;
  const cy = 256;
  const rad = 230;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.25, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/**
 * Helper to build braided rope curve for Paper Bag handles
 */
function createRopeHandleGeometry(x1: number, x2: number, y: number, z: number, height: number): THREE.TubeGeometry {
  const p1 = new THREE.Vector3(x1, y, z);
  const p2 = new THREE.Vector3(x1 * 0.9, y + height * 0.7, z + 0.15);
  const p3 = new THREE.Vector3(0, y + height, z + 0.25);
  const p4 = new THREE.Vector3(x2 * 0.9, y + height * 0.7, z + 0.15);
  const p5 = new THREE.Vector3(x2, y, z);
  const curve = new THREE.CatmullRomCurve3([p1, p2, p3, p4, p5]);
  return new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
}

/**
 * Builds realistic, distinct 3D Model Group for ALL 17 packaging shapes
 */
export const buildPackaging3DGroup = (
  shapeKey: PackagingShapeKey,
  labelTexture: THREE.CanvasTexture,
  config: MockupConfig,
  isSoftwareGl: boolean = false
): THREE.Group => {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(config.color || '#C9B896');
  const style = config.materialStyle || 'glossy';

  // Base PBR Material configurations
  const isKraft = style === 'kraft';
  const isMatte = style === 'matte';
  const roughness = isKraft ? 0.85 : isMatte ? 0.65 : 0.18;
  const metalness = isKraft ? 0.0 : isMatte ? 0.02 : 0.08;
  const clearcoat = isKraft ? 0.0 : isMatte ? 0.1 : 0.95;

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: baseColor,
    roughness,
    metalness,
    clearcoat,
    clearcoatRoughness: 0.1,
    reflectivity: 0.6
  });

  const goldMetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E6C665'),
    metalness: 0.92,
    roughness: 0.22,
    envMapIntensity: 1.4
  });

  const darkCordMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#222224'),
    roughness: 0.9,
    metalness: 0.1
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    transparent: true,
    opacity: isSoftwareGl ? 0.35 : 1.0,
    transmission: isSoftwareGl ? 0 : 0.94,
    roughness: 0.06,
    metalness: 0.02,
    ior: 1.52,
    thickness: 1.8,
    specularIntensity: 1.0,
    specularColor: new THREE.Color('#FFFFFF'),
    envMapIntensity: 1.2
  });

  const honeyLiquidMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#DE8924'), // Warm amber honey
    roughness: 0.12,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.75,
    transparent: true,
    opacity: isSoftwareGl ? 0.8 : 0.95,
    ior: 1.38,
    attenuationColor: new THREE.Color('#8C4505'),
    attenuationDistance: 1.2
  });

  const labelMaterial = new THREE.MeshPhysicalMaterial({
    map: labelTexture,
    roughness: isMatte ? 0.6 : 0.2,
    clearcoat: isKraft ? 0 : 0.85,
    transparent: true,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
  });

  // Switch statement handling ALL 17 distinctive packaging forms
  switch (shapeKey) {
    // -------------------------------------------------------------
    // 1. TOPLES JAR KACA (Madu / Selai / Cream)
    // -------------------------------------------------------------
    case 'jar': {
      const jarHeight = 3.6;
      const jarRadius = 1.6;
      const jarGeo = new THREE.CylinderGeometry(jarRadius, jarRadius * 0.96, jarHeight, 48, 1);
      const jarMesh = new THREE.Mesh(jarGeo, glassMaterial);
      jarMesh.position.y = jarHeight / 2 + 0.1;
      jarMesh.castShadow = !isSoftwareGl;
      group.add(jarMesh);

      // Honey liquid core
      const liquidGeo = new THREE.CylinderGeometry(jarRadius * 0.91, jarRadius * 0.88, jarHeight * 0.82, 32);
      const liquidMesh = new THREE.Mesh(liquidGeo, honeyLiquidMaterial);
      liquidMesh.position.y = (jarHeight * 0.82) / 2 + 0.2;
      group.add(liquidMesh);

      // Gold Metallic Screw Lid
      const lidHeight = 0.55;
      const lidRadius = jarRadius * 1.02;
      const lidGeo = new THREE.CylinderGeometry(lidRadius, lidRadius, lidHeight, 48);
      const lidMesh = new THREE.Mesh(lidGeo, goldMetalMaterial);
      lidMesh.position.y = jarHeight + lidHeight / 2 + 0.05;
      lidMesh.castShadow = !isSoftwareGl;
      group.add(lidMesh);

      // Lid top embossed ring
      const lidRingGeo = new THREE.TorusGeometry(lidRadius * 0.75, 0.04, 16, 48);
      const lidRing = new THREE.Mesh(lidRingGeo, goldMetalMaterial);
      lidRing.rotation.x = Math.PI / 2;
      lidRing.position.y = jarHeight + lidHeight + 0.04;
      group.add(lidRing);

      // Curved Cylindrical Label
      const labelHeight = jarHeight * 0.62;
      const labelGeo = new THREE.CylinderGeometry(jarRadius + 0.02, jarRadius + 0.02, labelHeight, 48, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
      const cylLabelMat = labelMaterial.clone();
      cylLabelMat.side = THREE.DoubleSide;
      const labelMesh = new THREE.Mesh(labelGeo, cylLabelMat);
      labelMesh.position.y = jarHeight / 2 + 0.15;
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 2. BOTOL KACA / PLASTIK (Minuman, Madu Cair, Syrup)
    // -------------------------------------------------------------
    case 'bottle': {
      const points: THREE.Vector2[] = [];
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(1.3, 0));
      points.push(new THREE.Vector2(1.35, 0.2));
      points.push(new THREE.Vector2(1.35, 3.2));
      points.push(new THREE.Vector2(1.28, 3.8));
      points.push(new THREE.Vector2(0.65, 4.6));
      points.push(new THREE.Vector2(0.62, 5.5));
      points.push(new THREE.Vector2(0.72, 5.6));
      points.push(new THREE.Vector2(0.72, 5.75));
      points.push(new THREE.Vector2(0.55, 5.75));
      points.push(new THREE.Vector2(0, 5.75));

      const bottleGeo = new THREE.LatheGeometry(points, 48);
      const bottleMesh = new THREE.Mesh(bottleGeo, glassMaterial);
      bottleMesh.castShadow = !isSoftwareGl;
      group.add(bottleMesh);

      // Liquid inside
      const liqPoints: THREE.Vector2[] = [];
      liqPoints.push(new THREE.Vector2(0, 0.1));
      liqPoints.push(new THREE.Vector2(1.25, 0.1));
      liqPoints.push(new THREE.Vector2(1.26, 3.2));
      liqPoints.push(new THREE.Vector2(0.6, 4.4));
      liqPoints.push(new THREE.Vector2(0, 4.4));
      const liqGeo = new THREE.LatheGeometry(liqPoints, 32);
      const liqMesh = new THREE.Mesh(liqGeo, honeyLiquidMaterial);
      group.add(liqMesh);

      // Gold crown/screw cap
      const capGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.5, 32);
      const capMesh = new THREE.Mesh(capGeo, goldMetalMaterial);
      capMesh.position.y = 5.7;
      group.add(capMesh);

      // Curved Bottle Label
      const labelGeo = new THREE.CylinderGeometry(1.38, 1.38, 2.3, 48, 1, true, -Math.PI * 0.65, Math.PI * 1.3);
      const cylLabelMat = labelMaterial.clone();
      cylLabelMat.side = THREE.DoubleSide;
      const labelMesh = new THREE.Mesh(labelGeo, cylLabelMat);
      labelMesh.position.y = 1.9;
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 3. CANISTER KALENG SILINDER (Teh, Cookies, Kopi Biji)
    // -------------------------------------------------------------
    case 'canister': {
      const height = 4.4;
      const radius = 1.5;
      const canGeo = new THREE.CylinderGeometry(radius, radius, height, 48);
      const canMesh = new THREE.Mesh(canGeo, bodyMaterial);
      canMesh.position.y = height / 2;
      canMesh.castShadow = !isSoftwareGl;
      group.add(canMesh);

      // Gold Top Lid
      const lidGeo = new THREE.CylinderGeometry(radius * 1.015, radius * 1.015, 0.7, 48);
      const lidMesh = new THREE.Mesh(lidGeo, goldMetalMaterial);
      lidMesh.position.y = height - 0.35 + 0.7 / 2;
      group.add(lidMesh);

      // Gold Bottom Rim
      const rimGeo = new THREE.TorusGeometry(radius, 0.05, 16, 48);
      const rimMesh = new THREE.Mesh(rimGeo, goldMetalMaterial);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = 0.05;
      group.add(rimMesh);

      // Canister Label Wrap
      const labelGeo = new THREE.CylinderGeometry(radius + 0.02, radius + 0.02, height * 0.72, 48, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
      const cylLabelMat = labelMaterial.clone();
      cylLabelMat.side = THREE.DoubleSide;
      const labelMesh = new THREE.Mesh(labelGeo, cylLabelMat);
      labelMesh.position.y = height * 0.45;
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 4. TUBE KOSMETIK / PASTA
    // -------------------------------------------------------------
    case 'tube': {
      const tubeHeight = 4.2;
      const tubeRadius = 1.2;
      const tubeGeo = new THREE.CylinderGeometry(tubeRadius * 0.9, tubeRadius, tubeHeight, 32);
      const tubeMesh = new THREE.Mesh(tubeGeo, bodyMaterial);
      tubeMesh.position.y = tubeHeight / 2 + 0.8;
      tubeMesh.castShadow = !isSoftwareGl;
      group.add(tubeMesh);

      // Top crimp seal
      const crimpGeo = new THREE.BoxGeometry(tubeRadius * 2.1, 0.35, 0.12);
      const crimpMesh = new THREE.Mesh(crimpGeo, goldMetalMaterial);
      crimpMesh.position.y = tubeHeight + 0.8 + 0.15;
      group.add(crimpMesh);

      // Fluted Cap Base
      const capGeo = new THREE.CylinderGeometry(tubeRadius * 0.95, tubeRadius * 1.05, 0.8, 32);
      const capMesh = new THREE.Mesh(capGeo, goldMetalMaterial);
      capMesh.position.y = 0.4;
      group.add(capMesh);

      // Tube Label
      const labelGeo = new THREE.CylinderGeometry(tubeRadius + 0.02, tubeRadius + 0.02, tubeHeight * 0.65, 32, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
      const cylLabelMat = labelMaterial.clone();
      cylLabelMat.side = THREE.DoubleSide;
      const labelMesh = new THREE.Mesh(labelGeo, cylLabelMat);
      labelMesh.position.y = tubeHeight / 2 + 0.8;
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 5. PAPER BAG JINJING DENGAN TALI ROPE ASLI
    // -------------------------------------------------------------
    case 'paperbag': {
      const bagW = 3.4;
      const bagH = 4.4;
      const bagD = 1.6;

      // Main paper bag body with folded side bellows
      const bagGeo = new THREE.BoxGeometry(bagW, bagH, bagD);
      const bagMesh = new THREE.Mesh(bagGeo, bodyMaterial);
      bagMesh.position.y = bagH / 2;
      bagMesh.castShadow = !isSoftwareGl;
      group.add(bagMesh);

      // Top turn-over rim hem
      const cuffGeo = new THREE.BoxGeometry(bagW * 1.02, 0.4, bagD * 1.02);
      const cuffMesh = new THREE.Mesh(cuffGeo, bodyMaterial);
      cuffMesh.position.y = bagH - 0.2;
      group.add(cuffMesh);

      // Metallic eyelets / grommets
      const eyeletGeo = new THREE.TorusGeometry(0.1, 0.03, 12, 24);
      const eyeletPositions = [
        [-0.8, bagH - 0.25, bagD / 2 + 0.02],
        [0.8, bagH - 0.25, bagD / 2 + 0.02],
        [-0.8, bagH - 0.25, -bagD / 2 - 0.02],
        [0.8, bagH - 0.25, -bagD / 2 - 0.02]
      ];
      eyeletPositions.forEach(([x, y, z]) => {
        const eyelet = new THREE.Mesh(eyeletGeo, goldMetalMaterial);
        eyelet.position.set(x, y, z);
        group.add(eyelet);
      });

      // 3D Braided Rope Handles
      const frontRopeGeo = createRopeHandleGeometry(-0.8, 0.8, bagH - 0.25, bagD / 2 + 0.05, 1.4);
      const frontRope = new THREE.Mesh(frontRopeGeo, darkCordMaterial);
      group.add(frontRope);

      const backRopeGeo = createRopeHandleGeometry(-0.8, 0.8, bagH - 0.25, -bagD / 2 - 0.05, 1.4);
      const backRope = new THREE.Mesh(backRopeGeo, darkCordMaterial);
      backRope.rotation.y = Math.PI;
      group.add(backRope);

      // Front Brand Label Plate
      const labelGeo = new THREE.PlaneGeometry(bagW * 0.82, bagH * 0.65);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, bagH * 0.42, bagD / 2 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 6. KANTONG KERTAS KRAFT (Bakery / Roti / Kopi) DENGAN ZIGZAG TOP
    // -------------------------------------------------------------
    case 'kraftbag': {
      const bagW = 3.2;
      const bagH = 4.4;
      const bagD = 1.5;

      const bagGeo = new THREE.BoxGeometry(bagW, bagH, bagD);
      const bagMesh = new THREE.Mesh(bagGeo, bodyMaterial);
      bagMesh.position.y = bagH / 2;
      bagMesh.castShadow = !isSoftwareGl;
      group.add(bagMesh);

      // Zigzag serrated die-cut top edge (characteristic bakery kraft bag)
      const toothCount = 12;
      const toothW = (bagW * 1.02) / toothCount;
      const toothGeo = new THREE.ConeGeometry(toothW / 2, 0.25, 4);
      for (let i = 0; i < toothCount; i++) {
        const tx = -bagW / 2 + (i + 0.5) * toothW;
        const toothFront = new THREE.Mesh(toothGeo, bodyMaterial);
        toothFront.position.set(tx, bagH + 0.1, bagD / 2);
        group.add(toothFront);

        const toothBack = new THREE.Mesh(toothGeo, bodyMaterial);
        toothBack.position.set(tx, bagH + 0.1, -bagD / 2);
        group.add(toothBack);
      }

      // Top folded foldline crease
      const foldLineGeo = new THREE.BoxGeometry(bagW * 1.01, 0.08, bagD * 1.01);
      const foldLine = new THREE.Mesh(foldLineGeo, goldMetalMaterial);
      foldLine.position.y = bagH - 0.6;
      group.add(foldLine);

      // Front label
      const labelGeo = new THREE.PlaneGeometry(bagW * 0.85, bagH * 0.65);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, bagH * 0.44, bagD / 2 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 7. GIFT BOX MEWAH (TUTUP PISAH LID & BASE + GOLD NECK)
    // -------------------------------------------------------------
    case 'giftbox': {
      const boxW = 3.4;
      const boxH = 2.2;
      const boxD = 3.0;

      // Base Tray
      const baseGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
      const baseMesh = new THREE.Mesh(baseGeo, bodyMaterial);
      baseMesh.position.y = boxH / 2;
      baseMesh.castShadow = !isSoftwareGl;
      group.add(baseMesh);

      // Contrasting Gold Inner Neck Collar (protrudes between base and lid)
      const neckGeo = new THREE.BoxGeometry(boxW * 0.96, 0.6, boxD * 0.96);
      const neckMesh = new THREE.Mesh(neckGeo, goldMetalMaterial);
      neckMesh.position.y = boxH + 0.1;
      group.add(neckMesh);

      // Separate Luxury Lid Cap (Seated with gold trim)
      const lidH = 1.0;
      const lidGeo = new THREE.BoxGeometry(boxW * 1.03, lidH, boxD * 1.03);
      const lidMesh = new THREE.Mesh(lidGeo, bodyMaterial);
      lidMesh.position.y = boxH + 0.4 + lidH / 2;
      lidMesh.castShadow = !isSoftwareGl;
      group.add(lidMesh);

      // Gold Ribbon Band Crossing the Lid
      const ribbonGeo1 = new THREE.BoxGeometry(boxW * 1.04, 0.04, 0.4);
      const ribbon1 = new THREE.Mesh(ribbonGeo1, goldMetalMaterial);
      ribbon1.position.y = boxH + 0.4 + lidH + 0.02;
      group.add(ribbon1);

      const ribbonGeo2 = new THREE.BoxGeometry(0.4, 0.04, boxD * 1.04);
      const ribbon2 = new THREE.Mesh(ribbonGeo2, goldMetalMaterial);
      ribbon2.position.y = boxH + 0.4 + lidH + 0.02;
      group.add(ribbon2);

      // Top Lid Face Brand Label Plate
      const topLabelGeo = new THREE.PlaneGeometry(boxW * 0.75, boxD * 0.75);
      const topLabel = new THREE.Mesh(topLabelGeo, labelMaterial);
      topLabel.rotation.x = -Math.PI / 2;
      topLabel.position.set(0, boxH + 0.4 + lidH + 0.04, 0);
      group.add(topLabel);
      break;
    }

    // -------------------------------------------------------------
    // 8. MAILER BOX E-COMMERCE (KARTON CORRUGATED LIPAT TUCK-IN)
    // -------------------------------------------------------------
    case 'mailerbox': {
      const boxW = 4.2;
      const boxH = 1.4;
      const boxD = 3.2;

      // Low profile wide folding mailer
      const mailerGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
      const mailerMesh = new THREE.Mesh(mailerGeo, bodyMaterial);
      mailerMesh.position.y = boxH / 2;
      mailerMesh.castShadow = !isSoftwareGl;
      group.add(mailerMesh);

      // Side folding tuck flaps
      const flapGeo = new THREE.BoxGeometry(0.08, boxH * 0.8, boxD * 0.7);
      const leftFlap = new THREE.Mesh(flapGeo, goldMetalMaterial);
      leftFlap.position.set(-boxW / 2 - 0.04, boxH / 2, 0);
      group.add(leftFlap);

      const rightFlap = new THREE.Mesh(flapGeo, goldMetalMaterial);
      rightFlap.position.set(boxW / 2 + 0.04, boxH / 2, 0);
      group.add(rightFlap);

      // Front closing locking notch
      const notchGeo = new THREE.BoxGeometry(0.8, 0.12, 0.08);
      const notch = new THREE.Mesh(notchGeo, goldMetalMaterial);
      notch.position.set(0, boxH * 0.45, boxD / 2 + 0.04);
      group.add(notch);

      // Top Lid Surface Branding (Main e-commerce unboxing label)
      const topLabelGeo = new THREE.PlaneGeometry(boxW * 0.85, boxD * 0.82);
      const topLabel = new THREE.Mesh(topLabelGeo, labelMaterial);
      topLabel.rotation.x = -Math.PI / 2;
      topLabel.position.set(0, boxH + 0.02, 0);
      group.add(topLabel);
      break;
    }

    // -------------------------------------------------------------
    // 9. STANDING POUCH MODERN DENGAN OVAL WINDOW VIEW
    // -------------------------------------------------------------
    case 'standpouch': {
      const width = 3.2;
      const height = 4.6;
      const depth = 1.4;

      // Volumetric Doypack body
      const pouchGeo = new THREE.CylinderGeometry(width * 0.48, width * 0.52, height, 32, 1);
      pouchGeo.scale(1, 1, depth / width);
      const pouchMesh = new THREE.Mesh(pouchGeo, bodyMaterial);
      pouchMesh.position.y = height / 2;
      pouchMesh.castShadow = !isSoftwareGl;
      group.add(pouchMesh);

      // Top Heat Seal with tear notches
      const sealGeo = new THREE.BoxGeometry(width * 1.05, 0.45, 0.14);
      const sealMesh = new THREE.Mesh(sealGeo, goldMetalMaterial);
      sealMesh.position.y = height + 0.15;
      group.add(sealMesh);

      // Clear Window Mesh revealing interior contents
      const winGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.9, 24);
      winGeo.scale(1, 1, 0.1);
      const winMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D89E3A'), // Roasted granola/coffee beans
        roughness: 0.2,
        clearcoat: 1.0
      });
      const winMesh = new THREE.Mesh(winGeo, winMat);
      winMesh.position.set(0, height * 0.35, depth / 2 + 0.01);
      group.add(winMesh);

      // Front Curved Label
      const labelGeo = new THREE.PlaneGeometry(width * 0.82, height * 0.55);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, height * 0.65, (depth / 2) * 0.88 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 10. POUCH ZIPPER (RESEALABLE DOYPACK DENGAN EURO SLOT)
    // -------------------------------------------------------------
    case 'zipperpouch': {
      const width = 3.2;
      const height = 4.6;
      const depth = 1.3;

      const pouchGeo = new THREE.CylinderGeometry(width * 0.48, width * 0.52, height, 32, 1);
      pouchGeo.scale(1, 1, depth / width);
      const pouchMesh = new THREE.Mesh(pouchGeo, bodyMaterial);
      pouchMesh.position.y = height / 2;
      pouchMesh.castShadow = !isSoftwareGl;
      group.add(pouchMesh);

      // Wide Top Header Seal
      const headerGeo = new THREE.BoxGeometry(width * 1.05, 0.7, 0.14);
      const headerMesh = new THREE.Mesh(headerGeo, goldMetalMaterial);
      headerMesh.position.y = height + 0.25;
      group.add(headerMesh);

      // Euro-slot hanging punch hole
      const holeGeo = new THREE.TorusGeometry(0.2, 0.04, 12, 24);
      const holeMesh = new THREE.Mesh(holeGeo, darkCordMaterial);
      holeMesh.position.set(0, height + 0.35, 0.08);
      group.add(holeMesh);

      // Red Zip Pull Line
      const zipGeo = new THREE.BoxGeometry(width * 0.98, 0.08, 0.16);
      const zipMesh = new THREE.Mesh(zipGeo, new THREE.MeshBasicMaterial({ color: 0xDC2626 }));
      zipMesh.position.set(0, height - 0.15, 0);
      group.add(zipMesh);

      // Front Label
      const labelGeo = new THREE.PlaneGeometry(width * 0.84, height * 0.7);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, height * 0.45, (depth / 2) * 0.88 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 11. FLOW WRAP (KEMASAN SNACK / BISKUIT HORIZONTAL)
    // -------------------------------------------------------------
    case 'flowbag': {
      // Horizontal snack pillow pack
      const flowW = 4.4;
      const flowH = 2.2;
      const flowD = 1.5;

      const bagGeo = new THREE.CylinderGeometry(flowH * 0.48, flowH * 0.48, flowW * 0.75, 32);
      bagGeo.rotateZ(Math.PI / 2);
      bagGeo.scale(1, 1, flowD / flowH);
      const bagMesh = new THREE.Mesh(bagGeo, bodyMaterial);
      bagMesh.position.y = flowH / 2;
      bagMesh.castShadow = !isSoftwareGl;
      group.add(bagMesh);

      // Left & Right Serrated Fin Seals
      const sealGeo = new THREE.BoxGeometry(0.4, flowH * 0.95, 0.12);
      const leftSeal = new THREE.Mesh(sealGeo, goldMetalMaterial);
      leftSeal.position.set(-flowW / 2 + 0.2, flowH / 2, 0);
      group.add(leftSeal);

      const rightSeal = new THREE.Mesh(sealGeo, goldMetalMaterial);
      rightSeal.position.set(flowW / 2 - 0.2, flowH / 2, 0);
      group.add(rightSeal);

      // Front Curved Label
      const labelGeo = new THREE.PlaneGeometry(flowW * 0.6, flowH * 0.75);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, flowH / 2, (flowD / 2) * 0.92 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 12. GABLE-TOP KARTON SUSU & JUS (ATAP SEGITIGA + SPOUT CAP)
    // -------------------------------------------------------------
    case 'gabletop': {
      const w = 2.5;
      const h = 3.6;
      const d = 2.5;

      // Lower rectangular carton body
      const bodyGeo = new THREE.BoxGeometry(w, h, d);
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
      bodyMesh.position.y = h / 2;
      bodyMesh.castShadow = !isSoftwareGl;
      group.add(bodyMesh);

      // Peaked Triangular Gable Roof
      const roofH = 1.1;
      const roofPoints: THREE.Vector2[] = [
        new THREE.Vector2(-w / 2, 0),
        new THREE.Vector2(0, roofH),
        new THREE.Vector2(w / 2, 0)
      ];
      const roofShape = new THREE.Shape(roofPoints);
      const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: d, bevelEnabled: false });
      roofGeo.translate(0, h, -d / 2);
      const roofMesh = new THREE.Mesh(roofGeo, bodyMaterial);
      group.add(roofMesh);

      // Top vertical ridge seal
      const ridgeGeo = new THREE.BoxGeometry(0.12, 0.35, d * 1.02);
      const ridgeMesh = new THREE.Mesh(ridgeGeo, goldMetalMaterial);
      ridgeMesh.position.set(0, h + roofH + 0.17, 0);
      group.add(ridgeMesh);

      // Plastic Screw Pour-Spout Cap on slanted front face
      const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 24);
      capGeo.rotateZ(Math.PI / 4);
      const capMesh = new THREE.Mesh(capGeo, goldMetalMaterial);
      capMesh.position.set(-0.4, h + roofH * 0.45, d / 2 * 0.6);
      group.add(capMesh);

      // Front Face Brand Label
      const labelGeo = new THREE.PlaneGeometry(w * 0.9, h * 0.85);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, h * 0.46, d / 2 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 13. HANDLE BAG (PLASTIK / SPUNBOND DENGAN DIE-CUT OVAL)
    // -------------------------------------------------------------
    case 'handlebag': {
      const bagW = 3.2;
      const bagH = 4.6;
      const bagD = 1.1;

      const bagGeo = new THREE.BoxGeometry(bagW, bagH, bagD);
      const bagMesh = new THREE.Mesh(bagGeo, bodyMaterial);
      bagMesh.position.y = bagH / 2;
      bagMesh.castShadow = !isSoftwareGl;
      group.add(bagMesh);

      // Die-cut oval handle punch-out
      const ovalGeo = new THREE.TorusGeometry(0.35, 0.05, 16, 32);
      ovalGeo.scale(1.8, 0.7, 1);
      const handleRim = new THREE.Mesh(ovalGeo, goldMetalMaterial);
      handleRim.position.set(0, bagH - 0.6, bagD / 2 + 0.02);
      group.add(handleRim);

      // Front Label
      const labelGeo = new THREE.PlaneGeometry(bagW * 0.84, bagH * 0.62);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, bagH * 0.38, bagD / 2 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 14. SACHET / SASET MINI (KOPI / BUMBU / SAMBAL 4-SIDE SEAL)
    // -------------------------------------------------------------
    case 'sachet': {
      const sachetW = 2.4;
      const sachetH = 3.6;
      const sachetD = 0.22;

      // Slim sachet body
      const sachetGeo = new THREE.BoxGeometry(sachetW, sachetH, sachetD);
      const sachetMesh = new THREE.Mesh(sachetGeo, bodyMaterial);
      sachetMesh.position.y = sachetH / 2;
      sachetMesh.castShadow = !isSoftwareGl;
      group.add(sachetMesh);

      // Wide textured perimeter seal borders
      const sealBorderGeo = new THREE.BoxGeometry(sachetW * 1.02, 0.35, sachetD * 1.1);
      const topSeal = new THREE.Mesh(sealBorderGeo, goldMetalMaterial);
      topSeal.position.set(0, sachetH - 0.17, 0);
      group.add(topSeal);

      const bottomSeal = new THREE.Mesh(sealBorderGeo, goldMetalMaterial);
      bottomSeal.position.set(0, 0.17, 0);
      group.add(bottomSeal);

      // V-Notch Laser Tear Slit on left edge
      const notchGeo = new THREE.ConeGeometry(0.1, 0.18, 3);
      notchGeo.rotateZ(Math.PI / 2);
      const notchMesh = new THREE.Mesh(notchGeo, darkCordMaterial);
      notchMesh.position.set(-sachetW / 2 + 0.05, sachetH - 0.45, 0);
      group.add(notchMesh);

      // Centered Product Label
      const labelGeo = new THREE.PlaneGeometry(sachetW * 0.85, sachetH * 0.68);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, sachetH / 2, sachetD / 2 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 15. PILLOW POUCH KEMBUNG (SNACK KERIPIK / BISKUIT)
    // -------------------------------------------------------------
    case 'flatpillow': {
      const pillowW = 3.2;
      const pillowH = 4.2;
      const pillowD = 1.6;

      // Puffed bulging pillow pouch
      const pillowGeo = new THREE.SphereGeometry(1.6, 32, 24);
      pillowGeo.scale(pillowW / 3.2, pillowH / 3.2, pillowD / 3.2);
      const pillowMesh = new THREE.Mesh(pillowGeo, bodyMaterial);
      pillowMesh.position.y = pillowH / 2;
      pillowMesh.castShadow = !isSoftwareGl;
      group.add(pillowMesh);

      // Pinched Top and Bottom Crimp Seals
      const crimpGeo = new THREE.BoxGeometry(pillowW * 1.02, 0.35, 0.14);
      const topCrimp = new THREE.Mesh(crimpGeo, goldMetalMaterial);
      topCrimp.position.set(0, pillowH - 0.15, 0);
      group.add(topCrimp);

      const bottomCrimp = new THREE.Mesh(crimpGeo, goldMetalMaterial);
      bottomCrimp.position.set(0, 0.15, 0);
      group.add(bottomCrimp);

      // Curved Front Label
      const labelGeo = new THREE.PlaneGeometry(pillowW * 0.78, pillowH * 0.65);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, pillowH / 2, (pillowD / 2) * 0.95 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 16. STANDING POUCH KLASIK (POUCH BERDIRI STANDAR)
    // -------------------------------------------------------------
    case 'pouch': {
      const width = 3.2;
      const height = 4.6;
      const depth = 1.3;

      const pouchGeo = new THREE.CylinderGeometry(width * 0.48, width * 0.52, height, 32, 1);
      pouchGeo.scale(1, 1, depth / width);
      const pouchMesh = new THREE.Mesh(pouchGeo, bodyMaterial);
      pouchMesh.position.y = height / 2;
      pouchMesh.castShadow = !isSoftwareGl;
      group.add(pouchMesh);

      // Top heat seal
      const sealGeo = new THREE.BoxGeometry(width * 1.05, 0.45, 0.14);
      const sealMesh = new THREE.Mesh(sealGeo, goldMetalMaterial);
      sealMesh.position.y = height + 0.15;
      group.add(sealMesh);

      // Front Curved Label
      const labelGeo = new THREE.PlaneGeometry(width * 0.84, height * 0.7);
      const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
      labelMesh.position.set(0, height * 0.48, (depth / 2) * 0.88 + 0.02);
      group.add(labelMesh);
      break;
    }

    // -------------------------------------------------------------
    // 17. KOTAK KARTON BOX (STANDARD FOLDING BOX)
    // -------------------------------------------------------------
    case 'box':
    default: {
      const boxW = 3.0;
      const boxH = 4.2;
      const boxD = 2.0;

      const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
      const boxMesh = new THREE.Mesh(boxGeo, bodyMaterial);
      boxMesh.position.y = boxH / 2;
      boxMesh.castShadow = !isSoftwareGl;
      group.add(boxMesh);

      // Gold Edge Corner Highlights
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xD4AF37, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edgesGeo, lineMat);
      wireframe.position.copy(boxMesh.position);
      group.add(wireframe);

      // Front Face Label
      const frontLabelGeo = new THREE.PlaneGeometry(boxW * 0.94, boxH * 0.9);
      const frontMesh = new THREE.Mesh(frontLabelGeo, labelMaterial);
      frontMesh.position.set(0, boxH / 2, boxD / 2 + 0.02);
      group.add(frontMesh);

      // Top Face Accent Plate
      const topLabelGeo = new THREE.PlaneGeometry(boxW * 0.88, boxD * 0.85);
      const topMesh = new THREE.Mesh(topLabelGeo, labelMaterial);
      topMesh.rotation.x = -Math.PI / 2;
      topMesh.position.set(0, boxH + 0.015, 0);
      group.add(topMesh);
      break;
    }
  }

  // Common Studio Pedestal Ground Disc
  const pedestalGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.2, 48);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color ? shadeColorHex(config.color, -50) : '#1E1E22'),
    roughness: 0.35,
    metalness: 0.1
  });
  const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
  pedestal.position.y = -0.1;
  pedestal.receiveShadow = !isSoftwareGl;
  group.add(pedestal);

  // Soft Radial Contact Shadow Disc
  const shadowGeo = new THREE.PlaneGeometry(8, 8);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.18;
  group.add(shadowMesh);

  return group;
};

/**
 * Helper to determine if a hex color is dark
 */
function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.45;
}

/**
 * Hex color shade adjuster
 */
function shadeColorHex(color: string, percent: number): string {
  let num = parseInt(color.replace('#', ''), 16);
  if (isNaN(num)) return '#1E1E22';
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = (num >> 8 & 0x00FF) + amt;
  let B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

/**
 * Canvas 2D rounded rectangle helper
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
