import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.resolve(__dirname, "..", "public", "img");
const publicDir = path.resolve(__dirname, "..", "public");

const LOGO = path.join(imgDir, "03-1_yokoyama_survey-3_mark.png");
const OG = path.join(publicDir, "og-image.png");
const APPLE = path.join(publicDir, "apple-touch-icon.png");
const FAVICON512 = path.join(publicDir, "icon-512.png");
const FAVICON192 = path.join(publicDir, "icon-192.png");

// 1200x630 OG image
const W = 1200;
const H = 630;
const BG = { r: 238, g: 244, b: 251 };

const logoSize = 300;
const logoBuf = await sharp(LOGO)
  .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eef4fb"/>
      <stop offset="1" stop-color="#cfe0f3"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="0" y="${H - 8}" width="100%" height="8" fill="#1a3a5c"/>

  <text x="580" y="200" fill="#4a90e2" font-family="'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif"
    font-size="26" font-weight="500" letter-spacing="10">北海道斜里町</text>

  <text x="580" y="300" fill="#0f1f3d" font-family="'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif"
    font-size="68" font-weight="700" letter-spacing="4">よこやまグループ</text>

  <text x="580" y="380" fill="#1a3a5c" font-family="'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif"
    font-size="28" font-weight="500">測量設計・土地家屋調査士</text>
  <text x="580" y="420" fill="#1a3a5c" font-family="'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif"
    font-size="28" font-weight="500">司法書士・行政書士</text>

  <text x="580" y="520" fill="#4a5a73" font-family="'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif"
    font-size="24" font-weight="400">測量・登記・農地の手続きはおまかせください</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: logoBuf, left: 170, top: 165 }])
  .png()
  .toFile(OG);
console.log(`built: og-image.png (${W}x${H})`);

// 180x180 Apple touch icon (logo on cream square)
const appleSize = 180;
const appleLogo = await sharp(LOGO)
  .resize(140, 140, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp({
  create: { width: appleSize, height: appleSize, channels: 3, background: { r: 238, g: 244, b: 251 } },
})
  .composite([{ input: appleLogo, left: 20, top: 20 }])
  .png()
  .toFile(APPLE);
console.log(`built: apple-touch-icon.png (${appleSize}x${appleSize})`);

// 512x512 and 192x192 PWA icons (same style)
for (const [out, size] of [[FAVICON512, 512], [FAVICON192, 192]]) {
  const inner = Math.round(size * 0.78);
  const pad = Math.round((size - inner) / 2);
  const l = await sharp(LOGO)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 3, background: { r: 238, g: 244, b: 251 } },
  })
    .composite([{ input: l, left: pad, top: pad }])
    .png()
    .toFile(out);
  console.log(`built: ${path.basename(out)} (${size}x${size})`);
}
