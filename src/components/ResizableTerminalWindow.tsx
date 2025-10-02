import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiMinus, FiSquare, FiX, FiMinimize2, FiPlus } from "react-icons/fi";
import { Terminal } from "./Terminal";

interface ResizableTerminalWindowProps {
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onNewTerminal?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
  onActivate?: () => void;
}

export const ResizableTerminalWindow: React.FC<
  ResizableTerminalWindowProps
> = ({
  onClose,
  children,
  initialPosition,
  onNewTerminal,
  minimized,
  onToggleMinimize,
  onActivate,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [minHidden, setMinHidden] = useState(false);
  type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
  const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);
  const [position, setPosition] = useState({
    x: initialPosition?.x ?? 200,
    y: initialPosition?.y ?? 100,
  });
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  // Trigger enter animation on mount
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHasAppeared(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Responsive mode: force maximize on small screens
  useEffect(() => {
    const onResize = () => {
      const isSmall = window.innerWidth < 640 || window.innerHeight < 480;
      setResponsive(isSmall);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Do not force maximize on small screens; we'll size below.
  useEffect(() => {
    // trigger re-render on breakpoint changes
  }, [responsive]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      onActivate?.();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position, isMaximized, onActivate]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
      if (isResizing && resizeDir && !isMaximized && !responsive) {
        const MIN_W = Math.min(400, Math.max(280, window.innerWidth - 32));
        const MIN_H = Math.min(300, Math.max(220, window.innerHeight - 120));
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;

        let newLeft = resizeStart.left;
        let newTop = resizeStart.top;
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;

        // East/West resizing
        if (resizeDir.includes("e")) {
          newWidth = Math.max(MIN_W, resizeStart.width + dx);
        }
        if (resizeDir.includes("w")) {
          const w = Math.max(MIN_W, resizeStart.width - dx);
          newLeft = resizeStart.left + (resizeStart.width - w);
          newWidth = w;
        }

        // North/South resizing
        if (resizeDir.includes("s")) {
          newHeight = Math.max(MIN_H, resizeStart.height + dy);
        }
        if (resizeDir.includes("n")) {
          const h = Math.max(MIN_H, resizeStart.height - dy);
          newTop = resizeStart.top + (resizeStart.height - h);
          newHeight = h;
        }

        setPosition({ x: newLeft, y: newTop });
        setSize({ width: newWidth, height: newHeight });
      }
    },
    [
      isDragging,
      isResizing,
      resizeDir,
      dragStart,
      resizeStart,
      isMaximized,
      responsive,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDir(null);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleMinimize = () => {
    onToggleMinimize?.();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleCloseWindow = () => {
    if (isClosing) return;
    setIsClosing(true);
    // Allow exit animation to play
    window.setTimeout(() => {
      onClose?.();
    }, 200);
  };

  // When minimized, fade out then hide; when restoring, unhide first
  useEffect(() => {
    if (minimized) {
      const t = window.setTimeout(() => setMinHidden(true), 200);
      return () => window.clearTimeout(t);
    }
    // restoring: show immediately so enter animation can play
    setMinHidden(false);
  }, [minimized]);

  const handleResizeStart = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized || responsive) return;
    setIsResizing(true);
    setResizeDir(dir);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y,
    });
  };

  let windowStyle: any;
  if (isMaximized) {
    windowStyle = {
      top: 0,
      left: 0,
      width: "100vw",
      height: "calc(100vh - 48px)",
    };
  } else if (responsive) {
    // smaller, centered window on small screens
    const vw = typeof window !== "undefined" ? window.innerWidth : 480;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const targetW = Math.max(300, Math.min(Math.floor(vw * 0.92), vw - 16));
    const targetH = Math.max(240, Math.min(Math.floor(vh * 0.7), vh - 96));
    const usableH = vh - 48; // account for footer height
    const centerTop = Math.floor((usableH - targetH) / 2);
    const safeTop = Math.max(8, Math.min(centerTop, usableH - targetH - 8));
    const centerLeft = Math.max(8, Math.floor((vw - targetW) / 2));
    windowStyle = {
      top: isNaN(safeTop) ? 8 : safeTop,
      left: centerLeft,
      width: targetW,
      height: targetH,
    };
  } else {
    windowStyle = {
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
    };
  }

  // Compact title bar sizing for small screens
  const titleBarHeight = responsive ? 32 : 36; // px
  const iconSize = responsive ? 10 : 12; // px
  const leftGapClass = responsive ? "gap-1" : "gap-2";
  const padXClass = responsive ? "px-2" : "px-3";
  const titleTextClass = responsive ? "text-xs" : "text-sm";

  return (
    <div
      ref={windowRef}
      className={
        `fixed shadow-2xl overflow-hidden transform ` +
        // Corner radius transitions on maximize/restore
        `${isMaximized ? "rounded-none" : "rounded-lg"} ` +
        // Smooth property transitions (disabled during drag/resize)
        `${
          isDragging || isResizing ? "" : "transition-all duration-200 ease-out"
        } ` +
        // Enter state
        `${
          hasAppeared && !isClosing
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-1"
        } ` +
        // Minimize/closing fade+scale
        `${
          minimized || isClosing ? "opacity-0 scale-95 pointer-events-none" : ""
        } ` +
        // After fade, fully hide
        `${minHidden ? "hidden" : ""}`
      }
      aria-hidden={minimized || minHidden}
      style={{
        ...windowStyle,
        backgroundColor: "var(--theme-window)",
        fontFamily: "'Ubuntu Mono', monospace",
        border: "1px solid var(--theme-window-border)",
        transition:
          isDragging || isResizing
            ? "none"
            : "top 200ms ease, left 200ms ease, width 200ms ease, height 200ms ease, transform 200ms ease, opacity 200ms ease, border-radius 200ms ease",
      }}
    >
      <div
        className={`flex items-center justify-between ${padXClass} select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          background: "var(--theme-titlebar)",
          borderBottom: "1px solid var(--theme-window-border)",
          height: titleBarHeight,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Left side - Window control buttons */}
        <div className={`flex items-center ${leftGapClass}`} data-no-drag>
          <button
            className=" rounded-md transition-all items-center justify-center group"
            onClick={handleCloseWindow}
            title="Close"
          >
            <FiX
              size={iconSize}
              style={{ color: "#ffffff" }}
              strokeWidth={2.5}
            />
          </button>
          <button
            className=" rounded-md transition-all items-center justify-center group"
            onClick={handleMinimize}
            title="Minimize"
          >
            <FiMinus
              size={iconSize}
              style={{ color: "#ffffff" }}
              strokeWidth={2.5}
            />
          </button>
          <button
            className="rounded-md transition-all flex items-center justify-center group"
            onClick={handleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <FiMinimize2
                size={iconSize}
                style={{ color: "#ffffff" }}
                strokeWidth={2.5}
              />
            ) : (
              <FiSquare
                size={iconSize}
                style={{ color: "#ffffff" }}
                strokeWidth={2.5}
              />
            )}
          </button>
        </div>

        {/* Center - Title */}
        <div
          className={`flex-1 flex items-center justify-center ${titleTextClass} font-medium`}
          style={{ color: "var(--theme-titlebar-text)" }}
        >
          khalid@portfolio: ~
        </div>

        {/* Right side - Menu buttons */}
        <div className="flex items-center gap-1" data-no-drag>
          <button
            className="rounded-lg transition-all items-center justify-center group border"
            onClick={() => onNewTerminal?.()}
            title="New Terminal"
          >
            <FiPlus
              size={iconSize}
              style={{ color: "#ffffff" }}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div
        className="relative terminal-window"
        style={{
          height: `calc(100% - ${titleBarHeight}px)`,
          backgroundColor: "var(--theme-window)",
        }}
      >
        {children || <Terminal />}

        {/* Resize Handles: corners and edges */}
        {!isMaximized && (
          <>
            {/* Corners */}
            <div
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
              onMouseDown={handleResizeStart("nw")}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
              onMouseDown={handleResizeStart("ne")}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
              onMouseDown={handleResizeStart("sw")}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
              onMouseDown={handleResizeStart("se")}
            />

            {/* Edges */}
            <div
              className="absolute top-0 left-3 right-3 h-2 cursor-n-resize"
              onMouseDown={handleResizeStart("n")}
            />
            <div
              className="absolute bottom-0 left-3 right-3 h-2 cursor-s-resize"
              onMouseDown={handleResizeStart("s")}
            />
            <div
              className="absolute top-3 bottom-3 left-0 w-2 cursor-w-resize"
              onMouseDown={handleResizeStart("w")}
            />
            <div
              className="absolute top-3 bottom-3 right-0 w-2 cursor-e-resize"
              onMouseDown={handleResizeStart("e")}
            />
          </>
        )}
      </div>
    </div>
  );
};
