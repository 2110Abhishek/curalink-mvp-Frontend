import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Grid3X3, 
  FileSearch, 
  Users, 
  BookOpen, 
  MessageCircle,
  Heart,
  Sparkles,
  Zap,
  Brain
} from "lucide-react";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    condition: "",
    additionalConditions: "",
    city: "",
    country: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [favorites, setFavorites] = useState({
    trials: [],
    experts: [],
    publications: [],
  });

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const analyzeCondition = async () => {
    if (!profile.condition.trim()) {
      alert("Please describe your condition before analysis.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("https://curalink-mvp-backend.onrender.com/api/patient/analyze", {
        text: profile.condition,
      });
      setAnalysis(res.data.analysis || "No analysis result found.");
    } catch (error) {
      console.error("Error analyzing condition:", error);
      alert("Error analyzing condition. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profile.condition) {
      alert("Please describe your condition first.");
      return;
    }
    setSubmitted(true);
    setActiveTab("dashboard");
  };

  const addToFavorites = (type, item) => {
    if (!favorites[type].includes(item)) {
      setFavorites({
        ...favorites,
        [type]: [...favorites[type], item],
      });
    }
  };

  const navigationItems = [
    { id: "profile", icon: User, label: "Profile Setup", color: "blue" },
    { id: "dashboard", icon: Grid3X3, label: "Dashboard", color: "purple" },
    { id: "trials", icon: FileSearch, label: "Clinical Trials", color: "green" },
    { id: "experts", icon: Users, label: "Health Experts", color: "red" },
    { id: "publications", icon: BookOpen, label: "Publications", color: "yellow" },
    { id: "forums", icon: MessageCircle, label: "Community", color: "indigo" },
    { id: "favorites", icon: Heart, label: "Favorites", color: "pink" },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      red: "from-red-500 to-red-600",
      yellow: "from-yellow-500 to-yellow-600",
      indigo: "from-indigo-500 to-indigo-600",
      pink: "from-pink-500 to-pink-600",
    };
    return colors[color] || colors.blue;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Profile Setup</h2>
                <p className="text-blue-200 mt-2">
                  Tell us about yourself to get personalized recommendations
                </p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-300" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      Describe Your Condition
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        name="condition"
                        placeholder='Example: "I have Brain Cancer"'
                        value={profile.condition}
                        onChange={handleInputChange}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                      <motion.button
                        type="button"
                        onClick={analyzeCondition}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Brain className="w-5 h-5" />
                        )}
                        <span>{loading ? "Analyzing..." : "AI Analysis"}</span>
                      </motion.button>
                    </div>
                    
                    <AnimatePresence>
                      {analysis && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 bg-white/5 rounded-2xl p-4 border border-green-500/20"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">AI Analysis</span>
                          </div>
                          <p className="text-white/80 text-sm">{analysis}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">
                      Additional Conditions
                    </label>
                    <input
                      type="text"
                      name="additionalConditions"
                      placeholder='Example: "Glioma, Lung Cancer"'
                      value={profile.additionalConditions}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-medium mb-3 block">City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter your city"
                        value={profile.city}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-white font-medium mb-3 block">Country</label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Enter your country"
                        value={profile.country}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Save Profile & Continue
                  </motion.button>
                </form>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white font-semibold">Profile Tips</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-300 text-sm">1</span>
                    </div>
                    <p className="text-white/70 text-sm">
                      Be specific about your condition for better recommendations
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-300 text-sm">2</span>
                    </div>
                    <p className="text-white/70 text-sm">
                      Use natural language - our AI will understand your description
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-300 text-sm">3</span>
                    </div>
                    <p className="text-white/70 text-sm">
                      Add location to find local experts and trials
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "dashboard":
        if (!submitted)
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-blue-200">
                  Set up your profile to unlock personalized recommendations
                </p>
              </div>
            </div>
          );

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Personalized Dashboard</h2>
                <p className="text-blue-200 mt-2">
                  Recommendations based on your profile and preferences
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/10">
                  <p className="text-white text-sm">
                    <span className="text-blue-300">Condition:</span> {profile.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Clinical Trials", value: "12", color: "green", icon: FileSearch },
                { label: "Experts Nearby", value: "8", color: "blue", icon: Users },
                { label: "Publications", value: "24", color: "purple", icon: BookOpen },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                  onClick={() => setActiveTab(stat.label.toLowerCase().replace(' ', '-'))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mt-4">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/60 text-sm">Personalized for you</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {navigationItems.slice(2).map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(item.id)}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all text-center group"
                  >
                    <item.icon className="w-8 h-8 text-white/60 group-hover:text-white mx-auto mb-2 transition-colors" />
                    <span className="text-white text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "trials":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">Clinical Trials</h2>
            <p className="text-gray-600 mb-4">
              Explore available clinical trials related to{" "}
              <strong>{profile.condition}</strong>.
            </p>
            <div className="space-y-3">
              {["Trial A", "Trial B", "Trial C"].map((trial) => (
                <div
                  key={trial}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <span>{trial}</span>
                  <button
                    onClick={() => addToFavorites("trials", trial)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Add to Favorites
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "experts":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">Experts</h2>
            <p className="text-gray-600 mb-4">
              Meet experts specializing in {profile.condition}.
            </p>
            <div className="space-y-3">
              {["Dr. Mehta (Mumbai)", "Dr. Rao (Delhi)", "Dr. Brown (London)"].map(
                (expert) => (
                  <div
                    key={expert}
                    className="border p-3 rounded-lg flex justify-between items-center"
                  >
                    <span>{expert}</span>
                    <button
                      onClick={() => addToFavorites("experts", expert)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add to Favorites
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "publications":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">Publications</h2>
            <p className="text-gray-600 mb-4">
              Research publications related to {profile.condition}.
            </p>
            <div className="space-y-3">
              {["Journal of Oncology", "Brain Cancer Review", "Clinical Insights"].map(
                (pub) => (
                  <div
                    key={pub}
                    className="border p-3 rounded-lg flex justify-between items-center"
                  >
                    <span>{pub}</span>
                    <button
                      onClick={() => addToFavorites("publications", pub)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add to Favorites
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "forums":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">Community Forums</h2>
            <p className="text-gray-600 mb-4">
              Ask questions and connect with other patients or researchers.
            </p>
            <textarea
              placeholder="Share your thoughts or questions..."
              className="w-full border p-3 rounded-lg h-32 mb-3"
            />
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md">
              Post
            </button>
          </div>
        );

      case "favorites":
        return (
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">Trials:</h3>
                {favorites.trials.length ? (
                  <ul className="list-disc ml-6 text-gray-700">
                    {favorites.trials.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No trials saved.</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mt-3">Experts:</h3>
                {favorites.experts.length ? (
                  <ul className="list-disc ml-6 text-gray-700">
                    {favorites.experts.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No experts saved.</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mt-3">Publications:</h3>
                {favorites.publications.length ? (
                  <ul className="list-disc ml-6 text-gray-700">
                    {favorites.publications.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No publications saved.</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Added top padding wrapper to account for fixed navbar */}
      <div className="pt-20"> 
        <div className="flex">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-80 bg-white/10 backdrop-blur-2xl border-r border-white/20 h-screen sticky top-0"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Patient User</p>
                  <p className="text-blue-200 text-sm">Medical Journey</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${getColorClasses(item.color)} text-white shadow-lg`
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Profile Complete</span>
                  <span className="text-green-400 text-sm font-semibold">
                    {submitted ? '100%' : '60%'}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: submitted ? '100%' : '60%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}