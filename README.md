# TRUSTTRAP

**Think Before You Trust.** An interactive cybersecurity awareness platform that teaches people to spot online scams by investigating them.

## Modules

| Module | Route | What it does |
| --- | --- | --- |
| Command Center | `/command` | Guardian level, XP, missions, badges, threat timeline, activity log |
| Scam Scanner | `/scanner` | Deterministic, explainable scoring of any pasted message |
| Cyber Detective | `/detective` | Six realistic scenarios across three difficulty levels |
| Escape the Scam | `/escape` | Timed three-lock simulation with clues, penalties and a result screen |
| Evidence Room | `/evidence` | Inspect a fictional scam message category by category, then read the conclusion |
| Learning Hub | `/learn` | Seven interactive lessons, each with a knowledge check |
| Guardian Profile | `/profile` | Full profile: name, level, stats, missions, badges and activity |

## Run locally

    npm install
    npm run dev

Open the address Vite prints, usually http://localhost:5173.

## Production build

    npm run build
    npm run preview

## Deploy

- **Vercel:** import the project. `vercel.json` rewrites all routes to `index.html`, so deep links work.
- **Netlify:** deploy the project with build command `npm run build` and publish directory `dist`. `public/_redirects` handles the same rewrite.

## Privacy and data

- Everything runs in the browser. No account, server or external API is used.
- Progress, scan history and the case-file state are stored in this browser's LocalStorage only.
- The scanner stores a fingerprint of each message to prevent repeat XP. It never stores the message text.

## Notes

- All scenarios, messages and case files are fictional training material. None asks for real passwords, OTPs or financial details.
- The scanner is an educational, rule-based tool. It is not a certified security product and cannot guarantee whether a message is genuine.
