import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the shader atlas shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Beautiful Shader Atlas<\/title>/i);
  assert.match(html, /Gallery-first shader skill/);
  assert.match(html, /WebGL gradient recipes for any LLM harness/);
  assert.match(html, /href="\/gallery"/);
  assert.match(html, /href="\/use-cases"/);
  assert.match(html, /href="\/builder"/);
  assert.match(html, /href="\/code"/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /Start with the shader you can see yourself using/);
  assert.match(html, /Use it with any LLM or coding harness/);
  assert.match(html, /Make your own gradient recipe/);
  assert.match(html, /Flow pattern/);
  assert.match(html, /Primary color/);
  assert.match(html, /Secondary color/);
  assert.match(html, /Tertiary color/);
  assert.match(html, /Background color/);
  assert.match(html, /Add grain/);
  assert.match(html, /Export recipe/);
  assert.match(html, /Switch to dark mode/);
  assert.match(html, /BS-001/);
  assert.match(html, /BS-018/);
  assert.match(html, /BS-DOC-006/);
  assert.match(html, /GradientCanvas/);
  assert.match(html, /Copy code/);
  assert.match(html, /Copy prompt/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("server-renders individual atlas pages", async () => {
  const routes = [
    ["/gallery", "Shader preset gallery"],
    ["/use-cases", "Examples grouped by where they belong"],
    ["/builder", "Export recipe"],
    ["/code", "Use presets as package config"],
    ["/docs", "How the shader ingredients fit together"],
  ];

  for (const [route, text] of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, new RegExp(text), route);
    assert.match(html, /href="\/gallery"/, route);
    assert.match(html, /href="\/docs"/, route);
  }
});

test("keeps the atlas self-contained and starter-free", async () => {
  const [page, atlas, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/shader-atlas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /view="home"/);
  assert.match(atlas, /const examples: ShaderExample\[\]/);
  assert.match(atlas, /BS-015/);
  assert.match(atlas, /uRipplePos\[6\]/);
  assert.match(atlas, /prefers-reduced-motion: reduce/);
  assert.match(atlas, /const docSections/);
  assert.match(atlas, /const heroExample/);
  assert.match(atlas, /const useCaseSections/);
  assert.match(atlas, /IntersectionObserver/);
  assert.doesNotMatch(atlas, /WEBGL_lose_context|loseContext/);
  assert.match(atlas, /ThemeToggle/);
  assert.match(atlas, /builderExample/);
  assert.match(atlas, /LLM harness/);
  assert.match(atlas, /uFlowPattern/);
  assert.match(atlas, /uUseCustomColors/);
  assert.match(atlas, /navigator\.clipboard/);
  assert.match(atlas, /eager=\{view === "gallery" && index < 4\}/);
  assert.match(atlas, /gradientCode/);
  assert.match(atlas, /gradientPrompt/);
  assert.match(atlas, /data-tooltip/);
  assert.match(layout, /title:\s*"Beautiful Shader Atlas"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + atlas + layout, /codex-preview|_sites-preview|Starter Project/);

  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
