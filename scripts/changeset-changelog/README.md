# Proposal: changeset-sourced changelog

> **Status:** proposal / prototype. Nothing here is wired into the live release
> flow yet. The existing `scripts/releaseChangelog.mjs` remains the source of
> truth until this is accepted.

## Problem

The release version (`patch` / `minor` / `major`) is chosen **manually** at
release time in `scripts/createReleasePR.mjs` (`selectVersionType` prompt). The
maintainer eyeballs the merged PRs and guesses the bump. There is no record of
each PR's intended semver impact.

## Goal

Declare the semver bump **intentionally at the PR level** so the release version
is computed deterministically — no guesswork at release time — while keeping the
current changelog output essentially unchanged.

## Approach

Adopt [changesets](https://github.com/changesets/changesets) for **bump intent
and version computation**, and source the **changelog body** from the changeset
files too, rendered in the existing MUI X format.

- Each PR that changes published `packages/x-*` source adds a `.changeset/*.md`
  file declaring the affected package(s), the bump, and a human-readable
  summary (which becomes the changelog entry — multi-line allowed).
- At release time, `changeset version` computes versions; this tooling renders
  the changelog.

### Hybrid coverage

| Changelog section                                                            | Source                    |
| :--------------------------------------------------------------------------- | :------------------------ |
| Product sections (Data Grid, Pickers, Charts, Tree View, Scheduler, Codemod) | **changeset files**       |
| Docs / Core / Miscellaneous                                                  | commit scrape (unchanged) |
| Contributors + highlights                                                    | GitHub API (unchanged)    |

A changeset is required **only** when published source changes — docs/test/
internal PRs are exempt. Renovate PRs are exempt.

## Conventions

- **Lowest tier only.** A change to the base package lists only `@mui/x-data-grid`;
  Pro/Premium inherit via the "Same changes as ..., plus:" line. A Pro-only
  change lists `@mui/x-data-grid-pro`. CI enforces "at most one tier per product".
- **`tag` frontmatter** (optional) sets the `[Tag]` bullet prefix for
  component-level precision (for example, `DateRangeCalendar`). Omitted → defaults from
  the package (`x-data-grid` → `DataGrid`).
- **`pr` / `author` frontmatter** (optional) override attribution. When absent,
  the generator git-blames the changeset file to its PR squash-merge commit.

Example changeset:

```md
---
'@mui/x-data-grid': minor
tag: DataGrid
---

Fix scrollbar disappearing after multiple resizes.

Optional extra detail rendered as an indented continuation line.
```

## Files

| File                                          | Role                                                        |
| :-------------------------------------------- | :---------------------------------------------------------- |
| `config.mjs`                                  | Product → tier map, default tags, package index (shared)    |
| `generate.mjs`                                | Render changesets → MUI X changelog format                  |
| `validate.mjs`                                | Pattern checks (bump, tier convention, tag, summary)        |
| `sample/.changeset/`                          | Example changesets for the prototype                        |
| `../../.github/workflows/changeset-check.yml` | CI: validate patterns + require changeset on source changes |

## Run

```bash
# Render (defaults to root .changeset; pass a dir to override)
node scripts/changeset-changelog/generate.mjs scripts/changeset-changelog/sample/.changeset

# Validate (defaults to root .changeset)
node scripts/changeset-changelog/validate.mjs scripts/changeset-changelog/sample/.changeset
```

## Not done yet (follow-up if accepted)

- Replace the manual parser in `generate.mjs` with `@changesets/get-release-plan`
  (handles bump computation + which packages bump).
- Merge the rendered product sections with the existing Docs/Core/Miscellaneous
  and contributors/highlights sections into the final `CHANGELOG.md`.
- Resolve git author name → GitHub login via the API (git name ≠ login).
- Wire `changeset version` into `createReleasePR.mjs`, replacing the prompt.
- Add `.changeset/config.json`: `fixed` group for the synchronized stable
  packages, Scheduler independent, `changelog: false`.
