# EzyCourse Gallery: What We Know

Explored live on 2026-11-15 on the `demo1` tenant (read-only: nothing uploaded, moved or deleted).

## What it is
The **Gallery** is the media library of the whole owner dashboard. Any file the owner adds to anything
(a program's images, lesson videos, documents, audio) is stored in and chosen from the Gallery. It is not
specific to coaching.

## Where it opens
- The **Gallery** button in the top bar of every owner dashboard page opens the whole Gallery.
- Fields that need a file open the **same dialog** (title "Upload From Gallery"), limited to the kinds of file
  they accept. The coaching program **Feature Image** and **Banner Image** open it with only the **Image** and
  **Stock images** tabs, and a **Select** button to confirm the choice.
- **Escape** closes the dialog.

## Tabs of the full Gallery (top bar button)
| Tab | How an item is added | Accepted |
|---|---|---|
| Image | Click to upload | png, jpeg, jpg, gif, webp, svg |
| Stock images | pick from the built-in stock pictures (searchable) | n/a |
| Video | Click to upload, or **Upload Video From URL**; items can get **Add DRM** | mp4, mkv, mov |
| File/Doc | Click to upload | doc, docx, pdf, xls, ppt, xlsx, txt, pptx, html, ai, zip |
| Audio | Click to upload, or **Click to start recording** | mp3, m4a, wav, ogg, oga (only mp3 and m4a work in the app). "This tab is only used for the audio library." |
| YouTube | **Name** plus link `http://www.youtube.com/watch?v=<VIDEO_ID>`, then **Add** | private YouTube videos are not supported |
| Vimeo | **Name** plus link `https://vimeo.com/<VIDEO_ID>`, then **Add** | |
| Iframe Video | **Name** plus a custom video link (example `https://bunny.b-cdn.net/1677633594332.mp4`), then **Add** | |
| SCORM/HTML | Click to upload | zip |

Every tab (except Stock images) also has: a **Folders Path** (starts at **Home**), **Create New Folder**,
a **Search...** box, **Move files**, and a paginated list with page size 10 (for example "1-10 of 800 items").
Each file on the Image tab is a card with a picture named "Gallery" and its file name as a level 3 heading.

## Choosing items (verified 2026-11-15)
- A tab is a list item with the tab name in a paragraph. The open tab carries the CSS class `_active`. There is
  no ARIA state. After a click the new tab's own cards are showing straight away (measured over 8 switches, the
  previous tab's cards never lingered).
- Items are cards (`._mdl_glry_crd`, 10 per page in every tab). A chosen card gets `_mdl_glry_crd_active`.
- **Field pickers** (for example the coaching Feature Image) allow **one** choice: clicking a second card moves the
  choice. There is no check box and Ctrl or Shift does not add. The **Select** button is disabled until an item is
  chosen.
- **The top bar Gallery** allows **several** choices: each click toggles a card, Ctrl and Shift click add more, and
  the action button reads **Move N files**. It has no Select button.
- **YouTube and Vimeo** items cannot be chosen in the top bar Gallery (their cards have no check box). The other
  seven tabs can.
- **Stock images** has about 322,000 items (Unsplash photos, searchable). The first cards change from visit to
  visit, so pick by position, not by caption. Choosing one does **not** import it: the tenant's Image count stayed
  at 800 and the field's preview points at an `images.unsplash.com` address.

## Facts that affect test design
- The tenant Gallery is shared and large (800 images, 840 videos, 266 files, 110 audio, 121 SCORM). Tests never
  upload. The coaching form uses **Stock images**, which need no tenant file and add nothing to the tenant.
- The page object is `src/components/gallery/` (`GalleryComponent`): `openFromHeader`, `showTab(tab)`,
  `selectItems(tab, count)` (several only in the top bar Gallery; a field picker keeps one), `confirmSelection()` (field pickers) and `close`.
  Uploading, folders, moving and the link forms of the YouTube, Vimeo and Iframe tabs are not covered yet.

## Still unknown
Uploading, folders, moving files, DRM, the YouTube/Vimeo/Iframe forms (validation of the link), deleting items,
and what the Gallery looks like for a student.
