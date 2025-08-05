import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../App";
import folderService from "@/services/api/folderService";
import ApperIcon from "@/components/ApperIcon";
import FolderItem from "@/components/molecules/FolderItem";
import FolderModal from "@/components/organisms/FolderModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const Sidebar = ({ 
  selectedFolderId, 
  onFolderSelect, 
  isOpen, 
  onClose,
  refreshTrigger 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);

  useEffect(() => {
    loadFolders();
  }, [refreshTrigger]);

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await folderService.getAll();
      setFolders(data);
    } catch (err) {
      setError("Fout bij laden van mappen");
      console.error("Error loading folders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Weet je zeker dat je deze map wilt verwijderen?")) {
      return;
    }

    try {
      await folderService.delete(folderId);
      toast.success("Map verwijderd");
      loadFolders();
      if (selectedFolderId === folderId.toString()) {
        onFolderSelect(null);
      }
    } catch (err) {
      toast.error("Fout bij verwijderen van map");
      console.error("Error deleting folder:", err);
    }
  };

  const handleFolderCreated = () => {
    loadFolders();
    setShowFolderModal(false);
  };

  const isActive = (path) => location.pathname === path;

  // Desktop Sidebar Content
  const sidebarContent = (
    <div className="h-full flex flex-col bg-surface border-r border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-display font-semibold text-secondary mb-4">
          Navigatie
        </h2>
        
        <div className="space-y-1">
          <button
            onClick={() => {
              navigate("/");
              onFolderSelect(null);
              onClose?.();
            }}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
              isActive("/") && !selectedFolderId 
                ? "bg-primary/10 text-primary" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ApperIcon name="Home" size={16} />
            <span>Alle notities</span>
          </button>
          
<button
            onClick={() => {
              navigate("/settings");
              onClose?.();
            }}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
              isActive("/settings") 
                ? "bg-primary/10 text-primary" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ApperIcon name="Settings" size={16} />
            <span>Instellingen</span>
          </button>

          <LogoutButton />
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-secondary">Mappen</h3>
          <Button
            onClick={() => setShowFolderModal(true)}
            variant="ghost"
            size="small"
            className="p-1"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        <div className="space-y-1">
          {loading ? (
            <Loading type="folders" />
          ) : error ? (
            <Error message={error} onRetry={loadFolders} />
          ) : folders.length === 0 ? (
            <Empty 
              type="folders"
              onAction={() => setShowFolderModal(true)}
            />
          ) : (
            folders.map((folder) => (
              <FolderItem
                key={folder.Id}
                folder={folder}
                isActive={selectedFolderId === folder.Id.toString()}
                onClick={() => {
                  navigate("/");
                  onFolderSelect(folder.Id.toString());
                  onClose?.();
                }}
                onDelete={handleDeleteFolder}
              />
            ))
          )}
        </div>
      </div>

      {showFolderModal && (
        <FolderModal
          onClose={() => setShowFolderModal(false)}
          onSuccess={handleFolderCreated}
        />
      )}
    </div>
  );

  // Desktop sidebar (static)
  const desktopSidebar = (
    <div className="hidden lg:block w-64 h-full">
      {sidebarContent}
    </div>
  );

  // Mobile sidebar (overlay)
  const mobileSidebar = (
    <>
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-full backdrop-blur-sm bg-surface/95">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <h2 className="font-display font-semibold text-secondary">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          <div className="h-[calc(100%-80px)]">
            {sidebarContent}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

// Logout Button Component
const LogoutButton = () => {
  const { logout } = React.useContext(AuthContext);
  
  const handleLogout = async () => {
    if (window.confirm("Weet je zeker dat je wilt uitloggen?")) {
      await logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
    >
      <ApperIcon name="LogOut" size={16} />
      <span>Uitloggen</span>
    </button>
  );
};

// Import AuthContext at the top

export default Sidebar;