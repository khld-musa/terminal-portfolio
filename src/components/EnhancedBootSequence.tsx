import React, { useState, useEffect } from "react";
import { SMALL_LOGO, SPINNER_FRAMES } from "../utils/ASCII";

interface EnhancedBootSequenceProps {
  onComplete: () => void;
}

const bootMessages = [
  { text: "Initializing Khalid Portfolio System...", delay: 100 },
  { text: "[  OK  ] Started KhalidOS Portfolio Kernel", delay: 150 },
  { text: "[  OK  ] Reached target Portfolio System", delay: 100 },
  { text: "[  OK  ] Mounted /dev/projects", delay: 80 },
  { text: "[  OK  ] Mounted /dev/skills", delay: 80 },
  { text: "[  OK  ] Mounted /dev/experience", delay: 80 },
  { text: "[  OK  ] Started Portfolio Data Service", delay: 150 },
  { text: "[  OK  ] Started Command Processor Service", delay: 150 },
  { text: "[  OK  ] Started Contact Information Service", delay: 100 },
  { text: "[  OK  ] Reached target Multi-User System", delay: 200 },
  { text: "", delay: 100 },
  { text: "KhalidOS Portfolio Terminal v2.1.0", delay: 300 },
  { text: "", delay: 100 },
];

export const EnhancedBootSequence: React.FC<EnhancedBootSequenceProps> = ({
  onComplete,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  // Spinner animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerFrame((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (currentMessageIndex < bootMessages.length) {
      const targetProgress =
        ((currentMessageIndex + 1) / bootMessages.length) * 100;
      setProgress(targetProgress);
    }
  }, [currentMessageIndex]);

  // Boot sequence logic
  useEffect(() => {
    if (currentMessageIndex >= bootMessages.length) {
      setTimeout(() => {
        setShowLogo(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 500);
      return;
    }

    const currentMessage = bootMessages[currentMessageIndex];

    const timeout = setTimeout(() => {
      setDisplayedMessages((prev) => [...prev, currentMessage.text]);
      setCurrentMessageIndex((prev) => prev + 1);
    }, currentMessage.delay);

    return () => clearTimeout(timeout);
  }, [currentMessageIndex, onComplete]);

  return (
    <div className="h-screen bg-terminal-bg text-terminal-text font-mono p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Boot Messages */}
        <div className="space-y-1 mb-4">
          {displayedMessages.map((message, index) => (
            <div
              key={index}
              className={`animate-fade-in ${
                message.includes("[ OK ]")
                  ? "text-terminal-green"
                  : message.includes("KhalidOS")
                  ? "text-terminal-yellow font-bold text-center"
                  : "text-terminal-dim"
              }`}
            >
              {message}
            </div>
          ))}
          {currentMessageIndex < bootMessages.length && (
            <div className="text-terminal-cyan">
              {SPINNER_FRAMES[spinnerFrame]} Loading...
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {currentMessageIndex < bootMessages.length && (
          <div className="mb-6">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-terminal-dim text-sm mt-1 text-center">
              {Math.round(progress)}% Complete
            </div>
          </div>
        )}

        {/* ASCII Logo */}
        {showLogo && (
          <div className="animate-scale-in">
            <pre className="text-terminal-green text-xs sm:text-sm text-center leading-tight text-glow">
              {SMALL_LOGO}
            </pre>
            <div className="text-center mt-4 space-y-2">
              <div className="text-terminal-yellow animate-pulse">
                ★ Welcome to the Terminal ★
              </div>
              <div className="text-terminal-cyan text-sm">
                Type 'help' to get started
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
