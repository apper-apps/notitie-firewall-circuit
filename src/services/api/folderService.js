const folderService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "Tags" } },
          { field: { Name: "noteCount" } },
          { field: { Name: "createdAt" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('folder', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(folder => ({
        Id: folder.Id,
        name: folder.Name,
        color: folder.color || "#3498DB",
        Tags: folder.Tags || "",
        noteCount: folder.noteCount || 0,
        createdAt: folder.createdAt
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching folders:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "Tags" } },
          { field: { Name: "noteCount" } },
          { field: { Name: "createdAt" } }
        ]
      };

      const response = await apperClient.getRecordById('folder', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const folder = response.data;
      return {
        Id: folder.Id,
        name: folder.Name,
        color: folder.color || "#3498DB",
        Tags: folder.Tags || "",
        noteCount: folder.noteCount || 0,
        createdAt: folder.createdAt
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching folder with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (folderData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: folderData.name || "Nieuwe map",
            color: folderData.color || "#3498DB",
            Tags: folderData.Tags || "",
            noteCount: 0
          }
        ]
      };

      const response = await apperClient.createRecord('folder', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create folder records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          const folder = successfulRecords[0].data;
          return {
            Id: folder.Id,
            name: folder.Name,
            color: folder.color || "#3498DB",
            Tags: folder.Tags || "",
            noteCount: folder.noteCount || 0,
            createdAt: folder.createdAt
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating folder:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  update: async (id, folderData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: folderData.name,
            color: folderData.color,
            Tags: folderData.Tags || ""
          }
        ]
      };

      const response = await apperClient.updateRecord('folder', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update folder records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          const folder = successfulUpdates[0].data;
          return {
            Id: folder.Id,
            name: folder.Name,
            color: folder.color || "#3498DB",
            Tags: folder.Tags || "",
            noteCount: folder.noteCount || 0,
            createdAt: folder.createdAt
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating folder:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('folder', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete folder records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting folder:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default folderService;