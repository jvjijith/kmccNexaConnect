import React, { useEffect, useRef } from "react";

interface MovingCarouselProps {
  text: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    background: string;
  };
  withOpacity: (color: string, opacity: number) => string;
  speed?: number;
  separator?: React.ReactNode;
}

const MovingCarousel: React.FC<MovingCarouselProps> = ({
  text,
  theme,
  withOpacity,
  speed = 30, // Lower is faster
  separator = <span style={{ margin: "0 15px", fontSize: "1.2rem", fontWeight: "bold", color: theme.accent }}>✧</span>,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const calculateRepetitions = () => {
      const containerWidth = container.offsetWidth;
      const contentWidth = content.offsetWidth;
      return Math.ceil((containerWidth * 2) / contentWidth) + 1;
    };

    const duplicateContent = () => {
      const repetitions = calculateRepetitions();
      const originalContent = content.innerHTML;

      let newContent = "";
      for (let i = 0; i < repetitions; i++) {
        newContent += originalContent;
      }
      content.innerHTML = newContent;
    };

    duplicateContent();

    let animationFrameId: number;
    let position = 0;

    const animate = () => {
      position -= 1;
      if (position <= -content.offsetWidth / calculateRepetitions()) {
        position = 0;
      }
      content.style.transform = `translateX(${position}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "15px 0",
        backgroundColor: withOpacity(theme.primary, 0.9),
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          willChange: "transform",
          color: theme.foreground,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                fontSize: "1.2rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "0 10px",
              }}
            >
              {text}
            </span>
            {separator}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MovingCarousel;
