import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useCareer } from './ProgressContext';
import { MigrationGate } from '../components/common/MigrationGate';
export function App() { const { migration } = useCareer(); return migration.status === 'migration' || migration.status === 'corrupt' || migration.status === 'unsupported' ? <MigrationGate /> : <RouterProvider router={router} />; }
