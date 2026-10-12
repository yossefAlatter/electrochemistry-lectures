# Adding material

A lesson is a **JSON file**. You write one file such as
`content/lessons/lesson-8.json`, and the site picks it up: the directory is the
list of lessons, so there is nothing to register anywhere else. The components
in `components/kit` and the templates in `components/templates` decide how it
looks, so an author never lays out a page - they fill in data and the fixed
templates place it.

The nesting is:

```
Subject   Physical Chemistry          <- a subject area; others are expected
  Course  Electrochemistry           <- a group of lessons
    Lesson  lesson-8.json            <- has its own question bank
      Section  cottrell              <- ONE PAGE, with Next / Previous
```

Each **course** owns its own directory, so a second course is separated from
the first simply by where its files live. Electrochemistry reads
`content/lessons/`; the Spectroscopy course's lessons live in
`content/spectroscopy/lessons/`.

A lesson is a set of **short section pages**, and each section closes with its
own quick check. That structure is the whole design: no page is long enough to
feel like a wall, and a learner can stop after any section.

## Add a lesson

One file: `content/lessons/lesson-9.json`.

```json
{
  "slug": "lesson-9",              // becomes /lessons/lesson-9
  "label": "Lesson 9",             // sidebar text
  "title": "Electroanalytical methods",
  "summary": "One or two sentences, shown on the home page card.",
  "source": "Follows Bard & Faulkner ch. 12",   // optional credit line
  "order": 9,                      // sidebar ordering, lowest first
  "minutes": 60,                   // fallback if sections carry no minutes
  "intro": [
    { "kind": "para", "text": "Shown on the lesson contents page." }
  ],
  "constants": [
    { "symbol": "F", "name": "Faraday", "value": "96 485 C mol⁻¹" }
  ],
  "sections": [ /* see below */ ],
  "questions": [ /* see below */ ]
}
```

Save the file. The route `/lessons/lesson-9`, its cards, the sidebar entry and
the quiz all appear on the next build. `order` positions it in the sidebar; it
must be unique enough to land where you intend.

## Add a section to a lesson

Append an object to that lesson's `sections` array:

```json
{
  "id": "capacitors",              // URL segment, unique inside the lesson
  "tone": "indigo",                // one of the nine hues; see Colours
  "title": "Double-layer capacitance",
  "summary": "One-line card text. Say what the section answers.",
  "minutes": 7,                    // shown on the card and the section header
  "keyPoints": ["Worth memorising; also drives the quiz review."],
  "blocks": [ /* see below */ ],
  "cta": {                         // optional panel at the very bottom
    "title": "Next up",
    "body": "Why it matters.",
    "href": "/lessons/lesson-9",
    "linkLabel": "Go to Lesson 9"
  }
}
```

The route `/lessons/lesson-9/capacitors`, the card on the contents page, the
sidebar entry and the Next/Previous buttons are generated from `sections`, so
there is nothing else to add.

## Add a question

Questions live in the same file, in the `questions` array. A question's
`topicId` must match the `id` of a section in the **same lesson**, or the build
fails.

```json
{
  "id": "l9-mcq-001",             // unique across the whole site
  "topicId": "capacitors",        // must match a section id
  "quick": true,                  // optional: include in that section's check
  "question": "…",
  "options": ["…", "…", "…", "…"],  // exactly four
  "answer": 2,                    // index of the correct option (0-3)
  "explanation": "Why that is right, and why the nearest wrong answer is not."
}
```

Mark three questions per section with `"quick": true`. Those become the inline
**Quick check** at the bottom of the section page; everything else stays in the
full bank. If no question is flagged for a section, the first three of its
questions are used, so a section is never left without a check.

## Add a course or a subject

A **course** is a group of lessons in the sidebar; a **subject** is a group of
courses. Both are still plain objects in `content/index.ts`, because grouping
is a site decision rather than lesson content:

```ts
{
  slug: "physical-chemistry",
  title: "Physical Chemistry",
  tagline: "Postgraduate · light, matter and the spectra between them",
  description: "Shown on the subject block of the home page.",
  courses: [
    {
      id: "electrochemistry",
      title: "Electrochemistry",
      description: "Shown under the course title.",
      lessons: loadAllLessons(),
    },
    {
      id: "spectroscopy",
      title: "Spectroscopy",
      description: "Shown under the course title.",
      lessons: loadAllLessons(SPECTROSCOPY_LESSONS_DIR),
    },
  ],
}
```

Lessons inside a course are **discovered, not listed**: the `lessons` field is
filled by `loadAllLessons(dir)`, which reads every `*.json` in that course's
directory, sorted by `order`. Do not list lessons by hand. Each course has its
own directory - Electrochemistry uses the default `content/lessons/`, while
Spectroscopy passes `SPECTROSCOPY_LESSONS_DIR` from `content/load.ts`, where a
new course's directory constant is declared.

Adding a course is enough to give it a card on the home page, a course page at
`/courses/<id>` listing its lessons, and its own slice of the sidebar. Its `id`
must be unique across the site, because it is the URL segment; the page,
`generateStaticParams` and the sidebar all derive from the registry, so there is
nothing else to wire up. Prev/next on a lesson stays inside its own course.

## What you can write in `blocks`

Blocks are the body of a section, rendered in order by the section template.

| `kind` | Purpose | Fields |
| --- | --- | --- |
| `para` | body text | `text` |
| `heading` | in-page sub-heading, wired into the contents rail | `text`, `level?` (2 or 3) |
| `formula` | display maths (KaTeX) | `tex`, `caption?` |
| `figure` | a diagram from `public/figures` | `src`, `caption`, `alt` |
| `table` | comparison table | `head`, `rows`, `widths?` |
| `callout` | highlighted box | `variant`, `title`, `body` |
| `list` | bullets or numbers | `items`, `ordered?` |
| `worked` | worked calculation | `title`, `given`, `steps`, `result` |

Callout `variant` is one of:

| variant | Use it for |
| --- | --- |
| `key` | a rule worth remembering |
| `warn` | the mistake this section invites |
| `term` | the definition of a specific term |
| `note` | an aside that does not fit the flow |
| `example` | a concrete instance |

### How to structure a section

Sections are read for study, in order, so every section follows the same
skeleton. Keeping it means a reader always knows where they are.

1. **Open with the question.** First `para` states what the section answers,
   and what it needs from earlier sections.
2. **Teach in order of dependence.** Define a symbol at first use, in the
   sentence that needs it. Never use `i`, `η`, `n` or `δ` before the paragraph
   that defines it.
3. **Show a worked example.** At least one `worked` block per section that
   involves a calculation, including the unit conversions.
4. **Say where you meet this in real life.** A `key` callout: a concrete
   application - a datasheet number, a product, an industry, a failure.
5. **Name the trap.** A `warn` callout for the mistake that section invites.
6. **Bridge to the next.** Close with what the reader can now do and what
   comes next, so the lesson reads as one argument.

Use `heading` when a section is long enough to need signposts; each heading
appears in the in-page contents rail on wide screens.

### Text formatting

`text`, `body`, `caption` and `result` accept a small inline subset:

- `**bold**`
- `*italic*`
- `` `code` ``

### Maths

`formula.tex` is LaTeX for KaTeX and is rendered on the server, so nothing
maths-related is shipped to the browser. Display maths scrolls horizontally on
a narrow screen rather than overflowing the page.

Inside a `worked` block, write each step in LaTeX; each is rendered as a
displayed equation. In JSON, a backslash is already a literal backslash, so no
extra escaping is needed:

```json
{
  "kind": "worked",
  "title": "Levich current at 900 rpm",
  "given": "D = 7.0e-6 cm²/s, C* = 1.0e-5 mol/cm³, ω = 94.2 rad/s",
  "steps": [
    "D^{2/3} = (7.0\\times10^{-6})^{2/3} = 3.65\\times10^{-4}",
    "i_L = 0.620\\,nF\\,D^{2/3}\\,\\omega^{1/2}\\,C^{*}"
  ],
  "result": "9.2 mA cm⁻²."
}
```

Use `\\` inside a JSON string only where LaTeX itself needs a literal
backslash that begins a command (as above); a malformed formula is rendered in
red by KaTeX rather than crashing the page.

### Figures

Drop a PNG into `public/figures/` and reference it by file name:

```json
{ "kind": "figure", "src": "passivation.png", "alt": "…", "caption": "…" }
```

Always write a real `alt`: it is what a screen reader announces.

Modern figures are React SVG components rather than PNG files. Draw one in
`components/figures/`, register it by file name in `components/figures/index.ts`
(for example `"em_wave.png": EmWave`), and reference it from content exactly as
above. The page then draws the SVG inline: sharp at any zoom, theme-aware, and
made of real text. The `.png` suffix is just a stable name, so no image file is
needed. `tools/check_figure_fit.py` renders every registered figure in a real
browser and fails if any label runs outside the frame.

The 16 advanced diagrams are recoloured and redrawn by
`tools/advanced_figures.py`. The old primer set came from `tools/figures.py`,
which is now retired along with the Fundamentals lesson:

```bash
../electricial-chemistry/.venv/bin/python tools/advanced_figures.py    # advanced
../electricial-chemistry/.venv/bin/python tools/check_figures.py      # layout check
../electricial-chemistry/.venv/bin/python tools/check_legibility.py   # can a phone read it?
```

`check_figures.py` reports overlapping labels, labels pushed off the canvas,
and any figure referenced by content that does not exist on disk.

`check_legibility.py` then confirms the labels survive being scaled into a
phone-width column, which is the failure `check_figures.py` cannot see: a
figure can be perfectly laid out and still arrive with 5 px text. If you add a
figure, write its labels at 13 pt or larger and let the checker confirm the
canvas stays at 1000 px.

## Colours

Each section picks one of the nine tones listed in `app/globals.css`:
`azure`, `indigo`, `violet`, `rose`, `coral`, `amber`, `emerald`, `teal`,
`slate`. The tone drives the section's sidebar dot, heading numeral, links,
progress bar and quick-check panel, so a topic stays recognisable. Give
neighbouring sections different tones, and re-use a tone when the topics are
genuinely related.

Never hard-code a colour in a component. Use `var(--tone)`,
`var(--tone-soft)`, `var(--tone-line)`, or the semantic `--c-*` surface and text
tokens; both palettes then update in light and dark mode at once.

## Checklist before you commit

```bash
npm run check    # eslint + tsc
npm run build    # also validates every lesson file
```

The build fails, naming the file and the field, if a lesson file is malformed:
a question's `topicId` matches no section, an option list is not length four,
a `tone` is unknown, a duplicate section `id`, and so on.

## Quiz behaviour you get for free

- questions shuffled per attempt
- one question per screen, large tap targets, no horizontal scrolling
- the explanation appears the moment you commit, including for correct answers
- a results screen with the score and a review list of everything you got wrong
- per-section entry points: `/lessons/lesson-9/quiz?topic=capacitors`
