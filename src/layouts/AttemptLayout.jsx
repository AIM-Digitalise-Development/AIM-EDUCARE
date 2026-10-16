import { Outlet } from 'react-router-dom';

export default function AttemptLayout() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-background text-foreground select-none">
      <Outlet />
    </div>
  );
}