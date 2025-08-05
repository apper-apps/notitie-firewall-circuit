const noteService = {
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "folderId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        orderBy: [
          {
            fieldName: "updatedAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        title: note.title || note.Name,
        content: note.content || "",
        folderId: note.folderId?.Id?.toString() || note.folderId?.toString() || "2",
        Tags: note.Tags || "",
        tags: note.Tags ? note.Tags.split(',') : [],
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "folderId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('note', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const note = response.data;
      return {
        Id: note.Id,
        title: note.title || note.Name,
        content: note.content || "",
        folderId: note.folderId?.Id?.toString() || note.folderId?.toString() || "2",
        Tags: note.Tags || "",
        tags: note.Tags ? note.Tags.split(',') : [],
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching note with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  getByFolderId: async (folderId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "folderId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "folderId",
            Operator: "EqualTo",
            Values: [parseInt(folderId)]
          }
        ],
        orderBy: [
          {
            fieldName: "updatedAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        title: note.title || note.Name,
        content: note.content || "",
        folderId: note.folderId?.Id?.toString() || note.folderId?.toString() || "2",
        Tags: note.Tags || "",
        tags: note.Tags ? note.Tags.split(',') : [],
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes by folder:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  search: async (query) => {
    if (!query.trim()) return [];
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "folderId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "content",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          {
            fieldName: "updatedAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        title: note.title || note.Name,
        content: note.content || "",
        folderId: note.folderId?.Id?.toString() || note.folderId?.toString() || "2",
        Tags: note.Tags || "",
        tags: note.Tags ? note.Tags.split(',') : [],
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching notes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  create: async (noteData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: noteData.title || "Nieuwe notitie",
            title: noteData.title || "Nieuwe notitie",
            content: noteData.content || "",
            folderId: parseInt(noteData.folderId) || 2,
            Tags: Array.isArray(noteData.tags) ? noteData.tags.join(',') : (noteData.Tags || "")
          }
        ]
      };

      const response = await apperClient.createRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create note records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          const note = successfulRecords[0].data;
          return {
            Id: note.Id,
            title: note.title || note.Name,
            content: note.content || "",
            folderId: note.folderId?.Id?.toString() || note.folderId?.toString() || "2",
            Tags: note.Tags || "",
            tags: note.Tags ? note.Tags.split(',') : [],
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  update: async (id, noteData) => {
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
            Name: noteData.title || "Nieuwe notitie",
            title: noteData.title || "Nieuwe notitie",
            content: noteData.content || "",
            folderId: parseInt(noteData.folderId) || 2,
            Tags: Array.isArray(noteData.tags) ? noteData.tags.join(',') : (noteData.Tags || "")
          }
        ]
      };

      const response = await apperClient.updateRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update note records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          const note = successfulUpdates[0].data;
          return {
            Id: note.Id,
            title: note.title || note.Name,
            content: note.content || "",
            folderId: note.folderId?.Id?.toString() || note.folderId?.toString() || "2",
            Tags: note.Tags || "",
            tags: note.Tags ? note.Tags.split(',') : [],
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating note:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete note records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default noteService;