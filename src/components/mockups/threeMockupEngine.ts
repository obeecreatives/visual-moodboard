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
  const isMetallic = config.materialStyle === 'glossy';

  // 1. Background Fill
  if (isKraft) {
    ctx.fillStyle = '#C29B63';
    ctx.fillRect(0, 0, width, height);
    // Subtle Kraft fibers
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

  // 2. Central Label Panel Frame (For high-end packaging aesthetic)
  const padX = width * 0.18;
  const padY = height * 0.12;
  const labelW = width - padX * 2;
  const labelH = height - padY * 2;

  // White / Off-white interior label plate
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
  let cursorY = padY + 70;

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
 * Builds realistic 3D Model Group for the selected packaging shape
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

  switch (shapeKey) {
    case 'jar': {
      // 1. Thick Glass Jar Hexagonal / Cylindrical
      const jarHeight = 3.6;
      const jarRadius = 1.6;
      const jarGeo = new THREE.CylinderGeometry(jarRadius, jarRadius * 0.96, jarHeight, 48, 1);
      const jarMesh = new THREE.Mesh(jarGeo, glassMaterial);
      jarMesh.position.y = jarHeight / 2 + 0.1;
      jarMesh.castShadow = !isSoftwareGl;
      group.add(jarMesh);

      // 2. Honey Liquid Core inside the Jar
      const liquidGeo = new THREE.CylinderGeometry(jarRadius * 0.91, jarRadius * 0.88, jarHeight * 0.82, 32);
      const liquidMesh = new THREE.Mesh(liquidGeo, honeyLiquidMaterial);
      liquidMesh.position.y = (jarHeight * 0.82) / 2 + 0.2;
      group.add(liquidMesh);

      // 3. Gold Metallic Screw Lid
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

      // 4. Wrap-around Brand Label (Curved Cylindrical Decal)
      const labelHeight = jarHeight * 0.62;
      const labelRadius = jarRadius + 0.02; // Offset slightly to eliminate z-fighting
      const labelGeo = new THREE.CylinderGeometry(labelRadius, labelRadius, labelHeight, 48, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
      const labelMat = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: isMatte ? 0.6 : 0.2,
        clearcoat: isKraft ? 0 : 0.8,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        side: THREE.DoubleSide
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.y = jarHeight / 2 + 0.15;
      group.add(labelMesh);
      break;
    }

    case 'bottle': {
      // Sleek Beverage / Coldbrew Bottle with curved neck
      const points: THREE.Vector2[] = [];
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(1.3, 0));
      points.push(new THREE.Vector2(1.35, 0.2));
      points.push(new THREE.Vector2(1.35, 3.2)); // Straight body
      points.push(new THREE.Vector2(1.28, 3.8)); // Shoulder curve
      points.push(new THREE.Vector2(0.65, 4.6)); // Neck start
      points.push(new THREE.Vector2(0.62, 5.5)); // Neck top
      points.push(new THREE.Vector2(0.72, 5.6)); // Lip bead
      points.push(new THREE.Vector2(0.72, 5.75));
      points.push(new THREE.Vector2(0.55, 5.75));
      points.push(new THREE.Vector2(0, 5.75));

      const bottleGeo = new THREE.LatheGeometry(points, 48);
      const bottleMesh = new THREE.Mesh(bottleGeo, glassMaterial);
      bottleMesh.castShadow = !isSoftwareGl;
      group.add(bottleMesh);

      // Inner Liquid
      const liqPoints: THREE.Vector2[] = [];
      liqPoints.push(new THREE.Vector2(0, 0.1));
      liqPoints.push(new THREE.Vector2(1.25, 0.1));
      liqPoints.push(new THREE.Vector2(1.26, 3.2));
      liqPoints.push(new THREE.Vector2(0.6, 4.4));
      liqPoints.push(new THREE.Vector2(0, 4.4));
      const liqGeo = new THREE.LatheGeometry(liqPoints, 32);
      const liqMesh = new THREE.Mesh(liqGeo, honeyLiquidMaterial);
      group.add(liqMesh);

      // Crown / Screw Cap
      const capGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.5, 32);
      const capMesh = new THREE.Mesh(capGeo, goldMetalMaterial);
      capMesh.position.y = 5.7;
      group.add(capMesh);

      // Curved Bottle Label
      const labelGeo = new THREE.CylinderGeometry(1.38, 1.38, 2.3, 48, 1, true, -Math.PI * 0.65, Math.PI * 1.3);
      const labelMat = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: isMatte ? 0.6 : 0.2,
        clearcoat: 0.9,
        transparent: true,
        side: THREE.DoubleSide
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.y = 1.9;
      group.add(labelMesh);
      break;
    }

    case 'canister': {
      // Cylinder Tea / Cookies Canister with Gold Edges
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
      const labelMat = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: isMatte ? 0.6 : 0.2,
        clearcoat: 0.8,
        transparent: true,
        side: THREE.DoubleSide
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.y = height * 0.45;
      group.add(labelMesh);
      break;
    }

    case 'tube': {
      // Cosmetic Squeeze Tube
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

      // Fluted Flip Cap
      const capGeo = new THREE.CylinderGeometry(tubeRadius * 0.95, tubeRadius * 1.05, 0.8, 32);
      const capMesh = new THREE.Mesh(capGeo, goldMetalMaterial);
      capMesh.position.y = 0.4;
      group.add(capMesh);

      // Tube Label
      const labelGeo = new THREE.CylinderGeometry(tubeRadius + 0.02, tubeRadius + 0.02, tubeHeight * 0.65, 32, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
      const labelMat = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: 0.3,
        clearcoat: 0.9,
        transparent: true,
        side: THREE.DoubleSide
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.y = tubeHeight / 2 + 0.8;
      group.add(labelMesh);
      break;
    }

    case 'pouch':
    case 'standpouch':
    case 'zipperpouch': {
      // Standing Pouch Doypack with realistic curvature
      const width = 3.2;
      const height = 4.6;
      const depth = 1.3;

      // Pouch main body (pinched at top, voluminous at bottom)
      const pouchGeo = new THREE.CylinderGeometry(width * 0.48, width * 0.52, height, 32, 1);
      pouchGeo.scale(1, 1, depth / width);
      const pouchMesh = new THREE.Mesh(pouchGeo, bodyMaterial);
      pouchMesh.position.y = height / 2;
      pouchMesh.castShadow = !isSoftwareGl;
      group.add(pouchMesh);

      // Top heat seal / zipper crimp
      const sealGeo = new THREE.BoxGeometry(width * 1.05, 0.45, 0.14);
      const sealMesh = new THREE.Mesh(sealGeo, goldMetalMaterial);
      sealMesh.position.y = height + 0.15;
      group.add(sealMesh);

      // Front Curved Label
      const labelGeo = new THREE.PlaneGeometry(width * 0.84, height * 0.7);
      const labelMat = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: isMatte ? 0.7 : 0.25,
        clearcoat: isKraft ? 0 : 0.8,
        transparent: true
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.set(0, height * 0.48, (depth / 2) * 0.88 + 0.02);
      group.add(labelMesh);
      break;
    }

    case 'box':
    default: {
      // Beveled Premium Packaging Box
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
      const labelMat = new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        roughness: isMatte ? 0.6 : 0.2,
        clearcoat: isKraft ? 0 : 0.85,
        transparent: true
      });
      const frontMesh = new THREE.Mesh(frontLabelGeo, labelMat);
      frontMesh.position.set(0, boxH / 2, boxD / 2 + 0.02);
      group.add(frontMesh);

      // Top Face Accent Plate
      const topLabelGeo = new THREE.PlaneGeometry(boxW * 0.88, boxD * 0.85);
      const topMesh = new THREE.Mesh(topLabelGeo, labelMat);
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
