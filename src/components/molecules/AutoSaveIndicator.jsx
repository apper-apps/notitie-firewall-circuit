import React from "react";
import ApperIcon from "@/components/ApperIcon";

const AutoSaveIndicator = ({ status = "saved" }) => {
  const statusConfig = {
    saving: {
      icon: "Loader2",
      text: "Bezig met opslaan...",
      className: "text-warning animate-spin"
    },
    saved: {
      icon: "Check",
      text: "Opgeslagen",
      className: "text-success"
    },
    error: {
      icon: "AlertCircle",
      text: "Fout bij opslaan",
      className: "text-error"
    }
  };

  const config = statusConfig[status] || statusConfig.saved;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <ApperIcon 
        name={config.icon} 
        size={14} 
        className={config.className}
      />
      <span className="text-gray-600">{config.text}</span>
    </div>
  );
};

export default AutoSaveIndicator;