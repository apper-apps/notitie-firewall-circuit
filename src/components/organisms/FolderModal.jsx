import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import folderService from "@/services/api/folderService";

const FolderModal = ({ folder, onClose, onSuccess }) => {
  const [name, setName] = useState(folder?.name || "");
  const [color, setColor] = useState(folder?.color || "#3498DB");
  const [loading, setLoading] = useState(false);

  const predefinedColors = [
    "#FF6B35", "#3498DB", "#27AE60", "#F39C12", 
    "#E74C3C", "#9B59B6", "#34495E", "#16A085"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Mapnaam is verplicht");
      return;
    }

    try {
      setLoading(true);
      
      const folderData = {
        name: name.trim(),
        color
      };

      if (folder) {
        await folderService.update(folder.Id, folderData);
        toast.success("Map bijgewerkt");
      } else {
        await folderService.create(folderData);
        toast.success("Map aangemaakt");
      }
      
      onSuccess();
    } catch (err) {
      toast.error("Fout bij opslaan van map");
      console.error("Error saving folder:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-secondary">
            {folder ? "Map bewerken" : "Nieuwe map"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Mapnaam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Voer mapnaam in..."
            autoFocus
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary">
              Kleur
            </label>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === colorOption 
                      ? "ring-2 ring-offset-2 ring-primary scale-110" 
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Save" size={16} className="mr-2" />
              )}
              {folder ? "Bijwerken" : "Aanmaken"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;