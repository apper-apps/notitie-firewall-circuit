import React from "react";
import ApperIcon from "@/components/ApperIcon";

const FolderItem = ({ folder, isActive, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: folder.color }}
        />
        <span className="font-medium truncate">{folder.name}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
          {folder.noteCount}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.Id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-error transition-all duration-200"
        >
          <ApperIcon name="Trash2" size={14} />
        </button>
      </div>
    </div>
  );
};

export default FolderItem;