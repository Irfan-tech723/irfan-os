export type AchievementId =
  | "booted-os"
  | "opened-secret-terminal"
  | "played-first-game"
  | "visited-every-project"
  | "downloaded-resume"
  | "activated-matrix-mode"
  | "used-voice-commands"
  | "found-developer-mode";

export type AchievementDef = {
  id: AchievementId;
  title: string;
  description: string;
};

// Registry of every achievement in the system. Some of these (played-first-game,
// activated-matrix-mode, found-developer-mode) are defined here ahead of the
// features that unlock them (Game Center, Matrix Mode, Developer Mode) so the
// notification system and any future "all achievements" view already knows
// about them — call unlock("played-first-game") etc. once those features land.
export const ACHIEVEMENTS: Record<AchievementId, AchievementDef> = {
  "booted-os": {
    id: "booted-os",
    title: "Booted IRFAN OS",
    description: "Completed the boot sequence.",
  },
  "opened-secret-terminal": {
    id: "opened-secret-terminal",
    title: "Opened Secret Terminal",
    description: "Found the hidden shell.",
  },
  "played-first-game": {
    id: "played-first-game",
    title: "Played First Game",
    description: "Launched something from the Game Center.",
  },
  "visited-every-project": {
    id: "visited-every-project",
    title: "Visited Every Project",
    description: "Opened every dossier in Operations Log.",
  },
  "downloaded-resume": {
    id: "downloaded-resume",
    title: "Downloaded Resume",
    description: "Pulled the file from the archive.",
  },
  "activated-matrix-mode": {
    id: "activated-matrix-mode",
    title: "Activated Matrix Mode",
    description: "Typed the word that changes everything.",
  },
  "used-voice-commands": {
    id: "used-voice-commands",
    title: "Used Voice Commands",
    description: "Spoke to the system, and it listened.",
  },
  "found-developer-mode": {
    id: "found-developer-mode",
    title: "Found Developer Mode",
    description: "Peeked behind the curtain.",
  },
};

export const ACHIEVEMENT_LIST = Object.values(ACHIEVEMENTS);
