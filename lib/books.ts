import { projects, timeline, achievements } from "./data";

export type BookPage = { title: string; body: string };
export type Book = { id: string; title: string; pages: BookPage[] };

// Content is derived from the same data already shown elsewhere on the site —
// this is a different presentation of it (a flip-book), not a new source of
// truth, so it can never drift out of sync with the Projects/Achievements sections.
export const BOOKS: Book[] = [
  {
    id: "resume",
    title: "Resume",
    pages: [
      {
        title: "Muhammed Irfan K M",
        body: "Software Engineer — AI & ML / Full-Stack. Open the real PDF from the hero section or the terminal's `resume` command.",
      },
    ],
  },
  {
    id: "education",
    title: "Education",
    pages: timeline.map((t) => ({ title: t.title, body: `${t.year} — ${t.body}` })),
  },
  {
    id: "projects",
    title: "Projects",
    pages: projects.map((p) => ({ title: p.title, body: p.description })),
  },
  {
    id: "certifications",
    title: "Certifications",
    pages: achievements.map((a) => ({ title: a.title, body: `${a.tag} — ${a.body}` })),
  },
];
