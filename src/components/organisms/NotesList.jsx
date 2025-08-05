import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NoteCard from "@/components/molecules/NoteCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import noteService from "@/services/api/noteService";

const NotesList = ({ 
  selectedFolderId, 
  selectedNoteId, 
  onNoteSelect, 
  onNewNote,
  searchQuery,
  refreshTrigger 
}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, [selectedFolderId, searchQuery, refreshTrigger]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");
      
      let data;
      if (searchQuery) {
        data = await noteService.search(searchQuery);
      } else if (selectedFolderId) {
        data = await noteService.getByFolderId(selectedFolderId);
      } else {
        data = await noteService.getAll();
      }
      
      setNotes(data);
    } catch (err) {
      setError("Fout bij laden van notities");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Weet je zeker dat je deze notitie wilt verwijderen?")) {
      return;
    }

    try {
      await noteService.delete(noteId);
      toast.success("Notitie verwijderd");
      loadNotes();
      if (selectedNoteId === noteId.toString()) {
        onNoteSelect(null);
      }
    } catch (err) {
      toast.error("Fout bij verwijderen van notitie");
      console.error("Error deleting note:", err);
    }
  };

  if (loading) {
    return <Loading type="notes" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadNotes} />;
  }

  if (notes.length === 0) {
    const emptyType = searchQuery ? "search" : "notes";
    return (
      <Empty 
        type={emptyType}
        onAction={emptyType === "notes" ? onNewNote : undefined}
      />
    );
  }

  return (
    <div className="space-y-3 p-4">
      {searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {notes.length} resultaat{notes.length !== 1 ? "en" : ""} voor "{searchQuery}"
          </p>
        </div>
      )}
      
      {notes.map((note) => (
        <NoteCard
          key={note.Id}
          note={note}
          isActive={selectedNoteId === note.Id.toString()}
          onClick={() => onNoteSelect(note.Id.toString())}
          onDelete={handleDeleteNote}
        />
      ))}
    </div>
  );
};

export default NotesList;