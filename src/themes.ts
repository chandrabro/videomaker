export type Theme = { bg: string; text: string; accent: string; chipBg: string; chipText: string; dark: boolean };

const T: Record<string, Theme> = {
  dark:   { bg: "radial-gradient(120% 80% at 20% 0%, #3a2c16 0%, #14181a 55%, #0b0e10 100%)", text: "#ffffff", accent: "#f7c948", chipBg: "#ffffff", chipText: "#1d1d1f", dark: true },
  cream:  { bg: "linear-gradient(180deg,#efe9df 0%,#f4efe6 100%)", text: "#1d1d1f", accent: "#e8761a", chipBg: "#ffffff", chipText: "#1d1d1f", dark: false },
  green:  { bg: "linear-gradient(180deg,#3f8f3a 0%,#2f7a2f 100%)", text: "#ffffff", accent: "#ffe27a", chipBg: "#ffffff", chipText: "#1d1d1f", dark: true },
  orange: { bg: "linear-gradient(180deg,#f08a24 0%,#e2711a 100%)", text: "#ffffff", accent: "#fff2c2", chipBg: "#ffffff", chipText: "#1d1d1f", dark: true },
  blue:   { bg: "linear-gradient(180deg,#1f5fbf 0%,#173f8a 100%)", text: "#ffffff", accent: "#ffe27a", chipBg: "#ffffff", chipText: "#1d1d1f", dark: true },
  purple: { bg: "linear-gradient(180deg,#6a3fc0 0%,#47287f 100%)", text: "#ffffff", accent: "#ffe27a", chipBg: "#ffffff", chipText: "#1d1d1f", dark: true },
};

export function getTheme(name: string): Theme {
  if (T[name]) return T[name];
  if (/^#[0-9a-f]{3,8}$/i.test(name)) return { bg: name, text: "#ffffff", accent: "#ffe27a", chipBg: "#ffffff", chipText: "#1d1d1f", dark: true };
  return T.cream;
}
export const THEME_NAMES = Object.keys(T);

export const TONES: Record<string, { bg: string; fg: string }> = {
  red:    { bg: "#d9453d", fg: "#fff" },
  green:  { bg: "#2f9e44", fg: "#fff" },
  blue:   { bg: "#2f6fd1", fg: "#fff" },
  yellow: { bg: "#f2c230", fg: "#3b2f00" },
  brown:  { bg: "#8a5a2e", fg: "#fff" },
  white:  { bg: "#f4f4f4", fg: "#222" },
};
