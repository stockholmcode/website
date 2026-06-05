# Maintaining the site

A guide for keeping the words on the site current without needing a developer. It assumes
no coding background. If you can edit a text file and click a button, you can run this site.

For how the site is built and why, see [docs/architecture.md](docs/architecture.md) and
[docs/decisions.md](docs/decisions.md). This guide is only about day-to-day upkeep: changing
copy, fixing a typo, updating a stat, adding a client logo.

## The one thing to understand

All the words on the site live in plain text files, separate from the design and the code.
You edit a word, save, and the site rebuilds itself and goes live a minute or so later. You
never touch the layout, the colours, or the programming to change copy. Those are a different
job (see [Things that are not a content edit](#things-that-are-not-a-content-edit)).

The text files are written in **YAML**, which is just a structured way of writing
"label: value". You will recognise most of it on sight.

## Where the words live

Everything editable is under `src/data/`, split by language:

- `src/data/sv/` is the **Swedish** site (the original, the source of truth).
- `src/data/en/` is the **English** site.

The two folders mirror each other. `team.yaml` in `sv` is the Swedish team page; `team.yaml`
in `en` is the same page in English. The file names tell you what they hold: `cases.yaml` is
the case studies, `offerings.yaml` the services, `testimonials.yaml` the quotes, and the
`<name>_page.yaml` files (like `team_page.yaml`) hold a single page's own headings and intro
text. The full naming convention is in
[architecture.md](docs/architecture.md#content-pipeline) if you need it.

To change a sentence on the Swedish site, find it in the matching `sv` file. To change its
English counterpart, make the same edit in the matching `en` file. **They are independent: a
change to Swedish does not change English.** You almost always edit both.

One exception: `clients.yaml` exists only in `sv`. It is a list of company names, identical in
both languages, so the English site reuses the Swedish one automatically. If you add a client,
add it there once.

## Making a change

The easiest way, with nothing to install, is GitHub's built-in editor in your browser:

1. Open the repository on GitHub and navigate to the file, for example
   `src/data/sv/team_page.yaml`.
2. Click the pencil icon (top right of the file) to edit it.
3. Change the text. Keep the part before the colon (`intro:`) and change only the words after
   it.
4. Scroll down, write a short note of what you changed (for example "Update team headcount"),
   and click **Commit changes** onto the deploy branch.

That commit is the publish. There is no separate "deploy" step.

## Publishing and checking it worked

When you commit, GitHub automatically builds the site and publishes it. This takes roughly a
minute. You can watch it under the repository's **Actions** tab: a yellow dot means it is
building, a green check means it is live, a red cross means something is wrong (see below).

The build is also a safety net. If your edit broke the file's structure, the build fails and
**the broken version never goes live**, the previous good version stays up. You cannot take
the site down with a bad edit; the worst case is your change does not appear and you get a red
cross to investigate.

## Five rules for editing safely

YAML is forgiving until it isn't. These are the only ways a copy edit usually goes wrong:

1. **Keep the indentation.** YAML uses leading spaces to show what belongs to what. If a line
   starts with two spaces, keep two spaces. Do not swap spaces for tabs. When in doubt, match
   the lines around it exactly.

2. **Quote any value that contains a comma or a colon.** This is the one that bites. On lines
   written in the compact `{ ... }` style, a comma ends the value, so an unquoted comma
   silently cuts your text in half. Wrong:

   ```yaml
   - { num: '100', label: senior level, no juniors }
   ```

   That publishes as just "senior level"; everything after the comma vanishes. Right, wrap the
   value in straight quotes:

   ```yaml
   - { num: '100', label: 'senior level, no juniors' }
   ```

   The same applies to a colon inside a value (`label: 'Note: ...'`). When a sentence has a
   comma or colon, quote it and you are safe.

3. **Do not change the "machine" values.** Some lines are wiring, not words: anything after
   `to:` (a link target), `sectorKey:`, `filter:`, `cat:`, `key:`, `id:`, `href:`, `email:`,
   and the bare numbers in `num:`. These must stay **identical in the Swedish and English
   files**, because the page's buttons and filters match on them. Translate the `label:` next
   to them, never the key itself. The reasoning is in
   [architecture.md](docs/architecture.md#routing-and-i18n).

4. **An English file is a full copy, not a patch.** If an English file exists, it completely
   replaces the Swedish one for that page. So when you edit English, make sure the whole file
   is present and correct, not just your one new line. (If an English file were deleted
   entirely, that page would fall back to Swedish, which is the safety behaviour, not a thing
   to rely on for live copy.)

5. **Leave the punctuation style alone unless you mean to change it everywhere.** The copy
   uses a particular house style (the long dashes, the № numbering). If you want to change
   that, it is a deliberate decision across both languages, not a one-off.

## When the build goes red

A red cross in the **Actions** tab means the latest edit broke the file structure, almost
always rule 1 (indentation) or rule 2 (an unquoted comma or colon). The live site is
unaffected; it is still showing the last good version.

To fix it, either correct the file and commit again, or, if you are unsure what broke, open the
commit you just made and revert it (GitHub has a **Revert** button on a commit). Reverting puts
the file back exactly as it was and the red cross clears on the next build. Then try the edit
again more carefully, or hand it to a developer with the error from the Actions log.

You cannot make this worse by trying. Every commit is reversible and nothing reaches visitors
until the build is green.

## Things that are not a content edit

These need a developer, not this guide. They change structure or design, not just words:

- Adding a **new page** or a **new section** to an existing page.
- Adding a **new language** beyond Swedish and English.
- Changing **colours, fonts, spacing, or layout**.
- Anything involving the files under `src/components/`, `src/pages/`, or `src/lib/`.

The steps for adding a page or a locale are written down in
[architecture.md](docs/architecture.md#adding-a-page) so a developer can follow them quickly.

## Quick reference

| I want to...                          | Edit this                                          |
| ------------------------------------- | -------------------------------------------------- |
| Fix Swedish copy                      | the matching file in `src/data/sv/`                |
| Fix the same text in English          | the matching file in `src/data/en/`                |
| Change a page's heading or intro      | `src/data/<lang>/<page>_page.yaml`                 |
| Add or edit a case study              | `cases.yaml` (in both `sv` and `en`)               |
| Add or edit a service                 | `offerings.yaml` (in both)                          |
| Add or edit a testimonial             | `testimonials.yaml` (in both)                       |
| Update a team stat                    | `team_page.yaml` (in both)                          |
| Add a client name                     | `src/data/sv/clients.yaml` (Swedish only)          |
| Publish                               | commit the change; the build does the rest          |
