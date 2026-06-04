import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components";
import { COLORS } from "../theme";

// 씬5 정책·면접 다 바뀐다 (17.04–21.97s / 511–659, 길이 148f)
// "교육감이 바뀌면, 특수교육 정책도 면접 출제 방향도 달라집니다."
const ITEMS = ["특수교육 정책", "선발 규모 (TO)", "면접 출제"];
const STEP = 30;
const START = 12;

export const Scene5Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 78,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.3,
          marginBottom: 64,
        }}
      >
        교육감이 바뀌면
        <br />
        <span style={{ color: COLORS.gold }}>이것들이 달라집니다</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
        {ITEMS.map((label, i) => {
          const appearAt = START + i * STEP;
          const s = spring({
            frame: frame - appearAt,
            fps,
            config: { damping: 14, stiffness: 160 },
          });
          const opacity = interpolate(frame - appearAt, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(s, [0, 1], [-40, 0]);

          return (
            <div
              key={label}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 32,
                padding: "32px 40px",
                borderRadius: 28,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <Check progress={s} />
              <span style={{ fontSize: 72, fontWeight: 800, color: COLORS.text }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// 체크 마크가 그려지는 애니메이션
const Check: React.FC<{ progress: number }> = ({ progress }) => {
  const total = 60;
  const offset = total * (1 - Math.min(1, Math.max(0, progress)));
  return (
    <svg width={84} height={84} viewBox="0 0 84 84" style={{ flexShrink: 0 }}>
      <circle cx={42} cy={42} r={38} fill="rgba(45,212,191,0.15)" stroke={COLORS.mint} strokeWidth={4} />
      <polyline
        points="26,44 38,56 60,30"
        fill="none"
        stroke={COLORS.mint}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={total}
        strokeDashoffset={offset}
      />
    </svg>
  );
};
