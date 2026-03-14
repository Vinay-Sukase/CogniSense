const StatCard = ({ label, value, accent = "from-teal-400 to-cyan-400" }) => (
  <div className="panel p-5">
    <div className={`mb-4 h-1 rounded-full bg-gradient-to-r ${accent}`} />
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
  </div>
);

export default StatCard;
