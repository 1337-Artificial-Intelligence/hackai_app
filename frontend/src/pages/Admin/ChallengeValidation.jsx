import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Search, GitPullRequestArrow, AlertTriangle, X, Filter, ChevronDown, ArrowRightCircle } from 'lucide-react';

export default function ChallengeValidation() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState('');
  const [filters, setFilters] = useState({
    team: '',
    challenge: '',
    status: ''
  });
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [uniqueChallenges, setUniqueChallenges] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);
  
  // Extract unique teams and challenges for filters
  useEffect(() => {
    if (submissions.length > 0) {
      // Extract unique team names
      const teams = [...new Set(submissions
        .filter(sub => sub.team?.teamName)
        .map(sub => sub.team.teamName))];
      setUniqueTeams(teams);
      
      // Extract unique challenge titles
      const challenges = [...new Set(submissions
        .filter(sub => sub.challenge?.title)
        .map(sub => sub.challenge.title))];
      setUniqueChallenges(challenges);
    }
  }, [submissions]);

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

  const handleValidation = async (submissionId, newStatus, feedback = '', score = null) => {
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
          feedback,
          score: score !== null ? Number(score) : undefined
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
      rejected: 'bg-red-500/20 text-red-400',
      bypassed: 'bg-blue-500/20 text-blue-400'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm flex items-center ${styles[status]}`}>
        {status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
        {status === 'approved' && <CheckCircle2 className="w-4 h-4 mr-2" />}
        {status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
        {status === 'bypassed' && <ArrowRightCircle className="w-4 h-4 mr-2" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredSubmissions = submissions.filter(sub => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      sub.team?.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.challenge?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Team filter
    const matchesTeam = filters.team === '' || 
      sub.team?.teamName === filters.team;
      
    // Challenge filter
    const matchesChallenge = filters.challenge === '' || 
      sub.challenge?.title === filters.challenge;
      
    // Status filter
    const matchesStatus = filters.status === '' || 
      sub.status === filters.status;
      
    return matchesSearch && matchesTeam && matchesChallenge && matchesStatus;
  });

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
  const renderConfirmation = () => {
    // Get icon and text based on action type
    const getActionContent = () => {
      switch (confirmAction?.type) {
        case 'approve':
          return {
            title: 'Approve Submission?',
            buttonText: 'Confirm Approval',
            buttonClass: 'bg-gradient-to-r from-green-500 to-emerald-500',
            icon: <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          };
        case 'reject':
          return {
            title: 'Reject Submission?',
            buttonText: 'Confirm Rejection',
            buttonClass: 'bg-gradient-to-r from-red-500 to-rose-500',
            icon: <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          };
        case 'bypass':
          return {
            title: 'Bypass Challenge?',
            buttonText: 'Confirm Bypass',
            buttonClass: 'bg-gradient-to-r from-blue-500 to-purple-500',
            icon: <ArrowRightCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          };
        default:
          return {
            title: 'Confirm Action',
            buttonText: 'Confirm',
            buttonClass: 'bg-gradient-to-r from-purple-500 to-blue-500',
            icon: <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          };
      }
    };
    
    const actionContent = getActionContent();
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md shadow-2xl">
          <div className="text-center">
            {actionContent.icon}
            <h3 className="text-xl font-bold text-white mb-2">
              {actionContent.title}
            </h3>
            {confirmAction?.type === 'bypass' && (
              <p className="text-gray-300 mb-4">
                The team will be allowed to progress but will receive 0 points for this challenge.
              </p>
            )}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Feedback {confirmAction?.type === 'bypass' ? '(recommended)' : '(optional)'}</label>
              <textarea
                id="feedback"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="3"
                placeholder={confirmAction?.type === 'bypass' ? 'Explain to the team why their submission is being bypassed...' : 'Enter feedback for the team...'}
              ></textarea>
            </div>
            
            {/* Show score input for AI Challenges when approving */}
            {confirmAction?.type === 'approve' && confirmAction?.isAIChallenge && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">AI Score <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="score"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter AI score (required)"
                  min="0"
                  required={selectedSubmission?.challenge?.isAIChallenge}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the score for this AI submission. Higher scores will receive more points.
                </p>
              </div>
            )}
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
                  const status = {
                    'approve': 'approved',
                    'reject': 'rejected',
                    'bypass': 'bypassed'
                  }[confirmAction.type];
                  
                  // Check if score is required but not provided
                  const isAIChallenge = confirmAction.isAIChallenge;
                  if (isAIChallenge && confirmAction.type === 'approve' && (!score || score === '')) {
                    alert('Please enter a score for this AI Challenge submission.');
                    return;
                  }
                  
                  handleValidation(
                    confirmAction.id,
                    status,
                    feedback,
                    isAIChallenge && confirmAction.type === 'approve' ? score : null
                  );
                  
                  // Reset score after submission
                  setScore('');
                }}
                className={`px-6 py-2 rounded-lg text-white ${actionContent.buttonClass} hover:opacity-90 transition-opacity`}
              >
                {actionContent.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
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
          
          {/* Filters */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-purple-400 w-5 h-5" />
              <h3 className="text-white font-medium">Filter Submissions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Team Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Team</label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none"
                    value={filters.team}
                    onChange={(e) => setFilters({...filters, team: e.target.value})}
                  >
                    <option value="">All Teams</option>
                    {uniqueTeams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              {/* Challenge Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Challenge</label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none"
                    value={filters.challenge}
                    onChange={(e) => setFilters({...filters, challenge: e.target.value})}
                  >
                    <option value="">All Challenges</option>
                    {uniqueChallenges.map(challenge => (
                      <option key={challenge} value={challenge}>{challenge}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Status</label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="bypassed">Bypassed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Clear filters button */}
            {(filters.team || filters.challenge || filters.status) && (
              <button
                onClick={() => setFilters({team: '', challenge: '', status: ''})}
                className="mt-4 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Team</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Challenge</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.filter(submission => submission.team?.teamName != "organizers").map((submission) => (
                <tr key={submission._id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6 text-white">{submission.team?.teamName || 'Unknown Team'}</td>
                  <td className="py-4 px-6 text-gray-300">{submission.challenge?.title || 'Unknown Challenge'}</td>
                  <td className="py-4 px-6 text-gray-400">
                    {new Date(submission.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
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
                <h3 className="text-xl font-bold text-white mb-4">
                  Submission Review - {selectedSubmission.challenge?.title}
                  {selectedSubmission.challenge?.isAIChallenge && (
                    <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                      AI Challenge
                    </span>
                  )}
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
                  <div className="border-t border-gray-700 mt-6 pt-6">
                    <h3 className="text-white font-medium mb-4">Review Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => setConfirmAction({
                          type: 'reject',
                          id: selectedSubmission._id
                        })}
                        className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => setConfirmAction({
                          type: 'bypass',
                          id: selectedSubmission._id
                        })}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                      >
                        <ArrowRightCircle className="w-5 h-5 mr-2" />
                        Bypass (0 Points)
                      </button>
                      <button
                        onClick={() => setConfirmAction({
                          type: 'approve',
                          id: selectedSubmission._id,
                          isAIChallenge: selectedSubmission.challenge?.isAIChallenge
                        })}
                        className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Approve
                      </button>
                    </div>
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
