import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "notes", 
  title, 
  description, 
  actionText, 
  onAction 
}) => {
  const defaults = {
    notes: {
      icon: "FileText",
      title: "Geen notities gevonden",
      description: "Begin met het maken van je eerste notitie om je gedachten vast te leggen.",
      actionText: "Nieuwe notitie"
    },
    search: {
      icon: "Search",
      title: "Geen resultaten gevonden",
      description: "Probeer andere zoektermen of controleer je spelling.",
      actionText: null
    },
    folders: {
      icon: "Folder",
      title: "Geen mappen gevonden",
      description: "Organiseer je notities door mappen aan te maken.",
      actionText: "Nieuwe map"
    }
  };

  const config = defaults[type] || defaults.notes;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 p-4 bg-gray-100 rounded-full">
        <ApperIcon 
          name={config.icon} 
          size={40} 
          className="text-gray-400" 
        />
      </div>
      <h3 className="text-lg font-semibold text-secondary mb-2">
        {title || config.title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description || config.description}
      </p>
      {(actionText || config.actionText) && onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionText || config.actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;