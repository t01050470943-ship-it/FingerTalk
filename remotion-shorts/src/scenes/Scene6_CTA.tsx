import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components";
import { COLORS } from "../theme";

// 씬6 행동 촉구 CTA (21.97–25.35s / 659–761, 길이 102f)
// "응시 지역 교육감 공약, 지금 바로 확인하세요."
export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // 강조 펄스 (살짝 커졌다 줄어듦)
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2 * 1.2);

  const subEnter = spring({
    frame: frame - 16,
    fps,
    config: { damping: 18 },
  });

  // 채널명 고정 (마지막에 등장)
  const handleOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div style={{ transform: `scale(${scale * pulse})`, opacity }}>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.25,
            letterSpacing: -1,
          }}
        >
          응시 지역
          <br />
          <span
            style={{
              color: COLORS.gold,
              textShadow: "0 0 50px rgba(255,184,0,0.5)",
            }}
          >
            교육감 공약
          </span>
          <br />
          확인!
        </div>
      </div>

      <div
        style={{
          marginTop: 48,
          opacity: subEnter,
          fontSize: 60,
          fontWeight: 800,
          color: COLORS.mint,
          padding: "18px 44px",
          border: `3px solid ${COLORS.mint}`,
          borderRadius: 999,
        }}
      >
        면접 대비 필수
      </div>

      <div
        style={{
          marginTop: 72,
          opacity: handleOpacity,
          fontSize: 44,
          fontWeight: 700,
          color: COLORS.gray,
          letterSpacing: 1,
        }}
      >
        @특수교육임용창고
      </div>
    </Stage>
  );
};
