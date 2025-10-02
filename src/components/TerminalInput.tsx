import React, { forwardRef, useCallback, useState, useEffect } from "react";

interface TerminalInputProps {
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  onExecute: (command: string) => void;
  onHistoryNavigation: (direction: "up" | "down") => void;
  getCommandSuggestions: (input: string) => string[];
  enableSuggestions?: boolean;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  (
    {
      prompt,
      value,
      onChange,
      onExecute,
      onHistoryNavigation,
      getCommandSuggestions,
      enableSuggestions = false,
    },
    ref
  ) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Handle key events
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "Enter":
            e.preventDefault();
            onExecute(value);
            setSuggestions([]);
            setShowSuggestions(false);
            break;

          case "ArrowUp":
            e.preventDefault();
            onHistoryNavigation("up");
            break;

          case "ArrowDown":
            e.preventDefault();
            onHistoryNavigation("down");
            break;

          case "Tab": {
            e.preventDefault();
            const el = e.currentTarget as HTMLInputElement;
            handleTabCompletion(el);
            break;
          }

          case "Escape":
            setSuggestions([]);
            setShowSuggestions(false);
            break;
        }
      },
      [value, onExecute, onHistoryNavigation]
    );

    // Handle tab completion: complete current token to common prefix or single match
    const handleTabCompletion = useCallback(
      (inputEl: HTMLInputElement) => {
        const selStart = inputEl.selectionStart ?? value.length;
        const selEnd = inputEl.selectionEnd ?? value.length;
        // Only complete when there is no selection (caret only)
        if (selStart !== selEnd) return;

        const left = value.slice(0, selStart);
        const right = value.slice(selStart);
        const match = left.match(/(^|\s)([^\s]*)$/);
        const token = match ? match[2] : "";
        const tokenStart = match ? selStart - token.length : selStart;

        if (!token) return; // nothing to complete

        const candidates = getCommandSuggestions(token);
        if (candidates.length === 0) return;

        // If exactly one, complete fully with a trailing space
        if (candidates.length === 1) {
          const completed = candidates[0] + " ";
          const newValue = value.slice(0, tokenStart) + completed + right;
          onChange(newValue);
          // move caret to after inserted word
          requestAnimationFrame(() => {
            const pos = tokenStart + completed.length;
            try {
              inputEl.setSelectionRange(pos, pos);
            } catch {}
          });
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        // Multiple candidates: extend to common prefix beyond current token
        const commonPrefix = candidates.reduce((prefix, word) => {
          let i = 0;
          while (i < prefix.length && i < word.length && prefix[i] === word[i])
            i++;
          return prefix.slice(0, i);
        }, candidates[0]);

        if (commonPrefix.length > token.length) {
          const completed = commonPrefix;
          const newValue = value.slice(0, tokenStart) + completed + right;
          onChange(newValue);
          requestAnimationFrame(() => {
            const pos = tokenStart + completed.length;
            try {
              inputEl.setSelectionRange(pos, pos);
            } catch {}
          });
          setSuggestions([]);
          setShowSuggestions(false);
        } else if (enableSuggestions) {
          // Optionally show list if enabled
          setSuggestions(candidates);
          setShowSuggestions(true);
        }
      },
      [value, getCommandSuggestions, onChange, enableSuggestions]
    );

    // Update suggestions when input changes
    useEffect(() => {
      if (!enableSuggestions) {
        // Suggestions UI disabled: never show the dropdown
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      if (value.trim()) {
        const currentSuggestions = getCommandSuggestions(value.trim());
        setSuggestions(currentSuggestions);
        setShowSuggestions(currentSuggestions.length > 1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, [value, getCommandSuggestions, enableSuggestions]);

    // Handle input change
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <div className="relative">
        <div className="flex items-center">
          <span className="text-terminal-amber mr-2">{prompt}</span>
          <div className="flex-1 relative">
            <input
              ref={ref}
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-terminal-text w-full font-mono"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </div>
        </div>

        {/* Command suggestions (optional) */}
        {enableSuggestions && showSuggestions && suggestions.length > 0 && (
          <div className="mt-1 ml-16 text-terminal-dim text-sm">
            <div>Suggestions:</div>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="ml-2">
                • {suggestion}
              </div>
            ))}
            <div className="text-xs mt-1 text-terminal-gray">
              Press TAB to autocomplete, ESC to dismiss
            </div>
          </div>
        )}
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";
