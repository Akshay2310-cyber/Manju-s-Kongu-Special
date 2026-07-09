/**
 * Generate product / category / hero imagery (and optional hero video)
 * with the Google Gemini API, saving them as static files in /public/generated.
 *
 *   1.  put your key in  .env.local   ->   GEMINI_API_KEY=xxxxxxxx
 *   2.  npm run generate            (images)
 *       npm run generate -- --video (also render a hero video with Veo)
 *       npm run generate -- --force (re-generate even if a file exists)
 *
 * Nothing here ever runs in the browser. The key stays on your machine.
 */
import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { products, categories, shop } from "../lib/config";

// ---- load .env.local (simple parser, no dependency) ----
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error(
    "\n  Missing GEMINI_API_KEY.\n  Create .env.local in the project root with:\n\n    GEMINI_API_KEY=your_key_here\n\n  Get a key at https://aistudio.google.com/apikey\n"
  );
  process.exit(1);
}

const FORCE = process.argv.includes("--force");
const WITH_VIDEO = process.argv.includes("--video");

const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const VIDEO_MODEL = process.env.GEMINI_VIDEO_MODEL || "veo-3.1-fast-generate-preview";

const OUT_DIR = resolve(process.cwd(), "public", "generated");
mkdirSync(OUT_DIR, { recursive: true });

const ai = new GoogleGenAI({ apiKey: API_KEY });

const STYLE =
  "Professional product food photography, warm natural light, rustic and artisanal, cream and earthy tones, high detail, appetising, no text, no watermark, no logo.";

const generatedImages: Record<string, string> = {};
let heroPath = "";
let heroVideoPath = "";

function extFor(mime?: string) {
  if (!mime) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "png";
}

async function genImage(id: string, prompt: string, aspect: string) {
  // skip if already present (unless --force)
  const existing = ["png", "jpg", "webp"].find((e) =>
    existsSync(join(OUT_DIR, `${id}.${e}`))
  );
  if (existing && !FORCE) {
    generatedImages[id] = `/generated/${id}.${existing}`;
    console.log(`  • ${id}  (cached)`);
    return;
  }

  const fullPrompt = `${prompt}. ${aspect}. ${STYLE}`;
  try {
    const res = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: fullPrompt,
    });
    const parts = res.candidates?.[0]?.content?.parts ?? [];
    const img = parts.find((p: any) => p.inlineData?.data);
    if (!img?.inlineData?.data) {
      console.warn(`  ! ${id}  no image returned, skipped`);
      return;
    }
    const ext = extFor(img.inlineData.mimeType);
    const file = `${id}.${ext}`;
    writeFileSync(join(OUT_DIR, file), Buffer.from(img.inlineData.data, "base64"));
    generatedImages[id] = `/generated/${file}`;
    console.log(`  ✓ ${id}  -> ${file}`);
  } catch (e: any) {
    console.warn(`  ! ${id}  failed: ${e?.message || e}`);
  }
}

// retry a network call a few times on transient errors (e.g. "fetch failed")
async function withRetry<T>(label: string, fn: () => Promise<T>, tries = 4): Promise<T> {
  let lastErr: any;
  for (let i = 1; i <= tries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      console.warn(`    (${label} attempt ${i}/${tries} failed: ${e?.message || e})`);
      await new Promise((r) => setTimeout(r, 5000 * i));
    }
  }
  throw lastErr;
}

async function genHeroVideo() {
  console.log("\nRendering hero video with Veo (this can take a few minutes)...");
  try {
    const prompt =
      "Slow cinematic close-up pan across an Indian home kitchen counter: glass bottles of golden wood-pressed oils, wooden bowls of colourful spice powders, and blocks of jaggery with fresh sugarcane. Warm morning light, gentle steam, shallow depth of field, cozy artisanal mood. No text.";
    let op = await withRetry("start", () =>
      ai.models.generateVideos({
        model: VIDEO_MODEL,
        prompt,
        config: { numberOfVideos: 1, aspectRatio: "16:9" },
      })
    );
    while (!op.done) {
      await new Promise((r) => setTimeout(r, 12000));
      op = await withRetry("poll", () => ai.operations.getVideosOperation({ operation: op }));
      console.log("  ... still rendering");
    }
    const video = op.response?.generatedVideos?.[0]?.video;
    if (!video) {
      console.warn("  ! Veo returned no video. Skipped.");
      return;
    }
    const file = join(OUT_DIR, "hero.mp4");
    await withRetry("download", () => ai.files.download({ file: video, downloadPath: file }));
    heroVideoPath = "/generated/hero.mp4";
    console.log("  ✓ hero.mp4");
  } catch (e: any) {
    console.warn(`  ! hero video failed after retries: ${e?.message || e}`);
    console.warn("    (Images still work fine without it.)");
  }
}

function writeManifest() {
  heroPath = generatedImages["hero"] || "";
  const body = `// AUTO-GENERATED by \`npm run generate\`. Do not edit by hand.
export const generatedImages: Record<string, string> = ${JSON.stringify(generatedImages, null, 2)};
export const generatedHero: { image: string; video: string } = ${JSON.stringify(
    { image: heroPath, video: heroVideoPath },
    null,
    2
  )};
`;
  writeFileSync(resolve(process.cwd(), "lib", "assets.generated.ts"), body);
}

async function main() {
  console.log(`\nGenerating imagery for ${shop.name} with ${IMAGE_MODEL}\n`);

  console.log("Hero:");
  await genImage(
    "hero",
    "A warm, inviting Indian home kitchen still life with glass bottles of golden wood-pressed oils, wooden bowls of vibrant spice powders and blocks of jaggery with sugarcane, arranged beautifully",
    "Wide 16:9 cinematic composition"
  );

  console.log("\nCategories:");
  for (const c of categories) {
    if (c.imgPrompt) await genImage(`cat-${c.id}`, c.imgPrompt, "Square composition");
  }

  console.log("\nProducts:");
  for (const p of products) {
    if (p.imgPrompt) await genImage(p.id, p.imgPrompt, "Square composition, centered");
  }

  console.log("\nFeatures:");
  const FEATURES: { id: string; prompt: string; aspect: string }[] = [
    {
      id: "usp-natural",
      prompt:
        "Fresh whole natural ingredients arranged beautifully: green curry leaves, turmeric roots, dried red chillies, sesame seeds and a coconut, on a rustic surface, symbolising 100% pure and natural with no preservatives or chemicals",
      aspect: "Square composition",
    },
    {
      id: "footer",
      prompt:
        "A warm, moody wide banner of an Indian home kitchen shelf with glass bottles of wood-pressed oils, jars of spice powders and jaggery, soft golden light, dark rustic tones, atmospheric",
      aspect: "Wide 16:9 composition",
    },
  ];
  for (const f of FEATURES) await genImage(f.id, f.prompt, f.aspect);

  if (WITH_VIDEO) await genHeroVideo();

  writeManifest();
  console.log(
    `\nDone. Wrote ${Object.keys(generatedImages).length} image(s) to public/generated and updated lib/assets.generated.ts`
  );
  console.log("Run `npm run dev` (or redeploy) to see them.\n");
}

main();
