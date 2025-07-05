"use client";
import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import Card from "@/components/common/Card";
import { getEarthquakeAll } from "@/lib/api/earthquake/earthquake-get-all/router";

interface ChartData {
    bulan: string;
    jumlah: number;
}

export default function ChartJumlahGempa() {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tahunDipilih, setTahunDipilih] = useState<number>(
        new Date().getFullYear()
    );
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    const initBulanData = (): ChartData[] => {
        const namaBulan = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Ags",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ];
        return namaBulan.map((bulan) => ({
            bulan,
            jumlah: 0,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const earthquakes = await getEarthquakeAll();

                // Process available years
                const years = new Set<number>();
                earthquakes.forEach((quake) => {
                    try {
                        const date = new Date(`${quake.date_time}`);
                        if (!isNaN(date.getTime())) {
                            // Validate date
                            years.add(date.getFullYear());
                        }
                    } catch {
                        console.warn("Invalid date format:", quake.date_time);
                    }
                });

                const sortedYears = Array.from(years).sort((a, b) => b - a);
                setAvailableYears(sortedYears);

                // Set default year if current selection isn't available
                if (
                    sortedYears.length > 0 &&
                    !sortedYears.includes(tahunDipilih)
                ) {
                    setTahunDipilih(sortedYears[0]);
                }

                // Process earthquake data
                const bulanData = initBulanData();
                earthquakes.forEach((quake) => {
                    try {
                        const date = new Date(`${quake.date_time}`);
                        if (
                            !isNaN(date.getTime()) &&
                            date.getFullYear() === tahunDipilih
                        ) {
                            const monthIndex = date.getMonth();
                            if (monthIndex >= 0 && monthIndex < 12) {
                                bulanData[monthIndex].jumlah += 1;
                            }
                        }
                    } catch {
                        console.warn(
                            "Error processing earthquake data:",
                            quake
                        );
                    }
                });

                setData(bulanData);
                setError(null);
            } catch (err) {
                setError("Gagal memuat data gempa");
                console.error("Error fetching earthquake data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tahunDipilih]);

    if (loading) {
        return (
            <Card style="bg-white p-4 space-y-4">
                <p>Memuat data...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card style="bg-white p-4 space-y-4">
                <p className="text-red-500">{error}</p>
            </Card>
        );
    }

    return (
        <Card style="bg-white p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">
                    Jumlah Gempa per Bulan ({tahunDipilih})
                </h2>
                <select
                    value={tahunDipilih}
                    onChange={(e) => setTahunDipilih(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    {availableYears.map((tahun) => (
                        <option key={tahun} value={tahun}>
                            {tahun}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        formatter={(value: number) => [
                            `${value} gempa`,
                            "Jumlah",
                        ]}
                        labelFormatter={(label) => `Bulan ${label}`}
                    />
                    <Legend />
                    <Bar
                        dataKey="jumlah"
                        fill="#3B82F6"
                        name="Jumlah Gempa"
                        barSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
