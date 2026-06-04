import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Pretendard 웹폰트(woff2)를 로컬(public/fonts)에서 로드한다.
// 네트워크/CDN에 의존하지 않으므로 렌더 환경에서도 안정적으로 동작한다.
// 컴포넌트 스코프에서 delayRender 를 호출해, 폰트 로드가 끝날 때까지
// 렌더를 지연시킨다(첫 프레임부터 올바른 폰트로 그려지도록 보장).
const WEIGHTS: { weight: string; file: string }[] = [
  { weight: "500", file: "Pretendard-Medium.woff2" },
  { weight: "700", file: "Pretendard-Bold.woff2" },
  { weight: "800", file: "Pretendard-ExtraBold.woff2" },
  { weight: "900", file: "Pretendard-Black.woff2" },
];

export const useFonts = (): boolean => {
  const [handle] = useState(() => delayRender("Loading Pretendard font"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      WEIGHTS.map(({ weight, file }) => {
        const font = new FontFace(
          "Pretendard",
          `url(${staticFile("fonts/" + file)}) format("woff2")`,
          { weight, style: "normal", display: "swap" }
        );
        return font.load().then((f) => {
          document.fonts.add(f);
        });
      })
    )
      .then(() => {
        if (!cancelled) {
          setReady(true);
          continueRender(handle);
        }
      })
      .catch((err) => {
        cancelRender(err);
      });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  return ready;
};
