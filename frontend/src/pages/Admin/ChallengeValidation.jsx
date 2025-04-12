import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Search, GitPullRequestArrow, AlertTriangle, X } from 'lucide-react';

export default function ChallengeValidation() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const { data } = await response.json();
      setSubmissions(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleValidation = async (submissionId, newStatus, feedback = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/${submissionId}/validate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          feedback
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update submission status');
      }

      await fetchSubmissions();
      setConfirmAction(null);
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error validating submission:', err);
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm flex items-center ${styles[status]}`}>
        {status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
        {status === 'approved' && <CheckCircle2 className="w-4 h-4 mr-2" />}
        {status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.team?.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.challenge?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
        <div className="text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  // Confirmation Dialog
  const renderConfirmation = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md shadow-2xl">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {confirmAction?.type === 'approve' 
              ? 'Approve Submission?' 
              : 'Reject Submission?'}
          </h3>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Feedback (optional)</label>
            <textarea
              id="feedback"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="3"
              placeholder="Enter feedback for the team..."
            ></textarea>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setConfirmAction(null)}
              className="px-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const feedback = document.getElementById('feedback').value;
                handleValidation(
                  confirmAction.id,
                  confirmAction.type === 'approve' ? 'approved' : 'rejected',
                  feedback
                );
              }}
              className={`px-6 py-2 rounded-lg text-white ${
                confirmAction?.type === 'approve'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              } hover:opacity-90 transition-opacity`}
            >
              {confirmAction?.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 md:mb-0">
            Challenge Submissions
          </h1>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search submissions..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Submissions Table */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Team</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Challenge</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission._id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6 text-white">{submission.team?.teamName || 'Unknown Team'}</td>
                  <td className="py-4 px-6 text-gray-300">{submission.challenge?.title || 'Unknown Challenge'}</td>
                  <td className="py-4 px-6">{getStatusBadge(submission.status)}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <GitPullRequestArrow className="w-5 h-5 mr-2" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSubmissions.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              No submissions to review
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Submission Review - {selectedSubmission.challenge?.title}
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Team Name</label>
                    <div className="bg-gray-800 rounded-lg px-4 py-3 text-white">
                      {selectedSubmission.team?.teamName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Submission Date</label>
                    <div className="bg-gray-800 rounded-lg px-4 py-3 text-white">
                      {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">GitHub Repository</label>
                  <a
                    href={selectedSubmission.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-words"
                  >
                    {selectedSubmission.githubLink}
                  </a>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Description</label>
                  <div className="bg-gray-800 rounded-lg px-4 py-3 text-gray-300 whitespace-pre-wrap">
                    {selectedSubmission.description}
                  </div>
                </div>

                {selectedSubmission.feedback && (
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Feedback</label>
                    <div className="bg-gray-800 rounded-lg px-4 py-3 text-gray-300 whitespace-pre-wrap">
                      {selectedSubmission.feedback}
                    </div>
                  </div>
                )}

                {selectedSubmission.status === 'pending' && (
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setConfirmAction({
                        type: 'reject',
                        id: selectedSubmission._id
                      })}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject Submission
                    </button>
                    <button
                      onClick={() => setConfirmAction({
                        type: 'approve',
                        id: selectedSubmission._id
                      })}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Approve Submission
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmAction && renderConfirmation()}
      </div>
    </div>
  );
}
