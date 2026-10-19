import React from "react";
import { AbsoluteFill, Audio, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline } from "./Headline";
import { TopChips, Watermark } from "./Chrome";
import { VisualView } from "./Visual";
import { getTheme } from "./themes";
import type { Project, Scene } from "./types";
import "./fonts";

export const totalFrames = (p: Project) =>
  Math.max(1, p.scenes.reduce((a, s) => a + Math.max(1, Math.round(s.duration * p.fps)), 0));

const SceneView: React.FC<{ scene: Scene; project: Project }> = ({ scene, project }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme = getTheme(scene.theme);
  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: theme.bg, opacity: Math.min(fadeIn, fadeOut + 0.0001) }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}>
        <TopChips brand={project.brand} chip={scene.chip} chipIcon={scene.chipIcon} theme={theme} />
      </div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0 }}>
        <Headline text={scene.headline} theme={theme} revealFrames={Math.round(durationInFrames * 0.55)} />
      </div>
      <div style={{ position: "absolute", top: 780, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <VisualView v={scene.visual} theme={theme} />
      </div>
      {project.showWatermark && project.handle ? <Watermark handle={project.handle} dark={theme.dark} /> : null}
    </AbsoluteFill>
  );
};

export const VideoComp: React.FC<Project> = (project) => {
  const audio = project.audioSrc ? (/^https?:/.test(project.audioSrc) ? project.audioSrc : staticFile(project.audioSrc.replace(/^\//, ""))) : null;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Series>
        {project.scenes.map((s) => (
          <Series.Sequence key={s.id} durationInFrames={Math.max(1, Math.round(s.duration * project.fps))}>
            <SceneView scene={s} project={project} />
          </Series.Sequence>
        ))}
      </Series>
      {audio ? <Audio src={audio} /> : null}
    </AbsoluteFill>
  );
};
