import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components";
import { COLORS } from "../theme";

// 씬1 후킹 (0.00–3.67s / 110프레임)
// "특수교육 임용 준비하시죠? 이건 꼭 확인하세요."
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 메인 자막: 아래에서 위로 슬라이드 + 페이드인
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const y = interpolate(enter, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // "필독!" : 0.5초(15f) 뒤 pop 등장
  const popStart = 15;
  const pop = spring({
    frame: frame - popStart,
    fps,
    config: { damping: 10, stiffness: 220 },
  });
  const popScale = interpolate(pop, [0, 1], [0.3, 1]);

  // 골드 언더바: 필독! 등장 직후 좌→우로 그려짐
  const barProgress = interpolate(frame - (popStart + 6), [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div style={{ transform: `translateY(${y}px)`, opacity }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.3,
            letterSpacing: -1,
          }}
        >
          특수교육 임용
          <br />
          준비생이라면
        </div>
      </div>

      <div
        style={{
          marginTop: 64,
          transform: `scale(${popScale})`,
          opacity: pop,
        }}
      >
        <div
          style={{
            fontSize: 184,
            fontWeight: 900,
            color: COLORS.gold,
            letterSpacing: 4,
            textShadow: "0 0 40px rgba(255,184,0,0.45)",
          }}
        >
          필독!
        </div>
        {/* 골드 언더바 */}
        <div
          style={{
            height: 12,
            width: `${barProgress * 60}%`,
            margin: "18px auto 0",
            borderRadius: 999,
            background: COLORS.gold,
            boxShadow: "0 0 24px rgba(255,184,0,0.5)",
          }}
        />
      </div>
    </Stage>
  );
};
