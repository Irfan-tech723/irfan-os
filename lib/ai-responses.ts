import { projects, skillGroups, achievements, timeline } from "./data";

export type AIAction = "resume" | "contact" | "projects" | "skills" | "github";

export type AIResponse = {
  text: string;
  action?: AIAction;
};

// A small, deliberately closed-domain matcher — IRFAN AI only knows what's in
// lib/data.ts. No external model, no general knowledge, by design.
export function getAIResponse(rawQuestion: string): AIResponse {
  const q = rawQuestion.toLowerCase();

  const matchedProject = projects.find((p) =>
    q.includes(p.title.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g, ""))
  ) || projects.find((p) => p.title.toLowerCase().split(/[\s—-]/).some((word) => word.length > 3 && q.includes(word)));

  if (matchedProject) {
    return {
      text: `${matchedProject.title} (${matchedProject.tag}). ${matchedProject.description} Stack: ${matchedProject.stack.join(", ")}.`,
    };
  }

  if (q.includes("favorite") || q.includes("favourite") || q.includes("proudest") || q.includes("best project")) {
    const p = projects[0];
    return {
      text: `Probably ${p.title} — it's the one with the most engineering depth: a custom-trained computer vision model plus a safety-scoring layer referencing real WHO/EFSA guidelines, not just a tutorial project.`,
    };
  }

  if (q.includes("technolog") || q.includes("stack") || q.includes("what do you know") || (q.includes("skill") && !q.includes("backend"))) {
    const flat = skillGroups.map((g) => `${g.label}: ${g.items.join(", ")}`).join(" | ");
    return { text: flat, action: "skills" };
  }

  if (q.includes("backend")) {
    return {
      text:
        "Backend work: Node.js and Express.js REST APIs, JWT authentication with bcrypt, and MySQL/Firebase for persistence — see Expense Splitter (full JWT + MySQL) and Smart Health ID (Firebase-backed).",
    };
  }

  if (q.includes("resume") || q.includes("cv")) {
    return { text: "Opening the resume now.", action: "resume" };
  }

  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire")) {
    return {
      text: "Scrolling you to the secure channel — email, phone, GitHub, and LinkedIn are all there.",
      action: "contact",
    };
  }

  if (q.includes("github")) {
    return { text: "Opening github.com/Irfan-tech723.", action: "github" };
  }

  if (q.includes("education") || q.includes("college") || q.includes("cgpa") || q.includes("degree")) {
    const edu = timeline[0];
    return { text: `${edu.title} — ${edu.body}` };
  }

  if (q.includes("certif") || q.includes("hackathon") || q.includes("achievement")) {
    const list = achievements.map((a) => `${a.title} (${a.body})`).join("; ");
    return { text: `On record: ${list}.` };
  }

  if (q.includes("project")) {
    const list = projects.map((p, i) => `${i + 1}. ${p.title}`).join(", ");
    return { text: `Four on file: ${list}. Ask about any one by name for details.`, action: "projects" };
  }

  if (q.includes("who are you") || q.includes("what are you")) {
    return {
      text:
        "I'm IRFAN AI — a small assistant scoped to this portfolio only. I can talk about Irfan's projects, skills, education, and how to reach him. I don't know anything outside that.",
    };
  }

  return {
    text:
      "I only know what's in this portfolio — try asking about a specific project, the tech stack, education, or how to get in touch.",
  };
}
