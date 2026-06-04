import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { useFonts } from "./load-fonts";
import { COLORS } from "./theme";
import { SceneFade } from "./components";
import { Scene1Hook } from "./scenes/Scene1_Hook";
import { Scene2Election } from "./scenes/Scene2_Election";
import { Scene3Gyeonggi } from "./scenes/Scene3_Gyeonggi";
import { Scene4Regions } from "./scenes/Scene4_Regions";
import { Scene5Impact } from "./scenes/Scene5_Impact";
import { Scene6CTA } from "./scenes/Scene6_CTA";

// 음성 분석 기반 마스터 타임라인 (설계도 §5)
const SCENES = [
  { from: 0, durationInFrames: 110, Comp: Scene1Hook }, // 후킹
  { from: 110, durationInFrames: 132, Comp: Scene2Election }, // 선거 교체
  { from: 242, durationInFrames: 116, Comp: Scene3Gyeonggi }, // 경기 강조
  { from: 358, durationInFrames: 153, Comp: Scene4Regions }, // 지역 나열
  { from: 511, durationInFrames: 148, Comp: Scene5Impact }, // 정책·면접
  { from: 659, durationInFrames: 102, Comp: Scene6CTA }, // CTA
] as const;

export const Main: React.FC = () => {
  useFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* 나레이션: 0프레임부터. 영상의 기준 시계 */}
      <Audio src={staticFile("narration.wav")} />

      {SCENES.map(({ from, durationInFrames, Comp }, i) => {
        const isLast = i === SCENES.length - 1;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={durationInFrames}
            name={`Scene${i + 1}`}
          >
            {/* 마지막 씬(CTA)은 끝까지 고정 — 페이드아웃 없음 */}
            <SceneFade
              durationInFrames={durationInFrames}
              fadeOut={isLast ? 0 : 8}
            >
              <Comp />
            </SceneFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
