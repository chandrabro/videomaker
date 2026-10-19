import React from "react";
import { Composition } from "remotion";
import { VideoComp, totalFrames } from "../Video";
import { sample } from "../sample";
import { HEIGHT, WIDTH, type Project } from "../types";

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={VideoComp as unknown as React.FC<Record<string, unknown>>}
    width={WIDTH}
    height={HEIGHT}
    fps={sample.fps}
    durationInFrames={totalFrames(sample)}
    defaultProps={sample as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => {
      const p = props as unknown as Project;
      return { durationInFrames: totalFrames(p), fps: p.fps };
    }}
  />
);
