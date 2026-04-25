// Each exercise: { key, label, drawCanvas(ctx) }
// drawCanvas draws a 64×64 pixel-art face onto an HTML Canvas 2D context.
// Tongue direction is the key visual: bright red shape protrudes outside the mouth.

function drawBase(ctx) {
  // Head (skin)
  ctx.fillStyle = '#ffddbb';
  ctx.beginPath();
  ctx.arc(32, 31, 26, 0, Math.PI * 2);
  ctx.fill();

  // Hair cap (top circle, dark brown)
  ctx.fillStyle = '#4a3000';
  ctx.beginPath();
  ctx.arc(32, 13, 22, 0, Math.PI * 2);
  ctx.fill();

  // Recover face skin over lower part of hair
  ctx.fillStyle = '#ffddbb';
  ctx.fillRect(6, 20, 52, 18);
  ctx.beginPath();
  ctx.arc(32, 31, 23, 0, Math.PI * 2);
  ctx.fill();

  // Eyes — white
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(21, 26, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(43, 26, 5, 0, Math.PI * 2); ctx.fill();

  // Pupils
  ctx.fillStyle = '#221100';
  ctx.beginPath(); ctx.arc(22, 27, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(44, 27, 3, 0, Math.PI * 2); ctx.fill();

  // Eye shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(24, 25, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(46, 25, 1.5, 0, Math.PI * 2); ctx.fill();

  // Mouth — open (dark cavity + white teeth strip)
  ctx.fillStyle = '#882222';
  ctx.beginPath();
  ctx.ellipse(32, 44, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Upper teeth
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(18, 39, 28, 5);

  // Lower teeth
  ctx.fillRect(18, 46, 28, 5);

  // Mouth interior (throat shadow)
  ctx.fillStyle = '#550000';
  ctx.beginPath();
  ctx.ellipse(32, 47, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function tongue(ctx) {
  ctx.fillStyle = '#ff4444';
}

export const EXERCISES = [
  {
    key: 'ex-tongue-nose',
    label: 'Zunge zur Nase',
    drawCanvas(ctx) {
      // Draw tongue BEFORE base so face overlaps the base of the tongue
      tongue(ctx);
      ctx.fillRect(27, 10, 10, 32);          // shaft going up out of mouth
      ctx.beginPath(); ctx.arc(32, 10, 6, 0, Math.PI * 2); ctx.fill();  // rounded tip
      drawBase(ctx);
    },
  },
  {
    key: 'ex-tongue-chin',
    label: 'Zunge zum Kinn',
    drawCanvas(ctx) {
      drawBase(ctx);
      tongue(ctx);
      ctx.fillRect(27, 43, 10, 20);          // shaft going down
      ctx.beginPath(); ctx.arc(32, 63, 6, 0, Math.PI * 2); ctx.fill();
    },
  },
  {
    key: 'ex-tongue-left',
    label: 'Zunge nach links',
    drawCanvas(ctx) {
      drawBase(ctx);
      tongue(ctx);
      ctx.fillRect(0, 41, 21, 8);            // shaft going left
      ctx.beginPath(); ctx.arc(0, 45, 6, 0, Math.PI * 2); ctx.fill();
    },
  },
  {
    key: 'ex-tongue-right',
    label: 'Zunge nach rechts',
    drawCanvas(ctx) {
      drawBase(ctx);
      tongue(ctx);
      ctx.fillRect(43, 41, 21, 8);           // shaft going right
      ctx.beginPath(); ctx.arc(64, 45, 6, 0, Math.PI * 2); ctx.fill();
    },
  },
  {
    key: 'ex-home-spot',
    label: 'Zunge nach Hause',
    drawCanvas(ctx) {
      drawBase(ctx);
      // Tongue tucked inside: small visible shape just behind upper teeth
      ctx.fillStyle = '#ff6666';
      ctx.beginPath();
      ctx.ellipse(32, 43, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Bright spot at the "home" position (tip behind front incisors)
      ctx.fillStyle = '#ff2222';
      ctx.beginPath(); ctx.arc(32, 41, 3, 0, Math.PI * 2); ctx.fill();
    },
  },
];
