import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCareer } from '../app/ProgressContext';
import { Card, PageHeading } from '../components/common/UI';
import { APPLICATION_STATUSES, ELIGIBILITY } from '../types/domain';
import type { RemoteApplication } from '../types/domain';

const blank = (): RemoteApplication => ({
  id: '', company: '', role: '', url: '', status: 'Saved', eligibility: 'Unverified',
  overlap: '', evidence: '', appliedOn: '', followUp: '', notes: ''
});

export function RemotePage() {
  const { progress, update } = useCareer();
  const [draft, setDraft] = useState<RemoteApplication | null>(null);
  const [filter, setFilter] = useState('');
  const [confirmedOnly, setConfirmedOnly] = useState(false);
  const [removeId, setRemoveId] = useState('');
  const [error, setError] = useState('');
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const due = progress.applications.filter(job => job.status !== 'Closed' && job.followUp && job.followUp <= today).length;
  const jobs = progress.applications.filter(job =>
    (!filter || job.status === filter) &&
    (!confirmedOnly || job.eligibility === 'Bangladesh eligible' || job.eligibility === 'Contractor eligible')
  ).sort((a, b) => (a.followUp || '9999').localeCompare(b.followUp || '9999'));

  function edit(job: RemoteApplication) {
    setError('');
    setDraft(job);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const job = { ...draft, id: draft.id || crypto.randomUUID(), company: draft.company.trim(), role: draft.role.trim(), url: draft.url.trim() };
    if (!job.company || !job.role || job.url && !/^https?:\/\//i.test(job.url)) {
      setError('Enter a company and role. Use an HTTP or HTTPS job posting link.');
      return;
    }
    update(state => {
      state.applications = draft.id ? state.applications.map(existing => existing.id === job.id ? job : existing) : [...state.applications, job];
    });
    setDraft(null);
  }

  return <>
    <PageHeading title="Remote job search" description="Track roles you can do from Bangladesh and the engineering evidence you’ll send with each application." actions={<button type="button" className="button primary" onClick={() => edit(blank())}>Add opportunity</button>}/>
    <Card className="curriculum-guide">
      <h2>Target remote AI backend and applied AI roles</h2>
      <p>Start with Python API and enterprise RAG evidence. Use your .NET experience to explain transactional workflows, authorization and production ownership.</p>
      <ol>
        <li>Verify Bangladesh or contractor eligibility with the employer. Record the source in your notes.</li>
        <li>Confirm working-hour overlap in UTC and Asia/Dhaka. For example, 13:00–16:00 UTC is 19:00–22:00 in Dhaka.</li>
        <li>Map three role requirements to proof. Send a reproducible portfolio link, a short decision write-up and a relevant work example.</li>
        <li>Record a follow-up date, log feedback, and turn recurring gaps into study tasks.</li>
      </ol>
      <div className="resource-links"><Link to="/projects">Portfolio</Link><Link to="/interviews">Interview practice</Link><Link to="/checklist">Readiness checklist</Link></div>
    </Card>
    <Card className="curriculum-guide">
      <h2>Match the role to your evidence</h2>
      <dl>
        <dt>AI backend / Python AI</dt><dd>Show a deployed FastAPI service with auth, queues, tests and an operational trace.</dd>
        <dt>Applied AI / AI engineer</dt><dd>Show a measured baseline, structured outputs, release evaluation and a user workflow.</dd>
        <dt>RAG / LLM engineer</dt><dd>Show retrieval ablations, guarded citations, failure slices and a model cost/latency decision.</dd>
        <dt>Senior AI engineer</dt><dd>Bring outcomes across real releases, an operational incident, a design trade-off you owned and proof of mentoring.</dd>
      </dl>
    </Card>
    <div className="mini-stat-row">
      <div className="mini-stat"><strong>{progress.applications.length}</strong><span>Tracked opportunities</span></div>
      <div className="mini-stat"><strong>{progress.applications.filter(job => job.status === 'Interviewing').length}</strong><span>Interviewing</span></div>
      <div className="mini-stat"><strong>{due}</strong><span>Follow-ups due</span></div>
    </div>
    {draft && <Card className="curriculum-guide">
      <h2>{draft.id ? 'Edit opportunity' : 'New opportunity'}</h2>
      <form className="remote-form" onSubmit={save}>
        <label className="field-label">Company<input required value={draft.company} onChange={event => setDraft({ ...draft, company: event.target.value })}/></label>
        <label className="field-label">Role<input required value={draft.role} onChange={event => setDraft({ ...draft, role: event.target.value })}/></label>
        <label className="field-label">Posting URL<input type="url" value={draft.url} onChange={event => setDraft({ ...draft, url: event.target.value })}/></label>
        <label className="field-label">Working-hour overlap<input placeholder="13:00–16:00 UTC / 19:00–22:00 Dhaka" value={draft.overlap} onChange={event => setDraft({ ...draft, overlap: event.target.value })}/></label>
        <label className="field-label">Eligibility<select value={draft.eligibility} onChange={event => { const value = ELIGIBILITY.find(item => item === event.target.value); if (value) setDraft({ ...draft, eligibility: value }); }}>{ELIGIBILITY.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field-label">Status<select value={draft.status} onChange={event => { const value = APPLICATION_STATUSES.find(item => item === event.target.value); if (value) setDraft({ ...draft, status: value }); }}>{APPLICATION_STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field-label">Application date<input type="date" value={draft.appliedOn} onChange={event => setDraft({ ...draft, appliedOn: event.target.value })}/></label>
        <label className="field-label">Follow-up date<input type="date" value={draft.followUp} onChange={event => setDraft({ ...draft, followUp: event.target.value })}/></label>
        <label className="field-label">Portfolio evidence<input value={draft.evidence} onChange={event => setDraft({ ...draft, evidence: event.target.value })}/></label>
        <label className="field-label full-field">Fit, eligibility source and feedback<textarea rows={3} value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })}/></label>
        {error && <p role="alert" className="full-field">{error}</p>}
        <div className="form-actions"><button type="button" className="button secondary" onClick={() => setDraft(null)}>Cancel</button><button className="button primary">Save opportunity</button></div>
      </form>
    </Card>}
    <div className="filter-toolbar">
      <select aria-label="Filter applications by status" value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="">All statuses</option>{APPLICATION_STATUSES.map(value => <option key={value}>{value}</option>)}
      </select>
      <label><input type="checkbox" checked={confirmedOnly} onChange={event => setConfirmedOnly(event.target.checked)}/> Eligible from Bangladesh only</label>
    </div>
    {jobs.map(job => <Card className="curriculum-guide remote-job" key={job.id}>
      <h2>{job.role} · {job.company}</h2>
      <p>{job.status} · {job.eligibility}{job.appliedOn && ` · Applied ${job.appliedOn}`}{job.followUp && ` · Follow up ${job.followUp}`}{job.status !== 'Closed' && job.followUp && job.followUp <= today && ' · Due'}</p>
      {job.overlap && <p><strong>Overlap</strong> {job.overlap}</p>}
      {job.evidence && <p><strong>Evidence</strong> {job.evidence}</p>}
      {job.notes && <p>{job.notes}</p>}
      <div className="form-actions">
        {job.url && <a className="button secondary" href={job.url} target="_blank" rel="noreferrer">Open posting</a>}
        <button className="button secondary" onClick={() => edit(job)}>Edit</button>
        {removeId === job.id ? <>
          <button className="button secondary" onClick={() => setRemoveId('')}>Keep opportunity</button>
          <button className="button danger" onClick={() => {
            update(state => { state.applications = state.applications.filter(item => item.id !== job.id); });
            if (draft?.id === job.id) setDraft(null);
            setRemoveId('');
          }}>Confirm removal</button>
        </> : <button className="button secondary" onClick={() => setRemoveId(job.id)}>Remove</button>}
      </div>
    </Card>)}
    {!jobs.length && <p className="empty-state">{progress.applications.length ? 'No opportunities match these filters.' : 'Add an opportunity to start your pipeline.'}</p>}
  </>;
}
