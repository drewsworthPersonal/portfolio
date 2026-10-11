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
  { id: "graphite", name: "Graphite", note: "Black and grey contrast", scheme: "dark", swatch: ["#0a0a0a", "#171717", "#ffffff"] },
  { id: "sky", name: "Sky", note: "White and light blue", scheme: "light", swatch: ["#ffffff", "#eef6ff", "#0b84d8"] },
  { id: "terminal", name: "Terminal", note: "Green on black", scheme: "dark", swatch: ["#060a08", "#0c1410", "#39e58c"] },
  { id: "paper", name: "Paper", note: "Ink on warm paper", scheme: "light", swatch: ["#f5efe2", "#fffcf5", "#b3261e"] },
  { id: "midnight", name: "Midnight", note: "Navy, violet, pink", scheme: "dark", swatch: ["#0a0f25", "#141c40", "#f08bd0"] },
];

// Until a visitor picks a theme, the site follows their device's light or dark setting
export const defaultDark = "graphite";
export const defaultLight = "sky";
