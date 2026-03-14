const mongoose = require("mongoose");

const benchmarkRecordSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true
    },
    source_record_id: {
      type: String,
      required: true,
      unique: true
    },
    target_label: {
      type: String,
      required: true
    },
    cognitive_load_score: Number,
    feature_vector: {
      reaction_time_mean: Number,
      reaction_time_variance: Number,
      missed_clicks: Number,
      nback_accuracy: Number,
      nback_false_positives: Number,
      nback_response_time: Number,
      memory_span: Number,
      recall_accuracy: Number,
      reverse_recall_accuracy: Number,
      reading_accuracy: Number,
      reading_time: Number,
      stroop_response_time: Number,
      stroop_interference_score: Number,
      questionnaire_attention: Number,
      questionnaire_mental_fatigue: Number,
      questionnaire_cognitive_overload: Number,
      questionnaire_productivity_perception: Number,
      questionnaire_motivation: Number,
      questionnaire_anxiety_tendency: Number,
      questionnaire_total: Number,
      cognitive_load_score: Number
    },
    label_method: {
      type: String,
      default: "heuristic"
    },
    provenance: mongoose.Schema.Types.Mixed,
    notes: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("BenchmarkRecord", benchmarkRecordSchema);

