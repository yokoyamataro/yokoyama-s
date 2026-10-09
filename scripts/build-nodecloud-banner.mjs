import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.resolve(__dirname, "..", "public", "img");

const ICON_SRC = path.join(imgDir, "02-7_nodecloud_icon.png");
const OUT = path.join(imgDir, "02-7_nodecloud.png");

const W = 2084;
const H = 834;
const LEFT_W = H;
const RIGHT_W = W - LEFT_W;

const NAVY = { r: 29, g: 45, b: 61 };
const IVORY = { r: 248, g: 246, b: 244 };

const iconScale = 0.72;
const iconSize = Math.round(H * iconScale);
const iconOffset = Math.round((H - iconSize) / 2);

const iconLeft = await sharp(ICON_SRC)
  .resize(iconSize, iconSize, { fit: "contain", background: NAVY })
  .toBuffer();

const leftBlock = await sharp({
  create: {
    width: LEFT_W,
    height: H,
    channels: 3,
    background: NAVY,
  },
})
  .composite([{ input: iconLeft, left: iconOffset, top: iconOffset }])
  .png()
  .toBuffer();

const textSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${RIGHT_W}" height="${H}">
  <rect width="100%" height="100%" fill="rgb(${IVORY.r},${IVORY.g},${IVORY.b})"/>
  <text
    x="50%" y="50%"
    text-anchor="middle" dominant-baseline="central"
    font-family="'Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic UI','Meiryo',sans-serif"
    font-weight="800" font-size="200" fill="rgb(50,50,50)"
    letter-spacing="2">NodeCloud</text>
</svg>`;

const rightBlock = await sharp(Buffer.from(textSvg)).png().toBuffer();

await sharp({
  create: { width: W, height: H, channels: 3, background: IVORY },
})
  .composite([
    { input: leftBlock, left: 0, top: 0 },
    { input: rightBlock, left: LEFT_W, top: 0 },
  ])
  .png()
  .toFile(OUT);

console.log(`built: ${path.basename(OUT)} (${W}x${H})`);
