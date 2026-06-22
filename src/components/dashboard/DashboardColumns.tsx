"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

export function DashboardColumns({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  const leftRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | null>(null);

  useEffect(() => {
    const node = leftRef.current;
    if (!node) return;

    const updateHeight = () => setLeftHeight(node.getBoundingClientRect().height);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const heightStyle = leftHeight
    ? ({ "--dashboard-left-height": `${leftHeight}px` } as CSSProperties & Record<"--dashboard-left-height", string>)
    : undefined;

  return (
    <div
      className="grid min-h-0 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]"
      style={heightStyle}
    >
      <div ref={leftRef} className="grid min-h-0 gap-4 self-start">
        {left}
      </div>
      {right}
    </div>
  );
}
