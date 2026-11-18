import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading } from '../components/common/UI';
import { TOPIC_STATUSES } from '../types/domain';
import type { SyllabusTopic, TopicProgress } from '../types/domain';

const depth = ['Awareness', 'Working knowledge', 'Professional proficiency', 'Advanced engineering', 'Senior ownership'];

function TopicCard({ topic, saved }: { topic: SyllabusTopic; saved?: TopicProgress }) {
  const { update } = useCareer();
  const status = saved?.status ?? 'Not started';
  const evidence = saved?.evidence ?? '';
  const [learning, practice, project, revision] = topic.hours;

  return <details className="curriculum-topic">
    <summary><strong>{topic.title}</strong><span>{topic.priority} · L{topic.depth} · {learning + practice + project + revision}h · {status}</span></summary>
    <div className="curriculum-detail">
      <p><strong>{depth[topic.depth - 1]}</strong> · {learning}h learning · {practice}h practice · {project}h project · {revision}h revision</p>
      <dl>
        <dt>Required understanding</dt><dd>{topic.concepts}</dd>
        <dt>Implementation exercise</dt><dd>{topic.exercise}</dd>
        <dt>Assessment question</dt><dd>{topic.assessment}</dd>
        <dt>Pass criteria</dt><dd>{topic.pass}</dd>
        <dt>Study later</dt><dd>{topic.defer}</dd>
      </dl>
      <label className="field-label">Evidence and review notes
        <textarea rows={2} placeholder="Link to code, measurements, or a review" value={evidence} onChange={event => {
          const next = event.target.value;
          update(state => { state.topics[topic.id] = { evidence: next, status: status === 'Completed' && !next.trim() ? 'Assessment' : status }; });
        }}/>
      </label>
      <label className="mt-3 flex w-fit items-center gap-3 text-sm font-medium text-muted">Progress
        <select className="w-auto min-w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" aria-label={`Progress for ${topic.title}`} value={status} onChange={event => {
          const next = TOPIC_STATUSES.find(value => value === event.target.value);
          if (next) update(state => { state.topics[topic.id] = { evidence, status: next }; });
        }}>
          {TOPIC_STATUSES.map(value => <option key={value} disabled={value === 'Completed' && !evidence.trim()}>{value}</option>)}
        </select>
      </label>
      {!evidence.trim() && <small>Add review evidence before marking this topic complete.</small>}
    </div>
  </details>;
}

export function SyllabusPage() {
  const { data, progress } = useCareer();
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const topics = data.syllabus.stages.flatMap(stage => stage.topics);
  const resources = new Map(data.resources.resources.map(resource => [resource.name, resource.url]));
  const stages = data.syllabus.stages.map(stage => ({
    ...stage,
    topics: stage.topics.filter(topic =>
      (!priority || topic.priority === priority) &&
      (!onlyOpen || progress.topics[topic.id]?.status !== 'Completed') &&
      [stage.title, topic.title, topic.concepts, topic.exercise].some(value => value.toLowerCase().includes(query.trim().toLowerCase()))
    )
  })).filter(stage => stage.topics.length);

  return <>
    <PageHeading title="Topic syllabus" description="Open a topic to see the required depth, hours, independent exercise and assessment." actions={<Link className="button secondary" to="/roadmap">Weekly roadmap</Link>}/>
    <Card className="curriculum-guide">
      <h2>How to pass a topic</h2>
      <p>P0 is foundational, P1 professional, P2 advanced, and P3 optional. L1 explains a use and limit. L2 implements a small example. L3 adds independent implementation, debugging and tests. L4 adds measured trade-offs and failure handling. L5 requires real adoption and mentoring evidence.</p>
      <p>{topics.filter(topic => progress.topics[topic.id]?.status === 'Completed').length} of {topics.length} topics completed</p>
    </Card>
    <details className="card curriculum-guide">
      <summary><strong>Starting assessment and career gates</strong></summary>
      <p>You bring enterprise backend, SQL, authorization and domain knowledge. Spend eight hours collecting evidence across four diagnostics.</p>
      <ol>
        <li>Build a tested Python CSV task without notes.</li>
        <li>Tune a PostgreSQL query and explain the plan.</li>
        <li>Build a small labeled evaluation for your existing RAG app.</li>
        <li>Record a design review for tenant-aware document search.</li>
      </ol>
      <dl>
        <dt>Junior</dt><dd>Implements bounded tasks with review and can use existing tests and deployments.</dd>
        <dt>Mid-level</dt><dd>Owns a service or AI feature, its baseline, permission boundaries and operational failures.</dd>
        <dt>Senior</dt><dd>Owns ambiguous trade-offs across quality, cost, reliability and security. Demonstrates real launches, incident follow-up and mentoring.</dd>
        <dt>Staff</dt><dd>Sets and evolves standards across teams, leads cross-service decisions and grows other technical leaders.</dd>
      </dl>
      <p>Specialize after the capstone in enterprise retrieval, AI platform, durable business workflows, model serving, multimodal documents, or model development.</p>
    </details>
    <div className="filter-toolbar">
      <div className="search-box"><input aria-label="Search syllabus" placeholder="Search topics and mechanisms" value={query} onChange={event => setQuery(event.target.value)}/></div>
      <select aria-label="Filter syllabus priority" value={priority} onChange={event => setPriority(event.target.value)}>
        <option value="">All priorities</option>{['P0', 'P1', 'P2', 'P3'].map(value => <option key={value}>{value}</option>)}
      </select>
      <label><input type="checkbox" checked={onlyOpen} onChange={event => setOnlyOpen(event.target.checked)}/> Incomplete only</label>
    </div>
    {stages.map(stage => <Card className="curriculum-guide" key={stage.id}>
      <h2>{stage.title}</h2><p>{stage.objective}</p>
      <dl>
        <dt>Prerequisites</dt><dd>{stage.prerequisite}</dd>
        <dt>Portfolio progression</dt><dd>{stage.progression}</dd>
        <dt>Production scenario</dt><dd>{stage.scenario}</dd>
        <dt>Stage exit criteria</dt><dd>{stage.gate}</dd>
      </dl>
      <div className="resource-links">{stage.resources.map(name => <a key={name} href={resources.get(name)} target="_blank" rel="noreferrer">{name}</a>)}</div>
      {stage.topics.map(topic => <TopicCard key={topic.id} topic={topic} saved={progress.topics[topic.id]}/>)}
    </Card>)}
    {!stages.length && <p className="empty-state">No topics match these filters.</p>}
  </>;
}
