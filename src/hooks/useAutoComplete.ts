import { useState, useMemo } from "react";

interface UseAutoCompleteOptions {
  commands: string[];
  currentInput: string;
}

export const useAutoComplete = ({
  commands,
  currentInput,
}: UseAutoCompleteOptions) => {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const suggestions = useMemo(() => {
    if (!currentInput.trim()) return [];

    const input = currentInput.toLowerCase().trim();
    return commands
      .filter((cmd) => cmd.toLowerCase().startsWith(input))
      .sort()
      .slice(0, 10); // Limit to 10 suggestions
  }, [currentInput, commands]);

  const getCompletion = (): string | null => {
    if (suggestions.length === 0) return null;
    return suggestions[selectedSuggestionIndex] || suggestions[0];
  };

  const moveSelectionUp = () => {
    setSelectedSuggestionIndex((prev) =>
      prev > 0 ? prev - 1 : suggestions.length - 1
    );
  };

  const moveSelectionDown = () => {
    setSelectedSuggestionIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : 0
    );
  };

  const resetSelection = () => {
    setSelectedSuggestionIndex(0);
  };

  return {
    suggestions,
    selectedSuggestionIndex,
    getCompletion,
    moveSelectionUp,
    moveSelectionDown,
    resetSelection,
  };
};
