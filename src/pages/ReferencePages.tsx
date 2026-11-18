import { useMemo, useState } from 'react';
import { ExternalLink, Search, Bookmark, CheckCircle2 } from 'lucide-react';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading, ProgressBar } from '../components/common/UI';
export function ResourcesPage(){const {data,progress,update}=useCareer();const [q,setQ]=useState('');const [cat,setCat]=useState('All categories');const [level,setLevel]=useState('All levels');const categories=['All categories',...Array.from(new Set(data.resources.resources.map(r=>r.category)))];const list=useMemo(()=>data.resources.resources.filter(r=>(cat==='All categories'||r.category===cat)&&(level==='All levels'||r.difficulty===level)&&`${r.name} ${r.description}`.toLowerCase().includes(q.toLowerCase())),[data.resources.resources,cat,level,q]);return <><PageHeading eyebrow="Official documentation first" title="Learning resources" description="A curated library of authoritative docs and practical references for the roadmap."/><div className="filter-toolbar"><div className="search-box"><Search size={16}/><input aria-label="Search resources" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search resources…"/></div><select aria-label="Filter resource category" value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Filter resource difficulty" value={level} onChange={e=>setLevel(e.target.value)}>{['All levels','Beginner','Intermediate','Advanced'].map(x=><option key={x}>{x}</option>)}</select></div><div className="resource-grid">{list.map(r=>{const id=r.id??r.name;const saved=progress.preferences.bookmarks.includes(id);return <Card className="resource-card" key={id}><div className="resource-card-top"><span className="topic-chip">{r.category}</span><button className={`icon-button tiny ${saved?'bookmarked':''}`} aria-label={saved?'Remove bookmark':'Bookmark resource'} onClick={()=>update(p=>{p.preferences.bookmarks=saved?p.preferences.bookmarks.filter(x=>x!==id):[...p.preferences.bookmarks,id]})}><Bookmark size={16}/></button></div><h2>{r.name}</h2><p>{r.description}</p><div className="resource-bottom"><a href={r.url} target="_blank" rel="noopener noreferrer">Open documentation <ExternalLink size={14}/></a>{r.difficulty&&<span>{r.difficulty}</span>}</div></Card>})}{!list.length&&<div className="empty-state"><strong>No resources match</strong><p>Try another search or category.</p></div>}</div></>}
const schedules = [
  { minutes: 240, weekly: 20, calendar: '56–66 weeks', blocks: [45, 75, 100, 20], milestones: ['Months 1–2', 'Months 3–5', 'Months 6–8', 'Months 9–10', 'Months 10–12', 'Months 13–16'] },
  { minutes: 360, weekly: 30, calendar: '38–44 weeks', blocks: [60, 100, 170, 30], milestones: ['Months 1–2', 'Months 2–3', 'Months 4–6', 'Months 6–7', 'Months 7–9', 'Months 9–11'] },
  { minutes: 480, weekly: 40, calendar: '28–33 weeks', blocks: [75, 135, 215, 55], milestones: ['Month 1', 'Months 2–3', 'Month 4', 'Month 5', 'Months 5–6', 'Months 7–8'] }
];
const milestones = ['Python CLI and runtime', 'ML baseline and deployed API', 'Search and basic RAG', 'Enterprise RAG and initial remote applications', 'Workflow, SQL assistant and failure drills', 'Multimodal, SaaS deployment and mock interviews'];

export function RoutinePage() {
  const { data, progress, update } = useCareer();
  const [selected, setSelected] = useState(schedules.findIndex(schedule => schedule.minutes === progress.preferences.dailyTargetMinutes));
  const schedule = schedules[selected] ?? schedules[0];
  return <>
    <PageHeading title="Study schedule" description="Five focused days per week. Pace the 44 roadmap units by demonstrated readiness."/>
    <div className="filter-toolbar">
      <label className="field-label">Schedule<select value={Math.max(0, selected)} onChange={event => setSelected(Number(event.target.value))}>
        {schedules.map((item, index) => <option key={item.minutes} value={index}>{item.minutes / 60} hours per day</option>)}
      </select></label>
      <button className="button secondary" disabled={progress.preferences.dailyTargetMinutes === schedule.minutes} onClick={() => update(state => { state.preferences.dailyTargetMinutes = schedule.minutes; })}>Use as daily target</button>
    </div>
    <Card className="curriculum-guide">
      <h2>{schedule.weekly} hours per week · {schedule.calendar}</h2>
      <p>Estimates include integrated projects and revision. Reserve the final four weeks for mock interviews and portfolio cleanup. Apply earlier once your evidence matches a role.</p>
      <dl>{milestones.map((title, index) => <div className="milestone-pair" key={title}><dt>{schedule.milestones[index]}</dt><dd>{title}</dd></div>)}</dl>
    </Card>
    <div className="routine-grid">{data.routine.daily.map((block, index) => <Card className="routine-card" key={block.title}>
      <span className="routine-time">{schedule.blocks[index]} min</span><h2>{block.title}</h2><p>{block.detail}</p>
    </Card>)}</div>
    <Card className="weekly-routine"><h2>Weekly study rhythm</h2><div className="weekly-grid">{data.routine.weekly.map(day => <div className="weekly-day" key={day.day}><strong>{day.day}</strong><p>{day.focus}</p></div>)}</div>
      <p>Every 12 calendar weeks, run a closed-book knowledge check, unfamiliar coding exercise, design review and failure drill on the latest project. Review evidence at the Python/ML, retrieval, workflow and capstone gates.</p>
    </Card>
  </>;
}
export function StackPage(){const {data}=useCareer();return <><PageHeading eyebrow="A focused toolkit" title="Technology stack" description="Use Python and FastAPI for the applied AI track, with ASP.NET Core available for enterprise integration."/><div className="stack-grid">{data.technology_stack.categories.map(c=><Card className="stack-card" key={c.name}><div className="eyebrow">TECHNOLOGY GROUP</div><h2>{c.name}</h2>{c.items.map(([name,description])=><div className="stack-item" key={name}><strong>{name}</strong><p>{description}</p></div>)}</Card>)}</div></>}
export function ChecklistPage(){const {data,progress,update}=useCareer();const items=data.career_checklist.items;const complete=items.filter(x=>progress.checklist[x.id]).length;return <><PageHeading eyebrow="From learning to employability" title="Career readiness checklist" description="Use evidence from projects, testing, deployment, and practice to assess readiness."/><Card className="checklist-summary"><div><span className="eyebrow">CAREER READINESS</span><strong>{Math.round(complete/Math.max(items.length,1)*100)}%</strong><span>{complete} of {items.length} items checked</span></div><ProgressBar value={complete/Math.max(items.length,1)*100}/></Card><div className="checklist-groups">{items.map((x,i)=><label className={`checklist-item ${progress.checklist[x.id]?'checked':''}`} key={x.id}><input type="checkbox" checked={!!progress.checklist[x.id]} onChange={e=>update(p=>{p.checklist[x.id]=e.target.checked})}/><span className="checklist-check"><CheckCircle2 size={18}/></span><span><strong>{x.label}</strong><small>{x.detail}</small></span><span className="checklist-index">{String(i+1).padStart(2,'0')}</span></label>)}</div></>}
