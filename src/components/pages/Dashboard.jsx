import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import NotesList from "@/components/organisms/NotesList";
import NoteEditor from "@/components/organisms/NoteEditor";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
const Dashboard = () => {
  const { 
    selectedFolderId, 
    searchQuery, 
    onNewNote, 
    triggerRefresh,
    refreshTrigger 
  } = useOutletContext();
  
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleNoteSelect = (noteId) => {
    setSelectedNoteId(noteId);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setShowEditor(true);
    onNewNote?.();
  };

  const handleNoteUpdated = () => {
    triggerRefresh();
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNoteId(null);
  };

  return (
    <div className="h-full flex">
      {/* Notes List */}
      <div className={`${showEditor ? "hidden lg:block" : "block"} w-full lg:w-80 border-r border-gray-200 bg-background`}>
        <NotesList
          selectedFolderId={selectedFolderId}
          selectedNoteId={selectedNoteId}
          onNoteSelect={handleNoteSelect}
          onNewNote={handleNewNote}
          searchQuery={searchQuery}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Note Editor */}
      <div className={`${showEditor ? "block" : "hidden lg:block"} flex-1 min-w-0`}>
        {showEditor || selectedNoteId ? (
          <NoteEditor
            noteId={selectedNoteId}
            onNoteUpdated={handleNoteUpdated}
            onClose={handleCloseEditor}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-surface">
            <div className="text-center">
              <div className="mb-4 p-4 bg-gray-100 rounded-full inline-block">
                <ApperIcon name="FileText" size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Selecteer een notitie
              </h3>
              <p className="text-gray-600 mb-6">
                Kies een notitie uit de lijst om te beginnen met bewerken
              </p>
              <Button onClick={handleNewNote} variant="primary">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Nieuwe notitie
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;