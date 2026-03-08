// Generator for original Lottie JSON animations
// These are 100% original, created programmatically - no licensing issues

function makeBase(name: string, w: number, h: number, fr: number, ip: number, op: number) {
  return { v: "5.7.4", nm: name, fr, ip, op, w, h, ddd: 0, assets: [] as any[], layers: [] as any[] };
}

function solidLayer(nm: string, color: string, w: number, h: number, ip: number, op: number, ks: any, ind: number) {
  return {
    ty: 1, nm, ind, ip, op, st: 0, sr: 1,
    sw: w, sh: h, sc: color,
    ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [w/2, h/2, 0] }, a: { a: 0, k: [w/2, h/2, 0] }, s: { a: 0, k: [100, 100, 100] }, ...ks },
    bm: 0
  };
}

function shapeLayer(nm: string, shapes: any[], ip: number, op: number, ks: any, ind: number) {
  return {
    ty: 4, nm, ind, ip, op, st: 0, sr: 1,
    shapes,
    ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [256, 256, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }, ...ks },
    bm: 0
  };
}

function ellipse(size: number | any, pos?: any) {
  return { ty: "el", nm: "Ellipse", d: 1, p: pos || { a: 0, k: [0, 0] }, s: typeof size === 'number' ? { a: 0, k: [size, size] } : size };
}

function rect(w: number, h: number, r?: number, pos?: any) {
  return { ty: "rc", nm: "Rect", d: 1, p: pos || { a: 0, k: [0, 0] }, s: { a: 0, k: [w, h] }, r: { a: 0, k: r || 0 } };
}

function fill(color: number[], opacity?: number | any) {
  return { ty: "fl", nm: "Fill", c: { a: 0, k: color }, o: typeof opacity === 'object' ? opacity : { a: 0, k: opacity ?? 100 }, r: 1, bm: 0 };
}

function stroke(color: number[], width: number, opacity?: number) {
  return { ty: "st", nm: "Stroke", c: { a: 0, k: color }, o: { a: 0, k: opacity ?? 100 }, w: { a: 0, k: width }, lc: 2, lj: 2 };
}

function group(items: any[], nm?: string) {
  return { ty: "gr", nm: nm || "Group", it: [...items, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] };
}

function animValue(keyframes: Array<{ t: number; s: number[]; e?: number[] }>) {
  return { a: 1, k: keyframes.map((kf, i) => ({ t: kf.t, s: kf.s, e: kf.e, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } })) };
}

// ===== ANIMATION GENERATORS =====

export function createPulsingHeart(): object {
  const anim = makeBase("Pulsing Heart", 512, 512, 30, 0, 60);
  // Heart using two circles + rotated square
  anim.layers.push(shapeLayer("Heart", [
    group([
      ellipse({ a: 1, k: [
        { t: 0, s: [120, 120], e: [140, 140], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 15, s: [140, 140], e: [120, 120], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 30, s: [120, 120], e: [140, 140], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 45, s: [140, 140], e: [120, 120], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 60, s: [120, 120] }
      ] }),
      fill([0.92, 0.26, 0.35, 1]),
    ]),
  ], 0, 60, {}, 0));
  return anim;
}

export function createBouncingBall(): object {
  const anim = makeBase("Bouncing Ball", 512, 512, 30, 0, 60);
  anim.layers.push(shapeLayer("Ball", [
    group([
      ellipse(80),
      fill([0.4, 0.6, 1, 1]),
    ]),
  ], 0, 60, {
    p: { a: 1, k: [
      { t: 0, s: [256, 100, 0], e: [256, 420, 0], i: { x: [0.4], y: [0] }, o: { x: [0.6], y: [1] } },
      { t: 15, s: [256, 420, 0], e: [256, 100, 0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 30, s: [256, 100, 0], e: [256, 420, 0], i: { x: [0.4], y: [0] }, o: { x: [0.6], y: [1] } },
      { t: 45, s: [256, 420, 0], e: [256, 100, 0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 60, s: [256, 100, 0] },
    ]}
  }, 0));
  return anim;
}

export function createSpinningRing(): object {
  const anim = makeBase("Spinning Ring", 512, 512, 30, 0, 60);
  anim.layers.push(shapeLayer("Ring", [
    group([
      ellipse(200),
      stroke([0.55, 0.36, 0.96, 1], 12),
      { ty: "tm", nm: "Trim", s: { a: 0, k: 0 }, e: { a: 0, k: 75 }, o: { a: 1, k: [
        { t: 0, s: [0], e: [360], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 60, s: [360] },
      ] } },
    ]),
  ], 0, 60, {}, 0));
  return anim;
}

export function createConfettiBurst(): object {
  const anim = makeBase("Confetti Burst", 512, 512, 30, 0, 60);
  const colors = [[0.92, 0.26, 0.35, 1], [0.4, 0.85, 0.55, 1], [0.3, 0.6, 1, 1], [1, 0.8, 0.2, 1], [0.85, 0.4, 0.96, 1], [0, 0.85, 0.7, 1]];
  
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 180;
    const endX = Math.cos(angle) * dist;
    const endY = Math.sin(angle) * dist;
    const color = colors[i % colors.length];

    anim.layers.push(shapeLayer(`Particle ${i}`, [
      group([
        rect(16, 16, 3),
        fill(color),
      ]),
    ], 0, 60, {
      p: { a: 1, k: [
        { t: 0, s: [256, 256, 0], e: [256 + endX, 256 + endY, 0], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
        { t: 30, s: [256 + endX, 256 + endY, 0] },
      ] },
      o: { a: 1, k: [
        { t: 0, s: [100], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 30, s: [100], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 60, s: [0] },
      ] },
      r: { a: 1, k: [
        { t: 0, s: [0], e: [180 + i * 30], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 60, s: [180 + i * 30] },
      ] },
      s: { a: 1, k: [
        { t: 0, s: [0, 0, 100], e: [100, 100, 100], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
        { t: 10, s: [100, 100, 100], e: [60, 60, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 60, s: [60, 60, 100] },
      ] },
    }, i));
  }
  return anim;
}

export function createStarTwinkle(): object {
  const anim = makeBase("Star Twinkle", 512, 512, 30, 0, 90);
  const positions = [[128, 128], [384, 128], [256, 256], [128, 384], [384, 384], [200, 200], [350, 300]];
  const colors = [[1, 0.85, 0.2, 1], [1, 1, 0.6, 1], [0.9, 0.75, 0.3, 1]];
  
  positions.forEach((pos, i) => {
    const delay = i * 8;
    const size = 20 + (i % 3) * 15;
    anim.layers.push(shapeLayer(`Star ${i}`, [
      group([
        { ty: "sr", nm: "Star", d: 1, p: { a: 0, k: [0, 0] }, sy: 1, pt: { a: 0, k: 5 }, or: { a: 0, k: size }, ir: { a: 0, k: size * 0.4 }, os: { a: 0, k: 0 }, is: { a: 0, k: 0 }, r: { a: 0, k: 0 } },
        fill(colors[i % 3]),
      ]),
    ], 0, 90, {
      p: { a: 0, k: [pos[0], pos[1], 0] },
      o: { a: 1, k: [
        { t: delay, s: [30], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 15, s: [100], e: [30], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 30, s: [30], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 45, s: [100], e: [30], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 60, s: [30] },
      ] },
      s: { a: 1, k: [
        { t: delay, s: [80, 80, 100], e: [110, 110, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 15, s: [110, 110, 100], e: [80, 80, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 30, s: [80, 80, 100], e: [110, 110, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 45, s: [110, 110, 100], e: [80, 80, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 60, s: [80, 80, 100] },
      ] },
    }, i));
  });
  return anim;
}

export function createRotatingSquares(): object {
  const anim = makeBase("Rotating Squares", 512, 512, 30, 0, 60);
  const colors = [[0.55, 0.36, 0.96, 1], [0, 0.85, 0.7, 1], [0.92, 0.26, 0.35, 1]];
  const sizes = [180, 130, 80];
  
  sizes.forEach((size, i) => {
    anim.layers.push(shapeLayer(`Square ${i}`, [
      group([
        rect(size, size, 12),
        stroke(colors[i], 4),
        fill(colors[i].map((c, j) => j < 3 ? c : 0.1) as any),
      ]),
    ], 0, 60, {
      r: { a: 1, k: [
        { t: 0, s: [i * 15], e: [360 + i * 15], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: 60, s: [360 + i * 15] },
      ] },
    }, i));
  });
  return anim;
}

export function createCheckmark(): object {
  const anim = makeBase("Checkmark", 512, 512, 30, 0, 40);
  // Circle
  anim.layers.push(shapeLayer("Circle", [
    group([
      ellipse(220),
      fill([0.2, 0.8, 0.5, 1]),
    ]),
  ], 0, 40, {
    s: { a: 1, k: [
      { t: 0, s: [0, 0, 100], e: [100, 100, 100], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
      { t: 15, s: [100, 100, 100] },
    ] },
  }, 1));
  // Check path
  anim.layers.push(shapeLayer("Check", [
    group([
      { ty: "sh", nm: "Path", ks: { a: 0, k: { c: false, v: [[-50, 10], [-15, 50], [55, -40]], i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]] } } },
      stroke([1, 1, 1, 1], 16),
      { ty: "tm", nm: "Trim", s: { a: 0, k: 0 }, e: { a: 1, k: [
        { t: 12, s: [0], e: [100], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
        { t: 28, s: [100] },
      ] }, o: { a: 0, k: 0 } },
    ]),
  ], 0, 40, {}, 0));
  return anim;
}

export function createPulsingCircles(): object {
  const anim = makeBase("Pulsing Circles", 512, 512, 30, 0, 90);
  const colors = [[0.55, 0.36, 0.96, 0.3], [0, 0.85, 0.7, 0.3], [0.92, 0.26, 0.35, 0.3]];
  
  for (let i = 0; i < 3; i++) {
    const delay = i * 15;
    anim.layers.push(shapeLayer(`Circle ${i}`, [
      group([
        ellipse(60),
        fill(colors[i]),
        stroke(colors[i].map((c, j) => j < 3 ? c : 1) as any, 3),
      ]),
    ], 0, 90, {
      s: { a: 1, k: [
        { t: delay, s: [100, 100, 100], e: [400, 400, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 45, s: [400, 400, 100] },
      ] },
      o: { a: 1, k: [
        { t: delay, s: [80], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 45, s: [0] },
      ] },
    }, i));
  }
  return anim;
}

export function createWaveform(): object {
  const anim = makeBase("Waveform", 512, 512, 30, 0, 60);
  const barCount = 9;
  const barWidth = 24;
  const gap = 12;
  const totalW = barCount * barWidth + (barCount - 1) * gap;
  const startX = -totalW / 2 + barWidth / 2;
  
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + gap);
    const phase = i * 5;
    const maxH = 80 + Math.sin(i * 0.7) * 40;
    
    anim.layers.push(shapeLayer(`Bar ${i}`, [
      group([
        rect(barWidth, 40),
        fill([0.55, 0.36, 0.96, 1]),
      ]),
    ], 0, 60, {
      p: { a: 0, k: [256 + x, 256, 0] },
      s: { a: 1, k: [
        { t: phase, s: [100, 40, 100], e: [100, maxH * 2.5, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: phase + 15, s: [100, maxH * 2.5, 100], e: [100, 40, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: phase + 30, s: [100, 40, 100], e: [100, maxH * 2.5, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: phase + 45, s: [100, maxH * 2.5, 100], e: [100, 40, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: phase + 60, s: [100, 40, 100] },
      ] },
    }, i));
  }
  return anim;
}

export function createFloatingBubbles(): object {
  const anim = makeBase("Floating Bubbles", 512, 512, 30, 0, 90);
  const bubbles = [
    { x: 128, s: 40, d: 8 }, { x: 200, s: 25, d: 0 }, { x: 280, s: 55, d: 12 },
    { x: 350, s: 30, d: 5 }, { x: 420, s: 45, d: 18 }, { x: 80, s: 35, d: 22 },
  ];
  
  bubbles.forEach((b, i) => {
    anim.layers.push(shapeLayer(`Bubble ${i}`, [
      group([
        ellipse(b.s),
        fill([0.4, 0.7, 1, 0.25]),
        stroke([0.5, 0.8, 1, 0.6], 2),
      ]),
    ], 0, 90, {
      p: { a: 1, k: [
        { t: b.d, s: [b.x, 520, 0], e: [b.x + (i % 2 ? 30 : -30), -40, 0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: b.d + 70, s: [b.x + (i % 2 ? 30 : -30), -40, 0] },
      ] },
      o: { a: 1, k: [
        { t: b.d, s: [0], e: [80], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: b.d + 10, s: [80], e: [80], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: b.d + 55, s: [80], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: b.d + 70, s: [0] },
      ] },
    }, i));
  });
  return anim;
}

export function createThumbsUp(): object {
  const anim = makeBase("Thumbs Up", 512, 512, 30, 0, 45);
  // Simple arrow/thumb pointing up
  anim.layers.push(shapeLayer("Thumb", [
    group([
      { ty: "sh", nm: "Arrow", ks: { a: 0, k: { c: false, v: [[0, 60], [0, -20], [-40, 20]], i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]] } } },
      stroke([0.4, 0.85, 0.55, 1], 14),
    ]),
    group([
      { ty: "sh", nm: "Arrow2", ks: { a: 0, k: { c: false, v: [[0, -20], [40, 20]], i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]] } } },
      stroke([0.4, 0.85, 0.55, 1], 14),
    ]),
  ], 0, 45, {
    s: { a: 1, k: [
      { t: 0, s: [0, 0, 100], e: [110, 110, 100], i: { x: [0.2], y: [1.3] }, o: { x: [0.8], y: [0] } },
      { t: 18, s: [110, 110, 100], e: [100, 100, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 28, s: [100, 100, 100] },
    ] },
    p: { a: 1, k: [
      { t: 0, s: [256, 350, 0], e: [256, 256, 0], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
      { t: 18, s: [256, 256, 0] },
    ] },
  }, 0));
  return anim;
}

export function createLoadingDots(): object {
  const anim = makeBase("Loading Dots", 512, 512, 30, 0, 60);
  
  for (let i = 0; i < 3; i++) {
    const delay = i * 8;
    const x = 256 + (i - 1) * 60;
    anim.layers.push(shapeLayer(`Dot ${i}`, [
      group([
        ellipse(30),
        fill([0.55, 0.36, 0.96, 1]),
      ]),
    ], 0, 60, {
      p: { a: 0, k: [x, 256, 0] },
      s: { a: 1, k: [
        { t: delay, s: [100, 100, 100], e: [130, 130, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 10, s: [130, 130, 100], e: [100, 100, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 20, s: [100, 100, 100] },
      ] },
      o: { a: 1, k: [
        { t: delay, s: [50], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 10, s: [100], e: [50], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
        { t: delay + 20, s: [50] },
      ] },
    }, i));
  }
  return anim;
}

export function createSlideTransition(): object {
  const anim = makeBase("Slide Transition", 512, 512, 30, 0, 30);
  anim.layers.push(solidLayer("Wipe", "#8B5CF6", 512, 512, 0, 30, {
    p: { a: 1, k: [
      { t: 0, s: [-256, 256, 0], e: [256, 256, 0], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
      { t: 15, s: [256, 256, 0], e: [768, 256, 0], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
      { t: 30, s: [768, 256, 0] },
    ] },
  }, 0));
  return anim;
}

export function createCircleWipe(): object {
  const anim = makeBase("Circle Wipe", 512, 512, 30, 0, 30);
  anim.layers.push(shapeLayer("Circle", [
    group([
      ellipse(40),
      fill([0, 0.85, 0.7, 1]),
    ]),
  ], 0, 30, {
    s: { a: 1, k: [
      { t: 0, s: [0, 0, 100], e: [800, 800, 100], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
      { t: 20, s: [800, 800, 100] },
    ] },
    o: { a: 1, k: [
      { t: 0, s: [100], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 20, s: [100], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 30, s: [0] },
    ] },
  }, 0));
  return anim;
}

export function createTextReveal(): object {
  const anim = makeBase("Text Reveal Line", 512, 512, 30, 0, 40);
  // Horizontal line sweeping across
  anim.layers.push(shapeLayer("Line", [
    group([
      rect(4, 120),
      fill([1, 1, 1, 1]),
    ]),
  ], 0, 40, {
    p: { a: 1, k: [
      { t: 0, s: [50, 256, 0], e: [462, 256, 0], i: { x: [0.3], y: [1] }, o: { x: [0.7], y: [0] } },
      { t: 30, s: [462, 256, 0] },
    ] },
    o: { a: 1, k: [
      { t: 0, s: [100], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 25, s: [100], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
      { t: 35, s: [0] },
    ] },
  }, 0));
  // Underline that builds
  anim.layers.push(shapeLayer("Underline", [
    group([
      rect(300, 4),
      fill([0.55, 0.36, 0.96, 1]),
    ]),
  ], 0, 40, {
    s: { a: 1, k: [
      { t: 5, s: [0, 100, 100], e: [100, 100, 100], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
      { t: 25, s: [100, 100, 100] },
    ] },
    p: { a: 0, k: [256, 320, 0] },
  }, 1));
  return anim;
}

// Map all generators for building JSON files
export const allAnimationGenerators = {
  'pulsing-heart': createPulsingHeart,
  'bouncing-ball': createBouncingBall,
  'spinning-ring': createSpinningRing,
  'confetti-burst': createConfettiBurst,
  'star-twinkle': createStarTwinkle,
  'rotating-squares': createRotatingSquares,
  'checkmark': createCheckmark,
  'pulsing-circles': createPulsingCircles,
  'waveform': createWaveform,
  'floating-bubbles': createFloatingBubbles,
  'thumbs-up': createThumbsUp,
  'loading-dots': createLoadingDots,
  'slide-transition': createSlideTransition,
  'circle-wipe': createCircleWipe,
  'text-reveal': createTextReveal,
};
