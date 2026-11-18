# AI Engineer Career Management System

A browser-local career tracker for an experienced .NET engineer in Bangladesh transitioning into remote Applied AI and AI Backend roles. The curriculum uses Python as its primary implementation language and uses .NET experience as enterprise backend evidence.

- **Remote jobs** tracks eligibility, UTC overlap, application dates, portfolio evidence, pipeline status and follow-ups.
- **Roadmap and topic syllabus** cover 44 learning units and 18 stages with exercises, target depth, evidence and assessments.
- **Portfolio** defines 13 builds from a Python CLI through enterprise RAG, ERP workflows and a production AI SaaS capstone.
- **Study schedule** offers 4-, 6- and 8-hour daily plans and project assessment gates.

## Stack

- React 19, TypeScript strict mode, Vite, React Router
- Tailwind CSS 4 plus a small application stylesheet for the design system
- Lucide React, Recharts, Zod
- LocalStorage for user progress and external JSON for static content
- Vitest, React Testing Library, jsdom

There is no backend, server-side account, database service, or build-time content generator. Vite serves the frontend and JSON assets.

## Run locally

Use Node.js 20.19+ or 22.12+ (Node 24 recommended) and npm:

```sh
npm install
npm run dev
```

Open `http://localhost:5500`. Vite uses port 5500 to match the previous static app origin, allowing the browser to see the existing LocalStorage key when the old app was opened at `http://localhost:5500`. Stop any old server on that port first. LocalStorage is origin-scoped: if your previous app used another hostname or port, export its progress there and import that JSON into this app. Production build and preview:

```sh
npm run build
npm run preview
```

Quality checks:

```sh
npm run typecheck
npm test
```

## Project structure

```text
public/data/                 Static curriculum JSON, fetched at runtime
src/app/                     Router, app entry, progress context
src/components/              Shell and shared interface components
src/pages/                   Dashboard, roadmap, planner, projects, practice, journal, analytics, settings
src/services/dataService.ts  Fetch + Zod validation of JSON assets
src/services/storage/        Versioned LocalStorage, migrations, import/export
src/types/                   Shared application data and progress types
src/utils/                   Date and streak helpers
src/styles/                  Tailwind entry and responsive design system
 tests/                       Storage, migration, backup, progress, and date tests
backups/vanilla-python-career-guide/  Original Vanilla JS source snapshot
```

## Static curriculum data

The front end loads and validates its curriculum from `public/data/`. `roadmap.json` lists 44 ordered learning units. `syllabus.json` provides 18 stages and detailed topics with stable identifiers, four-part time budgets, practice, oral checks and pass criteria. Canonical resource names referenced by either must exist in `resources.json`. The other assets define the diagnostic profile, schedules, 12 portfolio builds, technology selection, challenges, interview questions and remote readiness.

Browser storage keeps topic assessment evidence, remote applications, study records and preferences. Settings exports include these records.

## LocalStorage and migrations

The storage service uses `ai-career-guide-v1` and schema version 4, with curriculum version 5. UI components do not access LocalStorage directly except the recovery/export boundary; state changes go through the context and validated storage service. Missing data uses a safe empty state. Invalid JSON is not overwritten automatically.

On an older saved version, the migration gate previews record counts. To migrate browser storage directly, open the React app at the exact same scheme, hostname, and port used for the Vanilla app (the default is `http://localhost:5500`). The storage schema remains version 4; the curriculum version has advanced as project identities and milestone catalogs change. Existing saved records require explicit confirmation before migration. Roadmap, checklist, challenge, interview, and changed project milestone completion flags are not mapped to unrelated work. Journal entries, valid dated planner tasks/goals, study session dates/durations/topics, and notes for matching project identities are carried forward. Old week references on sessions are detached from the new curriculum, and the selected week resets to week 1. The old LocalStorage value remains untouched until the user chooses migration; the user can download a source backup first.

The original Vanilla JS implementation is kept in `backups/vanilla-python-career-guide/` as a source snapshot. It contains source and content files, not browser LocalStorage: browser data cannot be read from another device or copied into project files. Migration reads the saved key in the user's current browser.

## Backup and restore

Settings → Export JSON downloads a versioned backup containing user progress and settings. Restore reads and validates the file, previews affected record counts, asks for confirmation, and creates an independent recovery copy of current progress before replacing the active state. Backups from the prior Vanilla JS format are supported when their version and data validate. Invalid or future-schema backups are rejected without changing active progress. Reset asks for confirmation and downloads a backup before clearing the active state.

Backups are local files; store them somewhere safe. Clearing site data in the browser removes the active LocalStorage copy.

## Tests

Tests cover storage shape validation/persistence, roadmap progress math, migration preservation boundaries, legacy backup import, invalid backup rejection, and local date/streak calculations. UI flows are built from these service functions, but visual browser automation is not included in this repository.

## Limitations

- Progress is device/browser-local; there is no account sync or server backup.
- Curriculum content is static JSON and is not editable in the application.
- Backup import is a full replacement after explicit confirmation rather than a merge.
- Study time is based only on sessions the learner records.
- Package installation and checks require npm registry access or a populated npm cache.
