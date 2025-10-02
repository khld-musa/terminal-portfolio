import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { TerminalState, TerminalLine } from "../types/terminal";
import { CommandProcessor } from "../services/CommandProcessor";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { BootSequence } from "./BootSequence";

const PROMPT = "khalid@portfolio:~$";

export interface TerminalRef {
  executeCommand: (command: string) => void;
}

type TerminalProps = {
  terminalId?: number;
  onPreview?: (id: number, lines: string[]) => void;
  isActive?: boolean;
  onActivate?: () => void;
};

export const Terminal = forwardRef<TerminalRef, TerminalProps>(
  ({ terminalId, onPreview, isActive = false, onActivate }, ref) => {
    const [state, setState] = useState<TerminalState>({
      lines: [],
      currentInput: "",
      commandHistory: [],
      historyIndex: -1,
      isBooting: true,
      currentDirectory: "~",
      username: "khalid",
      hostname: "portfolio",
    });

    const [commandProcessor] = useState(() => new CommandProcessor());
    // Using native caret now; no custom blinking cursor state
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = useCallback(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, []);

    // Focus input when clicking anywhere on terminal
    const handleTerminalClick = useCallback(() => {
      onActivate?.();
      if (inputRef.current && !state.isBooting) {
        inputRef.current.focus();
      }
    }, [state.isBooting, onActivate]);

    // Add welcome message after boot
    useEffect(() => {
      if (!state.isBooting && state.lines.length === 0) {
        const welcomeLines: TerminalLine[] = [
          {
            id: "welcome-1",
            type: "system",
            content: "Welcome to Khalid's Portfolio v2.1.0",
            timestamp: Date.now(),
          },
          {
            id: "welcome-2",
            type: "system",
            content: "Type --help to see available commands",
            timestamp: Date.now(),
          },
          {
            id: "welcome-3",
            type: "system",
            content: "",
            timestamp: Date.now(),
          },
        ];

        setState((prev) => ({ ...prev, lines: welcomeLines }));
      }
    }, [state.isBooting, state.lines.length]);

    // Execute command
    const executeCommand = useCallback(
      (command: string) => {
        const timestamp = Date.now();
        const inputLine: TerminalLine = {
          id: `input-${timestamp}`,
          type: "input",
          content: command,
          timestamp,
          prompt: PROMPT,
        };

        const result = commandProcessor.executeCommand(command);

        // Handle special commands
        if (result.clear) {
          setState((prev) => ({
            ...prev,
            lines: [],
            currentInput: "",
            commandHistory: command
              ? [...prev.commandHistory, command]
              : prev.commandHistory,
            historyIndex: -1,
          }));
          return;
        }

        if (result.exit) {
          // Add command and output, then handle exit
          const outputLines: TerminalLine[] = result.output.map(
            (line, index) => ({
              id: `output-${timestamp}-${index}`,
              type: "output",
              content: line,
              timestamp: timestamp + index,
            })
          );

          setState((prev) => ({
            ...prev,
            lines: [...prev.lines, inputLine, ...outputLines],
            currentInput: "",
            commandHistory: command
              ? [...prev.commandHistory, command]
              : prev.commandHistory,
            historyIndex: -1,
          }));

          // Handle exit after a delay
          setTimeout(() => {
            window.close();
          }, 2000);
          return;
        }

        // Regular command execution
        const outputLines: TerminalLine[] = result.output.map(
          (line, index) => ({
            id: `output-${timestamp}-${index}`,
            type: "output",
            content: line,
            timestamp: timestamp + index,
          })
        );

        setState((prev) => ({
          ...prev,
          lines: [...prev.lines, inputLine, ...outputLines],
          currentInput: "",
          commandHistory: command
            ? [...prev.commandHistory, command]
            : prev.commandHistory,
          historyIndex: -1,
        }));
      },
      [commandProcessor]
    );

    // Handle input change
    const handleInputChange = useCallback((value: string) => {
      setState((prev) => ({ ...prev, currentInput: value }));
    }, []);

    // Handle command history navigation
    const handleHistoryNavigation = useCallback((direction: "up" | "down") => {
      setState((prev) => {
        const { commandHistory, historyIndex } = prev;

        if (commandHistory.length === 0) return prev;

        let newIndex = historyIndex;

        if (direction === "up") {
          newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
        } else {
          newIndex =
            historyIndex === -1
              ? -1
              : Math.min(commandHistory.length - 1, historyIndex + 1);
          if (
            newIndex === commandHistory.length - 1 &&
            historyIndex === commandHistory.length - 1
          ) {
            newIndex = -1;
          }
        }

        const newInput = newIndex === -1 ? "" : commandHistory[newIndex];

        return {
          ...prev,
          currentInput: newInput,
          historyIndex: newIndex,
        };
      });
    }, []);

    // Get command suggestions for autocomplete
    const getCommandSuggestions = useCallback(
      (input: string): string[] => {
        return commandProcessor.getCommandSuggestions(input);
      },
      [commandProcessor]
    );

    // Handle boot completion
    const handleBootComplete = useCallback(() => {
      setState((prev) => ({ ...prev, isBooting: false }));
    }, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      executeCommand,
    }));

    // Scroll to bottom when lines change and emit preview snapshot
    useEffect(() => {
      scrollToBottom();

      if (terminalId != null && onPreview) {
        const lastLines = state.lines.slice(-6).map((l) => {
          if (l.type === "input") {
            return `${l.prompt ?? PROMPT} ${l.content}`;
          }
          return String(l.content ?? "");
        });
        onPreview(terminalId, lastLines);
      }
    }, [state.lines, scrollToBottom, terminalId, onPreview]);

    // Removed custom blink effect; native caret used

    // Focus input when terminal becomes active
    useEffect(() => {
      if (isActive && inputRef.current && !state.isBooting) {
        inputRef.current.focus();
      }
    }, [isActive, state.isBooting]);

    if (state.isBooting) {
      return <BootSequence onComplete={handleBootComplete} />;
    }

    return (
      <div
        ref={terminalRef}
        className="h-full font-mono overflow-y-auto cursor-text"
        style={{
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-fg)",
          fontFamily:
            "'Ubuntu Mono', 'DejaVu Sans Mono', 'Liberation Mono', monospace",
          fontSize: "13px",
        }}
        onClick={handleTerminalClick}
      >
        <div className="p-3 min-h-full">
          <TerminalOutput lines={state.lines} />
          <TerminalInput
            ref={inputRef}
            prompt={PROMPT}
            value={state.currentInput}
            onChange={handleInputChange}
            onExecute={executeCommand}
            onHistoryNavigation={handleHistoryNavigation}
            enableSuggestions={false}
            getCommandSuggestions={getCommandSuggestions}
          />
        </div>
      </div>
    );
  }
);

Terminal.displayName = "Terminal";
