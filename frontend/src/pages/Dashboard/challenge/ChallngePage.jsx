import { Download, Github, Link2, FileText, AlertTriangle, ArrowRightCircle } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ChallengePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null, success: false });
  const [cancelingSubmission, setCancelingSubmission] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const cancelSubmission = async () => {
    try {
      setCancelingSubmission(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/${challenge.submission._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel submission');
      }
      
      // Refetch challenge data to update UI
      await fetchChallenge();
      
      // Reset form state
      setGithubLink("");
      setSubmitStatus({ loading: false, error: null, success: false });
    } catch (err) {
      console.error('Error canceling submission:', err);
      setSubmitStatus({ loading: false, error: err.message, success: false });
    } finally {
      setCancelingSubmission(false);
    }
  };

  const fetchChallenge = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch both challenge and submission details
      const [challengeRes, submissionRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/challenges/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/submissions/team`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (!challengeRes.ok) {
        throw new Error('Failed to fetch challenge');
      }

      const challengeData = await challengeRes.json();
      const submissionData = await submissionRes.json();

      // Find submission for this challenge
      const submission = submissionData.data?.find(sub => sub.challenge._id === id);
      
      // If there's a submission, pre-populate the githubLink field
      if (submission) {
        setGithubLink(submission.githubLink || "");
      }
      
      // Combine challenge with submission data
      const challengeWithSubmission = {
        ...challengeData.data,
        submission: submission || null
      };

      console.log('Challenge with submission:', challengeWithSubmission);
      setChallenge(challengeWithSubmission);
    } catch (err) {
      console.error('Error fetching challenge:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!githubLink) {
      setSubmitStatus({ loading: false, error: "Please provide a GitHub repository URL", success: false });
      return;
    }

    try {
      setSubmitStatus({ loading: true, error: null, success: false });
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          challengeId: id,
          githubLink,
          description: `Submission for ${challenge.title}`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit challenge');
      }

      // Refetch challenge to update with new submission
      await fetchChallenge();
      
      setSubmitStatus({ loading: false, error: null, success: true });
    } catch (err) {
      console.error('Error submitting challenge:', err);
      setSubmitStatus({ loading: false, error: err.message, success: false });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-gray-400 text-center py-4">
        Challenge not found
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Link to="/dashboard/main" className="flex justify-start items-center text-white my-2 underline font-bold">
        <ArrowLeftIcon size={18} className="text-white text-md"/> Go Back
      </Link>

      <div className="min-h-screen bg-gray-900 rounded-lg p-6 md:p-8 lg:p-12 pb-10 max-w-7xl">
        {/* Challenge Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
              {challenge.title}
            </h1>
            {challenge.submission && (
              <div className="flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  challenge.submission.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                  challenge.submission.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                  challenge.submission.status === 'bypassed' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {challenge.submission.status.charAt(0).toUpperCase() + challenge.submission.status.slice(1)}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-lg leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Submission Section */}
        <div className="mb-10">
          {challenge.submission?.status === 'approved' ? (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-green-700/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Approved Solution
              </h3>
              <a
                href={`${challenge.submission.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Github className="w-5 h-5 mr-2" />
                View Solution on GitHub
              </a>
            </div>
          ) : challenge.submission?.status === 'pending' ? (
            <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-yellow-700/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Pending Submission
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-400 mb-2">Your submitted solution is pending review:</p>
                <a 
                  href={`${challenge.submission.githubLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all flex items-center"
                >
                  <Github className="w-4 h-4 mr-2 inline" />
                  {challenge.submission.githubLink}
                </a>
              </div>
              
              <div className="border-t border-gray-700 my-4 pt-4">
                <p className="text-gray-400 mb-4">If you want to change your submission, you can cancel it and try again:</p>
                <button
                  onClick={cancelSubmission}
                  disabled={cancelingSubmission}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors flex items-center"
                >
                  {cancelingSubmission ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 mr-2" />
                      Canceling...
                    </>
                  ) : (
                    <>Cancel Submission & Try Again</>
                  )}
                </button>
              </div>
            </div>
          ) : challenge.submission?.status === 'bypassed' ? (
            <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-blue-700/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Challenge Bypassed
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-400 mb-2">Your solution has been bypassed (0 points):</p>
                <a 
                  href={`${challenge.submission.githubLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all flex items-center"
                >
                  <Github className="w-4 h-4 mr-2 inline" />
                  {challenge.submission.githubLink}
                </a>
                
                {challenge.submission.feedback && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <ArrowRightCircle className="w-4 h-4 mr-2 text-blue-400" />
                      Reviewer Feedback
                    </h4>
                    <p className="text-gray-300 text-sm italic">"{challenge.submission.feedback}"</p>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-gray-300 text-sm">
                    <span className="text-yellow-400 font-medium">Note:</span> You can proceed to the next challenges, but this submission received 0 points.
                  </p>
                </div>
              </div>
            </div>
          ) : challenge.submission?.status === 'rejected' ? (
            <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-red-700/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Submission Rejected
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-400 mb-2">Your previous submission was rejected:</p>
                <a 
                  href={`${challenge.submission.githubLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all flex items-center"
                >
                  <Github className="w-4 h-4 mr-2 inline" />
                  {challenge.submission.githubLink}
                </a>
                
                {challenge.submission.feedback && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                      Reviewer Feedback
                    </h4>
                    <p className="text-gray-300 text-sm italic">"{challenge.submission.feedback}"</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-700 my-4 pt-4">
                <h4 className="text-white font-medium mb-2">New Submission</h4>
                <div className="flex flex-col md:flex-row gap-4 mb-2">
                  <input
                    type="text"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="Submission URL"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={submitStatus.loading}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
                  >
                    {submitStatus.loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>Submit New Solution</>
                    )}
                  </button>
                </div>
                {submitStatus.error && (
                  <p className="text-red-500 text-sm mt-2">{submitStatus.error}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-white mb-4">Submit Your Solution</h3>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="Submission URL"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitStatus.loading}
                  className="w-full flex text-nowrap md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity items-center justify-center disabled:opacity-50"
                >
                  {submitStatus.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Challenge
                      <Github className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
              {submitStatus.error && (
                <p className="text-red-500 text-sm mt-2">{submitStatus.error}</p>
              )}
              {submitStatus.success && (
                <p className="text-green-500 text-sm mt-2">Challenge submitted successfully!</p>
              )}
            </>
          )}
        </div>

        {/* Resources Section */}
        <div className="border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Learning Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenge.resources?.map((resource, index) => (
              <a
                key={index}
                href={resource}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all"
              >
                <div className="mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg w-fit">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-white font-medium mb-2">Resource {index + 1}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {resource}
                </p>
                <div className="mt-3 flex items-center text-purple-400 text-sm">
                  <span>View Resource</span>
                  <Link2 className="w-4 h-4 ml-2" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}