const files=['profile','roadmap','routine','projects','technology-stack','resources','interviews','career-checklist','challenges'];
const checks={profile:x=>typeof x.name==='string',roadmap:x=>Array.isArray(x.phases)&&x.phases.flatMap(p=>p.weeks||[]).length===24&&x.phases.every(p=>Array.isArray(p.weeks)&&p.weeks.every(w=>Array.isArray(w.tasks)&&w.tasks.length)),routine:x=>Array.isArray(x.daily)&&Array.isArray(x.weekly),projects:x=>Array.isArray(x.projects), 'technology-stack':x=>Array.isArray(x.categories),resources:x=>Array.isArray(x.resources),interviews:x=>Array.isArray(x.questions), 'career-checklist':x=>Array.isArray(x.items),challenges:x=>Array.isArray(x.challenges)};
export async function loadAppData(){const entries=await Promise.all(files.map(async name=>{const response=await fetch(`data/${name}.json`);if(!response.ok)throw new Error(`Could not load data/${name}.json (${response.status}). Start a local HTTP server and reload.`);let parsed;try{parsed=await response.json()}catch{throw new Error(`data/${name}.json is not valid JSON.`)}if(!checks[name](parsed))throw new Error(`The ${name} data has an unexpected structure.`);return[name.replaceAll('-','_'),parsed]}));return Object.fromEntries(entries)}
export function validateProgressReferences(progress,data){
 if(!progress||!data)return false;
 const roadmapIds=new Set(data.roadmap.phases.flatMap(p=>p.weeks.flatMap(w=>w.tasks.map(t=>t.id))));
 const projectIds=new Map(data.projects.projects.map(p=>[p.id,new Set(p.milestones.map(m=>m.id))]));
 const checklistIds=new Set(data.career_checklist.items.map(x=>x.id));
 const interviewIds=new Set(data.interviews.questions.map(x=>x.id));
 const challengeIds=new Set(data.challenges.challenges.map(x=>x.id));
 return Object.keys(progress.roadmap||{}).every(id=>roadmapIds.has(id))&&
  Object.keys(progress.projects||{}).every(id=>projectIds.has(id)&&(progress.projects[id].done||[]).every(mid=>projectIds.get(id).has(mid)))&&
  Object.keys(progress.checklist||{}).every(id=>checklistIds.has(id))&&
  Object.keys(progress.interviews||{}).every(id=>interviewIds.has(id))&&
  Object.keys(progress.challenges||{}).every(id=>challengeIds.has(id));
}
