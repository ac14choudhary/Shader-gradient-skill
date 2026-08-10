import type { FlowPattern } from "./types";

export type FlowPatternDefinition = {
  id: FlowPattern;
  label: string;
  description: string;
};

export const flowPatterns: FlowPatternDefinition[] = [
  { id: "soft-fold", label: "Soft fold", description: "Slow organic folds for readable backgrounds." },
  { id: "ribbon", label: "Ribbon sweep", description: "Horizontal bands that bend through the frame." },
  { id: "cellular", label: "Cellular bloom", description: "Rounded cells and pooled color islands." },
  { id: "storm", label: "Storm current", description: "Rotating pressure with stronger turbulence." },
  { id: "glass", label: "Glass caustic", description: "Crossed refraction lines with crisp highlights." },
  { id: "painterly-bloom", label: "Painterly bloom", description: "Organic pigment blooms, brushed masks, and a subtle woven-canvas structure." },
];
