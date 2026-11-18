export const ROADMAP_WEEKS = 44;
export const TOPIC_STATUSES = ['Not started', 'Learning', 'Practicing', 'Project implementation', 'Assessment', 'Completed'] as const;
export const APPLICATION_STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Closed'] as const;
export const ELIGIBILITY = ['Unverified', 'Bangladesh eligible', 'Contractor eligible', 'Ineligible'] as const;
export type TopicProgress = { status: typeof TOPIC_STATUSES[number]; evidence: string };
export type RemoteApplication = {
  id: string; company: string; role: string; url: string;
  eligibility: typeof ELIGIBILITY[number]; status: typeof APPLICATION_STATUSES[number];
  overlap: string; evidence: string; appliedOn: string; followUp: string; notes: string;
};
export type SyllabusTopic = {
  id: string; title: string; priority: 'P0' | 'P1' | 'P2' | 'P3'; depth: number;
  hours: [number, number, number, number]; concepts: string; exercise: string;
  assessment: string; pass: string; defer: string;
};
export type SyllabusStage = {
  id: string; title: string; prerequisite: string; objective: string; scenario: string;
  progression: string; gate: string; resources: string[]; topics: SyllabusTopic[];
};
export type Task = { id: string; text: string };
export type Week = { week: number; title: string; objective: string; topics: string[]; tasks: Task[]; deliverable: string; learningGuide: { steps: string[]; resources: string[]; practice: string; readyWhen: string } };
export type Phase = { id: string; title: string; startWeek: number; endWeek: number; weeks: Week[] };
export type Roadmap = { phases: Phase[]; learningStrategy: { title: string; summary: string; steps: { weeks: string; title: string; detail: string }[]; rule: string } };
export type Project = { id: string; name: string; description: string; difficulty: string; technologies: string[]; features: string[]; requirements: string[]; frontend: { approach: string; screens: string[]; interactions: string[]; done: string }; milestones: { id: string; title: string; description: string; tasks: string[]; deliverable?: string }[] };
export type Challenge = { id: string; title: string; topic: string; category: string; difficulty: string; description: string; problem: string; requirements: string[]; hints: string[]; outcome: string; exampleInput?: unknown; exampleOutput?: unknown };
export type InterviewQuestion = { id: string; category: string; difficulty: string; question: string; questionType?: string };
export type JournalEntry = { id: string; date: string; topics: string; learned: string; problems: string; solutions: string; next: string; tags?: string[] };
export type PlannerTask = { id: string; description: string; date: string; done: boolean };
export type StudySession = { id: string; date: string; durationMinutes: number; topic: string; week: number | null; accomplished: string; curriculumVersion?: number };
export type Progress = {
  topics: Record<string, TopicProgress>; applications: RemoteApplication[];
  schemaVersion: number; curriculumVersion: number; roadmap: Record<string, boolean>; weekNotes: Record<string, string>;
  projects: Record<string, { done: string[]; notes: string }>; checklist: Record<string, boolean>;
  interviews: Record<string, { practiced?: boolean; revise?: boolean; difficult?: boolean; answer?: string; revisionNotes?: string }>;
  challenges: Record<string, { attempted?: boolean; solved?: boolean; notes?: string }>;
  journal: JournalEntry[]; planner: Record<string, { goal?: string; done?: boolean; tasks?: PlannerTask[] }>;
  studySessions: StudySession[]; selectedWeek: number; expandedWeek: number | null; calendarOffsetWeeks: number;
  selectedView: string; preferences: { dailyTargetMinutes: number; theme: 'light' | 'dark'; bookmarks: string[] };
};
export type StaticData = { syllabus: { stages: SyllabusStage[] }; profile: Record<string, any>; roadmap: Roadmap; routine: { daily: { title: string; minutes: number; detail: string }[]; weekly: { day: string; focus: string }[] }; projects: { projects: Project[] }; technology_stack: { categories: { name: string; items: [string, string][] }[] }; resources: { resources: { id?: string; name: string; category: string; description: string; url: string; difficulty?: string }[] }; challenges: { challenges: Challenge[] }; interviews: { categories: string[]; questions: InterviewQuestion[] }; career_checklist: { items: { id: string; label: string; detail: string }[] } };
