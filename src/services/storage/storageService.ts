import { z } from 'zod';
import { APPLICATION_STATUSES, ELIGIBILITY, ROADMAP_WEEKS, TOPIC_STATUSES } from '../../types/domain';
import type { Progress, StaticData } from '../../types/domain';

export const STORAGE_KEY = 'ai-career-guide-v1';
export const SCHEMA_VERSION = 4;
export const CURRICULUM_VERSION = 5;
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const journalSchema = z.object({ id: z.string(), date: dateSchema, topics: z.string(), learned: z.string(), problems: z.string(), solutions: z.string(), next: z.string(), tags: z.array(z.string()).optional() });
const progressSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION), curriculumVersion: z.literal(CURRICULUM_VERSION), roadmap: z.record(z.string(), z.boolean()), weekNotes: z.record(z.string(), z.string()),
  projects: z.record(z.string(), z.object({ done: z.array(z.string()), notes: z.string() })), checklist: z.record(z.string(), z.boolean()),
  interviews: z.record(z.string(), z.object({ practiced: z.boolean().optional(), revise: z.boolean().optional(), difficult: z.boolean().optional(), answer: z.string().optional(), revisionNotes: z.string().optional() })),
  challenges: z.record(z.string(), z.object({ attempted: z.boolean().optional(), solved: z.boolean().optional(), notes: z.string().optional() })), journal: z.array(journalSchema),
  planner: z.record(z.string(), z.object({ goal: z.string().optional(), done: z.boolean().optional(), tasks: z.array(z.object({ id: z.string(), description: z.string(), date: dateSchema, done: z.boolean() })).optional() })),
  studySessions: z.array(z.object({ id: z.string(), date: dateSchema, durationMinutes: z.number().positive(), topic: z.string(), week: z.number().int().min(1).max(ROADMAP_WEEKS).nullable(), accomplished: z.string(), curriculumVersion: z.number().optional() })),
  selectedWeek: z.number().int().min(1).max(ROADMAP_WEEKS), expandedWeek: z.number().int().min(1).max(ROADMAP_WEEKS).nullable(), calendarOffsetWeeks: z.number().int(), selectedView: z.string(),
  topics: z.record(z.string(), z.object({ status: z.enum(TOPIC_STATUSES), evidence: z.string() }).refine(value => value.status !== 'Completed' || value.evidence.trim().length > 0)).default({}),
  applications: z.array(z.object({
    id: z.string(), company: z.string().trim().min(1), role: z.string().trim().min(1),
    url: z.string().refine(value => !value || /^https?:\/\//i.test(value) && z.url().safeParse(value).success),
    eligibility: z.enum(ELIGIBILITY), status: z.enum(APPLICATION_STATUSES),
    overlap: z.string(), evidence: z.string(), appliedOn: z.union([dateSchema, z.literal('')]).default(''), followUp: z.union([dateSchema, z.literal('')]), notes: z.string()
  })).default([]),
  preferences: z.object({ dailyTargetMinutes: z.number().positive(), theme: z.enum(['light','dark']), bookmarks: z.array(z.string()) })
});
export const freshProgress = (): Progress => ({ topics: {}, applications: [], schemaVersion: SCHEMA_VERSION, curriculumVersion: CURRICULUM_VERSION, roadmap: {}, weekNotes: {}, projects: {}, checklist: {}, interviews: {}, challenges: {}, journal: [], planner: {}, studySessions: [], selectedWeek: 1, expandedWeek: 1, calendarOffsetWeeks: 0, selectedView: 'dashboard', preferences: { dailyTargetMinutes: 240, theme: 'light', bookmarks: [] } });
export function validateProgress(value: unknown): value is Progress { return progressSchema.safeParse(value).success; }
export function parseProgress(value: unknown): Progress | null { const result = progressSchema.safeParse(value); return result.success ? result.data as Progress : null; }
export function readRaw(): string | null { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } }
export function createRecoveryCopy(value: unknown): string { const key=`ai-career-recovery-${new Date().toISOString().replace(/[:.]/g,'-')}`; try { localStorage.setItem(key,JSON.stringify(value)); return key; } catch { throw new Error('Could not create a recovery copy in browser storage. Export the current progress to a file and try again.'); } }
export function readProgress(): Progress { const raw = readRaw(); if (!raw) return freshProgress(); try { const parsed = JSON.parse(raw); return parseProgress(parsed) ?? freshProgress(); } catch { return freshProgress(); } }
export function writeProgress(value: Progress): void { const checked = progressSchema.parse(value); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch (error) { throw new Error(error instanceof DOMException && error.name === 'QuotaExceededError' ? 'Browser storage is full. Export a backup and remove older data to continue.' : 'Could not save progress to browser storage.'); } }
export function inspectSaved(): { status: 'empty' | 'current' | 'migration' | 'corrupt' | 'unsupported'; value?: unknown; version?: number } {
  const raw = readRaw(); if (raw === null) return { status: 'empty' };
  let parsed: unknown; try { parsed = JSON.parse(raw); } catch { return { status: 'corrupt' }; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { status: 'corrupt' };
  const version = Number((parsed as Record<string, unknown>).schemaVersion ?? 1);
  if (version > SCHEMA_VERSION || version < 1) return { status: 'unsupported', value: parsed, version };
  if (version === SCHEMA_VERSION) {
    const value = parsed as Record<string, unknown>;
    if (value.curriculumVersion === CURRICULUM_VERSION) return validateProgress(parsed) ? { status: 'current', value: parsed, version } : { status: 'corrupt', value: parsed, version };
    if (Number.isInteger(value.curriculumVersion) && Number(value.curriculumVersion) >= 1 && Number(value.curriculumVersion) < CURRICULUM_VERSION && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return { status: 'migration', value: parsed, version };
    return { status: 'unsupported', value: parsed, version };
  }
  return { status: 'migration', value: parsed, version };
}
export function progressTotals(progress: Progress, data: Pick<StaticData, 'roadmap'>) {
  const tasks = data.roadmap.phases.flatMap(p => p.weeks.flatMap(w => w.tasks)); const completed = tasks.filter(t => progress.roadmap[t.id]).length;
  return { total: tasks.length, completed, remaining: tasks.length - completed, percent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 };
}
