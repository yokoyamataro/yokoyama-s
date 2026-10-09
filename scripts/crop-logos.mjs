import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.resolve(__dirname, "..", "public", "img");

const SIZE = 1667;
const CROP_SIZE = 560;
const CROP_X = Math.round((SIZE - CROP_SIZE) / 2);
const CROP_Y = 105;

const files = [
  "03-1_yokoyama_survey-3.png",
  "03-2_locos.png",
  "03-3_shihoushoshi.png",
  "03-4_gyouseishoshi.png",
];

for (const f of files) {
  const src = path.join(imgDir, f);
  const dst = path.join(imgDir, f.replace(/\.png$/, "_mark.png"));
  await sharp(src)
    .extract({ left: CROP_X, top: CROP_Y, width: CROP_SIZE, height: CROP_SIZE })
    .toFile(dst);
  console.log(`cropped ${f} -> ${path.basename(dst)}`);
}
