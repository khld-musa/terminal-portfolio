import { useState, useEffect } from "react";

interface UseTypingEffectOptions {
  text: string;
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

export const useTypingEffect = ({
  text,
  speed = 30,
  enabled = true,
  onComplete,
}: UseTypingEffectOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      return;
    }

    setIsTyping(true);
    setDisplayedText("");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled, onComplete]);

  return { displayedText, isTyping };
};
