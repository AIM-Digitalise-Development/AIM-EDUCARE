import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
}) {
  if (loading) {
    return <LoadingSpinner text="Loading data..." />;
  }

  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.plans)
    ? data.plans
    : [];

  if (!rows || rows.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  const cols = Array.isArray(columns) ? columns : [];

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((col, idx) => (
              <TableHead key={col.key || idx} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rIdx) => (
            <TableRow
              key={row?.id || rIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              {cols.map((col, cIdx) => (
                <TableCell key={col.key || cIdx} className={col.className}>
                  {col.render ? col.render(row) : row?.[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}