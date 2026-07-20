"use client";

import { useEffect, useRef, useState } from "react";

type ToastDetail = { msg: string; title?: string };

export function showToast(msg: string, title?: string) {
  window.dispatchEvent(new CustomEvent<ToastDetail>("app:toast", { detail: { msg, title } }));
}

export default function ToastHost() {
  const [detail, setDetail] = useState<ToastDetail>({ msg: "" });
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      const d = (e as CustomEvent<ToastDetail>).detail;
      setDetail(d);
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 3600);
    }
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9500] bg-charcoal border border-amber rounded-sm px-5 py-3.5 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      {detail.title && (
        <div
          className="font-mono text-amber text-[9px] mb-1"
          style={{ letterSpacing: "0.16em" }}
        >
          {detail.title}
        </div>
      )}
      <div className="font-mono text-amber text-xs" style={{ letterSpacing: "0.06em" }}>
        {detail.msg}
      </div>
    </div>
  );
}
