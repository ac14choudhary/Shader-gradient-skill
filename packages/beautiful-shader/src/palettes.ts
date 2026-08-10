import type { GradientColors } from "./types";

export type PaletteDefinition = {
  name: string;
  description: string;
  colors: GradientColors;
};

export const palettes: PaletteDefinition[] = [
  {
    name: "Aurora",
    description: "Violet to teal, cool and ethereal.",
    colors: { primary: "#8b7dff", secondary: "#35d1c2", tertiary: "#c7ff8a", background: "#050509" },
  },
  {
    name: "Sunset",
    description: "Coral and gold, warm without forcing a tech look.",
    colors: { primary: "#ff7a59", secondary: "#ffd36a", tertiary: "#8f5cff", background: "#130906" },
  },
  {
    name: "Ocean",
    description: "Blue and teal, calm with low saturation swing.",
    colors: { primary: "#2d7ff9", secondary: "#20c7aa", tertiary: "#8fd6ff", background: "#061018" },
  },
  {
    name: "Neon",
    description: "Magenta and cyan, high-energy and best full-frame.",
    colors: { primary: "#ff3df2", secondary: "#22f0ff", tertiary: "#ffe45e", background: "#07020d" },
  },
  {
    name: "Monochrome",
    description: "Near grayscale, brightness-led and restrained.",
    colors: { primary: "#d9dde5", secondary: "#828a98", tertiary: "#f5f0e7", background: "#08090b" },
  },
  {
    name: "Botanical",
    description: "Deep greens, teal pigment, cream light, and blush accents.",
    colors: { primary: "#0a6d55", secondary: "#0e9a98", tertiary: "#f4b4aa", background: "#f4e3bf" },
  },
];
