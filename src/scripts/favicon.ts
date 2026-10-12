// Redraws the browser-tab icon and the mobile browser bar color from the active theme.
import { logoSvg } from "../data/logo";

export function syncThemeChrome() {
  const css = getComputedStyle(document.documentElement);
  const tile = css.getPropertyValue("--surface-2").trim();
  const mark = css.getPropertyValue("--accent").trim();
  const bg = css.getPropertyValue("--bg").trim();
  if (!tile || !mark) return;

  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon) icon.href = `data:image/svg+xml,${encodeURIComponent(logoSvg(tile, mark))}`;

  const bar = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (bar && bg) bar.content = bg;
}
