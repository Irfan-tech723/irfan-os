import RevealSection from "./RevealSection";
import Terminal from "./Terminal";

export default function Contact() {
  return (
    <RevealSection id="contact" className="section">
      <div className="eyebrow reveal">Secure Channel 05</div>
      <h2 className="section-title reveal">Contact</h2>
      <p className="sub reveal">
        Type <span className="text-blue">contact</span> below, or try{" "}
        <span className="text-blue">help</span>.
      </p>
      <div className="reveal max-w-[640px]">
        <Terminal
          title="irfan@terminal — secure-channel"
          initialLine='<span class="text-titanium">// secure channel established — type "help" to begin</span>'
          placeholder="type a command..."
        />
      </div>
    </RevealSection>
  );
}