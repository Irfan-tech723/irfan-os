"use client";

import { useRef, type PointerEvent } from "react";

// Generic pointer-drag helper. Pass a callback that receives the frame-to-frame
// delta; used for both moving a window (dx,dy -> x,y) and resizing one
// (dx,dy -> w,h) by the caller choosing what to do with the delta.
export function useDraggable(onDrag: (dx: number, dy: number) => void) {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  function onPointerDown(e: PointerEvent) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    onDrag(dx, dy);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  return { onPointerDown, onPointerMove, onPointerUp };
}
