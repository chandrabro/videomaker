import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./fonts";
import type { Theme } from "./themes";

type Word = { text: string; hl: boolean };

/** "हिजो [[पेट बिग्रियो]] भन्ने complain" -> words with highlight flag */
export function parseHeadline(src: string): Word[] {
  const out: Word[] = [];
  let hl = false;
  for (const part of src.split(/(\[\[|\]\])/)) {
    if (part === "[[") hl = true;
    else if (part === "]]") hl = false;
    else part.split(/\s+/).filter(Boolean).forEach((t) => out.push({ text: t, hl }));
  }
  return out;
}

export const Headline: React.FC<{ text: string; theme: Theme; revealFrames: number }> = ({ text, theme, revealFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = parseHeadline(text);
  const step = Math.max(2, Math.min(7, revealFrames / Math.max(1, words.length)));

  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 84,
        lineHeight: 1.28,
        color: theme.text,
        textAlign: "center",
        padding: "0 70px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 22,
      }}
    >
      {words.map((w, i) => {
        const f = frame - 6 - i * step;
        const p = spring({ frame: f, fps, config: { damping: 18, stiffness: 140 } });
        const op = interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span
            key={i}
            style={{
              opacity: op,
              transform: `translateY(${(1 - p) * 34}px)`,
              color: w.hl ? theme.accent : theme.text,
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
