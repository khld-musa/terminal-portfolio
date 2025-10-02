import { useRef, useState } from "react";
import { DesktopLayout } from "./components/DesktopLayout";
import { ResizableTerminalWindow } from "./components/ResizableTerminalWindow";
import { Terminal } from "./components/Terminal";
import "./App.css";

function App() {
  type Term = { id: number; minimized: boolean };
  const [terminals, setTerminals] = useState<Term[]>([
    { id: 1, minimized: false },
  ]);
  const nextIdRef = useRef(2);
  const [previews, setPreviews] = useState<Record<number, string[]>>({});
  const [activeId, setActiveId] = useState<number>(1);

  // For sending commands to the primary terminal when needed
  const primaryTerminalRef = useRef<{ executeCommand: (cmd: string) => void }>(
    null
  );

  const handleIconCommand = (command: string) => {
    if (command === "__new_terminal__") {
      setTerminals((prev) => [
        ...prev,
        { id: nextIdRef.current++, minimized: false },
      ]);
      return;
    }
    primaryTerminalRef.current?.executeCommand(command);
  };

  const addTerminal = () =>
    setTerminals((prev) => {
      const newId = nextIdRef.current++;
      setActiveId(newId);
      return [...prev, { id: newId, minimized: false }];
    });

  const closeTerminal = (id: number) =>
    setTerminals((prev) => prev.filter((t) => t.id !== id));

  const toggleMinimize = (id: number) =>
    setTerminals((prev) =>
      prev.map((t) => (t.id === id ? { ...t, minimized: !t.minimized } : t))
    );

  const bringToFront = (id: number) =>
    setTerminals((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      setActiveId(id);
      const others = prev.filter((t) => t.id !== id);
      return [...others, target];
    });

  const handlePreviewUpdate = (id: number, lines: string[]) => {
    setPreviews((prev) => ({ ...prev, [id]: lines }));
  };

  return (
    <DesktopLayout
      onIconCommand={handleIconCommand}
      terminalPreviews={terminals.map((t) => ({
        id: t.id,
        minimized: t.minimized,
        title: `Terminal ${t.id}`,
        lines: previews[t.id] ?? [],
      }))}
      onRestoreTask={(id) => {
        bringToFront(id);
        setTerminals((prev) =>
          prev.map((t) => (t.id === id ? { ...t, minimized: false } : t))
        );
      }}
      onCloseTask={(id) => closeTerminal(id)}
      onMinimizeTask={(id) => toggleMinimize(id)}
    >
      {terminals.map((t, idx) => (
        <ResizableTerminalWindow
          key={t.id}
          title={`khalid@portfolio: ~`}
          initialPosition={{ x: 70 + idx * 30, y: 70 + idx * 30 }}
          minimized={t.minimized}
          onToggleMinimize={() => toggleMinimize(t.id)}
          onNewTerminal={addTerminal}
          onClose={() => closeTerminal(t.id)}
          onActivate={() => bringToFront(t.id)}
        >
          <Terminal
            terminalId={t.id}
            onPreview={handlePreviewUpdate}
            isActive={!t.minimized && t.id === activeId}
            onActivate={() => bringToFront(t.id)}
            ref={idx === 0 ? primaryTerminalRef : undefined}
          />
        </ResizableTerminalWindow>
      ))}
    </DesktopLayout>
  );
}

export default App;
