import React, { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { FiMonitor, FiCheck } from "react-icons/fi";

export const ThemeSwitcher: React.FC = () => {
  const { themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
        aria-label="Switch theme"
      >
        <FiMonitor size={16} />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-700 text-xs text-gray-400 font-semibold uppercase">
              Select Theme
            </div>
            <div className="py-1 max-h-64 overflow-y-auto">
              {availableThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${
                    themeName === theme ? "text-green-400" : "text-white"
                  }`}
                >
                  <span className="capitalize">{theme.replace("-", " ")}</span>
                  {themeName === theme && <FiCheck size={16} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
