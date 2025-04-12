import React, { useState, useEffect } from 'react';

export default function Team() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [teamRes, submissionsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/teams/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/submissions/team`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!teamRes.ok || !submissionsRes.ok) {
        throw new Error('Failed to fetch team data');
      }

      const teamData = await teamRes.json();
      const submissionsData = await submissionsRes.json();

      // Calculate stats
      const approvedSubmissions = submissionsData.data.filter(sub => sub.status === 'approved');
      
      setTeam({
        ...teamData.data,
        stats: {
          totalPoints: teamData.data.points || 0, // Use points from team data
          completedChallenges: approvedSubmissions.length,
          rank: teamData.data.rank || 0
        }
      });
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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

  if (!team) {
    return (
      <div className="text-gray-400 text-center py-4">
        No team data found
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Team Members
          </h2>
          <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-purple-400">
            {team.members?.length || 0} Members
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.members?.map((member, index) => (
            <div 
              key={index} 
              className="group flex items-center p-4 bg-gray-800 rounded-xl transition-all duration-300 hover:bg-gray-700 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                {typeof member === 'string' ? member.charAt(0).toUpperCase() : 'T'}
              </div>
              <div>
                <h3 className="text-white text-base font-semibold">
                  {typeof member === 'string' ? member : 'Team Member'}
                </h3>
                <p className="text-transparent bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-xs">
                  Member
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-700 my-8"></div>

      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
          Team Performance
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative bg-gray-800 p-6 rounded-xl group transition-all duration-300 hover:bg-gray-750">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Total Points</p>
              </div>
              <p className="text-white text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {team.stats.totalPoints}
              </p>
            </div>
          </div>

          <div className="relative bg-gray-800 p-6 rounded-xl group transition-all duration-300 hover:bg-gray-750">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Challenges Completed</p>
              </div>
              <p className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {team.stats.completedChallenges}
              </p>
            </div>
          </div>

          <div className="relative bg-gray-800 p-6 rounded-xl group transition-all duration-300 hover:bg-gray-750">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Current Rank</p>
              </div>
              <p className="text-white text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                #{team.stats.rank}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
