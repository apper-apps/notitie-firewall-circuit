import notesData from "@/services/mockData/notes.json";

let notes = [...notesData];

const noteService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const note = notes.find(n => n.Id === parseInt(id));
    return note ? { ...note } : null;
  },

  getByFolderId: async (folderId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return notes
      .filter(n => n.folderId === folderId)
      .map(n => ({ ...n }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return notes
      .filter(n => 
        n.title.toLowerCase().includes(searchTerm) ||
        n.content.toLowerCase().includes(searchTerm) ||
        n.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .map(n => ({ ...n }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  create: async (noteData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newNote = {
      Id: Math.max(...notes.map(n => n.Id)) + 1,
      title: noteData.title || "Nieuwe notitie",
      content: noteData.content || "",
      folderId: noteData.folderId || "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: noteData.tags || []
    };
    notes.push(newNote);
    return { ...newNote };
  },

  update: async (id, noteData) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) return null;
    
    notes[index] = {
      ...notes[index],
      ...noteData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...notes[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) return false;
    
    notes.splice(index, 1);
    return true;
  }
};

export default noteService;