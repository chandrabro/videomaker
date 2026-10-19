# Text Video Studio

Make 9:16 animated text-explainer videos (TikTok / Reels / Shorts style) from a simple scene editor.
Built with **Next.js + Remotion**. Editor runs on **Vercel**, MP4 rendering runs on **GitHub Actions** (free) or your PC.
No voice is generated – record your own and drop it in `public/` (optional).

## 1. Put it on GitHub
```bash
cd text-video-studio
git init && git add . && git commit -m "init"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/text-video-studio.git
git branch -M main && git push -u origin main
```

## 2. Deploy the editor on Vercel
1. vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework = Next.js (auto-detected). Click **Deploy**. Done – no env vars needed.
3. Every `git push` redeploys automatically.

## 3. Make a video (every time)
1. Open the editor, edit scenes, preview.
2. Click **Download project.json**, rename it (e.g. `chicken-board.json`) and save it in the `projects/` folder.
3. Render to MP4 – pick ONE:

**A. On your own PC (recommended, no GitHub needed)**
```bash
npm install                                   # first time only
npm run render -- projects/chicken-board.json # -> out/chicken-board.mp4
```
First render downloads a small browser automatically (needs internet, once).

**B. On GitHub (no software on your PC)**
1. Upload the JSON: repo page → *Add file → Upload files* → drop it into `projects/` → Commit.
2. *Actions → Render video → Run workflow* → type `projects/chicken-board.json` → Run.
3. When it turns green, open the run → **Artifacts → video** → download the zip → `video.mp4` inside.

Each video = a new file in `projects/`, so old videos are kept and nothing is overwritten.

## 4. Adding your voice
Record the voice-over, save as `public/voice.mp3`, set **Audio file** to `/voice.mp3` in the editor,
and adjust scene durations until the text matches your speech. (Tip: the video length = sum of scene durations.)
Images/logos: put them in `public/` and use the `image` visual with `/logo.png`.

## 5. Customising
| What | Where |
|---|---|
| Colours / backgrounds | `src/themes.ts` |
| Font (Devanagari + Latin) | `src/fonts.ts` |
| Layout, sizes, animation | `src/Video.tsx`, `src/Headline.tsx`, `src/Visual.tsx` |
| New visual type | add a component in `src/Visual.tsx` + a case in `VisualView` + option in `Studio.tsx` |
| Resolution | `WIDTH/HEIGHT` in `src/types.ts` (1080×1920) |

## Notes
- The editor autosaves to your browser (localStorage). Download project.json to keep it safely.
- Vercel serverless can't render long MP4s, which is why rendering is done by GitHub Actions / locally.
- Remotion is free for individuals and companies of up to 3 people; larger companies need a licence (remotion.pro).
- Fonts load from Google Fonts at render time, so the machine rendering needs internet (GitHub Actions does).
