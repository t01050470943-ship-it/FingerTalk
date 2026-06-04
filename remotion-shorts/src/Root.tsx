import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { FPS } from "./theme";

// 영상 기본 사양 (설계도 §2)
// 1080×1920 세로, 30fps, 761프레임 (≈25.35초)
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={761}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
