---
name: beautiful-shader
description: Create beautiful WebGL2/GLSL flowing gradient shaders, aurora or mesh-gradient backgrounds, generative-art fields, shader hero sections, UI shader accents, interaction modes, grain controls, and reusable gradient recipes. Use when the user asks for shader animation, organic/beautiful/alive gradient backgrounds, WebGL canvas gradients, or help applying the Beautiful Shader Atlas presets in any coding or LLM harness.
---

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

**Scale rule:** unless the user explicitly asks for standalone generative art, the
shader should support the page instead of taking over the whole visual scale. For hero
sections, make the shader rich enough to feel alive, then reserve a darker or lighter
reading zone for text with composition and overlay. For cards, panels, docs, dashboards,
or galleries, keep the shader inside a bounded surface with a stable aspect ratio. Do
not turn every section into a full-screen animated canvas just because the shader can.

## Step 1 — Nail down the use case

Ask if it isn't already clear from context. Present these as short multiple-choice
questions rather than one open "what do you want" — people answer faster from options,
and it front-loads exactly the decisions that separate "worked" from "actually good."

1. **Where does this live?** Small UI element (card, panel, icon) / full-bleed hero
   background / standalone art piece where the shader *is* the content / behind
   something the user needs to read.
2. **Base mode — dark or light?**
   - **Dark** — the default for most UI; colour pops against it with the least effort
     (Step 4 Mode B).
   - **Light** — bright/airy brief, or matching a light-mode page; needs the inverted
     contrast handling in Step 4 Mode C, not just a palette swap.
   - **Transparent / overlay** — the shader doesn't own the background; something else
     (a page, a photo) sits behind it.
3. **Density / zoom — how tight or sweeping should the pattern read?**
   - **Tight & detailed** — small shapes, busy, more texture per screen.
   - **Balanced** — medium shapes; the right default for most briefs.
   - **Wide & sweeping** — large, slow-reading shapes, mostly negative space.
   (Numbers in Step 2.)
4. **Mood / energy?** Calm and minimal, or energetic and cinematic. Independent axis
   from density — a "wide & sweeping, energetic" piece and a "tight & detailed, calm"
   piece are both coherent, just different.
5. **Grain — how much, if any?** None (just invisible anti-banding dither) / Subtle /
   Moderate / Heavy-cinematic. (Numbers in Step 6.) Default to **none** unless the brief
   calls for texture — see the rule of thumb below.
6. **Palette — a named preset, or custom colours?** Offer the presets in Step 4 by name
   (a one-line description of each is enough to choose from); if the user gives their
   own colours instead (hex codes or descriptions like "teal and coral"), use the
   custom-colour path in Step 4 rather than forcing them into a preset.
7. **Mouse interaction — pick one.** Default to **none** unless asked.
   - **None** — autonomous, the safest default.
   - **Follow** — the field drifts gently toward the cursor; ambient and floaty.
   - **Repel** — the field bends *away* from the cursor, like current pushed aside.
   - **Ripple on click** — a water-drop wave expands from each click and decays.
   - **Hover turbulence** — the field gets locally busier/brighter right under the
     cursor, without displacing it.
   (Full implementations for all four in Step 7. Hover turbulence can be layered on top
   of any of the other three since it doesn't touch position; Follow and Repel are
   mutually exclusive — opposite-signed domain shifts fighting each other reads as
   jittery, not intentional.)

Then use this table. It's the condensed result of building and iterating on the same
effect across several rounds of real feedback — most notably that grain and "smooth,
calm, minimal" are in tension with each other, and that's the single most common
judgment call to get right.

| Use case | Grain | Interactivity | Motion | Palette / density |
|---|---|---|---|---|
| Small decorative UI (card, panel, dashboard background) | **No.** Grain reads as noisy/busy at small scale — it adds density the composition doesn't have room for. | No — autonomous | Slow, smooth, long periods (30–50s+ cycles) | Dark background as the primary colour; colour as a sparse accent, not a wash |
| Full-bleed hero behind text | Invisible anti-banding dither only, skip *visible* grain unless deliberately going cinematic | Optional, subtle, smoothed — never raw pointer | Slow–moderate | Needs a brighter "bloom" pool anchored behind the text for contrast/legibility |
| Readable hero preset showcase | No visible grain unless requested | No by default | Slow–moderate | Show dark and light modes in large bounded previews; do not rely on tiny thumbnails to prove readability |
| Multi-shader gallery / atlas | Usually no visible grain on UI presets | Only on selected examples | Pause or lazy-mount offscreen canvases | Never mount every WebGL canvas at once; browsers can evict early contexts and make top examples appear broken |
| Standalone generative art / gallery piece (the shader *is* the content) | Yes, visible grain welcome — it adds texture and depth when there's nothing else to look at | Often yes — makes it feel alive and responsive | Faster, more octaves/detail is fine here | Can be bold, saturated, dense |
| Organic / painterly botanical field | Yes — canvas weave plus dry-brush breakup, but keep motion slow | Usually no | Slow, breathing, non-sliding pigment drift | Botanical palette, `painterly-bloom` flow, layered bloom and petal-like masks |
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

**Density / zoom preset (Step 1, question 3)** is a second, independent axis on top of
the mood table above — it mainly moves UV scale and octaves, mood mainly moves warp
multiplier and time. Multiply the two together rather than picking one or the other:

| Density preset | UV scale | fBm octaves (add on top of mood's value, don't replace) |
|---|---|---|
| Tight & detailed | 1.2–1.6 | +1 |
| Balanced | 0.7–1.0 | +0 |
| Wide & sweeping | 0.35–0.5 | −1 (floor of 2) |

For example "energetic + tight & detailed" lands around UV scale 1.4, 5 octaves, warp
multiplier 3.5 — denser *and* more turbulent. "Calm + wide & sweeping" lands around UV
scale 0.4, 2 octaves, warp multiplier 1.0 — the emptiest, slowest reading of the grid.

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

## Step 4 — Colour composition (pick one base mode, then one palette)

**Colour by the warp fields (`q`/`r`), never by raw `uv`.** That's what makes it read as
an intentional gradient instead of a sprayed rainbow. Animate hue by adding time to the
palette's phase `d`, not by shifting the input `t` — shifting `t` slides the whole
palette sideways ("sliding wallpaper"); shifting `d` cycles hue in place.

### 4a — Base mode (from Step 1, question 2)

**Mode A — full coverage** (energetic / art piece, dark or light background either way):
colour fills the frame.
```glsl
vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
vec2 q, r;
float f = warpedFbm(uv * 1.2, uTime, 2.5, 4, q, r);
vec3 col = palette(f + 0.2 * length(q),
                    vec3(0.5, 0.45, 0.55), vec3(0.45, 0.4, 0.5),
                    vec3(1.0), vec3(0.0, 0.15, 0.35) + uTime * 0.03);
```

**Mode B — dark-primary with colour as accent** (calm / minimal / most UI use, dark base
picked in Step 1): this is what actually shipped after iterating past a "too dense" first
pass. Black (or the page's own background colour) is the base; colour only bleeds in
through a mask where the flow is brightest — like ink or light moving through dark water,
not a wall-to-wall wash.
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

**Mode C — light-primary with colour as accent** (calm / minimal, light base picked in
Step 1): the same ink-in-water idea as Mode B, inverted. Near-white is the base, and the
same mask now blends *toward* white as the flow gets brighter — this is not just Mode B
with the colours swapped, the mix direction has to flip too, or dark colour floods the
whole frame instead of bleeding through sparingly.
```glsl
vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
vec2 q, r;
float f = warpedFbm(uv * 0.5, uTime * 0.7, 1.2, 2, q, r);

vec3 colorInk = palette(f + 0.15 * length(q),
                    vec3(0.45, 0.4, 0.5), vec3(0.3, 0.28, 0.32),
                    vec3(0.55), vec3(0.55, 0.45, 0.68) + uTime * 0.02);

float mask = smoothstep(0.12, 0.85, f + 0.15 * length(q));
mask = pow(mask, 1.7);
vec3 col = mix(vec3(0.96, 0.955, 0.965), colorInk, mask); // near-white, not pure #fff —
                                                            // pure white clips the ACES
                                                            // tonemap's highlight rolloff
```
The vignette below also needs to darken *toward the base colour*, not toward black, in
Mode C — see the note inline.

### 4b — Palette (from Step 1, question 6)

Six named presets, each as the `(a, b, c, d)` inputs to the `palette()` function from
Step 3 — drop straight into whichever mode above. `d`'s `uTime` term is the hue-drift
speed from Step 2; keep it or drop it per the calm/energetic call.

| Name | a (bias) | b (amplitude) | c (frequency) | d (phase) | Reads as |
|---|---|---|---|---|---|
| Aurora / Violet–Teal (default) | `0.5, 0.45, 0.55` | `0.45, 0.4, 0.5` | `1.0, 1.0, 1.0` | `0.0, 0.15, 0.35` | Cool, ethereal, the guide's own default |
| Sunset / Warm Coral–Gold | `0.6, 0.45, 0.4` | `0.4, 0.35, 0.3` | `1.0, 1.0, 0.7` | `0.0, 0.1, 0.2` | Warm, inviting, less "tech" |
| Ocean / Cool Blue–Teal | `0.35, 0.45, 0.55` | `0.25, 0.3, 0.3` | `1.0, 0.9, 0.8` | `0.5, 0.6, 0.7` | Calm, aquatic, low saturation swing |
| Neon / Magenta–Cyan | `0.55, 0.4, 0.6` | `0.5, 0.3, 0.55` | `1.4, 1.1, 1.6` | `0.1, 0.55, 0.75` | High-saturation, cyberpunk, best in Mode A |
| Monochrome / Single-hue Slate | `0.5, 0.5, 0.52` | `0.12, 0.12, 0.13` | `1.0, 1.0, 1.0` | `0.0, 0.0, 0.02` | Near-grayscale, brightness does the work, not hue |
| Botanical / Painterly Moss | custom stops preferred | custom stops preferred | custom stops preferred | `#0a6d55`, `#0e9a98`, `#f4b4aa`, `#f4e3bf` | Organic moss, teal pigment, cream light, and blush bloom |

**Custom colours** — when the user gives their own colours (hex codes or a description)
instead of a preset, don't try to reverse-engineer cosine-palette coefficients that hit
arbitrary RGB targets — that's solving an inverse problem for no real benefit. Use a
direct multi-stop mix instead, driven by the same field value `f` so it still animates
through the same warp-driven motion:
```glsl
vec3 customPalette(float t, vec3 c0, vec3 c1, vec3 c2) {
  t = fract(t);
  if (t < 0.5) return mix(c0, c1, smoothstep(0.0, 1.0, t * 2.0));
  return mix(c1, c2, smoothstep(0.0, 1.0, (t - 0.5) * 2.0));
}
// col = customPalette(f + 0.2 * length(q), userColor0, userColor1, userColor2);
```
Convert hex to linear `vec3` (not sRGB directly — feeding sRGB-encoded colour into a
linear-space mix darkens the midpoint of every blend) before passing in:
```js
const toLinear = (hex) => {
  const [r, g, b] = [hex.slice(1,3), hex.slice(3,5), hex.slice(5,7)].map(h => parseInt(h, 16) / 255);
  const lin = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return [lin(r), lin(g), lin(b)];
};
```
Two colours works fine too (drop `c2`, always take the `t < 0.5` branch mixing `c0`→`c1`
and let it loop); three gives a richer cycle without more complexity than the preset path.

### 4c — Output chain (every mode)
```glsl
// vignette — clamp it, don't just multiply. On a wide/short canvas |uv| gets
// large at the corners and an unclamped vignette drives them to solid black
// (a real bug hit in production: looked like a permanently "stuck" dark
// corner and made the whole piece read as static/broken).
// Mode C (light base): darken toward the base colour, not toward black —
// vignetting a light piece to black corners reads as a bug, not a design choice.
col *= clamp(1.0 - 0.3 * dot(uv, uv), 0.35, 1.0); // Mode A/B (dark-tending)
// col = mix(vec3(0.96, 0.955, 0.965), col, clamp(1.0 - 0.3 * dot(uv, uv), 0.35, 1.0)); // Mode C

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

### 5a — Multiple shader previews on one page

If the user asks for an atlas, preset gallery, documentation site, or any page with many
live shader examples, do **not** create a WebGL context for every card at load. Browsers
have low practical WebGL context limits; when too many canvases mount at once, the first
ones can be evicted and appear blank even though the shader code is valid.

Use one of these structures:

- **Best:** one shared renderer/canvas for the active or focused preset, with static
  preview images for the rest.
- **Good:** lazy-mount each canvas with `IntersectionObserver`, using a generous
  `rootMargin`, and release the context on cleanup.
- **Acceptable for tiny sets:** keep only the hero plus one or two large featured
  previews live; render the rest as static thumbnails or mount them on demand.

React-style lazy mounting pattern:
```js
const [isVisible, setIsVisible] = useState(false);
const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { rootMargin: '360px 0px' }
  );
  observer.observe(canvas);
  return () => observer.disconnect();
}, []);

useEffect(() => {
  if (!isVisible) return;
  const gl = canvasRef.current.getContext('webgl2', { antialias: false, alpha: false });
  // compile, link, resize, animate...
  return () => {
    cancelAnimationFrame(raf);
    gl.deleteProgram(program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}, [isVisible]);
```

For a showcase, give the first one or two reusable hero presets their own larger
two-up section. Small thumbnail cards are useful for browsing, but they do not prove
that a shader works behind real text.

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
const float GRAIN_STRENGTH = 0.15; // pick from the intensity-tier table below
// apply after tonemap+encode, stronger in shadows like real film:
float grain = (blueNoiseGrain(gl_FragCoord.xy) - 0.5) * GRAIN_STRENGTH;
col += grain * mix(1.0, 0.45, mask); // `mask` from Step 4 Mode B/C, if used
```
**If the result reads too dense, raise `GRAIN_SIZE` before raising strength.** That's the
actual order that worked when this was iterated on live — density and intensity are
different knobs and people usually mean density.

**`GRAIN_STRENGTH` presets** (Step 1, question 5) — pick the tier, don't eyeball a number:

| Preset | `GRAIN_STRENGTH` | Notes |
|---|---|---|
| None | *(skip this block entirely — dither only)* | Always safe, effectively free, use by default |
| Subtle | `0.05` | Barely visible; safe even alongside a "calm/minimal" brief if explicitly requested |
| Moderate | `0.12–0.15` | The level this skill originally shipped with; reads as intentional texture, not noise |
| Heavy / cinematic | `0.22–0.30` | Only for an explicit film/cinematic brief — confirm before using, it will read as dirty/broken on anything else |

Whichever tier, the "raise `GRAIN_SIZE` before strength" rule above still applies first if
density (not visibility) is the actual complaint.

## Step 7 — Interactivity (pick a mode from Step 1, question 7 — default none)

Default is **no interaction** — an ambient background that moves under a cursor by
default was explicitly flagged as unwanted mid-project. Every mode below shares one
piece of infrastructure: smooth the pointer with an exponential half-life before it
touches the shader. Never feed raw coordinates in — it reads as digital/jittery — and
feed it into the *domain*, not the output colour, so it warps the flow rather than just
tinting it.
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
// pass mouseSmooth to the shader as uMouse each frame
```

### 7a — Follow

The field drifts gently toward the cursor — ambient and floaty, the mode this skill
originally shipped with.
```glsl
vec2 domain = uv * scale + uMouse * 0.25;
float f = warpedFbm(domain, uTime, warpAmt, octaves, q, r);
```

### 7b — Repel

The field bends *away* from the cursor, like a current pushed aside, instead of chasing
it. The naive `1/d²` falloff explodes as `d → 0` right under the cursor — clamp the
*displacement magnitude*, not just the denominator, or the field snaps to a spike at the
exact pointer position:
```glsl
vec2 toCursor = uv - uMouse;
float d = length(toCursor);
float repelStrength = 0.35;
vec2 repelOffset = normalize(toCursor + 1e-4) * min(repelStrength / (d * d + 0.05), 1.2);
vec2 domain = uv * scale + repelOffset;
float f = warpedFbm(domain, uTime, warpAmt, octaves, q, r);
```
(The `+ 1e-4` inside `normalize` avoids a NaN from normalizing a zero vector on the one
frame the cursor sits exactly on a sample point — cheap insurance, not a real scenario
that comes up often.)

### 7c — Ripple on click (water-drop)

Each click spawns a radial wave that expands and decays — the one mode that isn't driven
by continuous pointer position, so it needs its own small event buffer instead of the
smoothing helper above. Cap concurrent ripples (6 is plenty) and let old ones evict the
oldest slot rather than growing unbounded:
```js
const MAX_RIPPLES = 6;
const ripples = Array.from({ length: MAX_RIPPLES }, () => ({ x: 0, y: 0, start: -1000 }));
let nextRipple = 0;
canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  const slot = ripples[nextRipple % MAX_RIPPLES];
  slot.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  slot.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  slot.start = simTime;
  nextRipple++;
});
// per frame, upload as flat arrays:
gl.uniform2fv(uRipplePos, ripples.flatMap(r => [r.x, r.y]));
gl.uniform1fv(uRippleStart, ripples.map(r => r.start));
```
```glsl
uniform vec2 uRipplePos[6];
uniform float uRippleStart[6];

float rippleField(vec2 p, float t) {
  float total = 0.0;
  for (int i = 0; i < 6; i++) {
    float age = t - uRippleStart[i];
    if (age < 0.0 || age > 3.0) continue; // inactive or fully decayed — skip, don't accumulate
    float d = length(p - uRipplePos[i]);
    float wave = sin(TAU * (d * 6.0 - age * 2.5)) * exp(-age * 1.8) * smoothstep(0.9, 0.0, d);
    total += wave;
  }
  return total;
}
// feed the ripple as extra domain warp, additive with Follow if both are wanted:
vec2 domain = uv * scale + uMouse * 0.25; // omit this term if not combining with Follow
float rip = rippleField(uv, uTime);
domain += rip * 0.15 * normalize(uv + 1e-4);
float f = warpedFbm(domain, uTime, warpAmt, octaves, q, r);
```
The `age > 3.0` early-out is what keeps this bounded — without it every past click stays
in the sum forever (harmless numerically since `exp(-age*1.8)` underflows to ~0 well
before age 3, but skipping it early is free and keeps the loop's intent obvious).

### 7d — Hover turbulence

The field gets locally busier and brighter right under the cursor without displacing it
— cheaper and calmer than Repel, and the only mode of the four that can stack with either
Follow or Repel, since it only scales the *warp amount* per-pixel rather than shifting
position:
```glsl
float proximity = smoothstep(0.6, 0.0, length(uv - uMouse)); // 1 right at the cursor, 0 far away
float localWarpAmt = mix(warpAmt, warpAmt * 2.2, proximity);
float f = warpedFbm(uv * scale, uTime, localWarpAmt, octaves, q, r);
// optional: also brighten slightly where proximity is high, same "colour from field, not
// position" rule still applies — brighten via the field value, not by adding uMouse
// directly into the palette lookup:
col *= 1.0 + proximity * 0.25;
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
- [ ] Scale matches the surface: hero, card, panel, atlas, or standalone art. The shader
      should not take over the whole page unless it is the content.
- [ ] If more than 3 live shader previews appear on one page, canvases are lazy-mounted
      or shared, and WebGL contexts are released on cleanup.
- [ ] If readable hero presets are being showcased, dark and light modes get large
      previews with text-safe composition, not only small cards.
- [ ] Interaction mode matches what was picked in Step 1 — no default Follow-drift when
      the user asked for Repel, Ripple, Hover, or None
- [ ] If Ripple on click was used: confirm the active-ripple loop has a bounded count and
      an age cutoff, not an ever-growing/unbounded accumulation
- [ ] Base mode (dark/light/transparent) matches what was picked — Mode C's vignette and
      mix direction actually flip toward the light base, not copy-pasted from Mode B
- [ ] Palette matches what was picked — a named preset's coefficients, or the user's own
      colours via the custom path — not a default substituted silently
- [ ] If grain was added: confirm it matches the intensity tier from Step 1/Step 6, and
      that it's not fighting a "smooth/calm/minimal" brief

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
