// Fades sections in once as they enter the viewport. No scroll listeners, no scroll hijacking.
const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

// Browsers with scroll-driven animations run the reveal in CSS (see global.css).
const cssReveal = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
if (cssReveal) document.documentElement.classList.add("css-reveal");

if (cssReveal || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
  items.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}
