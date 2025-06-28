"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useBouncingCircle(
  circleRef: React.RefObject<HTMLDivElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  colors: string[],
  shouldStart: boolean
) {
  const velocityRef = useRef({ vx: 1.5, vy: 1.2 });
  const colorIndexRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;
    if (!circleRef.current || !containerRef.current) return;

    const circle = circleRef.current;
    const container = containerRef.current;

    gsap.to(circle, {
      opacity: 0.5,
      duration: 1,
      ease: "power2.out",
    });

    const updatePosition = () => {
      const { vx, vy } = velocityRef.current;
      const currentX = parseFloat(circle.style.left || "0");
      const currentY = parseFloat(circle.style.top || "0");

      const newX = currentX + vx;
      const newY = currentY + vy;

      const maxX = container.clientWidth - circle.clientWidth;
      const maxY = container.clientHeight - circle.clientHeight;

      // Bounce on X axis
      if (newX <= 0 || newX >= maxX) {
        velocityRef.current.vx *= -1;
        colorIndexRef.current = (colorIndexRef.current + 1) % colors.length;
        circle.style.background = colors[colorIndexRef.current];
      }

      // Bounce on Y axis
      if (newY <= 0 || newY >= maxY) {
        velocityRef.current.vy *= -1;
        colorIndexRef.current = (colorIndexRef.current + 1) % colors.length;
        circle.style.background = colors[colorIndexRef.current];
      }

      // Apply new position
      circle.style.left = `${newX}px`;
      circle.style.top = `${newY}px`;

      animationIdRef.current = requestAnimationFrame(updatePosition);
    };

    animationIdRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [shouldStart, colors, circleRef, containerRef]);
}
