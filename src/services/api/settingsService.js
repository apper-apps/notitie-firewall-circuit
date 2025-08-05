import settingsData from "@/services/mockData/settings.json";

let settings = { ...settingsData };

const settingsService = {
  get: async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return { ...settings };
  },

  update: async (newSettings) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    settings = { ...settings, ...newSettings };
    return { ...settings };
  }
};

export default settingsService;