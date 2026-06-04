import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "./theme";

// 정밀 지도가 아닌 "단순 실루엣 + 점" 스타일 (설계도 §5 메모)
// viewBox 0 0 400 520 기준 좌표.

export type RegionKey =
  | "gyeonggi"
  | "sejong"
  | "daejeon"
  | "chungnam"
  | "jeonbuk"
  | "gyeongnam"
  | "ulsan";

export const REGIONS: Record<RegionKey, { x: number; y: number; label: string }> = {
  gyeonggi: { x: 168, y: 150, label: "경기" },
  chungnam: { x: 128, y: 250, label: "충남" },
  sejong: { x: 178, y: 262, label: "세종" },
  daejeon: { x: 196, y: 286, label: "대전" },
  jeonbuk: { x: 150, y: 330, label: "전북" },
  gyeongnam: { x: 238, y: 378, label: "경남" },
  ulsan: { x: 292, y: 356, label: "울산" },
};

// 한반도(남한)를 떠올리게 하는 단순 실루엣 path
const LAND_PATH =
  "M186,52 C150,66 132,100 142,140 C112,150 100,196 128,228 " +
  "C104,262 120,316 152,330 C160,372 206,398 244,376 " +
  "C296,378 322,322 296,282 C326,242 312,182 268,170 " +
  "C268,116 226,40 186,52 Z";

export const KoreaMap: React.FC<{
  // 점등될 지역과, 각 지역이 켜지는 로컬 프레임
  litRegions?: Partial<Record<RegionKey, number>>;
  frame: number;
  // 경기 강조 모드 (씬3)
  highlight?: RegionKey;
}> = ({ litRegions = {}, frame, highlight }) => {
  const { fps } = useVideoConfig();

  return (
    <svg
      viewBox="0 0 400 520"
      style={{ width: 560, height: 728, overflow: "visible" }}
    >
      {/* 실루엣 */}
      <path
        d={LAND_PATH}
        fill="rgba(45,212,191,0.08)"
        stroke="rgba(169,180,208,0.45)"
        strokeWidth={2.5}
      />

      {Object.entries(REGIONS).map(([key, r]) => {
        const k = key as RegionKey;
        const litAt = litRegions[k];
        const isLit = litAt !== undefined && frame >= litAt;
        const isHi = highlight === k;

        // 점등 애니메이션 (펄스)
        let scale = 0;
        let glow = 0;
        if (litAt !== undefined) {
          const s = spring({
            frame: frame - litAt,
            fps,
            config: { damping: 12, stiffness: 200 },
          });
          scale = s;
          // 점등 직후 반짝이는 펄스
          const pulse = interpolate(
            frame - litAt,
            [0, 6, 18],
            [0, 1, 0.45],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          glow = pulse;
        }

        const dimmed = highlight && !isHi;
        const baseColor = isHi ? COLORS.gold : COLORS.mint;
        const dotR = isHi ? 13 : 8;

        return (
          <g
            key={key}
            opacity={dimmed ? 0.22 : 1}
            style={{ transition: "opacity 0.3s" }}
          >
            {isLit && (
              <>
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={dotR + 14 * glow + (isHi ? 10 : 0)}
                  fill={baseColor}
                  opacity={0.25 + 0.25 * glow}
                />
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={dotR * scale}
                  fill={baseColor}
                />
                {isHi && (
                  <text
                    x={r.x}
                    y={r.y - 26}
                    textAnchor="middle"
                    fill={COLORS.gold}
                    fontSize={34}
                    fontWeight={900}
                    fontFamily="Pretendard, sans-serif"
                  >
                    경기 ★
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};
