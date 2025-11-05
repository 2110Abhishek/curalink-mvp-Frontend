import React, { useEffect, useState } from "react";
import { getTrials, createTrial, updateTrial, deleteTrial } from "../services/trialService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  Activity,
  Download,
  Sparkles
} from "lucide-react";

const ResearcherDashboard = () => {
  const [trials, setTrials] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    condition: "", 
    location: "", 
    status: "Active" 
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load all trials
  const loadTrials = async () => {
    try {
      setIsLoading(true);
      const data = await getTrials();
      setTrials(data);
    } catch (error) {
      console.error("Error loading trials:", error);
      alert("Error loading trials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrials();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTrial(editingId, form);
        setEditingId(null);
      } else {
        await createTrial(form);
      }
      setForm({ title: "", description: "", condition: "", location: "", status: "Active" });
      setIsFormOpen(false);
      loadTrials();
      alert(editingId ? "Trial updated successfully!" : "Trial created successfully!");
    } catch (error) {
      console.error("Error saving trial:", error);
      alert("Error saving trial. Please try again.");
    }
  };

  const handleEdit = (trial) => {
    setForm({
      title: trial.title || "",
      description: trial.description || "",
      condition: trial.condition || "",
      location: trial.location || "",
      status: trial.status || "Active"
    });
    setEditingId(trial.id || trial._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trial?")) {
      try {
        await deleteTrial(id);
        loadTrials();
        alert("Trial deleted successfully!");
      } catch (error) {
        console.error("Error deleting trial:", error);
        alert("Error deleting trial. Please try again.");
      }
    }
  };

  const filteredTrials = trials.filter(trial =>
    trial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trial.condition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Active Trials", value: trials.filter(t => t.status === "Active").length, color: "green" },
    { label: "Recruiting", value: trials.filter(t => t.status === "Recruiting").length, color: "blue" },
    { label: "Completed", value: trials.filter(t => t.status === "Completed").length, color: "purple" },
    { label: "Total Trials", value: trials.length, color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-20 p-6"> {/* Changed from pt-16 to pt-20 for more space */}
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Researcher Dashboard
              </h1>
              <p className="text-blue-200 mt-2">Manage trials, collaborate, and advance research</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Trial</span>
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-4">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60 text-sm">Real-time data</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search trials by title or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-4 py-3 transition-all flex items-center space-x-2"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-4 py-3 transition-all flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Trials List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Clinical Trials</h2>
              <p className="text-blue-200">Manage your research studies and trials</p>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-blue-300">Loading trials...</span>
                </div>
              ) : filteredTrials.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-300" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {trials.length === 0 ? "No trials created yet" : "No matching trials found"}
                  </h3>
                  <p className="text-blue-200">
                    {trials.length === 0 
                      ? "Create your first clinical trial to get started" 
                      : "Try adjusting your search terms"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredTrials.map((trial, index) => (
                    <motion.div
                      key={trial.id || trial._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{trial.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              trial.status === 'Active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              trial.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {trial.status}
                            </span>
                          </div>
                          
                          <p className="text-white/70 mb-4 leading-relaxed">{trial.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            {trial.condition && (
                              <div className="flex items-center space-x-2 text-white/60">
                                <Activity className="w-4 h-4" />
                                <span>{trial.condition}</span>
                              </div>
                            )}
                            {trial.location && (
                              <div className="flex items-center space-x-2 text-white/60">
                                <MapPin className="w-4 h-4" />
                                <span>{trial.location}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-white/60">
                              <Calendar className="w-4 h-4" />
                              <span>Created recently</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(trial)}
                            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-3 transition-all group"
                          >
                            <Edit3 className="w-4 h-4 text-blue-300 group-hover:text-blue-200" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(trial.id || trial._id)}
                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-2xl p-3 transition-all group"
                          >
                            <Trash2 className="w-4 h-4 text-red-300 group-hover:text-red-200" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trial Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-3xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? "Edit Trial" : "Create New Trial"}
                </h2>
                <p className="text-blue-200">
                  {editingId ? "Update trial details" : "Add a new clinical trial to your portfolio"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white font-medium mb-2 block">Trial Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter trial title"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Medical Condition</label>
                    <input
                      type="text"
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      placeholder="e.g., Brain Cancer, Diabetes"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, USA"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Recruiting">Recruiting</option>
                      <option value="Completed">Completed</option>
                      <option value="Not Yet Recruiting">Not Yet Recruiting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide detailed description of the clinical trial, including objectives, methodology, and eligibility criteria..."
                    rows="4"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                      setForm({ title: "", description: "", condition: "", location: "", status: "Active" });
                    }}
                    className="px-6 py-3 border border-white/20 rounded-2xl text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {editingId ? "Update Trial" : "Create Trial"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearcherDashboard;