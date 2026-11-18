import { z } from 'zod';
import { migrateLegacy } from './migrationService';
import type { StaticData, Progress } from '../../types/domain';
import { SCHEMA_VERSION } from './storageService';
const backupSchema = z.union([
  z.object({ application: z.literal('AI Engineer Career Management System'), backupVersion: z.number().int().min(1).max(4), schemaVersion: z.number().int().min(1).max(4), exportedAt: z.string().datetime(), progress: z.unknown() }),
  // Compatibility with the previous Vanilla JS backup envelope.
  z.object({ format: z.literal('ai-career-guide-progress'), backupVersion: z.number().int().min(1).max(4), exportedAt: z.string(), progress: z.unknown(), schemaVersion: z.number().optional(), curriculumVersion: z.number().optional() })
]);
export function createBackup(progress: Progress) { return { application: 'AI Engineer Career Management System' as const, backupVersion: 4, schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), progress }; }
export function downloadJson(value: unknown, filename: string) { const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function exportBackup(progress: Progress) { downloadJson(createBackup(progress),`ai-career-progress-${new Date().toISOString().slice(0,10)}.json`); }
export function parseBackup(value: unknown, data: StaticData): { progress: Progress; counts: Record<string, number> } | null {
  const parsed = backupSchema.safeParse(value); if (!parsed.success) return null;
  const progress = migrateLegacy(parsed.data.progress, data); if (!progress) return null;
  return { progress, counts: { topicAssessments: Object.keys(progress.topics).length, remoteApplications: progress.applications.length, roadmapTasks: Object.values(progress.roadmap).filter(Boolean).length, journalEntries: progress.journal.length, studySessions: progress.studySessions.length, plannerTasks: Object.values(progress.planner).reduce((n, d) => n + (d.tasks?.length ?? 0), 0), projectMilestones: Object.values(progress.projects).reduce((n, p) => n + p.done.length, 0) } };
}
