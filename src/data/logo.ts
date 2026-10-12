// The "D </>" mark as vector paths. One color: the holes let the background show through,
// so it takes any theme color. Used by the nav, the business card, and the favicon.
// After changing a path, run `npm run images` to redraw the favicon and link preview.

export const logoViewBox = "318 314 672 672";

export const logoPaths = [
  // Outer D: square left corners, straight diagonals on the right, and a rounded nose at
  // the rightmost point. The inner cut-out (a hole, via fill-rule="evenodd") has matching
  // notches at the top-left and bottom-left.
  "M325 318H716L960 590C988 621 988 729 960 760L737 982H323Z M443 463H697L882 672L697 878H400L490 788L340 673L519 536Z",
  // <
  "M552 580V640L513 673L541 699L522 745L432 672Z",
  // /
  "M643 527H699L577 831H519Z",
  // >
  "M719 581L833 671L719 760V700L755 672L719 644Z",
];

// Standalone SVG string, e.g. for the favicon. Tile and mark colors are passed in.
export function logoSvg(tile: string, mark: string): string {
  const paths = logoPaths.map((d) => `<path d="${d}"/>`).join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${tile}"/>` +
    `<svg x="10" y="10" width="44" height="44" viewBox="${logoViewBox}">` +
    `<g fill="${mark}" fill-rule="evenodd">${paths}</g></svg></svg>`
  );
}
