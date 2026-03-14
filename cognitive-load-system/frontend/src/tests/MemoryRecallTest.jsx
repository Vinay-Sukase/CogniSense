import { useEffect, useState } from "react";

const buildSequence = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 9) + 1).join(" ");

const parseSequenceInput = (value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  if (trimmed.includes(" ")) {
    return trimmed.split(/\s+/).filter(Boolean);
  }

  return trimmed.split("");
};

const scoreRecall = (target, response) => {
  const targetValues = target.split(" ");
  const responseValues = parseSequenceInput(response);
  const matches = targetValues.filter((value, index) => value === responseValues[index]).length;
  return Math.round((matches / targetValues.length) * 100);
};

const MemoryRecallTest = ({ onComplete }) => {
  const [sequence, setSequence] = useState("");
  const [phase, setPhase] = useState("show");
  const [forward, setForward] = useState("");
  const [reverse, setReverse] = useState("");

  useEffect(() => {
    const generated = buildSequence(5 + Math.floor(Math.random() * 4));
    setSequence(generated);
    const timer = window.setTimeout(() => setPhase("recall"), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = () => {
    const forwardAccuracy = scoreRecall(sequence, forward);
    const reverseTarget = sequence.split(" ").reverse().join(" ");
    const reverseAccuracy = scoreRecall(reverseTarget, reverse);
    const normalizeForDisplay = (value) => parseSequenceInput(value).join(" ");

    onComplete({
      memory_span: sequence.split(" ").length,
      forward_recall_value: normalizeForDisplay(forward),
      reverse_recall_value: normalizeForDisplay(reverse),
      recall_accuracy: forwardAccuracy,
      reverse_recall_accuracy: reverseAccuracy
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">Memory Recall Test</h3>
      {phase === "show" ? (
        <div className="mt-8 overflow-x-auto rounded-3xl bg-white/85 p-8 text-center text-4xl font-bold tracking-[0.45em] whitespace-nowrap text-slate-900 md:text-5xl">
          {sequence}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <input
            value={forward}
            onChange={(event) => setForward(event.target.value)}
            placeholder="Enter forward recall, e.g. 123456 or 1 2 3 4 5 6"
            className="input-control"
          />
          <input
            value={reverse}
            onChange={(event) => setReverse(event.target.value)}
            placeholder="Enter reverse recall, e.g. 654321 or 6 5 4 3 2 1"
            className="input-control"
          />
          <button
            type="button"
            onClick={submit}
            className="button-primary"
          >
            Submit Recall
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryRecallTest;
