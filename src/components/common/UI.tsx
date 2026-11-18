import type { ReactNode } from 'react';
import { Check, Circle, Clock3 } from 'lucide-react';
export function PageHeading({eyebrow,title,description,actions}:{eyebrow?:string;title:string;description:string;actions?:ReactNode}) { return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>{actions&&<div className="heading-actions">{actions}</div>}</div>; }
export function Card({children,className=''}:{children:ReactNode;className?:string}) { return <section className={`card ${className}`}>{children}</section>; }
export function SectionTitle({title,detail,action}:{title:string;detail?:string;action?:ReactNode}) { return <div className="section-title"><div><h2>{title}</h2>{detail&&<p>{detail}</p>}</div>{action}</div>; }
export function ProgressBar({value}:{value:number}) { return <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>; }
export function Status({value}:{value:number}) { return value===100?<span className="status done"><Check size={13}/>Complete</span>:value>0?<span className="status progress"><Clock3 size={13}/>In progress</span>:<span className="status todo"><Circle size={12}/>Not started</span>; }
export function EmptyState({title,detail}:{title:string;detail:string}) { return <div className="empty-state"><div className="empty-icon"><Circle size={20}/></div><strong>{title}</strong><p>{detail}</p></div>; }
export function Field({label,...props}:{label:string;id:string;[k:string]:any}) { return <label className="field-label" htmlFor={props.id}>{label}<input {...props}/></label>; }
