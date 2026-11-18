import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadStaticData } from '../src/services/dataService';

describe('static curriculum JSON loading',()=>{
  afterEach(()=>vi.unstubAllGlobals());
  it('validates and retains phase week ranges from the real public assets',async()=>{
    vi.stubGlobal('fetch',vi.fn(async(input:RequestInfo|URL)=>{
      const name=String(input).replace(/^\/data\//,'');
      const body=await readFile(resolve(process.cwd(),'public','data',name),'utf8');
      return {ok:true,json:async()=>JSON.parse(body)} as Response;
    }));
    const data=await loadStaticData();
    expect(data.roadmap.phases).toHaveLength(6);
    expect(data.syllabus.stages).toHaveLength(18);
    expect(data.projects.projects).toHaveLength(12);
    const topics = data.syllabus.stages.flatMap(stage => stage.topics);
    const taskIds = data.roadmap.phases.flatMap(phase => phase.weeks.flatMap(week => week.tasks.map(task => task.id)));
    expect(new Set(topics.map(topic => topic.id)).size).toBe(topics.length);
    expect(new Set(taskIds)).toEqual(new Set(topics.map(topic => `evidence-${topic.id}`)));
    expect(data.roadmap.phases.map(phase=>[phase.startWeek,phase.endWeek])).toEqual([[1,8],[9,16],[17,24],[25,32],[33,40],[41,44]]);
    expect(data.roadmap.phases.find(phase=>1>=phase.startWeek&&1<=phase.endWeek)?.title).toBe('Python engineering foundations');
  });
});
