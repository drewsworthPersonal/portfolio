// Theme list for the picker. Colors themselves live in src/styles/themes.css.
// To drop a theme, remove it here and its block in themes.css.

export type Theme = {
  id: string;
  name: string;
  note: string;
  scheme: "dark" | "light";
  swatch: [string, string, string]; // background, surface, accent
};

export const themes: Theme[] = [
  { id: "plum", name: "Plum", note: "Dark purple", scheme: "dark", swatch: ["#140d1f", "#22173a", "#c39bff"] },
  { id: "forest", name: "Forest", note: "Dark green", scheme: "dark", swatch: ["#0e1712", "#17271e", "#8fd4a8"] },
  { id: "linen", name: "Linen", note: "Soft off-white", scheme: "light", swatch: ["#f3efe8", "#fbf9f5", "#7a6a55"] },
  { id: "graphite", name: "Graphite", note: "Black and grey contrast", scheme: "dark", swatch: ["#0a0a0a", "#171717", "#ffffff"] },
  { id: "sky", name: "Sky", note: "White and light blue", scheme: "light", swatch: ["#ffffff", "#eef6ff", "#0b84d8"] },
  { id: "terminal", name: "Terminal", note: "Green on black", scheme: "dark", swatch: ["#060a08", "#0c1410", "#39e58c"] },
  { id: "paper", name: "Paper", note: "Ink on warm paper", scheme: "light", swatch: ["#f5efe2", "#fffcf5", "#b3261e"] },
  { id: "midnight", name: "Midnight", note: "Navy, violet, pink", scheme: "dark", swatch: ["#0a0f25", "#141c40", "#f08bd0"] },
  { id: "ember", name: "Ember", note: "Charcoal and orange", scheme: "dark", swatch: ["#262626", "#303030", "#ff8a3d"] },
];

export const defaultDark = "plum";
export const defaultLight = "linen";
