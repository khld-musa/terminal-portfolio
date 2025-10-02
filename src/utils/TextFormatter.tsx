import React from "react";

interface TextFormatterProps {
  text: string;
}

export const TextFormatter: React.FC<TextFormatterProps> = ({ text }) => {
  // Function to format text with special styling for commands and links
  const formatText = (input: string): React.ReactNode => {
    // Split by spaces to process each word
    const words = input.split(" ");

    return words.map((word, index) => {
      const key = `word-${index}`;
      const hasSpace = index < words.length - 1;

      // Check if word starts with --
      if (word.startsWith("--")) {
        return (
          <React.Fragment key={key}>
            <span className="command-option">{word}</span>
            {hasSpace && " "}
          </React.Fragment>
        );
      }

      // Check if word is a URL
      if (word.match(/^https?:\/\//)) {
        return (
          <React.Fragment key={key}>
            <span
              className="terminal-link"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  window.open(word, "_blank", "noopener,noreferrer");
                }
              }}
              title={`Ctrl+Click to open: ${word}`}
            >
              {word}
            </span>
            {hasSpace && " "}
          </React.Fragment>
        );
      }

      // Check if word is a command (single word without special chars)
      if (word.match(/^[a-zA-Z]+$/) && words[0] === word && index === 0) {
        return (
          <React.Fragment key={key}>
            <span className="command-text">{word}</span>
            {hasSpace && " "}
          </React.Fragment>
        );
      }

      // Regular text
      return (
        <React.Fragment key={key}>
          {word}
          {hasSpace && " "}
        </React.Fragment>
      );
    });
  };

  return <>{formatText(text)}</>;
};

// Hook for formatting terminal text
export const useTerminalFormatter = () => {
  const formatTerminalText = (text: string): React.ReactNode => {
    return <TextFormatter text={text} />;
  };

  return { formatTerminalText };
};
