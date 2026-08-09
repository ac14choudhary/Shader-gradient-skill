"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BaseMode = "dark-accent" | "light-accent" | "full-coverage" | "overlay";
type Category =
  | "Hero"
  | "UI"
  | "Art"
  | "Interaction"
  | "Texture"
  | "Utility";
type Theme = "light" | "dark";

type ShaderExample = {
  id: string;
  title: string;
  category: Category;
  base: BaseMode;
  palette: number;
  density: string;
  mood: string;
  grain: string;
  interaction: number;
  scale: number;
  warp: number;
  speed: number;
  hue: number;
  octaves: number;
  grainStrength: number;
  summary: string;
  use: string;
};

const examples: ShaderExample[] = [
  {
    id: "BS-001",
    title: "Dark Calm Hero",
    category: "Hero",
    base: "dark-accent",
    palette: 0,
    density: "wide",
    mood: "calm",
    grain: "dither only",
    interaction: 0,
    scale: 0.62,
    warp: 1.48,
    speed: 0.62,
    hue: 0.018,
    octaves: 3,
    grainStrength: 0.012,
    summary: "Dark background as the primary color, with visible violet and teal motion kept below the text plane.",
    use: "Readable hero sections, editorial landing pages, calm product intros.",
  },
  {
    id: "BS-002",
    title: "Light Ink Wash",
    category: "Hero",
    base: "light-accent",
    palette: 1,
    density: "balanced",
    mood: "calm",
    grain: "none",
    interaction: 0,
    scale: 0.72,
    warp: 1.38,
    speed: 0.58,
    hue: 0.012,
    octaves: 3,
    grainStrength: 0,
    summary: "The light-mode mirror of the dark accent mode, mixing toward an off-white base.",
    use: "Bright SaaS pages, documentation intros, airy portfolio sections.",
  },
  {
    id: "BS-003",
    title: "Aurora Full Field",
    category: "Art",
    base: "full-coverage",
    palette: 0,
    density: "balanced",
    mood: "cinematic",
    grain: "subtle",
    interaction: 0,
    scale: 0.95,
    warp: 2.6,
    speed: 0.95,
    hue: 0.038,
    octaves: 4,
    grainStrength: 0.035,
    summary: "A full-frame color field where the shader itself is the object of attention.",
    use: "Ambient art panels, loading screens, generative playgrounds.",
  },
  {
    id: "BS-004",
    title: "Neon Mesh Burst",
    category: "Art",
    base: "full-coverage",
    palette: 3,
    density: "tight",
    mood: "energetic",
    grain: "subtle",
    interaction: 0,
    scale: 1.38,
    warp: 3.45,
    speed: 1.18,
    hue: 0.055,
    octaves: 5,
    grainStrength: 0.04,
    summary: "High saturation, dense domain warping, and fast hue drift for a punchy visual.",
    use: "Campaign moments, music/event pages, short-lived attention grabbers.",
  },
  {
    id: "BS-005",
    title: "Ocean Product Pool",
    category: "UI",
    base: "dark-accent",
    palette: 2,
    density: "balanced",
    mood: "calm",
    grain: "dither only",
    interaction: 0,
    scale: 0.7,
    warp: 1.35,
    speed: 0.65,
    hue: 0.015,
    octaves: 3,
    grainStrength: 0,
    summary: "Cool blue and teal accents with enough negative space for cards and labels.",
    use: "Dashboard headers, pricing callouts, app panels.",
  },
  {
    id: "BS-006",
    title: "Warm Coral Glow",
    category: "Hero",
    base: "dark-accent",
    palette: 1,
    density: "wide",
    mood: "warm",
    grain: "none",
    interaction: 0,
    scale: 0.5,
    warp: 1.25,
    speed: 0.62,
    hue: 0.017,
    octaves: 2,
    grainStrength: 0,
    summary: "The sunset palette in sparse mode so warmth reads as invitation instead of noise.",
    use: "Founder pages, product launches, softer brand surfaces.",
  },
  {
    id: "BS-007",
    title: "Slate Data Gradient",
    category: "Utility",
    base: "light-accent",
    palette: 4,
    density: "balanced",
    mood: "quiet",
    grain: "anti-banding",
    interaction: 0,
    scale: 0.78,
    warp: 1.05,
    speed: 0.4,
    hue: 0.004,
    octaves: 2,
    grainStrength: 0,
    summary: "Near-monochrome variation that keeps banding away without creating a decorative texture.",
    use: "Charts, data-viz backgrounds, restrained documentation graphics.",
  },
  {
    id: "BS-008",
    title: "Analog Film Flow",
    category: "Texture",
    base: "full-coverage",
    palette: 1,
    density: "balanced",
    mood: "cinematic",
    grain: "moderate",
    interaction: 0,
    scale: 0.88,
    warp: 2.2,
    speed: 0.82,
    hue: 0.026,
    octaves: 4,
    grainStrength: 0.12,
    summary: "Visible animated grain on a warm field for an intentional analog finish.",
    use: "Film, music, editorial, gallery, and expressive brand pages.",
  },
  {
    id: "BS-009",
    title: "Tiny Card Accent",
    category: "UI",
    base: "dark-accent",
    palette: 0,
    density: "tight",
    mood: "minimal",
    grain: "none",
    interaction: 0,
    scale: 1.22,
    warp: 1.0,
    speed: 0.48,
    hue: 0.012,
    octaves: 2,
    grainStrength: 0,
    summary: "Small shapes with low warp so a compact UI surface feels alive without getting noisy.",
    use: "Feature cards, empty states, badges, nav panels.",
  },
  {
    id: "BS-010",
    title: "Wide Negative Space",
    category: "Hero",
    base: "dark-accent",
    palette: 2,
    density: "extra-wide",
    mood: "minimal",
    grain: "none",
    interaction: 0,
    scale: 0.35,
    warp: 0.95,
    speed: 0.42,
    hue: 0.01,
    octaves: 2,
    grainStrength: 0,
    summary: "Very large slow forms, built to stay behind copy and interface chrome.",
    use: "Enterprise pages, long-read headers, top-of-product experiences.",
  },
  {
    id: "BS-011",
    title: "Follow Drift",
    category: "Interaction",
    base: "dark-accent",
    palette: 0,
    density: "balanced",
    mood: "ambient",
    grain: "none",
    interaction: 1,
    scale: 0.72,
    warp: 1.55,
    speed: 0.7,
    hue: 0.018,
    octaves: 3,
    grainStrength: 0,
    summary: "The field eases toward the pointer through smoothed domain offset, never raw cursor jumps.",
    use: "Playful hero moments and interactive demos where subtle response helps.",
  },
  {
    id: "BS-012",
    title: "Repel Current",
    category: "Interaction",
    base: "full-coverage",
    palette: 2,
    density: "balanced",
    mood: "responsive",
    grain: "dither only",
    interaction: 2,
    scale: 0.85,
    warp: 2.1,
    speed: 0.82,
    hue: 0.025,
    octaves: 4,
    grainStrength: 0,
    summary: "The domain bends away from the pointer, like current pushed aside.",
    use: "Exploratory surfaces, visual labs, interactive brand pieces.",
  },
  {
    id: "BS-013",
    title: "Click Ripple",
    category: "Interaction",
    base: "dark-accent",
    palette: 1,
    density: "balanced",
    mood: "playful",
    grain: "none",
    interaction: 3,
    scale: 0.72,
    warp: 1.6,
    speed: 0.62,
    hue: 0.016,
    octaves: 3,
    grainStrength: 0,
    summary: "A bounded six-slot ripple buffer makes click waves expand and decay.",
    use: "Product delight, onboarding moments, touch-friendly demos.",
  },
  {
    id: "BS-014",
    title: "Hover Turbulence",
    category: "Interaction",
    base: "full-coverage",
    palette: 3,
    density: "tight",
    mood: "energetic",
    grain: "subtle",
    interaction: 4,
    scale: 1.2,
    warp: 2.3,
    speed: 1.0,
    hue: 0.045,
    octaves: 4,
    grainStrength: 0.04,
    summary: "Local warp and brightness increase near the pointer without moving the whole field.",
    use: "Interactive galleries, design tools, expressive control surfaces.",
  },
  {
    id: "BS-015",
    title: "Transparent Overlay",
    category: "Utility",
    base: "overlay",
    palette: 0,
    density: "wide",
    mood: "ambient",
    grain: "none",
    interaction: 0,
    scale: 0.48,
    warp: 1.2,
    speed: 0.58,
    hue: 0.014,
    octaves: 2,
    grainStrength: 0,
    summary: "Alpha comes from the same flow mask, letting the shader sit over an existing surface.",
    use: "Over photos, glass panels, product screenshots, or branded page backgrounds.",
  },
  {
    id: "BS-016",
    title: "Fast Loading Pulse",
    category: "Utility",
    base: "full-coverage",
    palette: 0,
    density: "tight",
    mood: "punchy",
    grain: "none",
    interaction: 0,
    scale: 1.45,
    warp: 2.7,
    speed: 1.35,
    hue: 0.06,
    octaves: 4,
    grainStrength: 0,
    summary: "Short-duration motion with higher contrast and faster phase drift.",
    use: "Loading states, splash screens, transitions, installation flows.",
  },
  {
    id: "BS-017",
    title: "Minimal Monochrome",
    category: "UI",
    base: "dark-accent",
    palette: 4,
    density: "wide",
    mood: "strict",
    grain: "none",
    interaction: 0,
    scale: 0.46,
    warp: 0.9,
    speed: 0.38,
    hue: 0.003,
    octaves: 2,
    grainStrength: 0,
    summary: "A single-hue flow where brightness does the work and color stays almost silent.",
    use: "Professional tools, admin products, charts, serious documents.",
  },
  {
    id: "BS-018",
    title: "Dense Gallery Fold",
    category: "Art",
    base: "full-coverage",
    palette: 3,
    density: "tight",
    mood: "maximal",
    grain: "moderate",
    interaction: 4,
    scale: 1.55,
    warp: 3.8,
    speed: 1.1,
    hue: 0.052,
    octaves: 5,
    grainStrength: 0.09,
    summary: "A maximal setting that shows how far the skill can push fold, churn, and texture.",
    use: "Standalone art, shader playgrounds, visual identity explorations.",
  },
];

const heroExample: ShaderExample = {
  id: "BS-HERO",
  title: "Aurora Reading Field",
  category: "Hero",
  base: "full-coverage",
  palette: 0,
  density: "wide",
  mood: "cinematic calm",
  grain: "subtle",
  interaction: 0,
  scale: 0.78,
  warp: 2.25,
  speed: 0.72,
  hue: 0.026,
  octaves: 4,
  grainStrength: 0.022,
  summary: "A richer aurora field with enough movement to feel alive and enough shadow structure to keep type readable.",
  use: "Primary site hero background.",
};

const categories: Array<Category | "All"> = [
  "All",
  "Hero",
  "UI",
  "Art",
  "Interaction",
  "Texture",
  "Utility",
];

const navItems = [
  ["Gallery", "#gallery"],
  ["Use Cases", "#use-cases"],
  ["Builder", "#builder"],
  ["Code", "#code"],
  ["Docs", "#docs"],
];

const useCaseSections: Array<{ category: Category; title: string; copy: string }> = [
  {
    category: "Hero",
    title: "Hero backgrounds",
    copy: "Readable, atmospheric shaders for landing pages, product intros, and editorial sections.",
  },
  {
    category: "UI",
    title: "UI surfaces",
    copy: "Contained shader accents for cards, dashboards, panels, and product interfaces.",
  },
  {
    category: "Art",
    title: "Generative art",
    copy: "Full-field presets where the shader is the content, not just a background.",
  },
  {
    category: "Interaction",
    title: "Interactive shaders",
    copy: "Pointer follow, repel, click ripple, and hover turbulence modes for playful surfaces.",
  },
  {
    category: "Texture",
    title: "Texture and grain",
    copy: "Analog and cinematic variations where visible grain is a deliberate creative choice.",
  },
  {
    category: "Utility",
    title: "Utility overlays",
    copy: "Loading pulses, transparent overlays, and low-band gradients for functional contexts.",
  },
];

const baseModeLabel: Record<BaseMode, string> = {
  "dark-accent": "Mode B: dark primary",
  "light-accent": "Mode C: light primary",
  "full-coverage": "Mode A: full coverage",
  overlay: "Transparent overlay",
};

const palettes = [
  ["Aurora", "Violet to teal, cool and ethereal."],
  ["Sunset", "Coral and gold, warm without forcing a tech look."],
  ["Ocean", "Blue and teal, calm with low saturation swing."],
  ["Neon", "Magenta and cyan, high-energy and best full-frame."],
  ["Monochrome", "Near grayscale, brightness-led and restrained."],
];

const modules = [
  ["Base modes", "BS-MOD-BASE", "Full coverage, dark primary, light primary, and transparent overlay each mix color differently."],
  ["Density", "BS-MOD-DENSITY", "Wide, balanced, and tight presets change UV scale first, then octave count."],
  ["Motion", "BS-MOD-MOTION", "Speed and hue drift are separate so color can change without sliding the whole field."],
  ["Interaction", "BS-MOD-INTERACTION", "None, follow, repel, click ripple, and hover turbulence all feed into the domain."],
  ["Grain", "BS-MOD-GRAIN", "Dither is a correctness fix; visible grain is a deliberate texture choice."],
  ["Palette", "BS-MOD-PALETTE", "Named cosine palettes or future custom color stops are driven by the warped field."],
];

const docSections = [
  {
    id: "BS-DOC-001",
    label: "Foundation",
    title: "Base modes define the reading environment.",
    lead: "Pick the compositing mode before touching colors. Full coverage is for artwork, dark and light primary modes are for UI, and overlay mode lets another surface own the background.",
    notes: ["Mode A fills the frame.", "Mode B lets color bleed through darkness.", "Mode C keeps an off-white base readable.", "Overlay exports alpha from the flow mask."],
  },
  {
    id: "BS-DOC-002",
    label: "Shape",
    title: "Density and energy are separate controls.",
    lead: "Density changes UV scale and octave count. Energy changes warp amount, speed, and hue drift. Keeping those separate makes calm-tight and wide-cinematic gradients possible.",
    notes: ["Wide: 0.35-0.5 scale.", "Balanced: 0.7-1.0 scale.", "Tight: 1.2-1.6 scale.", "Reduce octaves before reducing color."],
  },
  {
    id: "BS-DOC-003",
    label: "Color",
    title: "Palette follows the warped field, not the screen.",
    lead: "Color should be driven by f, q, and r from the domain warp. Hue drift belongs in palette phase so the color changes in place instead of sliding across the canvas.",
    notes: ["Aurora: default cool range.", "Sunset: warm product tone.", "Ocean: calm low swing.", "Neon: best full-frame.", "Monochrome: brightness-led."],
  },
  {
    id: "BS-DOC-004",
    label: "Input",
    title: "Interaction should bend the domain.",
    lead: "Pointer modes feel natural when they alter the field before color is computed. Follow and repel are mutually exclusive, ripple is event-based, and hover turbulence can stack.",
    notes: ["Smooth pointer input.", "Clamp repel displacement.", "Limit ripples to six.", "Use hover turbulence for local intensity."],
  },
  {
    id: "BS-DOC-005",
    label: "Texture",
    title: "Dither and grain solve different problems.",
    lead: "Dither is a nearly invisible anti-banding fix. Visible grain is a style decision for analog, film, or gallery briefs and should stay away from clean product UI unless requested.",
    notes: ["Dither: almost always safe.", "Subtle grain: 0.05.", "Moderate grain: 0.12-0.15.", "Increase grain size before strength."],
  },
  {
    id: "BS-DOC-006",
    label: "Ship",
    title: "The checklist keeps the shader from feeling accidental.",
    lead: "The render loop needs bounded time, clamped delta, capped DPR, reduced-motion handling, rotated fBm octaves, clamped vignette, tonemapping, and sRGB output.",
    notes: ["Cap DPR at 2.", "Clamp dt to 1/30.", "Bound time modulo 3600.", "Render one frame for reduced motion.", "Tonemap before encode."],
  },
];

function modeToUniform(mode: BaseMode) {
  if (mode === "full-coverage") return 0;
  if (mode === "dark-accent") return 1;
  if (mode === "light-accent") return 2;
  return 3;
}

function ShaderCanvas({ example, hero = false }: { example: ShaderExample; hero?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(hero);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "360px 0px" },
    );
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [hero]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: example.base === "overlay",
      premultipliedAlpha: false,
    });
    if (!gl) {
      canvas.dataset.fallback = "WebGL2 unavailable";
      return;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
      }
    } catch (error) {
      canvas.dataset.fallback = error instanceof Error ? error.message : "Shader error";
      return;
    }

    gl.useProgram(program);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      palette: gl.getUniformLocation(program, "uPalette"),
      baseMode: gl.getUniformLocation(program, "uBaseMode"),
      scale: gl.getUniformLocation(program, "uScale"),
      warp: gl.getUniformLocation(program, "uWarp"),
      speed: gl.getUniformLocation(program, "uSpeed"),
      hue: gl.getUniformLocation(program, "uHue"),
      octaves: gl.getUniformLocation(program, "uOctaves"),
      grain: gl.getUniformLocation(program, "uGrain"),
      interaction: gl.getUniformLocation(program, "uInteraction"),
      ripplePos: gl.getUniformLocation(program, "uRipplePos"),
      rippleStart: gl.getUniformLocation(program, "uRippleStart"),
    };

    gl.uniform1i(uniforms.palette, example.palette);
    gl.uniform1i(uniforms.baseMode, modeToUniform(example.base));
    gl.uniform1f(uniforms.scale, example.scale);
    gl.uniform1f(uniforms.warp, example.warp);
    gl.uniform1f(uniforms.speed, example.speed);
    gl.uniform1f(uniforms.hue, example.hue);
    gl.uniform1i(uniforms.octaves, example.octaves);
    gl.uniform1f(uniforms.grain, example.grainStrength);
    gl.uniform1i(uniforms.interaction, example.interaction);

    const mouseTarget = { x: 0, y: 0 };
    const mouseSmooth = { x: 0, y: 0 };
    const ripplePos = new Float32Array(12);
    const rippleStart = new Float32Array(6).fill(-1000);
    let nextRipple = 0;
    let simTime = hero ? 18 : 9;

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const addRipple = (event: PointerEvent) => {
      updatePointer(event);
      const slot = nextRipple % 6;
      ripplePos[slot * 2] = mouseTarget.x;
      ripplePos[slot * 2 + 1] = mouseTarget.y;
      rippleStart[slot] = simTime;
      nextRipple += 1;
    };

    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerdown", addRipple);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    let raf = 0;

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (!reduceMotion) simTime = (simTime + dt) % 3600;

      const decay = Math.pow(2, -dt / 0.22);
      mouseSmooth.x = mouseTarget.x + (mouseSmooth.x - mouseTarget.x) * decay;
      mouseSmooth.y = mouseTarget.y + (mouseSmooth.y - mouseTarget.y) * decay;

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, simTime);
      gl.uniform2f(uniforms.mouse, mouseSmooth.x, mouseSmooth.y);
      gl.uniform2fv(uniforms.ripplePos, ripplePos);
      gl.uniform1fv(uniforms.rippleStart, rippleStart);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerdown", addRipple);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [example, hero, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={hero ? "shader-canvas hero-shader" : "shader-canvas"}
      aria-label={`${example.id} ${example.title} live WebGL gradient`}
    />
  );
}

const vertexSource = `#version 300 es
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2) * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const fragmentSource = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform int uPalette;
uniform int uBaseMode;
uniform float uScale;
uniform float uWarp;
uniform float uSpeed;
uniform float uHue;
uniform int uOctaves;
uniform float uGrain;
uniform int uInteraction;
uniform vec2 uRipplePos[6];
uniform float uRippleStart[6];
out vec4 fragColor;

#define TAU 6.283185307179586

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);
float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = ROT * p * 2.0;
    a *= 0.5;
  }
  return v;
}

float warpedFbm(vec2 p, float t, float warpAmt, int octaves, out vec2 q, out vec2 r) {
  q = vec2(fbm(p + 0.15 * t, octaves),
           fbm(p + vec2(5.2, 1.3) + 0.13 * t, octaves));
  r = vec2(fbm(p + warpAmt * q + vec2(1.7, 9.2) + 0.11 * t, octaves),
           fbm(p + warpAmt * q + vec2(8.3, 2.8) + 0.09 * t, octaves));
  return fbm(p + warpAmt * r, octaves);
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

vec3 namedPalette(float t, int pick, float drift) {
  if (pick == 1) {
    return palette(t, vec3(0.60, 0.45, 0.40), vec3(0.40, 0.35, 0.30), vec3(1.0, 1.0, 0.7), vec3(0.0, 0.10, 0.20) + drift);
  }
  if (pick == 2) {
    return palette(t, vec3(0.35, 0.45, 0.55), vec3(0.25, 0.30, 0.30), vec3(1.0, 0.9, 0.8), vec3(0.5, 0.60, 0.70) + drift);
  }
  if (pick == 3) {
    return palette(t, vec3(0.55, 0.40, 0.60), vec3(0.50, 0.30, 0.55), vec3(1.4, 1.1, 1.6), vec3(0.1, 0.55, 0.75) + drift);
  }
  if (pick == 4) {
    return palette(t, vec3(0.50, 0.50, 0.52), vec3(0.12, 0.12, 0.13), vec3(1.0), vec3(0.0, 0.0, 0.02) + drift * 0.1);
  }
  return palette(t, vec3(0.50, 0.45, 0.55), vec3(0.45, 0.40, 0.50), vec3(1.0), vec3(0.0, 0.15, 0.35) + drift);
}

vec3 acesFilmic(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

float rippleField(vec2 p, float t) {
  float total = 0.0;
  for (int i = 0; i < 6; i++) {
    float age = t - uRippleStart[i];
    if (age < 0.0 || age > 3.0) continue;
    float d = length(p - uRipplePos[i]);
    float wave = sin(TAU * (d * 6.0 - age * 2.5)) * exp(-age * 1.8) * smoothstep(0.9, 0.0, d);
    total += wave;
  }
  return total;
}

float ditherNoise(vec2 fragCoord, float t) {
  vec2 p = fragCoord + t * 13.7;
  return hash21(p) - hash21(p + 17.31);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * uSpeed;
  vec2 domain = uv * uScale;
  float warpAmt = uWarp;

  if (uInteraction == 1) {
    domain += uMouse * 0.25;
  } else if (uInteraction == 2) {
    vec2 toCursor = uv - uMouse;
    float d = length(toCursor);
    vec2 repelOffset = normalize(toCursor + 1e-4) * min(0.34 / (d * d + 0.05), 1.2);
    domain += repelOffset;
  } else if (uInteraction == 3) {
    float rip = rippleField(uv, uTime);
    domain += rip * 0.16 * normalize(uv + 1e-4);
  } else if (uInteraction == 4) {
    float proximity = smoothstep(0.62, 0.0, length(uv - uMouse));
    warpAmt = mix(uWarp, uWarp * 2.2, proximity);
  }

  vec2 q;
  vec2 r;
  float f = warpedFbm(domain, t, warpAmt, uOctaves, q, r);
  float field = f + 0.17 * length(q) + 0.08 * length(r);
  float mask = smoothstep(0.04, 0.78, field);
  mask = pow(mask, 1.38);
  float drift = uTime * uHue;
  vec3 color = namedPalette(field, uPalette, drift);
  vec3 col;
  float alpha = 1.0;

  if (uBaseMode == 1) {
    vec3 glow = color * 0.78 + vec3(0.03, 0.026, 0.04);
    float readableMask = max(mask, 0.13 * smoothstep(-0.25, 0.65, field));
    col = mix(vec3(0.004, 0.005, 0.009), glow, readableMask);
  } else if (uBaseMode == 2) {
    vec3 paper = vec3(0.955, 0.95, 0.93);
    vec3 ink = mix(vec3(0.58, 0.50, 0.60), color * 0.82, 0.72);
    col = mix(paper, ink, mask * 0.74);
  } else if (uBaseMode == 3) {
    col = color * 0.8;
    alpha = clamp(mask * 0.78, 0.0, 0.82);
  } else {
    col = color;
    col *= 0.68 + 0.54 * mask;
  }

  if (uInteraction == 4) {
    float proximity = smoothstep(0.62, 0.0, length(uv - uMouse));
    col *= 1.0 + proximity * 0.28;
  }

  float vignette = clamp(1.0 - 0.28 * dot(uv, uv), 0.35, 1.0);
  if (uBaseMode == 2) {
    col = mix(vec3(0.955, 0.95, 0.93), col, vignette);
  } else {
    col *= vignette;
  }

  col = acesFilmic(col);
  col = linearToSrgb(col);
  col += ditherNoise(gl_FragCoord.xy, uTime) / 255.0;
  if (uGrain > 0.0) {
    float coarse = hash21(floor(gl_FragCoord.xy / 2.0) + floor(uTime * 24.0));
    col += (coarse - 0.5) * uGrain * mix(1.0, 0.45, mask);
  }
  fragColor = vec4(clamp(col, 0.0, 1.0), alpha);
}`;

function ExampleCard({ example }: { example: ShaderExample }) {
  return (
    <article className="example-card" id={example.id}>
      <div className={example.base === "overlay" ? "shader-shell checker-shell" : "shader-shell"}>
        <ShaderCanvas example={example} />
        <div className="id-pill">{example.id}</div>
      </div>
      <div className="example-body">
        <div>
          <p className="eyebrow">{example.category}</p>
          <h3>{example.title}</h3>
        </div>
        <p>{example.summary}</p>
        <dl>
          <div>
            <dt>Base</dt>
            <dd>{baseModeLabel[example.base]}</dd>
          </div>
          <div>
            <dt>Palette</dt>
            <dd>{palettes[example.palette][0]}</dd>
          </div>
          <div>
            <dt>Density</dt>
            <dd>{example.density}</dd>
          </div>
          <div>
            <dt>Grain</dt>
            <dd>{example.grain}</dd>
          </div>
        </dl>
        <p className="usage">{example.use}</p>
      </div>
    </article>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
    >
      <span aria-hidden="true" />
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [builderBase, setBuilderBase] = useState<BaseMode>("dark-accent");
  const [builderPalette, setBuilderPalette] = useState(0);
  const [builderScale, setBuilderScale] = useState(0.75);
  const [builderWarp, setBuilderWarp] = useState(1.7);
  const [builderSpeed, setBuilderSpeed] = useState(0.7);
  const [builderGrain, setBuilderGrain] = useState(0.02);
  const featured = heroExample;
  const readablePresets = examples.slice(0, 2);
  const galleryExamples = examples.slice(0, 9);

  useEffect(() => {
    const saved = window.localStorage.getItem("shader-atlas-theme");
    const nextTheme =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("shader-atlas-theme", theme);
  }, [theme]);

  const builderExample = useMemo<ShaderExample>(
    () => ({
      id: "CUSTOM-001",
      title: "Custom Builder Preview",
      category: "Utility",
      base: builderBase,
      palette: builderPalette,
      density: builderScale < 0.6 ? "wide" : builderScale > 1.05 ? "tight" : "balanced",
      mood: builderWarp > 2.2 ? "energetic" : "calm",
      grain: builderGrain > 0.08 ? "moderate" : builderGrain > 0 ? "subtle" : "none",
      interaction: 0,
      scale: builderScale,
      warp: builderWarp,
      speed: builderSpeed,
      hue: 0.018 + builderSpeed * 0.012,
      octaves: builderScale > 1.05 ? 4 : 3,
      grainStrength: builderGrain,
      summary: "Live preview generated from the controls.",
      use: "Copy the config, then ask the skill or any LLM harness to generate the shader.",
    }),
    [builderBase, builderPalette, builderScale, builderWarp, builderSpeed, builderGrain],
  );

  return (
    <main>
      <header className="site-toolbar" aria-label="Primary navigation">
        <a href="#" className="brand-mark" aria-label="Beautiful Shader Atlas home">
          Beautiful Shader
        </a>
        <nav className="primary-nav" aria-label="Site sections">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
      </header>

      <section className="hero">
        <ShaderCanvas example={featured} hero />
        <div className="hero-content">
          <p className="eyebrow">Gallery-first shader skill</p>
          <h1>WebGL gradient recipes for any LLM harness.</h1>
          <p>
            Browse real examples, learn when to use each shader, tune your own version,
            then copy a preset config into the beautiful-shader skill from Claude Code,
            Codex, ChatGPT, or any agentic coding harness.
          </p>
          <div className="hero-actions" aria-label="Primary page sections">
            <a href="#gallery">Explore gallery</a>
            <a href="#builder">Make your own</a>
          </div>
        </div>
        <aside className="hero-panel" aria-label="Featured shader">
          <span>{featured.id}</span>
          <strong>{featured.title}</strong>
          <p>{featured.summary}</p>
        </aside>
      </section>

      <section className="gallery-intro" id="gallery">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2>Start with the shader you can see yourself using.</h2>
        </div>
        <p>
          The gallery is intentionally visual first. Each preset has an ID, a use case,
          and a short reason to choose it.
        </p>
      </section>

      <section className="gallery-wall" aria-label="Shader preset gallery">
        {galleryExamples.map((example, index) => (
          <div className={index < 2 ? "gallery-featured" : ""} key={example.id}>
            <ExampleCard key={example.id} example={example} />
          </div>
        ))}
      </section>

      <section className="skill-note" aria-label="Skill compatibility">
        <p className="eyebrow">Skill, not just package</p>
        <h2>Use it with any LLM or coding harness.</h2>
        <p>
          The presets and docs are written as portable instructions: paste a preset ID,
          the desired use case, and any changes into the beautiful-shader skill. It can
          guide Claude Code, Codex, ChatGPT, or another harness that can edit WebGL/GLSL.
        </p>
      </section>

      <section className="section-heading" id="use-cases">
        <p className="eyebrow">Use cases</p>
        <h2>Examples grouped by where they belong.</h2>
      </section>

      <section className="use-case-stack">
        {useCaseSections.map((section) => (
          <article className="use-case-row" key={section.category}>
            <div className="use-case-copy">
              <p className="eyebrow">{section.category}</p>
              <h3>{section.title}</h3>
              <p>{section.copy}</p>
            </div>
            <div className="use-case-examples">
              {examples
                .filter((example) => example.category === section.category)
                .slice(0, 3)
                .map((example) => (
                  <ExampleCard key={example.id} example={example} />
                ))}
            </div>
          </article>
        ))}
      </section>

      <section className="builder-section" id="builder">
        <div className="builder-copy">
          <p className="eyebrow">Builder</p>
          <h2>Make your own gradient recipe.</h2>
          <p>
            Tune the core shader ingredients, then copy the config into the skill prompt
            or use it as the shape for a future npm preset.
          </p>
        </div>
        <div className="builder-preview">
          <ShaderCanvas example={builderExample} />
          <div className="id-pill">{builderExample.id}</div>
        </div>
        <form className="builder-controls">
          <label>
            Base mode
            <select value={builderBase} onChange={(event) => setBuilderBase(event.target.value as BaseMode)}>
              <option value="dark-accent">Dark accent</option>
              <option value="light-accent">Light accent</option>
              <option value="full-coverage">Full coverage</option>
              <option value="overlay">Overlay</option>
            </select>
          </label>
          <label>
            Palette
            <select value={builderPalette} onChange={(event) => setBuilderPalette(Number(event.target.value))}>
              {palettes.map(([name], index) => (
                <option key={name} value={index}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Density <span>{builderScale.toFixed(2)}</span>
            <input type="range" min="0.35" max="1.55" step="0.05" value={builderScale} onChange={(event) => setBuilderScale(Number(event.target.value))} />
          </label>
          <label>
            Flow <span>{builderWarp.toFixed(2)}</span>
            <input type="range" min="0.8" max="3.8" step="0.05" value={builderWarp} onChange={(event) => setBuilderWarp(Number(event.target.value))} />
          </label>
          <label>
            Speed <span>{builderSpeed.toFixed(2)}</span>
            <input type="range" min="0.25" max="1.5" step="0.05" value={builderSpeed} onChange={(event) => setBuilderSpeed(Number(event.target.value))} />
          </label>
          <label>
            Grain <span>{builderGrain.toFixed(2)}</span>
            <input type="range" min="0" max="0.16" step="0.01" value={builderGrain} onChange={(event) => setBuilderGrain(Number(event.target.value))} />
          </label>
        </form>
      </section>

      <section className="code-section" id="code">
        <div>
          <p className="eyebrow">Code and skill prompt</p>
          <h2>Use presets as package config or as LLM instructions.</h2>
        </div>
        <pre>{`// Future npm shape
import { GradientCanvas, presets } from "beautiful-shader";

<GradientCanvas preset={presets["BS-001"]} />

// Skill / harness prompt
Use the beautiful-shader skill.
Create a WebGL2 gradient using preset BS-001.
Context: readable landing-page hero.
Adjust: palette=${palettes[builderPalette][0]}, base=${builderBase}, density=${builderScale.toFixed(2)}, flow=${builderWarp.toFixed(2)}, grain=${builderGrain.toFixed(2)}.`}</pre>
      </section>

      <section className="section-heading" id="docs">
        <p className="eyebrow">Docs</p>
        <h2>How the shader ingredients fit together.</h2>
        <p>
          A compact reference for the skill, package, or any harness that needs to
          generate the shader from instructions.
        </p>
      </section>

      <section className="docs-stack">
        {docSections.map((section) => (
          <article key={section.id} className="doc-row">
            <div className="doc-meta">
              <span>{section.id}</span>
              <p>{section.label}</p>
            </div>
            <div className="doc-copy">
              <h3>{section.title}</h3>
              <p>{section.lead}</p>
            </div>
            <ul>
              {section.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="package-note">
        <p>Preset IDs are stable enough to become exports later, but useful today as plain-language skill inputs.</p>
      </section>
    </main>
  );
}
