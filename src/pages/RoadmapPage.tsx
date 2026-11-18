import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowUpRight, BookOpenCheck, ChevronDown, ChevronRight, Target } from 'lucide-react';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading, ProgressBar, Status } from '../components/common/UI';
import { toggleRoadmapTask } from '../services/progressService';

export function RoadmapPage() {
  const {data,progress,update}=useCareer();
  const [closed,setClosed]=useState<number[]>([]);
  const [active,setActive]=useState<number|null>(progress.expandedWeek??progress.selectedWeek);
  const [search,setSearch]=useState('');
  const allWeeks=data.roadmap.phases.flatMap(phase=>phase.weeks);
  const tasks=allWeeks.flatMap(week=>week.tasks);
  const completed=tasks.filter(task=>progress.roadmap[task.id]).length;
  const resources=new Map(data.resources.resources.map(resource=>[resource.name,resource]));
  const visibleWeeks=allWeeks.filter(week=>!search||`${week.title} ${week.objective} ${week.topics.join(' ')} ${week.tasks.map(task=>task.text).join(' ')}`.toLowerCase().includes(search.toLowerCase()));

  return <>
    <PageHeading eyebrow={`${allWeeks.length} learning units`} title="Applied AI engineering roadmap" description="Build from Python fundamentals to production AI and remote interview readiness." actions={<Link className="button secondary" to="/syllabus">Open topic syllabus</Link>}/>
    <Card className="roadmap-intro">
      <div className="intro-heading"><span className="intro-icon"><BookOpenCheck size={19}/></span><div><div className="eyebrow">START HERE</div><h2>{data.roadmap.learningStrategy.title}</h2></div></div>
      <p>{data.roadmap.learningStrategy.summary}</p>
      <div className="learning-path-grid">{data.roadmap.learningStrategy.steps.map((step,index)=><article className="learning-path-step" key={step.weeks}><span className="learning-path-number">0{index+1}</span><div><small>{step.weeks}</small><strong>{step.title}</strong><p>{step.detail}</p></div></article>)}</div>
      <div className="roadmap-study-rule"><Target size={17}/><span>{data.roadmap.learningStrategy.rule}</span></div>
    </Card>
    <div className="roadmap-tools"><span className="pill">{completed} / {tasks.length} tasks complete</span><div className="search-box"><input aria-label="Search roadmap" placeholder="Search weeks and topics…" value={search} onChange={event=>setSearch(event.target.value)}/></div></div>
    {data.roadmap.phases.map((phase,phaseIndex)=>{
      const phaseWeeks=phase.weeks.filter(week=>visibleWeeks.some(visible=>visible.week===week.week));
      const phaseTasks=phase.weeks.flatMap(week=>week.tasks);const done=phaseTasks.filter(task=>progress.roadmap[task.id]).length;const pct=phaseTasks.length?done/phaseTasks.length*100:0;const isClosed=closed.includes(phase.startWeek);
      if(search&&!phaseWeeks.length)return null;
      return <section className="phase-section" key={phase.id}>
        <button className="phase-heading" aria-expanded={!isClosed} onClick={()=>setClosed(current=>current.includes(phase.startWeek)?current.filter(start=>start!==phase.startWeek):[...current,phase.startWeek])}>
          <div className="phase-heading-main"><span className="phase-number">0{phaseIndex+1}</span><div><span className="eyebrow">WEEKS {phase.startWeek}–{phase.endWeek}</span><h2>{phase.title}</h2></div></div>
          <div className="phase-summary"><span>{done}/{phaseTasks.length} tasks</span><div className="phase-bar"><ProgressBar value={pct}/></div>{isClosed?<ChevronRight/>:<ChevronDown/>}</div>
        </button>
        {!isClosed&&<div className="weeks-list">{phaseWeeks.map(week=>{
          const count=week.tasks.filter(task=>progress.roadmap[task.id]).length;const percent=week.tasks.length?count/week.tasks.length*100:0;const expanded=active===week.week;
          return <Card className={`week-card ${progress.selectedWeek===week.week?'selected-week':''}`} key={week.week}>
            <button className="week-toggle" aria-expanded={expanded} onClick={()=>{setActive(expanded?null:week.week);update(state=>{state.expandedWeek=expanded?null:week.week;if(!expanded)state.selectedWeek=week.week})}}>
              <span className="week-index">W{String(week.week).padStart(2,'0')}</span><span className="week-main"><strong>{week.title}</strong><small>{week.objective}</small></span><span className="week-status"><Status value={percent}/><span>{count}/{week.tasks.length}</span>{expanded?<ChevronDown size={18}/>:<ChevronRight size={18}/>}</span>
            </button>
            {expanded&&<div className="week-details">
              <div className="week-learning-grid">
                <section className="learn-order"><div className="eyebrow">WHAT TO LEARN · IN ORDER</div><ol>{week.learningGuide.steps.map((step,index)=><li key={step}><span>{index+1}</span>{step}</li>)}</ol></section>
                <section className="where-to-learn"><div className="eyebrow">WHERE TO LEARN</div><p>Start with these official docs. Read only the parts related to this week.</p><div className="resource-links">{week.learningGuide.resources.map(name=>{const resource=resources.get(name);return resource?<a key={name} href={resource.url} target="_blank" rel="noopener noreferrer">{name}<ArrowUpRight size={14}/></a>:<span key={name}>{name}</span>})}</div></section>
              </div>
              <div className="week-practice"><strong>Put it into practice</strong><p>{week.learningGuide.practice}</p></div>
              <div className="week-detail-grid"><div><h3>Topics to understand</h3><ul className="topic-list">{week.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></div><div className="deliverable-box"><Target size={17}/><div><small>EXPECTED DELIVERABLE</small><p>{week.deliverable}</p></div></div></div>
              <h3>Practical tasks</h3>{week.tasks.map(task=><label key={task.id} className="task-row"><input type="checkbox" checked={!!progress.roadmap[task.id]} onChange={event=>update(state=>{toggleRoadmapTask(state,task.id,event.target.checked)})}/><span>{task.text}</span></label>)}
              <div className="ready-check"><BookOpenCheck size={16}/><div><strong>Ready to move on when</strong><p>{week.learningGuide.readyWhen}</p></div></div>
              <label className="field-label notes-field">Week {week.week} notes<textarea rows={3} placeholder="Capture questions, examples, and useful links…" value={progress.weekNotes[String(week.week)]??''} onChange={event=>update(state=>{state.weekNotes[String(week.week)]=event.target.value})}/></label>
            </div>}
          </Card>;
        })}</div>}
      </section>;
    })}
  </>;
}
