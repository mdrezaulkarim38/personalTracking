const KEY='ai-career-guide-v1';
const SCHEMA_VERSION=3;
const CURRICULUM_VERSION=2;
const KNOWN_VIEWS=new Set(['dashboard','roadmap','routine','projects','stack','resources','interviews','checklist','journal','planner','challenges','analytics']);
const RETAINED_PROJECT_IDS=new Set(['document-intelligence','business-assistant','evaluation-workbench','assistant-platform']);
const fresh=()=>({schemaVersion:SCHEMA_VERSION,curriculumVersion:CURRICULUM_VERSION,roadmap:{},weekNotes:{},projects:{},checklist:{},interviews:{},challenges:{},journal:[],planner:{},studySessions:[],selectedWeek:1,expandedWeek:1,calendarOffsetWeeks:0,selectedView:'dashboard',preferences:{dailyTargetMinutes:220}});
function isRecord(x){return !!x&&typeof x==='object'&&!Array.isArray(x)}
function validDate(s){if(typeof s!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number),date=new Date(y,m-1,d);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d}
function validTask(t){return isRecord(t)&&typeof t.id==='string'&&typeof t.description==='string'&&validDate(t.date)&&typeof t.done==='boolean'}
function validJournal(e){return isRecord(e)&&typeof e.id==='string'&&validDate(e.date)&&['topics','learned','problems','solutions','next'].every(k=>typeof e[k]==='string')}
function validSession(x){return isRecord(x)&&typeof x.id==='string'&&validDate(x.date)&&Number.isFinite(x.durationMinutes)&&x.durationMinutes>0&&typeof x.topic==='string'&&((Number.isInteger(x.week)&&x.week>=1&&x.week<=24&&x.curriculumVersion!==1)||(x.week===null&&x.curriculumVersion===1&&Number.isInteger(x.legacyWeek)&&x.legacyWeek>=1&&x.legacyWeek<=24))&&typeof x.accomplished==='string'}
function normalizeCurrent(input){if(!isRecord(input)||input.schemaVersion!==SCHEMA_VERSION)return null;const state={...fresh(),...input};state.preferences={...fresh().preferences,...(isRecord(input.preferences)?input.preferences:{})};return validState(state)?state:null}
function migrateLegacy(input){if(!isRecord(input))return null;const version=Number(input.schemaVersion||1);if(version<1||version>=SCHEMA_VERSION)return null;const next=fresh();
 // Old roadmap identities now refer to different Python topics, so completion and notes are deliberately not carried forward.
 next.journal=Array.isArray(input.journal)?input.journal.filter(validJournal):[];
 next.studySessions=Array.isArray(input.studySessions)?input.studySessions.filter(x=>isRecord(x)&&validDate(x.date)&&Number.isFinite(x.durationMinutes)&&x.durationMinutes>0&&typeof x.topic==='string'&&Number.isInteger(x.week)&&x.week>=1&&x.week<=24&&typeof x.accomplished==='string').map(x=>({...x,legacyWeek:x.week,week:null,curriculumVersion:1})):[];
 next.planner=Object.fromEntries(Object.entries(isRecord(input.planner)?input.planner:{}).map(([date,value])=>{if(!validDate(date)||!isRecord(value))return[date,null];return[date,{...(typeof value.goal==='string'?{goal:value.goal}:{}),...(typeof value.done==='boolean'?{done:value.done}:{}),tasks:Array.isArray(value.tasks)?value.tasks.filter(validTask):[]}]}).filter(([date,value])=>validDate(date)&&value!==null));
 next.projects=Object.fromEntries(Object.entries(isRecord(input.projects)?input.projects:{}).filter(([id])=>RETAINED_PROJECT_IDS.has(id)).map(([id,value])=>{const notes=isRecord(value)&&typeof value.notes==='string'?value.notes:'';return[id,{done:[],notes}]}));
 if(isRecord(input.preferences)&&Number.isFinite(input.preferences.dailyTargetMinutes)&&input.preferences.dailyTargetMinutes>0)next.preferences.dailyTargetMinutes=input.preferences.dailyTargetMinutes;
 if(Number.isInteger(input.selectedWeek)&&input.selectedWeek>=1&&input.selectedWeek<=24)next.selectedWeek=input.selectedWeek;
 next.expandedWeek=next.selectedWeek;
 if(Number.isInteger(input.calendarOffsetWeeks))next.calendarOffsetWeeks=input.calendarOffsetWeeks;
 if(typeof input.selectedView==='string'&&KNOWN_VIEWS.has(input.selectedView))next.selectedView=input.selectedView;
 return validState(next)?next:null
}
function prepareProgress(input){if(isRecord(input)&&input.schemaVersion===SCHEMA_VERSION)return normalizeCurrent(input);return migrateLegacy(input)}
function validState(v){
 if(!isRecord(v)||v.schemaVersion!==SCHEMA_VERSION||v.curriculumVersion!==CURRICULUM_VERSION||!isRecord(v.roadmap)||!isRecord(v.weekNotes)||!isRecord(v.projects)||!isRecord(v.checklist)||!isRecord(v.interviews)||!isRecord(v.challenges)||!Array.isArray(v.journal)||!isRecord(v.planner)||!Array.isArray(v.studySessions)||!isRecord(v.preferences)||!Number.isInteger(v.selectedWeek)||v.selectedWeek<1||v.selectedWeek>24||(v.expandedWeek!==null&&(!Number.isInteger(v.expandedWeek)||v.expandedWeek<1||v.expandedWeek>24))||!Number.isInteger(v.calendarOffsetWeeks))return false;
 if(!Object.values(v.roadmap).every(x=>typeof x==='boolean')||!Object.values(v.weekNotes).every(x=>typeof x==='string'))return false;
 if(!Object.values(v.projects).every(x=>isRecord(x)&&Array.isArray(x.done)&&x.done.every(i=>typeof i==='string')&&typeof x.notes==='string'))return false;
 if(!Object.values(v.checklist).every(x=>typeof x==='boolean'))return false;
 if(!Object.values(v.challenges).every(x=>isRecord(x)&&(x.attempted===undefined||typeof x.attempted==='boolean')&&(x.solved===undefined||typeof x.solved==='boolean')&&(x.notes===undefined||typeof x.notes==='string')))return false;
 if(!Object.values(v.interviews).every(x=>isRecord(x)&&(x.practiced===undefined||typeof x.practiced==='boolean')&&(x.revise===undefined||typeof x.revise==='boolean')&&(x.difficult===undefined||typeof x.difficult==='boolean')&&(x.answer===undefined||typeof x.answer==='string')&&(x.revisionNotes===undefined||typeof x.revisionNotes==='string')))return false;
 if(!Object.values(v.planner).every(x=>isRecord(x)&&(x.goal===undefined||typeof x.goal==='string')&&(x.done===undefined||typeof x.done==='boolean')&&(x.tasks===undefined||Array.isArray(x.tasks)&&x.tasks.every(validTask))))return false;
 if(!v.studySessions.every(validSession)||!Number.isFinite(v.preferences.dailyTargetMinutes)||v.preferences.dailyTargetMinutes<1||!v.journal.every(validJournal))return false;
 return true
}
let state=fresh();
function inspectStoredProgress(){try{const raw=localStorage.getItem(KEY);if(raw===null)return{status:'empty'};let parsed;try{parsed=JSON.parse(raw)}catch{return{status:'corrupt'}}if(!isRecord(parsed))return{status:'corrupt'};const version=Number(parsed.schemaVersion||1);if(version>SCHEMA_VERSION||version<1)return{status:'unsupported',version};if(version<SCHEMA_VERSION){const progress=prepareProgress(parsed);if(!progress)return{status:'corrupt'};return{status:'migration-required',version,summary:summarizeMigration(parsed),progress}}if(!normalizeCurrent(parsed))return{status:'corrupt'};return{status:'current'}}catch{return{status:'unavailable'}}}
function summarizeMigration(input){const planner=isRecord(input.planner)?Object.values(input.planner):[],projects=isRecord(input.projects)?Object.values(input.projects):[];return{roadmapCompletions:Object.values(isRecord(input.roadmap)?input.roadmap:{}).filter(Boolean).length,weeklyNotes:Object.values(isRecord(input.weekNotes)?input.weekNotes:{}).filter(x=>typeof x==='string'&&x.trim()).length,projectCompletions:projects.reduce((n,p)=>n+(Array.isArray(p)?p.length:isRecord(p)&&Array.isArray(p.done)?p.done.length:0),0),projectNotes:projects.filter(p=>isRecord(p)&&typeof p.notes==='string'&&p.notes.trim()).length,journalEntries:Array.isArray(input.journal)?input.journal.length:0,studySessions:Array.isArray(input.studySessions)?input.studySessions.length:0,customPlannerTasks:planner.reduce((n,p)=>n+(isRecord(p)&&Array.isArray(p.tasks)?p.tasks.length:0),0)}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){console.error('Could not save progress',e);return false}}
function load(){try{const raw=localStorage.getItem(KEY);if(raw!==null){const parsed=JSON.parse(raw),loaded=normalizeCurrent(parsed);if(loaded)state=loaded;else console.warn('Existing progress needs migration or is invalid; it was not overwritten.')}}catch(e){console.warn('Saved progress could not be read safely; it was not overwritten.',e)}return state}
function get(){return state}
function migrateStoredProgress(){const info=inspectStoredProgress();if(info.status!=='migration-required')return false;const previous=state;state=info.progress;if(!save()){state=previous;return false}return true}
function exportData(){return JSON.stringify({format:'ai-career-guide-progress',backupVersion:3,schemaVersion:SCHEMA_VERSION,curriculumVersion:CURRICULUM_VERSION,exportedAt:new Date().toISOString(),progress:state},null,2)}
function exportStoredBackup(){try{const raw=localStorage.getItem(KEY);if(raw===null)return exportData();let progress;try{progress=JSON.parse(raw)}catch{return JSON.stringify({format:'ai-career-guide-corrupt-backup',backupVersion:0,exportedAt:new Date().toISOString(),rawLocalStorage:raw},null,2)}return JSON.stringify({format:'ai-career-guide-progress',backupVersion:Math.min(Number(progress.schemaVersion)||1,2),schemaVersion:Number(progress.schemaVersion)||1,exportedAt:new Date().toISOString(),progress},null,2)}catch{return null}}
function validateImport(obj){if(!isRecord(obj)||obj.format!=='ai-career-guide-progress'||![1,2,3].includes(Number(obj.backupVersion||obj.version)))return false;return !!prepareProgress(obj.progress)}
function importData(obj){if(!validateImport(obj))return false;const migrated=prepareProgress(obj.progress);if(!migrated)return false;const previous=state;state=migrated;if(!save()){state=previous;return false}return true}
function reset(){const previous=state;state=fresh();if(!save()){state=previous;return false}return true}
function countProgress(s=state){return{roadmapTasks:Object.values(s.roadmap).filter(Boolean).length,notes:Object.values(s.weekNotes).filter(x=>x.trim()).length,journalEntries:s.journal.length,studySessions:s.studySessions.length}}
export{load,get,set,update,exportData,exportStoredBackup,validateImport,importData,reset,countProgress,inspectStoredProgress,migrateStoredProgress,prepareProgress,SCHEMA_VERSION,CURRICULUM_VERSION};
function update(mutator){const previous=state,next=JSON.parse(JSON.stringify(state));mutator(next);state=next;if(!save()){state=previous;return false}return true}
function set(path,value){return update(next=>{const keys=path.split('.');let ref=next;for(const key of keys.slice(0,-1))ref=ref[key]??(ref[key]={});ref[keys.at(-1)]=value})}
