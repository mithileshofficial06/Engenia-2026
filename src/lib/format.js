export function formatDate(value, opts = {}) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

export const MEDALS = {
  1: { label: "1st", ring: "ring-gold-500/55", text: "text-gold-400", glow: "rgba(235,149,18,.4)" },
  2: { label: "2nd", ring: "ring-cream-300/30", text: "text-cream-300", glow: "rgba(232,216,187,.2)" },
  3: { label: "3rd", ring: "ring-ember-500/50", text: "text-ember-400", glow: "rgba(244,113,21,.32)" },
};
