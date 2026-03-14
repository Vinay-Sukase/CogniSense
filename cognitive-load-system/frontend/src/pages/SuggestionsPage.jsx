import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSession } from "../services/sessionService";

const SuggestionsPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession(sessionId).then(setSession).catch(() => setSession(null));
  }, [sessionId]);

  if (!session) {
    return <div className="py-20 text-center text-slate-600">Loading suggestions...</div>;
  }

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-semibold text-slate-900">Well-being Suggestions</h1>
      <p className="mt-3 max-w-2xl muted-copy">
        Suggestions are generated from your score and prediction profile. They are supportive,
        non-diagnostic, and should not replace professional care.
      </p>
      <div className="mt-8 grid gap-4">
        {session.suggestions.map((suggestion) => (
          <div key={suggestion} className="rounded-2xl border border-white/60 bg-white/75 p-5 text-slate-700">
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPage;
