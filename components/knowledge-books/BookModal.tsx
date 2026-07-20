"use client";

import { useState } from "react";
import type { Book } from "@/lib/books";
import { playClick } from "@/hooks/useSound";

export default function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const current = book.pages[page];

  function turn(next: number) {
    if (next < 0 || next >= book.pages.length) return;
    playClick();
    setFlipping(true);
    setTimeout(() => {
      setPage(next);
      setFlipping(false);
    }, 180);
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9050] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[420px] bg-[#020202] border border-gunmetal rounded-md overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-4 py-3 bg-charcoal border-b border-gunmetal">
          <span className="font-mono text-[11px] text-titanium">{book.title}</span>
          <button onClick={onClose} className="font-mono text-[10px] text-titanium hover:text-offwhite">
            ✕ Close
          </button>
        </div>

        <div
          className="p-8 min-h-[220px] flex flex-col justify-center transition-all duration-200"
          style={{
            transform: flipping ? "rotateY(12deg)" : "rotateY(0deg)",
            opacity: flipping ? 0 : 1,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="font-display text-lg font-semibold text-offwhite mb-2">
            {current.title}
          </div>
          <div className="text-[#b9b9b7] text-[13.5px] leading-relaxed">{current.body}</div>
        </div>

        <div className="flex items-center justify-between px-6 pb-5">
          <button
            onClick={() => turn(page - 1)}
            disabled={page === 0}
            className="font-mono text-[10px] uppercase text-titanium hover:text-offwhite disabled:opacity-30 transition-colors"
          >
            ‹ Prev
          </button>
          <span className="font-mono text-[10px] text-titanium">
            Page {page + 1} / {book.pages.length}
          </span>
          <button
            onClick={() => turn(page + 1)}
            disabled={page === book.pages.length - 1}
            className="font-mono text-[10px] uppercase text-titanium hover:text-offwhite disabled:opacity-30 transition-colors"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
