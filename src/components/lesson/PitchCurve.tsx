import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { usePlayer } from "./audio";

const PATHS = { fall: "M2,6 C60,7 130,12 198,34", rise: "M2,24 C90,24 140,24 198,4" } as const;

/** SVG intonation curve. Draws itself while the matching clip plays. */
export function PitchCurve({ direction, playingId, label = true }: { direction: "fall" | "rise"; playingId: string; label?: boolean }) {
  const p = usePlayer();
  const reduce = useReducedMotion();
  const path = useRef<SVGPathElement>(null);
  const [t, setT] = useState(1);
  const active = p.id === playingId && !reduce;
  useEffect(() => {
    if (!active) { setT(1); return; }
    let raf = 0;
    const tick = () => {
      const k = Math.min(1, (performance.now() - p.startedAt) / 1000 / (p.duration || 1.8));
      setT(k); if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, p.startedAt, p.duration]);
  const len = path.current?.getTotalLength() ?? 0;
  const pt = path.current && len ? path.current.getPointAtLength(len * t) : null;
  const color = direction === "fall" ? "text-voice-fall" : "text-voice-rise";
  return (
    <div className={`relative h-10 w-full ${color}`} aria-hidden>
      <svg viewBox="0 0 200 38" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path d={PATHS[direction]} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={3} vectorEffect="non-scaling-stroke" />
        <path ref={path} d={PATHS[direction]} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"
          vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - t} />
      </svg>
      {active && pt && (
        <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
          style={{ left: `${(pt.x / 200) * 100}%`, top: `${(pt.y / 38) * 100}%` }} />
      )}
      {label && <span className="absolute -top-1 right-0 text-[14px] font-medium opacity-80">Typical pattern</span>}
    </div>
  );
}
