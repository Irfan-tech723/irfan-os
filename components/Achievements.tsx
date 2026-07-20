import RevealSection from "./RevealSection";
import { achievements } from "@/lib/data";
import BookShelf from "./knowledge-books/BookShelf";

const records = [
  {
    tag: "EDUCATION",
    title: "B.E. — CSE (AI & ML)",
    body: "Sahyadri College of Engineering and Management, Mangaluru · VTU · 2023–2027 · CGPA 8.0/10",
  },
  {
    tag: "EDUCATION",
    title: "12th Standard",
    body: "International Indian School, Jeddah, Saudi Arabia",
  },
  ...achievements,
  {
    tag: "PROJECT",
    title: "Major BE Project",
    body: "Led the report, documentation and deployment work on a four-person deep-learning research project.",
  },
];

export default function Achievements() {
  return (
    <RevealSection id="achievements" className="section">
      <div className="eyebrow reveal">Record 04</div>
      <h2 className="section-title reveal">Education &amp; Record</h2>
      <p className="section-sub reveal">The credentials on file.</p>
      <div className="reveal grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {records.map((r) => (
          <div key={r.title} className="card">
            <div
              className="font-mono text-[10px] text-amber mb-3"
              style={{ letterSpacing: "0.14em" }}
            >
              {r.tag}
            </div>
            <div className="font-display text-[17px] font-semibold mb-2">{r.title}</div>
            <div className="text-titanium text-[13.5px] leading-relaxed">{r.body}</div>
          </div>
        ))}
      </div>
      <div className="reveal mt-10">
        <BookShelf />
      </div>
    </RevealSection>
  );
}
