# Team headshots

Portrait images for the people on the team page (`src/components/TeamPage.astro`).

## Naming

One file per person, named as the kebab-case of their name:

```
david-looberger.jpg
```

## Format

- **Ratio:** 4:5 portrait (the frame on the page is `aspect-ratio: 4/5`).
- **Size:** at least 800 × 1000 px. Larger is fine; it is scaled down by the
  browser, not the build.
- **File type:** `.jpg` or `.webp`. Keep each file under ~250 KB.
- The image is cropped to fill the frame (`object-fit: cover`), so keep the face
  centred with a little headroom.

## Hooking it up

Add a `photo:` line to that person's entry in `src/data/sv/team.yaml`, pointing at
the filename here:

```yaml
- id: 1
  name: David Looberger
  photo: david-looberger.jpg
  role: Senior Advisor · ex-Chief Architect SL
  ...
```

A member with no `photo:` keeps the current hatched placeholder, so photos can be
added one person at a time. The team list is Swedish-only, so this is the only file
to edit.
