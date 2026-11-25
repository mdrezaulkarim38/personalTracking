import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RouteErrorFallback } from '../components/common/RouteErrorFallback';

const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const RoadmapPage = lazy(() => import('../pages/RoadmapPage').then(m => ({ default: m.RoadmapPage })));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const page = (element: ReactNode) => <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>{element}</Suspense>;

export const router = createBrowserRouter([{ path: '/', element: <AppShell />, errorElement: <RouteErrorFallback />, children: [
  { index: true, element: page(<DashboardPage />) },
  { path: 'roadmap', element: page(<RoadmapPage />) },
  { path: 'projects', element: page(<ProjectsPage />) },
  { path: 'settings', element: page(<SettingsPage />) },
  { path: '*', element: <Navigate to="/" replace /> }
]}]);
