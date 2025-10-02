import React, { useEffect, useRef } from "react";
import { FiTerminal, FiSettings, FiMonitor, FiRefreshCw } from "react-icons/fi";

interface ContextMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNewTerminal: () => void;
  onThemeToggle: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onNewTerminal,
  onThemeToggle,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const menuItems: ContextMenuItem[] = [
    {
      icon: <FiTerminal size={16} />,
      label: "New Terminal",
      onClick: () => {
        onNewTerminal();
        onClose();
      },
    },
    {
      icon: <FiRefreshCw size={16} />,
      label: "Refresh",
      onClick: () => {
        window.location.reload();
        onClose();
      },
    },
    {
      icon: <FiMonitor size={16} />,
      label: "Change Theme",
      onClick: () => {
        onThemeToggle();
        onClose();
      },
      divider: true,
    },
    {
      icon: <FiSettings size={16} />,
      label: "Settings",
      onClick: () => {
        onClose();
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-[9999] min-w-[200px] overflow-hidden animate-scale-in"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <button
            onClick={item.onClick}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
          {item.divider && <div className="border-t border-gray-700" />}
        </React.Fragment>
      ))}
    </div>
  );
};
