import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function ExamCard({ exam }) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-all border hover:border-primary/50 group">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-2">
          {exam.category?.name ? (
            <Badge variant="outline" className="text-xs font-normal">
              {exam.category.name}
            </Badge>
          ) : (
            <div />
          )}
          {exam.logo_url && (
            <img
              src={exam.logo_url}
              alt={exam.name}
              className="h-7 w-7 object-contain rounded"
            />
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {exam.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm mt-1">
          {exam.description || 'Full length online mock test series for competitive examination preparation.'}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/exams/${exam.slug}`}>
            View Exam
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}