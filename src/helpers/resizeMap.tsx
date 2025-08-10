import { useEffect } from "react";
import { useMap } from "react-leaflet";

function ResizeOnShow() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default ResizeOnShow;
