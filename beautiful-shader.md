# beautiful-shader

When the user runs `/beautiful-shader` or asks for a shader animation, flowing gradient
background, "aurora"/mesh-gradient/generative-art effect, or anything described as
"beautiful," "organic," or "alive" rendered with WebGL/GLSL, follow this process. It is
self-contained — no external files or assets required — built from hands-on iteration
(see the "why" notes; they're the difference between a shader that looks like a demo and
one that looks intentional).

## Step 0 — Scope check

This skill covers **flowing gradient / domain-warped noise backgrounds** — the single
highest-value, cheapest-to-build "beautiful shader" family, and the one that fits almost
every use case someone actually asks for (hero backgrounds, cards, ambient art, loading
states). It does not cover fluid simulation, volumetric clouds, terrain, ocean, or GPGPU
particles — those need multi-pass render targets and are a different scale of project.
If the ask is genuinely one of those, say so and point to: Iñigo Quilez's site
(iquilezles.org), The Book of Shaders (thebookofshaders.com), Bridson/Hourihan/Nordenstam
*Curl-Noise for Procedural Fluid Flow* (SIGGRAPH 2007), and Jos Stam *Stable Fluids*
(SIGGRAPH 1999) / Mark Harris *GPU Gems* ch. 38 — rather than improvising a shallow
version of a technique that needs the full architecture to look right.

## Step 1 — Nail down the use case

Ask if it isn't already clear from context:
1. **Where does this live?** Small UI element (card, panel, icon) / full-bleed hero
   background / standalone art piece where the shader *is* the content / behind
   something the user needs to read.
2. **Mood?** Calm and minimal, or energetic and cinematic.
3. **Should it react to the cursor?** Default to **no** unless asked — an autonomous
   field is the safer default; interactivity is a deliberate addition, not a given.

Then use this table. It's the condensed result of building and iterating on the same
effect across several rounds of real feedback — most notably that grain and "smooth,
calm, minimal" are in tension with each other, and that's the single most common
judgment call to get right.

| Use case | Grain | Interactivity | Motion | Palette / density |
|---|---|---|---|---|
| Small decorative UI (card, panel, dashboard background) | **No.** Grain reads as noisy/busy at small scale — it adds density the composition doesn't have room for. | No — autonomous | Slow, smooth, long periods (30–50s+ cycles) | Dark background as the primary colour; colour as a sparse accent, not a wash |
| Full-bleed hero behind text | Invisible anti-banding dither only, skip *visible* grain unless deliberately going cinematic | Optional, subtle, smoothed — never raw pointer | Slow–moderate | Needs a brighter "bloom" pool anchored behind the text for contrast/legibility |
| Standalone generative art / gallery piece (the shader *is* the content) | Yes, visible grain welcome — it adds texture and depth when there's nothing else to look at | Often yes — makes it feel alive and responsive | Faster, more octaves/detail is fine here | Can be bold, saturated, dense |
| Explicit "film / analog / cinematic" brief | Yes — blue-noise, animated, moderate–strong | Usually no | Any | Any, often warm/desaturated |
| "Clean / modern / minimal" brief | No | No | Slow, smooth | Dark-primary with colour bleeding through a mask, not full coverage |
| Data-viz gradient that must not band | Tiny/invisible dither only (1/255) — this is a correctness fix, not a style choice | No | N/A | Whatever the data needs |
| Loading screen / brief attention-grabbing moment | Optional light grain | Sometimes, playful | Faster, punchier | Higher contrast/saturation is fine — it's on screen for seconds, not minutes |

**The rule of thumb:** grain is a *texture/energy* choice, "smooth" is a *calm/modern*
choice. They pull against each other. When someone says "smooth" or "minimal," don't add
grain unless they separately and explicitly ask for it — and if they do, expect to be
asked to remove or shrink it once they see it. Reach for the coarser-grain-size trick
(Step 6) before assuming more grain strength is the fix for "not textured enough."

## Step 2 — Translate the use case into parameters

| Parameter | Calm / minimal | Energetic / art piece |
|---|---|---|
| fBm octaves | 2 | 3–5 |
| Domain-warp multiplier (`q`/`r` scale in Step 3) | 1.0–1.4 | 2.0–4.0 (the guide's own default) |
| UV scale (bigger number = smaller, denser shapes) | 0.4–0.6 | 1.0–1.5 |
| Flow time multiplier | 0.5–0.8× real time | 1.0×+ |
| Hue-drift full cycle | ~40–60s | ~10–20s |

Tune from these ranges — don't just copy one column verbatim. If a first pass reads too
busy, the first lever to pull is octaves, then domain-warp multiplier, then UV scale, in
that order — that was the actual order of fixes that worked when this got iterated on.

## Step 3 — The core GLSL library

This is the trimmed, proven subset — hashes, noise, fBm with inter-octave rotation,
two-level domain warping, and iq's cosine palette. Drop it at the top of the fragment
shader.

```glsl
#version 300 es
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
out vec4 fragColor;

#define PI  3.141592653589793
#define TAU 6.283185307179586

// ---- hash (Dave Hoskins "hash without sine" — deterministic across GPUs) --
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// ---- value noise, quintic fade (continuous 2nd derivative -> no faceting) -
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

// ---- fBm: rotate the domain between octaves or you get a plaid/grid bias --
const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);
float fbm(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = ROT * p * 2.0;
    a *= 0.5;
  }
  return v;
}

// ---- domain warping (Iñigo Quilez): f(p + f(p + f(p))) ---------------------
// This is THE technique for organic form — regions stretch, fold and swirl
// the way turbulent transport folds dye, because fBm interpolates smoothly
// as its own input shifts. The four time offsets (WARP_T1..4 below) must be
// different and non-harmonic, or the whole field visibly SLIDES instead of
// churning in place — this is the #1 tell of a shader that reads as fake.
float warpedFbm(vec2 p, float t, float warpAmt, int octaves, out vec2 q, out vec2 r) {
  q = vec2(fbm(p + 0.15 * t, octaves),
           fbm(p + vec2(5.2, 1.3) + 0.13 * t, octaves));

  r = vec2(fbm(p + warpAmt * q + vec2(1.7, 9.2) + 0.11 * t, octaves),
           fbm(p + warpAmt * q + vec2(8.3, 2.8) + 0.09 * t, octaves));

  return fbm(p + warpAmt * r, octaves);
}

// ---- iq cosine palette: a=bias, b=amplitude, c=frequency, d=phase ---------
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

// ---- output chain: always tonemap, or bright areas clip to flat white -----
vec3 acesFilmic(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}
```

## Step 4 — Colour composition (pick one)

**Colour by the warp fields (`q`/`r`), never by raw `uv`.** That's what makes it read as
an intentional gradient instead of a sprayed rainbow. Animate hue by adding time to the
palette's phase `d`, not by shifting the input `t` — shifting `t` slides the whole
palette sideways ("sliding wallpaper"); shifting `d` cycles hue in place.

**Mode A — full coverage** (energetic / art piece): colour fills the frame.
```glsl
vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
vec2 q, r;
float f = warpedFbm(uv * 1.2, uTime, 2.5, 4, q, r);
vec3 col = palette(f + 0.2 * length(q),
                    vec3(0.5, 0.45, 0.55), vec3(0.45, 0.4, 0.5),
                    vec3(1.0), vec3(0.0, 0.15, 0.35) + uTime * 0.03);
```

**Mode B — dark-primary with colour as accent** (calm / minimal / most UI use): this is
what actually shipped after iterating past a "too dense" first pass. Black (or the page's
own background colour) is the base; colour only bleeds in through a mask where the flow
is brightest — like ink or light moving through dark water, not a wall-to-wall wash.
```glsl
vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
vec2 q, r;
float f = warpedFbm(uv * 0.5, uTime * 0.7, 1.2, 2, q, r);

vec3 colorGlow = palette(f + 0.15 * length(q),
                    vec3(0.15, 0.13, 0.19), vec3(0.17, 0.15, 0.19),
                    vec3(0.55), vec3(0.55, 0.45, 0.68) + uTime * 0.02);

float mask = smoothstep(0.12, 0.85, f + 0.15 * length(q));
mask = pow(mask, 1.7); // biases further toward the base colour
vec3 col = mix(vec3(0.0), colorGlow, mask);
```

Then, either mode:
```glsl
// vignette — clamp it, don't just multiply. On a wide/short canvas |uv| gets
// large at the corners and an unclamped vignette drives them to solid black
// (a real bug hit in production: looked like a permanently "stuck" dark
// corner and made the whole piece read as static/broken).
col *= clamp(1.0 - 0.3 * dot(uv, uv), 0.35, 1.0);

col = acesFilmic(col);
col = linearToSrgb(col);
fragColor = vec4(col, 1.0);
```

## Step 5 — JS scaffold (framework-free, drop-in)

No libraries, no render targets, no vertex buffer — an attribute-less fullscreen
triangle via `gl_VertexID`. Vertex shader:
```glsl
#version 300 es
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2) * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
}
```

JS driver — framerate-independent, DPR-capped, resize-aware, respects reduced motion:
```js
const canvas = document.getElementById('gl');
const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });

function compile(type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh));
  return sh;
}
const program = gl.createProgram();
gl.attachShader(program, compile(gl.VERTEX_SHADER, vertSrc));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragSrc));
gl.linkProgram(program);
gl.useProgram(program);

const uResolution = gl.getUniformLocation(program, 'uResolution');
const uTime = gl.getUniformLocation(program, 'uTime');

const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR — 3x on a phone is wasted work
function resize() {
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
}
new ResizeObserver(resize).observe(canvas);
resize();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let simTime = 0, last = performance.now();

function frame(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30); // clamp: a tab-refocus stall can't blow up the sim
  last = now;
  if (!reduceMotion) simTime = (simTime + dt) % 3600; // bounded — float precision degrades over long sessions

  gl.uniform2f(uResolution, canvas.width, canvas.height);
  gl.uniform1f(uTime, simTime);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  if (!reduceMotion) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```
If `prefers-reduced-motion` is set, this renders exactly one static frame and stops —
don't skip that check.

## Step 6 — Grain (only if Step 1's table says yes)

There are two different things people mean by "grain," and mixing them up is the most
common mistake:

**Anti-banding dither** — near-invisible, almost always safe to include, kills 8-bit
banding in smooth gradients. No texture asset needed:
```glsl
float ditherNoise(vec2 fragCoord, float t) {
  vec2 p = fragCoord + t * 13.7;
  return hash21(p) - hash21(p + 17.31); // triangular PDF, [-1,1]
}
// apply AFTER sRGB encode, right before output:
col += ditherNoise(gl_FragCoord.xy, uTime) / 255.0;
```

**Visible stylistic film grain** — only add this when the use case explicitly calls for
it (art piece, cinematic brief). Real blue noise reads as *clean* grain; plain/triangular
noise pushed loud enough to be visible reads as *muddy* — the difference is in the
spectrum, not just the strength. If no blue-noise texture asset is available, generate
one procedurally at load (Mitchell's best-candidate point placement, ranked into a
tileable grayscale texture — this was built and statistically validated in-session:
uniform histogram, meaningfully less low-frequency energy than white noise):
```js
function makeBlueNoiseTexture(N, candidatesPerPoint, seed) {
  let s = seed >>> 0;
  const rand = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  const total = N * N;
  const rank = new Float64Array(total).fill(-1);
  const px = new Int32Array(total), py = new Int32Array(total);
  let placed = 0;
  const tor2 = (ax, ay, bx, by) => {
    let dx = Math.abs(ax - bx); if (dx > N - dx) dx = N - dx;
    let dy = Math.abs(ay - by); if (dy > N - dy) dy = N - dy;
    return dx * dx + dy * dy;
  };
  for (let i = 0; i < total; i++) {
    let bestIdx = -1, bestScore = -1;
    for (let c = 0; c < candidatesPerPoint; c++) {
      const cx = Math.floor(rand() * N), cy = Math.floor(rand() * N), idx = cy * N + cx;
      if (rank[idx] !== -1) continue;
      let minD2 = Infinity;
      for (let p = 0; p < placed; p++) minD2 = Math.min(minD2, tor2(cx, cy, px[p], py[p]));
      const score = placed === 0 ? rand() : minD2;
      if (score > bestScore) { bestScore = score; bestIdx = idx; }
    }
    if (bestIdx === -1) bestIdx = rank.indexOf(-1);
    rank[bestIdx] = i; px[placed] = bestIdx % N; py[placed] = Math.floor(bestIdx / N); placed++;
  }
  const bytes = new Uint8Array(total);
  for (let i = 0; i < total; i++) bytes[i] = Math.round((rank[i] / (total - 1)) * 255);
  return bytes;
}
// upload as R8 / NEAREST filtering (filtering would smear the exact per-texel
// values this depends on) / REPEAT (must tile). N=48, candidatesPerPoint=24
// is a good default — under 100ms one-time cost, negligible tiling artifacts.
```
Sample it, animated per-frame with the golden-ratio offset so the same cycle never
repeats in a way the eye locks onto:
```glsl
uniform sampler2D uBlueNoise;
uniform vec2 uBlueNoiseSize;
uniform int uFrame;
const float GRAIN_SIZE = 2.0; // physical pixels per grain cell — 1:1 reads as
                               // fine, DENSE speckle; even 2.0 visibly lowers
                               // perceived density without going chunky. This
                               // was the actual fix requested after grain
                               // first shipped too dense.
float blueNoiseGrain(vec2 fragCoord) {
  vec2 coarse = floor(fragCoord / GRAIN_SIZE);
  float bn = texture(uBlueNoise, coarse / uBlueNoiseSize).r;
  return fract(bn + float(uFrame % 64) * 0.61803398875);
}
// apply after tonemap+encode, stronger in shadows like real film:
float grain = (blueNoiseGrain(gl_FragCoord.xy) - 0.5) * 0.15; // start here, tune to taste
col += grain * mix(1.0, 0.45, mask); // `mask` from Step 4 Mode B, if used
```
**If the result reads too dense, raise `GRAIN_SIZE` before raising strength.** That's the
actual order that worked when this was iterated on live — density and intensity are
different knobs and people usually mean density.

## Step 7 — Interactivity (only if asked)

Default is **no interaction** — an ambient background that moves under a cursor by
default was explicitly flagged as unwanted mid-project. If asked for it, smooth the
pointer with an exponential half-life (never feed raw coordinates into the shader — it
reads as digital/jittery) and feed it into the *domain*, not the output colour, so it
warps the flow rather than just tinting it:
```js
const mouseTarget = { x: 0, y: 0 }, mouseSmooth = { x: 0, y: 0 };
const MOUSE_HALF_LIFE = 0.25; // seconds; 0.06-0.12 = snappy/UI, 0.4-1.0 = floaty/ambient
canvas.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect();
  mouseTarget.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouseTarget.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
});
// per frame:
const decay = Math.pow(2, -dt / MOUSE_HALF_LIFE);
mouseSmooth.x = mouseTarget.x + (mouseSmooth.x - mouseTarget.x) * decay;
mouseSmooth.y = mouseTarget.y + (mouseSmooth.y - mouseTarget.y) * decay;
// then: warpedFbm(uv * scale + mouseSmooth * 0.25, ...)
```

## Step 8 — Ship checklist

Run this before calling it done:
- [ ] Motion uses real, clamped `dt` — never a bare `mix(x, target, 0.1)` per frame
      (framerate-dependent; different personality at 30fps vs 144fps)
- [ ] Every repeated element (if more than one noise layer/band) has its own phase/speed
      — uniform timing is the #1 "CG" tell
- [ ] fBm octaves rotate the domain (the `ROT` matrix) — otherwise visible plaid bias
- [ ] Noise is animated by feeding time into the field (domain warp `t`), never by just
      translating `uv += time` — that reads as sliding wallpaper
- [ ] Colour comes from the warp fields, not raw `uv`
- [ ] Output goes through ACES (or similar) tonemap before sRGB encode — otherwise
      bright areas clip to flat white
- [ ] Vignette (if any) is clamped, not a bare multiply — check it on a wide/short
      aspect ratio, not just square
- [ ] `uTime` is bounded (`% 3600`) and `dt` is clamped (`Math.min(dt, 1/30)`)
- [ ] `prefers-reduced-motion` renders one static frame and stops
- [ ] DPR is capped at 2
- [ ] No interactivity unless it was asked for
- [ ] If grain was added: confirm it matches Step 1's table for this use case, and that
      it's not fighting a "smooth/calm/minimal" brief

## Step 9 — Verify without a browser, if one isn't available

GLSL can't be syntax-checked outside a real GPU context, but the JS half can:
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('PATH_TO_FILE', 'utf8');
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
  try { new Function(m[1]); console.log('script', i, 'OK'); }
  catch (e) { console.log('script', i, 'SYNTAX ERROR:', e.message); }
});
"
```
If a blue-noise generator was added, also verify its statistical properties (uniform
histogram, no clumping) rather than trusting it by inspection — this caught nothing wrong
in practice, but it's cheap insurance for a nontrivial algorithm written blind:
```bash
node -e "
// paste makeBlueNoiseTexture here, then:
const bytes = makeBlueNoiseTexture(48, 24, 12345);
console.log('unique values:', new Set(bytes).size, '/ 256');
console.log('min/max:', Math.min(...bytes), Math.max(...bytes));
"
```
Report to the user honestly if you could not visually confirm the result in an actual
browser — GLSL compile errors and composition/balance issues only show up there.
