import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../contexts/authContext';
import {
  BookOpen, Zap, Users, Trophy, TrendingUp, BarChart3,
  PlayCircle, Loader, GraduationCap, Star
} from 'lucide-react';
import { dashboardService, type DashboardData, type StudentDashboard, type InstructorDashboard, type AdminDashboard } from '../services/dashboardService';
import AppLayout from '../components/layout/AppLayout';

export const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading, getCurrentUser } = useAuthStore();
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loadingDash, setLoadingDash] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !authLoading) {
      getCurrentUser();
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoadingDash(true);
      const data = await dashboardService.getDashboard();
      setDashData(data);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoadingDash(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-teal mx-auto mb-4" />
          <p className="text-foreground/60 font-medium">Preparing your space...</p>
        </div>
      </div>
    );
  }

  const renderStudentDashboard = (data: StudentDashboard) => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-primary-teal/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-primary-teal" />
            </div>
            <span className="text-3xl font-display font-bold text-foreground">{data.stats.totalEnrolled}</span>
          </div>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Enrolled Courses</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-light-green/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-light-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-light-green" />
            </div>
            <span className="text-3xl font-display font-bold text-foreground">{data.stats.completedCourses}</span>
          </div>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Completed</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-primary-teal/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-primary-teal" />
            </div>
            <span className="text-3xl font-display font-bold text-foreground">{data.stats.averageProgress}%</span>
          </div>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Avg. Progress</p>
        </div>
      </div>

      {/* Recent Learning */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-display font-bold text-foreground">Continue Your Journey</h3>
          <Link to="/my-courses" className="text-primary-teal hover:opacity-80 text-sm font-bold transition">
            Classroom Overview →
          </Link>
        </div>

        {data.enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.enrolledCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.courseId}`}
                className="bg-surface rounded-2xl p-6 border border-border hover:border-primary-teal/30 hover:shadow-xl hover:shadow-primary-teal/5 transition-all group"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-teal to-deep-teal rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-3 transition-transform">
                    <PlayCircle className="w-8 h-8 text-white/90" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground font-bold truncate group-hover:text-primary-teal transition-colors tracking-tight text-lg">{course.title}</h4>
                    <p className="text-foreground/40 text-xs mt-1 font-medium">
                      Began {new Date(course.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        course.progress >= 100 ? 'bg-light-green' : 'bg-primary-teal'
                      }`}
                      style={{ width: `${Math.min(course.progress, 100)}%` }}
                    />
                  </div>
                  <span className="text-foreground font-black text-sm w-12 text-right">{course.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-16 border-2 border-border border-dashed text-center">
            <GraduationCap className="w-16 h-16 text-foreground/10 mx-auto mb-6" />
            <p className="text-foreground/40 font-medium mb-8 max-w-sm mx-auto text-lg leading-relaxed">Your learning path is clear. Ready to embark on your first course?</p>
            <Link to="/courses" className="btn-primary px-10 py-3.5 rounded-2xl text-lg font-bold">
              Find Your Focus
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/courses" className="bg-surface rounded-[32px] p-8 border border-border hover:border-primary-teal/30 hover:shadow-xl hover:shadow-primary-teal/5 transition-all group overflow-hidden relative">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-teal to-deep-teal rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary-teal/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-foreground font-display font-bold text-2xl tracking-tight">Explore Knowledge</h4>
              <p className="text-foreground/40 font-medium mt-1">Discover industry-vetted courses</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <BookOpen className="w-24 h-24 -rotate-12 translate-x-8 -translate-y-4" />
          </div>
        </Link>
        <Link to="/discussions" className="bg-surface rounded-[32px] p-8 border border-border hover:border-light-green/30 hover:shadow-xl hover:shadow-light-green/5 transition-all group overflow-hidden relative">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-light-green to-mid-green rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-light-green/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-foreground font-display font-bold text-2xl tracking-tight">Community Insights</h4>
              <p className="text-foreground/40 font-medium mt-1">Grow alongside your peers</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Zap className="w-24 h-24 -rotate-12 translate-x-8 -translate-y-4" />
          </div>
        </Link>
      </div>
    </>
  );

  const renderInstructorDashboard = (data: InstructorDashboard) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-primary-teal/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-primary-teal" />
            </div>
            <span className="text-3xl font-display font-bold text-foreground">{data.stats.activeCourses}</span>
          </div>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Active Portfolio</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-light-green/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-light-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-light-green" />
            </div>
            <span className="text-3xl font-display font-bold text-foreground">{data.stats.totalEnrollments}</span>
          </div>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Total Reach</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-primary-teal/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-primary-teal" />
            </div>
            <span className="text-3xl font-display font-bold text-foreground">{data.stats.uniqueStudents}</span>
          </div>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Learners</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border hover:border-light-green/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-light-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-light-green" />
            </div>
          </div>
          <p className="text-foreground font-bold truncate tracking-tight mb-1">{data.stats.mostPopularCourse}</p>
          <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">Top Performing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/instructor" className="bg-surface rounded-[32px] p-8 border border-border hover:border-primary-teal/30 hover:shadow-xl hover:shadow-primary-teal/5 transition-all group overflow-hidden relative">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-teal to-deep-teal rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary-teal/20">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-foreground font-display font-bold text-2xl tracking-tight">Curriculum Suite</h4>
              <p className="text-foreground/40 font-medium mt-1">Design and publish your next course</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <BarChart3 className="w-24 h-24 -rotate-12 translate-x-8 -translate-y-4" />
          </div>
        </Link>
        <Link to="/discussions" className="bg-surface rounded-[32px] p-8 border border-border hover:border-light-green/30 hover:shadow-xl hover:shadow-light-green/5 transition-all group overflow-hidden relative">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-light-green to-mid-green rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-light-green/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-foreground font-display font-bold text-2xl tracking-tight">Active Inquiries</h4>
              <p className="text-foreground/40 font-medium mt-1">Mentor and guide your learners</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Zap className="w-24 h-24 -rotate-12 translate-x-8 -translate-y-4" />
          </div>
        </Link>
      </div>
    </>
  );

  const renderAdminDashboard = (data: AdminDashboard) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
      {[
        { label: 'Network Users', value: data.overview.totalUsers, icon: Users, color: 'primary-teal' },
        { label: 'Active Students', value: data.overview.studentsCount, icon: GraduationCap, color: 'light-green' },
        { label: 'Verified Mentors', value: data.overview.instructorsCount, icon: Star, color: 'primary-teal' },
        { label: 'Catalog Size', value: data.overview.totalCourses, icon: BookOpen, color: 'light-green' },
        { label: 'Registrations', value: data.overview.totalEnrollments, icon: TrendingUp, color: 'primary-teal' },
      ].map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`bg-surface rounded-2xl p-6 border border-border hover:border-primary-teal/30 transition-all group`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-primary-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-primary-teal`} />
              </div>
              <span className="text-3xl font-display font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-foreground/40 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <AppLayout>
      {/* Welcome Header */}
      <div className="mb-10 lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Welcome, {user?.firstName}
          </h1>
          <p className="text-foreground/40 font-medium text-lg leading-relaxed">
            {user?.role === 'STUDENT'
              ? 'Ready to continue your learning growth?'
              : user?.role === 'INSTRUCTOR'
              ? 'Your courses are thriving today.'
              : 'The platform is performing optimally.'}
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loadingDash ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-10 h-10 text-primary-teal animate-spin" />
        </div>
      ) : dashData ? (
        <>
          {dashData.role === 'STUDENT' && renderStudentDashboard(dashData as StudentDashboard)}
          {dashData.role === 'INSTRUCTOR' && renderInstructorDashboard(dashData as InstructorDashboard)}
          {dashData.role === 'ADMIN' && renderAdminDashboard(dashData as AdminDashboard)}
        </>
      ) : null}
    </AppLayout>
  );
};

export default DashboardPage;
