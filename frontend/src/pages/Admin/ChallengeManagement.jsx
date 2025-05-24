import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  FileInput,
  Link,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";

export default function ChallengeManagement() {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [bonusFilter, setBonusFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    resources: [""],
    subject: null,
    dependencies: [],
    points: 100,
    initialPoints: 100,
    bonusPoints: 0,
    bonusLimit: 0,
    isAIChallenge: false,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);
  
  // Apply filters whenever challenges array or filter settings change
  useEffect(() => {
    applyFilters();
  }, [challenges, searchQuery, tagFilter, bonusFilter]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/challenges`);
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      const { data } = await response.json();
      setChallenges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err.message);
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    if (e.target.name === "resources") {
      const newResources = [...formData.resources];
      newResources[index] = e.target.value;
      setFormData({ ...formData, resources: newResources });
    } else if (e.target.name === "dependencies") {
      const value = e.target.value;
      const isChecked = e.target.checked;
      
      const newDependencies = isChecked
        ? [...formData.dependencies, value]
        : formData.dependencies.filter(dep => dep !== value);
      
      setFormData({ ...formData, dependencies: newDependencies });
    } else if (e.target.name === "initialPoints" || e.target.name === "bonusPoints") {
      // Auto-calculate total points when initialPoints or bonusPoints change
      const newValue = e.target.value ? parseInt(e.target.value) : 0;
      const fieldToUpdate = e.target.name;
      
      let initialPoints = fieldToUpdate === "initialPoints" ? newValue : (parseInt(formData.initialPoints) || 0);
      let bonusPoints = fieldToUpdate === "bonusPoints" ? newValue : (parseInt(formData.bonusPoints) || 0);
      
      // Calculate total points
      const totalPoints = initialPoints + bonusPoints;
      
      setFormData({ 
        ...formData, 
        [fieldToUpdate]: e.target.value,
        points: totalPoints.toString()
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addResourceField = () => {
    setFormData({ ...formData, resources: [...formData.resources, ""] });
  };

  const removeResourceField = index => {
    const newResources = formData.resources.filter((_, i) => i !== index);
    setFormData({ ...formData, resources: newResources });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = selectedChallenge 
        ? `${import.meta.env.VITE_API_URL}/api/challenges/${selectedChallenge._id}`
        : `${import.meta.env.VITE_API_URL}/api/challenges`;
      
      const formPayload = {
        title: formData.title,
        description: formData.description,
        tag: formData.tag,
        resources: formData.resources.filter(Boolean),
        dependencies: formData.dependencies,
        points: parseInt(formData.points) || 100,
        initialPoints: parseInt(formData.initialPoints) || parseInt(formData.points) || 100,
        bonusPoints: parseInt(formData.bonusPoints) || 0,
        bonusLimit: parseInt(formData.bonusLimit) || 0,
        isAIChallenge: formData.isAIChallenge
      };

      const response = await fetch(url, {
        method: selectedChallenge ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save challenge');
      }

      await fetchChallenges();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
      console.error('Error saving challenge:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/challenges/${selectedChallenge._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete challenge');
      }

      await fetchChallenges();
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting challenge:', err);
    }
  };

  const resetForm = () => {
    const initialPoints = 100;
    const bonusPoints = 0;
    
    setFormData({
      title: "",
      description: "",
      tag: "",
      resources: [""],
      subject: null,
      dependencies: [],
      points: initialPoints + bonusPoints, // Auto-calculate total points
      initialPoints: initialPoints,
      bonusPoints: bonusPoints,
      bonusLimit: 0,
      isAIChallenge: false,
    });
    setSelectedChallenge(null);
  };

  // Function to apply all filters to the challenges array
  const applyFilters = () => {
    let result = [...challenges];
    
    // Apply tag filter
    if (tagFilter !== "all") {
      result = result.filter(challenge => challenge.tag?.toLowerCase() === tagFilter.toLowerCase());
    }
    
    // Apply bonus filter
    if (bonusFilter === "with-bonus") {
      result = result.filter(challenge => challenge.bonusPoints > 0 && challenge.bonusLimit > 0);
    } else if (bonusFilter === "no-bonus") {
      result = result.filter(challenge => !(challenge.bonusPoints > 0 && challenge.bonusLimit > 0));
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        challenge => 
          challenge.title?.toLowerCase().includes(query) || 
          challenge.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredChallenges(result);
  };
  
  // Extract unique tags from challenges for the tag filter dropdown
  const getUniqueTags = () => {
    const tags = challenges.map(challenge => challenge.tag).filter(Boolean);
    return [...new Set(tags)];
  };
  
  const openEditModal = challenge => {
    setSelectedChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      tag: challenge.tag,
      resources: challenge.resources?.length ? challenge.resources : [""],
      dependencies: challenge.dependencies?.map(String) || [],
      points: challenge.points || 100,
      initialPoints: challenge.initialPoints || challenge.points || 100,
      bonusPoints: challenge.bonusPoints || 0,
      bonusLimit: challenge.bonusLimit || 0,
      isAIChallenge: challenge.isAIChallenge || false,
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Manage Challenges
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Challenge
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 bg-gray-800/30 border border-gray-800 rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 block focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Tag Filter */}
            <div className="w-full md:w-64">
              <label htmlFor="tagFilter" className="block text-sm font-medium text-gray-400 mb-1">
                Filter by Tag
              </label>
              <select
                id="tagFilter"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 block focus:outline-none transition-colors appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="all">All Tags</option>
                {getUniqueTags().map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Bonus Points Filter */}
            <div className="w-full md:w-64">
              <label htmlFor="bonusFilter" className="block text-sm font-medium text-gray-400 mb-1">
                Bonus Points
              </label>
              <select
                id="bonusFilter"
                value={bonusFilter}
                onChange={(e) => setBonusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 block focus:outline-none transition-colors appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="all">All Challenges</option>
                <option value="with-bonus">With Bonus Points</option>
                <option value="no-bonus">No Bonus Points</option>
              </select>
            </div>
          </div>
          
          {/* Filter Status and Reset */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {filteredChallenges.length} of {challenges.length} challenges
            </div>
            
            {(searchQuery || tagFilter !== "all" || bonusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTagFilter("all");
                  setBonusFilter("all");
                }}
                className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-md transition-colors flex items-center"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Challenges Table */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Tag</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Title</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Points</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Dependencies</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallenges.length > 0 ? filteredChallenges.map(challenge => (
                <tr key={challenge._id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getTagStyle(challenge.tag)}`}>
                      {challenge.tag}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">{challenge.title}</td>
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{challenge.points || 0} pts</div>
                    {(challenge.bonusPoints > 0 && challenge.bonusLimit > 0) && (
                      <div className="text-xs text-gray-400 mt-1">
                        +{challenge.bonusPoints} bonus for first {challenge.bonusLimit} submissions
                        <div className="mt-1">
                          <div>
                            <span className="text-green-400">
                              {Math.min(challenge.approvedSubmissionsCount || 0, challenge.bonusLimit)}
                            </span>
                            <span className="text-gray-500">/{challenge.bonusLimit} bonus claimed</span>
                          </div>
                          <div className="text-gray-500">
                            Total submissions: {challenge.approvedSubmissionsCount || 0}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2 max-w-[300px]">
                      {challenge.dependencies?.map(depId => {
                        const dep = challenges.find(c => c._id === depId);
                        return dep ? (
                          <span key={depId} className="px-2 py-1 rounded-full bg-gray-800 text-sm text-gray-400">
                            {dep.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openEditModal(challenge)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChallenge(challenge);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-gray-400">
                    {isLoading ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xl mb-2">No challenges found</div>
                        <div className="text-sm">Try adjusting your filters or add a new challenge</div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-[95%] md:max-w-2xl shadow-2xl mx-2 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {selectedChallenge ? "Edit Challenge" : "Create New Challenge"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm md:text-base text-gray-300 mb-2">
                        Tag
                      </label>
                      <input
                        type="text"
                        name="tag"
                        value={formData.tag}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter tag name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-gray-800 mb-4">
                      <div>
                        <label className="flex items-center text-sm md:text-base text-gray-300 mb-2">
                          Total Points
                          <span className="ml-2 px-2 py-0.5 text-xs bg-purple-900/30 text-purple-400 rounded-full">Auto-calculated</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="points"
                            value={formData.points || 100}
                            readOnly
                            className="w-full bg-gray-800/50 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-gray-300 border border-gray-700 cursor-not-allowed"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Initial Points + Bonus Points = Total Points
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm md:text-base text-gray-300 mb-2">
                          Initial Points
                        </label>
                        <input
                          type="number"
                          name="initialPoints"
                          value={formData.initialPoints}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Base points for completing the challenge
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm md:text-base text-gray-300 mb-2">
                          Bonus Points
                        </label>
                        <input
                          type="number"
                          name="bonusPoints"
                          value={formData.bonusPoints}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Extra points for early submissions
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm md:text-base text-gray-300 mb-2">
                          Bonus Limit
                        </label>
                        <input
                          type="number"
                          name="bonusLimit"
                          value={formData.bonusLimit}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Number of submissions that receive bonus points
                        </p>
                      </div>
                    </div>
                    
                    {/* <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isAIChallenge"
                          checked={formData.isAIChallenge}
                          onChange={(e) => setFormData({...formData, isAIChallenge: e.target.checked})}
                          className="form-checkbox h-5 w-5 text-purple-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm md:text-base text-gray-300">
                          AI Challenge (Score-based)
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        AI Challenges require mentors to input scores when validating submissions.
                        Points are awarded based on ranking (highest score gets 100 points).
                      </p>
                    </div> */}

                    <div>
                      <label className="block text-sm md:text-base text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm md:text-base text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-white h-32 focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm md:text-base text-gray-300 mb-2">
                      Resources
                    </label>
                    <div className="space-y-3">
                      {formData.resources.map((resource, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            name="resources"
                            value={resource}
                            onChange={(e) => handleInputChange(e, index)}
                            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-sm md:text-base text-white focus:ring-2 focus:ring-purple-500"
                            placeholder={`Resource ${index + 1} URL`}
                            required
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeResourceField(index)}
                              className="text-red-500 hover:text-red-400 shrink-0"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addResourceField}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Resource
                      </button>
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm md:text-base text-gray-300 mb-2">
                      Subject File
                    </label>
                    <label className="flex items-center bg-gray-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors">
                      <FileInput className="w-5 h-5 mr-2 text-purple-400" />
                      <span className="text-white text-sm md:text-base">
                        {formData.subject?.name || "Choose file..."}
                      </span>
                      <input
                        type="file"
                        name="subject"
                        onChange={handleInputChange}
                        className="hidden"
                        required={!selectedChallenge}
                      />
                    </label>
                  </div> */}

                  {/* Dependencies Section */}
                  <div>
                    <label className="block text-sm md:text-base text-gray-300 mb-2">
                      Depends On (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {challenges
                        .filter(c => !selectedChallenge || c._id !== selectedChallenge._id)
                        .map(challenge => (
                          <label key={challenge._id} className="flex items-center space-x-2 p-2 bg-gray-800 rounded hover:bg-gray-700">
                            <input
                              type="checkbox"
                              name="dependencies"
                              value={challenge._id}
                              checked={formData.dependencies.includes(challenge._id)}
                              onChange={handleInputChange}
                              className="form-checkbox h-4 w-4 text-purple-500 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-300">
                              {challenge.title} ({challenge.tag})
                            </span>
                          </label>
                        ))}
                      {challenges.length === 0 && (
                        <p className="text-gray-500 text-sm">No existing challenges to depend on</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-800 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm md:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 rounded-lg text-sm md:text-base"
                    >
                      <Save className="w-4 h-4 md:w-5 md:h-5 mr-1 inline" />
                      {selectedChallenge ? "Save Changes" : "Create Challenge"}
                    </button>
                  </div>
                </div>
                </div>
              </form>

              {/* <div className="border-t border-gray-800 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 rounded-lg text-sm md:text-base"
                  >
                    <Save className="w-4 h-4 md:w-5 md:h-5 mr-1 inline" />
                    {selectedChallenge ? "Save Changes" : "Create Challenge"}
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 w-full max-w-[95%] md:max-w-md shadow-2xl mx-2">
              <div className="text-center">
                <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  Delete Challenge?
                </h3>
                <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
                  Are you sure you want to permanently delete this challenge?
                  This action cannot be undone.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90 rounded-lg text-sm md:text-base"
                  >
                    Delete Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getTagStyle = (tag) => {
  if (!tag) return "bg-gray-700/20 text-gray-300";
  
  switch (tag.toLowerCase()) {
    case "training":
      return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400";
    case "llm":
      return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400";
    case "data":
      return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400";
    default:
      return "bg-gray-700/20 text-gray-300";
  }
};