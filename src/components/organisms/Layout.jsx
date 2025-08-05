import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedFolderId(null);
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
    setSearchQuery("");
  };

  const handleNewNote = () => {
    // This will be handled by the Dashboard component
    setRefreshTrigger(prev => prev + 1);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col">
      <Header
        onSearch={handleSearch}
        onNewNote={handleNewNote}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />
      
      <div className="flex-1 flex min-h-0">
        <Sidebar
          selectedFolderId={selectedFolderId}
          onFolderSelect={handleFolderSelect}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          refreshTrigger={refreshTrigger}
        />
        
        <main className="flex-1 min-w-0">
          <Outlet context={{
            selectedFolderId,
            searchQuery,
            onFolderSelect: handleFolderSelect,
            onNewNote: handleNewNote,
            triggerRefresh,
            refreshTrigger
          }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;