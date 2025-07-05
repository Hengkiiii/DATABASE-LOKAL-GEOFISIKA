import React, { useEffect, useState } from "react";
import { useMedia } from "react-use";
import Card from "@/components/common/Card";
import { CardStatistikGempaProps } from "@/interface/common/CardStatistikGempaProps";
import { getEarthquakeAll } from "@/lib/api/earthquake/earthquake-get-all/router";

interface EarthquakeData {
    date_time: string;
}

export default function CardStatistik({
    title,
    badge,
    color,
    description,
    filterType = "all",
}: CardStatistikGempaProps) {
    const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);
    const [count, setCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const filterEarthquakeData = (data: EarthquakeData[], type: string) => {
        const now = new Date();

        switch (type) {
            case "today":
                return data.filter((item) => {
                    const itemDate = new Date(item.date_time);
                    return (
                        itemDate.getDate() === now.getDate() &&
                        itemDate.getMonth() === now.getMonth() &&
                        itemDate.getFullYear() === now.getFullYear()
                    );
                });

            case "month":
                return data.filter((item) => {
                    const itemDate = new Date(item.date_time);
                    return (
                        itemDate.getMonth() === now.getMonth() &&
                        itemDate.getFullYear() === now.getFullYear()
                    );
                });

            case "year":
                return data.filter((item) => {
                    const itemDate = new Date(item.date_time);
                    return itemDate.getFullYear() === now.getFullYear();
                });

            default:
                return data;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getEarthquakeAll();
                const filteredData = filterEarthquakeData(data, filterType);
                setCount(filteredData.length);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
                setCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filterType]);

    if (isLoading) {
        return (
            <Card
                style={`${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                } relative p-6`}
            >
                <p className="text-gray-500">Memuat data...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card
                style={`${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                } relative p-6`}
            >
                <p className="text-red-500">Error: {error}</p>
            </Card>
        );
    }

    return (
        <Card
            style={`${isDarkMode ? "bg-slate-800" : "bg-white"} relative p-6`}
        >
            {badge && (
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                    {badge}
                </span>
            )}

            <h2 className="text-gray-500 font-medium">{title}</h2>
            <p className={`text-4xl font-bold ${color}`}>{count}</p>
            <p className="text-sm text-gray-400">{description}</p>
        </Card>
    );
}
