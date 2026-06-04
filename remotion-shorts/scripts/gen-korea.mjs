// world-atlas(10m) 의 실제 국경 폴리곤에서 대한민국 외곽선을 추출하고,
// geoMercator 투영으로 SVG path 와 지역 좌표(점)를 생성한다.
// 결과는 src/korea-geo.ts 로 저장 → 런타임에 d3 의존성 없이 사용.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { geoMercator, geoPath, geoArea } from "d3-geo";
import { feature } from "topojson-client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const topo = JSON.parse(
  fs.readFileSync(path.join(root, "node_modules/world-atlas/countries-10m.json"), "utf8")
);

const countries = feature(topo, topo.objects.countries);
// 대한민국 ISO numeric code = 410
const korea = countries.features.find((f) => f.id === "410");
if (!korea) throw new Error("South Korea (410) not found");

// 작은 섬(스펙) 제거: 면적 기준 상위 폴리곤만 유지 → 본토 + 제주 등 주요 섬만 남김.
const polys =
  korea.geometry.type === "MultiPolygon"
    ? korea.geometry.coordinates
    : [korea.geometry.coordinates];

const areas = polys.map((coords) => geoArea({ type: "Polygon", coordinates: coords }));
const maxArea = Math.max(...areas);
// 본토 면적 대비 0.15% 이상인 폴리곤만 유지 (제주는 유지, 자잘한 섬은 제거)
const kept = polys.filter((_, i) => areas[i] / maxArea >= 0.0015);
console.log(`polygons: ${polys.length} → kept ${kept.length}`);

korea.geometry = { type: "MultiPolygon", coordinates: kept };

// viewBox 와 패딩
const W = 420;
const H = 560;
const PAD = 24;

const projection = geoMercator().fitExtent(
  [
    [PAD, PAD],
    [W - PAD, H - PAD],
  ],
  korea
);

const pathGen = geoPath(projection);
const d = pathGen(korea);

// 지역 대표 좌표 (경도, 위도) → 투영 좌표
const REGIONS_LL = {
  gyeonggi: { ll: [127.05, 37.35], label: "경기" },
  chungnam: { ll: [126.8, 36.62], label: "충남" },
  sejong: { ll: [127.29, 36.56], label: "세종" },
  daejeon: { ll: [127.38, 36.35], label: "대전" },
  jeonbuk: { ll: [127.13, 35.78], label: "전북" },
  gyeongnam: { ll: [128.4, 35.33], label: "경남" },
  ulsan: { ll: [129.27, 35.55], label: "울산" },
};

const regions = {};
for (const [key, { ll, label }] of Object.entries(REGIONS_LL)) {
  const [x, y] = projection(ll);
  regions[key] = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, label };
}

const out = `// 이 파일은 scripts/gen-korea.mjs 로 자동 생성됩니다. 직접 수정하지 마세요.
// world-atlas(10m) 실제 국경 데이터 → geoMercator 투영 결과.

export const KOREA_VIEWBOX = { width: ${W}, height: ${H} } as const;

export type RegionKey =
  | "gyeonggi"
  | "sejong"
  | "daejeon"
  | "chungnam"
  | "jeonbuk"
  | "gyeongnam"
  | "ulsan";

export const KOREA_PATH = ${JSON.stringify(d)};

export const REGIONS: Record<RegionKey, { x: number; y: number; label: string }> = ${JSON.stringify(
  regions,
  null,
  2
)};
`;

fs.writeFileSync(path.join(root, "src/korea-geo.ts"), out);
console.log("Wrote src/korea-geo.ts");
console.log("viewBox", W, H);
console.log("path length", d.length);
console.log("regions", regions);
