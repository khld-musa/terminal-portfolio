import React from "react";
import type { TerminalLine } from "../types/terminal";
import { useTerminalFormatter } from "../utils/TextFormatter";

interface TerminalOutputProps {
  lines: TerminalLine[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines }) => {
  const { formatTerminalText } = useTerminalFormatter();

  const renderLine = (line: TerminalLine) => {
    const baseClasses = "whitespace-pre-wrap break-words";
    const content = formatTerminalText(line.content);

    switch (line.type) {
      case "input":
        return (
          <div key={line.id} className={`${baseClasses} flex`}>
            <span className="text-terminal-green mr-2">{line.prompt}</span>
            <span className="text-terminal-text">{content}</span>
          </div>
        );

      case "output":
        return (
          <div
            key={line.id}
            className={`${baseClasses} text-terminal-text ml-0`}
          >
            {content}
          </div>
        );

      case "system":
        return (
          <div key={line.id} className={`${baseClasses} system-message`}>
            {content}
          </div>
        );

      default:
        return (
          <div key={line.id} className={baseClasses}>
            {content}
          </div>
        );
    }
  };

  return (
    <div className="terminal-content relative">{lines.map(renderLine)}</div>
  );
};
