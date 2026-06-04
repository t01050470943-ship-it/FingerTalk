import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, SAFE } from "./theme";

// 딥 네이비 그라데이션 배경 + 안전 영역 안에 콘텐츠 배치
export const Stage: React.FC<{
  children: React.ReactNode;
  bg?: string;
}> = ({ children, bg }) => {
  return (
    <AbsoluteFill
      style={{
        background:
          bg ??
          `radial-gradient(120% 90% at 50% 28%, #16265A 0%, ${COLORS.bg} 55%, ${COLORS.bgDeep} 100%)`,
        fontFamily: FONT,
      }}
    >
      <AbsoluteFill
        style={{
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: 80,
          paddingRight: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 씬 진입/퇴장 페이드 (크로스페이드 느낌). 로컬 프레임 기준.
export const SceneFade: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, durationInFrames, fadeIn = 8, fadeOut = 8 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// 상단 라벨(작은 알약형 칩)
export const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = COLORS.mint, style }) => {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "16px 40px",
        borderRadius: 999,
        border: `3px solid ${color}`,
        color,
        fontSize: 48,
        fontWeight: 800,
        letterSpacing: 2,
        background: "rgba(255,255,255,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
