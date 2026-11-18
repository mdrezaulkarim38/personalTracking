import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProgressProvider } from '../src/app/ProgressContext';
import { RoadmapPage } from '../src/pages/RoadmapPage';
import type { StaticData } from '../src/types/domain';

const data = {
  roadmap: { learningStrategy: { title: 'Start', summary: 'Learn in order.', steps: [], rule: 'Read, practice, build.' }, phases: [{ id: 'phase-1', title: 'Python foundations', startWeek: 1, endWeek: 1, weeks: [{ week: 1, title: 'Python Fundamentals', objective: 'Build confidence in Python.', topics: ['Types'], tasks: [{ id: 'py-w01-t01', text: 'Create a typed Python project.' }, { id: 'py-w01-t02', text: 'Write pytest coverage.' }], deliverable: 'A tested CLI.', learningGuide: { steps: ['Learn collections.'], resources: [], practice: 'Build a CLI.', readyWhen: 'The tests pass.' } }] }] },
  resources: { resources: [] }
} as unknown as StaticData;
function mount() { return render(<ProgressProvider data={data}><MemoryRouter><RoadmapPage/></MemoryRouter></ProgressProvider>); }
describe('roadmap task tracking',()=>{
 beforeEach(()=>localStorage.clear()); afterEach(cleanup);
 it('toggles individual task state and restores it from LocalStorage',()=>{
  const first=mount(); const checkbox=screen.getByLabelText(/create a typed python project/i) as HTMLInputElement; fireEvent.click(checkbox); expect(checkbox.checked).toBe(true); expect(Object.keys(JSON.parse(localStorage.getItem('ai-career-guide-v1')!).roadmap)).toContain('py-w01-t01'); first.unmount(); mount(); expect((screen.getByLabelText(/create a typed python project/i) as HTMLInputElement).checked).toBe(true); expect((screen.getByLabelText(/write pytest coverage/i) as HTMLInputElement).checked).toBe(false);
 });
});
