export function localDateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function getStudyStreak(dateKeys: string[], today = new Date()) {
  const set = new Set(dateKeys); const cursor = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  if (!set.has(localDateKey(cursor))) cursor.setDate(cursor.getDate()-1);
  let count=0; while(set.has(localDateKey(cursor))&&count<10000){count++;cursor.setDate(cursor.getDate()-1)} return count;
}
export function getLongestStudyStreak(dateKeys: string[]) {
  const unique=[...new Set(dateKeys)].sort();let longest=0,current=0,previous='';
  for(const key of unique){if(previous){const prior=new Date(`${previous}T00:00:00`);prior.setDate(prior.getDate()+1);if(localDateKey(prior)===key)current++;else current=1}else current=1;longest=Math.max(longest,current);previous=key}
  return longest;
}
