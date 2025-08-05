import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import AutoSaveIndicator from "@/components/molecules/AutoSaveIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import noteService from "@/services/api/noteService";
import folderService from "@/services/api/folderService";

const NoteEditor = ({ noteId, onNoteUpdated, onClose }) => {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("2");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved");
  const [wordCount, setWordCount] = useState(0);
  
  const contentRef = useRef(null);
  const autoSaveRef = useRef(null);

  useEffect(() => {
    if (noteId) {
      loadNote();
    } else {
      // New note
      setNote(null);
      setTitle("");
      setContent("");
      setSelectedFolderId("2");
      setSaveStatus("saved");
    }
    loadFolders();
  }, [noteId]);

  useEffect(() => {
    // Auto-save functionality
    if (note || title || content) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [title, content, selectedFolderId]);

  useEffect(() => {
    // Update word count
    const text = stripHtml(content);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await noteService.getById(noteId);
      if (data) {
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
        setSelectedFolderId(data.folderId);
      } else {
        setError("Notitie niet gevonden");
      }
    } catch (err) {
      setError("Fout bij laden van notitie");
      console.error("Error loading note:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await folderService.getAll();
      setFolders(data);
    } catch (err) {
      console.error("Error loading folders:", err);
    }
  };

  const handleAutoSave = async () => {
    if (!title && !content) return;
    
    try {
      setSaveStatus("saving");
      
      const noteData = {
        title: title || "Naamloos",
        content,
        folderId: selectedFolderId
      };

      if (note) {
        await noteService.update(note.Id, noteData);
      } else {
        const newNote = await noteService.create(noteData);
        setNote(newNote);
      }
      
      setSaveStatus("saved");
      onNoteUpdated?.();
    } catch (err) {
      setSaveStatus("error");
      console.error("Error auto-saving note:", err);
    }
  };

  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      
      const noteData = {
        title: title || "Naamloos",
        content,
        folderId: selectedFolderId
      };

      if (note) {
        await noteService.update(note.Id, noteData);
        toast.success("Notitie opgeslagen");
      } else {
        const newNote = await noteService.create(noteData);
        setNote(newNote);
        toast.success("Notitie aangemaakt");
      }
      
      setSaveStatus("saved");
      onNoteUpdated?.();
    } catch (err) {
      setSaveStatus("error");
      toast.error("Fout bij opslaan van notitie");
      console.error("Error saving note:", err);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    setContent(contentRef.current?.innerHTML || "");
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return <Loading type="editor" />;
  }

  if (error) {
    return (
      <div className="h-full">
        <Error message={error} onRetry={loadNote} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="small"
              className="lg:hidden"
            >
              <ApperIcon name="ArrowLeft" size={16} />
            </Button>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-surface"
              >
                {folders.map((folder) => (
                  <option key={folder.Id} value={folder.Id.toString()}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <AutoSaveIndicator status={saveStatus} />
            <Button onClick={handleSave} variant="primary" size="small">
              <ApperIcon name="Save" size={14} className="mr-1" />
              Opslaan
            </Button>
          </div>
        </div>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel van de notitie..."
          className="text-lg font-medium border-none shadow-none bg-transparent px-0 focus:ring-0"
        />
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-100 p-2">
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => formatText("bold")}
            variant="ghost"
            size="small"
            className="p-2"
            title="Vet"
          >
            <ApperIcon name="Bold" size={16} />
          </Button>
          <Button
            onClick={() => formatText("italic")}
            variant="ghost"
            size="small"
            className="p-2"
            title="Cursief"
          >
            <ApperIcon name="Italic" size={16} />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <Button
            onClick={() => formatText("insertUnorderedList")}
            variant="ghost"
            size="small"
            className="p-2"
            title="Lijst"
          >
            <ApperIcon name="List" size={16} />
          </Button>
          <Button
            onClick={() => formatText("insertOrderedList")}
            variant="ghost"
            size="small"
            className="p-2"
            title="Genummerde lijst"
          >
            <ApperIcon name="ListOrdered" size={16} />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <Button
            onClick={() => formatText("formatBlock", "h1")}
            variant="ghost"
            size="small"
            className="p-2 text-sm font-medium"
            title="Kop 1"
          >
            H1
          </Button>
          <Button
            onClick={() => formatText("formatBlock", "h2")}
            variant="ghost"
            size="small"
            className="p-2 text-sm font-medium"
            title="Kop 2"
          >
            H2
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-auto">
        <div
          ref={contentRef}
          contentEditable
          className="min-h-full outline-none editor-content"
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.target.innerHTML)}
          placeholder="Begin met typen..."
          style={{ minHeight: "calc(100vh - 200px)" }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-2">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{wordCount} woord{wordCount !== 1 ? "en" : ""}</span>
          {note && (
            <span>
              Laatst gewijzigd: {new Date(note.updatedAt).toLocaleDateString("nl-NL")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;