import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Save, X, Users } from 'lucide-react';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [formData, setFormData] = useState({
    teamName: '',
    member1: '',
    member2: '',
    member3: '',
    password: '',
    role: 'team'
  });
  const [confirmAction, setConfirmAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch teams');
      }

      const data = await response.json();
      setTeams(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = currentTeam 
        ? `${import.meta.env.VITE_API_URL}/api/teams/${currentTeam._id}`
        : `${import.meta.env.VITE_API_URL}/api/teams`;
      
      const response = await fetch(url, {
        method: currentTeam ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          teamName: formData.teamName,
          password: formData.password,
          members: [formData.member1, formData.member2, formData.member3].filter(Boolean),
          role: formData.role
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save team');
      }

      await fetchTeams();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
      console.error('Error saving team:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (team) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/${team._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch team details');
      }

      const { data } = await response.json();
      console.log('Team data:', data); // Debug log
      
      setCurrentTeam(data);
      setFormData({
        teamName: data.teamName || '',
        member1: data.members?.[0] || '',
        member2: data.members?.[1] || '',
        member3: data.members?.[2] || '',
        password: '', // Leave password empty for security
        role: data.role || 'team'
      });
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTeam(null);
    setError(null);
    setFormData({
      teamName: '',
      member1: '',
      member2: '',
      member3: '',
      password: '',
      role: 'team'
    });
  };

  const handleConfirmAction = async () => {
    if (confirmAction?.type === 'delete') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/${confirmAction.teamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete team');
        }

        // Remove the team from the local state
        setTeams(teams.filter(team => team._id !== confirmAction.teamId));
        setConfirmAction(null);
      } catch (err) {
        setError(err.message);
        console.error('Error deleting team:', err);
      }
    }
  };

  if (isLoading && teams.length === 0) {
    return <div className="min-h-screen bg-gray-900 p-6 text-white">Loading teams...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Team Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Team
          </button>
        </div>

        {/* Teams Table */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Team Name</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Members</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Role</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.filter(team => team.teamName != "organizers").map((team) => (
                <tr key={team._id} className="border-t border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 px-6">
                    <div className="text-white">{team.teamName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap">
                      {team.members?.map((member, index) => (
                        <div key={index} className="flex items-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-3 py-1 rounded-full text-sm text-gray-300 mr-2 mb-2">
                          <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                          {member}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      team.role === 'admin' 
                        ? 'bg-red-500/20 text-red-400' 
                        : team.role === 'mentor' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                    }`}>
                      {team.role === 'admin' ? 'Admin' : team.role === 'mentor' ? 'Mentor' : 'Team'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(team)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'delete', teamId: team._id })}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit/Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-[95%] md:max-w-xl shadow-2xl mx-2 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {currentTeam ? 'Edit Team' : 'Create New Team'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm md:text-base text-gray-300 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4 md:pt-6">
                    <h3 className="text-md font-medium text-white mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-purple-400" />
                      Team Members
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm md:text-base text-gray-300 mb-2">
                          Member 1
                        </label>
                        <input
                          type="text"
                          name="member1"
                          value={formData.member1}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                          required
                          placeholder="Enter member name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm md:text-base text-gray-300 mb-2">
                          Member 2 (Optional)
                        </label>
                        <input
                          type="text"
                          name="member2"
                          value={formData.member2}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter member name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm md:text-base text-gray-300 mb-2">
                          Member 3 (Optional)
                        </label>
                        <input
                          type="text"
                          name="member3"
                          value={formData.member3}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter member name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4 md:pt-6">
                    <div className="mb-4">
                      <label className="block text-sm md:text-base text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                        >
                          <option value="team">Team</option>
                          <option value="mentor">Mentor</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formData.role === 'team' && "Regular participant team account"}
                        {formData.role === 'mentor' && "Can validate submissions but cannot manage teams or challenges"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm md:text-base text-gray-300 mb-2">
                        Password {!currentTeam && <span className="text-red-400 font-medium">(Required for new accounts)</span>}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                        required={!currentTeam}
                        placeholder={currentTeam ? "Enter new password (leave empty to keep current)" : "Enter password"}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-gray-800 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-2 md:py-3 bg-gray-800 text-white rounded-lg mr-3 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {currentTeam ? 'Update Team' : 'Create Team'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Action Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">
                Confirm Action
              </h3>
              <p className="text-gray-400 mb-6">
                {confirmAction.type === 'delete'
                  ? `Are you sure you want to permanently delete ${teams.find(t => t._id === confirmAction.teamId)?.teamName}?`
                  : 'Please confirm you want to update this team information.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}