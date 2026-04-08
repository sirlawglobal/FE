import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, PlayCircle, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { enrollmentsService, type Enrollment } from '../services/enrollmentsService';
import AppLayout from '../components/layout/AppLayout';

export const MyCoursesPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await enrollmentsService.getUserEnrollments();
      setEnrollments(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load your courses';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = enrollments.filter(e => parseFloat(String(e.progressPercentage)) >= 100).length;
  const inProgressCount = enrollments.length - completedCount;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader className="w-10 h-10 text-primary-teal animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Personal Classroom</h1>
          <p className="text-foreground/40 font-medium mt-1">{enrollments.length} active learning paths</p>
        </div>
        <Link to="/courses" className="btn-primary px-8 py-3 rounded-2xl text-base font-bold">
          Explore Catalog
        </Link>
      </div>

      {/* Summary Stats */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface rounded-2xl p-6 border border-border flex items-center gap-5 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-teal" />
            </div>
            <div>
              <p className="text-3xl font-display font-black text-foreground">{enrollments.length}</p>
              <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">Enrollments</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-border flex items-center gap-5 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-teal" />
            </div>
            <div>
              <p className="text-3xl font-display font-black text-foreground">{inProgressCount}</p>
              <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">Developing</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-border flex items-center gap-5 transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-xl bg-light-green/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-light-green" />
            </div>
            <div>
              <p className="text-3xl font-display font-black text-foreground">{completedCount}</p>
              <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">Achieved</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border border-dashed">
          <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-foreground/20" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No courses yet</h2>
          <p className="text-foreground/40 mb-8 max-w-sm mx-auto">
            You haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <Link
            to="/courses"
            className="btn-primary inline-flex px-8 py-3 rounded-xl font-bold transition"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const progress = parseFloat(String(enrollment.progressPercentage));
            const isComplete = progress >= 100;
            const courseTitle = enrollment.course?.title || 'Untitled Course';

            return (
              <div key={enrollment.id} className="bg-surface rounded-[32px] overflow-hidden border border-border hover:border-primary-teal/30 hover:shadow-2xl hover:shadow-primary-teal/5 transition-all group flex flex-col">
                {/* Thumbnail */}
                <div className={`h-48 relative overflow-hidden ${
                  isComplete 
                    ? 'bg-gradient-to-br from-light-green to-mid-green' 
                    : 'bg-gradient-to-br from-primary-teal to-deep-teal'
                }`}>
                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-all duration-500 border border-white/30">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  {isComplete && (
                    <div className="absolute top-5 right-5 bg-white text-light-green p-3 rounded-2xl shadow-xl rotate-3">
                      <Trophy className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 leading-snug tracking-tight group-hover:text-primary-teal transition-colors">
                    {courseTitle}
                  </h3>

                  <div className="flex items-center gap-2 text-foreground/40 text-xs mb-8 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Began {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>

                  {/* Progress */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Mastery</span>
                      <span className={`text-sm font-black ${isComplete ? 'text-light-green' : 'text-primary-teal'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-background rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isComplete ? 'bg-light-green' : 'bg-primary-teal'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    <Link
                      to={`/courses/${enrollment.courseId}`}
                      className={`w-full mt-8 py-4 rounded-2xl font-bold transition text-center block text-sm ${
                        isComplete 
                        ? 'bg-light-green/10 text-light-green hover:bg-light-green/20' 
                        : 'bg-primary-teal/10 text-primary-teal hover:bg-primary-teal/20'
                      }`}
                    >
                      {isComplete ? 'Review Content' : 'Continue Path'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default MyCoursesPage;
