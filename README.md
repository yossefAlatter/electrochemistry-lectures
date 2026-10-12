# Physical Chemistry — Postgraduate

Lesson material and interactive questions for postgraduate physical chemistry.
The site currently carries two subjects: **Electrochemistry** (29 lessons plus
a problem set for each Bard & Faulkner chapter 1–17) and **Spectroscopy**
(course "Applications", 5 lessons). Mobile-first, statically generated, no
database and no server at runtime. In all: 51 lesson files, 226 sections and
1201 questions.

Built with Next.js (App Router), TypeScript and Tailwind CSS, with KaTeX for
the maths.

## How the content is organised

The unit you study is a **section**, and a section is a short page. Nothing on
this site is a wall of text.

```
Subject    Physical Chemistry        <- subject area, more are expected
  Course   Electrochemistry         <- group of lessons
    Lesson  lesson-1               <- has its own question bank
      Section  nernst               <- ONE PAGE, ends in its own quick check
```

A lesson is authored as one JSON file; the components and templates render it,
so adding material is purely additive.

```
content/
  types.ts              the shape of every block, section and question
  schema.ts             the JSON lesson schema + build-time validator
  load.ts               reads each course's lesson directory (server only)
  index.ts              the subject/course tree; lessons are discovered
  lessons/
    lesson-8.json       sections + questions for one lesson
  spectroscopy/
    lessons/
      emr-nature.json   a lesson in the second subject
```

`content/index.ts` exports the subject structure and fills each course's lesson
list from `loadAllLessons()`, which discovers `content/lessons/*.json` and
sorts them by `order`. The sidebar, the home page, every route and the quiz
filters all read through it.

**See [ADDING_A_LESSON.md](ADDING_A_LESSON.md)** for how to add a section, a
lesson, a course or a whole subject.

## Routes

| Route | What it is |
| --- | --- |
| `/` | home: one card per course |
| `/courses/[course]` | course page: what the course covers, then its lessons |
| `/lessons/[lesson]` | lesson contents: cards for each short section |
| `/lessons/[lesson]/[section]` | one section, with Next / Previous and a quick check |
| `/lessons/[lesson]/quiz` | the full bank for that lesson, shuffled |
| `/lessons/[lesson]/quiz?topic=[section]` | only the questions on one section |

All of these are prerendered at build time via `generateStaticParams`.

## Layout

- **Mobile first.** Below `lg` there is a sticky top bar with a hamburger and
  the sidebar is a slide-in drawer that traps the page behind an overlay and
  closes on Escape or on navigation.
- From `lg` up the sidebar is a permanent column.
- The sidebar follows the course you have open: on the home page it lists the
  courses, inside a course it lists that course's lessons, and inside a lesson
  it also lists that lesson's sections and marks the one you are reading.
- Buttons and links are at least 36 px tall on touch, and answer options are
  full-width rows.
- Nothing overflows horizontally at 360 px: long equations and wide tables
  scroll inside their own container instead of pushing the page sideways.

## Colour, fonts and dark mode

**Tones.** There are nine reusable accent hues (`azure`, `indigo`, `violet`,
`rose`, `coral`, `amber`, `emerald`, `teal`, `slate`). Every section declares
one in its lesson file:

```json
{
  "id": "nernst",
  "title": "The Nernst equation",
  "tone": "azure",
  "...": "the section's colour"
}
```

The page wrapper renders `data-tone={section.tone}`, and `app/globals.css`
turns that into three variables for the whole subtree:

| Variable | Used for |
| --- | --- |
| `--tone` | heading numerals, links, eyebrow labels, buttons, progress bars |
| `--tone-soft` | tinted panels: quick check, "worth memorising", worked examples |
| `--tone-line` | hairline borders on those panels |

So a topic keeps one colour in the sidebar, on its card, in its heading, in its
callouts and in its quick check. That is deliberate: the colour is a recall cue,
not decoration. Adjacent sections are always given different tones. To add a
tenth hue, extend `TONES` in `content/types.ts` and the two `:root` / `.dark`
blocks in `app/globals.css`.

**Semantic tokens.** Surfaces and text use `--c-*` tokens (`--c-page`,
`--c-surface`, `--c-ink`, `--c-rule`, ...). Components should use those, or
`var(--tone)`, rather than raw hex values. Every text tone clears WCAG AA
(4.5:1) against both the page background and its own soft tint; `tools/check_site.py`
plus a browser audit is how that is kept honest.

**Dark mode** is class-driven (`.dark` on `<html>`) rather than
`prefers-color-scheme`, so the toggle can override the OS. A tiny inline script
in `app/layout.tsx` applies the stored choice before first paint, so there is
no white flash; the choice is kept in `localStorage` under `pc-theme`.
`components/ThemeToggle.tsx` reads the class with `useSyncExternalStore` and is
placed in both the mobile top bar and the sidebar.

**Fonts** are self-hosted at build time by `next/font`, so a visitor makes no
third-party request:

- headings: **Fraunces** (variable, optical sizing)
- body: **Inter**
- code and symbols: **JetBrains Mono**

## Maths

Display maths is rendered on the server with KaTeX, so the maths library is
never sent to the browser.

## Questions

Each question carries a `topicId` matching a section id and one of four kinds:
`mcq` (single choice, the default), `multi` (select all that apply),
`truefalse` (true/false) and `numeric` (a number, checked within a tolerance).
`components/QuestionCard.tsx` is the single player for all four; the quiz and
the quick check differ only in the questions they feed it.

A few questions per section are flagged `quick: true`; those become the inline
**Quick check** at the bottom of the section page, so a learner can test
themselves without leaving the page. Everything else stays in the full bank,
which is where the shuffled end-to-end quiz comes from.

Lesson 1's questions were exported from the verified question bank in the
sibling `electricial-chemistry` project, whose `tools/check_questions.py`
recomputes all 65 printed numeric values against the printed working. The
export is a one-time step; the file is then edited like any other source file.

The 17 problem-set lessons (`content/lessons/problems-1.json` through
`problems-17.json`) are original problems written in the style of each Bard &
Faulkner chapter's exercises and attributed to that chapter; none of the book's
exercises are copied.

## Figures

The old Fundamentals primer diagrams were drawn by `tools/figures.py`. The
primer has been replaced by the shorter L0, so that script and its PNGs are now
retired; it is kept only as the drawing example below. The figures used by the
lessons are the advanced set described further down.

```bash
../electricial-chemistry/.venv/bin/python tools/figures.py         # legacy primer figures
../electricial-chemistry/.venv/bin/python tools/check_figures.py   # layout + reference check
../electricial-chemistry/.venv/bin/python tools/check_legibility.py  # can a phone read it?
```

`check_figures.py` detects overlapping labels, labels pushed off the canvas,
and any figure referenced by content that is missing from disk - the failures
that are invisible in the source but obvious on the page.

`check_legibility.py` answers a different question: whether the text is big
enough once the browser scales the image into a phone-width column, which is
about 360 css px. A 10 pt label on a 1400 px PNG arrives at roughly 5 css px -
technically present, practically invisible. The arithmetic is

```
css_px = points * dpi / 72 * (viewport_px / image_px)
```

which is why every figure drawn that way was exactly 1000 px wide at 200 dpi: at
that size one point lands on one css px, so the font sizes in `tools/figures.py`
can be read directly as the phone size they become. `figures._save` pins the
canvas to 1000 px and `check_legibility.py` fails the build if a figure comes
out wider, since a wider canvas means smaller text. Both scripts also draw
captions through the same helper, so caption text is measured too.

The 16 advanced Lesson 1 diagrams are drawn by
`../electricial-chemistry/echem_guide/figures.py` - the same script that
produces the printed guide, so the printed and web versions can never drift.
`tools/advanced_figures.py` imports it, swaps its palette for the site's, and
writes the PNGs here:

```bash
../electricial-chemistry/.venv/bin/python tools/advanced_figures.py  # recolour + redraw
```

## Icons

`app/icon.svg` is the app icon; `tools/make_icons.py` redraws the same geometry
into the formats that cannot read SVG:

```bash
../electricial-chemistry/.venv/bin/python tools/make_icons.py
```

It writes `app/favicon.ico` (16-256 px), `app/apple-icon.png` (180 px) and the
`public/icons/icon-192.png` / `icon-512.png` pair referenced by
`app/manifest.ts`. The design is four shapes - a tile, two electrode bars, the
wire joining them and the solution they stand in - because that is all that
survives at 16 px.

Both figure scripts draw in the palette from `app/globals.css`, so a diagram and
the section it illustrates share a hue.

## Attribution

Notes and questions by Yossef Hafez Alatter. Course instructor: Abla Hathout.