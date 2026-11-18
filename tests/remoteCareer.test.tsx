import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ProgressProvider } from '../src/app/ProgressContext';
import { RemotePage } from '../src/pages/RemotePage';
import { SyllabusPage } from '../src/pages/SyllabusPage';
import { createBackup, parseBackup } from '../src/services/storage/backupService';
import { readProgress } from '../src/services/storage/storageService';
import type { StaticData } from '../src/types/domain';

const data = {
  resources: { resources: [] },
  syllabus: {
    stages: [{
      id: 'test', title: 'Test stage', prerequisite: 'Python', objective: 'Build',
      scenario: 'Search', progression: 'Baseline', gate: 'Review', resources: [],
      topics: [{
        id: 'search', title: 'Vector search', priority: 'P1', depth: 3, hours: [1, 2, 3, 1],
        concepts: 'Cosine', exercise: 'Rank data', assessment: 'Why cosine?',
        pass: 'Verify rankings', defer: 'SIMD'
      }]
    }]
  }
} as unknown as StaticData;

function mount(page: ReactNode) {
  return render(<ProgressProvider data={data}><MemoryRouter>{page}</MemoryRouter></ProgressProvider>);
}

describe('remote career workspace', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it('saves, filters and reloads applications with eligibility and follow-up evidence', () => {
    const view = mount(<RemotePage/>);
    fireEvent.click(screen.getByRole('button', { name: 'Add opportunity' }));
    fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Example Company' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Remote AI Backend Engineer' } });
    fireEvent.change(screen.getByLabelText('Eligibility'), { target: { value: 'Contractor eligible' } });
    fireEvent.change(screen.getByLabelText('Follow-up date'), { target: { value: '2026-12-01' } });
    fireEvent.change(screen.getByLabelText('Portfolio evidence'), { target: { value: 'Enterprise case study' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save opportunity' }));
    expect(screen.getByText(/Remote AI Backend Engineer · Example Company/)).toBeTruthy();
    const saved = readProgress();
    const backup = parseBackup(createBackup(saved), data);
    expect(backup?.counts.remoteApplications).toBe(1);
    expect(backup?.progress.applications[0]).toMatchObject({ eligibility: 'Contractor eligible', evidence: 'Enterprise case study', followUp: '2026-12-01' });
    view.unmount();
    mount(<RemotePage/>);
    fireEvent.click(screen.getByLabelText('Eligible from Bangladesh only'));
    expect(screen.getByText(/Remote AI Backend Engineer · Example Company/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Filter applications by status'), { target: { value: 'Applied' } });
    expect(screen.queryByText(/Remote AI Backend Engineer · Example Company/)).toBeNull();
  });

  it('requires evidence before completion and reopens a topic if evidence is removed', () => {
    mount(<SyllabusPage/>);
    fireEvent.click(screen.getByText('Vector search'));
    const completed = screen.getByRole('option', { name: 'Completed' }) as HTMLOptionElement;
    expect(completed.disabled).toBe(true);
    const evidence = screen.getByLabelText('Evidence and review notes');
    fireEvent.change(evidence, { target: { value: 'Measured cosine benchmark' } });
    expect(completed.disabled).toBe(false);
    fireEvent.change(screen.getByLabelText('Progress'), { target: { value: 'Completed' } });
    expect(readProgress().topics.search).toEqual({ status: 'Completed', evidence: 'Measured cosine benchmark' });
    fireEvent.change(evidence, { target: { value: '' } });
    expect(readProgress().topics.search.status).toBe('Assessment');
  });
});
