import { useEffect, useMemo, useState } from "react";
import { average } from "../utils/metrics";

const COLOR_BANK = [
  { label: "RED", value: "red", hex: "#ef4444" },
  { label: "BLUE", value: "blue", hex: "#3b82f6" },
  { label: "GREEN", value: "green", hex: "#22c55e" },
  { label: "YELLOW", value: "yellow", hex: "#eab308" },
  { label: "PURPLE", value: "purple", hex: "#8b5cf6" },
  { label: "ORANGE", value: "orange", hex: "#f97316" }
];

const generateTrials = (count) =>
  Array.from({ length: count }, () => {
    const word = COLOR_BANK[Math.floor(Math.random() * COLOR_BANK.length)];
    const inkOptions = COLOR_BANK.filter((color) => color.value !== word.value);
    const ink = inkOptions[Math.floor(Math.random() * inkOptions.length)];

    return {
      word: word.label,
      correctValue: ink.value,
      inkHex: ink.hex
    };
  });

const StroopTest = ({ onComplete }) => {
  const [items] = useState(() => generateTrials(12));
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [startTime, setStartTime] = useState(performance.now());

  useEffect(() => {
    if (index >= items.length) {
      const accuracy = (correct / items.length) * 100;
      const avgTime = average(responses);
      const interferenceScore = Math.round(Math.max(0, 100 - accuracy + avgTime / 20));

      onComplete({
        stroop_response_time: Math.round(avgTime),
        stroop_interference_score: interferenceScore
      });
    }
  }, [correct, index, items.length, onComplete, responses]);

  const current = useMemo(() => items[index], [index, items]);

  const answer = (choice) => {
    const elapsed = performance.now() - startTime;
    setResponses((currentResponses) => [...currentResponses, elapsed]);
    if (choice === current.correctValue) {
      setCorrect((value) => value + 1);
    }
    setStartTime(performance.now());
    setIndex((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Stroop Test</h3>
        <p className="mt-2 text-sm muted-copy">
          Focus on the ink color, not the written word. The color-word combinations are randomized
          to avoid pattern memorization.
        </p>
      </div>
      {current ? (
        <>
          <div className="rounded-[26px] border border-white/70 bg-white/80 p-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current prompt</p>
            <div className="mt-5 text-5xl font-bold" style={{ color: current.inkHex }}>
              {current.word}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {COLOR_BANK.map((choice) => (
              <button
                key={choice.value}
                type="button"
                onClick={() => answer(choice.value)}
                className="button-secondary capitalize"
              >
                {choice.value}
              </button>
            ))}
          </div>
          <div className="text-sm text-slate-600">
            <p>Prompt {index + 1} of {items.length}</p>
          </div>
        </>
      ) : (
        <p className="mt-6 text-slate-600">Stroop test completed.</p>
      )}
    </div>
  );
};

export default StroopTest;
