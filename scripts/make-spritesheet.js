// Generates a pixelated spritesheet from mundmotorik-bilder.png
// Run: node scripts/make-spritesheet.js

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const root  = path.resolve(__dir, '..');

const SRC = path.join(root, 'assets/mundmotorik-bilder.png');
const OUT = path.join(root, 'assets/exercise-spritesheet.png');

// Source image: 1468 × 766, two rows of face photos
const IMG_W = 1468;
const ROW_H = 383;   // 766 / 2

// Row layout: 5 photos on top, 4 on bottom
const ROWS = [
  { count: 5, y: 0 },
  { count: 4, y: ROW_H },
];

// Output: each face downscaled to PIXEL×PIXEL (area-average creates the
// pixelated colour palette), then nearest-neighbour upscaled to FRAME×FRAME
// for the chunky high-resolution pixel-art look.
const PIXEL = 24;    // internal pixel art resolution — smaller = chunkier pixels
const FRAME = 192;   // output frame size (8× scale)

async function main() {
  const img = sharp(SRC);
  const frames = [];

  for (const { count, y } of ROWS) {
    const cellW = Math.floor(IMG_W / count);
    for (let col = 0; col < count; col++) {
      const x = col * cellW;
      // Crop: slight horizontal margin; focus on face (skip top hair, keep mouth prominent)
      const mx = Math.floor(cellW * 0.07);
      const topSkip = Math.floor(ROW_H * 0.10);   // skip ~10% top (hair)
      const botSkip = Math.floor(ROW_H * 0.12);   // skip ~12% bottom (chin/neck)
      const fw = cellW - mx * 2;
      const fh = ROW_H - topSkip - botSkip;
      const my = topSkip;

      // Two explicit steps via PNG buffer: area-average down first,
      // then nearest-neighbour up from the materialised small image.
      const smallPng = await img
        .clone()
        .extract({ left: x + mx, top: y + my, width: fw, height: fh })
        .resize(PIXEL, PIXEL, { kernel: 'lanczos3' })
        .png()
        .toBuffer();

      const buf = await sharp(smallPng)
        .resize(FRAME, FRAME, { kernel: 'nearest' })
        .png()
        .toBuffer();

      frames.push(buf);
    }
  }

  const sheetW = frames.length * FRAME;
  const composites = frames.map((input, i) => ({
    input,
    left: i * FRAME,
    top: 0,
  }));

  await sharp({
    create: {
      width: sheetW, height: FRAME,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(OUT);

  console.log(`✓ ${OUT}`);
  console.log(`  ${frames.length} frames  ·  ${FRAME}×${FRAME} px each  ·  sheet: ${sheetW}×${FRAME}`);
}

main().catch(err => { console.error(err); process.exit(1); });
