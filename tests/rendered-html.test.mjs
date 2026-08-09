import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /Beautiful Shader Skill Atlas/);
  assert.match(html, /Readable gradients with living motion/);
  assert.match(html, /Shader atlas controls/);
  assert.match(html, /Switch to dark mode/);
  assert.match(html, /BS-001/);
  assert.match(html, /BS-018/);
  assert.match(html, /BS-MOD-INTERACTION/);
  assert.match(html, /BS-DOC-006/);
  assert.match(html, /GradientCanvas/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("keeps the atlas self-contained and starter-free", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const examples: ShaderExample\[\]/);
  assert.match(page, /BS-015/);
  assert.match(page, /uRipplePos\[6\]/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.match(page, /const docSections/);
  assert.match(page, /ThemeToggle/);
  assert.match(page, /setActiveCategory/);
  assert.match(layout, /title:\s*"Beautiful Shader Atlas"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /codex-preview|_sites-preview|Starter Project/);

  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
