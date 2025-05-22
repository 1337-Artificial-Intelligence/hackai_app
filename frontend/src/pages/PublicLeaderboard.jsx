import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Trophy, Star } from 'lucide-react';

const PublicLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    // Create socket connection
    const socket = io('http://localhost:5001');
    
    // Join leaderboard room
    socket.emit('join-leaderboard');
    
    // Fetch leaderboard data initially
    fetchLeaderboard();
    
    // Listen for updates
    socket.on('leaderboard-update', () => {
      console.log('Received leaderboard update event');
      fetchLeaderboard();
      setLastUpdated(new Date());
    });
    
    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5001/api/public/leaderboard');
      setLeaderboard(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-white justify-center items-center">
        <div className="text-2xl">Loading leaderboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen bg-gray-900 text-white justify-center items-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  // Format time for display
  const formattedTime = lastUpdated.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center">
            <Trophy className="text-yellow-500 mr-3 h-10 w-10" />
            Leaderboard
          </h1>
          {/* <div className="text-gray-400">
            Last updated: {formattedTime}
          </div> */}
        </div>
        
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
          <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-gray-700">
            <div className="grid grid-cols-12 text-gray-300 text-lg font-medium">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">Team</div>
              <div className="col-span-3 text-center">Points</div>
              <div className="col-span-4 text-center">Progress</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-700">
            {leaderboard.map((team) => (
              <div 
                key={team.rank} 
                className={`grid grid-cols-12 p-4 items-center ${
                  team.rank <= 3 ? 'bg-gray-800/80' : ''
                }`}
              >
                <div className="col-span-1 text-center">
                  {team.rank === 1 ? (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-gray-900 font-bold">
                      1
                    </div>
                  ) : team.rank === 2 ? (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-gray-900 font-bold">
                      2
                    </div>
                  ) : team.rank === 3 ? (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-gray-900 font-bold">
                      3
                    </div>
                  ) : (
                    <span className="text-gray-500 font-medium">{team.rank}</span>
                  )}
                </div>
                
                <div className="col-span-4 font-medium flex items-center">
                  {team.rank <= 3 && (
                    <Star className={`mr-2 h-5 w-5 ${
                      team.rank === 1 ? 'text-yellow-500' : 
                      team.rank === 2 ? 'text-gray-400' : 
                      'text-amber-700'
                    }`} />
                  )}
                  {team.teamName}
                </div>
                
                <div className="col-span-3 text-center font-mono text-xl">
                  <span className={`
                    ${team.rank === 1 ? 'text-yellow-500' : 
                      team.rank === 2 ? 'text-gray-400' : 
                      team.rank === 3 ? 'text-amber-700' : 'text-blue-400'}
                    font-bold
                  `}>
                    {team.points}
                  </span>
                </div>
                
                <div className="col-span-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-4 mr-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full"
                        style={{ width: `${team.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 w-12">{team.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
            
            {leaderboard.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No teams on the leaderboard yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLeaderboard;
