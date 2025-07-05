"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/common/Card";
import { getActivityLogAll } from "@/lib/api/activity-log/activity-log-get-all/router";
import { getActivityById } from "@/lib/api/activity-log/activity-log-get/router";
import dayjs from "dayjs";

interface ActivityLogData {
  description: string;
  ip_address: string;
  action: string;
  user_agent: string;
  created_at: string;
}

interface AktifitasProps {
  role: "admin" | "operator";
  userId: string | number;
}

export default function Aktifitas({ role, userId }: AktifitasProps) {
  const [data, setData] = useState<ActivityLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        let result: ActivityLogData[] = [];

        if (role === "admin") {
          console.log("Role admin, mengambil semua aktivitas...");
          const all = await getActivityLogAll();
          console.log("Data aktivitas admin diterima:", all);

          result = all.map((item) => ({
            description: item.description,
            ip_address: item.ip_address,
            action: item.action,
            user_agent: item.user_agent,
            created_at: item.created_at,
          }));
        } else {
          const userId = sessionStorage.getItem("user_id");

          if (!userId) {
            throw new Error("User ID tidak ditemukan di sessionStorage.");
          }

          const activitiesById = await getActivityById(userId);
          console.log("Data aktivitas operator diterima:", activitiesById);

          result = activitiesById.map((item) => ({
            description: item.description,
            ip_address: item.ip_address,
            action: item.action,
            user_agent: item.user_agent,
            created_at: item.created_at,
          }));
        }

        console.log("Hasil akhirnya akan disimpan ke state:", result);
        setData(result);
      } catch (err) {
        console.error("ERROR AMBIL DATA:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
        console.log("fetchData selesai, loading false");
      }
    }

    fetchData();
  }, [role, userId]);

  return (
    <Card style="bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl mt-6 ml-6 mr-6">
      <h2 className="text-xl font-bold text-gray-800">Riwayat Aktivitas</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-5 text-left">No.</th>
              <th className="py-3 px-5 text-left">Aksi</th>
              <th className="py-3 px-5 text-left">Deskripsi</th>
              <th className="py-3 px-5 text-left">IP Address</th>
              <th className="py-3 px-5 text-left">User Agent</th>
              <th className="py-3 px-5 text-left">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-5 align-top">{index + 1}</td>
                  <td className="py-3 px-5 align-top">{item.action}</td>
                  <td className="py-3 px-5 max-w-md break-words whitespace-pre-wrap align-top">
                    {item.description}
                  </td>
                  <td className="py-3 px-5 align-top">{item.ip_address}</td>
                  <td className="py-3 px-5 max-w-xs break-words align-top">
                    {item.user_agent}
                  </td>
                  <td className="py-3 px-5 align-top">
                    {dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
