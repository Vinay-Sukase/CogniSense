import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreGaugeChart = ({ score = 0 }) => {
  const data = {
    labels: ["Cognitive Load", "Remaining"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ["#f97316", "rgba(255,255,255,0.08)"],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Cognitive Load Score</h3>
      <div className="mx-auto w-full max-w-[280px]">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            cutout: "70%",
            plugins: { legend: { display: false } }
          }}
        />
      </div>
      <p className="mt-4 text-center text-2xl font-semibold text-sky-600 sm:text-3xl">{score}/100</p>
    </div>
  );
};

export default ScoreGaugeChart;
