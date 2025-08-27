import { area as turfArea } from "@turf/turf";
import { coordEach, flattenEach } from "@turf/meta";

function isLonLat(geojson: any): boolean {
  let ok = true;
  let checked = 0;
  coordEach(
    geojson,
    (coord) => {
      const [x, y] = coord as [number, number];
      if (Math.abs(x) > 180 || Math.abs(y) > 90) ok = false;
      checked++;
      if (checked > 2000) return false;
    },
    false
  );
  return ok;
}

type Ring = [number, number][];

function ensureClosed(r: Ring): Ring {
  const n = r.length;
  if (n < 2) return r;
  const [x0, y0] = r[0];
  const [xN, yN] = r[n - 1];
  if (x0 === xN && y0 === yN) return r;
  return [...r, r[0]];
}

function ringAreaPlanar(r: Ring): number {
  const ring = ensureClosed(r);
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return 0.5 * a;
}

function polygonAreaPlanarM2(coords: Ring[]): number {
  if (!coords || !coords.length) return 0;
  const outer = Math.abs(ringAreaPlanar(coords[0]));
  const holes = coords
    .slice(1)
    .reduce((s, hole) => s + Math.abs(ringAreaPlanar(hole)), 0);
  return Math.max(0, outer - holes);
}

export function geojsonAreaKm2(geojson: any): number {
  if (!geojson) return 0;
  if (isLonLat(geojson)) {
    return turfArea(geojson) / 1_000_000;
  }
  let totalM2 = 0;
  flattenEach(geojson, (feature) => {
    const geom = feature.geometry;
    if (!geom) return;
    if (geom.type === "Polygon") {
      totalM2 += polygonAreaPlanarM2(geom.coordinates as Ring[]);
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates as Ring[][]) {
        totalM2 += polygonAreaPlanarM2(poly);
      }
    }
  });
  return totalM2 / 1_000_000;
}
