/**
 * Turns the college crest into the asset the navbar uses:
 *
 *   public/licet.<v>.png     the crest, white background knocked out
 *   src/data/college.json    the path and the intrinsic size
 *
 * Run after replacing the source art:  npm run prepare-college-logo
 *
 * Same hashed-filename rule as the wordmark (see prepare-logo.mjs): the name
 * carries a content hash of the source, nothing hard-codes the path, and old
 * hashes are swept on each run, so swapping the crest can never leave a
 * browser serving the previous one out of cache.
 *
 * The knockout is a flood fill from the border rather than a white key. The
 * crest is a ring around a pale field, and half of what is inside it is as
 * white as the paper it was cut from — keying on whiteness punched the middle
 * out along with the background. Filling inward from the edges only reaches
 * what is actually outside the ring.
 *
 * The fill is also fenced at the ring's outer radius, because at this size the
 * ring is not watertight: its outline is one antialiased pixel in places, and
 * the fill found a gap and drained the field behind it. That emptied field
 * looked fine until you read it — the arc text and the LICET line are dark
 * blue, and with the paper gone they were dark blue on near-black.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "LICET Logo.png");
const PUBLIC = path.join(ROOT, "public");
const MANIFEST = path.join(ROOT, "src", "data", "college.json");

// Paper: anything this bright, reachable from the border, is background.
const PAPER = 246;
// Fringe: the antialiased pixels along the ring, which are paper blended with
// ink. Below this they are treated as artwork and left alone.
const FRINGE = 176;

/**
 * Clears the background and feathers the edge it leaves behind.
 *
 * A hard fill alone leaves a one-pixel white halo: the ring's outermost
 * pixels are part paper, and at this size that halo reads as a bright wire
 * around the crest on a near-black bar. So the pixels touching the cleared
 * region get an alpha from how much ink is in them, and their colour is
 * un-blended from the paper it was mixed with — otherwise a half-transparent
 * pixel keeps the pale tint it only had because of the background.
 */
function knockOutPaper(png) {
  const { width, height, data } = png;
  const ink = (i) => Math.min(data[i], data[i + 1], data[i + 2]);

  // The fence: the furthest any solid ink sits from the middle of the art.
  // Everything the background can legitimately occupy is outside that.
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  let outer = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (ink((y * width + x) * 4) >= FRINGE) continue;
      const r = Math.hypot(x - cx, y - cy);
      if (r > outer) outer = r;
    }
  }

  const outside = (p) => {
    const x = p % width;
    const y = (p - x) / width;
    return Math.hypot(x - cx, y - cy) >= outer;
  };

  const cleared = new Uint8Array(width * height);
  const stack = [];

  for (let x = 0; x < width; x += 1) {
    stack.push(x, x + (height - 1) * width);
  }
  for (let y = 0; y < height; y += 1) {
    stack.push(y * width, y * width + width - 1);
  }

  while (stack.length) {
    const p = stack.pop();
    if (cleared[p]) continue;
    if (ink(p * 4) < PAPER) continue;
    if (!outside(p)) continue;

    cleared[p] = 1;
    data[p * 4 + 3] = 0;

    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }

  // Two passes, because the blur on the source art is wider than one pixel.
  for (let pass = 0; pass < 2; pass += 1) {
    const edge = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = y * width + x;
        if (cleared[p]) continue;

        const touches =
          (x > 0 && cleared[p - 1]) ||
          (x < width - 1 && cleared[p + 1]) ||
          (y > 0 && cleared[p - width]) ||
          (y < height - 1 && cleared[p + width]);
        if (!touches) continue;

        const m = ink(p * 4);
        if (m < FRINGE) continue;
        if (!outside(p)) continue;
        edge.push(p);
      }
    }

    for (const p of edge) {
      const i = p * 4;
      const a = (PAPER - ink(i)) / (PAPER - FRINGE);

      if (a <= 0.02) {
        cleared[p] = 1;
        data[i + 3] = 0;
        continue;
      }

      data[i + 3] = Math.round(a * 255);
      for (let c = 0; c < 3; c += 1) {
        const un = (data[i + c] - (1 - a) * 255) / a;
        data[i + c] = Math.max(0, Math.min(255, Math.round(un)));
      }
    }
  }

  return png;
}

const source = fs.readFileSync(SOURCE);
const version = crypto.createHash("sha1").update(source).digest("hex").slice(0, 8);

for (const f of fs.readdirSync(PUBLIC)) {
  if (/^licet\.[0-9a-f]{8}\.png$/.test(f)) fs.rmSync(path.join(PUBLIC, f));
}

const crest = knockOutPaper(PNG.sync.read(source));
const rel = `licet.${version}.png`;
fs.writeFileSync(path.join(PUBLIC, rel), PNG.sync.write(crest));

const manifest = {
  version,
  src: `/${rel}`,
  width: crest.width,
  height: crest.height,
};
fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`source ${path.basename(SOURCE)}  ${crest.width}x${crest.height}  version ${version}`);
console.log(`  public/${rel}`);
console.log(`  src/data/college.json`);
