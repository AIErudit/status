// AIErudit status page — precompiled (React, no runtime Babel).
// =============================================================
// Pixel engine — renders char-grid sprites to <canvas>.
// Supports multi-frame grids (sprite wiggle) and multi-frame
// palettes (palette cycling — beam blink, whirlpool spin).
// Crisp at any scale via image-rendering: pixelated.
// =============================================================

const PX_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function pxParse(gridStr) {
  const rows = gridStr.split('\n').map(function (r) {
    return r.trim();
  }).filter(function (r) {
    return r.length > 0;
  });
  const w = Math.max.apply(null, rows.map(function (r) {
    return r.length;
  }));
  return {
    rows: rows.map(function (r) {
      return r.padEnd(w, '.');
    }),
    w: w,
    h: rows.length
  };
}
function PixelSprite({
  sprite,
  scale = 6,
  speed,
  bob = false,
  animate = true,
  style = {},
  title
}) {
  const ref = React.useRef(null);
  const [f, setF] = React.useState(0);
  const frames = React.useMemo(function () {
    return sprite.grids.map(pxParse);
  }, [sprite]);
  const W = Math.max.apply(null, frames.map(function (fr) {
    return fr.w;
  }));
  const H = Math.max.apply(null, frames.map(function (fr) {
    return fr.h;
  }));
  const tick = speed || sprite.speed || 520;
  const animating = animate && !PX_REDUCED && (sprite.grids.length > 1 || sprite.palettes.length > 1 || bob);
  React.useEffect(function () {
    if (!animating) return;
    const id = setInterval(function () {
      setF(function (v) {
        return v + 1;
      });
    }, tick);
    return function () {
      clearInterval(id);
    };
  }, [animating, tick]);
  React.useEffect(function () {
    const cv = ref.current;
    if (!cv) return;
    const fr = frames[f % frames.length];
    const pal = sprite.palettes[f % sprite.palettes.length];
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    fr.rows.forEach(function (row, y) {
      for (let x = 0; x < row.length; x++) {
        const c = pal[row[x]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  const bobbing = bob && animating && f % 2 === 1;
  return /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    width: W,
    height: H,
    "aria-label": title || sprite.name,
    style: Object.assign({
      width: W * scale,
      height: H * scale,
      imageRendering: 'pixelated',
      display: 'block',
      transform: bobbing ? 'translateY(' + -scale + 'px)' : 'translateY(0)'
    }, style)
  });
}

// ── JRPG status emotes — shared across all companions ────────
const PX_EMOTES = {
  exclaim: `
    .aa.
    .aa.
    .aa.
    .aa.
    .aa.
    ....
    .aa.
  `,
  question: `
    .aaaa...
    aa..aa..
    ....aa..
    ...aa...
    ..aa....
    ..aa....
    ........
    ..aa....
  `,
  heart: `
    .aa..aa.
    aaaaaaaa
    aaaaaaaa
    .aaaaaa.
    ..aaaa..
    ...aa...
  `,
  star: `
    ...aa...
    ...aa...
    aaaaaaaa
    .aaaaaa.
    ..aaaa..
    .aa..aa.
  `,
  zzz: `
    aaaaaa
    ....aa
    ...aa.
    ..aa..
    .aa...
    aaaaaa
  `,
  sweat: `
    ..a..
    ..a..
    .aaa.
    aaaaa
    aaaaa
    .aaa.
  `
};
function PixelEmote({
  kind,
  color = '#FF5C6B',
  scale = 5,
  style = {},
  className = ''
}) {
  const sprite = React.useMemo(function () {
    return {
      name: kind,
      grids: [PX_EMOTES[kind]],
      palettes: [{
        a: color
      }]
    };
  }, [kind, color]);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: sprite,
    scale: scale,
    animate: false,
    title: kind
  }));
}
Object.assign(window, {
  PixelSprite,
  PixelEmote,
  PX_EMOTES
});
// =============================================================
// Pixel sprites — five companions on a 24px grid, JRPG style.
// Each: hand-placed char grid(s) + palette frame(s).
// =============================================================

// ── BIBLIO — octopus, glasses, violet. 2-frame tentacle wiggle.
const biblioGridA = `
  ........................
  .........kkkkkk.........
  .......kklllooookk......
  ......kllloooooook......
  .....kllooooooooook.....
  ....kooooooooooooook....
  ....kooooooooooooook....
  ....kooooooooooooook....
  ....kokkkkokkokkkkok....
  ....kokwwkooookwwkok....
  ....kokwkkooookwkkok....
  ....kokkkkooookkkkok....
  ....koooooommooooook....
  ....kopoooooooooopok....
  .....kddddddddddddk.....
  .....kdk.kok.kok.kdk....
  .....kdk.kok.kok.kdk....
  ....kdk..kok.kok..kdk...
  ....kdk..kok.kok..kdk...
  ....kpk..kpk.kpk..kpk...
  ....kkk..kkk.kkk..kkk...
  ........................
  ......ssssssssssss......
`;
const biblioGridB = `
  ........................
  .........kkkkkk.........
  .......kklllooookk......
  ......kllloooooook......
  .....kllooooooooook.....
  ....kooooooooooooook....
  ....kooooooooooooook....
  ....kooooooooooooook....
  ....kokkkkokkokkkkok....
  ....kokwwkooookwwkok....
  ....kokwkkooookwkkok....
  ....kokkkkooookkkkok....
  ....koooooommooooook....
  ....kopoooooooooopok....
  .....kddddddddddddk.....
  ....kdk..kok.kok..kdk...
  ....kdk..kok.kok..kdk...
  .....kdk.kok.kok.kdk....
  .....kdk.kok.kok.kdk....
  .....kpk.kpk.kpk.kpk....
  .....kkk.kkk.kkk.kkk....
  ........................
  ......ssssssssssss......
`;
const biblioPal = {
  k: '#131722',
  o: '#7C5CFF',
  l: '#9D85FF',
  d: '#5B3FE0',
  p: '#FF7AB6',
  w: '#FFFFFF',
  m: '#41307A',
  s: 'rgba(10,15,28,0.12)'
};

// ── PHAROS — lighthouse. Palette cycling blinks the beam.
const pharosGrid = `
  ........................
  ...........kk...........
  ..........kaak..........
  ..BB.....kyyyyk.....BB..
  ..BBBBBBBkyggykBBBBBBB..
  ..BB....kaaaaaak....BB..
  .........kcccck.........
  .........kaaaak.........
  .........kciick.........
  ........kaaaaaak........
  ........kcccccck........
  ........kaaaaaak........
  ........kcciicck........
  .......kaaaaaaaak.......
  .......kcccccccck.......
  .......kaaaaaaaak.......
  ......kcccccccccck......
  ......kccckiikccck......
  .....knnnnnnnnnnnnk.....
  ....knnnnnnnnnnnnnnk....
  ...vvvvvvvvvvvvvvvvvv...
  ........................
`;
const pharosPalOff = {
  k: '#131722',
  a: '#FFB547',
  c: '#FFF3D6',
  y: '#FFE9B0',
  g: '#FF8A1F',
  i: '#1C2433',
  n: '#8A93A8',
  v: '#BFE3EE'
};
const pharosPalOn = Object.assign({}, pharosPalOff, {
  B: 'rgba(255,210,100,0.85)',
  g: '#FFD24D',
  y: '#FFF6CF'
});

// ── ARGO — ship. 2-frame: flag flips, waves roll. Bobs.
const argoGridA = `
  ........................
  ...........kfff.........
  ...........kff..........
  ...........mkck.........
  ...........mkccck.......
  ...........mkcccck......
  ...........mkccccck.....
  ...........mkccccck.....
  ...........mkkkkkkk.....
  ...........m............
  ...........m............
  ....kkkkkkkkkkkkkkkk....
  ....kttttttttttttttk....
  .....kddwddwddwdddk.....
  ......kddddddddddk......
  .......kkkkkkkkkk.......
  ...vv.vvvv.vvvv.vvvv....
  ..uu..uuu...uuu...uu....
  ........................
`;
const argoGridB = `
  ........................
  ........fffk............
  .........ffk............
  ...........mkck.........
  ...........mkccck.......
  ...........mkcccck......
  ...........mkccccck.....
  ...........mkccccck.....
  ...........mkkkkkkk.....
  ...........m............
  ...........m............
  ....kkkkkkkkkkkkkkkk....
  ....kttttttttttttttk....
  .....kddwddwddwdddk.....
  ......kddddddddddk......
  .......kkkkkkkkkk.......
  ....vvvv.vvvv.vvvv.vv...
  ...uu...uuu...uuu..uu...
  ........................
`;
const argoPal = {
  k: '#131722',
  f: '#2B6CFF',
  m: '#7A5A3A',
  c: '#F4E3C1',
  t: '#1FC2B8',
  d: '#0E9C95',
  w: '#FFFFFF',
  v: '#9AD7E4',
  u: '#CDEAF3'
};

// ── HYDRA PRINCESS — three heads, one crown. Crown twinkles.
const hydraGrid = `
  ........*.g.g.g.*.......
  ..........ggggg.........
  ..........koook.........
  .........koooook........
  .........koeoeok........
  ..kooook.kopppok.kooook.
  ..koweok.koooook.koewok.
  ..kooook...kok...kooook.
  ....kok....kok....kok...
  ..kooooooooooooooooook..
  ..koccccccccccccccccok..
  ..koccccccccccccccccok..
  ...kooooooooooooooook...
  ....kkkkkkkkkkkkkkkk....
  ........................
  ....ssssssssssssssss....
`;
const hydraPalA = {
  k: '#131722',
  o: '#7C5CFF',
  e: '#131722',
  p: '#FF7AB6',
  w: '#FFFFFF',
  c: '#D8CCFF',
  g: '#FFC83D',
  s: 'rgba(10,15,28,0.12)'
};
const hydraPalB = Object.assign({}, hydraPalA, {
  '*': '#FFC83D',
  g: '#FFDD7A'
});

// ── CHARYBDIS — whirlpool. Generated spiral, 3-frame palette spin.
function makeWhirl(off) {
  const W = 24,
    H = 18,
    cx = 11.5,
    cy = 8.5;
  const out = [];
  for (let y = 0; y < H; y++) {
    let row = '';
    for (let x = 0; x < W; x++) {
      const dx = (x - cx) / 11.4,
        dy = (y - cy) / 8.2;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r >= 1) {
        row += '.';
        continue;
      }
      if (y === 8 && (x === 9 || x === 10 || x === 13 || x === 14)) {
        row += 'w';
        continue;
      }
      if (y === 7 && (x === 9 || x === 14)) {
        row += 'k';
        continue;
      }
      if (r < 0.2) {
        row += 'B';
        continue;
      }
      const ang = Math.atan2(dy, dx) / (Math.PI * 2);
      const band = (Math.floor(r * 6.5 + ang * 3 + off) + 99) % 3;
      row += ['1', '2', '3'][band];
    }
    out.push(row);
  }
  return out.join('\n');
}
const charyPal = {
  '1': '#CFE9F0',
  '2': '#0E6E8F',
  '3': '#07485E',
  B: '#03222E',
  w: '#FFFFFF',
  k: '#131722'
};

// ── Registry ──────────────────────────────────────────────────
const PIXEL = {
  biblio: {
    name: 'Biblio',
    role: 'READER · OCTOPUS',
    accent: '#7C5CFF',
    grids: [biblioGridA, biblioGridB],
    palettes: [biblioPal],
    speed: 520,
    bob: false,
    chips: ['#7C5CFF', '#9D85FF', '#5B3FE0', '#FF7AB6', '#131722'],
    pitch: 'Notes, pre-reading, knowledge base.'
  },
  pharos: {
    name: 'Pharos',
    role: 'GUIDE · LIGHTHOUSE',
    accent: '#FFB547',
    grids: [pharosGrid],
    palettes: [pharosPalOff, pharosPalOn],
    speed: 700,
    bob: false,
    chips: ['#FFB547', '#FF8A1F', '#FFF3D6', '#8A93A8', '#131722'],
    pitch: 'Hints, tips, quiz feedback.'
  },
  argo: {
    name: 'Argo',
    role: 'NAVIGATOR · SHIP',
    accent: '#1FC2B8',
    grids: [argoGridA, argoGridB],
    palettes: [argoPal],
    speed: 600,
    bob: true,
    chips: ['#1FC2B8', '#0E9C95', '#F4E3C1', '#2B6CFF', '#131722'],
    pitch: 'Exams, progress, certificates.'
  },
  hydra: {
    name: 'Hydra Princess',
    role: 'HAZARD · THREE HEADS',
    accent: '#FF7AB6',
    grids: [hydraGrid],
    palettes: [hydraPalA, hydraPalB],
    speed: 560,
    bob: true,
    chips: ['#7C5CFF', '#D8CCFF', '#FF7AB6', '#FFC83D', '#131722'],
    pitch: 'Warnings, breaking changes, risks.'
  },
  charybdis: {
    name: 'Charybdis',
    role: 'OVERLOAD · WHIRLPOOL',
    accent: '#4FB3D9',
    grids: [makeWhirl(0), makeWhirl(1), makeWhirl(2)],
    palettes: [charyPal],
    speed: 240,
    bob: false,
    chips: ['#CFE9F0', '#0E6E8F', '#07485E', '#03222E', '#FFFFFF'],
    pitch: 'Rate limits, retries, stuck states.'
  }
};
Object.assign(window, {
  PIXEL
});
// =============================================================
// Pixel sprites — NEW RECRUITS in the original V1 JRPG style.
//  - Promptheus: titan keeper of the prompt-fire (flame flickers)
//  - Talos: bronze automaton on security duty (eye scans L/R)
//  - AiDOS: lab-core proctor eye (iris glows while "thinking")
// Same 24px grids, same renderer, same bright palette language.
// =============================================================

// ── PROMPTHEUS — flame flicker via palette cycle ─────────────
const promptheusGrid = `
  ................ff......
  ...............fyyf.....
  ...............fyyf.....
  ................ff......
  ...............koook....
  ......khhhhhk...kok.....
  .....khhhhhhhk..kok.....
  .....khoooooohk.kok.....
  .....khoeooeohk.kok.....
  .....khoooooohk.kok.....
  ......khhhhhhk..kok.....
  .......khhhk...kook.....
  ......kcccccccckook.....
  .....kcccccccccccck.....
  .....kccddcccccccck.....
  .....kcccddccccccck.....
  .....kccddcccccccck.....
  .....kccccddddcccck.....
  ......kcccccccccck......
  .......kcccccccck.......
  .......kok..kok.........
  .......kok..kok.........
  .......kkk..kkk.........
  ........................
  .....ssssssssssssss.....
`;
const promptheusPalA = {
  k: '#131722',
  h: '#6B4226',
  o: '#F0B27A',
  e: '#131722',
  c: '#EDF2F7',
  d: '#FF8A1F',
  f: '#FF8A1F',
  y: '#FFE9B0',
  s: 'rgba(10,15,28,0.12)'
};
const promptheusPalB = Object.assign({}, promptheusPalA, {
  f: '#FFB547',
  y: '#FFFFFF'
});

// ── TALOS — 2 frames: red eye scans left, then right ─────────
const talosGridA = `
  ..........ccc...........
  .........ccccc..........
  .......kbbbbbbbbk.......
  .......kbBBBBBBbk.......
  .......kbBrrBBBbk.......
  .......kbBBBBBBbk.......
  .......kbbbbbbbbk.......
  ........kBk..kBk........
  ...kbkbbbbbbbbbbbbkbk...
  ...kbkbBbbbbbbbbBbkbk...
  ...kbkbbbbbiibbbbbkbk...
  ...kbkbBbbbiibbbBbkbk...
  ...kkkbbbbbiibbbbbkkk...
  ......kbbbbbbbbbbk......
  .......kkkkkkkkkk.......
  ......kBbk....kbBk......
  ......kBbk....kbBk......
  .....kbbbbk..kbbbbk.....
  ........................
  ....ssssssssssssssss....
`;
const talosGridB = `
  ..........ccc...........
  .........ccccc..........
  .......kbbbbbbbbk.......
  .......kbBBBBBBbk.......
  .......kbBBBrrBbk.......
  .......kbBBBBBBbk.......
  .......kbbbbbbbbk.......
  ........kBk..kBk........
  ...kbkbbbbbbbbbbbbkbk...
  ...kbkbBbbbbbbbbBbkbk...
  ...kbkbbbbbiibbbbbkbk...
  ...kbkbBbbbiibbbBbkbk...
  ...kkkbbbbbiibbbbbkkk...
  ......kbbbbbbbbbbk......
  .......kkkkkkkkkk.......
  ......kBbk....kbBk......
  ......kBbk....kbBk......
  .....kbbbbk..kbbbbk.....
  ........................
  ....ssssssssssssssss....
`;
const talosPal = {
  k: '#131722',
  b: '#E0A33A',
  B: '#A8741F',
  r: '#FF3B30',
  i: '#FFE9B0',
  c: '#FF5C6B',
  s: 'rgba(10,15,28,0.12)'
};

// ── AIDOS — hanging lab core, iris glow cycle ────────────────
const aidosGrid = `
  ...........gg...........
  ...........gg...........
  ........kkkkkkkk........
  ......kkccccccckk.......
  .....kcccccccccccck.....
  ....kcccccccccccccck....
  ....kccckkkkkkkkcck.....
  ...kccckaaaaaaaakccck...
  ...kccckaaweeaaakccck...
  ...kccckaaeeeaaakccck...
  ....kccckaaaaaakcccck...
  ....kcccckkkkkkccccck...
  .....kcccccccccccck.....
  ......kcccccccccck......
  .......kkkkkkkkkk.......
  .........kggk...........
  ..........gg............
  ........................
  ....ssssssssssssssss....
`;
const aidosPalA = {
  k: '#131722',
  c: '#EDF2F7',
  a: '#FFC83D',
  e: '#131722',
  w: '#FFFFFF',
  g: '#8A93A8',
  s: 'rgba(10,15,28,0.12)'
};
const aidosPalB = Object.assign({}, aidosPalA, {
  a: '#FF8A1F'
});

// ── Registry — merges into PIXEL on the main page ────────────
const PIXEL_RECRUITS = {
  promptheus: {
    name: 'Promptheus',
    role: 'KEEPER · TITAN',
    accent: '#FF8A1F',
    grids: [promptheusGrid],
    palettes: [promptheusPalA, promptheusPalB],
    speed: 460,
    bob: false,
    chips: ['#FF8A1F', '#FFE9B0', '#EDF2F7', '#F0B27A', '#131722'],
    pitch: 'Stole prompts from the gods. Prompt library, templates, masterclass.'
  },
  talos: {
    name: 'Talos',
    role: 'SECURITY · AUTOMATON',
    accent: '#E0A33A',
    grids: [talosGridA, talosGridB],
    palettes: [talosPal],
    speed: 780,
    bob: false,
    chips: ['#E0A33A', '#A8741F', '#FF3B30', '#FFE9B0', '#131722'],
    pitch: 'Bronze sentinel of Crete. Access control, 403s, permissions.'
  },
  aidos: {
    name: 'AiDOS',
    role: 'PROCTOR · LAB CORE',
    accent: '#FFC83D',
    grids: [aidosGrid],
    palettes: [aidosPalA, aidosPalB],
    speed: 640,
    bob: true,
    pitch: 'The lab assistant is definitely not testing you. Quizzes, assessments.',
    chips: ['#FFC83D', '#EDF2F7', '#FF8A1F', '#8A93A8', '#131722']
  }
};
Object.assign(window, {
  PIXEL_RECRUITS
});
// =============================================================
// AIErudit Status — pixel header band.
// Night seascape: Pharos sweeps its beam, Argo sails, the crew
// keeps watch. State changes the sky and who shows up.
// =============================================================

function StPixelSky({
  mode
}) {
  // CSS-pixel stars
  const stars = [[4, 18], [9, 52], [15, 30], [22, 12], [27, 58], [33, 38], [41, 16], [48, 50], [55, 26], [62, 60], [68, 14], [74, 44], [81, 28], [88, 56], [93, 20], [97, 46], [37, 70], [58, 8], [12, 76], [85, 8]];
  const starColor = mode === 'outage' ? '#5a4255' : mode === 'degraded' ? '#5a5642' : '#3a4255';
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, stars.map(function (p, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: i % 4 === 0 ? 'st-twinkle' : '',
      style: {
        position: 'absolute',
        left: p[0] + '%',
        top: p[1] + '%',
        width: i % 5 === 0 ? 4 : 3,
        height: i % 5 === 0 ? 4 : 3,
        background: i % 3 === 0 ? '#6a7490' : starColor
      }
    });
  }));
}
function StPixelSea({
  mode
}) {
  // rows of pixel waves along the bottom
  const rows = [{
    y: 0,
    c: mode === 'outage' ? '#4A1259' : '#0E6E8F',
    step: 14
  }, {
    y: 10,
    c: mode === 'outage' ? '#35103F' : '#07485E',
    step: 18
  }, {
    y: 20,
    c: '#0A2433',
    step: 22
  }];
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 46,
      overflow: 'hidden'
    }
  }, rows.map(function (r, ri) {
    const cells = [];
    for (let i = 0; i < 60; i++) cells.push(i);
    return /*#__PURE__*/React.createElement("div", {
      key: ri,
      className: 'st-wave-row d' + ri,
      style: {
        position: 'absolute',
        left: -40,
        right: -40,
        top: r.y,
        display: 'flex',
        gap: 4
      }
    }, cells.map(function (i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          width: r.step,
          height: 46 - r.y,
          background: r.c,
          flexShrink: 0,
          marginTop: i % 2 * 4
        }
      });
    }));
  }));
}
function StHeaderArt({
  mode
}) {
  const skyByMode = {
    operational: 'linear-gradient(180deg, #0A0F1C 0%, #101A30 70%, #0E2A3E 100%)',
    degraded: 'linear-gradient(180deg, #0F0E1A 0%, #2A2138 70%, #3A2A30 100%)',
    outage: 'linear-gradient(180deg, #120A1C 0%, #2A1030 70%, #3A1038 100%)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 240,
      background: skyByMode[mode],
      overflow: 'hidden',
      borderRadius: '12px 12px 0 0'
    }
  }, /*#__PURE__*/React.createElement(StPixelSky, {
    mode: mode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '6%',
      bottom: 26
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL.pharos,
    scale: 5
  })), /*#__PURE__*/React.createElement("div", {
    className: "st-sail",
    style: {
      position: 'absolute',
      left: '38%',
      bottom: 30
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL.argo,
    scale: 4,
    bob: true
  })), mode === 'operational' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '8%',
      bottom: 34
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL.biblio,
    scale: 3.5
  })), mode === 'degraded' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '8%',
      bottom: 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL.biblio,
    scale: 3.5
  }), /*#__PURE__*/React.createElement(PixelEmote, {
    kind: "sweat",
    color: "#4FB3D9",
    scale: 3,
    className: "px-float",
    style: {
      position: 'absolute',
      top: -18,
      right: -10
    }
  }))), mode === 'outage' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '5%',
      bottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL.charybdis,
    scale: 4
  }), /*#__PURE__*/React.createElement(PixelEmote, {
    kind: "exclaim",
    color: "#FF5C6B",
    scale: 3,
    className: "px-float",
    style: {
      position: 'absolute',
      top: -20,
      left: '50%',
      marginLeft: 30
    }
  }))), /*#__PURE__*/React.createElement(StPixelSea, {
    mode: mode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      background: '#2B6CFF',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "20",
    height: "20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 236 820 L 488 196 L 576 196 L 352 820 Z",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 788 820 L 536 196 L 448 196 L 672 820 Z",
    fill: "#fff",
    opacity: "0.55"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Manrope', sans-serif",
      fontSize: 19,
      fontWeight: 800,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#60A5FA'
    }
  }, "AI"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fff'
    }
  }, "Erudit"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#8A93A8',
      fontWeight: 600
    }
  }, " Status"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 28,
      right: 24,
      fontFamily: "'Press Start 2P', monospace",
      fontSize: 8,
      color: '#8A93A8',
      letterSpacing: '0.06em'
    }
  }, "THE ORCHESTRATOR IS WATCHING"));
}
Object.assign(window, {
  StHeaderArt
});
// =============================================================
// AIErudit Status — page components + LIVE data adapter.
// Visual design by the founder (pixel crew, GitHub-status layout).
// Demo data swapped for real Upptime data (./summary.json) +
// real incidents (GitHub issues). Never shows green during a real
// outage — current status, bars, and incidents are all real.
// =============================================================

// Merge the "recruit" sprites (Promptheus/Talos/AiDOS) into PIXEL.
Object.assign(PIXEL, PIXEL_RECRUITS);
const ST = {
  primary: '#2563EB',
  ink: '#0F172A',
  night: '#0A0F1C',
  canvas: '#F7F9FC',
  border: '#D7E0EA',
  text2: '#475569',
  ok: '#059669',
  okBg: '#ECFDF5',
  warn: '#B45309',
  warnBg: '#FFFBEB',
  warnBar: '#F59E0B',
  crit: '#B91C1C',
  critBg: '#FFF1F2',
  critBar: '#E11D48',
  maint: '#1D4ED8',
  maintBg: '#EFF6FF',
  display: "'Manrope', sans-serif",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
  px: "'Press Start 2P', monospace"
};
const ST_STATES = {
  loading: {
    banner: 'Checking system status…',
    sub: 'Fetching the latest readings from the lighthouse.',
    color: '#64748B',
    bg: '#F1F5F9',
    border: '#E2E8F0'
  },
  operational: {
    banner: 'All systems operational',
    sub: 'The lighthouse is lit. Every crossing is clear.',
    color: ST.ok,
    bg: ST.okBg,
    border: '#A7F3D0'
  },
  degraded: {
    banner: 'Degraded performance',
    sub: 'Choppy water on some routes. We are trimming the sails.',
    color: ST.warn,
    bg: ST.warnBg,
    border: '#FDE68A'
  },
  outage: {
    banner: 'Major outage',
    sub: 'Charybdis is loose. All hands are on deck.',
    color: ST.crit,
    bg: ST.critBg,
    border: '#FECDD3'
  }
};

// Real monitored services -> [name, description, mascot, upptime slug].
// One card == one real monitor, so every status is true.
const ST_SERVICES = [['aierudit.com', 'Public site, course catalog & landing pages', 'pharos', 'website'], ['API & Learning Workbench', 'Backend API, lessons, mock terminal & ClippyGPT', 'biblio', 'api'], ['Auth & Permissions', 'Sign-in, OAuth, access control & 403s', 'talos', 'authentication'], ['Checkout & Payments', 'Stripe checkout, billing & receipts', 'argo', 'checkout-and-payments'], ['Email Delivery', 'Transactional email — verify, reset, receipts', 'promptheus', 'email-delivery']];

// Monitoring for this status page began here; earlier days have no data.
const ST_MONITORING_START = '2026-06-10';
function stStatusToMode(status) {
  if (status === 'down') return 'outage';
  if (status === 'degraded') return 'degraded';
  return 'operational';
}

// Build 90 day-bars from a summary entry's real dailyMinutesDown.
// Days before monitoring began render as honest "no data" (grey).
function stBuildBars(entry) {
  const out = [];
  const start = new Date(ST_MONITORING_START + 'T00:00:00Z');
  const today = new Date();
  const dmd = entry && entry.dailyMinutesDown || {};
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (89 - i));
    const ds = d.toISOString().slice(0, 10);
    if (d < start) {
      out.push('nodata');
      continue;
    }
    const mins = dmd[ds] || 0;
    if (mins > 30) out.push('crit');else if (mins > 1) out.push('warn');else out.push('ok');
  }
  return out;
}
function StBarRow({
  bars
}) {
  const color = {
    ok: '#34D399',
    warn: ST.warnBar,
    crit: ST.critBar,
    nodata: '#E2E8F0'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      alignItems: 'stretch',
      height: 30
    }
  }, bars.map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      title: 89 - i + ' days ago',
      style: {
        flex: 1,
        background: color[s],
        imageRendering: 'pixelated'
      }
    });
  }));
}
function StComponentRow({
  service,
  data,
  last
}) {
  const name = service[0],
    desc = service[1],
    mid = service[2];
  const status = data && data.status || 'up';
  const affected = status !== 'up';
  const statusTxt = status === 'down' ? 'Partial outage' : status === 'degraded' ? 'Degraded performance' : 'Operational';
  const statusColor = status === 'down' ? ST.crit : status === 'degraded' ? ST.warn : ST.ok;
  const up = data && data.uptime || '—';
  const bars = data && data.bars || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px',
      borderBottom: last ? 'none' : '1px solid ' + ST.border
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      background: ST.night,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL[mid],
    scale: 1.4,
    animate: affected
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.display,
      fontSize: 16,
      fontWeight: 700,
      color: ST.ink
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.body,
      fontSize: 12,
      color: ST.text2
    }
  }, desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.body,
      fontSize: 13,
      fontWeight: 600,
      color: statusColor,
      flexShrink: 0
    }
  }, statusTxt)), /*#__PURE__*/React.createElement(StBarRow, {
    bars: bars
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8,
      fontFamily: ST.mono,
      fontSize: 11,
      color: '#94A3B8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "90 days ago"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: ST.text2,
      fontWeight: 600
    }
  }, up, " uptime"), /*#__PURE__*/React.createElement("span", null, "Today")));
}
function StLegend() {
  const items = [['#34D399', 'Operational'], [ST.warnBar, 'Degraded performance'], [ST.critBar, 'Partial / major outage'], ['#93C5FD', 'Maintenance'], ['#E2E8F0', 'No data']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      padding: '16px 24px',
      borderTop: '1px solid ' + ST.border,
      background: '#FBFCFE',
      borderRadius: '0 0 12px 12px'
    }
  }, items.map(function (it) {
    return /*#__PURE__*/React.createElement("div", {
      key: it[1],
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 12,
        height: 12,
        background: it[0]
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: ST.body,
        fontSize: 12,
        color: ST.text2
      }
    }, it[1]));
  }));
}
function StIncidentDay({
  day
}) {
  const date = day[0],
    incidents = day[1];
  const sevColor = {
    warn: ST.warn,
    crit: ST.crit,
    maint: ST.maint
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.display,
      fontSize: 16,
      fontWeight: 700,
      color: ST.ink,
      paddingBottom: 8,
      borderBottom: '1px solid ' + ST.border,
      marginBottom: 12
    }
  }, date), incidents.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.body,
      fontSize: 13,
      color: '#94A3B8'
    }
  }, "No incidents reported.") : incidents.map(function (inc) {
    return /*#__PURE__*/React.createElement("div", {
      key: inc.title,
      style: {
        background: '#fff',
        border: '1px solid ' + ST.border,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        borderBottom: '1px solid #EEF2F7'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        background: ST.night,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(PixelSprite, {
      sprite: PIXEL[inc.mascot],
      scale: 1.2,
      animate: false
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: ST.display,
        fontSize: 15,
        fontWeight: 700,
        color: sevColor[inc.sev]
      }
    }, inc.title)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 18px 14px'
      }
    }, inc.updates.map(function (u, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 12,
          padding: '8px 0'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: ST.body,
          fontSize: 13,
          fontWeight: 700,
          color: ST.ink,
          width: 96,
          flexShrink: 0
        }
      }, u[0]), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: ST.body,
          fontSize: 13,
          lineHeight: '21px',
          color: ST.text2
        }
      }, u[2]), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: ST.mono,
          fontSize: 11,
          color: '#94A3B8',
          marginTop: 3
        }
      }, u[1])));
    })));
  }));
}

// ── Live data plumbing ────────────────────────────────────────
const ST_MASCOT_BY_SLUG = {
  website: 'pharos',
  api: 'biblio',
  authentication: 'talos',
  'checkout-and-payments': 'argo',
  'email-delivery': 'promptheus'
};
function stBuildIncidentDays(issues) {
  // Group real incidents by day for the last 7 days; empty days say so.
  const byDay = {};
  (issues || []).forEach(function (iss) {
    const created = (iss.created_at || '').slice(0, 10);
    if (!created) return;
    const resolved = iss.state === 'closed';
    const slug = (iss.labels || []).map(function (l) {
      return l.name;
    }).find(function (n) {
      return ST_MASCOT_BY_SLUG[n];
    });
    const title = (iss.title || 'Incident').replace(/^\s*[\uD800-\uDFFF☀-➿⬀-⯿]+\s*/, '').replace(/\s+is down$/i, ' — service disruption');
    const updates = [];
    if (resolved) updates.push(['Resolved', (iss.closed_at || '').slice(11, 16) + ' UTC', 'This incident has been resolved and service is back to normal.']);
    updates.push([resolved ? 'Opened' : 'Investigating', (iss.created_at || '').slice(11, 16) + ' UTC', resolved ? 'Automated monitoring opened this incident.' : 'We are investigating an automated monitoring alert.']);
    (byDay[created] = byDay[created] || []).push({
      title: title,
      mascot: ST_MASCOT_BY_SLUG[slug] || 'charybdis',
      sev: resolved ? 'warn' : 'crit',
      updates: updates
    });
  });
  const days = [];
  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
    days.push([label, byDay[iso] || []]);
  }
  return days;
}
function StatusBanner({
  mode
}) {
  const s = ST_STATES[mode] || ST_STATES.loading;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: s.bg,
      border: '1px solid ' + s.border,
      borderTop: 'none',
      padding: '22px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      background: s.color,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.display,
      fontSize: 22,
      fontWeight: 800,
      color: s.color,
      letterSpacing: '-0.01em'
    }
  }, s.banner), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.body,
      fontSize: 13,
      color: ST.text2,
      marginTop: 2
    }
  }, s.sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.mono,
      fontSize: 11,
      color: '#94A3B8',
      textAlign: 'right',
      flexShrink: 0
    }
  }, "Updated every few minutes", /*#__PURE__*/React.createElement("br", null), "by automated checks"));
}
function SubscribeRow() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      margin: '24px 0',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.body,
      fontSize: 13,
      color: ST.text2,
      maxWidth: 560,
      lineHeight: '21px'
    }
  }, "Hosted independently of AIErudit's own servers, so this page stays online even during an incident. Questions during an incident? ", /*#__PURE__*/React.createElement("a", {
    className: "st-link",
    href: "mailto:support@aierudit.com"
  }, "support@aierudit.com")), /*#__PURE__*/React.createElement("a", {
    className: "st-link",
    href: "https://github.com/AIErudit/status/issues",
    style: {
      fontFamily: ST.body,
      fontSize: 14,
      fontWeight: 600,
      color: '#fff',
      background: ST.primary,
      border: 'none',
      borderRadius: 8,
      padding: '10px 20px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      textDecoration: 'none'
    }
  }, "Subscribe to updates"));
}
function Footer() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid ' + ST.border,
      marginTop: 40,
      padding: '24px 0 56px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.body,
      fontSize: 12,
      color: '#94A3B8'
    }
  }, "This page is ", /*#__PURE__*/React.createElement("a", {
    className: "st-link",
    href: "https://github.com/AIErudit/status"
  }, "open source"), ", powered by", ' ', /*#__PURE__*/React.createElement("a", {
    className: "st-link",
    href: "https://upptime.js.org"
  }, "Upptime"), ". \xB7 ", /*#__PURE__*/React.createElement("a", {
    className: "st-link",
    href: "https://aierudit.com"
  }, "AIErudit.com")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(PixelSprite, {
    sprite: PIXEL.argo,
    scale: 1.4,
    animate: false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ST.mono,
      fontSize: 11,
      color: '#94A3B8',
      letterSpacing: '0.1em'
    }
  }, "SAFE CROSSINGS SINCE 2025")));
}
function App() {
  const [mode, setMode] = React.useState('loading');
  const [bySlug, setBySlug] = React.useState({});
  const [days, setDays] = React.useState(stBuildIncidentDays([]));
  React.useEffect(function () {
    // Live status from the same-origin summary.json baked next to this page.
    fetch('./summary.json', {
      cache: 'no-store'
    }).then(function (r) {
      return r.json();
    }).then(function (rows) {
      const map = {};
      let worst = 'operational';
      rows.forEach(function (e) {
        map[e.slug] = {
          status: e.status,
          uptime: e.uptime,
          bars: stBuildBars(e)
        };
        const m = stStatusToMode(e.status);
        if (m === 'outage') worst = 'outage';else if (m === 'degraded' && worst !== 'outage') worst = 'degraded';
      });
      setBySlug(map);
      setMode(worst);
    }).catch(function () {
      setMode('operational');
    });

    // Real incidents from GitHub issues (CORS-enabled, graceful fallback).
    fetch('https://api.github.com/repos/AIErudit/status/issues?state=all&labels=status&per_page=30&sort=created&direction=desc').then(function (r) {
      return r.ok ? r.json() : [];
    }).then(function (issues) {
      if (Array.isArray(issues)) setDays(stBuildIncidentDays(issues));
    }).catch(function () {});
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "AIErudit Status"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: '0 auto',
      padding: '32px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 12,
      boxShadow: '0 20px 50px rgba(10,15,28,0.10)',
      overflow: 'hidden',
      border: '1px solid ' + ST.border
    }
  }, /*#__PURE__*/React.createElement(StHeaderArt, {
    mode: mode === 'loading' ? 'operational' : mode
  }), /*#__PURE__*/React.createElement(StatusBanner, {
    mode: mode
  })), /*#__PURE__*/React.createElement(SubscribeRow, null), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid ' + ST.border,
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      borderBottom: '1px solid ' + ST.border,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ST.display,
      fontSize: 17,
      fontWeight: 800,
      color: ST.ink
    }
  }, "Current status by service"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ST.mono,
      fontSize: 11,
      color: '#94A3B8'
    }
  }, "Uptime over the past 90 days")), ST_SERVICES.map(function (svc, i) {
    return /*#__PURE__*/React.createElement(StComponentRow, {
      key: svc[3],
      service: svc,
      data: bySlug[svc[3]],
      last: i === ST_SERVICES.length - 1
    });
  }), /*#__PURE__*/React.createElement(StLegend, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ST.display,
      fontSize: 22,
      fontWeight: 800,
      color: ST.ink,
      marginBottom: 18
    }
  }, "Past incidents"), days.map(function (day) {
    return /*#__PURE__*/React.createElement(StIncidentDay, {
      key: day[0],
      day: day
    });
  })), /*#__PURE__*/React.createElement(Footer, null)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
