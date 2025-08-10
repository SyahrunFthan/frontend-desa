import proj4 from "proj4";
import { coordEach } from "@turf/meta";
import { feature as turfFeature } from "@turf/helpers";

/** Ubah input GeoJSON ke FeatureCollection WGS84 (lon/lat) */
export function toWgs84FeatureCollection(
  input: any,
  fromCrs = "EPSG:32750" // default UTM Zone 50S (Sulawesi ~119.7E)
) {
  if (!input || !input.type) throw new Error("Invalid GeoJSON");

  // 1) Pastikan bentuknya FeatureCollection (wrap kalau perlu)
  let fc: GeoJSON.FeatureCollection;
  if (input.type === "FeatureCollection") {
    // deep clone agar aman saat mutasi
    fc = JSON.parse(JSON.stringify(input));
  } else if (input.type === "Feature") {
    fc = {
      type: "FeatureCollection",
      features: [JSON.parse(JSON.stringify(input))],
    };
  } else {
    // Geometry / GeometryCollection → bungkus ke Feature
    fc = { type: "FeatureCollection", features: [turfFeature(input as any)] };
  }

  // 2) Reproject semua koordinat IN-PLACE ke EPSG:4326
  // proj4 biasanya sudah tahu 4326; untuk 32750 juga dikenal luas.
  coordEach(
    fc as any,
    (coord) => {
      const [x, y] = coord as [number, number];
      const [lon, lat] = proj4(fromCrs, "EPSG:4326", [x, y]);
      coord[0] = lon;
      coord[1] = lat;
    },
    true // include wrap coord
  );

  return fc;
}
