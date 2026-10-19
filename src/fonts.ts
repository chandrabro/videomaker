import { loadFont as loadDeva } from "@remotion/google-fonts/NotoSansDevanagari";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const deva = loadDeva("normal", { weights: ["500", "700", "800"], subsets: ["devanagari", "latin"] });
const inter = loadInter("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });

// Devanagari first so Nepali/Hindi renders properly; Latin words use Inter-like fallback.
export const FONT = `${inter.fontFamily}, ${deva.fontFamily}, system-ui, sans-serif`;
export const waitForFonts = () => Promise.all([deva.waitUntilDone(), inter.waitUntilDone()]);
