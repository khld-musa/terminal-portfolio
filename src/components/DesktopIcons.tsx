import React from "react";

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        aria-label={label}
        className="w-10 h-10 p-0 rounded-md border border-white/20 bg-black hover:bg-black/90 hover:border-white/40 hover:ring-2 hover:ring-white/40 transition-all duration-150 flex items-center justify-center shadow-sm"
      >
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>
      </button>
      <span className="text-black text-xs text-center font-medium drop-shadow-md select-none">
        {label}
      </span>
    </div>
  );
};

interface DesktopIconsProps {
  onNewTerminal: () => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  onNewTerminal,
}) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-3 z-0">
      <DesktopIcon
        icon={
          <img
            src="/terminal.svg"
            alt="Terminal"
            className="w-full h-full filter brightness-0 invert"
          />
        }
        label="New Terminal"
        onClick={onNewTerminal}
      />
    </div>
  );
};
