import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, FolderKanban, Home, Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { useCareer } from '../../app/ProgressContext';
import { ROADMAP_WEEKS } from '../../types/domain';

const links = [
  { to: '/', label: 'Today', icon: Home },
  { to: '/roadmap', label: 'Learning path', icon: BookOpen },
  { to: '/projects', label: 'Projects', icon: FolderKanban }
];
const titles: Record<string,string> = { '/':'Today','/roadmap':'Learning path','/projects':'Projects','/settings':'Settings' };

export function AppShell() {
  const [open, setOpen] = useState(false);
  const { progress, update, notice } = useCareer();
  const loc = useLocation();
  return <div className={`app-frame ${progress.preferences.theme}`}>
    {open && <button aria-label="Close navigation overlay" className="mobile-scrim" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark">RK</span><div><strong>Career Studio</strong><small>BACKEND × AI</small></div><button className="icon-button close-sidebar" aria-label="Close menu" onClick={() => setOpen(false)}><X size={19}/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">{links.map(({to,label,icon:Icon}) => <NavLink end={to==='/'} key={to} to={to} onClick={() => setOpen(false)} className={({isActive})=>`nav-item ${isActive?'active':''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><NavLink to="/settings" onClick={() => setOpen(false)} className={({isActive})=>`nav-item ${isActive?'active':''}`}><Settings size={18}/><span>Settings & backup</span></NavLink></div>
    </aside>
    <main className="main-area"><header className="topbar"><button aria-label="Open navigation" className="icon-button menu-trigger" onClick={()=>setOpen(true)}><Menu size={21}/></button><div className="breadcrumbs"><strong>{titles[loc.pathname] ?? 'Today'}</strong></div><div className="topbar-right"><span className="top-date">{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</span><button className="theme-toggle" aria-label={`Switch to ${progress.preferences.theme==='light'?'dark':'light'} theme`} onClick={()=>update(p=>{p.preferences.theme=p.preferences.theme==='light'?'dark':'light'})}>{progress.preferences.theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button></div></header>{notice&&<div className="toast" role="status">{notice}</div>}<div className="page-container"><Outlet/></div><footer className="footer">Senior .NET + AI <span>·</span> Week {progress.selectedWeek} of {ROADMAP_WEEKS}</footer></main>
  </div>;
}
