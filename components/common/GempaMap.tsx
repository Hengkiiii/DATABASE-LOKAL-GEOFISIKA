"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Compass, Download } from "lucide-react";
import { getEarthquakeAll } from "@/lib/api/earthquake/earthquake-get-all/router";

type Gempa = {
  id: number;
  tanggal: string;
  waktu: string;
  mmi: string;
  deskripsi: string;
  kedalaman: number;
  latitude: number;
  longitude: number;
  magnitude: number;
  observer_name: string;
};

type RawEarthquakeData = {
  id?: number;
  dateTime?: string;
  date_time?: string;
  date?: string;
  time?: string;
  mmi?: string | null;
  deskripsi?: string;
  keterangan?: string;
  description?: string;
  kedalaman?: number;
  depth?: number;
  latitude?: number | string;
  lintang?: number | string;
  longitude?: number | string;
  bujur?: number | string;
  magnitude?: number;
  magnitudo?: number;
  observer_name?: string;
  observer?: string;
};

export default function Page() {
  const [dataGempa, setDataGempa] = useState<Gempa[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const mapGempaData = (raw: RawEarthquakeData[]): Gempa[] => {
    return raw.map((item) => {
      const rawDateTime =
        item.dateTime ||
        item.date_time ||
        `${item.date || ""} ${item.time || ""}`;
      const [tanggal, waktu] = rawDateTime.split(/T|\s|\+/);

      return {
        id: item.id || Date.now() + Math.random(),
        tanggal: tanggal || "-",
        waktu: (waktu || "-").replace(/\.\d+/, ""),
        mmi: item.mmi || "-",
        deskripsi: item.deskripsi || item.keterangan || item.description || "-",
        kedalaman: item.kedalaman || item.depth || 0,
        latitude: parseFloat(String(item.latitude || item.lintang || "0")),
        longitude: parseFloat(String(item.longitude || item.bujur || "0")),
        magnitude: item.magnitude || item.magnitudo || 0,
        observer_name: item.observer_name || item.observer || "-",
      };
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedData = sessionStorage.getItem("filteredGempaData");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as RawEarthquakeData[];
        if (Array.isArray(parsed)) {
          const mapped = mapGempaData(parsed);
          setDataGempa(mapped);
          return;
        }
      } catch (err) {
        console.error("❌ Error parsing sessionStorage:", err);
      }
    }

    getEarthquakeAll()
      .then((data: RawEarthquakeData[]) => {
        const mapped = mapGempaData(data);
        setDataGempa(mapped);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("filteredGempaData", JSON.stringify(mapped));
        }
      })
      .catch((err: Error) => {
        console.error("❌ Error fetching from API:", err);
      });
  }, []);

  const filteredGempa = dataGempa.filter((gempa) => {
    if (filter === "ALL") return true;
    if (filter === "UTARA") return gempa.latitude < -2;
    if (filter === "SELATAN") return gempa.latitude > -2;
    if (filter === "TIMUR") return gempa.longitude > 108;
    if (filter === "BARAT") return gempa.longitude < 102;
    return true;
  });

  const sortedGempa = [...filteredGempa].sort((a, b) => {
    const dateA = new Date(`${a.tanggal}T${a.waktu}`);
    const dateB = new Date(`${b.tanggal}T${b.waktu}`);
    return dateB.getTime() - dateA.getTime();
  });

  const gempaTerakhir = sortedGempa[0];

  function getDepthClass(depth: number): string {
    if (depth <= 50) return "marker-depth-1";
    if (depth <= 100) return "marker-depth-2";
    if (depth <= 250) return "marker-depth-3";
    if (depth <= 600) return "marker-depth-4";
    return "marker-depth-5";
  }

  function createCustomIcon(magnitude: number, depth: number): L.DivIcon {
    const size = Math.max(12, magnitude * 3);
    const depthClass = getDepthClass(depth);

    return L.divIcon({
      html: `
        <div class="marker-custom" style="width: ${size}px; height: ${size}px;">
          <span class="marker-core ${depthClass}" style="width: ${size}px; height: ${size}px;"></span>
        </div>
      `,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function createStarIcon(size: number): L.DivIcon {
    return L.divIcon({
      html: `
        <div class="marker-star-container" style="width: ${size}px; height: ${size}px;">
          <span class="marker-ring" style="width: ${size}px; height: ${size}px;"></span>
          <div class="marker-star pulse-animate" style="width: ${size}px; height: ${size}px;">★</div>
        </div>
      `,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function createBoxIcon(size: number): L.DivIcon {
    return L.divIcon({
      html: `
        <div class="marker-box-container" style="width: ${size}px; height: ${size}px;">
          <span class="marker-ring" style="width: ${size}px; height: ${size}px;"></span>
          <div class="marker-box pulse-animate" style="width: ${size}px; height: ${size}px;">■</div>
        </div>
      `,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

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
    <div className="w-full h-[calc(100vh-120px)] mt-4 px-4 relative">
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg">
        <MapContainer
          center={[-3.8, 102.2655]}
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            crossOrigin="anonymous"
          />
          {filteredGempa.map((gempa) => {
            const isGempaTerakhir = gempa.id === gempaTerakhir?.id;

            const size = Math.max(16, gempa.magnitude * 5);
            const mmiRoman = gempa.mmi.toUpperCase().trim();
            const mmiThreshold = [
              "III",
              "IV",
              "V",
              "VI",
              "VII",
              "VIII",
              "IX",
              "X",
            ];

            let icon;

            if (isGempaTerakhir) {
              if (mmiThreshold.includes(mmiRoman)) {
                icon = createStarIcon(size);
              } else if (mmiRoman !== "-") {
                icon = createBoxIcon(size);
              } else {
                icon = createCustomIcon(gempa.magnitude, gempa.kedalaman);
              }
            } else {
              icon = createCustomIcon(gempa.magnitude, gempa.kedalaman);
            }

            return (
              <Marker
                key={gempa.id}
                position={[gempa.latitude, gempa.longitude]}
                icon={icon}
              >
                <Popup>
                  <div>
                    <strong>{gempa.deskripsi}</strong>
                    <br />
                    Tanggal: {gempa.tanggal} {gempa.waktu}
                    <br />
                    Magnitude: {gempa.magnitude}
                    <br />
                    Kedalaman: {gempa.kedalaman} m
                    <br />
                    MMI: {gempa.mmi}
                    <br />
                    Observer: {gempa.observer_name}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Tombol Kompas */}
      <div className="absolute bottom-4 right-20 z-[1001]">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <Compass className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* Tombol Download */}
      <div className="absolute bottom-4 right-4 z-[1001]">
        <button
          onClick={handleDownload}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <Download className="w-6 h-6 text-green-600" />
        </button>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 left-6 bg-white/90 p-3 rounded shadow-md text-sm z-[1001]">
        <div className="font-bold text-center mb-1">::Legenda::</div>
        <hr className="mb-2" />
        <div className="mb-2">
          <div className="font-medium">Magnitudo:</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((mag) => (
              <div key={mag} className="flex flex-col items-center">
                <div
                  className="bg-gray-400 rounded-full"
                  style={{
                    width: 5 * mag,
                    height: 5 * mag,
                    minWidth: 16,
                    minHeight: 16,
                  }}
                />
                <span className="text-xs mt-1">{mag}</span>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <div
                className="bg-gray-400 rounded-full"
                style={{ width: 50, height: 50 }}
              />
              <span className="text-xs mt-1">8+</span>
            </div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Kedalaman (Km):</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600" /> ≤50
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-400" /> ≤100
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-400" /> ≤250
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600" /> ≤600
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-600" /> &gt;600
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dropdown */}
      {showFilter && (
        <div className="absolute bottom-16 right-4 bg-white rounded shadow p-2">
          {["ALL", "UTARA", "SELATAN", "TIMUR", "BARAT"].map((dir) => (
            <button
              key={dir}
              onClick={() => {
                setFilter(dir);
                setShowFilter(false);
              }}
              className={`block px-4 py-2 hover:bg-blue-100 w-full text-left ${
                filter === dir ? "font-bold" : ""
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
