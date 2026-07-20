"use client";

import { useState } from "react";
import RevealSection from "./RevealSection";
import { projects } from "@/lib/data";
import { useAchievements } from "@/context/AchievementContext";
import ProjectDemoModal from "./project-demos/ProjectDemoModal";
import { PROJECT_DEMOS } from "@/lib/project-demos";

function Dossier({
  project,
  open,
  onToggle,
  onLaunchDemo,
}: {
  project: (typeof projects)[number];
  open: boolean;
  onToggle: () => void;
  onLaunchDemo: () => void;
}) {
  const hasDemo = !!PROJECT_DEMOS[project.index];
  return (
    <div className="border border-gunmetal bg-gradient-to-b from-charcoal to-graphite rounded-sm overflow-hidden mb-5">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center gap-5 px-7 py-6 text-left"
      >
        <div className="font-display text-gunmetal font-semibold text-[34px] leading-none">
          {project.index}
        </div>
        <div className="flex-1">
          <div className="font-display text-[21px] font-semibold text-offwhite">
            {project.title}
          </div>
          <div
            className="font-mono text-[11px] text-amber mt-1.5"
            style={{ letterSpacing: "0.1em" }}
          >
            {project.tag}
          </div>
        </div>
        <div
          className={`font-mono text-titanium text-lg transition-transform duration-300 ${
            open ? "rotate-45 text-blue" : ""
          }`}
        >
          +
        </div>
      </button>
      <div
        className="transition-[max-height] duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? "500px" : "0px" }}
      >
        <div className="px-7 pb-8 text-[#b9b9b7] text-[14.5px] leading-relaxed">
          {project.description}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[11px] text-titanium border border-gunmetal rounded-sm px-2.5 py-1.5"
              >
                {s}
              </span>
            ))}
          </div>
          {hasDemo && (
            <button
              onClick={onLaunchDemo}
              className="mt-5 font-mono text-[11px] uppercase border border-blue text-blue rounded-sm px-4 py-2 hover:bg-blue hover:text-white transition-colors"
              style={{ letterSpacing: "0.1em" }}
            >
              Launch Demo ↗
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [demoProject, setDemoProject] = useState<(typeof projects)[number] | null>(null);
  const { unlock } = useAchievements();

  function handleToggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
    setVisited((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      if (next.size === projects.length) unlock("visited-every-project");
      return next;
    });
  }

  return (
    <RevealSection id="projects" className="section">
      <div className="eyebrow reveal">Operations Log 03</div>
      <h2 className="section-title reveal">Projects</h2>
      <p className="section-sub reveal">
        Selected work — expand a file for the full record.
      </p>
      <div className="reveal">
        {projects.map((project, i) => (
          <Dossier
            key={project.index}
            project={project}
            open={openIndex === i}
            onToggle={() => handleToggle(i)}
            onLaunchDemo={() => setDemoProject(project)}
          />
        ))}
      </div>
      {demoProject && (
        <ProjectDemoModal
          projectIndex={demoProject.index}
          title={demoProject.title}
          onClose={() => setDemoProject(null)}
        />
      )}
    </RevealSection>
  );
}
