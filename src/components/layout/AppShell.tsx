import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, BookOpen, BriefcaseBusiness, CalendarDays, CheckSquare, ChevronDown, Code2, FileQuestion, FolderKanban, Home, LibraryBig, Menu, Moon, NotebookPen, Settings, Sun, X } from 'lucide-react';
import { useCareer } from '../../app/ProgressContext';
import { ROADMAP_WEEKS } from '../../types/domain';
const primaryLinks = [
  { to: '/', label: 'Start here', icon: Home }, { to: '/roadmap', label: 'Learning path', icon: BookOpen },
  { to: '/projects', label: 'Projects', icon: FolderKanban }, { to: '/remote', label: 'Remote jobs', icon: BriefcaseBusiness }
];
const moreLinks = [
  { to: '/syllabus', label: 'Topic syllabus', icon: LibraryBig }, { to: '/planner', label: 'Study planner', icon: CalendarDays },
  { to: '/challenges', label: 'Practice', icon: Code2 }, { to: '/interviews', label: 'Interview practice', icon: FileQuestion },
  { to: '/resources', label: 'Resources', icon: LibraryBig }, { to: '/checklist', label: 'Career checklist', icon: CheckSquare },
  { to: '/journal', label: 'Learning journal', icon: NotebookPen }, { to: '/analytics', label: 'Analytics', icon: Activity }
];
const titles: Record<string,string> = { '/':'Career overview','/remote':'Remote jobs','/syllabus':'Topic syllabus','/roadmap':'Your learning roadmap','/planner':'Study planner','/projects':'Portfolio projects','/challenges':'Coding challenges','/interviews':'Interview practice','/resources':'Learning resources','/checklist':'Career readiness','/journal':'Learning journal','/analytics':'Learning analytics','/routine':'Daily learning routine','/stack':'Technology stack','/settings':'Settings' };
export function AppShell() {
  const [open, setOpen] = useState(false); const { progress, update, notice } = useCareer(); const loc = useLocation();
  const [toolsOpen, setToolsOpen] = useState(() => moreLinks.some(link => link.to === window.location.pathname) || ['/routine','/stack'].includes(window.location.pathname));
  return <div className={`app-frame ${progress.preferences.theme}`}>
    {open && <button aria-label="Close navigation overlay" className="mobile-scrim" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark">AI</span><div><strong>Career System</strong><small>REMOTE · AI ENGINEERING</small></div><button className="icon-button close-sidebar" aria-label="Close menu" onClick={() => setOpen(false)}><X size={19}/></button></div>
      <div className="side-label">YOUR NEXT STEPS</div><nav className="side-nav" aria-label="Main navigation">{primaryLinks.map(({to,label,icon:Icon}) => <NavLink end={to==='/'} key={to} to={to} onClick={() => setOpen(false)} className={({isActive})=>`nav-item ${isActive?'active':''}`}><Icon size={18}/><span>{label}</span>{label==='Learning path'&&<span className="nav-count">{ROADMAP_WEEKS}</span>}</NavLink>)}</nav>
      <div className="more-nav"><button className="more-nav-toggle" aria-expanded={toolsOpen} onClick={() => setToolsOpen(value => !value)}><span>More tools</span><span>{toolsOpen ? '−' : '+'}</span></button>{toolsOpen && <><nav className="side-nav" aria-label="More learning tools">{moreLinks.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive})=>`nav-item ${isActive?'active':''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav><nav className="side-nav"><NavLink to="/routine" className="nav-item">Study schedule</NavLink><NavLink to="/stack" className="nav-item">Technology choices</NavLink></nav></>}</div>
      <div className="sidebar-bottom"><div className="focus-mini"><span className="focus-dot"/><div><small>YOUR DIRECTION</small><strong>Remote Applied AI Engineer</strong></div></div><NavLink to="/settings" className={({isActive})=>`nav-item ${isActive?'active':''}`}><Settings size={18}/><span>Settings & backups</span></NavLink></div>
    </aside>
    <main className="main-area"><header className="topbar"><button aria-label="Open navigation" className="icon-button menu-trigger" onClick={()=>setOpen(true)}><Menu size={21}/></button><div className="breadcrumbs"><span>Workspace</span><ChevronDown size={14}/><strong>{titles[loc.pathname] ?? 'Workspace'}</strong></div><div className="topbar-right"><span className="top-date">{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</span><button className="theme-toggle" aria-label={`Switch to ${progress.preferences.theme==='light'?'dark':'light'} theme`} onClick={()=>update(p=>{p.preferences.theme=p.preferences.theme==='light'?'dark':'light'})}>{progress.preferences.theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button><div className="avatar">{progress.selectedWeek.toString().padStart(2,'0')}</div></div></header>{notice&&<div className="toast" role="status">{notice}</div>}<div className="page-container"><Outlet/></div><footer className="footer">Remote AI Engineering <span>·</span> <span>Week {progress.selectedWeek} of {ROADMAP_WEEKS}</span></footer></main>
  </div>;
}
