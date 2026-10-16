import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center bg-card/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mb-4">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}