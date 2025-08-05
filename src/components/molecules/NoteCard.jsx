import React from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const NoteCard = ({ note, isActive, onClick, onDelete }) => {
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const preview = stripHtml(note.content).slice(0, 120);
  const formattedDate = format(new Date(note.updatedAt), "d MMM", { locale: nl });

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md transform hover:scale-[1.01] ${
        isActive 
          ? "bg-primary/5 border-l-4 border-l-primary shadow-sm" 
          : "bg-surface hover:bg-gray-50 border border-gray-100"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium line-clamp-1 ${
          isActive ? "text-primary" : "text-secondary"
        }`}>
          {note.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.Id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-error transition-all duration-200"
        >
          <ApperIcon name="Trash2" size={14} />
        </button>
      </div>
      
      {preview && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {preview}...
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {note.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" size="small">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
    </div>
  );
};

export default NoteCard;