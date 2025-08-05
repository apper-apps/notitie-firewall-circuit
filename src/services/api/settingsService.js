const settingsService = {
  get: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "theme" } },
          { field: { Name: "language" } },
          { field: { Name: "autoSaveInterval" } },
          { field: { Name: "defaultFolder" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('setting', params);
      
      if (!response.success) {
        console.error(response.message);
        // Return default settings if fetch fails
        return {
          theme: "light",
          language: "nl",
          autoSaveInterval: 3000,
          defaultFolder: "2"
        };
      }

      if (!response.data || response.data.length === 0) {
        // Return default settings if no settings exist
        return {
          theme: "light",
          language: "nl",
          autoSaveInterval: 3000,
          defaultFolder: "2"
        };
      }

      const setting = response.data[0];
      return {
        Id: setting.Id,
        theme: setting.theme || "light",
        language: setting.language || "nl",
        autoSaveInterval: setting.autoSaveInterval || 3000,
        defaultFolder: setting.defaultFolder?.Id?.toString() || setting.defaultFolder?.toString() || "2"
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      // Return default settings on error
      return {
        theme: "light",
        language: "nl",
        autoSaveInterval: 3000,
        defaultFolder: "2"
      };
    }
  },

  update: async (newSettings) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, try to get existing settings
      const currentSettings = await settingsService.get();
      
      if (currentSettings.Id) {
        // Update existing settings
        const params = {
          records: [
            {
              Id: currentSettings.Id,
              Name: "User Settings",
              theme: newSettings.theme || currentSettings.theme,
              language: newSettings.language || currentSettings.language,
              autoSaveInterval: newSettings.autoSaveInterval || currentSettings.autoSaveInterval,
              defaultFolder: parseInt(newSettings.defaultFolder) || parseInt(currentSettings.defaultFolder)
            }
          ]
        };

        const response = await apperClient.updateRecord('setting', params);
        
        if (!response.success) {
          console.error(response.message);
          return currentSettings;
        }

        if (response.results) {
          const successfulUpdates = response.results.filter(result => result.success);
          const failedUpdates = response.results.filter(result => !result.success);
          
          if (failedUpdates.length > 0) {
            console.error(`Failed to update settings records:${failedUpdates}`);
            failedUpdates.forEach(record => {
              record.errors?.forEach(error => {
                console.error(`${error.fieldLabel}: ${error.message}`);
              });
            });
          }
          
          if (successfulUpdates.length > 0) {
            const setting = successfulUpdates[0].data;
            return {
              Id: setting.Id,
              theme: setting.theme || "light",
              language: setting.language || "nl",
              autoSaveInterval: setting.autoSaveInterval || 3000,
              defaultFolder: setting.defaultFolder?.Id?.toString() || setting.defaultFolder?.toString() || "2"
            };
          }
        }
      } else {
        // Create new settings
        const params = {
          records: [
            {
              Name: "User Settings",
              theme: newSettings.theme || "light",
              language: newSettings.language || "nl",
              autoSaveInterval: newSettings.autoSaveInterval || 3000,
              defaultFolder: parseInt(newSettings.defaultFolder) || 2
            }
          ]
        };

        const response = await apperClient.createRecord('setting', params);
        
        if (!response.success) {
          console.error(response.message);
          return currentSettings;
        }

        if (response.results) {
          const successfulRecords = response.results.filter(result => result.success);
          const failedRecords = response.results.filter(result => !result.success);
          
          if (failedRecords.length > 0) {
            console.error(`Failed to create settings records:${JSON.stringify(failedRecords)}`);
            failedRecords.forEach(record => {
              record.errors?.forEach(error => {
                console.error(`${error.fieldLabel}: ${error.message}`);
              });
            });
          }
          
          if (successfulRecords.length > 0) {
            const setting = successfulRecords[0].data;
            return {
              Id: setting.Id,
              theme: setting.theme || "light",
              language: setting.language || "nl",
              autoSaveInterval: setting.autoSaveInterval || 3000,
              defaultFolder: setting.defaultFolder?.Id?.toString() || setting.defaultFolder?.toString() || "2"
            };
          }
        }
      }
      
      return currentSettings;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return newSettings;
    }
  }
};

export default settingsService;