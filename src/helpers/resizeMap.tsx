import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapShow = ({ active }: { active: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(t);
  }, [active, map]);

  useEffect(() => {
    const onLoad = () => map.invalidateSize();
    map.on("load", onLoad);
    return () => {
      map.off("load", onLoad);
    };
  }, [map]);

  return null;
};

export default MapShow;
