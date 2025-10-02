import React, { useState, useEffect } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootMessages = [
  "Initializing Khalid Portfolio System...",
  "Loading kernel modules...",
  "Starting portfolio services...",
  "[ OK ] Portfolio data loaded",
  "[ OK ] Project database mounted",
  "[ OK ] Contact information loaded",
  "[ OK ] Skills matrix initialized",
  "[ OK ] Command processor ready",
  "Establishing secure connection...",
  "Welcome to KhalidOS Portfolio Terminal v2.1.0",
  "",
  "System ready. Type --help for available commands.",
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentMessageIndex >= bootMessages.length) {
      // Boot sequence complete
      setTimeout(() => {
        onComplete();
      }, 1000);
      return;
    }

    const currentMessage = bootMessages[currentMessageIndex];

    if (currentMessage === "") {
      // Empty line, add immediately
      setDisplayedMessages((prev) => [...prev, currentMessage]);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => prev + 1);
      }, 200);
      return;
    }

    setIsTyping(true);

    // Simulate typing effect
    let charIndex = 0;
    const typingInterval = setInterval(
      () => {
        if (charIndex <= currentMessage.length) {
          const partialMessage = currentMessage.substring(0, charIndex);
          setDisplayedMessages((prev) => {
            const newMessages = [...prev];
            newMessages[currentMessageIndex] = partialMessage;
            return newMessages;
          });
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);

          // Move to next message after a brief pause
          setTimeout(
            () => {
              setCurrentMessageIndex((prev) => prev + 1);
            },
            currentMessage.includes("[ OK ]") ? 150 : 500
          );
        }
      },
      currentMessage.includes("[ OK ]") ? 30 : 50
    );

    return () => clearInterval(typingInterval);
  }, [currentMessageIndex, onComplete]);

  return (
    <div className="h-screen bg-terminal-bg text-terminal-text font-mono p-4 overflow-hidden">
      {(() => {
        // Smooth progress based on characters typed vs total
        const totalChars =
          bootMessages.reduce((sum, m) => sum + m.length, 0) || 1;
        const typedChars = displayedMessages.reduce(
          (sum, m) => sum + (m ? m.length : 0),
          0
        );
        const progress = Math.min(1, typedChars / totalChars);
        const percent = Math.round(progress * 100);
        return <div className="hidden" data-progress-percent={percent} />;
      })()}
      <div className="space-y-1">
        {displayedMessages.map((message, index) => (
          <div
            key={index}
            className={`
              ${
                message.includes("[ OK ]")
                  ? "text-terminal-green"
                  : "text-terminal-dim"
              }
              ${
                message.includes("KhalidOS")
                  ? "text-terminal-yellow font-bold"
                  : ""
              }
              ${message.includes("System ready") ? "text-terminal-text" : ""}
              ${
                index === currentMessageIndex && isTyping
                  ? 'after:content-["▋"] after:animate-blink after:text-terminal-text'
                  : ""
              }
            `}
          >
            {message}
          </div>
        ))}

        {/* Loading indicator for current line */}
        {isTyping && currentMessageIndex < bootMessages.length && (
          <div className="text-terminal-text">
            <span className="animate-blink">▋</span>
          </div>
        )}
      </div>

      {/* Progress bar at bottom */}
      <div className="fixed bottom-8 left-4 right-4">
        {(() => {
          const totalChars =
            bootMessages.reduce((sum, m) => sum + m.length, 0) || 1;
          const typedChars = displayedMessages.reduce(
            (sum, m) => sum + (m ? m.length : 0),
            0
          );
          const progress = Math.min(1, typedChars / totalChars);
          const percent = Math.round(progress * 100);
          return (
            <>
              <div className="text-terminal-dim text-sm mb-2">
                Loading... {percent}%
              </div>
              <div className="w-full bg-terminal-bg border border-terminal-dim h-2">
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{ width: `${percent}%`, backgroundColor: "#22c55e" }}
                />
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};
