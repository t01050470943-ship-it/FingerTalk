import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pill, Stage } from "../components";
import { COLORS } from "../theme";

// 씬4 바뀐 지역 나열 (11.94–17.04s / 358–511, 길이 153f)
// "세종, 대전, 충남, 경남, 전북, 울산에도 새 교육감이 들어섰습니다."
const REGIONS = ["세종", "대전", "충남", "경남", "전북", "울산"];

// 나레이션 발음에 맞춰 약 0.7초(21f) 간격으로 등장
const STEP = 21;
const START = 6;

export const Scene4Regions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div style={{ opacity: titleOpacity }}>
        <Pill color={COLORS.gold} style={{ color: COLORS.gold, fontSize: 58, padding: "20px 52px" }}>
          새 교육감 취임
        </Pill>
      </div>

      <div
        style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          width: "100%",
        }}
      >
        {REGIONS.map((name, i) => {
          const appearAt = START + i * STEP;
          const s = spring({
            frame: frame - appearAt,
            fps,
            config: { damping: 12, stiffness: 200 },
          });
          const scale = interpolate(s, [0, 1], [0.4, 1]);
          const opacity = interpolate(frame - appearAt, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={name}
              style={{
                opacity,
                transform: `scale(${scale})`,
                padding: "48px 0",
                borderRadius: 28,
                background: "rgba(45,212,191,0.10)",
                border: `3px solid ${COLORS.mint}`,
                fontSize: 104,
                fontWeight: 900,
                color: COLORS.text,
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
