import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RouteErrorFallback } from '../components/common/RouteErrorFallback';

const RemotePage = lazy(() => import('../pages/RemotePage').then(m => ({ default: m.RemotePage })));
const SyllabusPage = lazy(() => import('../pages/SyllabusPage').then(m => ({ default: m.SyllabusPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const RoadmapPage = lazy(() => import('../pages/RoadmapPage').then(m => ({ default: m.RoadmapPage })));
const PlannerPage = lazy(() => import('../pages/PlannerPage').then(m => ({ default: m.PlannerPage })));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ChallengesPage = lazy(() => import('../pages/ChallengesPage').then(m => ({ default: m.ChallengesPage })));
const InterviewsPage = lazy(() => import('../pages/InterviewsPage').then(m => ({ default: m.InterviewsPage })));
const ReferencePages = () => import('../pages/ReferencePages');
const ResourcesPage = lazy(() => ReferencePages().then(m => ({ default: m.ResourcesPage })));
const ChecklistPage = lazy(() => ReferencePages().then(m => ({ default: m.ChecklistPage })));
const RoutinePage = lazy(() => ReferencePages().then(m => ({ default: m.RoutinePage })));
const StackPage = lazy(() => ReferencePages().then(m => ({ default: m.StackPage })));
const JournalPage = lazy(() => import('../pages/JournalPage').then(m => ({ default: m.JournalPage })));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const page = (element: ReactNode) => <Suspense fallback={<div className="route-loading" role="status">Loading workspace page…</div>}>{element}</Suspense>;

export const router = createBrowserRouter([{ path: '/', element: <AppShell />, errorElement: <RouteErrorFallback />, children: [
  { index: true, element: page(<DashboardPage />) }, { path: 'remote', element: page(<RemotePage />) }, { path: 'syllabus', element: page(<SyllabusPage />) }, { path: 'roadmap', element: page(<RoadmapPage />) }, { path: 'planner', element: page(<PlannerPage />) }, { path: 'projects', element: page(<ProjectsPage />) },
  { path: 'challenges', element: page(<ChallengesPage />) }, { path: 'interviews', element: page(<InterviewsPage />) }, { path: 'resources', element: page(<ResourcesPage />) }, { path: 'checklist', element: page(<ChecklistPage />) },
  { path: 'journal', element: page(<JournalPage />) }, { path: 'analytics', element: page(<AnalyticsPage />) }, { path: 'routine', element: page(<RoutinePage />) }, { path: 'stack', element: page(<StackPage />) }, { path: 'settings', element: page(<SettingsPage />) }, { path: '*', element: <Navigate to="/" replace /> }
]}]);
