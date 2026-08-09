import type { GradientRecipe } from "./types";

export function serializeRecipe(recipe: GradientRecipe): string {
  return JSON.stringify(recipe, null, 2);
}

export function createShaderPrompt(recipe: GradientRecipe): string {
  return `Use the beautiful-shader skill.
Create a WebGL2 gradient using preset ${recipe.id}.
Title: ${recipe.title}.
Category: ${recipe.category}.
Use case: ${recipe.recommendedUse}
Render it as a bounded section or component, not a full-page takeover.
Keep the shader readable and use this recipe:
${serializeRecipe(recipe)}`;
}

export function createPackageSnippet(recipe: GradientRecipe): string {
  return `import { GradientCanvas, presets } from "beautiful-shader";

<GradientCanvas
  preset={presets["${recipe.id}"]}
  aria-label="${recipe.title} gradient"
/>`;
}
