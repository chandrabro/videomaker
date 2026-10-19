export type VisualType =
  | "none"
  | "bubble"   // speech bubble: title | tag | quote
  | "checklist" // numbered rows that tick one by one
  | "cards"    // row of icon tiles
  | "compare"  // two big cards side by side
  | "equation" // one big highlighted box
  | "image";   // any image URL or /file in /public

export type Visual = {
  type: VisualType;
  /** bubble: title/tag. equation: small label. image: url */
  title?: string;
  tag?: string;
  /**
   * One per line in the editor.
   * cards / compare:  "emoji | label | tone"   (tone = red | green | blue | yellow | brown | white)
   * checklist:        "text"
   * bubble:           first line is the quote
   * equation:         first line is the big text
   * image:            first line is the URL
   */
  items: string[];
};

export type Scene = {
  id: string;
  /** seconds */
  duration: number;
  /** dark | cream | green | orange | blue | purple | #hex */
  theme: string;
  /** small pill above the headline, e.g. "Rewind", "3 कुरा" */
  chip?: string;
  /** emoji shown inside the chip */
  chipIcon?: string;
  /** use [[double brackets]] to colour a phrase */
  headline: string;
  visual: Visual;
};

export type Project = {
  brand: string;        // pill at the top ("Food Shield Nepal")
  handle: string;       // bottom-left watermark ("@food.shield.nepal")
  showWatermark: boolean;
  fps: number;
  /** optional voice-over / music: file in /public (e.g. "/voice.mp3") or a URL */
  audioSrc?: string;
  scenes: Scene[];
};

export const WIDTH = 1080;
export const HEIGHT = 1920;
