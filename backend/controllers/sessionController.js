const crypto = require("crypto");
const Session = require("../models/Session");
const { aggregateQuestionnaireScores } = require("../services/questionnaireService");
const { calculateCognitiveLoadScore } = require("../services/cognitiveScoreService");
const { buildSuggestions } = require("../services/suggestionService");
const { predictCognitiveState } = require("../services/mlService");
const { compareAgainstBenchmarks } = require("../services/benchmarkService");

const createSession = async (req, res, next) => {
  try {
    const { testMetrics, questionnaireAnswers } = req.body;
    const questionnaireScores = aggregateQuestionnaireScores(questionnaireAnswers);
    const scoring = calculateCognitiveLoadScore({ testMetrics, questionnaireScores });

    const mlPrediction = await predictCognitiveState({
      test_metrics: testMetrics,
      questionnaire_scores: questionnaireScores,
      cognitive_load_score: scoring.score
    });

    const benchmarkComparison = await compareAgainstBenchmarks(testMetrics);

    const suggestions = buildSuggestions({
      score: scoring.score,
      classification: scoring.classification,
      questionnaireScores,
      mlPrediction,
      testMetrics,
      benchmarkComparison
    });

    const session = await Session.create({
      session_id: crypto.randomUUID(),
      user_id: req.user._id,
      reaction_time_mean: testMetrics.reaction_time_mean,
      reaction_time_variance: testMetrics.reaction_time_variance,
      nback_accuracy: testMetrics.nback_accuracy,
      memory_span: testMetrics.memory_span,
      stroop_interference_score: testMetrics.stroop_interference_score,
      reading_accuracy: testMetrics.reading_accuracy,
      reading_time: testMetrics.reading_time,
      test_metrics: testMetrics,
      questionnaire_scores: questionnaireScores,
      cognitive_load_score: scoring.score,
      cognitive_load_classification: scoring.classification,
      ml_prediction: mlPrediction,
      benchmark_comparison: benchmarkComparison,
      suggestions
    });

    res.status(201).json({
      session,
      scoring,
      mlPrediction,
      benchmarkComparison,
      suggestions,
      disclaimer:
        "This system supports self-reflection and is not a medical diagnosis tool."
    });
  } catch (error) {
    next(error);
  }
};

const getMySessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id }).sort({ timestamp: -1 });
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      session_id: req.params.sessionId,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    res.json({ session });
  } catch (error) {
    next(error);
  }
};
module.exports = { createSession, getMySessions, getSessionById };
