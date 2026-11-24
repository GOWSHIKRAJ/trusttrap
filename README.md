# TrustTrap 2.0

**Experience the threat. Learn to defend.**

TrustTrap 2.0 is an interactive digital safety platform. It lets people experience a fictional phishing attack, compare an unsafe choice with a safe one, analyse suspicious messages with a transparent rule-based scanner, learn prevention skills, find official security tools and track their own progress.

Everything runs in the browser. There is no backend, no database, no authentication, no API keys and no environment variables.

## Features

- **Homepage** with a CSS-built smartphone showing a suspicious lock-screen notification.
- **Message experience**: a realistic messaging app. The suspicious link opens a confirmation dialog with two choices: continue to the local simulation, or go back and inspect.
- **Attack simulation** (fictional): fake verification page, cinematic compromise timeline with skip, incident report, explanation, recovery guidance, replay, and mute control.
- **Threat Analyzer**: local rule engine with 15 transparent rules, a 0–100 explainable score, four risk levels, highlighted phrases, copyable summary and six fictional examples.
- **Learning Centre**: 10 lessons, each with an example, warning signs, prevention steps, a quiz with feedback and completion tracking. Includes a local password-strength challenge.
- **Protection Toolkit**: 6 categories and 12 tools with detail pages covering purpose, benefits, limitations, platforms, installation, usage, safety tips and official links only.
- **My Journey**: progress stats, badges, empty state and reset with confirmation.
- Responsive layout (360px to 1440px), keyboard accessibility, visible focus states and `prefers-reduced-motion` support.

## Technology stack

- React 18, React Router 6, Vite 5
- Plain CSS with design tokens (no CSS framework)
- LocalStorage for progress and preferences
- WebAudio API for simulation sound cues (optional, mutable)
- Google Fonts: Space Grotesk, DM Sans, IBM Plex Mono (loaded from `index.html`)

## Folder structure

```
trusttrap-2/
  public/              favicon
  src/
    components/        Navbar, Footer, PhoneMockup, Modal, Toast, RiskMeter, Quiz, PasswordChecker
    pages/             Home, MessageCentre, AttackSimulation, ThreatAnalyzer, LearningCentre,
                       LessonDetail, ProtectionToolkit, ToolDetail, MyJourney, NotFound
    data/              scenarios.js, lessons.js, tools.js, detectionRules.js
    utils/             scamAnalyzer.js, progress.js, useProgress.js, sound.js
    styles/            global.css (tokens, base, components), responsive.css
    App.jsx            routes and layout
    main.jsx           entry point
  package.json
  vite.config.js
  index.html
```

## Installation and commands

Requires Node.js 18 or newer.

```bash
npm install        # install dependencies
npm run dev        # start the development server (http://localhost:5173)
npm run build      # create a production build in dist/
npm run preview    # serve the production build locally
```

For static hosting, serve `dist/` and configure a fallback to `index.html` so deep links such as `/learn/passwords` load correctly.

## How the simulation works

The simulation is a fictional scenario with no real effects. The "bank" is a fictional brand, and its URL uses the reserved `.example` domain. Nothing is loaded from the internet, no malicious URL is ever opened, and no input is submitted. Username and password fields are cosmetic and their values are never read, stored or sent. The compromise timeline is a timed animation with a skip option. The incident report describes a simulated breach. Recovery guidance points to official resources, including cybercrime.gov.in and the National Cyber Crime Helpline (1930) in India.

## How the scam analyzer works

1. Input is normalised: zero-width characters are removed, line endings are unified and spacing is collapsed.
2. Each rule in `src/data/detectionRules.js` has a name, a regular-expression trigger, a risk weight, an explanation and a recommended action.
3. Every matched rule adds its weight to the score. The total is capped at 100. The score is never random.
4. Levels: 0–24 low, 25–49 medium, 50–74 high, 75–100 critical.
5. Verdicts distinguish a suspicious message, a suspicious link, a suspicious download request and a potential phishing attempt. The analyzer never labels a message as malware.
6. Matched phrases are highlighted in the message. Clicking or hovering one shows why it matters.

To add a rule, append an object to `RULES`. To tune the scoring, change the `weight` values.

## How LocalStorage is used

| Key | Contents |
| --- | --- |
| `trusttrap:progress:v2` | Counts of simulations, safe and unsafe decisions, analyses and activities; lesson completion; quiz scores as percentages |
| `trusttrap:muted` | Sound preference (`1` muted, `0` on) |

Message text, password inputs and personal information are never stored. The password checker runs only in component state and clears when the page is left.

## Security and accuracy limitations

- The Threat Analyzer checks text patterns. It cannot confirm whether a link or file contains malware, and it cannot verify a website.
- The site does not scan devices, install software, guarantee account security or recover stolen accounts.
- The security tools are listed for guidance only. The site does not install them. Pricing, platform support and features change, so check the official vendor pages before you rely on them.
- Sample messages, the bank, and all domains are fictional.

## Testing checklist

**Homepage:** navbar works on desktop and mobile; phone renders; notification opens the message experience; both CTAs navigate.

**Message experience:** inbox opens chat; link opens confirmation; "Go Back and Inspect" closes it; "Continue to Simulation" starts the simulation; "Analyze first" opens the analyzer with the message loaded.

**Attack simulation:** fake page shows warnings; compromise timeline runs and skip works; incident report, explanation and recovery appear; "Learn How to Prevent This" and "Try the Safe Path" navigate; replay restarts; mute persists.

**Threat Analyzer:** empty input shows a validation message; paste, clear and example selection work; different messages give different scores and explanations; highlights explain on click or hover; copy summary and scan-another work.

**Learning Centre:** all 10 lessons open; quiz feedback appears; completion saves; the password challenge works; progress reflects on the learning page.

**Protection Toolkit:** categories jump correctly; every tool detail page opens; official links open in a new tab.

**My Journey:** empty state shows for new users; stats and badges update; reset asks for confirmation and clears data.

**Overall:** no console errors in the production build; no horizontal overflow at 360, 390, 768, 1024 and 1440px; no backend calls.
