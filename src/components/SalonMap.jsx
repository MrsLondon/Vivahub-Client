import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in react-leaflet
// This is needed because the default marker icons are not properly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const SalonMap = ({ salon, theme }) => {
  // If salon has no coordinates, show a message
  if (!salon.coordinates || !salon.coordinates.lat || !salon.coordinates.lng) {
    return (
      <div className={`rounded-lg p-4 mb-6 text-center ${
        theme === "light" ? "bg-gray-100" : "bg-gray-700"
      }`}>
        <p>Map location not available for this salon</p>
      </div>
    );
  }

  const position = [salon.coordinates.lat, salon.coordinates.lng];

  return (
    <div className="mb-6">
      <h3 className={`text-xl font-medium mb-2 ${
        theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
      }`}>
        Location
      </h3>
      <div className="rounded-lg overflow-hidden" style={{ height: '300px' }}>
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div>
                <strong>{salon.name}</strong><br />
                {salon.location}<br />
                {salon.phone}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default SalonMap;
