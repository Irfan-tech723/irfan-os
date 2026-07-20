"use client";

import { useEffect, useState } from "react";
import { dockItems } from "@/lib/data";
import { playClick } from "@/hooks/useSound";

export default function ConsoleDock() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    function handleScroll() {
      const sections = dockItems
        .map((d) => document.getElementById(d.id))
        .filter((el): el is HTMLElement => !!el);
      let current = sections[0];
      for (const s of sections) {
        if (window.scrollY + window.innerHeight * 0.4 >= s.offsetTop) current = s;
      }
      if (current) setActive(current.id);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-4 max-md:left-auto max-md:right-3.5 max-md:top-3.5 max-md:translate-y-0 max-md:flex-row max-md:bg-black/85 max-md:backdrop-blur-md max-md:px-2.5 max-md:py-2 max-md:rounded-full max-md:border max-md:border-gunmetal">
      {dockItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              playClick();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`group flex items-center gap-2.5 font-mono text-[10px] uppercase py-1.5 text-left transition-all duration-300 hover:translate-x-1 ${
              isActive ? "text-offwhite" : "text-titanium hover:text-offwhite"
            }`}
            style={{ letterSpacing: "0.12em" }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                isActive ? "bg-blue shadow-[0_0_10px_2px_rgba(63,127,255,0.2)]" : "bg-gunmetal"
              }`}
            />
            <span className="max-md:hidden">
              <span className="block text-[8px] text-titanium" style={{ letterSpacing: "0.1em" }}>
                {item.obj}
              </span>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
