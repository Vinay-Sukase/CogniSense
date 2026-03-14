import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MetricsBarChart = ({ session }) => {
  const metrics = session?.test_metrics || {};

  const data = {
    labels: ["Reaction", "N-Back", "Memory", "Reading", "Stroop"],
    datasets: [
      {
        label: "Test Breakdown",
        data: [
          100 - Math.min((metrics.reaction_time_mean || 0) / 10, 100),
          metrics.nback_accuracy || 0,
          (metrics.memory_span || 0) * 10,
          metrics.reading_accuracy || 0,
          100 - (metrics.stroop_interference_score || 0)
        ],
        backgroundColor: ["#f97316", "#14b8a6", "#38bdf8", "#f59e0b", "#fb7185"]
      }
    ]
  };

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Test Metrics Breakdown</h3>
      <div className="h-[260px] sm:h-[320px]">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 100 } }
          }}
        />
      </div>
    </div>
  );
};

export default MetricsBarChart;
