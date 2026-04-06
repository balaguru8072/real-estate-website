"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Load react-leaflet components only on client side
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const useMapModule = () =>
  import("react-leaflet").then((mod) => ({ useMap: mod.useMap }));

function ChangeMapViewInner({ coordinates, useMap }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      map.setView([coordinates.lat, coordinates.lng], 13);
    }
  }, [coordinates, map]);

  return null;
}

function ChangeMapView({ coordinates }) {
  const [useMap, setUseMap] = useState(null);

  useEffect(() => {
    useMapModule().then((mod) => {
      setUseMap(() => mod.useMap);
    });
  }, []);

  if (!useMap) return null;

  return <ChangeMapViewInner coordinates={coordinates} useMap={useMap} />;
}

function MapSection({ coordinates, listings }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Load leaflet only in browser
    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;

      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    };

    loadLeaflet();
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[80vh] w-full rounded-[10px] bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  const defaultCenter = [11.0168, 76.9558];

  const selectedCenter =
    coordinates?.lat && coordinates?.lng
      ? [coordinates.lat, coordinates.lng]
      : defaultCenter;

  return (
    <MapContainer
      center={selectedCenter}
      zoom={5}
      style={{ height: "80vh", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeMapView coordinates={coordinates} />

      {coordinates?.lat && coordinates?.lng && (
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}

      {listings?.map((item, index) => {
        if (!item.coordinates) return null;

        const [lat, lng] = item.coordinates.split(",");

        if (!lat || !lng) return null;

        return (
          <Marker key={index} position={[parseFloat(lat), parseFloat(lng)]}>
            <Popup>
              <div>
                <h2 className="font-bold">${item.price}</h2>
                <p>{item.address}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapSection;