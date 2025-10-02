import React from "react";
import { FiTerminal } from "react-icons/fi";

interface AutoCompleteDropdownProps {
  suggestions: string[];
  selectedIndex: number;
  position: { x: number; y: number };
  onSelect: (suggestion: string) => void;
}

export const AutoCompleteDropdown: React.FC<AutoCompleteDropdownProps> = ({
  suggestions,
  selectedIndex,
  position,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className="absolute bg-gray-900 border border-gray-700 rounded-md shadow-2xl z-50 min-w-[200px] max-h-[300px] overflow-y-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
            index === selectedIndex
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <FiTerminal size={14} className="text-green-400" />
          <span className="font-mono">{suggestion}</span>
        </button>
      ))}
    </div>
  );
};
