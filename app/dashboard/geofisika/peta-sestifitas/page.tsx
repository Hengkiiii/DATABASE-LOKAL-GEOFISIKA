"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { FiAlertTriangle } from "react-icons/fi";
import ReactDOMServer from "react-dom/server";

// Interface data microthermor
interface MicrothermorData {
  id: number;
  lat: string;
  long: string;
  Fo: string;
  Ao: string;
  Tdom: string;
  Kg: string;
}

// Fungsi warna berdasarkan TDOM
const getColorByTdom = (tdom: string) => {
  const tdomValue = parseFloat(tdom);
  if (tdomValue >= 5.0) return "#e63946"; // Merah - risiko tinggi
  if (tdomValue >= 2.5) return "#f4a261"; // Oranye - risiko sedang
  return "#2a9d8f"; // Hijau - risiko rendah
};

// Ikon marker berbasis TDOM
const getMarkerIcon = (tdom: string) =>
  L.divIcon({
    html: ReactDOMServer.renderToStaticMarkup(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px", // ✅ wajib ada
          height: "24px", // ✅ wajib ada
        }}
      >
        <FiAlertTriangle size={20} color={getColorByTdom(tdom)} />
      </div>
    ),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: "custom-icon",
  });

// Komponen legenda peta
const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
      <div style="background: white; padding: 8px; border-radius: 8px; font-size: 13px; box-shadow: 0 0 8px rgba(0,0,0,0.2)">
        <div style="margin-bottom: 6px"><strong>Legenda TDOM</strong></div>
        <div><span style="background:#e63946;width:12px;height:12px;display:inline-block;margin-right:6px;border-radius:2px;"></span> ≥ 5.0 Risiko Tinggi</div>
        <div><span style="background:#f4a261;width:12px;height:12px;display:inline-block;margin-right:6px;border-radius:2px;"></span> 2.5 - 4.9 Risiko Sedang</div>
        <div><span style="background:#2a9d8f;width:12px;height:12px;display:inline-block;margin-right:6px;border-radius:2px;"></span> &lt; 2.5 Risiko Rendah</div>
      </div>
    `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default function PetaRawanGempa() {
  const [microthermorData, setMicrothermorData] = useState<MicrothermorData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("filteredMicrothermorData");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const rawData = parsed.data || [];

        const mapped = rawData.map((item: any) => ({
          id: item.id,
          lat: item.lat,
          long: item.long,
          Fo: item.Fo ?? item.FO,
          Ao: item.Ao ?? item.AO,
          Tdom: item.Tdom ?? item.TDOM,
          Kg: item.Kg ?? item.KG,
        }));

        setMicrothermorData(mapped);
        console.log("✅ Data berhasil diambil dari sessionStorage:", mapped);
      } catch (err) {
        console.error("❌ Gagal parsing data dari sessionStorage:", err);
      }
    } else {
      console.warn("⚠️ Data tidak ditemukan di sessionStorage");
    }

    setLoading(false);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-120px)] mt-4 px-4">
      <MapContainer
        center={[-3.9, 102.4]}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Legend */}
        <Legend />

        {/* Marker dan Polygon */}
        {!loading &&
          microthermorData.map((data) => {
            const lat = parseFloat(data.lat);
            const lng = parseFloat(data.long);

            if (isNaN(lat) || isNaN(lng) || isNaN(parseFloat(data.Tdom)))
              return null;

            const buffer = 0.01;
            const polygonCoords: LatLngTuple[] = [
              [lat - buffer, lng - buffer],
              [lat - buffer, lng + buffer],
              [lat + buffer, lng + buffer],
              [lat + buffer, lng - buffer],
              [lat - buffer, lng - buffer],
            ];

            const risiko =
              parseFloat(data.Tdom) >= 5
                ? "Tinggi"
                : parseFloat(data.Tdom) >= 2.5
                ? "Sedang"
                : "Rendah";

            return (
              <React.Fragment key={`point-${data.id}`}>
                <Polygon
                  positions={polygonCoords}
                  pathOptions={{
                    color: getColorByTdom(data.Tdom),
                    fillColor: getColorByTdom(data.Tdom),
                    fillOpacity: 0.5,
                  }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <h3 className="font-bold">Zona Microthermor</h3>
                      <p>
                        <strong>Lokasi:</strong> {lat}, {lng}
                      </p>
                      <p>
                        <strong>Fo:</strong> {data.Fo} Hz
                      </p>
                      <p>
                        <strong>Ao:</strong> {data.Ao} mm/s
                      </p>
                      <p>
                        <strong>Tdom:</strong> {data.Tdom} s
                      </p>
                      <p>
                        <strong>Kg:</strong> {data.Kg}
                      </p>
                    </div>
                  </Popup>
                </Polygon>

                <Marker
                  position={[lat, lng]}
                  icon={getMarkerIcon(data.Tdom)}
                  zIndexOffset={1000}
                >
                  <Popup>
                    <div className="space-y-1">
                      <h3 className="font-bold">Data Microthermor</h3>
                      <p>
                        <strong>TDOM:</strong> {data.Tdom} s
                      </p>
                      <p>
                        <strong>Risiko:</strong> {risiko}
                      </p>
                    </div>
                  </Popup>
                  <Tooltip direction="top" offset={[0, -10]} permanent>
                    Risiko: {risiko}
                  </Tooltip>
                </Marker>
              </React.Fragment>
            );
          })}
      </MapContainer>
    </div>
  );
}
