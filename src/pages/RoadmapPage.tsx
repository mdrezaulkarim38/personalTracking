import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowUpRight, BookOpenCheck, ChevronDown, ChevronRight, Target } from 'lucide-react';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading, ProgressBar, Status } from '../components/common/UI';
import { toggleRoadmapTask } from '../services/progressService';
import { weekReferences } from '../weekReferences';

const roleStages = [
  { weeks: '01–04', name: 'Become visible to remote employers', skills: 'Accurate CV, English project explanations, role research, eligibility and tailored applications.', build: 'Polish the chatbot and summarizer as truthful, runnable case studies.', gate: 'CV facts verified; two projects demonstrable; five eligible roles researched; first tailored applications sent.' },
  { weeks: '05–12', name: 'Own a dependable .NET service', skills: 'C# runtime, async, ASP.NET Core, authentication, SQL design, query plans, transactions and business rules.', build: 'Accounting and inventory ledger API with authorization, invariants and integration checks.', gate: 'Explain and demonstrate correctness under invalid input, concurrent updates and database failure.' },
  { weeks: '13–24', name: 'Design and operate a system', skills: 'Architecture trade-offs, caching, migration, messaging, incidents, Linux, containers, CI, cloud and cost.', build: 'Deploy the ledger service with a design record, release pipeline, monitoring and rollback procedure.', gate: 'Another engineer can run it; you can defend alternatives and handle a simulated failure.' },
  { weeks: '25–32', name: 'Build an AI feature with measured quality', skills: 'Python basics for experiments, model behavior, prompts, context, embeddings, vector search, RAG and evaluation.', build: 'Document intelligence app with authorized retrieval, citations and an evaluation dataset.', gate: 'Show baseline retrieval and answer quality, failures, unanswerable cases, latency and cost.' },
  { weeks: '33–40', name: 'Make AI safe and operable', skills: 'Prompt injection, privacy, bias, tool permissions, human approval, regression evaluation, tracing and resilience.', build: 'Business operations AI assistant with typed tools, audit trail, limits and a release report.', gate: 'Demonstrate blocked misuse, safe failure, measured regressions, traceability and a recovery decision.' },
  { weeks: '41–44', name: 'Show senior ownership', skills: 'Architecture review, migration planning, mentoring, written communication and interview explanation.', build: 'Senior ownership casebook using real work and clearly labeled portfolio decisions.', gate: 'Present three honest ownership stories, defend one architecture review, and tailor applications using interview feedback.' }
];

const aiPath = [
  { title: 'Model and ML fundamentals', weeks: '25', learn: 'Python experiment basics; training vs inference, tokens, context windows, sampling, latency, capabilities and failure modes.', do: 'Compare two models on the same business questions with a small Python or .NET script.', proof: 'A model choice table with quality, latency, cost and failure examples.' },
  { title: 'Prompt engineering', weeks: '26–27', learn: 'Instructions, examples, output schemas and prompt versions.', do: 'Run two prompt versions against the same test cases.', proof: 'Prompts, outputs and a written comparison.' },
  { title: 'Context engineering', weeks: '29–31', learn: 'Selecting, trimming and ordering trusted context; citations and permission boundaries.', do: 'Build a context assembly step with a token budget and source metadata.', proof: 'Context trace showing included, excluded and truncated material.' },
  { title: 'Embeddings & vector databases', weeks: '30–31', learn: 'Chunking, embedding models, similarity search, metadata filters and hybrid retrieval.', do: 'Index one document set in pgvector or Qdrant and compare retrieval methods.', proof: 'Index setup and retrieval comparison on labeled questions.' },
  { title: 'RAG', weeks: '29–32', learn: 'Ingestion, retrieval, grounded answers, citations and abstention.', do: 'Answer domain questions from authorized documents.', proof: 'A runnable demo with citations and examples where it refuses to guess.' },
  { title: 'Safety & ethics', weeks: '33–35', learn: 'Prompt injection, privacy, consent, bias, harmful output and human review.', do: 'Threat model the RAG app and run misuse cases.', proof: 'A risk table, mitigations and remaining limits.' },
  { title: 'Evaluation & observability', weeks: '28, 32, 36–38', learn: 'Grounding and retrieval metrics, regression sets, traces, latency, cost and error rates.', do: 'Create a repeatable evaluation set and instrument one AI request path.', proof: 'Baseline results, trace example and release decision.' }
];

export function RoadmapPage() {
  const {data,progress,update}=useCareer();
  const [closed,setClosed]=useState<number[]>(()=>data.roadmap.phases.filter(phase=>progress.selectedWeek<phase.startWeek||progress.selectedWeek>phase.endWeek).map(phase=>phase.startWeek));
  const [active,setActive]=useState<number|null>(progress.expandedWeek??progress.selectedWeek);
  const [openStage,setOpenStage]=useState<number|null>(0);
  const [view,setView]=useState<'week'|'weeks'|'ai'|'career'>('week');
  const [search,setSearch]=useState('');
  const allWeeks=data.roadmap.phases.flatMap(phase=>phase.weeks);
  const tasks=allWeeks.flatMap(week=>week.tasks);
  const completed=tasks.filter(task=>progress.roadmap[task.id]).length;
  const totalPercent=tasks.length?Math.round(completed/tasks.length*100):0;
  const visibleWeeks=allWeeks.filter(week=>!search||`${week.title} ${week.objective} ${week.topics.join(' ')} ${week.tasks.map(task=>task.text).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  function openWeek(number:number){const phase=data.roadmap.phases.find(item=>item.weeks.some(week=>week.week===number));if(!phase)return;setView('week');setSearch('');setClosed(current=>current.filter(start=>start!==phase.startWeek));setActive(number);update(state=>{state.selectedWeek=number;state.expandedWeek=number});window.setTimeout(()=>document.getElementById(`week-${number}`)?.scrollIntoView({behavior:'smooth',block:'start'}),80)}

  return <>
    <PageHeading eyebrow={`${allWeeks.length} evidence-based learning weeks`} title="Your route to senior .NET + AI work" description="Follow each stage, build the project, pass the evidence gate, and apply to matching remote roles throughout." actions={<Link className="button secondary" to="/">Back to today</Link>}/>
    <Card className="learning-progress-card"><div className="learning-progress-head"><div><span className="eyebrow">YOUR PROGRESS</span><h2>{totalPercent}% of the learning path</h2><p>{completed} of {tasks.length} roadmap tasks completed</p></div><strong>{tasks.length-completed} left</strong></div><ProgressBar value={totalPercent} label="Overall learning path progress"/></Card>
    <nav className="roadmap-view-tabs" aria-label="Learning path views">{([['week','This week'],['weeks','All weeks'],['ai','AI topics'],['career','Career guide']] as const).map(([id,label])=><button type="button" key={id} className={view===id?'active':''} aria-current={view===id?'page':undefined} onClick={()=>setView(id)}>{label}</button>)}</nav>
    {view==='week'&&<div className="current-week-bar"><div><span className="eyebrow">FOCUSED VIEW</span><strong>Week {progress.selectedWeek} of {allWeeks.length}</strong></div><div><button type="button" disabled={progress.selectedWeek<=1} onClick={()=>openWeek(progress.selectedWeek-1)}>Previous</button><button type="button" disabled={progress.selectedWeek>=allWeeks.length} onClick={()=>openWeek(progress.selectedWeek+1)}>Next week <ChevronRight size={15}/></button></div></div>}
    {view==='career'&&<>
    <Card className="role-route"><span className="eyebrow">THE COMPLETE ROUTE</span><h2>Six stages. Three career outcomes.</h2><p>Senior software engineering needs dependable delivery and ownership. Applied AI engineering adds model, retrieval, evaluation and safety skills. Architecture grows from repeated design and operation decisions across systems.</p><div className="role-stage-list">{roleStages.map((stage,index)=><article className={openStage===index?'is-open':''} key={stage.weeks}><button type="button" aria-expanded={openStage===index} onClick={()=>setOpenStage(openStage===index?null:index)}><span className="role-stage-index">{index+1}</span><span><small>WEEKS {stage.weeks}</small><strong>{stage.name}</strong></span>{openStage===index?<ChevronDown size={17}/>:<ChevronRight size={17}/>}</button>{openStage===index&&<div><p><strong>Learn:</strong> {stage.skills}</p><p><strong>Build:</strong> {stage.build}</p><p><strong>Pass this gate:</strong> {stage.gate}</p><button className="stage-jump" type="button" onClick={()=>openWeek(Number(stage.weeks.slice(0,2)))}>Open week {Number(stage.weeks.slice(0,2))} <ArrowUpRight size={14}/></button></div>}</article>)}</div></Card>
    <Card className="remote-rhythm"><span className="eyebrow">EVERY WEEK · REMOTE JOB TRACK</span><h2>Study, show proof, apply, learn from feedback</h2><p>Find five fresh roles. Confirm that the employer accepts candidates in Bangladesh or offers relocation. Choose two that match your current evidence, tailor your CV and project links, then record replies and repeated skill gaps in your week notes. Practice one written update and one spoken design explanation in English. Do this from week 1; the 44-week calendar is a learning sequence, not an application waiting period.</p></Card>
    <Card className="ai-change"><span className="eyebrow">HOW TO STAY USEFUL AS AI CHANGES THE WORK</span><h2>Use AI to move faster while owning the result</h2><p>Practice AI-assisted coding in every stage: write the requirement and acceptance cases first, ask AI for an approach or draft, inspect the diff, verify behavior and security, and record what the tool got wrong. Keep your strength in business rules, architecture, review, operations and communication. Recheck job postings and model capabilities monthly; replace low-value tools in the plan when evidence or role requirements change.</p><div className="ai-change-tags"><span>Specify</span><span>Generate</span><span>Review</span><span>Verify</span><span>Operate</span></div></Card>
    <details className="card role-outcomes"><summary><strong>What qualifies you to apply for each role?</strong></summary><div><h3>Senior .NET software engineer</h3><p>Apply when you can show production feature ownership, strong C#/SQL/API decisions, deployment and incident judgment, and examples of helping other engineers. Use the ledger and real work as proof.</p><h3>Applied AI engineer</h3><p>Apply when you can ship an AI feature with prompts, context, RAG, evaluation, safety controls, monitoring and a clear failure policy. Use the document intelligence and business assistant projects as proof.</p><h3>Software architect</h3><p>Use this as a longer-term target. Show repeated design decisions across systems and teams, stakeholder trade-offs, migration plans and operational outcomes. A portfolio design alone does not demonstrate organization-wide ownership.</p><p><strong>Placement check:</strong> Compare your evidence with the actual job posting. Finishing tasks increases readiness; interviews and real delivery establish whether you meet that employer's bar.</p></div></details>
    </>}
    {view==='ai'&&<Card className="ai-path-card"><span className="eyebrow">AI ENGINEERING · YOUR LEARNING MAP</span><h2>What you will learn and prove</h2><p>Follow the weeks in order. Each topic has one small exercise and a concrete artifact to save.</p><div className="ai-path-grid">{aiPath.map(item=><article key={item.title}><small>WEEKS {item.weeks}</small><h3>{item.title}</h3><p><strong>Learn</strong> {item.learn}</p><p><strong>Do</strong> {item.do}</p><p><strong>Save</strong> {item.proof}</p><button className="stage-jump" type="button" onClick={()=>openWeek(Number(item.weeks.slice(0,2)))}>Open related week <ArrowUpRight size={14}/></button></article>)}</div></Card>}
    {view==='career'&&<>
    <details className="card roadmap-intro"><summary><strong>See the full 44-week plan</strong><span>Five phases from CV proof to senior ownership</span></summary>
      <div className="intro-heading"><span className="intro-icon"><BookOpenCheck size={19}/></span><div><div className="eyebrow">START HERE</div><h2>{data.roadmap.learningStrategy.title}</h2></div></div>
      <p>{data.roadmap.learningStrategy.summary}</p>
      <div className="learning-path-grid">{data.roadmap.learningStrategy.steps.map((step,index)=><article className="learning-path-step" key={step.weeks}><span className="learning-path-number">0{index+1}</span><div><small>{step.weeks}</small><strong>{step.title}</strong><p>{step.detail}</p></div></article>)}</div>
      <div className="roadmap-study-rule"><Target size={17}/><span>{data.roadmap.learningStrategy.rule}</span></div>
    </details>
    </>}
    {view==='weeks'&&<div className="roadmap-tools"><span className="pill">{completed} / {tasks.length} tasks complete</span><div className="search-box"><input aria-label="Search roadmap" placeholder="Search weeks and topics…" value={search} onChange={event=>setSearch(event.target.value)}/></div></div>}
    {(view==='week'||view==='weeks')&&data.roadmap.phases.map((phase,phaseIndex)=>{
      const phaseWeeks=phase.weeks.filter(week=>view==='week'?week.week===progress.selectedWeek:visibleWeeks.some(visible=>visible.week===week.week));
      const phaseTasks=phase.weeks.flatMap(week=>week.tasks);const done=phaseTasks.filter(task=>progress.roadmap[task.id]).length;const pct=phaseTasks.length?done/phaseTasks.length*100:0;const isClosed=view==='weeks'&&!search&&closed.includes(phase.startWeek);
      if(!phaseWeeks.length)return null;
      return <section className="phase-section" key={phase.id}>
        {view==='weeks'&&<button className="phase-heading" aria-expanded={!isClosed} onClick={()=>setClosed(current=>current.includes(phase.startWeek)?current.filter(start=>start!==phase.startWeek):[...current,phase.startWeek])}>
          <div className="phase-heading-main"><span className="phase-number">0{phaseIndex+1}</span><div><span className="eyebrow">WEEKS {phase.startWeek}–{phase.endWeek}</span><h2>{phase.title}</h2></div></div>
          <div className="phase-summary"><span>{done}/{phaseTasks.length} tasks</span><div className="phase-bar"><ProgressBar value={pct}/></div>{isClosed?<ChevronRight/>:<ChevronDown/>}</div>
        </button>}
        {!isClosed&&<div className="weeks-list">{phaseWeeks.map(week=>{
          const count=week.tasks.filter(task=>progress.roadmap[task.id]).length;const percent=week.tasks.length?count/week.tasks.length*100:0;const expanded=view==='week'||active===week.week;
          return <div id={`week-${week.week}`} className="week-anchor" key={week.week}><Card className={`week-card ${progress.selectedWeek===week.week?'selected-week':''}`}>
            <button className="week-toggle" aria-expanded={expanded} disabled={view==='week'} onClick={()=>{setActive(expanded?null:week.week);update(state=>{state.expandedWeek=expanded?null:week.week;if(!expanded)state.selectedWeek=week.week})}}>
              <span className="week-index">W{String(week.week).padStart(2,'0')}</span><span className="week-main"><strong>{week.title}</strong><small>{week.objective}</small></span><span className="week-status"><Status value={percent}/><span>{count}/{week.tasks.length}</span>{expanded?<ChevronDown size={18}/>:<ChevronRight size={18}/>}</span>
            </button>
            {expanded&&<div className="week-details">
              <div className="week-learning-grid">
                <section className="learn-order"><div className="eyebrow">WHAT TO LEARN · IN ORDER</div><ol>{week.learningGuide.steps.map((step,index)=><li key={step}><span>{index+1}</span>{step}</li>)}</ol></section>
                <section className="where-to-learn"><div className="eyebrow">THIS WEEK'S REFERENCE</div><p>Read the part that helps with this task: {week.objective}</p>{weekReferences[week.week]&&<a className="focused-reference" href={weekReferences[week.week][1]} target="_blank" rel="noopener noreferrer"><span><strong>{weekReferences[week.week][0]}</strong><small>Open focused guide</small></span><ArrowUpRight size={17}/></a>}</section>
              </div>
              <div className="week-practice"><strong>Put it into practice</strong><p>{week.learningGuide.practice}</p></div>
              {aiPath.filter(item=>item.weeks.split(',').some(part=>{const [start,end]=part.trim().split('–').map(Number);return week.week>=start&&week.week<=(end??start)})).map(item=><div className="week-ai-focus" key={item.title}><strong>{item.title}</strong><p>{item.do}</p><small>Save: {item.proof}</small></div>)}
              <div className="week-detail-grid"><div><h3>Topics to understand</h3><ul className="topic-list">{week.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></div><div className="deliverable-box"><Target size={17}/><div><small>EXPECTED DELIVERABLE</small><p>{week.deliverable}</p></div></div></div>
              <h3>Practical tasks</h3>{week.tasks.map(task=><label key={task.id} className="task-row"><input type="checkbox" checked={!!progress.roadmap[task.id]} onChange={event=>update(state=>{toggleRoadmapTask(state,task.id,event.target.checked)})}/><span>{task.text}</span></label>)}
              <div className="ready-check"><BookOpenCheck size={16}/><div><strong>Ready to move on when</strong><p>{week.learningGuide.readyWhen}</p></div></div>
              <label className="field-label notes-field">Week {week.week} notes<textarea rows={3} placeholder="Capture questions, examples, and useful links…" value={progress.weekNotes[String(week.week)]??''} onChange={event=>update(state=>{state.weekNotes[String(week.week)]=event.target.value})}/></label>
            </div>}
          </Card></div>;
        })}</div>}
      </section>;
    })}
  </>;
}
