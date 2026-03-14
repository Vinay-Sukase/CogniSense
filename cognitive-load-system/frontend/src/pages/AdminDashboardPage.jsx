import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { deleteAdminSession, getAdminSessions, getAdminStats } from "../services/adminService";
import api from "../services/api";

const AdminDashboardPage = () => {
  const [payload, setPayload] = useState({ stats: {}, latestSessions: [] });
  const [sessions, setSessions] = useState([]);
  const [deletingId, setDeletingId] = useState("");

  const loadDashboard = () => {
    getAdminStats().then(setPayload).catch(() => setPayload({ stats: {}, latestSessions: [] }));
    getAdminSessions().then(setSessions).catch(() => setSessions([]));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const exportDataset = async () => {
    const response = await api.get("/admin/export", { responseType: "blob" });
    const href = window.URL.createObjectURL(response.data);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "dataset.csv";
    anchor.click();
    window.URL.revokeObjectURL(href);
  };

  const deleteSession = async (sessionId) => {
    setDeletingId(sessionId);
    try {
      await deleteAdminSession(sessionId);
      loadDashboard();
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-shell">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={payload.stats.users || 0} />
        <StatCard label="Sessions" value={payload.stats.sessions || 0} accent="from-cyan-400 to-sky-400" />
        <StatCard label="Average Score" value={payload.stats.averageScore || 0} accent="from-amber-400 to-orange-400" />
        <StatCard label="Severe Cases" value={payload.stats.severeCases || 0} accent="from-rose-400 to-red-400" />
      </section>
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Administrative Controls</h2>
          <Link to="/admin/users" className="button-primary w-full sm:w-auto">
            Manage users
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {payload.latestSessions.map((session) => (
            <div key={session.session_id} className="rounded-2xl border border-white/60 bg-white/75 p-4">
              <p className="text-slate-900">
                {session.user_id?.name} - {session.cognitive_load_score} ({session.cognitive_load_classification})
              </p>
              <p className="text-sm text-slate-500">{new Date(session.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="panel p-6 sm:p-8">
        <button
          type="button"
          onClick={exportDataset}
          className="button-primary w-full sm:w-auto"
        >
          Export dataset CSV
        </button>
      </section>
      <section className="panel overflow-hidden">
        <div className="responsive-data-cards p-4">
          {sessions.map((session) => (
            <div key={session.session_id} className="rounded-[22px] border border-white/60 bg-white/80 p-4">
              <p className="text-lg font-semibold text-slate-900">{session.user_id?.name || "Unknown"}</p>
              <p className="mt-1 text-sm text-slate-500">{new Date(session.timestamp).toLocaleString()}</p>
              <p className="mt-3 text-slate-700">Score: {session.cognitive_load_score}</p>
              <p className="mt-1 text-slate-700">Prediction: {session.ml_prediction?.label}</p>
              <button
                type="button"
                onClick={() => deleteSession(session.session_id)}
                disabled={deletingId === session.session_id}
                className="mt-4 text-sm text-rose-500 disabled:opacity-50"
              >
                {deletingId === session.session_id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
        <table className="responsive-data-table">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Prediction</th>
              <th className="px-5 py-4">Timestamp</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sessions.map((session) => (
              <tr key={session.session_id}>
                <td className="px-5 py-4 text-slate-900">{session.user_id?.name || "Unknown"}</td>
                <td className="px-5 py-4 text-slate-700">{session.cognitive_load_score}</td>
                <td className="px-5 py-4 text-slate-700">{session.ml_prediction?.label}</td>
                <td className="px-5 py-4 text-slate-700">
                  {new Date(session.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => deleteSession(session.session_id)}
                    disabled={deletingId === session.session_id}
                    className="text-sm text-rose-500 disabled:opacity-50"
                  >
                    {deletingId === session.session_id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
