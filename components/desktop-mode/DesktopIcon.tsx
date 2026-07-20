"use client";

export default function DesktopIcon({
  label,
  glyph,
  onOpen,
}: {
  label: string;
  glyph: string;
  onOpen: () => void;
}) {
  return (
    <button
      onDoubleClick={onOpen}
      className="flex flex-col items-center gap-2 w-[84px] group"
      title={`Double-click to open ${label}`}
    >
      <div className="w-14 h-14 rounded-sm border border-gunmetal bg-charcoal flex items-center justify-center font-display text-lg font-semibold text-titanium group-hover:border-blue group-hover:text-blue transition-colors">
        {glyph}
      </div>
      <span className="font-mono text-[10px] text-titanium group-hover:text-offwhite transition-colors text-center">
        {label}
      </span>
    </button>
  );
}
