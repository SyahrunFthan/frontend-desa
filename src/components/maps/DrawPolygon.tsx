import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { area as turfArea } from "@turf/turf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw.js";

(L as any).GeometryUtil.readableArea = function (
  area: number,
  isMetric = true
) {
  const m2 = Math.abs(area || 0);
  if (isMetric) {
    if (m2 >= 1e6) return (m2 / 1e6).toFixed(2) + " km²";
    if (m2 >= 1e4) return (m2 / 1e4).toFixed(2) + " ha";
    return m2.toFixed(0) + " m²";
  } else {
    const yd2 = m2 * 1.1959900463;
    return yd2.toFixed(0) + " yd²";
  }
};

interface Props {
  onChangeGeoJson: (geoJson: string) => void;
  onChangeArea?: (area: string) => void;
  singleShape?: boolean;
}

const DrawPolygon = ({
  onChangeGeoJson,
  onChangeArea,
  singleShape = true,
}: Props) => {
  const map = useMap();
  const drawItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  const syncOut = () => {
    const featureCollection: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    drawItemsRef.current.eachLayer((layer: any) => {
      if (layer.toGeoJSON)
        featureCollection.features.push(layer.toGeoJSON() as GeoJSON.Feature);
    });
    const totalAreaM2 =
      featureCollection.features.reduce((sum, f) => {
        try {
          return sum + turfArea(f as any);
        } catch {
          return sum;
        }
      }, 0) || 0;

    const totalAreaKm2 = totalAreaM2 / 1_000_000;
    onChangeGeoJson(JSON.stringify(featureCollection));
    onChangeArea?.(`${totalAreaKm2.toFixed(2)} Km2`);
  };

  useEffect(() => {
    map.addLayer(drawItemsRef.current);

    const drawControl = new (L.Control as any).Draw({
      position: "topleft",
      draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: { weight: 2 },
        },
      },
      edit: {
        featureGroup: drawItemsRef.current,
        remove: true,
        edit: { selectedPathOptions: { maintainColor: true } },
      },
    });

    map.addControl(drawControl as any);

    const onCreated = (e: any) => {
      if (singleShape) drawItemsRef.current.clearLayers();
      drawItemsRef.current.addLayer(e.layer);
      syncOut();
    };
    const onEdited = () => syncOut();
    const onDeleted = () => syncOut();

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.off(L.Draw.Event.DELETED, onDeleted);
      map.removeControl(drawControl as any);
      map.removeLayer(drawItemsRef.current);
    };
  }, [map, singleShape, onChangeGeoJson, onChangeArea]);

  return null;
};

export default DrawPolygon;
