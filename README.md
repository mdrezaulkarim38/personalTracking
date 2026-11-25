# Senior Remote .NET + AI Career Studio

A browser-local career workspace for **Md. Rezaul Karim**, a Bangladesh-based software engineer targeting senior remote backend and AI engineering roles. The plan builds on professional C#, ASP.NET Core, SQL Server and ERP/CRM/accounting experience, then develops stronger evidence in production AI integration, system design, operations and technical leadership.

## Career direction

**Positioning:** Senior .NET backend engineer specializing in dependable AI integration for business software.

**Target roles:** Senior .NET Backend Engineer, Senior ASP.NET Core Developer, Senior Backend Software Engineer, Senior AI Integration Engineer, Senior Applied AI Engineer, Senior AI Backend Engineer, Senior LLM Application Engineer and Senior RAG Engineer.

The workspace distinguishes professional experience, existing personal projects and planned portfolio work. Verify every project claim against its repository before publishing. Python is a supporting skill for data/evaluation work and vacancies that require it; .NET remains the lead specialization.

## What is inside

- **Today:** one unfinished task with a learn, do and save evidence sequence.
- **Learning path:** four focused views—This week, All weeks, AI topics and Career guide. The six-stage, 44-week path covers .NET backend depth, system design, AI engineering, operations, senior ownership, remote applications and adapting to AI-assisted development. Each week links to a focused starting reference.
- **Portfolio:** six ordered tracks—polish the existing chatbot and summarizer; build a .NET accounting/inventory API and a measured RAG system; combine those foundations in a business AI capstone; keep a separate senior-ownership casebook. The casebook is evidence documentation, not a software build.
- **Settings:** theme and local progress backups.

The navigation has four pages: Today, Learning path, Projects and Settings. Old practice, job tracking, journal and analytics pages were removed to keep the workspace focused. Related study prompts and reference data remain available through the weekly learning path where relevant.

## Start here

1. Confirm CV dates and current employment status. The supplied resume lists Chainomation as “December 2026 – Present”; verify the date before sending applications because the plan was prepared on 25 November 2026.
2. Review the dashboard and start the CV evidence audit in week 1.
3. Polish the existing chatbot and summarizer before creating unrelated projects.
4. Apply to suitable senior roles as soon as your evidence matches; do not wait for the whole roadmap.
5. Use the weekly plan as a flexible guide: 12–20 focused hours per week, balanced with work, rest and English communication.

## Product stack

- React 19, TypeScript strict mode, Vite and React Router
- Tailwind CSS 4 with an application design system
- Lucide React, Recharts and Zod
- Browser LocalStorage for progress; static curriculum JSON under public/data/
- Vitest and React Testing Library

There is no backend, account service or cloud sync. Static content is fetched and validated at runtime. User progress is stored in the browser and can be exported/restored as JSON.

The root-level js/, css/ and data/ directories are retained from the earlier vanilla implementation for migration/history. The active React app does not load them; edit public/data/ for current curriculum content.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm:

- npm install
- npm run dev

Open http://localhost:5500. For a production build and local preview, use npm run build and npm run preview.

The project has typecheck and test scripts (npm run typecheck, npm test). They have not been run as part of this content and UI update.

## Content and progress

public/data/ is the active curriculum source. Roadmap tasks, topic IDs, project milestone IDs, interview questions and challenge IDs changed for curriculum version 7. On the next load, the migration gate previews affected records and requests confirmation. Existing journals, dated planner items and study sessions are preserved where valid; completion flags tied to replaced curriculum identities are not mapped to unrelated work. Export a backup before confirming migration if you want a separate recovery file.

User data remains local to the browser origin. Export backups periodically. Import is a full replacement after preview and confirmation.

## Evidence standard

For senior-role claims, record the problem, constraints, alternatives, decision, your ownership, delivery steps, tests, operational behavior, result and follow-up. Use metrics only when you can verify them. A local demo is not evidence of production scale; planned work is not completed experience.
