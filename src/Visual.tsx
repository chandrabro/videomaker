import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./fonts";
import { TONES, type Theme } from "./themes";
import type { Visual } from "./types";

const useIn = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
  const op = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { p, op };
};

const parseItem = (s: string) => {
  const [icon = "", label = "", tone = "white"] = s.split("|").map((x) => x.trim());
  return { icon, label, tone };
};

const card: React.CSSProperties = { background: "#fff", borderRadius: 44, boxShadow: "0 20px 50px rgba(0,0,0,.18)" };

const Bubble: React.FC<{ v: Visual }> = ({ v }) => {
  const { p, op } = useIn(14);
  return (
    <div style={{ ...card, width: 880, padding: "40px 48px", fontFamily: FONT, opacity: op, transform: `scale(${0.85 + 0.15 * p})`, position: "relative", color: "#1d1d1f" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 700, color: "#555" }}>
        <span>{v.title}</span>
        {v.tag ? <span style={{ background: "#fde4e1", color: "#d9453d", borderRadius: 999, padding: "8px 26px", fontSize: 30 }}>{v.tag}</span> : null}
      </div>
      <div style={{ fontSize: 72, fontWeight: 800, marginTop: 26, lineHeight: 1.25 }}>“{v.items[0] ?? ""}”</div>
      <div style={{ position: "absolute", left: 50, bottom: -34, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "40px solid #fff" }} />
    </div>
  );
};

const Checklist: React.FC<{ v: Visual; theme: Theme }> = ({ v, theme }) => (
  <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 26 }}>
    {v.items.map((t, i) => <Row key={i} i={i} text={t} theme={theme} />)}
  </div>
);
const Row: React.FC<{ i: number; text: string; theme: Theme }> = ({ i, text, theme }) => {
  const { p, op } = useIn(14 + i * 22);
  return (
    <div style={{ ...card, borderRadius: 30, display: "flex", alignItems: "center", gap: 28, padding: "28px 34px", fontFamily: FONT, fontWeight: 700, fontSize: 46, color: "#1d1d1f", opacity: op, transform: `translateX(${(1 - p) * 120}px)` }}>
      <span style={{ width: 64, height: 64, borderRadius: 32, background: theme.dark ? "#e2711a" : "#e8761a", color: "#fff", display: "grid", placeItems: "center", fontSize: 38 }}>{i + 1}</span>
      <span style={{ flex: 1 }}>{text}</span>
      <span style={{ color: "#2f9e44", fontSize: 52, opacity: p > 0.9 ? 1 : 0 }}>✓</span>
    </div>
  );
};

const Cards: React.FC<{ v: Visual }> = ({ v }) => (
  <div style={{ display: "flex", gap: 34, justifyContent: "center", flexWrap: "wrap", width: 960 }}>
    {v.items.map((s, i) => {
      const { icon, label } = parseItem(s);
      return <CardTile key={i} icon={icon} label={label} i={i} />;
    })}
  </div>
);
const CardTile: React.FC<{ icon: string; label: string; i: number }> = ({ icon, label, i }) => {
  const { p, op } = useIn(14 + i * 12);
  return (
    <div style={{ ...card, width: 270, height: 270, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: op, transform: `scale(${0.6 + 0.4 * p})`, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#1d1d1f", textAlign: "center", padding: 12 }}>
      <span style={{ fontSize: 120 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

const Compare: React.FC<{ v: Visual }> = ({ v }) => (
  <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
    {v.items.slice(0, 2).map((s, i) => {
      const { icon, label, tone } = parseItem(s);
      return <CompareCard key={i} icon={icon} label={label} tone={tone} i={i} />;
    })}
  </div>
);
const CompareCard: React.FC<{ icon: string; label: string; tone: string; i: number }> = ({ icon, label, tone, i }) => {
  const { p, op } = useIn(14 + i * 18);
  const t = TONES[tone] ?? TONES.white;
  return (
    <div style={{ width: 430, opacity: op, transform: `translateY(${(1 - p) * 80}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ ...card, background: t.bg, width: 430, height: 520, display: "grid", placeItems: "center", fontSize: 190 }}>{icon}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, background: "#fff", color: "#1d1d1f", borderRadius: 999, padding: "12px 34px", boxShadow: "0 6px 20px rgba(0,0,0,.15)" }}>{label}</div>
    </div>
  );
};

const Equation: React.FC<{ v: Visual }> = ({ v }) => {
  const { p, op } = useIn(14);
  return (
    <div style={{ ...card, width: 900, padding: "44px 40px", textAlign: "center", fontFamily: FONT, opacity: op, transform: `scale(${0.85 + 0.15 * p})`, color: "#e8761a" }}>
      {v.title ? <div style={{ fontSize: 30, color: "#777", fontWeight: 700, marginBottom: 12 }}>{v.title}</div> : null}
      <div style={{ fontSize: 76, fontWeight: 800 }}>{v.items[0]}</div>
    </div>
  );
};

const ImageV: React.FC<{ v: Visual }> = ({ v }) => {
  const { p, op } = useIn(10);
  const src = v.items[0] ?? "";
  if (!src) return null;
  const url = /^https?:|^data:/.test(src) ? src : staticFile(src.replace(/^\//, ""));
  return <Img src={url} style={{ maxWidth: 900, maxHeight: 900, borderRadius: 36, opacity: op, transform: `scale(${0.9 + 0.1 * p})`, boxShadow: "0 20px 50px rgba(0,0,0,.25)" }} />;
};

export const VisualView: React.FC<{ v: Visual; theme: Theme }> = ({ v, theme }) => {
  switch (v.type) {
    case "bubble": return <Bubble v={v} />;
    case "checklist": return <Checklist v={v} theme={theme} />;
    case "cards": return <Cards v={v} />;
    case "compare": return <Compare v={v} />;
    case "equation": return <Equation v={v} />;
    case "image": return <ImageV v={v} />;
    default: return null;
  }
};
