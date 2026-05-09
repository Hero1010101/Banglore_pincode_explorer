import React, { useEffect, useRef } from "react";

const MapView = ({ result }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (!result) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Custom marker icon
      const customIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width: 36px; height: 36px;
            background: #FF4D00;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 15px rgba(255,77,0,0.5);
          "></div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      });

      const { lat, lng } = result.coordinates;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true,
        }).setView([lat, lng], 14);

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          }
        ).addTo(mapInstanceRef.current);
      } else {
        // Clear old layers
        layersRef.current.forEach((l) => mapInstanceRef.current.removeLayer(l));
        layersRef.current = [];
        mapInstanceRef.current.setView([lat, lng], 14);
      }

      const map = mapInstanceRef.current;

      // Add marker
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `
          <div style="font-family: 'DM Sans', sans-serif; padding: 4px;">
            <div style="font-weight: 700; font-size: 16px; color: #0a0a0a; margin-bottom: 4px;">${result.area}</div>
            <div style="color: #666; font-size: 13px;">📍 Pincode: <strong>${result.pincode}</strong></div>
            <div style="color: #666; font-size: 13px;">🏙️ ${result.district}</div>
            ${result.zone ? `<div style="margin-top: 6px; display: inline-block; background: #fff1eb; color: #ff4d00; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">${result.zone} Zone</div>` : ""}
          </div>
        `,
          { maxWidth: 250 }
        )
        .openPopup();

      layersRef.current.push(marker);

      if (result.boundaryApprox && result.boundaryApprox.length > 0) {
        const polygon = L.polygon(result.boundaryApprox, {
          color: "#FF4D00",
          weight: 2.5,
          opacity: 0.9,
          fillColor: "#FF4D00",
          fillOpacity: 0.12,
          dashArray: "6, 4",
        }).addTo(map);

        layersRef.current.push(polygon);

        try {
          map.fitBounds(polygon.getBounds(), { padding: [40, 40] });
        } catch (e) {
          map.setView([lat, lng], 14);
        }
      }

      // Add circle as fallback visual
      if (!result.boundaryApprox) {
        const circle = L.circle([lat, lng], {
          color: "#FF4D00",
          fillColor: "#FF4D00",
          fillOpacity: 0.08,
          weight: 2,
          radius: 1200,
        }).addTo(map);
        layersRef.current.push(circle);
      }
    };

    initMap();
  }, [result]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!result) return null;

  return (
    <div className="map-container animate-fade-in">
      <div ref={mapRef} className="leaflet-map" />
      <style>{`
        .map-container {
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-200);
          background: var(--gray-100);
        }

        .leaflet-map {
          height: 420px;
          width: 100%;
        }

        @media (max-width: 600px) {
          .leaflet-map {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default MapView;
