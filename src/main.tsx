import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProgressProvider } from './app/ProgressContext';
import { App } from './app/App';
import { loadStaticData } from './services/dataService';
import './styles/index.css';

async function boot() {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<div className="loading-screen"><div className="spinner" />Loading your career workspace…</div>);
  try { const data = await loadStaticData(); root.render(<React.StrictMode><ProgressProvider data={data}><App /></ProgressProvider></React.StrictMode>); }
  catch (error) { root.render(<main className="fatal-error"><h1>Workspace data could not load</h1><p>{error instanceof Error ? error.message : 'Unexpected error.'}</p><p>Run <code>npm run dev</code> and refresh.</p><button onClick={() => location.reload()}>Retry</button></main>); }
}
void boot();
