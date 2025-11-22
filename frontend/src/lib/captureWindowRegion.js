// capture a portion of the visible window using screen capture API
export async function captureRegion({ x, y, width, height }) {
  try {
    // ask user for "screen share" once
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: false,
    });

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    const bitmap = await imageCapture.grabFrame();

    // draw selected region into a canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      bitmap,
      x, y, width, height,    // crop area from screen
      0, 0, width, height     // draw into canvas
    );

    track.stop(); // stop the screen share permission

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Region capture failed:", err);
    return null;
  }
}
