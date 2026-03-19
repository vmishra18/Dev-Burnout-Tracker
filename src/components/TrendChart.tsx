import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

type ChartType = "line" | "area" | "bar";

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface TrendChartProps {
  title: string;
  subtitle: string;
  data: Record<string, string | number>[];
  type?: ChartType;
  series: SeriesConfig[];
}

const tooltipStyle = {
  background: "rgba(35, 40, 50, 0.94)",
  borderRadius: 20,
  border: "1px solid rgba(173, 180, 192, 0.14)",
  color: "#f8fafc",
  boxShadow: "0 18px 42px rgba(0,0,0,0.16)",
};

export function TrendChart({
  title,
  subtitle,
  data,
  type = "line",
  series,
}: TrendChartProps) {
  const renderChart = () => {
    if (type === "bar") {
      return (
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.10)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {series.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name}
              fill={item.color}
              radius={[16, 16, 6, 6]}
            />
          ))}
        </BarChart>
      );
    }

    if (type === "area") {
      return (
        <AreaChart data={data}>
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.key}
                id={`${item.key}-gradient`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={item.color} stopOpacity={0.42} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.10)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {series.map((item) => (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stroke={item.color}
              fill={`url(#${item.key}-gradient)`}
              strokeWidth={3}
            />
          ))}
        </AreaChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.10)" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
        />
        <Tooltip contentStyle={tooltipStyle} />
        {series.map((item) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.name}
            stroke={item.color}
            strokeWidth={3}
            dot={{ r: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    );
  };

  return (
    <motion.section
      whileHover={{ y: -2 }}
      className="glass-panel min-w-0 rounded-[30px] p-4.5 sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="section-label">Trend</p>
          <p className="mt-1.5 font-display text-lg font-bold tracking-tight sm:text-[1.35rem]">
            {title}
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p>
        </div>
        <div className="metric-chip">7 days</div>
      </div>
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </div>
    </motion.section>
  );
}
