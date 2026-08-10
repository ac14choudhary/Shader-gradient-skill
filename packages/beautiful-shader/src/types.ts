export type BaseMode = "dark-accent" | "light-accent" | "full-coverage" | "overlay";

export type ShaderCategory =
  | "Hero"
  | "UI"
  | "Art"
  | "Interaction"
  | "Organic"
  | "Texture"
  | "Utility";

export type FlowPattern = "soft-fold" | "ribbon" | "cellular" | "storm" | "glass" | "painterly-bloom";

export type GradientColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
};

export type GradientMotion = {
  scale: number;
  warp: number;
  speed: number;
  hue: number;
  octaves: number;
};

export type GradientGrain = {
  label: string;
  strength: number;
};

export type GradientRecipe = {
  id: string;
  title: string;
  category: ShaderCategory;
  base: BaseMode;
  palette: string;
  flowPattern: FlowPattern;
  density: string;
  mood: string;
  motion: GradientMotion;
  grain: GradientGrain;
  interaction: number;
  summary: string;
  recommendedUse: string;
};
