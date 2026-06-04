// 디자인 가이드(설계도 §6) 기반 공통 토큰

export const COLORS = {
  bg: "#0F1B3D", // 딥 네이비 (신뢰·차분)
  bgDeep: "#0A1330", // 그라데이션 하단용
  text: "#FFFFFF", // 기본 텍스트
  gold: "#FFB800", // 포인트 (경기 강조·CTA)
  mint: "#2DD4BF", // 보조 강조
  gray: "#A9B4D0", // 흐린 텍스트/비활성
} as const;

export const FONT = '"Pretendard", "Noto Sans KR", system-ui, sans-serif';

// 쇼츠 안전 영역 (1080×1920): 상단 200px, 하단 270px 비움
export const SAFE = {
  top: 200,
  bottom: 270,
} as const;

export const FPS = 30;
