// @ts-nocheck
/**
 * Generic animation helper.
 * @param {Object} options
 * @param {number} options.duration - Duration in ms.
 * @param {(t: number) => number} [options.easing] - Easing function (default: easeInOutQuad).
 * @param {(t: number) => void} options.onUpdate - Called with t in [0,1] on each frame.
 * @param {() => void} [options.onDone] - Called when animation completes.
 */
export function animate({ duration, easing, onUpdate, onDone }) {
  const startTime = performance.now();
  const ease = easing || function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  function frame(now) {
    const elapsed = now - startTime;
    let t = Math.min(elapsed / duration, 1);
    t = ease(t);
    onUpdate(t);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else if (onDone) {
      onDone();
    }
  }
  requestAnimationFrame(frame);
}