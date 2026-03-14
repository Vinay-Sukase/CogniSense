import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionnaireForm from "../components/QuestionnaireForm";
import { createSession } from "../services/sessionService";
import { defaultQuestionnaireAnswers } from "../utils/questionnaire";
import MemoryRecallTest from "../tests/MemoryRecallTest";
import MovingTextReadingTest from "../tests/MovingTextReadingTest";
import NBackTest from "../tests/NBackTest";
import ReactionTimeTest from "../tests/ReactionTimeTest";
import StroopTest from "../tests/StroopTest";

const TESTS = [
  {
    key: "reaction",
    title: "Reaction Time",
    summary: "Measures alertness and response speed.",
    duration: "About 1 minute",
    outcome: "Reaction speed, missed clicks, and response variance",
    instructions: [
      "Wait until the visual signal appears.",
      "Do not click early or it will count as a missed click.",
      "Complete all five rounds for a stable average."
    ],
    Component: ReactionTimeTest
  },
  {
    key: "nback",
    title: "Working Memory (N-Back)",
    summary: "Checks how well you retain and compare recent stimuli.",
    duration: "About 1 to 2 minutes",
    outcome: "Working-memory accuracy, false positives, and response timing",
    instructions: [
      "Watch the letters one by one.",
      "Press Match only when the current letter matches the one shown two steps earlier.",
      "Avoid guessing because false positives reduce accuracy."
    ],
    Component: NBackTest
  },
  {
    key: "memory",
    title: "Memory Recall",
    summary: "Assesses short-term recall and sequence manipulation.",
    duration: "About 1 minute",
    outcome: "Memory span, recalled values, forward score, and reverse score",
    instructions: [
      "Memorize the number sequence while it is visible.",
      "Enter the sequence in the same order for forward recall.",
      "Then enter it in reverse order for reverse recall."
    ],
    Component: MemoryRecallTest
  },
  {
    key: "reading",
    title: "Moving Text Reading",
    summary: "Tracks reading flow, hesitation, and comprehension.",
    duration: "About 1 minute",
    outcome: "Reading time, number of correct answers, and comprehension accuracy",
    instructions: [
      "Read each word as it appears on screen.",
      "Stay focused until the passage ends.",
      "Answer the comprehension questions based on what you just read."
    ],
    Component: MovingTextReadingTest
  },
  {
    key: "stroop",
    title: "Stroop Attention Test",
    summary: "Measures attention control under interference.",
    duration: "About 1 minute",
    outcome: "Attention control, response timing, and interference score",
    instructions: [
      "Ignore the word meaning.",
      "Select the color of the text ink instead.",
      "Respond as quickly and accurately as possible."
    ],
    Component: StroopTest
  }
];

const CognitiveTestPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testMetrics, setTestMetrics] = useState({});
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState(defaultQuestionnaireAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("overview");
  const [completedSnapshot, setCompletedSnapshot] = useState(null);

  const completeStep = (payload) => {
    setCompletedSnapshot(payload);
    setStage("completed");
  };

  const startCurrentTest = () => {
    setCompletedSnapshot(null);
    setStage("running");
  };

  const goToNextTest = () => {
    setTestMetrics((current) => ({ ...current, ...completedSnapshot }));
    setCompletedSnapshot(null);
    setCurrentIndex((value) => value + 1);
    setStage("intro");
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await createSession({ testMetrics, questionnaireAnswers });
      navigate(`/results/${response.session.session_id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save this assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentTest = TESTS[currentIndex];
  const isQuestionnaire = !currentTest;

  return (
    <div className="page-shell">
      <section className="panel p-6 sm:p-8 md:p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="glass-chip">Apple-style guided assessment</div>
            <h1 className="section-title mt-5">Cognitive Assessment</h1>
            <p className="mt-4 max-w-3xl muted-copy">
              Each test is introduced before it begins. Read the purpose, understand what is being
              measured, start the task when ready, and then continue to the next stage after the
              system records your result.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="panel-soft px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Flow</p>
              <p className="mt-2 font-semibold text-slate-900">Learn, start, complete, continue</p>
            </div>
            <div className="panel-soft px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Focus</p>
              <p className="mt-2 font-semibold text-slate-900">One task at a time</p>
            </div>
            <div className="panel-soft px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Progress</p>
              <p className="mt-2 font-semibold text-slate-900">
                {Math.min(currentIndex + 1, TESTS.length)} / {TESTS.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {stage === "overview" && (
        <section className="assessment-shell">
          <div className="panel p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Before you begin</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">How this assessment works</h2>
            <div className="mt-6 space-y-4 muted-copy">
              <p>Find a quiet space and complete the full sequence in one sitting if possible.</p>
              <p>Do not try to game the score. Natural responses produce more reliable insight.</p>
              <p>After each task, continue manually to the next test so you always know what is coming.</p>
            </div>
            <button type="button" onClick={() => setStage("intro")} className="button-primary mt-8">
              Review first test
            </button>
          </div>
          <div className="panel p-6 sm:p-8">
            <div className="space-y-4">
              {TESTS.map((test, index) => (
                <div key={test.key} className="rounded-[24px] border border-white/60 bg-white/70 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Test {index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{test.title}</h3>
                  <p className="mt-2 muted-copy">{test.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {stage !== "overview" &&
        (isQuestionnaire ? (
          <section className="assessment-shell items-start">
            <div className="panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Final step</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Mental Well-being Questions</h2>
              <p className="mt-4 muted-copy">
                Use the scale labels shown on the right. In general, <strong>1 means lower or less
                of the experience</strong> and <strong>5 means higher or more frequent</strong>.
              </p>
              <div className="mt-6 rounded-[24px] border border-white/60 bg-white/70 p-5">
                <p className="text-sm font-semibold text-slate-900">Scale guide</p>
                <div className="mt-4 grid gap-3">
                  {[
                    "1 = Very low / Not at all",
                    "2 = Low",
                    "3 = Moderate / Neutral",
                    "4 = High",
                    "5 = Very high / Very often"
                  ].map((label) => (
                    <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              {error && <p className="mt-5 text-sm text-roseheat">{error}</p>}
            </div>
            <div className="space-y-6">
              <QuestionnaireForm answers={questionnaireAnswers} setAnswers={setQuestionnaireAnswers} />
              <button
                type="button"
                onClick={submitAssessment}
                disabled={submitting}
                className="button-primary w-full sm:w-auto"
              >
                {submitting ? "Submitting..." : "Finish Assessment"}
              </button>
            </div>
          </section>
        ) : (
          <section className="assessment-shell items-start">
            <div className="panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Test {currentIndex + 1}</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">{currentTest.title}</h2>
              <p className="mt-4 muted-copy">{currentTest.summary}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Expected time</p>
                  <p className="mt-2 font-semibold text-slate-900">{currentTest.duration}</p>
                </div>
                <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Measures</p>
                  <p className="mt-2 font-semibold text-slate-900">{currentTest.outcome}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Instructions</p>
                <ol className="mt-4 space-y-3 text-sm muted-copy">
                  {currentTest.instructions.map((item, index) => (
                    <li key={item} className="flex gap-3 rounded-2xl bg-white/70 px-4 py-3">
                      <span className="font-semibold text-slate-900">{index + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {stage === "intro" && (
                <button type="button" onClick={startCurrentTest} className="button-primary mt-8 w-full sm:w-auto">
                  Start test
                </button>
              )}
              {stage === "completed" && (
                <div className="mt-8 space-y-4">
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                    This test is complete. Review the right panel if needed, then continue when
                    you are ready.
                  </div>
                  <button type="button" onClick={goToNextTest} className="button-primary w-full sm:w-auto">
                    Proceed to next test
                  </button>
                </div>
              )}
            </div>
            <div className="panel p-6 sm:p-8">
              {stage === "intro" && (
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center sm:min-h-[420px]">
                  <div className="glass-chip">Ready when you are</div>
                  <h3 className="mt-5 text-3xl font-semibold text-slate-900">{currentTest.title}</h3>
                  <p className="mt-4 max-w-md muted-copy">
                    The live test will appear here after you press Start test.
                  </p>
                </div>
              )}
              {stage === "running" && <currentTest.Component onComplete={completeStep} />}
              {stage === "completed" && (
                <div className="space-y-6">
                  <div className="rounded-[24px] border border-white/60 bg-white/70 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recorded output</p>
                    <div className="mt-4 grid gap-3">
                      {Object.entries(completedSnapshot || {}).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-slate-500">{key.replaceAll("_", " ")}</span>
                          <span className="font-semibold text-slate-900 break-words">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
    </div>
  );
};

export default CognitiveTestPage;
