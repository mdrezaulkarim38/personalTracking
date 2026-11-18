import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Progress, StaticData } from '../types/domain';
import { createRecoveryCopy, freshProgress, inspectSaved, readProgress, writeProgress } from '../services/storage/storageService';
import { migrateLegacy, migrationSummary } from '../services/storage/migrationService';
import { parseBackup } from '../services/storage/backupService';

type ContextValue = { data: StaticData; progress: Progress; update: (fn: (p: Progress) => void) => void; notice: string; notify: (text: string) => void; migration: ReturnType<typeof inspectSaved>; finishMigration: () => void; importFile: (file: File) => Promise<{ counts: Record<string, number> }>; confirmImport: (p: Progress) => void };
const Context = createContext<ContextValue | null>(null);
export function ProgressProvider({ data, children }: { data: StaticData; children: ReactNode }) {
  const [migration, setMigration] = useState(inspectSaved); const [progress, setProgress] = useState<Progress>(() => migration.status === 'current' ? readProgress() : freshProgress()); const [notice, setNotice] = useState('');
  useEffect(() => { if (migration.status === 'empty') { try { writeProgress(progress); } catch { /* visible save failures are surfaced on user actions */ } } }, []);
  const notify = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(''), 3200); };
  const update = (fn: (p: Progress) => void) => setProgress(current => { const next = structuredClone(current); fn(next); try { writeProgress(next); return next; } catch (e) { notify(e instanceof Error ? e.message : 'Could not save changes.'); return current; } });
  const finishMigration = () => { const old = migration.value; const next = migrateLegacy(old, data); if (!next) { notify('Saved data could not be migrated. The original browser data is unchanged.'); return; } try { createRecoveryCopy(old); writeProgress(next); setProgress(next); setMigration({ status: 'current', value: next, version: next.schemaVersion }); notify('Migration complete. Compatible records were restored.'); } catch (e) { notify(e instanceof Error ? e.message : 'Could not save migrated progress.'); } };
  const importFile = async (file: File) => { const value: unknown = JSON.parse(await file.text()); const restored = parseBackup(value, data); if (!restored) throw new Error('This backup is invalid or uses an unsupported format.'); return { counts: restored.counts }; };
  const confirmImport = (next: Progress) => { try { createRecoveryCopy(progress); writeProgress(next); setProgress(next); setMigration({ status: 'current', value: next, version: next.schemaVersion }); notify('Backup restored. A recovery copy of the previous progress was created.'); } catch (e) { notify(e instanceof Error ? e.message : 'Could not restore backup.'); } };
  const value = useMemo(() => ({ data, progress, update, notice, notify, migration, finishMigration, importFile, confirmImport }), [data, progress, notice, migration]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCareer() { const value = useContext(Context); if (!value) throw new Error('useCareer must be used within ProgressProvider'); return value; }
export function migrationCounts(value: unknown) { return migrationSummary(value); }
