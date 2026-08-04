# CLAVES Quest

A gamified reading & language adventure for kids, inspired by the public
structure of the [CLAVES curriculum](https://www.clavescurriculum.net/) —
metalinguistic awareness, dialogic discussion, morphology/syntax, and a
6-day text cycle + 3-day writing cycle. All game content (vocabulary,
word-building clues, discussion prompts, story scaffolds) is original
writing built around that structure. No text, images, or slides from the
published CLAVES materials or their mentor texts are included.

Kids collect **keys** (🔑 — "claves" is Spanish for "keys") by completing
activities, unlocking new lands as they go.

## Running it

No build step, no npm install — it's plain HTML/CSS/JS. Serve the folder
with any static file server and open it, for example:

```bash
python3 -m http.server 8420
```

Then visit `http://localhost:8420`. (Opening `index.html` directly with
`file://` also mostly works, but a local server avoids occasional browser
quirks with the confetti canvas and print preview.)

If you're using Claude Code's browser preview tools, a `.claude/launch.json`
is already set up — just start the `claves-quest` configuration.

## Structure

```
index.html          shell + script load order
css/styles.css       whole design system (playful, kid-friendly, mobile-first)
js/utils.js          tiny DOM helper (h()), shuffle, confetti, a11y announce
js/sound.js          synthesized sound effects via Web Audio (no audio files)
js/data.js           ALL game content — lands, cycles, activities
js/store.js          localStorage-backed progress: keys, stars, journal
js/games/vocab.js         "Word Den" memory-match vocabulary game
js/games/wordbuilder.js   "Word Builder" / "Sentence Builder" (morphology + syntax)
js/games/discussion.js    "Discussion Circle" dialogic reflection activity
js/games/writersdesk.js   "Writer's Desk" plan -> draft -> publish cycle
js/app.js            screen router, topbar, reward-overlay flow
```

Everything is loaded as classic `<script>` tags (no bundler, no ES modules)
attached to a single `window.Claves` namespace, so it runs anywhere without
a build step.

## Current content

- **Key Cove** (intro) — warm-up vocabulary, word-building, and discussion.
- **Wolf Woods** (Unit 1, Cycle 1) — ecosystems & wolf reintroduction themed.
- **River Rise** (Unit 1, Cycle 2) — water protection & community themed.
- **Author's Isle** (Unit 1, writing cycle) — plan, draft, and publish a
  nature-helper story, with a printable "published" page.

## Adding Unit 2 / Unit 3

The game engine is fully data-driven — nothing in `js/games/*.js` or
`js/app.js` is unit-specific. To add a new land:

1. Append a new entry to `Claves.DATA.lands` in `js/data.js` with a unique
   `id`, a `theme` letter, and an `activities` array (see existing lands
   for the shape each activity `type` expects: `vocab`, `wordbuilder`
   (`mode: "morphology"` or `"syntax"`), `discussion`, `plan`, `draft`,
   `publish`).
2. If you introduce a 5th theme color, add `--land-e` variables and
   `.land-e` / `.land-e-theme` rules to `css/styles.css` following the
   existing `--land-a` through `--land-d` pattern.

That's it — the map, unlock logic, keys, badges, and all mini-games pick up
new lands automatically.

## Notes

- Progress (name, stars, keys, journal, writing drafts) is saved to
  `localStorage` per browser — there's no account system or backend.
- A "Reset Progress" button lives on the Badges screen for starting over.
