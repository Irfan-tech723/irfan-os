"use client";

import { useState } from "react";
import { BOOKS } from "@/lib/books";
import BookModal from "./BookModal";

export default function BookShelf() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openBook = BOOKS.find((b) => b.id === openId) || null;

  return (
    <div>
      <div
        className="font-mono text-[11px] text-titanium uppercase mb-3.5"
        style={{ letterSpacing: "0.14em" }}
      >
        Field Notes
      </div>
      <div className="flex gap-2">
        {BOOKS.map((book) => (
          <button
            key={book.id}
            onClick={() => setOpenId(book.id)}
            title={book.title}
            className="w-9 h-32 bg-charcoal border border-gunmetal rounded-sm hover:border-blue hover:-translate-y-1 transition-all flex items-center justify-center"
          >
            <span
              className="font-mono text-[9px] text-titanium uppercase"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.1em" }}
            >
              {book.title}
            </span>
          </button>
        ))}
      </div>
      {openBook && <BookModal book={openBook} onClose={() => setOpenId(null)} />}
    </div>
  );
}
