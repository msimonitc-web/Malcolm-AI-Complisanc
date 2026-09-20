import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// Base SVG with brand navy background (#071433), gold ankh (#d9a438), and CompliSey circular navy/gold emblem
function createSvg(size, paddingPercent = 0.1) {
  const pad = size * paddingPercent;
  const contentSize = size - (pad * 2);
  const scale = contentSize / 100;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#071433"/>
    <g transform="translate(${pad}, ${pad}) scale(${scale})">
      <!-- Outer Circular C Glyph -->
      <path d="M 80.5 28.5 A 37.5 37.5 0 1 0 80.5 71.5" stroke="#3b82f6" stroke-width="7.2" stroke-linecap="butt"/>
      <!-- Golden Ankh Element -->
      <path fill-rule="evenodd" clip-rule="evenodd" d="M 50 23.5 C 43.8 23.5 41.5 28.5 41.5 34.8 C 41.5 40.8 45.2 45.2 47.6 47.5 L 47.6 49.5 L 52.4 49.5 L 52.4 47.5 C 54.8 45.2 58.5 40.8 58.5 34.8 C 58.5 28.5 56.2 23.5 50 23.5 Z M 50 27.6 C 53.6 27.6 54.8 31 54.8 34.8 C 54.8 39.2 52.2 43 50 44.8 C 47.8 43 45.2 39.2 45.2 34.8 C 45.2 31 46.4 27.6 50 27.6 Z" fill="#d9a438"/>
      <rect x="37.5" y="49.5" width="25" height="5" rx="0.8" fill="#d9a438"/>
      <path d="M 47.4 54.5 L 52.6 54.5 L 53.4 75 L 46.6 75 Z" fill="#d9a438"/>
    </g>
  </svg>`;
}

// Maskable icon with full-bleed background and 20% safe-zone margin
function createMaskableSvg(size) {
  const pad = size * 0.20; // 20% safe zone margin
  const contentSize = size - (pad * 2);
  const scale = contentSize / 100;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#071433"/>
    <g transform="translate(${pad}, ${pad}) scale(${scale})">
      <!-- Outer Circular C Glyph -->
      <path d="M 80.5 28.5 A 37.5 37.5 0 1 0 80.5 71.5" stroke="#3b82f6" stroke-width="7.2" stroke-linecap="butt"/>
      <!-- Golden Ankh Element -->
      <path fill-rule="evenodd" clip-rule="evenodd" d="M 50 23.5 C 43.8 23.5 41.5 28.5 41.5 34.8 C 41.5 40.8 45.2 45.2 47.6 47.5 L 47.6 49.5 L 52.4 49.5 L 52.4 47.5 C 54.8 45.2 58.5 40.8 58.5 34.8 C 58.5 28.5 56.2 23.5 50 23.5 Z M 50 27.6 C 53.6 27.6 54.8 31 54.8 34.8 C 54.8 39.2 52.2 43 50 44.8 C 47.8 43 45.2 39.2 45.2 34.8 C 45.2 31 46.4 27.6 50 27.6 Z" fill="#d9a438"/>
      <rect x="37.5" y="49.5" width="25" height="5" rx="0.8" fill="#d9a438"/>
      <path d="M 47.4 54.5 L 52.6 54.5 L 53.4 75 L 46.6 75 Z" fill="#d9a438"/>
    </g>
  </svg>`;
}

async function run() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), createSvg(512, 0.1));

  // 2. pwa-192x192.png
  await sharp(Buffer.from(createSvg(192, 0.1)))
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 3. pwa-512x512.png
  await sharp(Buffer.from(createSvg(512, 0.1)))
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 4. pwa-maskable-512x512.png
  await sharp(Buffer.from(createMaskableSvg(512)))
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 5. apple-touch-icon.png (180x180)
  await sharp(Buffer.from(createSvg(180, 0.12)))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 6. favicon.png / favicon-32x32.png
  await sharp(Buffer.from(createSvg(32, 0.05)))
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  console.log('PWA icons successfully generated in public directory!');
}

run().catch(console.error);
