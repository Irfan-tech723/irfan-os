import { resolveGameSlug, type GameId } from "./games";

export type CommandResult = {
  html: string;
  clear?: boolean;
  triggerResumeDownload?: boolean;
  toast?: string;
  scrollTo?: string;
  openUrl?: string;
  openGame?: GameId | "launcher";
  matrixMode?: "on" | "off";
};

// NOTE: email / phone / LinkedIn below are placeholders — replace with your
// real details before publishing.
export function runCommand(raw: string): CommandResult | null {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "") return null;

  if (cmd === "contact") {
    return {
      html:
        '<span class="text-amber">EMAIL</span>&nbsp;&nbsp;irfanmmk317@gmail.com\n' +
        '<span class="text-amber">PHONE</span>&nbsp;&nbsp;+91 8714334899\n' +
        '<span class="text-amber">GITHUB</span>&nbsp;github.com/Irfan-tech723\n' +
        '<span class="text-amber">LINKEDIN</span>&nbsp;linkedin.com/in/muhammed-irfan-k-m-16513a293',
    };
  }
  if (cmd === "whoami") {
    return {
      html: "Muhammed Irfan K M — CSE (AI & ML) undergraduate, Sahyadri College of Engineering and Management.",
    };
  }
  if (cmd === "projects") {
    return {
      html:
        "01. Portable Microplastic Screening Using Deep Learning\n" +
        "02. Expense Splitter\n" +
        "03. Smart Health ID\n" +
        "04. IRFAN OS — this portfolio",
    };
  }
  if (cmd === "skills") {
    return {
      html: "Python · JS/TS · YOLOv8 · PyTorch · OpenCV · Node.js · React · React Native · Next.js · MySQL · Firebase",
    };
  }
  if (cmd === "resume") {
    return { html: "Opening resume.pdf...", triggerResumeDownload: true };
  }
  if (cmd === "education" || cmd === "achievements") {
    return {
      html: "Sahyadri College of Engineering and Management (VTU) · scrolling to record...",
      scrollTo: "achievements",
    };
  }
  if (cmd === "github") {
    return {
      html: "Opening github.com/Irfan-tech723 ...",
      openUrl: "https://github.com/Irfan-tech723",
    };
  }
  if (cmd === "linkedin") {
    return {
      html: "Opening linkedin.com/in/muhammed-irfan-k-m-16513a293 ...",
      openUrl: "https://www.linkedin.com/in/muhammed-irfan-k-m-16513a293/",
    };
  }
  if (cmd === "sudo hire irfan") {
    return {
      html: '<span class="text-amber">PERMISSION GRANTED.</span> Good call.',
      toast: "ACCESS GRANTED — sudo hire irfan",
    };
  }
  if (cmd === "games" || cmd === "play") {
    return { html: "Opening Game Center...", openGame: "launcher" };
  }
  if (cmd.startsWith("play ")) {
    const slug = resolveGameSlug(cmd.slice(5));
    if (slug) return { html: `Launching ${slug}...`, openGame: slug };
    return {
      html: `<span class="text-titanium">no game called "${escapeHtml(
        cmd.slice(5)
      )}" — try "games" to see what's available</span>`,
    };
  }
  if (cmd === "mission") {
    return {
      html:
        "MISSION\n\n" +
        "Build software that solves real-world problems.\n" +
        "Keep learning.\n" +
        "Keep building.\n" +
        "Keep shipping.\n\n" +
        '<span class="text-amber">STATUS</span>&nbsp;&nbsp;IN PROGRESS...',
    };
  }
  if (cmd === "matrix") {
    return { html: "Entering the matrix...", matrixMode: "on" };
  }
  if (cmd === "exit") {
    return { html: "Returning to normal mode.", matrixMode: "off" };
  }
  if (cmd === "help") {
    return {
      html:
        "available: whoami · projects · skills · education · achievements · " +
        "contact · github · linkedin · resume · games · play &lt;name&gt; · " +
        "matrix · exit · mission · sudo hire irfan · clear",
    };
  }
  if (cmd === "clear") {
    return { html: "", clear: true };
  }
  return {
    html: `<span class="text-titanium">command not found: ${escapeHtml(
      cmd
    )} — try "help"</span>`,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[c];
  });
}


