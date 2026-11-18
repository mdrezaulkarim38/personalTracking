import { z } from 'zod';
import { ROADMAP_WEEKS } from '../types/domain';
import type { StaticData } from '../types/domain';
const shapes = {
  syllabus: z.object({ stages: z.array(z.object({
    id: z.string(), title: z.string(), prerequisite: z.string(), objective: z.string(),
    scenario: z.string(), progression: z.string(), gate: z.string(), resources: z.array(z.string()),
    topics: z.array(z.object({
      id: z.string(), title: z.string(), priority: z.enum(['P0','P1','P2','P3']), depth: z.number().int().min(1).max(5),
      hours: z.tuple([z.number().nonnegative(), z.number().nonnegative(), z.number().nonnegative(), z.number().nonnegative()]),
      concepts: z.string(), exercise: z.string(), assessment: z.string(), pass: z.string(), defer: z.string()
    })).min(1)
  })).min(1) }),
  profile: z.object({ name: z.string(), location: z.string(), careerDirection: z.string(), goal: z.string(), targetRoles: z.array(z.string()) }).passthrough(),
  roadmap: z.object({ learningStrategy: z.object({ title: z.string(), summary: z.string(), steps: z.array(z.object({ weeks: z.string(), title: z.string(), detail: z.string() })), rule: z.string() }), phases: z.array(z.object({ id: z.string(), title: z.string(), startWeek: z.number().int().min(1).max(ROADMAP_WEEKS), endWeek: z.number().int().min(1).max(ROADMAP_WEEKS), weeks: z.array(z.object({ week: z.number().int().min(1).max(ROADMAP_WEEKS), title: z.string(), objective: z.string(), topics: z.array(z.string()), tasks: z.array(z.object({ id: z.string(), text: z.string() })), deliverable: z.string(), learningGuide: z.object({ steps: z.array(z.string()), resources: z.array(z.string()), practice: z.string(), readyWhen: z.string() }) })) })) }),
  routine: z.object({ daily: z.array(z.object({ title: z.string(), minutes: z.number(), detail: z.string() })), weekly: z.array(z.object({ day: z.string(), focus: z.string() })) }),
  projects: z.object({ projects: z.array(z.object({ id: z.string(), name: z.string(), description: z.string(), difficulty: z.string(), technologies: z.array(z.string()), features: z.array(z.string()), requirements: z.array(z.string()), frontend: z.object({ approach: z.string(), screens: z.array(z.string()), interactions: z.array(z.string()), done: z.string() }), milestones: z.array(z.object({ id: z.string(), title: z.string(), description: z.string(), tasks: z.array(z.string()), deliverable: z.string().optional() })) })) }),
  technology_stack: z.object({ categories: z.array(z.object({ name: z.string(), items: z.array(z.tuple([z.string(), z.string()])) })) }),
  resources: z.object({ resources: z.array(z.object({ name: z.string(), category: z.string(), description: z.string(), url: z.string().url(), difficulty: z.string().optional() })) }),
  challenges: z.object({ challenges: z.array(z.object({ id: z.string(), title: z.string(), topic: z.string(), category: z.string(), difficulty: z.string(), description: z.string(), problem: z.string(), requirements: z.array(z.string()), hints: z.array(z.string()), outcome: z.string(), exampleInput: z.unknown().optional(), exampleOutput: z.unknown().optional() })) }),
  interviews: z.object({ categories: z.array(z.string()), questions: z.array(z.object({ id: z.string(), category: z.string(), difficulty: z.string(), question: z.string(), questionType: z.string().optional() })) }),
  career_checklist: z.object({ items: z.array(z.object({ id: z.string(), label: z.string(), detail: z.string() })) })
};
export async function loadStaticData(): Promise<StaticData> {
  const names = Object.keys(shapes) as (keyof typeof shapes)[];
  const data = await Promise.all(names.map(async name => { const response = await fetch(`/data/${name.replaceAll('_','-')}.json`); if (!response.ok) throw new Error(`Could not load /data/${name.replaceAll('_','-')}.json (${response.status}).`); const result = shapes[name].safeParse(await response.json()); if (!result.success) throw new Error(`The ${name} curriculum JSON is invalid: ${result.error.issues[0]?.path.join('.') || 'unexpected structure'}.`); return [name, result.data] as const; }));
  const value = Object.fromEntries(data) as unknown as StaticData; const weeks = value.roadmap.phases.flatMap(p => p.weeks); if (weeks.length !== ROADMAP_WEEKS) throw new Error(`Expected ${ROADMAP_WEEKS} roadmap weeks; found ${weeks.length}.`);
  if (weeks.some((week,index)=>week.week!==index+1) || value.roadmap.phases.some(phase=>phase.weeks[0]?.week!==phase.startWeek||phase.weeks.at(-1)?.week!==phase.endWeek)) throw new Error(`Roadmap phase ranges must cover weeks 1–${ROADMAP_WEEKS} in order.`);
  const resourceNames=new Set(value.resources.resources.map(resource=>resource.name));
  const missingGuides=[...weeks.flatMap(week=>week.learningGuide.resources), ...value.syllabus.stages.flatMap(stage=>stage.resources)].filter(name=>!resourceNames.has(name));
  if(missingGuides.length)throw new Error(`Roadmap references missing learning resources: ${[...new Set(missingGuides)].join(', ')}.`);
  if (value.challenges.challenges.length < 40) throw new Error('The challenge curriculum contains fewer than 40 records.'); return value;
}
