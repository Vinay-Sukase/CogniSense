import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScoreGaugeChart from "../components/ScoreGaugeChart";
import StatCard from "../components/StatCard";
import TrendLineChart from "../components/TrendLineChart";
import { getSessions } from "../services/sessionService";

const UserDashboardPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  const latestSession = sessions[0];

  return (
    <div className="page-shell">
      <section className="panel p-6 sm:p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Overview</p>
            <h1 className="section-title mt-3">Your dashboard</h1>
            <p className="mt-3 max-w-2xl muted-copy">
              Review your latest cognitive load profile, compare historical trends, and launch a
              fresh assessment when you want a new snapshot.
            </p>
          </div>
          <Link to="/tests" className="button-primary inline-flex items-center justify-center">
            Begin tests
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Sessions" value={sessions.length} />
        <StatCard label="Latest Classification" value={latestSession?.cognitive_load_classification || "N/A"} accent="from-sky-400 to-indigo-400" />
        <StatCard label="Average Score" value={sessions.length ? Math.round(sessions.reduce((sum, item) => sum + item.cognitive_load_score, 0) / sessions.length) : 0} accent="from-rose-400 to-orange-400" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ScoreGaugeChart score={latestSession?.cognitive_load_score || 0} />
        <TrendLineChart sessions={[...sessions].reverse()} />
      </section>
    </div>
  );
};

export default UserDashboardPage;
