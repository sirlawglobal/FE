import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, Award, X, ClipboardList } from 'lucide-react';
import { assignmentsService, type Submission } from '../services/assignmentsService';
import AppLayout from '../components/layout/AppLayout';

export const InstructorSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: 0, feedback: '' });
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const data = await assignmentsService.getAllInstructorSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    try {
      setIsGrading(true);
      const updated = await assignmentsService.gradeSubmission(gradingSubmission.id, gradeForm);
      setSubmissions((prev: Submission[]) =>
        prev.map((s: Submission) =>
          s.id === updated.id ? { ...s, ...updated } : s
        )
      );
      setGradingSubmission(null);
      setGradeForm({ grade: 0, feedback: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to grade submission');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary-teal" /> All Submissions
          </h1>
          <p className="text-slate-400 mt-1">Review and grade all recent student submissions across your courses</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader className="w-8 h-8 text-primary-teal animate-spin" /></div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No submissions found yet.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border shadow-xl overflow-hidden p-6">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted text-muted-foreground uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Assignment</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Grade</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-4 text-foreground font-medium">
                      {sub.user?.firstName} {sub.user?.lastName}
                    </td>
                    <td className="px-5 py-4 text-foreground">
                      {sub.assignment?.course?.title || <span className="text-muted-foreground italic">N/A</span>}
                    </td>
                    <td className="px-5 py-4 text-primary font-medium">
                      {sub.assignment?.title || 'Unknown Assignment'}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 outline outline-1 outline-offset-2 rounded-full text-[10px] font-bold ${
                        sub.status === 'GRADED' ? 'bg-emerald-500/10 text-emerald-500 outline-emerald-500/20' : 'bg-primary/10 text-primary outline-primary/20'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-foreground font-semibold">
                      {sub.grade ?? '-'} / {sub.assignment?.points || 0}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={sub.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground rounded-lg transition-all tracking-wide uppercase font-bold text-[10px]"
                        >
                          View
                        </a>
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeForm({ grade: sub.grade || 0, feedback: sub.feedback || '' });
                          }}
                          className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all shadow-sm"
                          title="Grade Submission"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {gradingSubmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-surface rounded-2xl border border-primary/30 p-6 shadow-2xl scale-in-center">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Grade Submission
              </h2>
              <button onClick={() => setGradingSubmission(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Student</div>
              <div className="text-foreground font-bold">{gradingSubmission.user?.firstName} {gradingSubmission.user?.lastName}</div>
              
              <div className="mt-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Course</div>
              <div className="text-foreground text-sm">{gradingSubmission.assignment?.course?.title}</div>

              <div className="mt-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Assignment</div>
              <div className="text-primary font-semibold text-sm">{gradingSubmission.assignment?.title}</div>
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">
                  Grade (Max {gradingSubmission.assignment?.points || 0})
                </label>
                <input
                  type="number"
                  max={gradingSubmission.assignment?.points || 0}
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, grade: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Feedback</label>
                <textarea
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2 mt-6">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="flex-1 py-3 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrading}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                >
                  {isGrading ? <Loader className="w-4 h-4 animate-spin"/> : <Award className="w-4 h-4" />} Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default InstructorSubmissionsPage;
