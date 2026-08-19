"use client";

/** Seamless CSS marquee. Children are duplicated once; the track slides -50%. */
export default function Marquee({ children, speed = "normal", reverse = false, className = "" }) {
  const anim = speed === "slow" ? "animate-marquee-slow" : "animate-marquee";

  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className={`${anim} flex w-max shrink-0 items-center group-hover:[animation-play-state:paused]`}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
