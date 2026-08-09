import { palettes } from "./palettes";
import type { BaseMode, FlowPattern, GradientRecipe, ShaderCategory } from "./types";

type PresetInput = {
  id: string;
  title: string;
  category: ShaderCategory;
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
  flowPattern?: FlowPattern;
  summary: string;
  use: string;
};

const presetInputs: PresetInput[] = [
  { id: "BS-001", title: "Dark Calm Hero", category: "Hero", base: "dark-accent", palette: 0, density: "wide", mood: "calm", grain: "dither only", interaction: 0, scale: 0.62, warp: 1.48, speed: 0.62, hue: 0.018, octaves: 3, grainStrength: 0.012, summary: "Dark background as the primary color, with visible violet and teal motion kept below the text plane.", use: "Readable hero sections, editorial landing pages, calm product intros." },
  { id: "BS-002", title: "Light Ink Wash", category: "Hero", base: "light-accent", palette: 0, density: "balanced", mood: "calm", grain: "none", interaction: 0, scale: 0.82, warp: 1.82, speed: 0.64, hue: 0.022, octaves: 4, grainStrength: 0, summary: "A light-mode wash with more visible aurora color, still soft enough for text and UI.", use: "Bright SaaS pages, documentation intros, airy portfolio sections." },
  { id: "BS-003", title: "Aurora Full Field", category: "Art", base: "full-coverage", palette: 0, density: "balanced", mood: "cinematic", grain: "subtle", interaction: 0, scale: 0.95, warp: 2.6, speed: 0.95, hue: 0.038, octaves: 4, grainStrength: 0.035, summary: "A full-frame color field where the shader itself is the object of attention.", use: "Ambient art panels, loading screens, generative playgrounds." },
  { id: "BS-004", title: "Neon Mesh Burst", category: "Art", base: "full-coverage", palette: 3, density: "tight", mood: "energetic", grain: "subtle", interaction: 0, scale: 1.38, warp: 3.45, speed: 1.18, hue: 0.055, octaves: 5, grainStrength: 0.04, summary: "High saturation, dense domain warping, and fast hue drift for a punchy visual.", use: "Campaign moments, music/event pages, short-lived attention grabbers." },
  { id: "BS-005", title: "Ocean Product Pool", category: "UI", base: "dark-accent", palette: 2, density: "balanced", mood: "calm", grain: "dither only", interaction: 0, scale: 0.7, warp: 1.35, speed: 0.65, hue: 0.015, octaves: 3, grainStrength: 0, summary: "Cool blue and teal accents with enough negative space for cards and labels.", use: "Dashboard headers, pricing callouts, app panels." },
  { id: "BS-006", title: "Warm Coral Glow", category: "Hero", base: "dark-accent", palette: 1, density: "wide", mood: "warm", grain: "none", interaction: 0, scale: 0.5, warp: 1.25, speed: 0.62, hue: 0.017, octaves: 2, grainStrength: 0, summary: "The sunset palette in sparse mode so warmth reads as invitation instead of noise.", use: "Founder pages, product launches, softer brand surfaces." },
  { id: "BS-007", title: "Slate Data Gradient", category: "Utility", base: "light-accent", palette: 4, density: "balanced", mood: "quiet", grain: "anti-banding", interaction: 0, scale: 0.78, warp: 1.05, speed: 0.4, hue: 0.004, octaves: 2, grainStrength: 0, summary: "Near-monochrome variation that keeps banding away without creating a decorative texture.", use: "Charts, data-viz backgrounds, restrained documentation graphics." },
  { id: "BS-008", title: "Analog Film Flow", category: "Texture", base: "full-coverage", palette: 1, density: "balanced", mood: "cinematic", grain: "moderate", interaction: 0, scale: 0.88, warp: 2.2, speed: 0.82, hue: 0.026, octaves: 4, grainStrength: 0.12, summary: "Visible animated grain on a warm field for an intentional analog finish.", use: "Film, music, editorial, gallery, and expressive brand pages." },
  { id: "BS-009", title: "Tiny Card Accent", category: "UI", base: "dark-accent", palette: 0, density: "tight", mood: "minimal", grain: "none", interaction: 0, scale: 1.22, warp: 1, speed: 0.48, hue: 0.012, octaves: 2, grainStrength: 0, summary: "Small shapes with low warp so a compact UI surface feels alive without getting noisy.", use: "Feature cards, empty states, badges, nav panels." },
  { id: "BS-010", title: "Wide Negative Space", category: "Hero", base: "dark-accent", palette: 2, density: "extra-wide", mood: "minimal", grain: "none", interaction: 0, scale: 0.35, warp: 0.95, speed: 0.42, hue: 0.01, octaves: 2, grainStrength: 0, summary: "Very large slow forms, built to stay behind copy and interface chrome.", use: "Enterprise pages, long-read headers, top-of-product experiences." },
  { id: "BS-011", title: "Follow Drift", category: "Interaction", base: "dark-accent", palette: 0, density: "balanced", mood: "ambient", grain: "none", interaction: 1, scale: 0.72, warp: 1.55, speed: 0.7, hue: 0.018, octaves: 3, grainStrength: 0, summary: "The field eases toward the pointer through smoothed domain offset, never raw cursor jumps.", use: "Playful hero moments and interactive demos where subtle response helps." },
  { id: "BS-012", title: "Repel Current", category: "Interaction", base: "full-coverage", palette: 2, density: "balanced", mood: "responsive", grain: "dither only", interaction: 2, scale: 0.85, warp: 2.1, speed: 0.82, hue: 0.025, octaves: 4, grainStrength: 0, summary: "The domain bends away from the pointer, like current pushed aside.", use: "Exploratory surfaces, visual labs, interactive brand pieces." },
  { id: "BS-013", title: "Click Ripple", category: "Interaction", base: "dark-accent", palette: 1, density: "balanced", mood: "playful", grain: "none", interaction: 3, scale: 0.72, warp: 1.6, speed: 0.62, hue: 0.016, octaves: 3, grainStrength: 0, summary: "A bounded six-slot ripple buffer makes click waves expand and decay.", use: "Product delight, onboarding moments, touch-friendly demos." },
  { id: "BS-014", title: "Hover Turbulence", category: "Interaction", base: "full-coverage", palette: 3, density: "tight", mood: "energetic", grain: "subtle", interaction: 4, scale: 1.2, warp: 2.3, speed: 1, hue: 0.045, octaves: 4, grainStrength: 0.04, summary: "Local warp and brightness increase near the pointer without moving the whole field.", use: "Interactive galleries, design tools, expressive control surfaces." },
  { id: "BS-015", title: "Transparent Overlay", category: "Utility", base: "overlay", palette: 0, density: "wide", mood: "ambient", grain: "none", interaction: 0, scale: 0.48, warp: 1.2, speed: 0.58, hue: 0.014, octaves: 2, grainStrength: 0, summary: "Alpha comes from the same flow mask, letting the shader sit over an existing surface.", use: "Over photos, glass panels, product screenshots, or branded page backgrounds." },
  { id: "BS-016", title: "Fast Loading Pulse", category: "Utility", base: "full-coverage", palette: 0, density: "tight", mood: "punchy", grain: "none", interaction: 0, scale: 1.45, warp: 2.7, speed: 1.35, hue: 0.06, octaves: 4, grainStrength: 0, summary: "Short-duration motion with higher contrast and faster phase drift.", use: "Loading states, splash screens, transitions, installation flows." },
  { id: "BS-017", title: "Minimal Monochrome", category: "UI", base: "dark-accent", palette: 4, density: "wide", mood: "strict", grain: "none", interaction: 0, scale: 0.46, warp: 0.9, speed: 0.38, hue: 0.003, octaves: 2, grainStrength: 0, summary: "A single-hue flow where brightness does the work and color stays almost silent.", use: "Professional tools, admin products, charts, serious documents." },
  { id: "BS-018", title: "Dense Gallery Fold", category: "Art", base: "full-coverage", palette: 3, density: "tight", mood: "maximal", grain: "moderate", interaction: 4, scale: 1.55, warp: 3.8, speed: 1.1, hue: 0.052, octaves: 5, grainStrength: 0.09, summary: "A maximal setting that shows how far the skill can push fold, churn, and texture.", use: "Standalone art, shader playgrounds, visual identity explorations." },
];

export const presets: GradientRecipe[] = presetInputs.map((preset) => ({
  id: preset.id,
  title: preset.title,
  category: preset.category,
  base: preset.base,
  palette: palettes[preset.palette]?.name ?? palettes[0].name,
  flowPattern: preset.flowPattern ?? "soft-fold",
  density: preset.density,
  mood: preset.mood,
  motion: {
    scale: preset.scale,
    warp: preset.warp,
    speed: preset.speed,
    hue: preset.hue,
    octaves: preset.octaves,
  },
  grain: {
    label: preset.grain,
    strength: preset.grainStrength,
  },
  interaction: preset.interaction,
  summary: preset.summary,
  recommendedUse: preset.use,
}));

export const presetMap = Object.fromEntries(presets.map((preset) => [preset.id, preset])) as Record<string, GradientRecipe>;

export function getPreset(id: string): GradientRecipe | undefined {
  return presetMap[id];
}
