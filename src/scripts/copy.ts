// Links with data-copy copy their value instead of navigating, then show a short toast.
// If copying fails, the click falls through to the link's href (e.g. mailto:).

let toast: HTMLElement | null = null;
let hideTimer = 0;

function showToast(message: string) {
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => toast?.classList.remove("show"), 1800);
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers or non-secure pages
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

document.addEventListener("click", async (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>("a[data-copy]");
  if (!link) return;
  e.preventDefault();
  const text = link.dataset.copy!;
  if (await copy(text)) showToast(`Copied ${text}`);
  else window.location.href = link.href;
});
