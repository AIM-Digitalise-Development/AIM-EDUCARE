import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HelpCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
      <h2 className="text-xl font-semibold mt-2 text-foreground">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="gap-2">
        <Link to="/">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}