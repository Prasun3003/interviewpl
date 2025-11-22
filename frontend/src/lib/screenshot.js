import html2canvas from "html2canvas";

// Remove OKLCH colors for html2canvas compatibility
function scrubOKLCHColors(root) {
  const allNodes = root.querySelectorAll("*");

  allNodes.forEach((node) => {
    const style = window.getComputedStyle(node);

    // Fix background-color
    const bg = style.backgroundColor;
    if (bg && bg.includes("oklch")) {
      node.style.setProperty("background-color", "#1e1e1e", "important");
    }

    // Fix text color
    const color = style.color;
    if (color && color.includes("oklch")) {
      node.style.setProperty("color", "#ffffff", "important");
    }

    // Fix border colors
    const border = style.borderColor;
    if (border && border.includes("oklch")) {
      node.style.setProperty("border-color", "#444444", "important");
    }
  });
}

export async function captureElementScreenshot(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn("No element found for screenshot:", id);
    return null;
  }

  // Remove Monaco/minimap canvases entirely
  const canvases = el.querySelectorAll("canvas");
  canvases.forEach((c) => c.remove());

  const badNodes = el.querySelectorAll(
    ".minimap, .monaco-minimap, .minimap-decoration-layer"
  );
  badNodes.forEach((n) => n.remove());

  // 🔥 Fix DaisyUI OKLCH colors BEFORE rendering
  scrubOKLCHColors(el);

  try {
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      scale: 1,
      logging: false,
    });

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Screenshot failed:", err);
    return null;
  }
}
