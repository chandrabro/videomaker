"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { VideoComp, totalFrames } from "./Video";
import { sample } from "./sample";
import { THEME_NAMES } from "./themes";
import { HEIGHT, WIDTH, type Project, type Scene, type VisualType } from "./types";

const KEY = "text-video-studio:project:v1";
const VISUALS: VisualType[] = ["none", "bubble", "checklist", "cards", "compare", "equation", "image"];
const HINTS: Record<VisualType, string> = {
  none: "No visual – text only.",
  bubble: "Title + tag above; first line below = the quote.",
  checklist: "One row per line.",
  cards: "One tile per line:  🍗 | Raw chicken",
  compare: "Two lines:  🥩 | Raw | red     (tones: red green blue yellow brown white)",
  equation: "First line = big text. Title = small label.",
  image: "First line = image URL or /file.png from the public folder.",
};
const uid = () => Math.random().toString(36).slice(2, 8);

export default function Studio() {
  const [project, setProject] = useState<Project>(sample);
  const [active, setActive] = useState(0);
  const player = useRef<PlayerRef>(null);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setProject(JSON.parse(s));
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(project)); } catch {}
  }, [project]);

  const frames = useMemo(() => totalFrames(project), [project]);
  const startOf = (i: number) => project.scenes.slice(0, i).reduce((a, s) => a + Math.round(s.duration * project.fps), 0);

  const patch = (i: number, p: Partial<Scene>) =>
    setProject((pr) => ({ ...pr, scenes: pr.scenes.map((s, k) => (k === i ? { ...s, ...p } : s)) }));
  const setScenes = (fn: (s: Scene[]) => Scene[]) => setProject((pr) => ({ ...pr, scenes: fn(pr.scenes) }));
  const jump = (i: number) => { setActive(i); player.current?.seekTo(startOf(i)); player.current?.play(); };

  const download = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "project.json";
    a.click();
  };
  const upload = (f: File) => f.text().then((t) => { setProject(JSON.parse(t)); setActive(0); });

  return (
    <div className="app">
      <div className="stage">
        <h2 style={{ margin: 0 }}>Text Video Studio</h2>
        <div className="player">
          <Player
            ref={player}
            component={VideoComp as unknown as React.FC<Record<string, unknown>>}
            inputProps={project as unknown as Record<string, unknown>}
            durationInFrames={frames}
            compositionWidth={WIDTH}
            compositionHeight={HEIGHT}
            fps={project.fps}
            controls
            loop
            style={{ width: "100%" }}
            acknowledgeRemotionLicense
          />
        </div>
        <div className="row">
          <button className="btn primary" onClick={download}>⬇ Download project.json</button>
          <label className="btn" style={{ margin: 0, color: "#fff", fontSize: 14 }}>
            ⬆ Import
            <input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          <button className="btn danger" onClick={() => { setProject(sample); setActive(0); }}>Reset</button>
        </div>
        <small>{(frames / project.fps).toFixed(1)}s · {WIDTH}×{HEIGHT} · {project.fps}fps</small>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Project</h3>
        <div className="grid2">
          <div><label>Brand pill</label><input value={project.brand} onChange={(e) => setProject({ ...project, brand: e.target.value })} /></div>
          <div><label>Handle</label><input value={project.handle} onChange={(e) => setProject({ ...project, handle: e.target.value })} /></div>
        </div>
        <label>Audio file (put in /public, e.g. /voice.mp3) – optional</label>
        <input value={project.audioSrc ?? ""} placeholder="/voice.mp3" onChange={(e) => setProject({ ...project, audioSrc: e.target.value || undefined })} />
        <label><input type="checkbox" style={{ width: "auto" }} checked={project.showWatermark} onChange={(e) => setProject({ ...project, showWatermark: e.target.checked })} /> Show handle watermark</label>

        <h3>Scenes</h3>
        {project.scenes.map((s, i) => (
          <div key={s.id} className={"scene" + (i === active ? " active" : "")} onClick={() => setActive(i)}>
            <h4>
              <span>Scene {i + 1}</span>
              <span className="row">
                <button className="btn" onClick={() => jump(i)}>▶</button>
                <button className="btn" disabled={i === 0} onClick={() => setScenes((a) => { const b = [...a]; [b[i - 1], b[i]] = [b[i], b[i - 1]]; return b; })}>↑</button>
                <button className="btn" disabled={i === project.scenes.length - 1} onClick={() => setScenes((a) => { const b = [...a]; [b[i + 1], b[i]] = [b[i], b[i + 1]]; return b; })}>↓</button>
                <button className="btn" onClick={() => setScenes((a) => { const b = [...a]; b.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(s)), id: uid() }); return b; })}>⧉</button>
                <button className="btn danger" disabled={project.scenes.length < 2} onClick={() => setScenes((a) => a.filter((_, k) => k !== i))}>✕</button>
              </span>
            </h4>
            <label>Headline <small>– wrap words in [[ ]] to colour them</small></label>
            <textarea value={s.headline} onChange={(e) => patch(i, { headline: e.target.value })} />
            <div className="grid2">
              <div><label>Chip text</label><input value={s.chip ?? ""} onChange={(e) => patch(i, { chip: e.target.value })} /></div>
              <div><label>Chip emoji</label><input value={s.chipIcon ?? ""} onChange={(e) => patch(i, { chipIcon: e.target.value })} /></div>
              <div><label>Duration (sec)</label><input type="number" min={1} step={0.5} value={s.duration} onChange={(e) => patch(i, { duration: Math.max(1, Number(e.target.value) || 1) })} /></div>
              <div>
                <label>Theme</label>
                <select value={THEME_NAMES.includes(s.theme) ? s.theme : "custom"} onChange={(e) => patch(i, { theme: e.target.value === "custom" ? "#0b5394" : e.target.value })}>
                  {THEME_NAMES.map((t) => <option key={t}>{t}</option>)}
                  <option value="custom">custom hex…</option>
                </select>
              </div>
            </div>
            {!THEME_NAMES.includes(s.theme) && <input style={{ marginTop: 8 }} value={s.theme} onChange={(e) => patch(i, { theme: e.target.value })} />}
            <label>Visual</label>
            <select value={s.visual.type} onChange={(e) => patch(i, { visual: { ...s.visual, type: e.target.value as VisualType } })}>
              {VISUALS.map((v) => <option key={v}>{v}</option>)}
            </select>
            <small>{HINTS[s.visual.type]}</small>
            {(s.visual.type === "bubble" || s.visual.type === "equation") && (
              <div className="grid2">
                <div><label>Title</label><input value={s.visual.title ?? ""} onChange={(e) => patch(i, { visual: { ...s.visual, title: e.target.value } })} /></div>
                {s.visual.type === "bubble" && <div><label>Tag</label><input value={s.visual.tag ?? ""} onChange={(e) => patch(i, { visual: { ...s.visual, tag: e.target.value } })} /></div>}
              </div>
            )}
            {s.visual.type !== "none" && (
              <>
                <label>Items (one per line)</label>
                <textarea value={s.visual.items.join("\n")} onChange={(e) => patch(i, { visual: { ...s.visual, items: e.target.value.split("\n") } })} />
              </>
            )}
          </div>
        ))}
        <button className="btn primary" style={{ marginTop: 14 }} onClick={() => { setScenes((a) => [...a, { id: uid(), duration: 4, theme: "cream", headline: "नयाँ [[scene]]", visual: { type: "none", items: [] } }]); setActive(project.scenes.length); }}>+ Add scene</button>
      </div>
    </div>
  );
}
