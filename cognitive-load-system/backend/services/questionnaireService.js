const QUESTIONNAIRE_DIMENSIONS = [
  "attention",
  "attention",
  "mental_fatigue",
  "mental_fatigue",
  "cognitive_overload",
  "cognitive_overload",
  "productivity_perception",
  "productivity_perception",
  "motivation",
  "motivation",
  "anxiety_tendency",
  "anxiety_tendency"
];

const aggregateQuestionnaireScores = (answers = []) => {
  if (!Array.isArray(answers) || answers.length !== 12) {
    throw new Error("Questionnaire requires exactly 12 Likert-scale answers.");
  }

  const normalized = answers.map((answer) => {
    const parsed = Number(answer);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > 5) {
      throw new Error("Questionnaire answers must be numbers between 1 and 5.");
    }
    return parsed;
  });

  const scores = {
    attention: 0,
    mental_fatigue: 0,
    cognitive_overload: 0,
    productivity_perception: 0,
    motivation: 0,
    anxiety_tendency: 0
  };

  normalized.forEach((answer, index) => {
    scores[QUESTIONNAIRE_DIMENSIONS[index]] += answer;
  });

  return {
    ...scores,
    total: normalized.reduce((sum, value) => sum + value, 0),
    answers: normalized
  };
};

module.exports = { aggregateQuestionnaireScores };

