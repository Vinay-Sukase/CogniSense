import { questionnaireItems } from "../utils/questionnaire";

const QuestionnaireForm = ({ answers, setAnswers }) => {
  const updateAnswer = (index, value) => {
    const next = [...answers];
    next[index] = Number(value);
    setAnswers(next);
  };

  return (
    <div className="panel p-8">
      <h3 className="mb-2 text-xl font-semibold text-slate-900">Mental Well-being Questionnaire</h3>
      <p className="mb-4 text-sm muted-copy">Indirect indicators only. This is not a clinical stress inventory.</p>
      <div className="mb-6 rounded-[22px] border border-white/60 bg-white/75 p-4">
        <p className="text-sm font-semibold text-slate-900">Response scale</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          {["1 Very low", "2 Low", "3 Moderate", "4 High", "5 Very high"].map((label) => (
            <div key={label} className="rounded-2xl bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        {questionnaireItems.map((item, index) => (
          <label key={item} className="block rounded-[24px] border border-white/60 bg-white/75 p-5">
            <span className="mb-3 block text-sm text-slate-800">{item}</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateAnswer(index, value)}
                  className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                    answers[index] === value
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireForm;
