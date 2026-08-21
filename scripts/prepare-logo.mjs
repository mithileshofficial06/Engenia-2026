/**
 * Turns the logo artwork into the assets the site uses:
 *
 *   public/logo.<v>.png            full wordmark, black background knocked out
 *   public/og.<v>.png              flat copy on black, for social previews
 *   public/favicon.<v>.png         square crop of the opening letter
 *   public/wordmark/L1..L7.<v>.png one strip per letter of E n g e n i a
 *   public/motifs/*.<v>.png        the cultural figures, cut out
 *   public/dropcap.<v>.png         the opening E on its own
 *   src/data/wordmark.json         the paths, plus geometry so the strips
 *                                  reassemble pixel-exactly
 *
 * Run after replacing the source art:  npm run prepare-logo
 *
 * Every filename carries <v>, a short content hash of the source art. Stable
 * filenames caused real trouble: swapping the logo left the URLs unchanged, so
 * the browser and Next's image optimiser both went on serving the previous
 * artwork from cache long after the files on disk had changed. Hashed names
 * make that impossible. Nothing hard-codes these paths — components read them
 * out of wordmark.json via src/lib/assets.js — and stale hashes are swept up
 * on each run.
 *
 * The art is bright paint on pure black, so the background comes off by
 * luminance: black goes transparent, and the fringe gets an alpha ramp with
 * its colour scaled back up so edges keep their hue instead of going grey.
 *
 * NOTE ON THE STRIPS: the lettering is connected brush script, so unlike a
 * blocky typeface there is no column anywhere that separates two letters —
 * every cut passes through live paint. The cut positions below were found by
 * segmenting columns on dominant hue, since the artwork paints each letter a
 * different colour.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import jpeg from "jpeg-js";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "Engenia Update Logo.jpeg");
const PUBLIC = path.join(ROOT, "public");

// Alpha ramp. Below FLOOR is background, above CEIL is untouched artwork.
// Kept well above zero because JPEG ringing lifts the black around bright edges.
const FLOOR = 22;
const CEIL = 88;

// Measured from the source art. Re-measure if the artwork changes.
const LETTERS = ["E", "n", "g", "e", "n", "i", "a"];
const CUTS = [21, 300, 455, 635, 790, 915, 1050, 1271];
const BAND = { top: 32, bottom: 710 };

function decode(file) {
  if (/\.jpe?g$/i.test(file)) {
    const { width, height, data } = jpeg.decode(fs.readFileSync(file), { useTArray: true });
    const png = new PNG({ width, height });
    png.data.set(data);
    return png;
  }
  return PNG.sync.read(fs.readFileSync(file));
}

function knockOutBlack(png) {
  const { data } = png;
  for (let i = 0; i < data.length; i += 4) {
    const m = Math.max(data[i], data[i + 1], data[i + 2]);

    if (m <= FLOOR) {
      data[i + 3] = 0;
      continue;
    }

    if (m < CEIL) {
      data[i + 3] = Math.round((255 * (m - FLOOR)) / (CEIL - FLOOR));
      const gain = 255 / m;
      data[i] = Math.min(255, Math.round(data[i] * gain));
      data[i + 1] = Math.min(255, Math.round(data[i + 1] * gain));
      data[i + 2] = Math.min(255, Math.round(data[i + 2] * gain));
    } else {
      data[i + 3] = 255;
    }
  }
  return png;
}

function crop(src, left, top, width, height) {
  const out = new PNG({ width, height });
  out.data.fill(0);
  PNG.bitblt(src, out, left, top, width, height, 0, 0);
  return out;
}

/**
 * Keeps only the ivory brushwork and drops the coloured paint around it.
 *
 * The cultural figures — the moonwalker, the theatre mask, the ballerina — are
 * painted cream and sit on top of, or right beside, a differently coloured
 * letter. Keying on saturation is what separates them, since no box can.
 */
function isolateCream(png) {
  const { data } = png;
  for (let i = 0; i < data.length; i += 4) {
    const M = Math.max(data[i], data[i + 1], data[i + 2]);
    const m = Math.min(data[i], data[i + 1], data[i + 2]);
    const sat = M ? (M - m) / M : 0;

    if (M < 115 || sat > 0.34) {
      data[i + 3] = 0;
    } else {
      data[i + 3] = Math.min(255, Math.round(((M - 115) / 70) * 255));
    }
  }
  return png;
}

/** Crops away fully transparent margins, so a generous box still cuts tight. */
function trim(png) {
  const { width, height, data } = png;
  let top = height;
  let bottom = -1;
  let left = width;
  let right = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (bottom < 0) return png;
  return crop(png, left, top, right - left + 1, bottom - top + 1);
}

/** Everything emit() wrote, for the recompression pass at the end of the run. */
const written = [];

/** Writes to public/<rel> and returns the site-root URL for it. */
function emit(rel, png) {
  const file = path.join(PUBLIC, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png));
  written.push(file);
  console.log(`  public/${rel}  ${png.width}x${png.height}`);
  return `/${rel.split(path.sep).join("/")}`;
}

/**
 * Re-encode everything emit() wrote.
 *
 * pngjs writes a correct PNG and makes no attempt at a small one — no adaptive
 * filtering, minimal deflate — which landed these files at roughly a byte per
 * pixel, near enough raw RGBA. The logo alone was 1.0 MB for 1280x745.
 *
 * This is lossless: identical pixels, competent encoding, about 75% smaller.
 * Palette quantisation would take another ~9% and is deliberately not used —
 * the artwork is a brush gradient, which is exactly what posterises worst.
 *
 * Worth doing even though next/image re-encodes to AVIF on the way out. The
 * optimiser still has to read and decode this file once per variant per cold
 * cache, and favicon.png and og.png are served raw — no next/image in front of
 * an <link rel="icon"> or an og:image fetched by a crawler.
 */
async function recompress() {
  let before = 0;
  let after = 0;

  for (const file of written) {
    before += fs.statSync(file).size;
    const buf = await sharp(file)
      .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
      .toBuffer();
    fs.writeFileSync(file, buf);
    after += buf.length;
  }

  const saved = before ? Math.round((1 - after / before) * 100) : 0;
  console.log(
    `  recompressed ${written.length} files  ` +
      `${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB  (${saved}% smaller)`,
  );
}

const version = crypto
  .createHash("sha1")
  .update(fs.readFileSync(SOURCE))
  .digest("hex")
  .slice(0, 8);

// Sweep previous hashes so public/ does not accumulate dead artwork.
fs.rmSync(path.join(PUBLIC, "wordmark"), { recursive: true, force: true });
fs.rmSync(path.join(PUBLIC, "motifs"), { recursive: true, force: true });
for (const f of fs.readdirSync(PUBLIC)) {
  if (/^(logo|og|favicon|dropcap)\.[0-9a-f]{8}\.png$/.test(f)) fs.rmSync(path.join(PUBLIC, f));
}

const flat = decode(SOURCE);
const cut = knockOutBlack(decode(SOURCE));

console.log(`source ${path.basename(SOURCE)}  ${flat.width}x${flat.height}  version ${version}`);

const og = emit(`og.${version}.png`, flat);
const logo = emit(`logo.${version}.png`, cut);

const boxW = CUTS.at(-1) - CUTS[0];
const boxH = BAND.bottom - BAND.top;
const pct = (n) => Number((n * 100).toFixed(4));

const letters = LETTERS.map((glyph, i) => {
  const left = CUTS[i];
  const width = CUTS[i + 1] - left;

  return {
    glyph,
    src: emit(path.join("wordmark", `L${i + 1}.${version}.png`), crop(cut, left, BAND.top, width, boxH)),
    // Alternating entrance: E drops from the top, n rises from the bottom,
    // and so on across the word.
    from: i % 2 === 0 ? "top" : "bottom",
    left: pct((left - CUTS[0]) / boxW),
    width: pct(width / boxW),
  };
});

// Favicon: square crop centred on the opening letter.
const side = Math.min(CUTS[1] - CUTS[0], boxH);
const favicon = emit(
  `favicon.${version}.png`,
  crop(
    cut,
    CUTS[0] + Math.round((CUTS[1] - CUTS[0] - side) / 2),
    BAND.top + Math.round((boxH - side) / 2),
    side,
    side,
  ),
);

/**
 * The cultural figures painted into the wordmark, cut out for use as artwork
 * elsewhere on the site. Boxes are deliberately generous — trim() tightens
 * them — and were found by scanning cream density across the artwork.
 *
 * The guitar keeps its colour ("paint"): its box contains nothing but guitar,
 * and isolating cream would punch holes where the splatter sits on the body.
 * The others each overlap a differently coloured letter, so they are keyed.
 */
const MOTIFS = [
  { key: "moonwalker", box: [248, 218, 406, 558], mode: "cream" },
  { key: "mask", box: [466, 232, 604, 562], mode: "cream" },
  { key: "guitar", box: [916, 32, 1056, 568], mode: "paint" },
  { key: "ballerina", box: [1052, 182, 1186, 572], mode: "cream" },
];

const motifs = {};
for (const { key, box, mode } of MOTIFS) {
  const [x0, y0, x1, y1] = box;
  const piece = crop(cut, x0, y0, x1 - x0, y1 - y0);
  motifs[key] = emit(
    path.join("motifs", `${key}.${version}.png`),
    trim(mode === "cream" ? isolateCream(piece) : piece),
  );
}

// Drop cap for the About paragraph: the opening E on its own, without the
// moonwalker that leans against it.
const dropcap = emit(`dropcap.${version}.png`, trim(crop(cut, 21, 60, 231, 520)));

const geometry = {
  aspect: Number((boxW / boxH).toFixed(4)),
  version,
  logo,
  og,
  favicon,
  dropcap,
  motifs,
  letters,
};

const target = path.join(ROOT, "src/data/wordmark.json");
fs.writeFileSync(target, `${JSON.stringify(geometry, null, 2)}\n`);
console.log(`  src/data/wordmark.json  aspect ${geometry.aspect}`);

// Last, so the manifest is already correct if this is interrupted — the paths
// do not change, only the bytes behind them.
await recompress();
