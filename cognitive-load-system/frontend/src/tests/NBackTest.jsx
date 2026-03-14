import { useEffect, useMemo, useState } from "react";
import { average } from "../utils/metrics";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const TRIAL_COUNT = 12;

const buildSequence = (n) => {
  const generated = [];

  for (let index = 0; index < TRIAL_COUNT; index += 1) {
    const shouldMatch = index >= n && Math.random() > 0.55;

    if (shouldMatch) {
      generated.push(generated[index - n]);
      continue;
    }

    const previousMatch = index >= n ? generated[index - n] : null;
    const available = LETTERS.filter((letter) => letter !== previousMatch);
    generated.push(available[Math.floor(Math.random() * available.length)]);
  }

  return generated;
};

const NBackTest = ({ n = 2, onComplete }) => {
  const [sequence] = useState(() => buildSequence(n));
  const [index, setIndex] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  const [falsePositives, setFalsePositives] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [startTime, setStartTime] = useState(performance.now());

  useEffect(() => {
    setStartTime(performance.now());
  }, [index]);

  const currentLetter = sequence[index];
  const comparisonLetter = index >= n ? sequence[index - n] : null;
  const eligibleTrials = Math.max(sequence.length - n, 0);
  const isMatch = index >= n && currentLetter === comparisonLetter;
  const sequenceWindow = useMemo(
    () => sequence.slice(Math.max(0, index - 4), index + 1),
    [index, sequence]
  );

  const advance = (wasCorrect, wasFalsePositive = false) => {
    const elapsed = performance.now() - startTime;

    if (index >= n) {
      setResponseTimes((current) => [...current, elapsed]);
      if (wasCorrect) {
        setCorrectDecisions((value) => value + 1);
      }
      if (wasFalsePositive) {
        setFalsePositives((value) => value + 1);
      }
    }

    if (index >= sequence.length - 1) {
      const finalAccuracy = eligibleTrials
        ? Math.round(((correctDecisions + (wasCorrect ? 1 : 0)) / eligibleTrials) * 100)
        : 100;

      onComplete({
        nback_accuracy: finalAccuracy,
        nback_false_positives: falsePositives + (wasFalsePositive ? 1 : 0),
        nback_response_time: Math.round(average([...responseTimes, elapsed]))
      });
      return;
    }

    setIndex((value) => value + 1);
  };

  const handleMatch = () => advance(isMatch, !isMatch);
  const handleNoMatch = () => advance(!isMatch, false);
  const handleContinue = () => {
    if (index >= sequence.length - 1) {
      onComplete({
        nback_accuracy: 100,
        nback_false_positives: 0,
        nback_response_time: 0
      });
      return;
    }

    setIndex((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Working Memory Test (N-Back)</h3>
        <p className="mt-2 text-sm muted-copy">
          Compare the current letter with the one shown {n} steps earlier. For the first {n}
          letters, build the sequence in memory. After that, choose Match or No match.
        </p>
      </div>

      <div className="rounded-[26px] border border-white/70 bg-white/80 p-6">
        <div className="flex flex-wrap gap-3">
          {sequenceWindow.map((letter, windowIndex) => {
            const absoluteIndex = index - sequenceWindow.length + windowIndex + 1;
            const isCurrent = absoluteIndex === index;
            const isReference = absoluteIndex === index - n;

            return (
              <div
                key={`${letter}-${absoluteIndex}`}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold ${
                  isCurrent
                    ? "bg-sky-500 text-white"
                    : isReference
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {letter}
              </div>
            );
          })}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current letter</p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">{currentLetter}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Letter {n} steps back
            </p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">
              {comparisonLetter || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-600">
          <p>Position: {index + 1} / {sequence.length}</p>
          <p>Correct decisions: {correctDecisions}</p>
          <p>False positives: {falsePositives}</p>
        </div>

        {index < n ? (
          <button type="button" onClick={handleContinue} className="button-primary">
            Next letter
          </button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleMatch} className="button-primary">
              Match
            </button>
            <button type="button" onClick={handleNoMatch} className="button-secondary">
              No match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NBackTest;
