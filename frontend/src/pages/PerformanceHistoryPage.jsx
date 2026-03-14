import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TrendLineChart from "../components/TrendLineChart";
import { getSessions } from "../services/sessionService";

const PerformanceHistoryPage = () => {
  const [sessions, setSessions] = useState([]);

  const loadSessions = () => {
    getSessions().then(setSessions).catch(() => setSessions([]));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="page-shell">
      <section className="panel p-6 sm:p-8 md:p-10">
        <h1 className="section-title">Performance history</h1>
        <p className="mt-3 max-w-2xl muted-copy">
          Review prior assessments and reopen detailed results. Record deletion is restricted to
          administrators.
        </p>
      </section>
      <TrendLineChart sessions={[...sessions].reverse()} />
      <div className="panel overflow-hidden">
        <div className="responsive-data-cards p-4">
          {sessions.map((session) => (
            <div key={session.session_id} className="rounded-[22px] border border-white/60 bg-white/80 p-4">
              <p className="text-sm text-slate-500">{new Date(session.timestamp).toLocaleString()}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{session.cognitive_load_score}</p>
              <p className="mt-1 text-slate-700">{session.cognitive_load_classification}</p>
              <Link className="mt-4 inline-flex text-sm text-sky-600" to={`/results/${session.session_id}`}>
                View details
              </Link>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
        <table className="responsive-data-table">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Classification</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sessions.map((session) => (
              <tr key={session.session_id}>
                <td className="px-5 py-4 text-slate-700">
                  {new Date(session.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-slate-900">{session.cognitive_load_score}</td>
                <td className="px-5 py-4 text-slate-700">{session.cognitive_load_classification}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-3">
                    <Link className="text-teal-300" to={`/results/${session.session_id}`}>
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHistoryPage;
