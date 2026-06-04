import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pill, Stage } from "../components";
import { COLORS } from "../theme";
import { KoreaMap, RegionKey } from "../KoreaMap";

// 씬2 선거로 교육감 교체 (3.67–8.06s / 110–242, 길이 132f)
// "이번 6.3 지방선거로, 여러 지역 교육감이 새로 바뀌었습니다."
export const Scene2Election: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame, fps, config: { damping: 18 } });
  const titleY = interpolate(titleEnter, [0, 1], [40, 0]);

  // 지역 점들이 순서대로 점등
  const lit: Partial<Record<RegionKey, number>> = {
    gyeonggi: 40,
    chungnam: 52,
    sejong: 62,
    daejeon: 72,
    jeonbuk: 84,
    gyeongnam: 96,
    ulsan: 108,
  };

  return (
    <Stage>
      <div style={{ opacity: titleEnter, transform: `translateY(${titleY}px)` }}>
        <Pill color={COLORS.mint}>6·3 지방선거</Pill>
        <div
          style={{
            marginTop: 28,
            fontSize: 104,
            fontWeight: 900,
            color: COLORS.text,
            letterSpacing: -1,
          }}
        >
          교육감 교체
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <KoreaMap frame={frame} litRegions={lit} />
      </div>
    </Stage>
  );
};
