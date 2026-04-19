import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "..", "assets", "images");
const INDIGO = "#6366F1";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

// ── HOMii logo mark: stylised "ii" — U-shape + dot ──────────────────────
// Traced from the actual brand logo the user provided.

function logoMarkSvg({ size, color, bgColor, bgRx }) {
  const bg = bgColor
    ? `<rect width="1024" height="1024" rx="${bgRx ?? 220}" fill="${bgColor}"/>`
    : "";
  // U-shape open path + dot
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  ${bg}
  <!-- U-shape -->
  <path d="M 320 280 L 320 640 Q 320 760 440 760 L 584 760 Q 704 760 704 640 L 704 400"
        stroke="${color}" stroke-width="72" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- dot above right bar -->
  <circle cx="704" cy="260" r="42" fill="${color}"/>
</svg>`;
}

// ── Splash icon: logo mark + "HOMii" text ────────────────────────────────

function splashSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- U-shape -->
  <path d="M 155 130 L 155 310 Q 155 370 215 370 L 297 370 Q 357 370 357 310 L 357 190"
        stroke="${WHITE}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- dot -->
  <circle cx="357" cy="120" r="21" fill="${WHITE}"/>
  <!-- HOMii text -->
  <text x="256" y="450" text-anchor="middle"
        font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="56"
        fill="${WHITE}" letter-spacing="3">HOMii</text>
</svg>`;
}

async function generate(filename, size, svg) {
  const outPath = path.join(ASSETS, filename);
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`  ✓ ${filename} (${size}×${size})`);
}

console.log("Generating HOMii brand assets...\n");

await Promise.all([
  // App icon — indigo bg + white logo mark (1024×1024)
  generate("icon.png", 1024, logoMarkSvg({ size: 1024, color: WHITE, bgColor: INDIGO, bgRx: 220 })),

  // Splash icon — white logo mark + text on transparent (indigo bg comes from app.json)
  generate("splash-icon.png", 512, splashSvg(512)),

  // Android adaptive icon foreground — white mark on transparent (432×432)
  generate("android-icon-foreground.png", 432, logoMarkSvg({ size: 432, color: WHITE, bgColor: null })),

  // Android adaptive icon background — solid indigo (432×432)
  generate("android-icon-background.png", 432,
    `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432"><rect width="432" height="432" fill="${INDIGO}"/></svg>`
  ),

  // Android monochrome — black mark on transparent (432×432)
  generate("android-icon-monochrome.png", 432, logoMarkSvg({ size: 432, color: BLACK, bgColor: null })),

  // Favicon — indigo bg + white mark (48×48)
  generate("favicon.png", 48, logoMarkSvg({ size: 48, color: WHITE, bgColor: INDIGO, bgRx: 10 })),
]);

console.log("\nDone! All brand assets generated.");
