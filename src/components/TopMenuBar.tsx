import React, { useState, useEffect } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const TopMenuBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 flex items-center justify-end px-4 z-50 shadow-lg">
      {/* Time and Theme Switcher */}
      <div className="flex items-center gap-4">
        {/* Time */}
        <div className="text-white text-sm font-medium flex flex-col items-end leading-tight">
          <span>{formatTime(currentTime)}</span>
          <span className="text-xs text-gray-400">
            {formatDate(currentTime)}
          </span>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default TopMenuBar;
