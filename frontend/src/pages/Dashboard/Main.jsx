import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChallengesList from "./ChallengesList";
import LeaderBoard from "./LeaderBoard";
import Graph from "../../components/graph";
import Team from "./Team";

LeaderBoard;
export default function Main() {
  const navigate = useNavigate();
  // Load the active tab from localStorage or default to "Challenges"
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("teamActiveTab");
    return savedTab || "Challenges";
  });
  
  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("teamActiveTab", activeTab);
  }, [activeTab]);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    fetchTeamData();
    // console.log(teamData?.teamName);
  }, []);

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Token will always exist due to ProtectedRoute, but adding a safety check
      if (!token) {
        navigate('/sign');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }

      const data = await response.json();
      setTeamData(data.data);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leaderboardData = [
    { teamName: "ByteBusters", points: 450, rank: 1 },
    { teamName: "Code Crusaders", points: 420, rank: 2 },
    { teamName: "Data Dragons", points: 385, rank: 3 },
    { teamName: "Algo Avengers", points: 350, rank: 4 },
    { teamName: "Your Team", points: 320, rank: 5 },
  ];

  const teamMembers = [
    { name: "Alex Johnson", role: "Frontend Developer", avatar: "A" },
    { name: "Sam Zhang", role: "Backend Developer", avatar: "S" },
    { name: "Taylor Morgan", role: "Database Specialist", avatar: "T" },
    { name: "Jordan Lee", role: "Security Expert", avatar: "J" },
  ];

  const challenges = [
    {
      type: 'llm',
      id: 1,
      title: "Web Security Fundamentals",
      description: "Learn and implement basic web security principles",
      points: 100,
      status: "Completed",
    },
    {
      type: 'llm',
      id: 2,
      title: "Database Optimization",
      description: "Optimize database queries and structure for performance",
      points: 150,
      status: "In Progress",
    },
    {
      type: 'llm',
      id: 2,
      title: "Database Optimization",
      description: "Optimize database queries and structure for performance",
      points: 150,
      status: "In Progress",
    }, {
      type: 'llm',
      id: 2,
      title: "Database Optimization",
      description: "Optimize database queries and structure for performance",
      points: 150,
      status: "In Progress",
    }, {
      type: 'llm',
      id: 2,
      title: "Database Optimization",
      description: "Optimize database queries and structure for performance",
      points: 150,
      status: "In Progress",
    }, 
    // {
    //   type: 'llm',
    //   id: 3,
    //   title: "API Integration Challenge",
    //   description: "Connect and integrate with external APIs securely",
    //   points: 200,
    //   status: "Locked",
    // },
    // {
    //   type: 'llm',
    //   id: 4,
    //   title: "Scalability Solutions",
    //   description: "Design and implement scalable architecture",
    //   points: 250,
    //   status: "Locked",
    // },
  ];
  const handleNameChange = () => {
    // Add your name update logic here
    setShowNamePopup(false);
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {loading ? (
          <div className="text-gray-400">Loading team data...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-125">
            {teamData?.teamName || 'Team Name'}
          </h1>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      {/* <button onClick={() => setShowNamePopup(true)} className="group relative"> */}
        {/* <span className="absolute -right-6 -top-1 opacity-100 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </span> */}
      {/* </button> */}

      <div className="flex flex-col justify-center items-center w-full">
        {/* <div className="flex w-full text-white justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            {completedChallenges}/{totalChallenges} Levels
          </span>
        </div> */}

        {/* Enhanced Progress Bar */}
        {/* <div className="w-full relative">
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage === 100 && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 animate-pulse"></div>
              )}
            </div>
          </div>
          {progressPercentage === 100 && (
            <div className="absolute inset-0 blur-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
          )}
        </div> */}
      </div>

      {showNamePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Change Team Name
            </h3>

            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter new team name"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNamePopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNameChange}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="flex flex-col justify-center items-center w-full">
        <div className="flex w-full text-white justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm font-medium">
            {completedChallenges}/{totalChallenges} Levels
          </span>
        </div>

      
        <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div> */}

      {/* Navigation Tabs */}
      <div className="flex mb-8 flex-wrap mt-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-1.5 border border-gray-700 w-fit shadow-xl">
        {["Challenges", "Leaderboard", "Team","Graph"].map((tab) => (
          <button
            key={tab}
            className={`relative px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-purple/30"
                : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="relative z-10 font-medium text-sm">{tab}</span>
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg" />
            )}
            {activeTab !== tab && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg" />
              </div>
            )}
          </button>
        ))}
      </div>
      {activeTab === "Challenges" && <ChallengesList />}
      {activeTab === "Leaderboard" && (
        <LeaderBoard leaderboardData={leaderboardData} />
      )}
      {activeTab === "Team" && <Team teamMembers={teamMembers} />}
      {activeTab === "Graph" && <Graph/>}
    </div>
  );
}
