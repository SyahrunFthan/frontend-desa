import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

interface Props {
  latitude: number;
  longitude: number;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
}

const DrawControl = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: Props) => {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    if (!map) return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: { icon: new L.Icon.Default() },
      },
      edit: {
        featureGroup: drawnItems,
        remove: false,
      },
    });

    map.addControl(drawControl);

    const onCreated = (event: any) => {
      const { layer, layerType } = event;
      if (layerType === "marker") {
        const latlng = (layer as L.Marker).getLatLng();
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
      }
    };

    const onEdited = (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          const latlng = layer.getLatLng();
          setLatitude(latlng.lat);
          setLongitude(latlng.lng);
        }
      });
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, setLatitude, setLongitude]);

  useEffect(() => {
    if (!map) return;

    const LocateControl = L.Control.extend({
      options: { position: "topleft" as L.ControlPosition },
      onAdd: () => {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        const btn = L.DomUtil.create("a", "", container);
        btn.href = "#";
        btn.title = "Gunakan lokasi perangkat";
        btn.innerHTML = "📍";

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.on(btn, "click", (e: any) => {
          L.DomEvent.preventDefault(e);

          if (!("geolocation" in navigator)) {
            console.warn("Geolocation tidak didukung browser ini.");
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude: lat, longitude: lng } = pos.coords;
              setLatitude(lat);
              setLongitude(lng);

              const targetZoom = Math.max(map.getZoom(), 16);
              map.flyTo([lat, lng], targetZoom);
            },
            (err) => {
              console.error("Gagal mendapatkan lokasi:", err);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 10000,
            }
          );
        });

        return container;
      },
    });

    const locateCtl = new LocateControl();
    map.addControl(locateCtl);

    return () => {
      map.removeControl(locateCtl);
    };
  }, [map, setLatitude, setLongitude]);

  useEffect(() => {
    if (!map) return;
    const drawnItems = drawnItemsRef.current;

    const isNum = (v: any) => typeof v === "number" && Number.isFinite(v);
    const bothZero =
      isNum(latitude) && isNum(longitude) && latitude === 0 && longitude === 0;
    const bothValid = isNum(latitude) && isNum(longitude) && !bothZero;

    drawnItems.clearLayers();

    if (bothValid) {
      const marker = new L.Marker([latitude as number, longitude as number], {
        icon: new L.Icon.Default(),
      });
      drawnItems.addLayer(marker);
    }
  }, [latitude, longitude, map]);

  return null;
};

export default DrawControl;
