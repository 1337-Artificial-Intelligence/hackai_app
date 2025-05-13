import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch both leaderboard and current team data
      const [leaderboardRes, teamRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/teams/leaderboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/teams/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!leaderboardRes.ok || !teamRes.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const leaderboardData = await leaderboardRes.json();
      const teamData = await teamRes.json();

      // Filter out admin teams and sort by points
      const filteredTeams = leaderboardData.data
        .filter(team => team.role !== 'admin')
        .sort((a, b) => b.points - a.points);
        
      // Assign standard competition ranking (1224)
      let currentRank = 1;
      let currentPoints = filteredTeams.length > 0 ? filteredTeams[0].points : 0;
      let teamsAtCurrentRank = 0;
      
      filteredTeams.forEach((team, index) => {
        if (team.points < currentPoints) {
          // New lower score, so rank becomes index + 1
          currentRank = currentRank + teamsAtCurrentRank;
          currentPoints = team.points;
          teamsAtCurrentRank = 1;
        } else {
          // Same score as previous team(s)
          teamsAtCurrentRank++;
        }
        team.rank = currentRank;
      });

      setTeams(filteredTeams);
      setCurrentTeamId(teamData.data._id);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
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

  return (
    <Card className="w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Team Leaderboard
          </CardTitle>
          <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-purple-400">
            {teams.length} Teams
          </span>
        </div>
        <p className="text-gray-400 text-sm">See how your team ranks against others</p>
      </CardHeader>
      
      <div className="border-t border-gray-800 mx-6"></div>

      <CardContent className="pt-6">
        <ul className="space-y-4">
          {teams.map((team, index) => (
            <li
              key={team._id}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                team._id === currentTeamId
                  ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`relative h-8 w-8 flex items-center justify-center rounded-full ${
                  index < 3 
                    ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}>
                  <span className="font-bold text-sm">
                    {team.rank}
                  </span>
                  {index < 3 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{team.teamName}</h3>
                  <p className="text-sm text-gray-400">{team.members?.length || 0} Members</p>
                </div>
              </div>
              <div className="sm:ml-4 mt-2 sm:mt-0 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-white font-semibold">{team.points || 0}</span>
                </div>
                <span className="text-xs text-gray-400">points</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}