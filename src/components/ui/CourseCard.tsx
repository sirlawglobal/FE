import { BookOpen, Users, Clock, Play } from 'lucide-react';
import { Card } from './index';
import { Badge } from './index';

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  students: number;
  lessons: number;
  duration: number;
  rating: number;
  price: number;
  isFavorite?: boolean;
  isEnrolled?: boolean;
  onClick?: () => void;
}

export function CourseCard({
  title,
  description,
  instructor,
  level,
  students,
  lessons,
  duration,
  price,
  isEnrolled,
  onClick,
}: CourseCardProps) {
  return (
    <Card hover onClick={onClick} className="overflow-hidden group bg-surface border-border">
      {/* Header with thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary-teal/10 to-deep-teal/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center group-hover:bg-primary-teal transition-colors duration-300">
            <Play size={24} className="text-primary-teal group-hover:text-white ml-1 transition-colors" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="primary" className="bg-primary-teal/10 text-primary-teal border-primary-teal/20">
            {level}
          </Badge>
          {isEnrolled && (
            <Badge variant="success" className="bg-light-green/10 text-light-green border-light-green/20">
              Enrolled
            </Badge>
          )}
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary-teal transition-colors">
            {title}
          </h3>
          <p className="text-foreground/50 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Instructor */}
        <div className="text-sm text-foreground/40 py-3 border-y border-border/50">
          by <span className="text-foreground font-semibold">{instructor}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-foreground/50">
            <Users size={16} className="text-primary-teal/60" />
            <span>{students}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/50">
            <BookOpen size={16} className="text-primary-teal/60" />
            <span>{lessons}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/50">
            <Clock size={16} className="text-primary-teal/60" />
            <span>{duration}h</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="font-bold text-lg text-foreground">
            {price === 0 ? (
              <span className="text-light-green">Free</span>
            ) : (
              `$${price}`
            )}
          </div>
          <button className="btn-primary px-5 py-2 rounded-xl text-sm font-bold">
            {isEnrolled ? 'Continue' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </Card>
  );
}

interface CourseGridProps {
  courses: CourseCardProps[];
  loading?: boolean;
  onCourseClick?: (courseId: string) => void;
}

export function CourseGrid({ courses, onCourseClick }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="py-12 text-center">
        <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">No courses found</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
          onClick={() => onCourseClick?.(course.id)}
        />
      ))}
    </div>
  );
}
