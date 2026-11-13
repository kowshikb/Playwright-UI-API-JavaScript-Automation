---
name: sync-docs-with-framework
description: >-
  Keep docs in sync after package.json, Jenkinsfile, README, folder, or behavior changes.
  Command catalog SoT is docs/Tracking-all-sites-commands.csv — do not maintain three full command lists.
---

# Sync documentation with framework changes

## When to use

- New/removed/renamed npm script or Jenkins `command`
- Folder structure change under `tests/`, `helpers/`, `testData/`, `.cursor/`
- User-facing run instructions change
- User says: sync docs / README outdated

## Source of truth (update the right place once)

| Change type | Must update | Optional / only if narrative changed |
|-------------|-------------|--------------------------------------|
| New/rename/delete **command** | `package.json`, `Jenkinsfile` (alpha), **`docs/Tracking-all-sites-commands.csv`** | README if in setup flow; one-line in guide skills **only if** those skills already document that feature area |
| **How to run** / params | `how-to-use-automation` | README |
| **Coding / agent rules** | `framework-standards.mdc` and/or `rules-md` | Router rule if skill index changes |
| **Folder map for agents** | `rules-md` | `how-to-use-automation` folder table (short) |

**Do not** copy the full command inventory into three skills. CSV (+ package.json) is enough for names; guide skills stay high-level summaries and must **not invent** script names.

## Checklist

- [ ] Same command **string** in package.json + Jenkinsfile + CSV (grep)
- [ ] README only if user-facing setup/env notes changed
- [ ] `how-to-use-automation` if run/onboarding/folder map for humans changed
- [ ] `automated-features-summary` / `high-level-scripts-and-features` — patch the **relevant rows** if you maintain those summaries; do not re-paste entire Jenkins list
- [ ] Router / standards / rules-md if agent conventions or folder map for coding changed
- [ ] No orphan references to removed scripts

## After remove

Delete from package.json, Jenkinsfile, CSV, and any skill/README mentions.
