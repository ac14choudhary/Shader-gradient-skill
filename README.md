# beautiful-shader

A [Claude Code](https://claude.com/claude-code) skill that turns "make me a beautiful
shader animation" into a finished, framework-free WebGL2 gradient background — the kind
that folds and churns like ink in water instead of sliding around like a screensaver.

One file. No dependencies. No build step. Drop it in, ask for a shader, get GLSL you can
paste straight into a `<canvas>`.

```
"give me a slow, calm flow field for the hero section, dark background as the base"
```
→ a self-contained fragment shader, tuned for exactly that brief.

## Why this exists

Most "shader tutorial" output looks like a shader tutorial — a rainbow noise field
sliding across the screen, occasionally banding, always the same speed everywhere. The
gap between *technically working* and *actually beautiful* is a specific, learnable set
of decisions: how noise octaves rotate between iterations, how domain warping is timed
so it churns instead of slides, whether color should fill the frame or bleed through
sparingly, whether grain belongs here at all.

This skill encodes those decisions as a repeatable process, built by actually shipping
one of these — iterating live against real feedback ("too dense," "add grain," "no wait,
remove the grain," "colors aren't changing," "why is there a dead black corner") until it
converged on something that reads as intentional. The scars from that process are in the
skill file as inline notes, not just the final numbers — so when you hit the same
"too dense" moment, you already know which knob to turn.

You can see where it came from: [ayush.design/playground](https://ayush.design/playground) →
**Flow Field**.

There is also a live preset atlas built from the same skill vocabulary:
[Beautiful Shader Atlas](https://beautiful-shader-atlas.hkwyjfrmmaqkrvps.chatgpt.site).
It documents reusable preset IDs, base modes, palette choices, interaction modes, and
the practical layout lessons that only show up once several shaders are rendered on one
page.

## Install

Claude Code skills are just markdown files. Drop this one into your skills folder:

```bash
curl -o ~/.claude/skills/beautiful-shader.md \
  https://raw.githubusercontent.com/ac14choudhary/Shader-gradient-skill/main/beautiful-shader.md
```

Or clone the repo and copy it manually:

```bash
git clone https://github.com/ac14choudhary/Shader-gradient-skill.git
cp Shader-gradient-skill/beautiful-shader.md ~/.claude/skills/
```

No other setup — the skill is fully self-contained, no external assets or packages.

## Use it

Open Claude Code anywhere and either run the slash command or just ask naturally:

```
/beautiful-shader
```
```
can you build me a shader gradient background for my landing page hero?
```

Claude will ask (or infer from context) where the effect lives and what mood you're
going for, then walk through the process below to produce a working shader tuned to
that answer — not a generic one you have to rework.

## What it actually does

1. **Places your request on a use-case table** — small UI element vs. full-bleed hero
   vs. standalone art piece vs. "must not band" data-viz gradient — and reads off grain,
   interactivity, motion speed, palette density, and visual scale from it. This is the
   part most AI-generated shaders skip, and it's why they all look the same regardless
   of context.
2. **Builds from a small, proven GLSL core** — hash → value noise (quintic falloff, no
   faceting) → fBm with inter-octave rotation (no plaid bias) → two-level domain warping
   (Iñigo Quilez's `f(p + f(p + f(p)))`, the single technique that makes noise look like
   flowing liquid instead of static) → a cosine palette colored by the warp field itself,
   not raw UV space.
3. **Picks a color composition mode**: full coverage for energetic/generative-art pieces,
   or dark-background-as-primary-with-color-bleeding-through-a-mask for calm, modern UI —
   the mode that actually shipped after the first "too dense" pass.
4. **Ships a framework-free JS scaffold**: an attribute-less fullscreen triangle (zero
   vertex buffers), capped device-pixel-ratio, `ResizeObserver`-driven resizing,
   framerate-independent timing with clamped `dt`, and `prefers-reduced-motion` support
   baked in from the start, not bolted on after. For galleries or documentation pages,
   it now includes the hard-earned rule to lazy-mount live canvases or share one
   renderer, because browsers can evict early WebGL contexts when too many previews
   render at once.
5. **Handles grain honestly**: invisible anti-banding dither (near-free, almost always
   safe) is a different thing from visible stylistic film grain (a deliberate choice that
   fights "smooth/minimal" briefs) — the skill keeps these separate and includes a
   from-scratch, statistically-validated procedural blue-noise generator for when real
   grain is actually called for.
6. **Runs a ship checklist** before calling anything done — framerate-independent motion,
   bounded time, aspect-ratio-safe vignette (a real bug: an unclamped vignette can crush
   the corners of a wide/short canvas to solid black), no unwanted interactivity, no
   grain fighting a calm brief, and no shader taking over the whole visual scale unless
   the shader itself is the content.

## Preset atlas learnings

The atlas pushed the skill beyond a single hero background and clarified a few rules:

- **Readable hero shaders need their own composition.** A beautiful full-frame art
  shader can still be a poor hero background if it leaves no stable text zone.
- **Dark and light hero modes should be showcased large.** Tiny cards do not prove that
  a preset works behind real type, so the first reusable hero modes deserve a two-up
  preview.
- **Many live canvases need lifecycle discipline.** Mounting every shader preview at
  once can make the first examples go blank as WebGL contexts are evicted. Lazy-mount,
  release contexts, or use a shared renderer.
- **Scale is a product choice.** Cards, panels, docs, dashboards, and hero sections need
  different shader dominance. The effect should support the surface it lives in.

## Scope

This covers the flowing-gradient-background family specifically — the highest-value,
cheapest-to-build "beautiful shader" effect, and the one that fits almost every actual
request (hero backgrounds, cards, ambient art, loading states). It does not cover fluid
simulation, volumetric clouds, terrain, ocean, or GPGPU particles — those need multi-pass
render targets and are a different scale of project. The skill says so if you ask for
one of those, rather than improvising a shallow version.

For that deeper end of the pool: [Iñigo Quilez](https://iquilezles.org),
[The Book of Shaders](https://thebookofshaders.com), Bridson/Hourihan/Nordenstam's
*Curl-Noise for Procedural Fluid Flow* (SIGGRAPH 2007), and Jos Stam's *Stable Fluids*
(SIGGRAPH 1999).

## License

MIT — use it, fork it, ship it. If you improve on the "too dense" problem or find a
better default for something, a PR is welcome.
