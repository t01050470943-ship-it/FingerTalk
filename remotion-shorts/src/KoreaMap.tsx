import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { KOREA_PATH, KOREA_VIEWBOX, REGIONS, RegionKey } from "./korea-geo";

export { REGIONS };
export type { RegionKey };

// 실제 국경 데이터(world-atlas 10m) 기반 대한민국 외곽선.
// 자잘한 섬은 제거하고 본토 + 주요 섬만 유지(scripts/gen-korea.mjs).
export const KoreaMap: React.FC<{
  litRegions?: Partial<Record<RegionKey, number>>;
  frame: number;
  highlight?: RegionKey; // 경기 강조 모드 (씬3)
  width?: number;
}> = ({ litRegions = {}, frame, highlight, width = 480 }) => {
  const { fps } = useVideoConfig();
  const { width: vbW, height: vbH } = KOREA_VIEWBOX;
  const height = (width * vbH) / vbW;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      style={{ width, height, overflow: "visible" }}
    >
      <defs>
        <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(45,212,191,0.20)" />
          <stop offset="100%" stopColor="rgba(45,212,191,0.06)" />
        </linearGradient>
        <filter id="landGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="6"
            floodColor={COLORS.mint}
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      {/* 국토 실루엣 */}
      <path
        d={KOREA_PATH}
        fill="url(#landFill)"
        stroke={COLORS.mint}
        strokeWidth={1.6}
        strokeLinejoin="round"
        filter="url(#landGlow)"
      />

      {(Object.keys(REGIONS) as RegionKey[]).map((key) => {
        const r = REGIONS[key];
        const litAt = litRegions[key];
        const isLit = litAt !== undefined && frame >= litAt;
        const isHi = highlight === key;

        let scale = 0;
        let glow = 0;
        if (litAt !== undefined) {
          scale = spring({
            frame: frame - litAt,
            fps,
            config: { damping: 12, stiffness: 200 },
          });
          glow = interpolate(frame - litAt, [0, 6, 18], [0, 1, 0.45], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        }

        const dimmed = highlight && !isHi;
        const baseColor = isHi ? COLORS.gold : COLORS.mint;
        const dotR = isHi ? 9 : 6;

        if (!isLit) return null;

        return (
          <g key={key} opacity={dimmed ? 0.18 : 1}>
            {/* 외곽 글로우 */}
            <circle
              cx={r.x}
              cy={r.y}
              r={dotR + 12 * glow + (isHi ? 8 : 0)}
              fill={baseColor}
              opacity={0.22 + 0.28 * glow}
            />
            {/* 점 */}
            <circle cx={r.x} cy={r.y} r={dotR * scale} fill={baseColor} />
            {isHi && (
              <>
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={dotR + 7}
                  fill="none"
                  stroke={COLORS.gold}
                  strokeWidth={2.5}
                  opacity={0.9}
                />
                <text
                  x={r.x}
                  y={r.y - 20}
                  textAnchor="middle"
                  fill={COLORS.gold}
                  fontSize={22}
                  fontWeight={900}
                  fontFamily="Pretendard, sans-serif"
                >
                  경기 ★
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};
