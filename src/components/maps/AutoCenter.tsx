import { useEffect } from "react";
import { useMap } from "react-leaflet";

function AutoCenter({
  lat,
  lng,
  zoom = 17,
  skipZero = true,
}: {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
  skipZero?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const isNum = (v: any) => typeof v === "number" && Number.isFinite(v);
    const bothZero = isNum(lat) && isNum(lng) && lat === 0 && lng === 0;

    if (!isNum(lat) || !isNum(lng)) return;
    if (skipZero && bothZero) return;

    requestAnimationFrame(() => {
      map.invalidateSize();
      map.flyTo([lat as number, lng as number], Math.max(map.getZoom(), zoom));
    });
  }, [lat, lng, zoom, skipZero, map]);

  return null;
}

export default AutoCenter;
