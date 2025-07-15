"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { Download } from "lucide-react";
import { FiAlertTriangle } from "react-icons/fi";
import ReactDOMServer from "react-dom/server";

interface MicrothermorData {
  id: number;
  lat: string;
  long: string;
  Fo: string;
  Ao: string;
  Tdom: string;
  Kg: string;
}

interface RawMicrothermorData {
  id: number;
  lat: string;
  long: string;
  Fo?: string;
  FO?: string;
  Ao?: string;
  AO?: string;
  Tdom?: string;
  TDOM?: string;
  Kg?: string;
  KG?: string;
}

interface StoredMicrothermorData {
  data: RawMicrothermorData[];
}

const getColorByTdom = (tdom: string) => {
  const tdomValue = parseFloat(tdom);
  if (tdomValue >= 5.0) return "#e63946";
  if (tdomValue >= 2.5) return "#f4a261";
  return "#2a9d8f";
};

const getMarkerIcon = (tdom: string) =>
  L.divIcon({
    html: ReactDOMServer.renderToStaticMarkup(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
        }}
      >
        <FiAlertTriangle size={20} color={getColorByTdom(tdom)} />
      </div>
    ),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: "custom-icon border-none",
  });

const Legend = () => {
  return (
    <div className="absolute bottom-11 left-10 z-[1001] bg-white p-3 rounded-lg shadow text-sm ">
      <div className="font-semibold">Legenda TDOM</div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#e63946" }}
        ></span>
        ≥ 5.0 Risiko Tinggi
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#f4a261" }}
        ></span>
        2.5 - 4.9 Risiko Sedang
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#2a9d8f" }}
        ></span>
        &lt; 2.5 Risiko Rendah
      </div>
    </div>
  );
};

export default function PetaRawanGempa() {
  const [microthermorData, setMicrothermorData] = useState<MicrothermorData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("filteredMicrothermorData");

    if (storedData) {
      try {
        const parsed: StoredMicrothermorData = JSON.parse(storedData);
        const rawData = parsed.data || [];

        const mapped = rawData.map((item: RawMicrothermorData) => ({
          id: item.id,
          lat: item.lat,
          long: item.long,
          Fo: item.Fo ?? item.FO ?? "",
          Ao: item.Ao ?? item.AO ?? "",
          Tdom: item.Tdom ?? item.TDOM ?? "",
          Kg: item.Kg ?? item.KG ?? "",
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

  const handleDownload = async () => {
    if (typeof window === "undefined") return;
    if (mapRef.current === null) return;
    const domModule = await import("dom-to-image-more");
    const domtoimage = domModule.default;
    domtoimage
      .toPng(mapRef.current)
      .then((dataUrl: string) => {
        const link = document.createElement("a");
        link.download = "map-gempa.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error: Error) => {
        console.error("❌ Error generating image:", error);
      });
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] mt-4 px-4">
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg">
        <MapContainer
          center={[-3.9, 102.4]}
          zoom={8}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          {!loading &&
            microthermorData.map((data) => {
              const lat = parseFloat(data.lat);
              const lng = parseFloat(data.long);

              if (isNaN(lat) || isNaN(lng) || isNaN(parseFloat(data.Tdom)))
                return null;

              const buffer = 0.01;
              const polygonCoords: L.LatLngExpression[] = [
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
      <div className="relative mt-4">
        <Legend />
      </div>
      {/* Tombol Download */}
      <div className="absolute bottom-11 right-11 z-[1001] border-none">
        <button
          onClick={handleDownload}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <Download className="w-6 h-6 text-green-600" />
        </button>
      </div>
    </div>
  );
}
