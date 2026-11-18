import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function RouteErrorFallback() {
  const error=useRouteError(); const detail=error instanceof Error?error.message:'An unexpected application error occurred.';
  return <main className="route-error-screen"><section className="route-error-card"><div className="gate-icon warn"><AlertTriangle/></div><div className="eyebrow">WORKSPACE ERROR</div><h1>This page couldn’t load</h1><p>{detail}</p><div className="gate-actions"><button className="button primary" onClick={()=>window.location.reload()}><RotateCcw size={15}/> Reload workspace</button><Link className="button secondary" to="/">Return to dashboard</Link></div><p className="fine-print">Your saved progress remains in this browser. If the issue continues, export a backup before troubleshooting.</p></section></main>;
}
