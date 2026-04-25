// Box spawn positions: { x, y, type (1|2|3) }
// y = box sprite center; placed ~60px above the platform surface they're accessed from.
export const BOXES = [
  // Above ground (surfaceY=224 → box.y=164)
  { x: 160,  y: 164, type: 1 },
  { x: 600,  y: 164, type: 2 },
  { x: 1200, y: 164, type: 3 },
  { x: 1800, y: 164, type: 1 },

  // Above platforms at surfaceY=192 → box.y=132
  { x: 212,  y: 132, type: 2 },
  { x: 1192, y: 132, type: 3 },

  // Above platforms at surfaceY=208 (stepping stone) → box.y=148
  { x: 496,  y: 148, type: 1 },

  // Above platforms at surfaceY=176 → box.y=116
  { x: 372,  y: 116, type: 3 },
  { x: 870,  y: 116, type: 2 },
  { x: 1348, y: 116, type: 1 },

  // Above platforms at surfaceY=160 → box.y=100
  { x: 712,  y: 100, type: 2 },
  { x: 1044, y: 100, type: 3 },
  { x: 1512, y: 100, type: 1 },
];

// Pre-placed exercise coins: { x, y }
// y = sprite center; 16px above platform surface (same rule as fruits).
// Spread ~one per major platform section so exercises appear throughout the run.
export const COINS = [
  { x: 228,  y: 176 },  // platform 180 (surfaceY 192)
  { x: 564,  y: 176 },  // platform 520 (surfaceY 192)
  { x: 744,  y: 144 },  // platform 680 (surfaceY 160)
  { x: 1364, y: 160 },  // platform 1320 (surfaceY 176)
  { x: 1708, y: 176 },  // platform 1660 (surfaceY 192)
];

// Fruit spawn positions: { x, y, type }
// y = center of the 32×32 sprite; place 16px above platform surface.
// Platforms (x, surfaceY, widthInTiles) — surface_y values from GameScene PLATFORMS.

export const FRUITS = [
  // Ground (surfaceY=224 → y=208)
  { x: 100,  y: 208, type: 'apple'      },
  { x: 290,  y: 208, type: 'banana'     },

  // Platform  180, surfaceY 192 → y=176
  { x: 212,  y: 176, type: 'kiwi'       },

  // Platform 340, surfaceY 176 → y=160
  { x: 370,  y: 160, type: 'melon'      },
  { x: 402,  y: 160, type: 'orange'     },

  // Stepping stone 480, surfaceY 208 → y=192
  { x: 492,  y: 192, type: 'cherry'     },

  // Platform 520, surfaceY 192 → y=176
  { x: 548,  y: 176, type: 'pineapple'  },

  // Platform 680, surfaceY 160 → y=144
  { x: 712,  y: 144, type: 'strawberry' },

  // Platform 840, surfaceY 176 → y=160
  { x: 866,  y: 160, type: 'apple'      },
  { x: 898,  y: 160, type: 'banana'     },

  // Platform 1020, surfaceY 160 → y=144
  { x: 1044, y: 144, type: 'cherry'     },

  // Platform 1160, surfaceY 192 → y=176
  { x: 1188, y: 176, type: 'kiwi'       },
  { x: 1228, y: 176, type: 'melon'      },

  // Platform 1320, surfaceY 176 → y=160
  { x: 1348, y: 160, type: 'orange'     },

  // Platform 1480, surfaceY 160 → y=144
  { x: 1508, y: 144, type: 'pineapple'  },
  { x: 1548, y: 144, type: 'strawberry' },

  // Platform 1660, surfaceY 192 → y=176
  { x: 1692, y: 176, type: 'apple'      },

  // Platform 1840, surfaceY 176 → y=160
  { x: 1864, y: 160, type: 'banana'     },
  { x: 1912, y: 160, type: 'cherry'     },
  { x: 1960, y: 160, type: 'kiwi'       },

  // Final stretch (ground)
  { x: 2010, y: 208, type: 'melon'      },
];
