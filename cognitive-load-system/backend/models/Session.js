const mongoose = require("mongoose");

const testMetricsSchema = new mongoose.Schema(
  {
    reaction_time_mean: Number,
    reaction_time_variance: Number,
    missed_clicks: Number,
    nback_accuracy: Number,
    nback_false_positives: Number,
    nback_response_time: Number,
    memory_span: Number,
    forward_recall_value: String,
    reverse_recall_value: String,
    recall_accuracy: Number,
    reverse_recall_accuracy: Number,
    reading_accuracy: Number,
    reading_time: Number,
    reading_correct_answers: Number,
    hesitation_count: Number,
    stroop_response_time: Number,
    stroop_interference_score: Number
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      unique: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reaction_time_mean: Number,
    reaction_time_variance: Number,
    nback_accuracy: Number,
    memory_span: Number,
    stroop_interference_score: Number,
    reading_accuracy: Number,
    reading_time: Number,
    test_metrics: {
      type: testMetricsSchema,
      required: true
    },
    questionnaire_scores: {
      attention: Number,
      mental_fatigue: Number,
      cognitive_overload: Number,
      productivity_perception: Number,
      motivation: Number,
      anxiety_tendency: Number,
      total: Number,
      answers: [Number]
    },
    cognitive_load_score: {
      type: Number,
      min: 0,
      max: 100
    },
    cognitive_load_classification: String,
    ml_prediction: {
      label: String,
      model: String,
      probabilities: mongoose.Schema.Types.Mixed
    },
    benchmark_comparison: mongoose.Schema.Types.Mixed,
    suggestions: [String]
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Session", sessionSchema);
