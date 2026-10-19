// Usage:  npm run render -- projects/my-video.json            -> out/my-video.mp4
//         npm run render -- projects/my-video.json out/final.mp4
import { spawnSync } from "node:child_process";
import { basename } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const input = process.argv[2] || "project.json";
if (!existsSync(input)) {
  console.error(`\nFile not found: ${input}\nPut your downloaded project file in the "projects" folder and run:\n  npm run render -- projects/<name>.json\n`);
  process.exit(1);
}
const output = process.argv[3] || `out/${basename(input, ".json")}.mp4`;
mkdirSync("out", { recursive: true });
console.log(`Rendering ${input} -> ${output}`);
const r = spawnSync("npx", ["remotion", "render", "src/remotion/index.ts", "Main", output, `--props=${input}`], { stdio: "inherit", shell: true });
if (r.status === 0) console.log(`\n✅ Done: ${output}`);
process.exit(r.status ?? 1);
