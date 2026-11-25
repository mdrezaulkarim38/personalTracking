import { CURRICULUM_VERSION, freshProgress, parseProgress, SCHEMA_VERSION } from './storageService';
import { ROADMAP_WEEKS } from '../../types/domain';
import type { Progress } from '../../types/domain';
const isRecord = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const validDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00`));
export function migrateLegacy(value: unknown, data: { roadmap: { phases: { weeks: { tasks: { id: string }[] }[] }[] }; projects: { projects: { id: string; milestones: { id: string }[] }[] }; career_checklist: { items: { id: string }[] }; interviews: { questions: { id: string }[] }; challenges: { challenges: { id: string }[] } }): Progress | null {
  if (!isRecord(value)) return null;
  if (value.schemaVersion === SCHEMA_VERSION && value.curriculumVersion === CURRICULUM_VERSION) return parseProgress(value);
  const version = Number(value.schemaVersion ?? 1); if (version < 1 || version > SCHEMA_VERSION) return null;
  const hasLegacyShape = ['roadmap','weekNotes','projects','checklist','interviews','challenges','journal','planner','studySessions','preferences'].some(key => {
    const entry=value[key]; return ['roadmap','weekNotes','projects','checklist','interviews','challenges','planner','preferences'].includes(key) ? isRecord(entry) : Array.isArray(entry);
  });
  if (!hasLegacyShape || (value.schemaVersion !== undefined && !Number.isInteger(version))) return null;
  const next = freshProgress();
  const taskIds = new Set(data.roadmap.phases.flatMap(p => p.weeks.flatMap(w => w.tasks.map(t => t.id))));
  const projectMilestones = new Map(data.projects.projects.map(p => [p.id, new Set(p.milestones.map(m => m.id))]));
  const checklistIds = new Set(data.career_checklist.items.map(x => x.id)); const interviewIds = new Set(data.interviews.questions.map(x => x.id)); const challengeIds = new Set(data.challenges.challenges.map(x => x.id));
  const sameCurriculum = value.curriculumVersion === CURRICULUM_VERSION;
  const compatibleVersion6 = value.curriculumVersion === 6;
  // Version 7 refines weeks 1–4. Later task IDs and project milestones remain compatible with version 6.
  if (version >= 3 && (sameCurriculum || compatibleVersion6)) {
    if (isRecord(value.roadmap)) for (const [id, done] of Object.entries(value.roadmap)) {
      const week = Number(id.match(/^w(\d+)-/)?.[1] ?? 0);
      if (taskIds.has(id) && typeof done === 'boolean' && (sameCurriculum || week >= 5)) next.roadmap[id] = done;
    }
    if (isRecord(value.weekNotes)) next.weekNotes = Object.fromEntries(Object.entries(value.weekNotes).filter((e): e is [string,string] => /^\d+$/.test(e[0]) && typeof e[1] === 'string' && (sameCurriculum || Number(e[0]) >= 5)));
    if (isRecord(value.projects)) for (const [id, p] of Object.entries(value.projects)) if (projectMilestones.has(id) && isRecord(p)) next.projects[id] = { done: Array.isArray(p.done) ? p.done.filter((m: unknown) => typeof m === 'string' && projectMilestones.get(id)?.has(m)) : [], notes: typeof p.notes === 'string' ? p.notes : '' };
    if (isRecord(value.checklist)) for (const [id, done] of Object.entries(value.checklist)) if (checklistIds.has(id) && typeof done === 'boolean') next.checklist[id] = done;
    if (isRecord(value.interviews)) for (const [id, v] of Object.entries(value.interviews)) if (interviewIds.has(id) && isRecord(v)) next.interviews[id] = { practiced: !!v.practiced, revise: !!v.revise, difficult: !!v.difficult, answer: typeof v.answer === 'string' ? v.answer : '', revisionNotes: typeof v.revisionNotes === 'string' ? v.revisionNotes : '' };
    if (isRecord(value.challenges)) for (const [id, v] of Object.entries(value.challenges)) if (challengeIds.has(id) && isRecord(v)) next.challenges[id] = { attempted: !!v.attempted, solved: !!v.solved, notes: typeof v.notes === 'string' ? v.notes : '' };
  }
  // Notes remain useful when a project with the same stable identity exists, even if its old milestones changed.
  const projectIdMap: Record<string,string> = { 'python-task-api':'task-management-api', 'python-auth-api':'auth-api', 'business-assistant':'business-ai-assistant', 'document-intelligence':'business-ai-assistant' };
  if (isRecord(value.projects)) for (const [oldId, oldProject] of Object.entries(value.projects)) {
    const id = projectIdMap[oldId] ?? oldId;
    if (!projectMilestones.has(id) || !isRecord(oldProject)) continue;
    next.projects[id] ??= { done: [], notes: '' };
    if (typeof oldProject.notes === 'string') next.projects[id].notes=oldProject.notes;
  }
  next.journal = Array.isArray(value.journal) ? value.journal.filter((e: any) => isRecord(e) && typeof e.id === 'string' && validDate(e.date) && ['topics','learned','problems','solutions','next'].every(k => typeof e[k] === 'string')).map((e: any) => ({ ...e, tags: Array.isArray(e.tags) ? e.tags.filter((t: unknown) => typeof t === 'string') : [] })) : [];
  next.studySessions = Array.isArray(value.studySessions) ? value.studySessions.filter((s: any) => isRecord(s) && typeof s.id === 'string' && validDate(s.date) && Number.isFinite(s.durationMinutes) && s.durationMinutes > 0 && typeof s.topic === 'string' && typeof s.accomplished === 'string').map((s: any) => (sameCurriculum || compatibleVersion6 && Number.isInteger(s.week) && s.week >= 5) && Number.isInteger(s.week) ? { ...s, week: s.week, curriculumVersion: CURRICULUM_VERSION } : { ...s, week: null, curriculumVersion: 1 }) : [];
  if (isRecord(value.planner)) for (const [date, day] of Object.entries(value.planner)) if (validDate(date) && isRecord(day)) next.planner[date] = { goal: typeof day.goal === 'string' ? day.goal : '', done: !!day.done, tasks: Array.isArray(day.tasks) ? day.tasks.filter((t: any) => isRecord(t) && typeof t.id === 'string' && typeof t.description === 'string' && validDate(t.date) && typeof t.done === 'boolean') : [] };
  if (isRecord(value.preferences)) { if (Number.isFinite(value.preferences.dailyTargetMinutes) && value.preferences.dailyTargetMinutes > 0) next.preferences.dailyTargetMinutes = value.preferences.dailyTargetMinutes; if (value.preferences.theme === 'dark' || value.preferences.theme === 'light') next.preferences.theme = value.preferences.theme; }
  if ((sameCurriculum || compatibleVersion6 && Number(value.selectedWeek) >= 5) && Number.isInteger(value.selectedWeek) && value.selectedWeek >= 1 && value.selectedWeek <= ROADMAP_WEEKS) next.selectedWeek = value.selectedWeek;
  next.expandedWeek = next.selectedWeek; if (Number.isInteger(value.calendarOffsetWeeks)) next.calendarOffsetWeeks = value.calendarOffsetWeeks;
  // Changed curriculum identity is not semantically compatible: only stable v6 work outside the rewritten first four weeks is retained.
  return parseProgress({ ...next, schemaVersion: SCHEMA_VERSION, curriculumVersion: CURRICULUM_VERSION });
}
export function migrationSummary(value: unknown) { const v = isRecord(value) ? value : {}; const planner = isRecord(v.planner) ? Object.values(v.planner) : []; const projects = isRecord(v.projects) ? Object.values(v.projects) : []; return { journal: Array.isArray(v.journal) ? v.journal.length : 0, sessions: Array.isArray(v.studySessions) ? v.studySessions.length : 0, plannerTasks: planner.reduce((n: number, x: any) => n + (Array.isArray(x?.tasks) ? x.tasks.length : 0), 0), projectNotes: projects.filter((p: any) => typeof p?.notes === 'string' && p.notes).length, roadmapFlags: isRecord(v.roadmap) ? Object.values(v.roadmap).filter(Boolean).length : 0 }; }
