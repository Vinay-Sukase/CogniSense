import { useEffect, useMemo, useState } from "react";
import { average, variance } from "../utils/metrics";

const ReactionTimeTest = ({ onComplete }) => {
  const [phase, setPhase] = useState("idle");
  const [stimulusVisible, setStimulusVisible] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [missedClicks, setMissedClicks] = useState(0);

  useEffect(() => {
    let timer;
    if (phase === "waiting") {
      timer = window.setTimeout(() => {
        setStimulusVisible(true);
        setStartTime(performance.now());
        setPhase("ready");
      }, 1200 + Math.random() * 1600);
    }

    return () => window.clearTimeout(timer);
  }, [phase, attempt]);

  useEffect(() => {
    if (attempt === 5) {
      onComplete({
        reaction_time_mean: Math.round(average(reactionTimes)),
        reaction_time_variance: Math.round(variance(reactionTimes)),
        missed_clicks: missedClicks
      });
    }
  }, [attempt, missedClicks, onComplete, reactionTimes]);

  const summary = useMemo(
    () => ({
      mean: Math.round(average(reactionTimes)),
      variance: Math.round(variance(reactionTimes))
    }),
    [reactionTimes]
  );

  const handleStart = () => {
    setPhase("waiting");
    setStimulusVisible(false);
  };

  const handleClick = () => {
    if (phase === "waiting") {
      setMissedClicks((value) => value + 1);
      return;
    }

    if (phase === "ready") {
      const reactionTime = performance.now() - startTime;
      setReactionTimes((current) => [...current, reactionTime]);
      setStimulusVisible(false);
      setAttempt((value) => value + 1);
      setPhase(attempt === 4 ? "finished" : "idle");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Reaction Time Test</h3>
        <p className="mt-2 text-sm muted-copy">Click only when the signal appears. Five rounds are recorded.</p>
      </div>
      <div
        className={`mt-6 flex h-48 items-center justify-center rounded-3xl border border-dashed transition ${
          stimulusVisible ? "border-sky-400 bg-sky-100" : "border-slate-200 bg-white/80"
        }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {stimulusVisible ? (
          <span className="text-2xl font-semibold text-sky-700">Click now</span>
        ) : (
          <span className="text-slate-500">{phase === "waiting" ? "Wait..." : "Ready zone"}</span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleStart}
          disabled={phase === "waiting" || phase === "ready" || attempt === 5}
          className="button-primary disabled:opacity-50"
        >
          {attempt === 0 ? "Start Test" : "Next Round"}
        </button>
        <div className="text-right text-sm text-slate-600">
          <p>Round: {Math.min(attempt + 1, 5)} / 5</p>
          <p>Mean: {summary.mean || 0} ms</p>
          <p>Variance: {summary.variance || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ReactionTimeTest;
