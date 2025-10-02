import React, { useState, useRef } from "react";
// Top bar remains as footer; use ThemeSwitcher directly at top-right
import { ThemeSwitcher } from "./ThemeSwitcher";
import { DesktopIcons } from "./DesktopIcons";
import { AppLauncher } from "./AppLauncher";
import { useTheme } from "../hooks/useTheme";
// Using an image for terminal icon in taskbar
type TerminalPreview = {
  id: number;
  minimized: boolean;
  title: string;
  lines: string[];
};

interface DesktopLayoutProps {
  children: React.ReactNode;
  onIconCommand?: (command: string) => void;
  terminalPreviews?: TerminalPreview[];
  onRestoreTask?: (id: number) => void;
  onCloseTask?: (id: number) => void;
  onMinimizeTask?: (id: number) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  onIconCommand,
  terminalPreviews = [],
  onRestoreTask,
  onCloseTask,
  onMinimizeTask,
}) => {
  const [showLauncher, setShowLauncher] = useState(false);
  const [showPreviews, setShowPreviews] = useState(false);
  const hoverTimeout = useRef<number | null>(null);
  const { currentTheme } = useTheme();

  // Placeholder for new terminal launch callback from desktop icon
  const handleNewTerminalFromIcon = () => {
    // We'll rely on the parent (App) to render additional ResizableTerminalWindow instances.
    // For now, emit a special command the parent can interpret, or consider lifting state.
    onIconCommand?.("__new_terminal__");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: currentTheme.colors.background,
      }}
    >
      {/* Top-right Theme Switcher (only) */}
      <div className="fixed top-2 right-2 z-50">
        <div className="backdrop-blur-md bg-black/30 border border-white/15 rounded-md shadow-sm p-1">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Desktop Icon: New Terminal only */}
      <DesktopIcons onNewTerminal={handleNewTerminalFromIcon} />

      {/* Content */}
      <div className="relative z-10 pt-10">{children}</div>

      {/* Bottom Taskbar (hidden if no terminals) */}
      <div
        className="fixed bottom-0 left-0 right-0 h-12 backdrop-blur-sm border-t border-gray-600 flex items-center px-4 z-40"
        style={{ backgroundColor: "#2d2d2d" }}
      >
        {/* Single taskbar icon with hover preview panel */}
        <div className="flex items-center justify-center w-full relative">
          <div
            className="relative"
            onMouseEnter={() => {
              if (hoverTimeout.current) {
                window.clearTimeout(hoverTimeout.current);
                hoverTimeout.current = null;
              }
              setShowPreviews(true);
            }}
            onMouseLeave={() => {
              if (hoverTimeout.current)
                window.clearTimeout(hoverTimeout.current);
              hoverTimeout.current = window.setTimeout(
                () => setShowPreviews(false),
                120
              );
            }}
          >
            {terminalPreviews.length > 0 && (
              <button
                className="w-10 h-10 p-0 rounded-md border border-black/20 bg-white hover:bg-white/90 hover:border-black/40 hover:ring-2 hover:ring-black/30 transition-all duration-150 flex items-center justify-center shadow-sm"
                title="Terminals"
                onClick={() => {
                  if (terminalPreviews.length === 1) {
                    const t = terminalPreviews[0];
                    if (t.minimized) {
                      onRestoreTask?.(t.id);
                    } else {
                      onMinimizeTask?.(t.id);
                    }
                    setShowPreviews(false);
                  } else {
                    setShowPreviews((s) => !s);
                  }
                }}
              >
                <img
                  src="/terminal.svg"
                  alt="Terminal"
                  className="w-full h-full"
                />
              </button>
            )}

            {showPreviews && terminalPreviews.length > 0 && (
              <div
                className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50"
                onMouseEnter={() => {
                  if (hoverTimeout.current) {
                    window.clearTimeout(hoverTimeout.current);
                    hoverTimeout.current = null;
                  }
                  setShowPreviews(true);
                }}
                onMouseLeave={() => {
                  if (hoverTimeout.current)
                    window.clearTimeout(hoverTimeout.current);
                  hoverTimeout.current = window.setTimeout(
                    () => setShowPreviews(false),
                    120
                  );
                }}
              >
                <div className="rounded-lg border border-white/15 shadow-2xl backdrop-blur-md bg-black/70 p-3 min-w-[320px] max-w-[90vw]">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {terminalPreviews.map((p) => (
                      <div
                        key={p.id}
                        className="relative w-[240px] h-[140px] rounded-md overflow-hidden border border-white/20 bg-zinc-900 text-zinc-100 text-left hover:ring-2 hover:ring-white/40 transition-all duration-150 flex-shrink-0 cursor-pointer"
                        title={p.title}
                        onClick={() => {
                          onRestoreTask?.(p.id);
                          setShowPreviews(false);
                        }}
                      >
                        <div className="px-2 py-1 text-[11px] bg-zinc-800/80 border-b border-white/10 flex items-center justify-between">
                          <span className="truncate max-w-[180px] opacity-90">
                            {p.title}
                          </span>
                          {!p.minimized ? (
                            <span
                              className="inline-block w-2 h-2 rounded-full bg-green-400/80"
                              title="Active"
                            />
                          ) : (
                            <span
                              className="inline-block w-2 h-2 rounded-full bg-yellow-300/80"
                              title="Minimized"
                            />
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseTask?.(p.id);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded bg-zinc-700/80 hover:bg-red-600/90 text-white text-[10px] flex items-center justify-center"
                          title="Close terminal"
                        >
                          ×
                        </button>
                        <div className="p-2 h-[110px] w-full text-left overflow-hidden font-mono text-[10px] leading-tight bg-black text-green-200">
                          {p.lines && p.lines.length > 0 ? (
                            <pre className="whitespace-pre-wrap">
                              {p.lines.join("\n").slice(-600)}
                            </pre>
                          ) : (
                            <div className="opacity-60">(no recent output)</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App Launcher */}
      {showLauncher && (
        <AppLauncher
          onLaunch={(command) => {
            onIconCommand?.(command);
            setShowLauncher(false);
          }}
          onClose={() => setShowLauncher(false)}
        />
      )}
    </div>
  );
};
