import React from "react";
import { FONT } from "./fonts";
import type { Theme } from "./themes";

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 14,
  background: "#fff",
  color: "#1d1d1f",
  borderRadius: 999,
  fontFamily: FONT,
  fontWeight: 700,
  boxShadow: "0 6px 20px rgba(0,0,0,.12)",
};

export const TopChips: React.FC<{ brand: string; chip?: string; chipIcon?: string; theme: Theme }> = ({ brand, chip, chipIcon }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
    {chip ? (
      <div style={{ ...pill, fontSize: 34, padding: "12px 28px" }}>
        {chipIcon ? <span style={{ fontSize: 34 }}>{chipIcon}</span> : null}
        {chip}
      </div>
    ) : null}
    {brand ? <div style={{ ...pill, fontSize: 30, padding: "10px 26px" }}>{brand}</div> : null}
  </div>
);

export const Watermark: React.FC<{ handle: string; dark: boolean }> = ({ handle, dark }) => (
  <div style={{ position: "absolute", right: 50, bottom: 140, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: dark ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.55)" }}>
    {handle}
  </div>
);
