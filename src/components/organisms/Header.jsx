import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  onSearch, 
  onNewNote, 
  onToggleMobileSidebar,
  showSearch = true 
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-surface border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-gray-600 hover:text-secondary transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-display font-semibold text-secondary">
                Notitie Hub
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block w-80">
              <SearchBar onSearch={onSearch} />
            </div>
          )}
          
          <Button onClick={onNewNote} variant="primary" size="medium">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            <span className="hidden sm:inline">Nieuwe notitie</span>
          </Button>
          
          <button
            onClick={() => navigate("/settings")}
            className="p-2 text-gray-600 hover:text-secondary transition-colors"
          >
            <ApperIcon name="Settings" size={20} />
          </button>
        </div>
      </div>
      
      {showSearch && (
        <div className="md:hidden mt-3">
          <SearchBar onSearch={onSearch} />
        </div>
      )}
    </header>
  );
};

export default Header;