const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const safeInversePercent = (value, worst, best) => {
  if (value === undefined || value === null) return 50;
  const ratio = (value - best) / (worst - best);
  return clamp(ratio * 100, 0, 100);
};

const safePositivePercent = (value) => {
  if (value === undefined || value === null) return 50;
  return clamp(value, 0, 100);
};

const classifyScore = (score) => {
  if (score <= 25) return "Low Cognitive Load";
  if (score <= 50) return "Moderate Load";
  if (score <= 75) return "High Load";
  return "Severe Cognitive Fatigue";
};

const calculateCognitiveLoadScore = ({ testMetrics, questionnaireScores }) => {
  const reactionLoad = safeInversePercent(testMetrics.reaction_time_mean, 1200, 220);
  const workingMemoryLoad = 100 - safePositivePercent(testMetrics.nback_accuracy);
  const readingLoad = 100 - safePositivePercent(testMetrics.reading_accuracy);
  const stroopLoad = safePositivePercent(testMetrics.stroop_interference_score);
  const questionnaireLoad = clamp((questionnaireScores.total / 60) * 100, 0, 100);

  const weightedScore =
    reactionLoad * 0.2 +
    workingMemoryLoad * 0.25 +
    readingLoad * 0.15 +
    stroopLoad * 0.15 +
    questionnaireLoad * 0.25;

  const score = Math.round(clamp(weightedScore, 0, 100));

  return {
    score,
    classification: classifyScore(score),
    components: {
      reactionLoad: Math.round(reactionLoad),
      workingMemoryLoad: Math.round(workingMemoryLoad),
      readingLoad: Math.round(readingLoad),
      stroopLoad: Math.round(stroopLoad),
      questionnaireLoad: Math.round(questionnaireLoad)
    }
  };
};

module.exports = { calculateCognitiveLoadScore, classifyScore };

