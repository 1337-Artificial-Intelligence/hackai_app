import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [groupedChallenges, setGroupedChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (challenges.length > 0) {
      groupChallengesByLevel();
    }
  }, [challenges]);

  const groupChallengesByLevel = () => {
    const groups = [];
    const remainingChallenges = new Set(challenges);
    
    // Helper function to check if all dependencies are in previous levels
    const areDependenciesInPreviousLevels = (challenge, previousLevels) => {
      if (!challenge.dependencies || challenge.dependencies.length === 0) return true;
      
      const allPreviousChallenges = previousLevels.flat();
      return challenge.dependencies.every(depId => 
        allPreviousChallenges.some(prevChallenge => prevChallenge._id === depId)
      );
    };

    // Keep going until we've placed all challenges
    while (remainingChallenges.size > 0) {
      const currentLevel = Array.from(remainingChallenges).filter(challenge => 
        areDependenciesInPreviousLevels(challenge, groups)
      );

      if (currentLevel.length === 0) {
        // If we can't place any more challenges, there might be a circular dependency
        console.warn('Possible circular dependency detected');
        break;
      }

      // Add current level to groups and remove these challenges from remaining
      groups.push(currentLevel);
      currentLevel.forEach(challenge => remainingChallenges.delete(challenge));
    }

    setGroupedChallenges(groups);
  };

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch both challenges and submissions
      const [challengesRes, submissionsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/challenges`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/submissions/team`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!challengesRes.ok) {
        throw new Error('Failed to fetch challenges');
      }
      if (!submissionsRes.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const challengesData = await challengesRes.json();
      const submissionsData = await submissionsRes.json();
      console.log('Submissions:', submissionsData);

      // Create a map of challenge IDs to their latest submission status
      const submissionMap = {};
      submissionsData.data?.forEach(sub => {
        if (sub.challenge) {
          const challengeId = sub.challenge._id;
          // Only update if there's no submission yet for this challenge
          // or if this submission is newer than the existing one
          if (!submissionMap[challengeId] || 
              new Date(sub.createdAt) > new Date(submissionMap[challengeId].createdAt)) {
            submissionMap[challengeId] = {
              status: sub.status || 'pending',
              githubLink: sub.githubLink,
              createdAt: sub.createdAt
            };
          }
        }
      });

      // Add submission status to challenges
      const challengesWithStatus = challengesData.data.map(challenge => ({
        ...challenge,
        submission: submissionMap[challenge._id] || { status: 'not_submitted', githubLink: null }
      }));

      console.log('Challenges with status:', challengesWithStatus);
      setChallenges(challengesWithStatus);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getChallengeTypeStyle = (tag) => {
    switch (tag?.toLowerCase()) {
      case "training":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "llm":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "data":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      default:
        return "bg-gray-700";
    }
  };

  const canAccessChallenge = (challenge) => {
    console.log('Checking access for challenge:', challenge);
    
    // If challenge has no dependencies, it's always accessible
    if (!challenge.dependencies || challenge.dependencies.length === 0) {
      console.log('No dependencies, access granted');
      return true;
    }

    // If challenge has dependencies, check if they're all completed
    const canAccess = challenge.dependencies.every(depId => {
      const dep = challenges.find(c => c._id === depId);
      // Allow access if the dependency is approved OR bypassed
      const hasAccess = dep && (dep.submission.status === 'approved' || dep.submission.status === 'bypassed');
      console.log(`Dependency ${depId}:`, { found: !!dep, status: dep?.submission?.status, hasAccess });
      return hasAccess;
    });

    console.log('Final access decision:', canAccess);
    return canAccess;
  };

  const handleStartChallenge = (challengeId) => {
    console.log("Starting challenge:", challengeId);
    navigate(`/dashboard/challenge/${challengeId}`);
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

  return (
    <div className="space-y-12">
      {groupedChallenges.map((levelChallenges, levelIndex) => (
        <div key={levelIndex} className="space-y-6">
          <div className="flex items-center gap-4">
            {/* <div className="h-px bg-gray-800 flex-grow"></div> */}
            {/* <h2 className="text-gray-400 font-medium">
              {levelIndex === 0 ? 'Getting Started' : `Level ${levelIndex + 1}`}
            </h2> */}
            <div className="h-px bg-gray-800 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levelChallenges.map((challenge) => (
              <div
                key={challenge._id}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-purple-500/30 transition-colors"
              >
                {/* Challenge Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-2 ${getChallengeTypeStyle(
                        challenge.tag
                      )}`}
                    >
                      {challenge.tag}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {challenge.description}
                    </p>
                  </div>
                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(challenge.submission.status)}`}>
                      {challenge.submission.status === 'not_submitted' ? 'Not Started' : 
                       challenge.submission.status.charAt(0).toUpperCase() + challenge.submission.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Dependencies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {challenge.dependencies?.map((depId) => {
                      const dep = challenges.find((c) => c._id === depId);
                      return (
                        <span
                          key={depId}
                          className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                            dep?.submission?.status === "approved"
                              ? "text-green-400 bg-green-400/10"
                              : "text-gray-400 bg-gray-700"
                          }`}
                        >
                          {dep?.title || "Unknown"}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  {!canAccessChallenge(challenge) ? (
                    <div className="flex items-center justify-center text-gray-500">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Complete prerequisites first
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartChallenge(challenge._id)}
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                    >
                      {challenge.submission?.status === 'approved' ? 'View Solution' : 'Start Challenge'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
