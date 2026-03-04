"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing marker icons in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
    position: { lat: number; lng: number } | null;
    onPositionChange: (pos: { lat: number; lng: number }) => void;
}

function LocationPicker({ position, onPositionChange }: MapPickerProps) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], map.getZoom() > 13 ? map.getZoom() : 16, {
                animate: true,
                duration: 1.5,
            });
        }
    }, [position?.lat, position?.lng, map]);

    useMapEvents({
        click(e) {
            onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function MapPicker({ position, onPositionChange }: MapPickerProps) {
    const defaultCenter = { lat: 10.8231, lng: 106.6297 }; // HCMC center

    return (
        <div className="w-full h-full z-0 relative rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
                center={position || defaultCenter}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker position={position} onPositionChange={onPositionChange} />
            </MapContainer>
        </div>
    );
}
