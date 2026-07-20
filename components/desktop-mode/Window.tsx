"use client";

import { useDesktopMode, type DesktopWindow } from "@/context/DesktopModeContext";
import { useDraggable } from "@/hooks/useDraggable";
import WindowContent from "./WindowContent";

export default function Window({ win }: { win: DesktopWindow }) {
  const { closeWindow, focusWindow, updateWindow, toggleMinimize, toggleMaximize } =
    useDesktopMode();

  const dragBar = useDraggable((dx, dy) => {
    if (win.maximized) return;
    updateWindow(win.id, { x: win.x + dx, y: win.y + dy });
  });
  const dragResize = useDraggable((dx, dy) => {
    if (win.maximized) return;
    updateWindow(win.id, {
      w: Math.max(260, win.w + dx),
      h: Math.max(180, win.h + dy),
    });
  });

  if (win.minimized) return null;

  const style = win.maximized
    ? { left: 24, top: 24, right: 24, bottom: 24, width: "auto", height: "auto", zIndex: 7100 + win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: 7100 + win.z };

  return (
    <div
      className="fixed bg-[#020202] border border-gunmetal rounded-md overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] flex flex-col"
      style={style}
      onPointerDown={() => focusWindow(win.id)}
    >
      <div
        className="flex items-center justify-between px-3.5 py-2.5 bg-charcoal border-b border-gunmetal cursor-move select-none flex-shrink-0"
        onPointerDown={dragBar.onPointerDown}
        onPointerMove={dragBar.onPointerMove}
        onPointerUp={dragBar.onPointerUp}
      >
        <span className="font-mono text-[11px] text-titanium">{win.title}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleMinimize(win.id)}
            title="Minimize"
            className="w-2.5 h-2.5 rounded-full bg-[#4a3d1a] hover:bg-amber transition-colors"
          />
          <button
            onClick={() => toggleMaximize(win.id)}
            title="Maximize"
            className="w-2.5 h-2.5 rounded-full bg-[#1a3a22] hover:bg-[#3fff6b] transition-colors"
          />
          <button
            onClick={() => closeWindow(win.id)}
            title="Close"
            className="w-2.5 h-2.5 rounded-full bg-[#4a2020] hover:bg-red-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <WindowContent kind={win.kind} />
      </div>

      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onPointerDown={dragResize.onPointerDown}
          onPointerMove={dragResize.onPointerMove}
          onPointerUp={dragResize.onPointerUp}
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(90,90,90,0.6) 50%)",
          }}
        />
      )}
    </div>
  );
}
