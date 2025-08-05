import foldersData from "@/services/mockData/folders.json";
import noteService from "./noteService.js";

let folders = [...foldersData];

const folderService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allNotes = await noteService.getAll();
    
    return folders.map(folder => ({
      ...folder,
      noteCount: allNotes.filter(note => note.folderId === folder.Id.toString()).length
    }));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const folder = folders.find(f => f.Id === parseInt(id));
    if (!folder) return null;
    
    const allNotes = await noteService.getAll();
    return {
      ...folder,
      noteCount: allNotes.filter(note => note.folderId === folder.Id.toString()).length
    };
  },

  create: async (folderData) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const newFolder = {
      Id: Math.max(...folders.map(f => f.Id)) + 1,
      name: folderData.name || "Nieuwe map",
      color: folderData.color || "#3498DB",
      createdAt: new Date().toISOString(),
      noteCount: 0
    };
    folders.push(newFolder);
    return { ...newFolder };
  },

  update: async (id, folderData) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) return null;
    
    folders[index] = {
      ...folders[index],
      ...folderData,
      Id: parseInt(id)
    };
    return { ...folders[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) return false;
    
    folders.splice(index, 1);
    return true;
  }
};

export default folderService;