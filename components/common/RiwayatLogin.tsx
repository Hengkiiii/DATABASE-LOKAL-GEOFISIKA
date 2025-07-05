"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/common/Card";
import { getLoginLogAll } from "@/lib/api/login-log/login-log-get-all/router";
import { getLoginById } from "@/lib/api/login-log/login-log-get/router";
import dayjs from "dayjs";

interface LoginLogData {
  ip_address: string;
  user_agent: string;
  login_time: string;
  admin_id: string;
}

interface LoginLogProps {
  role: "admin" | "operator";
  userId?: string | number;
}

export default function LoginLog({ role, userId }: LoginLogProps) {
  const [data, setData] = useState<LoginLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        let logs: LoginLogData[] = [];

        if (role === "admin") {
          const allLogs = await getLoginLogAll();
          console.log("Data log admin diterima:", allLogs);

          logs = allLogs.map((item) => ({
            ip_address: item.ip_address,
            user_agent: item.user_agent,
            login_time: item.login_time,
            admin_id: item.admin_id,
          }));
        } else {
          const sessionUserId = sessionStorage.getItem("user_id");
          if (!sessionUserId) {
            throw new Error("User ID tidak ditemukan di sessionStorage.");
          }

          const logsById = await getLoginById(sessionUserId);
          logs = logsById.map((item) => ({
            ip_address: item.ip_address,
            user_agent: item.user_agent,
            login_time: item.login_time,
            admin_id: item.admin_id,
          }));
        }
        setData(logs);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [role, userId]);

  return (
    <Card style="bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl mt-6 ml-6 mr-6">
      <h2 className="text-xl font-bold text-gray-800">Riwayat Login</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-5 text-left">No.</th>
              <th className="py-3 px-5 text-left">Admin ID</th>
              <th className="py-3 px-5 text-left">IP Address</th>
              <th className="py-3 px-5 text-left">User Agent</th>
              <th className="py-3 px-5 text-left">Waktu Login</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-red-500">
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
                  <td className="py-3 px-5">{index + 1}</td>
                  <td className="py-3 px-5">{item.admin_id}</td>
                  <td className="py-3 px-5">{item.ip_address}</td>
                  <td className="py-3 px-5">{item.user_agent}</td>
                  <td className="py-3 px-5">
                    {dayjs(item.login_time).format("YYYY-MM-DD HH:mm")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
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
