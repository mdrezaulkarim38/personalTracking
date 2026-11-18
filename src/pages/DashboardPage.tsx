import { ArrowRight, BookOpen, BriefcaseBusiness, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading, ProgressBar } from '../components/common/UI';
import { progressTotals } from '../services/storage/storageService';

export function DashboardPage() {
  const { data, progress } = useCareer();
  const stats = progressTotals(progress, data);
  const nextTopic = data.syllabus.stages.flatMap(stage => stage.topics)
    .find(topic => progress.topics[topic.id]?.status !== 'Completed');
  const nextProject = data.projects.projects.find(project =>
    !progress.projects[project.id]?.done.includes(project.milestones.at(-1)?.id ?? '')
  );

  return <>
    <PageHeading
      eyebrow="Your learning workspace"
      title="Build your next AI engineering skill"
      description="Follow one topic at a time, build practical projects, and prepare for remote roles."
    />

    <Card className="welcome-card">
      <span className="eyebrow">YOUR NEXT TOPIC</span>
      <h2>{nextTopic?.title ?? 'Review your portfolio and interview readiness'}</h2>
      <p>{nextTopic?.concepts ?? 'Your learning topics are complete. Check your project evidence and remote applications.'}</p>
      <div className="welcome-actions">
        <Link className="button primary" to={nextTopic ? '/syllabus' : '/projects'}>
          {nextTopic ? 'Start learning' : 'Review projects'} <ArrowRight size={15}/>
        </Link>
        <Link className="button secondary" to="/remote">Remote job tracker</Link>
      </div>
    </Card>

    <div className="simple-dashboard-grid">
      <Card>
        <BookOpen size={20}/><h2>Learning progress</h2>
        <p>{stats.completed} of {stats.total} practical exercises complete</p>
        <ProgressBar value={stats.percent}/>
        <Link className="text-link" to="/roadmap">View learning path <ArrowRight size={15}/></Link>
      </Card>
      <Card>
        <FolderKanban size={20}/><h2>Build a project</h2>
        <p>{nextProject?.name ?? 'Review your completed projects'}</p>
        <Link className="text-link" to="/projects">Open projects <ArrowRight size={15}/></Link>
      </Card>
      <Card>
        <BriefcaseBusiness size={20}/><h2>Prepare for remote work</h2>
        <p>Track role eligibility, working-hour overlap, applications, and follow-ups.</p>
        <Link className="text-link" to="/remote">Open job tracker <ArrowRight size={15}/></Link>
      </Card>
    </div>
  </>;
}
