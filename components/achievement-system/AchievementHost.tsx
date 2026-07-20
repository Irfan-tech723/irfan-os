"use client";

import { useEffect, useState } from "react";
import { useAchievements } from "@/context/AchievementContext";
import AchievementNotification from "./AchievementNotification";
import { playToggle } from "@/hooks/useSound";

const VISIBLE_MS = 3800;
const LEAVE_MS = 500;

export default function AchievementHost() {
  const { queue, dismissFront } = useAchievements();
  const [leaving, setLeaving] = useState(false);

  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    setLeaving(false);
    playToggle();
    const leaveTimer = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const dismissTimer = setTimeout(() => dismissFront(), VISIBLE_MS + LEAVE_MS);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  if (!current) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[9600] pointer-events-none">
      <AchievementNotification achievement={current} leaving={leaving} />
    </div>
  );
}
