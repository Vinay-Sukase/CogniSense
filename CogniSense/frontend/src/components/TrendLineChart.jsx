import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const TrendLineChart = ({ sessions = [] }) => {
  const data = {
    labels: sessions.map((session) => new Date(session.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Load Score",
        data: sessions.map((session) => session.cognitive_load_score),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.15)",
        tension: 0.35
      }
    ]
  };

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Performance Trend</h3>
      <div className="h-[260px] sm:h-[320px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }}
        />
      </div>
    </div>
  );
};

export default TrendLineChart;
