import { ArrowRight, CircleCheck, FolderKanban, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading, ProgressBar } from '../components/common/UI';
import { progressTotals } from '../services/storage/storageService';

export function DashboardPage() {
  const { data, progress } = useCareer();
  const totals = progressTotals(progress, data);
  const weeks = data.roadmap.phases.flatMap(phase => phase.weeks);
  const nextWeek = weeks.find(week => week.tasks.some(task => !progress.roadmap[task.id]));
  const nextTask = nextWeek?.tasks.find(task => !progress.roadmap[task.id]);
  const openProject = data.projects.projects.find(project =>
    project.milestones.some(milestone => !progress.projects[project.id]?.done.includes(milestone.id))
  );

  return <>
    <PageHeading eyebrow="Your workspace" title="One step at a time" description="Build your .NET and AI evidence, then use it to pursue roles that fit your experience."/>
    <section className="career-hero simple-hero"><div className="career-hero-copy">
      <span className="career-hero-kicker"><Sparkles size={14}/> YOUR DIRECTION</span>
      <h2>Senior .NET engineering.<br/><em>Useful AI in business software.</em></h2>
      <p>Start with the next task below. Your learning path holds the guidance and references; Projects holds the work you can show.</p>
    </div></section>
    <Card className="learning-progress-card"><div className="learning-progress-head"><div><span className="eyebrow">LEARNING PROGRESS</span><h2>{totals.percent}% complete</h2><p>{totals.completed} of {totals.total} roadmap tasks completed</p></div><strong>{totals.remaining} left</strong></div><ProgressBar value={totals.percent} label="Overall learning path progress"/></Card>
    <section className="simple-dashboard-grid">
      <Card className="next-action-card">
        <div className="dashboard-section-label"><span className="section-pulse"/> NEXT TASK</div>
        {nextWeek && nextTask ? <>
          <div className="next-action-week">WEEK {String(nextWeek.week).padStart(2,'0')} · {nextWeek.title}</div>
          <h2>{nextTask.text}</h2>
          <div className="daily-flow"><span><strong>Learn</strong> {nextWeek.learningGuide.steps[0]}</span><span><strong>Do</strong> {nextWeek.learningGuide.practice}</span><span><strong>Save</strong> {nextWeek.deliverable}</span></div>
          <Link className="text-link" to="/roadmap">Open learning path <ArrowRight size={15}/></Link>
        </> : <><h2>Your roadmap tasks are complete</h2><p>Review your project evidence and choose your next application.</p></>}
      </Card>
      <Card className="portfolio-nudge"><div className="bottom-card-icon"><FolderKanban size={18}/></div><span className="eyebrow">PROJECT WORK</span>
        <h2>{openProject?.name ?? 'Review your portfolio'}</h2>
        <p>Keep each milestone and its proof together. Show what you built, measured, and learned.</p>
        <Link className="text-link" to="/projects">Open projects <ArrowRight size={15}/></Link>
      </Card>
    </section>
    <p className="dashboard-footnote"><CircleCheck size={14}/> Apply for roles whenever your real experience and project evidence match the posting.</p>
  </>;
}
