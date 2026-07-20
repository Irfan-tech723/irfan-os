import type { AchievementDef } from "@/lib/achievements";

export default function AchievementNotification({
  achievement,
  leaving,
}: {
  achievement: AchievementDef;
  leaving: boolean;
}) {
  return (
    <div
      className={`w-[300px] bg-charcoal border border-amber rounded-sm px-5 py-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)] transition-all duration-500 ${
        leaving ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber" />
        <span
          className="font-mono text-[9px] text-amber uppercase"
          style={{ letterSpacing: "0.18em" }}
        >
          Achievement Unlocked
        </span>
      </div>
      <div className="font-display text-[15px] font-semibold text-offwhite">
        {achievement.title}
      </div>
      <div className="font-mono text-[11.5px] text-titanium mt-1 leading-relaxed">
        {achievement.description}
      </div>
    </div>
  );
}
