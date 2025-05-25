import { useState, useEffect } from "react";
import { AlertTriangle, Save } from "lucide-react";
import axios from "axios";

export default function JuryScoreManagement() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ show: false, success: false, message: "" });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [juryScore, setJuryScore] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teams, searchQuery]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/teams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter out admin and mentor teams
      const teamsList = response.data.data.filter(
        (team) => team.role === "team"
      );
      setTeams(teamsList);
      setFilteredTeams(teamsList);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch teams"
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!searchQuery.trim()) {
      setFilteredTeams(teams);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = teams.filter((team) =>
      team.teamName?.toLowerCase().includes(query)
    );
    setFilteredTeams(filtered);
  };

  const handleOpenEditModal = (team) => {
    setSelectedTeam(team);
    // Convert the stored 0-50 score to 0-100 for display
    const displayScore = team.juryScore ? team.juryScore * 2 : 0;
    setJuryScore(displayScore.toString());
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedTeam(null);
    setJuryScore("");
  };

  const handleScoreChange = (e) => {
    // Only allow numbers between 0 and 100
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setJuryScore(value);
    }
  };

  const handleUpdateJuryScore = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const score = parseFloat(juryScore);
      if (isNaN(score) || score < 0 || score > 100) {
        throw new Error("Jury score must be a number between 0 and 100");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/teams/${selectedTeam._id}/jury-score`,
        { juryScore: score },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the team in the local state
      const updatedTeams = teams.map((team) => {
        if (team._id === selectedTeam._id) {
          return { ...team, juryScore: score };
        }
        return team;
      });

      setTeams(updatedTeams);
      setShowEditModal(false);
      setUpdateStatus({
        show: true,
        success: true,
        message: `Jury score for ${selectedTeam.teamName} updated successfully.`,
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus({ show: false, success: false, message: "" });
      }, 3000);
    } catch (err) {
      console.error("Error updating jury score:", err);
      setUpdateStatus({
        show: true,
        success: false,
        message:
          err.response?.data?.message || err.message || "Failed to update jury score",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Jury Score Management
          </h1>
          <div className="text-gray-400 text-sm">
            Assign jury scores (0-50) to teams for final ranking
          </div>
        </div>

        {/* Status messages */}
        {updateStatus.show && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              updateStatus.success
                ? "bg-green-900/30 border border-green-800 text-green-400"
                : "bg-red-900/30 border border-red-800 text-red-400"
            }`}
          >
            {updateStatus.message}
          </div>
        )}

        {/* Search filter */}
        <div className="mb-6 bg-gray-800/30 border border-gray-800 rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Search Teams
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by team name..."
                  className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 block focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading teams...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : (
          <div className="border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">
                    Team Name
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">
                    Challenge Points
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">
                    Jury Score (0-100)
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <tr
                      key={team._id}
                      className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-white">{team.teamName}</td>
                      <td className="py-4 px-6 text-blue-400 font-mono">
                        {team.points || 0}
                      </td>
                      <td className="py-4 px-6 text-purple-400 font-mono">
                        {team.juryScore ? team.juryScore * 2 : 0}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleOpenEditModal(team)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
                        >
                          Edit Score
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400">
                      No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Jury Score Modal */}
      {showEditModal && selectedTeam && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-white mb-4">
              Edit Jury Score for {selectedTeam.teamName}
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-400 mb-2 text-sm">
                Enter a score between 0 and 100 (this will be converted to 50% of the final score).
                The other 50% comes from challenge points.
              </p>
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="juryScore"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Jury Score
              </label>
              <input
                type="number"
                id="juryScore"
                min="0"
                max="100"
                value={juryScore}
                onChange={handleScoreChange}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white text-lg rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateJuryScore}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
