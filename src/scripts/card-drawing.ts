// Press and hold on the business card to draw on it. A quick click or tap still flips
// the card; a hold (or, with a mouse, a press-and-drag) draws instead and does not flip.
// Ink uses the logo color (--accent) and is re-colored when the theme changes.
// Each face keeps its own drawing, stored as points relative to the card's size.

type Point = { x: number; y: number };
type Stroke = Point[];

type Hooks = {
  activeFace: () => HTMLElement; // the face currently facing the viewer
  onPress: () => void; // pointer went down; pause tilt
  onDrawStart: () => void; // a hold became a drawing; flatten the card
  onRelease: () => void; // pointer is done (drew or not); resume tilt
};

const HOLD_MS = 250; // how long a press must last to start drawing
const MOUSE_DRAG_PX = 6; // with a mouse, dragging this far starts drawing right away
const TOUCH_SCROLL_PX = 10; // with a finger, moving this far before the hold means scrolling

export function setupCardDrawing(card: HTMLElement, clearBtn: HTMLButtonElement, hooks: Hooks) {
  const root = document.documentElement;
  const faces = [...card.querySelectorAll<HTMLElement>(".face")];
  const strokes = new Map<HTMLElement, Stroke[]>(faces.map((f) => [f, []]));
  const canvases = new Map<HTMLElement, HTMLCanvasElement>();

  // One canvas per face, under the glare so the sheen still plays over the ink
  for (const face of faces) {
    const canvas = document.createElement("canvas");
    canvas.className = "ink";
    canvas.setAttribute("aria-hidden", "true");
    face.insertBefore(canvas, face.querySelector(".glare"));
    canvases.set(face, canvas);
  }

  let press: { id: number; type: string; x: number; y: number; timer: number } | null = null;
  let drawing: { face: HTMLElement; stroke: Stroke; rect: DOMRect } | null = null;
  let suppressClick = false;
  let frame = 0;

  const ink = () => getComputedStyle(root).getPropertyValue("--accent").trim() || "#fff";

  function redraw(face: HTMLElement) {
    const canvas = canvases.get(face)!;
    const ctx = canvas.getContext("2d")!;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = ctx.fillStyle = ink();
    ctx.lineWidth = Math.max(2, w * 0.009);
    ctx.lineCap = ctx.lineJoin = "round";
    for (const s of strokes.get(face)!) {
      if (s.length === 1) {
        ctx.beginPath();
        ctx.arc(s[0].x * w, s[0].y * h, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      // Smooth line: curve through the midpoints between samples
      ctx.beginPath();
      ctx.moveTo(s[0].x * w, s[0].y * h);
      for (let i = 1; i < s.length - 1; i++) {
        const mx = ((s[i].x + s[i + 1].x) / 2) * w;
        const my = ((s[i].y + s[i + 1].y) / 2) * h;
        ctx.quadraticCurveTo(s[i].x * w, s[i].y * h, mx, my);
      }
      const end = s[s.length - 1];
      ctx.lineTo(end.x * w, end.y * h);
      ctx.stroke();
    }
  }

  function redrawSoon(face: HTMLElement) {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      redraw(face);
    });
  }

  // Match each canvas to its face's size at the screen's pixel density
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const [face, canvas] of canvases) {
      canvas.width = Math.round(face.offsetWidth * dpr);
      canvas.height = Math.round(face.offsetHeight * dpr);
      redraw(face);
    }
  }
  resize();
  new ResizeObserver(resize).observe(card);

  // Re-color existing ink when the theme changes
  new MutationObserver(() => faces.forEach(redraw)).observe(root, { attributeFilter: ["data-theme"] });

  function pointAt(e: PointerEvent): Point {
    const r = drawing!.rect;
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  }

  function updateClearButton() {
    clearBtn.hidden = ![...strokes.values()].some((s) => s.length);
  }

  function startDrawing(e: PointerEvent) {
    if (!press) return;
    clearTimeout(press.timer);
    hooks.onDrawStart(); // card is flat from here, so its box matches what you see
    const face = hooks.activeFace();
    const stroke: Stroke = [];
    strokes.get(face)!.push(stroke);
    drawing = { face, stroke, rect: face.getBoundingClientRect() };
    card.classList.add("drawing");
    try { card.setPointerCapture(press.id); } catch {}
    if (press.type === "touch") navigator.vibrate?.(8);
    stroke.push(pointAt(e));
    redrawSoon(face);
    updateClearButton();
  }

  function endPress() {
    if (press) clearTimeout(press.timer);
    if (drawing) {
      suppressClick = true; // the click that follows pointerup must not flip the card
      card.classList.remove("drawing");
      drawing = null;
    }
    if (press) hooks.onRelease();
    press = null;
  }

  card.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || press) return;
    if ((e.target as Element).closest("a")) return; // links on the back stay clickable
    suppressClick = false;
    const down = e;
    press = {
      id: e.pointerId,
      type: e.pointerType,
      x: e.clientX,
      y: e.clientY,
      timer: window.setTimeout(() => startDrawing(down), HOLD_MS),
    };
    hooks.onPress();
  });

  card.addEventListener("pointermove", (e) => {
    if (!press || e.pointerId !== press.id) return;
    if (!drawing) {
      const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y);
      if (press.type === "touch") {
        if (moved > TOUCH_SCROLL_PX) endPress(); // finger moved first: it's a scroll
      } else if (moved > MOUSE_DRAG_PX) {
        startDrawing(e);
      }
      return;
    }
    const events = e.getCoalescedEvents?.() ?? [e];
    for (const ev of events.length ? events : [e]) drawing.stroke.push(pointAt(ev));
    redrawSoon(drawing.face);
  });

  card.addEventListener("pointerup", endPress);
  card.addEventListener("pointercancel", endPress);

  // While drawing with a finger, stop the page from scrolling
  card.addEventListener("touchmove", (e) => {
    if (drawing) e.preventDefault();
  }, { passive: false });

  // No long-press menus or text selection while holding
  card.addEventListener("contextmenu", (e) => {
    if (press || drawing) e.preventDefault();
  });

  clearBtn.addEventListener("click", () => {
    for (const face of faces) {
      strokes.set(face, []);
      redraw(face);
    }
    updateClearButton();
  });

  updateClearButton();

  return {
    // True once, right after a drawing ends, so the card's click handler can skip the flip
    takeSuppressedClick() {
      const s = suppressClick;
      suppressClick = false;
      return s;
    },
  };
}
