# AI Engineer Career Management System

A static, JSON-driven career workspace for transitioning into **Python Backend Engineering and AI/LLM Engineering** roles. Python and FastAPI are the active backend path. The profile keeps previous enterprise software experience as historical career context; the curriculum does not assign new practice in that former stack or claim professional Python experience.

## Run locally

The app uses fetch() to load JSON, so serve the project over HTTP rather than opening index.html directly.

python3 -m http.server 5500

Open http://localhost:5500.

## Architecture

- index.html — app shell, responsive navigation, and import preview dialog.
- css/style.css — responsive design system and page layouts.
- js/app.js — application initialization, navigation, migration gate, imports, and coordination.
- js/data-loader.js — fetches and validates static JSON and validates progress content references.
- js/storage.js — LocalStorage schema v3, migration, persistence, import/export, and validation.
- js/migration.js — explicit curriculum migration and saved-data recovery screens.
- js/dashboard.js, roadmap.js, projects.js, planner.js, challenges.js, interviews.js, journal.js, analytics.js, resources.js — focused feature modules.
- data/ — profile, 24-week roadmap, projects, challenges, interviews, resources, stack, routine, and readiness checklist.

## Python curriculum

Six phases and 24 weeks progress from Python foundations to FastAPI/PostgreSQL, LLM integration, RAG, LangGraph agents, production operations, portfolio work, and remote job preparation. Every week has an objective, topics, practical tasks, and deliverable. The profile retains previous work history as background only; active technology stack, project requirements, challenges, interviews, resources, and routines use the Python path.

The portfolio includes a traditional Task Management API and Authentication API alongside AI Document Intelligence, AI Business Assistant, LLM Evaluation Workbench, and Enterprise AI Assistant Platform. The coding challenge catalog includes more than 40 Python/backend/AI exercises and explanation notes. Resource links point to official project documentation.

## Data and extension

Static content lives in JSON; user progress stays in LocalStorage. data/roadmap.json contains six phases and 24 weeks. Add a week with a unique integer number, objective, topics, unique task IDs, and deliverable. js/data-loader.js currently validates exactly 24 weeks.

Add challenges to data/challenges.json with a unique ID, category/topic, difficulty, problem, requirements, hints, expected concepts, and solution explanation. Projects and milestone definitions live in data/projects.json; user completion and notes are kept separately in LocalStorage. Resources in data/resources.json include name, category, description, and official URL.

## Saved data and curriculum migration

The LocalStorage key remains ai-career-guide-v1; the state uses schemaVersion 3 and curriculumVersion 2. On first launch after this curriculum change, an explicit migration screen appears before the old value is changed. Choose Download backup & migrate or Migrate without downloading. You can also import a backup through the versioned import flow.

Migration preserves valid journal entries, dated study-session history, dated planner goals/custom tasks, daily target preference, selected week/calendar position, and notes for continuing project IDs. Historical study sessions keep their previous roadmap week in legacyWeek and are labeled as belonging to the previous curriculum. The migration clears old roadmap completion and week notes, old checklist/interview/challenge progress, and project milestone completions; it never maps those flags onto different Python work. These changes are shown before confirmation.

New backups include a backup version, schema version, curriculum version, export timestamp, preferences, and saved progress. Import previews the prepared data and requires explicit confirmation before replacing saved progress. Older version 1/2 progress backups are accepted when their shape is valid, migrated using the same preservation rules, and checked against the current JSON content IDs. Invalid or unknown references are rejected without changing current data. A corrupt or unsupported LocalStorage value is left untouched behind a recovery screen.

## Limitations

- Progress is local to one browser profile and does not synchronize across devices.
- A local HTTP server is required for JSON fetch().
- Coding challenges track attempts and notes; they do not execute user code.
- Interview questions do not provide authoritative answers.
- Study planning uses browser-local dates and has no reminders or external calendar sync.
- Cloud deployment exercises are curriculum guidance; this static workspace does not deploy projects itself.
