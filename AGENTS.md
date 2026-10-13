# AGENTS.md

This repo is a git-annex-style monorepo for the FreedomGovernment GitHub
organization: each top-level directory is a standalone project that was a
separate GitHub repo, vendored in here. Most content is legal/litigation
documents, not code. There is no root CI, build, or test.

## Kanban boards

This workspace belongs to the **FreedomGovernment** organization (Freedom Voting Machine). Its Kanban board slug is `freedom-gov`. All Kanban operations for FreedomGovernment work MUST explicitly target `freedom-gov` (`--board freedom-gov` / `board="freedom-gov"`).

- Never rely on the current-board pointer as a default; an ambiguous board is a routing error.
- If the assigned task's board does not match `freedom-gov`, report the mismatch before acting — do not silently switch.

## Markdown is the only working layer (mandatory)

- All `.docx`, `.pdf`, and scanned image files in the litigation repos have been
  converted to `.md` (python-docx / pypdf / OCR). Agents MUST read, search, edit,
  and reason over the `.md` files only. Do not open, parse, extract, or convert
  `.docx`, `.pdf`, or image files — they are source artifacts for e-filing and
  archival only.
- If a `.md` twin appears to be missing, say so and stop; do not fall back to the
  binary original.
- Scanned files whose conversion yielded no text are flagged in the `.md` with
  `[No extractable text]` — treat them as unavailable for reading.
- DOCX/PDF assembly is a separate, explicit export step for e-filing, performed
  only when a filing-ready file is requested.

## Levels of detail (LoD)

Every markdown document has a summary ladder: **LoD0** = the YAML frontmatter
`description` in the file's header; **LoD1** = `<name>.LoD1.md` (brief summary);
**LoD2** = `<name>.LoD2.md` (longer, medium-detail summary); **Full** = the source
`.md` itself. Triage at LoD0, orient at LoD1, decide at LoD2, and read the full
file only when the summaries don't answer the question. Do not hand-edit LoD files
(legal-assistant generates them); flag stale ones for regeneration.

## Layout

- `FreeLawGen/` — the main app: Next.js + TypeScript + Drizzle (Postgres),
  Chrome extension, Pandoc-based legal argument tooling.
- `McColloughVsPSU_/` — litigation file repo (MCCOLLOUGH v PSU, 3:23-cv-01582-AR,
  9th Cir. No. 24-7617); `.docx`/`.pdf` all have `.md` twins for reading.
- `INCVsBigTech/`, `McColloughVs4J/`, `JerryVsLaneCounty/`, `McColloughVsDeptEdu/`,
  `McColloughVsAiVantage/` — other case/file repos (documents only).
- `BallotHarvester/` — C++ Tesseract OCR app **and** a nested `.git` repo
  (annexed submodule; treat as its own repo).
- `FreedomVotingMachine/` — greenfield (code); docs/README + KiCAD hardware.
  Stack set 2026-09-10: ASCII Crabs core + CrabsBed (firmware, ex-CrabsTek,
  reclaims the defunct mbed-OS name, reuses `~/3P/mbed-os/`) + SubsecondDb
  (ledger/chain storage) + CrabsToolkit. See its `README.md` for the S-tier
  markdown-spec-tree → prompt-engineering build method and the
  vibe-code→inspect→core-update-plan sequencing.
- `WarRoomExtension/` — webpack/React Chrome extension (WikiSpy-based).
- `FreedomCookbook/`, `FreedomCoC/`, `FreedomCourt/`, `PropagandaOwl/`,
  `PropagandaPost/`, `BigTechCensorship/`, `HomeBumMobile/`, `SurvivalShelter/`,
  `UKR/`, `Videos/`, `_Art/` — docs/content only.
- `FreedomGovernment.github.io/` — Jekyll org site.

## Nested-repo traps (verified, easy to get wrong)

- `git ls-files` at root lists only ~19 paths: `BallotHarvester`, `FreeLawGen`,
  `FreedomCoC`, `FreedomCookbook` are gitlinks; most other project dirs are
  UNTRACKED (e.g. `WarRoomExtension`, `BigTechCensorship`, `*.code-workspace`).
  `git status`/`git diff` at the root will not show changes inside most
  subprojects — check inside the subproject directory.
- `BallotHarvester/.git` exists: it is its own repo. Commit/push inside it,
  not from the root.
- `.gitignore` only has a root `/node_modules`; subproject `node_modules`
  (e.g. `WarRoomExtension/node_modules`, `FreeLawGen/node_modules`) is NOT
  ignored — never commit it.
- Root `CMakeLists.txt` is an empty 0-byte stub; not a real build config.
- `.github/workflows/` contains no real workflows (only `settings.json`);
  old `release-*.yml` were deleted. Don't expect CI to run anything.

## Per-project commands

Subproject `AGENTS.md` files are the source of truth when working there:
`FreeLawGen/AGENTS.md`, `McColloughVsPSU_/AGENTS.md`, `INCVsBigTech/AGENTS.md`.
Note: `FreeLawGen/AGENTS.md` is partly stale (it describes webpack/Jest;
the project is now Next.js with scripts `dev`, `build`, `start`, `lint`,
`db:generate|push|migrate|studio` in its `package.json` — no test script).

- `FreeLawGen`: `npm run dev` / `npm run build` / `npm run lint`; DB via
  `npm run db:*` (Drizzle, `drizzle.config.ts`).
- `WarRoomExtension`: webpack scripts in its `package.json`
  (`webpack.{common,development,production}.js` + `config-overrides.js`).
- `BallotHarvester`: autotools/CMake C++ (`autogen.sh`, `CMakeLists.txt`),
  Docker for Tesseract.
- Litigation repos: no build/test; verification is manual (word counts, PDF
  page counts, DOCX integrity). `python-docx`/`pypdf` required for DOCX work
  and not preinstalled.

## Conventions

- License: Kabuki Strong Source-available (non-commercial, see `README.md`).
  Do not strip license headers from `.github/ISSUE_TEMPLATE/*.md`.
- Mission commits use the prefix-first MDD grammar defined below: `#<N> <title>` or `#<N>.A <sub-commit title>`.
- Litigation `Timeline/` files: date-prefixed `YYYY-MM-DD--Name.ext`; filed
  PDFs are snapshots — never edit, add a new dated file instead.
- Do not delete legal documents or evidence without explicit instruction.

## Mission-Driven Development and GitHub Guardrails

This workspace belongs to the **Freedom Government** GitHub organization (`github.com/FreedomGovernment`). The `freedom-gov` Hermes profile is the organization agent and owns authorized remote GitHub writes for repositories in `~/FreedomGovernment`. This root policy applies throughout the workspace; a nested `AGENTS.md` may add stricter project/build rules but may not weaken these GitHub safety gates.

### Mission issue contract

Development uses **Mission-Driven Development (MDD)**: the mission drives the development. Every mission solves a problem. Not every issue is a mission; a human or agent must explicitly take the issue on as a mission.

Every mission issue has this structure:

```markdown
## Problem

May be empty when the issue title fully states the problem.

## Solution

Required. State the intended or implemented solution.

### Files Affected

Required. Leave empty when no files are altered.
```

For multiple commits, add one ordered section per sub-commit under the issue description:

```markdown
## A

What sub-commit A solves and how.

## B

What sub-commit B solves and how.
```

### Branch and commit grammar

- Branch: `Issue<N>` where `<N>` is the actual GitHub issue ticket number. Example: ticket 26 → `Issue26`.
- `Issue123` in documentation means “Issue followed by the ticket number.” It is not the literal branch name unless the real issue is 123.
- One commit: `#<N> <title>` or `#<N>.A <sub-commit title>`.
- Multiple commits: start at `A` and advance in issue order: `#<N>.A`, `#<N>.B`, etc. Each suffix must have the matching `## A`, `## B`, etc. section in the issue body.
- If the suffix sequence becomes unwieldy (for example `ZA`), open another issue rather than extending the same mission indefinitely.

Multiple commits per issue are valid. Optimize each commit as durable training data for humans and LLMs:

- one coherent solution step and one reason to exist;
- a descriptive title that makes sense with the issue context;
- only files needed for that step;
- no drive-by cleanup, generated/build noise, secrets, or unrelated fixes;
- tests or other verification appropriate to that exact step;
- causal ordering when one sub-commit depends on another.

Do not make a giant mixed commit merely to reduce commit count. Do not create meaningless micro-commits merely to increase it. Let the mission define the unit.

### Required workflow

1. Confirm the request is a mission and identify the real issue number. If no issue exists, create or request one before committing.
2. Read the entire issue and comments. Confirm `## Problem`, required `## Solution`, and required `### Files Affected`; update the mission record as the solution evolves.
3. Identify the exact nested repository. Before any remote write, verify `git remote get-url origin` belongs to `FreedomGovernment`. A legacy, foreign, missing, or ambiguous owner is a hard stop requiring the Captain.
4. Start from the repository's intended base branch without discarding local work. Create or switch to `Issue<N>`; do not work on the default branch.
5. Inspect the repository's own `AGENTS.md`, dirty state, and relevant history. Preserve unrelated user changes.
6. Implement only the current mission/sub-commit scope. Update `### Files Affected` and the matching `## A`/`## B` section before committing.
7. Run real verification appropriate to the repository. Never fabricate a test, build, review, or CI result.
8. Review the staged diff for scope, secrets, generated files, binaries, and unrelated changes. Stage explicit paths; avoid blanket staging when the worktree contains unrelated edits.
9. Commit with the MDD grammar and push only to `Issue<N>`.
10. Hand off the issue number, branch, commit IDs, files affected, checks run, results, and residual risks. Human verification decides acceptance and integration.

### Remote-write boundary

The organization agent may create/update issues, create `Issue<N>` branches, push mission commits, and prepare pull requests when the Captain authorizes GitHub work. Shared specialist agents work through kanban and return artifacts; they do not receive or reuse this profile's GitHub credential.

Without explicit authorization for the exact action, never:

- push directly to `main`, `master`, or another protected/default branch;
- force-push or rewrite published history;
- merge or auto-merge a pull request;
- delete branches, tags, releases, repositories, issues, or evidence;
- change repository visibility, settings, rulesets, branch protection, webhooks, Actions secrets, deploy keys, collaborators, teams, or organization membership;
- publish packages/releases or edit workflow files merely to bypass a failing check;
- use admin/delete scopes when ordinary Contents/Pull requests/Issues permissions suffice.

Human verification is the merge gate. A successful push or green CI run is evidence, not permission to integrate.

### Credential isolation

- Store this organization's fine-grained GitHub token only in `~/.hermes/profiles/freedom-gov/.env`; prefer organization-limited or selected-repository access and short expiration.
- Never put the token in global `~/.hermes/.env`, another profile, git config, a repository `.env`, source, issue text, commit text, remote URL, shell history, logs, or chat.
- Do not echo, print, inspect, or transmit token values. Refer to credential variable names only.
- Do not reuse the Captain's owner/admin credential. Grant only Metadata read plus the minimum of Contents, Pull requests, and Issues needed for mission work. Add Actions read only when required; do not grant Administration or repository deletion.
- If authentication is absent or insufficient, stop and request the correctly scoped credential. Never broaden permissions or substitute another organization's token.

## Code Style — Chimera+ (AStarship Standard)

All **code and filenames** in the AStarship ecosystem follow the **Chimera+** style guide
(`~/AStarStarship/ASCIICrabs/__ChimeraPlus.md`). The naming philosophy applies to code
identifiers and filenames fleet-wide.

### Core Rule: immutable vs mutable
- **Immutable** (can't change after init) → **CamelCase**
- **Mutable** (changes at runtime) → **lower_snake_case**

### Naming Summary
| Element | Convention | Example |
|---|---|---|
| Type aliases (fixed-width) | 3-letter CAPS codes | `CHA` char8, `ISC` int32, `IUD` uint64, `BOL` bool, `FPC` float32, `FPD` double64 |
| Structs / classes | CamelCase + T(POD)/A(utoject) prefix | `TArray`, `AMap`, `Crabs` |
| Struct members (mutable) | lower_snake_case | `socket_bytes`, `header_bytes` |
| Struct members (immutable) | CamelCase | `StackTotalMin`, `ColumnWidth` |
| Free functions / methods | CamelCase, type-prefixed | `CrabsInit`, `TArrayBytes`, `TMapFind` |
| Function suffixes | `_NC` (no-check), `C` (const/count), `T` (POD), `A` (autoject) | `TArrayInsert_NC`, `CSizeMin` |
| Local variables | lower_snake_case (always) | `bytes_data`, `read_cursor` |
| Macros / #define | UPPER_SNAKE_CASE | `CRABS_RUN_TESTS`, `CPU_X64` |
| Private/protected members | trailing underscore | `aobj_`, `array_` |
| Namespaces | `namespace _ { ... }` | single shared underscore namespace |
| DB names / tables / columns | lower_snake_case (mutable) | `user_sessions`, `order_items` |
| Client-facing API / headers | CamelCase (immutable contract) | `OrderService`, `PaymentGateway` |
| Filenames (client contract) | CamelCase | `OrderService.h` |
| Filenames (host/storage) | lower_snake_case | `user_sessions.py` |

### Header Boilerplate (C/C++)
```
// Copyright AStarship <https://astarship.net>.
#pragma once
#ifndef CRABS_<NAME>_<H|HPP>
#define CRABS_<NAME>_<H|HPP>
#include "..."
#if SEAM >= CRABS_<NAME>
... body ...
#endif
#endif
```

### Formatting
- 2-space indent
- Opening brace same line (functions/control), next line (structs/classes)
- `D_ASSERT()`, `D_COUT()`, `D_RETURNT(type, val)` for debug/assert/return
- `NILP` = nullptr
- `alignas(ACPUCacheLineSize)` for hot structs
- Doxygen `/** @param @return @pre @link @see @code */` comments

### The One-Sentence Version
**Immutable → CamelCase, mutable → lower_snake_case; macros UPPER_SNAKE; private/protected
get a trailing `_`; types are short CAPS width-codes (CHA/ISC/IUD/BOL); structs are
CamelCase with T(POD)/A(utoject) prefix; functions are CamelCase with T/A kind prefixes
and _NC/C markers; locals are snake_case; everything lives in `namespace _`; every file
starts with AStarship copyright, `#pragma once`, a `CRABS_*` guard, and `#if SEAM >= CRABS_*`
gating.** The name tells you the kind, width, access level, and mutability — before you
read the body.