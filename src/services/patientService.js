import axiosInstance from "./axiosInstance";

export const analyzeCondition = (condition) =>
  axiosInstance.post("/patient/analyze", { text: condition });

export const saveProfile = (profileData) =>
  axiosInstance.post("/patient/profile", profileData);

export const getProfile = (userId) =>
  axiosInstance.get(`/patient/profile/${userId}`);

export const getClinicalTrials = (condition, location) => {
  const params = {};
  if (condition) params.condition = condition;
  if (location) params.location = location;
  
  return axiosInstance.get("/api/trials", { params });
};

export const getHealthExperts = (condition, location) => {
  // For now, return mock data since we don't have experts endpoint
  return Promise.resolve({
    data: [
      {
        id: 1,
        name: "Dr. Smith",
        specialization: `${condition} Specialist`,
        hospital: "City General Hospital",
        location: location || "New York",
        rating: 4.8,
        experience: 15
      },
      {
        id: 2,
        name: "Dr. Johnson",
        specialization: "Oncology Expert",
        hospital: "Medical Center",
        location: location || "Chicago",
        rating: 4.9,
        experience: 20
      }
    ]
  });
};

export const getPublications = (condition) => {
  // For now, return mock data since we don't have publications endpoint
  return Promise.resolve({
    data: [
      {
        id: 1,
        title: `Recent Advances in ${condition} Treatment`,
        authors: "Smith J, Johnson A, Williams R",
        abstract: `This study explores new treatment methodologies for ${condition} and their clinical implications.`,
        date: "2024-01-15",
        journal: "Journal of Medical Research"
      },
      {
        id: 2,
        title: `Understanding ${condition}: A Comprehensive Review`,
        authors: "Brown K, Davis M",
        abstract: `A systematic review of current research and future directions in ${condition} management.`,
        date: "2024-02-20",
        journal: "Clinical Medicine Today"
      }
    ]
  });
};

export const addToFavorites = (favoriteData) => {
  // For now, just resolve since we don't have favorites endpoint
  return Promise.resolve({ data: favoriteData });
};

export const getFavorites = (userId) => {
  // For now, return empty favorites
  return Promise.resolve({ data: { trials: [], experts: [], publications: [] } });
};

export const removeFromFavorites = (favoriteId) => {
  // For now, just resolve
  return Promise.resolve();
};