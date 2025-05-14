import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Clock, CheckCircle2, XCircle, ArrowRightCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function TeamProgress() {
  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeam, setExpandedTeam] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all teams
      const teamsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!teamsResponse.ok) {
        throw new Error('Failed to fetch teams');
      }
      
      const teamsData = await teamsResponse.json();
      
      // Fetch all challenges
      const challengesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/challenges`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!challengesResponse.ok) {
        throw new Error('Failed to fetch challenges');
      }
      
      const challengesData = await challengesResponse.json();
      
      // Fetch all submissions
      const submissionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!submissionsResponse.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const submissionsData = await submissionsResponse.json();
      
      // Organize challenges by level
      const organizedChallenges = organizeChallengesByLevel(challengesData.data);
      setChallenges(organizedChallenges);
      
      // Map submissions to teams
      const teamsWithProgress = mapTeamProgress(teamsData.data, submissionsData.data, organizedChallenges);
      setTeams(teamsWithProgress);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  // Organize challenges by level
  const organizeChallengesByLevel = (challengesArray) => {
    const levels = {};
    
    challengesArray.forEach(challenge => {
      const level = challenge.level || 1;
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(challenge);
    });
    
    // Sort challenges within each level by order
    Object.keys(levels).forEach(level => {
      levels[level].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    
    return levels;
  };
  
  // Map team progress through challenges
  const mapTeamProgress = (teamsArray, submissionsArray, organizedChallenges) => {
    return teamsArray.map(team => {
      // Get all submissions for this team
      const teamSubmissions = submissionsArray.filter(sub => sub.team._id === team._id);
      
      // Create a map of challenge IDs to submission status
      // Make sure to keep only the latest submission for each challenge
      const submissionStatus = {};
      teamSubmissions.forEach(sub => {
        const existingSubmission = submissionStatus[sub.challenge._id];
        // Only store this submission if it's newer than the existing one or there isn't one yet
        if (!existingSubmission || new Date(sub.updatedAt) > new Date(existingSubmission.updatedAt)) {
          submissionStatus[sub.challenge._id] = {
            status: sub.status,
            updatedAt: sub.updatedAt,
            createdAt: sub.createdAt,
            githubLink: sub.githubLink,
            feedback: sub.feedback
          };
        }
      });
      
      // Calculate progress stats
      let totalChallenges = 0;
      let completedChallenges = 0;
      let currentLevel = 1;
      let stuckChallenge = null;
      
      // Calculate highest level with progress
      Object.keys(organizedChallenges).forEach(level => {
        const levelChallenges = organizedChallenges[level];
        totalChallenges += levelChallenges.length;
        
        const levelCompleted = levelChallenges.every(challenge => 
          submissionStatus[challenge._id]?.status === 'approved' || 
          submissionStatus[challenge._id]?.status === 'bypassed'
        );
        
        const hasProgress = levelChallenges.some(challenge => 
          submissionStatus[challenge._id]
        );
        
        if (hasProgress && parseInt(level) >= currentLevel) {
          currentLevel = parseInt(level);
        }
        
        // Count completed challenges
        levelChallenges.forEach(challenge => {
          if (submissionStatus[challenge._id]?.status === 'approved' || 
              submissionStatus[challenge._id]?.status === 'bypassed') {
            completedChallenges++;
          }
          
          // Check for stuck challenges (rejected or pending for more than 24 hours)
          if (submissionStatus[challenge._id]?.status === 'rejected' ||
              (submissionStatus[challenge._id]?.status === 'pending' && 
               new Date() - new Date(submissionStatus[challenge._id]?.createdAt) > 24 * 60 * 60 * 1000)) {
            if (!stuckChallenge) {
              stuckChallenge = {
                ...challenge,
                submission: submissionStatus[challenge._id]
              };
            }
          }
        });
      });
      
      return {
        ...team,
        progress: {
          currentLevel,
          completedChallenges,
          totalChallenges,
          progressPercentage: Math.round((completedChallenges / totalChallenges) * 100),
          stuckChallenge,
          submissions: submissionStatus
        }
      };
    });
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'bypassed':
        return <ArrowRightCircle className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };
  
  const formatDateAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ${diffMinutes}m ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    }
    return `${diffMinutes}m ago`;
  };
  
  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="ml-2 text-white">Loading team progress...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 rounded-lg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 md:mb-0">
            Team Progress Tracker
          </h1>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        {/* Teams Progress Overview */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
              <p className="text-gray-400">No teams found matching your search</p>
            </div>
          ) : (
            filteredTeams.map(team => (
              <div 
                key={team._id} 
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
              >
                {/* Team Header */}
                <div 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 cursor-pointer"
                  onClick={() => setExpandedTeam(expandedTeam === team._id ? null : team._id)}
                >
                  <div className="flex items-center">
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 mr-2 transition-transform ${expandedTeam === team._id ? 'rotate-180' : ''}`} 
                    />
                    <div>
                      <h3 className="text-white font-semibold text-lg">{team.teamName}</h3>
                      <p className="text-gray-400 text-sm">
                        Current Level: <span className="text-purple-400 font-medium">{team.progress.currentLevel}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-3 md:mt-0 w-full md:w-auto">
                    {/* Progress Bar */}
                    <div className="w-full md:w-48 h-7 bg-gray-700 rounded-full overflow-hidden flex items-center">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium text-white"
                        style={{ width: `${team.progress.progressPercentage}%` }}
                      >
                        {team.progress.progressPercentage}%
                      </div>
                    </div>
                    
                    {/* Completion Stats */}
                    <div className="text-right text-sm text-gray-400">
                      <span className="text-white font-medium">{team.progress.completedChallenges}</span>
                      <span> / </span>
                      <span>{team.progress.totalChallenges}</span>
                      <span> challenges</span>
                    </div>
                    
                    {/* Stuck Indicator */}
                    {team.progress.stuckChallenge && (
                      <div className="bg-yellow-500/20 text-yellow-400 rounded-full px-3 py-1 text-xs font-medium flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stuck
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expanded Team Details */}
                {expandedTeam === team._id && (
                  <div className="border-t border-gray-700 p-4">
                    {/* Stuck Challenge Alert */}
                    {team.progress.stuckChallenge && (
                      <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <h4 className="text-white font-medium mb-1 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                          Potentially Stuck on Challenge
                        </h4>
                        <div className="flex flex-col md:flex-row justify-between">
                          <p className="text-gray-300 text-sm">
                            <span className="text-yellow-400 font-medium">{team.progress.stuckChallenge.title}</span> ({team.progress.stuckChallenge.submission.status === 'rejected' ? 'Rejected' : 'Pending for 24+ hours'})
                          </p>
                          <a 
                            href={team.progress.stuckChallenge.submission.githubLink} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-sm hover:underline mt-1 md:mt-0"
                          >
                            View Submission
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Levels and Challenges Progress */}
                    <div className="space-y-4">
                      {Object.keys(challenges).sort((a, b) => parseInt(a) - parseInt(b)).map(level => (
                        <div key={level} className="border border-gray-700 rounded-lg overflow-hidden">
                          <div className="bg-gray-800 p-3 border-b border-gray-700">
                            <h4 className="text-white font-medium">
                              Level {level} {parseInt(level) === team.progress.currentLevel && 
                                <span className="ml-2 bg-purple-500/20 text-purple-400 rounded-full px-2 py-0.5 text-xs">Current</span>
                              }
                            </h4>
                          </div>
                          
                          <div className="divide-y divide-gray-700">
                            {challenges[level].map(challenge => {
                              const submission = team.progress.submissions[challenge._id];
                              return (
                                <div key={challenge._id} className="p-3 flex justify-between items-center">
                                  <div className="flex items-center">
                                    {submission ? (
                                      getStatusIcon(submission.status)
                                    ) : (
                                      <div className="w-4 h-4 rounded-full border border-gray-600 mr-2" />
                                    )}
                                    <span className="ml-2 text-gray-300">{challenge.title}</span>
                                  </div>
                                  
                                  {submission && (
                                    <div className="text-right">
                                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        submission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                        submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        submission.status === 'bypassed' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                      }`}>
                                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {formatDateAgo(submission.updatedAt || submission.createdAt)}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {new Date(submission.updatedAt || submission.createdAt).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
