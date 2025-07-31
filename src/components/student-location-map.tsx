import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';

// Fix for default icon issue with Leaflet and Webpack
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const markers = [
  { position: [13.0232, 80.1706] as LatLngExpression, name: "Mugalivakkam", students: 45 },
  { position: [13.0333, 80.1639] as LatLngExpression, name: "Porur", students: 80 },
  { position: [12.82, 80.2234] as LatLngExpression, name: "Siruseri", students: 120 },
  { position: [13.0579, 80.2121] as LatLngExpression, name: "Vadapalani", students: 65 },
  { position: [12.883, 80.229] as LatLngExpression, name: "OMR", students: 250 },
];

export function StudentLocationMap() {
  const chennaiPosition: LatLngExpression = [13.0, 80.2]; // Centered around Chennai

  const displayMap = React.useMemo(
    () => (
      <MapContainer center={chennaiPosition} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={defaultIcon}>
            <Popup>
              <div className="font-bold">{marker.name}</div>
              <p>{marker.students} students</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    ),
    [chennaiPosition]
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {displayMap}
    </div>
  );
}
