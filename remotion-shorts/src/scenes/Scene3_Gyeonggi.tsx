import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components";
import { COLORS } from "../theme";
import { KoreaMap, RegionKey } from "../KoreaMap";

// 씬3 경기 강조 ⭐ (8.06–11.94s / 242–358, 길이 116f)
// "특히 경기도는 현직이 물러나고, 진영 자체가 바뀌었어요."
export const Scene3Gyeonggi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 경기로 줌인 느낌: 지도가 살짝 확대
  const zoom = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const mapScale = interpolate(zoom, [0, 1], [1, 1.18]);

  const titleEnter = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const titleScale = interpolate(titleEnter, [0, 1], [0.6, 1]);

  // 하단 보조자막 화살표(→) 그리기: 현직 → 새 교육감
  const arrowStart = 30;
  const arrowProgress = interpolate(frame, [arrowStart, arrowStart + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [arrowStart - 6, arrowStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const allLit: Partial<Record<RegionKey, number>> = {
    gyeonggi: 0,
    chungnam: 0,
    sejong: 0,
    daejeon: 0,
    jeonbuk: 0,
    gyeongnam: 0,
    ulsan: 0,
  };

  return (
    <Stage>
      <div style={{ transform: `scale(${titleScale})`, opacity: titleEnter }}>
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            color: COLORS.gold,
            letterSpacing: 2,
            textShadow: "0 0 50px rgba(255,184,0,0.5)",
          }}
        >
          경기 <span style={{ color: COLORS.gold }}>★</span>
        </div>
      </div>

      <div style={{ marginTop: 8, transform: `scale(${mapScale})` }}>
        <KoreaMap frame={frame} litRegions={allLit} highlight="gyeonggi" />
      </div>

      {/* 현직 → 새 교육감 (보조자막) */}
      <div
        style={{
          marginTop: 12,
          opacity: subOpacity,
          display: "flex",
          alignItems: "center",
          gap: 28,
          fontSize: 62,
          fontWeight: 800,
        }}
      >
        <span style={{ color: COLORS.gray }}>임태희</span>
        <ArrowRight progress={arrowProgress} />
        <span style={{ color: COLORS.text }}>안민석</span>
      </div>
    </Stage>
  );
};

const ArrowRight: React.FC<{ progress: number }> = ({ progress }) => {
  const len = 90;
  const drawn = len * progress;
  return (
    <svg width={120} height={56} viewBox="0 0 120 56">
      <line
        x1={6}
        y1={28}
        x2={6 + drawn}
        y2={28}
        stroke={COLORS.gold}
        strokeWidth={8}
        strokeLinecap="round"
      />
      {progress > 0.85 && (
        <polyline
          points="92,12 112,28 92,44"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};
