import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LogOut } from "lucide-react";
import ChallengeManagement from "./ChallengeManagement";
import Leaderboard from "../Dashboard/LeaderBoard";
import TeamManagement from "./Teams";
import ChallengeValidation from "./ChallengeValidation";

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const leaderboardData = [
    { teamName: "ByteBusters", points: 450, rank: 1 },
    { teamName: "Code Crusaders", points: 420, rank: 2 },
    { teamName: "Data Dragons", points: 385, rank: 3 },
    { teamName: "Algo Avengers", points: 350, rank: 4 },
    { teamName: "Your Team", points: 320, rank: 5 },
  ];

  const [activeTab, setActiveTab] = useState("Teams");

  return (
    <div>
      {" "}
      <div className="dark min-h-screen pb-10 bg-black md:px-6 px-3">
        <nav className="bg-black  w-full py-3 flex justify-between relative z-10 top-0 items-center">
          <div className="max-w-7xl w-full  mx-auto flex justify-between items-center">
            <img src="/assets/logo.jpg" className="md:w-48 w-36" alt="" />

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex gap-2 md:h-12 h-9 font-extrabold animate-shimmer text-white items-center hover:underline cursor-pointer justify-center rounded-md"
              >
                <ArrowLeftIcon size={18} className="text-xl" />
                Back to home
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto ">
          <div className="flex mb-8 mt-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-1.5 border border-gray-700 w-fit shadow-xl">
            {["Teams", "Challenges", "Submissions", "Leaderboard"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`relative px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-purple/30"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="relative z-10 font-medium text-sm">
                    {tab}
                  </span>
                  {activeTab === tab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg" />
                  )}
                  {activeTab !== tab && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg" />
                    </div>
                  )}
                </button>
              )
            )}
          </div>
          {activeTab == "Challenges" && <ChallengeManagement />}
          {activeTab == "Leaderboard" && (
            <Leaderboard leaderboardData={leaderboardData} />
          )}
          {activeTab == "Submissions" && <ChallengeValidation />}
          {activeTab == "Teams" && <TeamManagement />}
        </div>
      </div>
    </div>
  );
}
