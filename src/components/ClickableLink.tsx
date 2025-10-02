import React, { useState, useCallback } from "react";

interface ClickableLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const ClickableLink: React.FC<ClickableLinkProps> = ({
  href,
  children,
  className = "",
}) => {
  const [showHint, setShowHint] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }
    },
    [href]
  );

  const handleMouseEnter = useCallback(() => {
    setShowHint(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowHint(false);
  }, []);

  return (
    <span
      className={`terminal-link ${showHint ? "ctrl-hint" : ""} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`Ctrl+Click to open: ${href}`}
    >
      {children}
    </span>
  );
};

// Hook to detect and convert URLs in text to clickable links
export const useClickableText = () => {
  const convertToClickableText = useCallback(
    (text: string): React.ReactNode => {
      // URL regex pattern
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);

      return parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <ClickableLink key={index} href={part}>
              {part}
            </ClickableLink>
          );
        }
        return part;
      });
    },
    []
  );

  return { convertToClickableText };
};
