import RevealSection from "./RevealSection";
import { skillGroups } from "@/lib/data";
import LiveGitHub from "./github/LiveGitHub";

export default function Skills() {
  return (
    <RevealSection id="skills" className="section">
      <div className="eyebrow reveal">Modules 02</div>
      <h2 className="section-title reveal">Skills</h2>
      <p className="section-sub reveal">
        No meters, no percentages — just the tools in active rotation.
      </p>
      <div className="reveal flex flex-col gap-9">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <div
              className="font-mono text-[11px] text-titanium uppercase mb-3.5"
              style={{ letterSpacing: "0.14em" }}
            >
              {group.label}
            </div>
            <div className="flex flex-wrap gap-3">
              {group.items.map((item) => (
                <div key={item} className="chip">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
        <LiveGitHub />
      </div>
    </RevealSection>
  );
}
