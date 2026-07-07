"use client";

import { play, toggleSoundMuted, useSoundMuted } from "@/lib/sound";

/** Nav sound switch. Renders in both modes; boring mode stays silent anyway. */
export default function SoundToggle() {
  const muted = useSoundMuted();
  return (
    <button
      type="button"
      data-cursor="INSPECT"
      aria-pressed={!muted}
      aria-label={muted ? "Enable sound" : "Disable sound"}
      onClick={() => {
        toggleSoundMuted();
        if (muted) window.setTimeout(() => play("tick"), 30);
      }}
      className="text-[10px] tracking-[0.14em] whitespace-nowrap uppercase opacity-70 transition-colors hover:text-hazard hover:opacity-100"
    >
      SND: {muted ? "OFF" : "ON"}
    </button>
  );
}
