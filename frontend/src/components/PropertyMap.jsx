import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Create custom colored HTML pin icons to eliminate Leaflet icon asset path errors
const createCustomIcon = (color = '#0284c7', isPulsing = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        ${
          isPulsing
            ? `<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <div style="
          width: 26px;
          height: 26px;
          background: ${color};
          border: 2.5px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const verifiedIcon = createCustomIcon('#10b981'); // Emerald Green for verified properties
const unassessedIcon = createCustomIcon('#ef4444', true); // Red Pulsing for unassessed anomaly
const defaultIcon = createCustomIcon('#0284c7'); // Blue for selected coordinate

// Coordinate click handler for interactive placement
const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({
          lat: parseFloat(e.latlng.lat.toFixed(6)),
          lng: parseFloat(e.latlng.lng.toFixed(6)),
        });
      }
    },
  });
  return null;
};

const PropertyMap = ({
  center = [11.5092, 77.2347], // Sathyamangalam default center
  zoom = 14,
  properties = [],
  unassessedParcels = [],
  selectedCoords = null,
  onLocationSelect = null,
  interactive = false,
  height = '400px',
  onSelectParcel = null,
}) => {
  return (
    <div style={{ height, width: '100%' }} className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={selectedCoords ? [selectedCoords.lat, selectedCoords.lng] : center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {interactive && <LocationPicker onLocationSelect={onLocationSelect} />}

        {/* Selected / Placement Marker */}
        {selectedCoords && (
          <Marker position={[selectedCoords.lat, selectedCoords.lng]} icon={defaultIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <strong className="block text-brand-700">Selected GIS Coordinate</strong>
                <div>Latitude: {selectedCoords.lat}</div>
                <div>Longitude: {selectedCoords.lng}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Verified Registered Properties */}
        {properties.map((prop) => {
          if (!prop.gisCoordinates?.lat || !prop.gisCoordinates?.lng) return null;
          return (
            <Marker
              key={prop._id || prop.propertyIdentifier}
              position={[prop.gisCoordinates.lat, prop.gisCoordinates.lng]}
              icon={verifiedIcon}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1 min-w-[180px]">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{prop.propertyIdentifier}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      {prop.complianceScore?.rating || 'Good'}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <strong>Owner:</strong> {prop.ownerName}
                  </div>
                  <div className="text-slate-600">
                    <strong>Type:</strong> {prop.propertyType} ({prop.builtUpAreaSqFt} sq ft)
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {prop.location?.ward}, {prop.location?.municipality}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Flagged Unassessed Parcels (Novelty Anomaly GIS Feature) */}
        {unassessedParcels.map((parcel) => {
          if (!parcel.gisCoordinates?.lat || !parcel.gisCoordinates?.lng) return null;
          return (
            <Marker
              key={parcel._id || parcel.parcelId}
              position={[parcel.gisCoordinates.lat, parcel.gisCoordinates.lng]}
              icon={unassessedIcon}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1.5 min-w-[210px]">
                  <div className="font-bold text-rose-700 flex items-center justify-between">
                    <span>⚠️ UNASSESSED PARCEL</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-semibold">
                      {parcel.status}
                    </span>
                  </div>
                  <div className="text-slate-800 font-semibold">{parcel.parcelId}</div>
                  <div className="text-slate-600">
                    <strong>Survey No:</strong> {parcel.surveyNumber}
                  </div>
                  <div className="text-slate-600">
                    <strong>Location:</strong> {parcel.locationName}
                  </div>
                  <div className="text-rose-600 font-bold">
                    Est. Tax Loss: ₹{parcel.estimatedAnnualTaxLoss?.toLocaleString()}/yr
                  </div>
                  {onSelectParcel && (
                    <button
                      onClick={() => onSelectParcel(parcel)}
                      className="w-full mt-1 bg-rose-600 hover:bg-rose-700 text-white font-medium py-1 px-2 rounded text-[11px] transition"
                    >
                      Issue Survey Notice
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
