import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, FileText } from 'lucide-react';
import { assignmentsService, type Submission } from '../services/assignmentsService';
import AppLayout from '../components/layout/AppLayout';

export const StudentSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const data = await assignmentsService.getMyAllSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      setError('Failed to load your submissions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-teal" /> My Submissions
          </h1>
          <p className="text-slate-400 mt-1">View your assignment submissions, grades, and feedback</p>
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
          <p className="text-slate-400 mb-4">You haven't submitted any assignments yet.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border shadow-xl overflow-hidden p-6">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted text-muted-foreground uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-5 py-4 min-w-[200px]">Course</th>
                  <th className="px-5 py-4 min-w-[200px]">Assignment</th>
                  <th className="px-5 py-4 min-w-[120px]">Date Submitted</th>
                  <th className="px-5 py-4 min-w-[100px]">Status</th>
                  <th className="px-5 py-4 min-w-[100px]">Grade</th>
                  <th className="px-5 py-4 min-w-[250px]">Feedback</th>
                  <th className="px-5 py-4 text-right min-w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/50 transition-colors">
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
                    <td className="px-5 py-4 text-muted-foreground text-xs leading-relaxed max-w-[250px] truncate" title={sub.feedback || undefined}>
                      {sub.feedback || <span className="italic opacity-50">No feedback yet</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={sub.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground rounded-lg transition-all tracking-wide uppercase font-bold text-[10px]"
                        >
                          View Work
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default StudentSubmissionsPage;
