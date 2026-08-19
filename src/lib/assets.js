import geometry from "@/data/wordmark.json";

/**
 * Generated logo assets, resolved through the manifest that
 * `scripts/prepare-logo.mjs` writes.
 *
 * Their filenames carry a content hash of the source artwork, so nothing may
 * hard-code these paths — importing from here is what keeps a logo swap from
 * leaving stale art cached under a reused URL.
 */
export const ASSET_VERSION = geometry.version;
export const LOGO_SRC = geometry.logo;
export const OG_SRC = geometry.og;
export const FAVICON_SRC = geometry.favicon;
export const DROPCAP_SRC = geometry.dropcap;

/** The cultural figures cut out of the wordmark, keyed by name. */
export const MOTIFS = geometry.motifs;
