import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MetricsBarChart from "../components/MetricsBarChart";
import ScoreGaugeChart from "../components/ScoreGaugeChart";
import { getSession } from "../services/sessionService";

const ResultsDashboardPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession(sessionId).then(setSession).catch(() => setSession(null));
  }, [sessionId]);

  if (!session) {
    return <div className="py-20 text-center text-slate-600">Loading result...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <ScoreGaugeChart score={session.cognitive_load_score} />
        <MetricsBarChart session={session} />
      </div>
      <div className="panel p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{session.cognitive_load_classification}</h2>
        <p className="mt-3 text-slate-700">
          ML prediction: <span className="font-semibold text-slate-900">{session.ml_prediction?.label}</span>
        </p>
        <p className="mt-3 text-sm muted-copy">
          Responsible use notice: this platform supports educational self-monitoring only and does not
          provide diagnosis or treatment.
        </p>
        <Link
          to={`/suggestions/${session.session_id}`}
          className="button-primary mt-6 inline-flex"
        >
          View suggestions
        </Link>
      </div>
    </div>
  );
};

export default ResultsDashboardPage;
