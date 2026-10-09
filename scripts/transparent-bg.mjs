import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.resolve(__dirname, "..", "public", "img");

const BG = { r: 248, g: 246, b: 244 };
const FULL_TRANSPARENT_DIST = 10;
const PARTIAL_FADE_DIST = 40;

const files = [
  "03-1_yokoyama_survey-3_mark.png",
  "03-2_locos_mark.png",
  "03-3_shihoushoshi_mark.png",
  "03-4_gyouseishoshi_mark.png",
];

for (const f of files) {
  const src = path.join(imgDir, f);
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const dr = Math.abs(out[i] - BG.r);
    const dg = Math.abs(out[i + 1] - BG.g);
    const db = Math.abs(out[i + 2] - BG.b);
    const dist = Math.max(dr, dg, db);
    if (dist <= FULL_TRANSPARENT_DIST) {
      out[i + 3] = 0;
    } else if (dist < PARTIAL_FADE_DIST) {
      const t = (dist - FULL_TRANSPARENT_DIST) /
        (PARTIAL_FADE_DIST - FULL_TRANSPARENT_DIST);
      out[i + 3] = Math.round(out[i + 3] * t);
    }
  }

  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(src);

  console.log(`transparent bg: ${f}`);
}
