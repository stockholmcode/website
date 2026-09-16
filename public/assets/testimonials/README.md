# Testimonial author portraits

Small round avatars shown next to a testimonial on the homepage
(`src/components/HomeSections.jsx`). The frame is a 44 px circle.

## Naming

One file per person, named as the kebab-case of their name:

```
niklas-lager.jpg
pontus-hellgren.jpg
```

## Format

- **Ratio:** square. It is masked to a circle and cropped to fill
  (`object-fit: cover`), so keep the face centred.
- **Size:** at least 128 × 128 px.
- **File type:** `.jpg` or `.webp`, under ~100 KB.

## Hooking it up

Add an `avatar:` line to that testimonial's entry in `src/data/sv/testimonials.yaml`
**and** `src/data/en/testimonials.yaml` (the English file is a full copy, not a
patch — see MAINTAINING.md):

```yaml
- quote: >-
    ...
  name: Niklas Lager
  role: CTO, Blocket
  avatar: niklas-lager.jpg
```

A testimonial with no `avatar:` keeps the plain grey circle, so portraits can be
added one at a time.
