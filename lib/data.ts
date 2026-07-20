export type Project = {
  index: string;
  title: string;
  tag: string;
  description: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Portable Microplastic Screening Using Deep Learning",
    tag: "FINAL-YEAR MAJOR PROJECT · TEAM OF FOUR · 2025–2026",
    description:
      "A deep-learning system for on-site microplastic detection from optical microscopy images, built to make screening portable instead of lab-bound. A custom-trained YOLOv8 model was built with PyTorch and OpenCV on a curated dataset from Roboflow, reaching strong detection accuracy, and paired with a safety-scoring layer that references WHO and EFSA guidelines to translate raw detections into an interpretable risk read-out. Deployed as a working Gradio inference interface for demonstration and testing.",
    stack: ["YOLOv8", "PyTorch", "OpenCV", "Roboflow", "Gradio"],
  },
  {
    index: "02",
    title: "Expense Splitter",
    tag: "FULL-STACK APPLICATION · 2025",
    description:
      "A secure full-stack expense management application with JWT-based authentication and RESTful APIs. Handles group expense tracking and balance-settlement logic backed by a MySQL database, so a group can see who owes what without doing the math by hand.",
    stack: ["Node.js", "Express.js", "React", "MySQL", "JWT"],
  },
  {
    index: "03",
    title: "Smart Health ID — QR-Based Emergency Medical Access",
    tag: "MOBILE APPLICATION · 2025",
    description:
      "A QR-based system enabling secure, rapid retrieval of a person's medical records in an emergency, built as a React Native app backed by Firebase for fast, reliable access when every second matters.",
    stack: ["React Native", "Firebase"],
  },
  {
    index: "04",
    title: "IRFAN OS — This Portfolio",
    tag: "INTERACTIVE DEVELOPER PORTFOLIO · 2026–PRESENT",
    description:
      "The site you're on. A private-R&D-terminal-themed portfolio with a Three.js AI-core hero scene, GSAP-driven reveals, an in-page terminal shell, voice commands, and a handful of hidden easter eggs — built and refined as its own piece of engineering, not just a container for the other three.",
    stack: ["Next.js", "TypeScript", "React Three Fiber", "Three.js", "GSAP", "Tailwind CSS"],
  },
];

export const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "JavaScript / TypeScript", "SQL", "C"] },
  {
    label: "AI & Machine Learning",
    items: ["YOLOv8", "PyTorch", "OpenCV", "Roboflow", "NumPy", "Gradio"],
  },
  {
    label: "Backend & Systems",
    items: ["Node.js", "Express.js", "REST APIs", "JWT Authentication", "bcrypt", "MySQL", "Firebase"],
  },
  {
    label: "Frontend & Tooling",
    items: ["React.js", "React Native", "Next.js", "TypeScript", "Git / GitHub", "Postman"],
  },
];

export const timeline = [
  {
    year: "2023 — PRESENT",
    title: "B.E. Computer Science & Engineering (AI & ML)",
    body: "Sahyadri College of Engineering and Management, Mangaluru — affiliated with Visvesvaraya Technological University (VTU), 2023–2027 batch. CGPA: 8.0 / 10.",
  },
  {
    year: "BEFORE MANGALURU",
    title: "12th Standard",
    body: "International Indian School, Jeddah, Saudi Arabia.",
  },
  {
    year: "FOCUS",
    title: "Applied AI & Full-Stack Engineering",
    body: "Comfortable across the stack — from training and deploying computer-vision models to building the secure backend systems and interfaces that put them to use in the real world.",
  },
];

export const achievements = [
  {
    tag: "CERTIFICATION",
    title: "Infosys Springboard",
    body: "Python · Programming Fundamentals · Artificial Intelligence",
  },
  {
    tag: "HACKATHON",
    title: "Smart India Hackathon (SIH)",
    body: "College-shortlisted for SIH.",
  },
];

export const dockItems = [
  { id: "hero", obj: "MONITOR", label: "OVERVIEW" },
  { id: "about", obj: "NOTEBOOK", label: "ABOUT" },
  { id: "skills", obj: "STICKY NOTES", label: "MODULES" },
  { id: "projects", obj: "LAPTOP", label: "OPERATIONS" },
  { id: "achievements", obj: "TROPHY", label: "RECORD" },
  { id: "contact", obj: "PHONE", label: "CHANNEL" },
];

export const GITHUB_URL = "https://github.com/Irfan-tech723";
export const LINKEDIN_URL = "https://www.linkedin.com/in/muhammed-irfan-k-m-16513a293/";
