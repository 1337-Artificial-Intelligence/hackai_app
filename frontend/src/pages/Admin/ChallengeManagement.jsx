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
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    resources: [""],
    subject: null,
    dependencies: [],
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

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
        order: selectedChallenge?.order || challenges.length + 1,
        points: 100
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
    setFormData({
      title: "",
      description: "",
      tag: "",
      resources: [""],
      subject: null,
      dependencies: []
    });
    setSelectedChallenge(null);
  };

  const openEditModal = challenge => {
    setSelectedChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      tag: challenge.tag,
      resources: challenge.resources?.length ? challenge.resources : [""],
      dependencies: challenge.dependencies?.map(String) || [],
      subject: null
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

        {/* Challenges Table */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Tag</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Title</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Dependencies</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(challenge => (
                <tr key={challenge._id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getTagStyle(challenge.tag)}`}>
                      {challenge.tag}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">{challenge.title}</td>
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
              ))}
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