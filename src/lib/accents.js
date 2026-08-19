/**
 * The logo paints every letter a different colour. Sections borrow that idea:
 * each one adopts a single hue, which drives its eyebrow, brush rule, card
 * hairlines and ambient glow through the `--accent` custom properties.
 *
 * Spread through the page in the same order the letters run, warm to cool
 * and back, so scrolling walks the length of the wordmark.
 */
export const ACCENTS = {
  ember: {
    hex: "#f47115",
    rgb: "244 113 21",
    name: "ember",
    // Three colours the page background drifts to while this section is in
    // view. The accent leads, with two neighbours from the logo behind it so
    // the backdrop never flattens to a single hue.
    ambient: ["rgb(244 113 21 / .30)", "rgb(235 149 18 / .26)", "rgb(211 19 62 / .22)"],
  },
  azure: {
    hex: "#077faf",
    rgb: "7 127 175",
    name: "azure",
    ambient: ["rgb(7 127 175 / .32)", "rgb(5 187 174 / .24)", "rgb(235 149 18 / .16)"],
  },
  jade: {
    hex: "#05bbae",
    rgb: "5 187 174",
    name: "jade",
    ambient: ["rgb(5 187 174 / .28)", "rgb(7 127 175 / .26)", "rgb(235 149 18 / .18)"],
  },
  crimson: {
    hex: "#d3133e",
    rgb: "211 19 62",
    name: "crimson",
    ambient: ["rgb(211 19 62 / .30)", "rgb(212 19 80 / .24)", "rgb(244 113 21 / .22)"],
  },
  gold: {
    hex: "#eb9512",
    rgb: "235 149 18",
    name: "gold",
    ambient: ["rgb(235 149 18 / .30)", "rgb(244 113 21 / .26)", "rgb(7 127 175 / .16)"],
  },
};

export const DEFAULT_ACCENT = "ember";

/** Spread onto a card or any element that should carry an accent. */
export function accentVars(accent) {
  return { "--accent": accent.hex, "--accent-rgb": accent.rgb };
}

/**
 * Spread onto a *section* element: `<section {...sectionAccent("azure")}>`.
 *
 * Returns the style object plus the marker the ambient background watches, so
 * the page glow follows whatever section you are currently reading.
 */
export function sectionAccent(key) {
  return { style: accentVars(ACCENTS[key]), "data-accent": key };
}
