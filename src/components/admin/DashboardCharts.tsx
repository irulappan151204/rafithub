"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINR } from "@/lib/format";

export interface MonthlyChartPoint {
  month: string;
  revenue: number;
  newMembers: number;
}

export interface PeakHourPoint {
  hourLabel: string;
  checkIns: number;
}

interface DashboardChartsProps {
  monthlyData: MonthlyChartPoint[];
  peakHours: PeakHourPoint[];
}

export function DashboardCharts({ monthlyData, peakHours }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-bold mb-1">Revenue (Last 6 Months)</h2>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">Paid collections in INR</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                formatter={(value) => formatINR(Number(value ?? 0))}
                contentStyle={{
                  backgroundColor: "#141414",
                  borderColor: "#262626",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#bef264" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-bold mb-1">Member Growth (Last 6 Months)</h2>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">New joins per month</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  borderColor: "#262626",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="newMembers"
                stroke="#bef264"
                fill="rgba(190,242,100,0.22)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-bold mb-1">Peak-Hour Attendance</h2>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">Check-ins by IST hour (30d)</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="hourLabel" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  borderColor: "#262626",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="checkIns" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
