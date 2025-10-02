import React, { useState, useMemo } from "react";
import {
  FiTerminal,
  FiUser,
  FiFolder,
  FiFileText,
  FiMail,
  FiSettings,
  FiX,
  FiSearch,
} from "react-icons/fi";

interface AppLauncherItem {
  icon: React.ReactNode;
  name: string;
  command: string;
  category: string;
}

interface AppLauncherProps {
  onLaunch: (command: string) => void;
  onClose: () => void;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  onLaunch,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const apps: AppLauncherItem[] = [
    {
      icon: <FiTerminal size={48} />,
      name: "Terminal",
      command: "clear",
      category: "System",
    },
    {
      icon: <FiUser size={48} />,
      name: "About Me",
      command: "about",
      category: "Portfolio",
    },
    {
      icon: <FiFolder size={48} />,
      name: "Projects",
      command: "projects",
      category: "Portfolio",
    },
    {
      icon: <FiFileText size={48} />,
      name: "Resume",
      command: "resume",
      category: "Portfolio",
    },
    {
      icon: <FiMail size={48} />,
      name: "Contact",
      command: "contact",
      category: "Portfolio",
    },
    {
      icon: <FiSettings size={48} />,
      name: "Help",
      command: "help",
      category: "System",
    },
  ];

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.command.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLaunch = (command: string) => {
    onLaunch(command);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] flex items-center justify-center animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[90%] max-w-3xl max-h-[80vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            Application Launcher
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close launcher"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="relative">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredApps.map((app) => (
                <button
                  key={app.command}
                  onClick={() => handleLaunch(app.command)}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 transition-all duration-200 group"
                >
                  <div className="text-blue-400 group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">{app.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{app.category}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
