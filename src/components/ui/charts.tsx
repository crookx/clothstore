import { 
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart as RechartsAreaChart,
  Area
} from 'recharts';

interface ChartData {
  [key: string]: string | number;
}

interface ChartProps {
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  height?: number;
  series?: string[];
}

export function LineChart({ data, xAxis, yAxis, series, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          {series ? series.map((s) => (
            <Line key={s} type="monotone" dataKey={s} />
          )) : (
            <Line type="monotone" dataKey={yAxis} />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data, xAxis, yAxis, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yAxis} fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PieData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieData[];
  height?: number;
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
          />
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaChart({ data, xAxis, yAxis, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey={yAxis} />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}