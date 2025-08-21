import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { type ReactNode } from "react";
import ResizeOnShow from "../../helpers/resizeMap";

interface Props {
  children: ReactNode;
}

const MapView = ({ children }: Props) => {
  const center: [number, number] = [-0.31342440920484194, 119.77449826624365];

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "600px", width: "100%" }}
      className="z-0"
      scrollWheelZoom
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Open Street">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satelit Map">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <ResizeOnShow />

      {children}
    </MapContainer>
  );
};

export default MapView;
