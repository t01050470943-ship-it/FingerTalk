# 특수교육 임용 안내 쇼츠 (Remotion)

> "응시 지역 교육감 공약을 확인하라"는 메시지를 담은 30초 내외 세로형(쇼츠) 정보 영상.
> 설계도 문서(`특수교육 임용 안내 Remotion 스크립트`)를 그대로 코드로 옮긴 Remotion 프로젝트입니다.

## 영상 사양

| 항목 | 값 |
|---|---|
| 해상도 | 1080 × 1920 (세로 9:16) |
| 프레임레이트 | 30 fps |
| 길이 | 761 프레임 = 25.35초 (음성 길이에 맞춤) |
| 나레이션 | `public/narration.wav` (44.1kHz / 모노) — 0프레임부터 삽입 |
| 폰트 | Pretendard (woff2, `public/fonts`에 로컬 번들) |

## 씬 구성 (음성 분석 기반 타임코드)

| 씬 | 프레임 | 내용 | 파일 |
|---|---|---|---|
| 1 | 0–110 | 후킹 "필독!" | `src/scenes/Scene1_Hook.tsx` |
| 2 | 110–242 | 6·3 지방선거 → 교육감 교체 (지도 점등) | `src/scenes/Scene2_Election.tsx` |
| 3 | 242–358 | 경기 강조 ⭐ (임태희 → 안민석) | `src/scenes/Scene3_Gyeonggi.tsx` |
| 4 | 358–511 | 바뀐 지역 나열 (세종·대전·충남·경남·전북·울산) | `src/scenes/Scene4_Regions.tsx` |
| 5 | 511–659 | 정책·TO·면접 다 바뀐다 (체크 3종) | `src/scenes/Scene5_Impact.tsx` |
| 6 | 659–761 | CTA "교육감 공약 확인!" | `src/scenes/Scene6_CTA.tsx` |

## 사용법

```bash
npm install          # 의존성 설치
npm run studio       # 브라우저 미리보기/편집 (Remotion Studio)
npm run render       # out/sped-shorts.mp4 로 MP4 렌더
```

스틸(특정 프레임 PNG) 추출:

```bash
npx remotion still Main out/frame.png --frame=305
```

## 디자인 토큰 (`src/theme.ts`)

| 용도 | HEX |
|---|---|
| 배경 (딥 네이비) | `#0F1B3D` |
| 기본 텍스트 | `#FFFFFF` |
| 포인트 (경기·CTA) | `#FFB800` |
| 보조 강조 | `#2DD4BF` |
| 흐린 텍스트 | `#A9B4D0` |

안전 영역: 상단 200px / 하단 270px 비움 (쇼츠 UI 가림 방지).

## 커스터마이즈 메모

- **채널 핸들**: 씬6의 `@특수교육_임용_길잡이`는 임시값입니다. `src/scenes/Scene6_CTA.tsx`에서 실제 채널명으로 교체하세요.
- **지도**: 정밀 지도가 아닌 단순 실루엣 + 점 표시(`src/KoreaMap.tsx`). 점 위치/실루엣은 자유롭게 조정 가능.
- **BGM**: 선택사항. 추가하려면 `public/`에 곡을 넣고 `src/Main.tsx`에 `<Audio src={staticFile("bgm.mp3")} volume={0.12} />` 한 줄을 추가하세요(나레이션보다 작게).
- **정치적 중립**: 특정 후보 지지/비판 표현 없이 "직접 확인" 안내만 담았습니다.
