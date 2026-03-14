require("dotenv").config({ path: require("path").join(__dirname, "../backend/.env") });

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const mongoose = require("mongoose");
const connectDB = require("../backend/config/db");
const BenchmarkRecord = require("../backend/models/BenchmarkRecord");

const DEFAULT_PATHS = {
  reactionCsv:
    process.env.REFERENCE_REACTION_CSV ||
    "D:\\.GECA SEM 2\\MINI Project\\datasets\\simple-reaction-times-VBRHDT-data-2024_06_16.csv",
  digitalBehaviorCsv:
    process.env.REFERENCE_DIGITAL_BEHAVIOR_CSV ||
    "D:\\.GECA SEM 1\\Cognitive-Self-Analysis\\data\\raw\\digital_behavior.csv",
  mentalHealthCsv:
    process.env.REFERENCE_MENTAL_HEALTH_CSV ||
    "D:\\.GECA SEM 1\\Cognitive-Self-Analysis\\data\\raw\\mental_health_tech.csv",
  arithmeticDir:
    process.env.REFERENCE_ARITHMETIC_DIR ||
    "D:\\.GECA SEM 2\\MINI Project\\datasets\\Cognitive Load Assessment Through EEG A Dataset from Arithmetic and Stroop Tasks\\raw_data\\raw_data\\Arithmetic_Data",
  stroopDir:
    process.env.REFERENCE_STROOP_DIR ||
    "D:\\.GECA SEM 2\\MINI Project\\datasets\\Cognitive Load Assessment Through EEG A Dataset from Arithmetic and Stroop Tasks\\raw_data\\raw_data\\Stroop_Data",
  figshareDir: process.env.FIGSHARE_ATTENTION_WORKLOAD_DIR || ""
};

const EXPORT_DIR = path.join(__dirname, "exports");
const EXPORT_PATH = path.join(EXPORT_DIR, "reference-benchmark-data.csv");
const LABELED_EXPORT_DIR = path.join(EXPORT_DIR, "labeled-training-datasets");
const MANIFEST_PATH = path.join(LABELED_EXPORT_DIR, "dataset-manifest.json");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mean = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const variance = (values) => {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map((value) => (value - avg) ** 2));
};

const classifyScore = (score) => {
  if (score <= 25) return "Low Cognitive Load";
  if (score <= 50) return "Moderate Load";
  if (score <= 75) return "High Load";
  return "Severe Cognitive Fatigue";
};

const readCsv = (filePath) =>
  parse(fs.readFileSync(filePath, "utf8"), {
    columns: true,
    skip_empty_lines: true
  });

const TEST_DATASET_CONFIG = {
  reaction_time: {
    fileName: "reaction-time-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "cognitive_load_score",
      "reaction_time_mean",
      "reaction_time_variance",
      "missed_clicks",
      "train_target_test"
    ]
  },
  working_memory: {
    fileName: "working-memory-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "cognitive_load_score",
      "nback_accuracy",
      "nback_false_positives",
      "nback_response_time",
      "train_target_test"
    ]
  },
  memory_recall: {
    fileName: "memory-recall-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "cognitive_load_score",
      "memory_span",
      "recall_accuracy",
      "reverse_recall_accuracy",
      "train_target_test"
    ]
  },
  reading: {
    fileName: "reading-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "cognitive_load_score",
      "reading_accuracy",
      "reading_time",
      "train_target_test"
    ]
  },
  stroop: {
    fileName: "stroop-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "cognitive_load_score",
      "stroop_response_time",
      "stroop_interference_score",
      "train_target_test"
    ]
  },
  questionnaire: {
    fileName: "questionnaire-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "cognitive_load_score",
      "questionnaire_attention",
      "questionnaire_mental_fatigue",
      "questionnaire_cognitive_overload",
      "questionnaire_productivity_perception",
      "questionnaire_motivation",
      "questionnaire_anxiety_tendency",
      "questionnaire_total",
      "train_target_test"
    ]
  },
  combined_model: {
    fileName: "combined-model-training.csv",
    columns: [
      "source",
      "source_record_id",
      "target_label",
      "reaction_time_mean",
      "reaction_time_variance",
      "missed_clicks",
      "nback_accuracy",
      "nback_false_positives",
      "nback_response_time",
      "memory_span",
      "recall_accuracy",
      "reverse_recall_accuracy",
      "reading_accuracy",
      "reading_time",
      "stroop_response_time",
      "stroop_interference_score",
      "questionnaire_attention",
      "questionnaire_mental_fatigue",
      "questionnaire_cognitive_overload",
      "questionnaire_productivity_perception",
      "questionnaire_motivation",
      "questionnaire_anxiety_tendency",
      "questionnaire_total",
      "cognitive_load_score",
      "train_target_test"
    ]
  }
};

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const deriveTrainTargetTests = (featureVector) => {
  const tests = [];

  if (hasValue(featureVector.reaction_time_mean) || hasValue(featureVector.reaction_time_variance)) {
    tests.push("reaction_time");
  }

  if (
    hasValue(featureVector.nback_accuracy) ||
    hasValue(featureVector.nback_false_positives) ||
    hasValue(featureVector.nback_response_time)
  ) {
    tests.push("working_memory");
  }

  if (
    hasValue(featureVector.memory_span) ||
    hasValue(featureVector.recall_accuracy) ||
    hasValue(featureVector.reverse_recall_accuracy)
  ) {
    tests.push("memory_recall");
  }

  if (hasValue(featureVector.reading_accuracy) || hasValue(featureVector.reading_time)) {
    tests.push("reading");
  }

  if (hasValue(featureVector.stroop_response_time) || hasValue(featureVector.stroop_interference_score)) {
    tests.push("stroop");
  }

  if (
    hasValue(featureVector.questionnaire_attention) ||
    hasValue(featureVector.questionnaire_mental_fatigue) ||
    hasValue(featureVector.questionnaire_total)
  ) {
    tests.push("questionnaire");
  }

  tests.push("combined_model");
  return tests;
};

const normalizeRecord = ({
  source,
  sourceRecordId,
  featureVector,
  cognitiveLoadScore,
  labelMethod,
  provenance,
  notes
}) => ({
  source,
  source_record_id: sourceRecordId,
  target_label: classifyScore(cognitiveLoadScore),
  cognitive_load_score: cognitiveLoadScore,
  feature_vector: {
    reaction_time_mean: featureVector.reaction_time_mean,
    reaction_time_variance: featureVector.reaction_time_variance,
    missed_clicks: featureVector.missed_clicks,
    nback_accuracy: featureVector.nback_accuracy,
    nback_false_positives: featureVector.nback_false_positives,
    nback_response_time: featureVector.nback_response_time,
    memory_span: featureVector.memory_span,
    recall_accuracy: featureVector.recall_accuracy,
    reverse_recall_accuracy: featureVector.reverse_recall_accuracy,
    reading_accuracy: featureVector.reading_accuracy,
    reading_time: featureVector.reading_time,
    stroop_response_time: featureVector.stroop_response_time,
    stroop_interference_score: featureVector.stroop_interference_score,
    questionnaire_attention: featureVector.questionnaire_attention,
    questionnaire_mental_fatigue: featureVector.questionnaire_mental_fatigue,
    questionnaire_cognitive_overload: featureVector.questionnaire_cognitive_overload,
    questionnaire_productivity_perception: featureVector.questionnaire_productivity_perception,
    questionnaire_motivation: featureVector.questionnaire_motivation,
    questionnaire_anxiety_tendency: featureVector.questionnaire_anxiety_tendency,
    questionnaire_total: featureVector.questionnaire_total,
    cognitive_load_score: cognitiveLoadScore
  },
  train_target_tests: deriveTrainTargetTests(featureVector),
  label_method: labelMethod,
  provenance,
  notes
});

const importReactionDataset = (filePath) => {
  if (!fs.existsSync(filePath)) return [];

  const rows = readCsv(filePath);
  const grouped = new Map();

  rows.forEach((row) => {
    const participantId = row["ID(anon)"];
    const responseTime = Number(row.response_time);
    if (!participantId || Number.isNaN(responseTime)) return;

    if (!grouped.has(participantId)) {
      grouped.set(participantId, []);
    }
    grouped.get(participantId).push(responseTime);
  });

  return [...grouped.entries()].map(([participantId, values]) => {
    const reactionMean = mean(values);
    const loadScore = clamp(Math.round(((reactionMean - 180) / 520) * 100), 0, 100);

    return normalizeRecord({
      source: "simple_reaction_times",
      sourceRecordId: `reaction-${participantId}`,
      featureVector: {
        reaction_time_mean: Number(reactionMean.toFixed(2)),
        reaction_time_variance: Number(variance(values).toFixed(2))
      },
      cognitiveLoadScore: loadScore,
      labelMethod: "reaction-time-threshold",
      provenance: { file_path: filePath, participant_id: participantId, samples: values.length },
      notes: "Derived from participant-level simple reaction time averages."
    });
  });
};

const importDigitalBehavior = (filePath) => {
  if (!fs.existsSync(filePath)) return [];

  return readCsv(filePath).map((row, index) => {
    const focusScore = Number(row.focus_score) || 0;
    const anxietyLevel = Number(row.anxiety_level) || 0;
    const wellbeingScore = Number(row.digital_wellbeing_score) || 0;
    const screenTime = Number(row.daily_screen_time_min) || 0;
    const notifications = Number(row.notification_count) || 0;
    const fatigue = clamp(Math.round((screenTime / 600) * 10 + (notifications / 150) * 4), 0, 10);
    const attention = clamp(Math.round(10 - focusScore), 0, 10);
    const overload = clamp(Math.round((screenTime / 500) * 8), 0, 10);
    const productivity = clamp(Math.round((wellbeingScore / 100) * 10), 0, 10);
    const motivation = clamp(Math.round(10 - anxietyLevel / 1.5), 0, 10);
    const total = attention + fatigue + overload + productivity + motivation + clamp(Math.round(anxietyLevel), 0, 10);
    const loadScore = clamp(Math.round((total / 60) * 100), 0, 100);

    return normalizeRecord({
      source: "digital_behavior",
      sourceRecordId: `digital-${index + 1}`,
      featureVector: {
        questionnaire_attention: attention,
        questionnaire_mental_fatigue: fatigue,
        questionnaire_cognitive_overload: overload,
        questionnaire_productivity_perception: productivity,
        questionnaire_motivation: motivation,
        questionnaire_anxiety_tendency: clamp(Math.round(anxietyLevel), 0, 10),
        questionnaire_total: total,
        reading_time: Number((screenTime / 6).toFixed(2))
      },
      cognitiveLoadScore: loadScore,
      labelMethod: "digital-behavior-heuristic",
      provenance: { file_path: filePath, row_number: index + 1 },
      notes: "Mapped from digital behavior signals into questionnaire-like workload proxies."
    });
  });
};

const importMentalHealthTech = (filePath) => {
  if (!fs.existsSync(filePath)) return [];

  const workInterfereMap = {
    Never: 1,
    Rarely: 3,
    Sometimes: 5,
    Often: 8
  };

  return readCsv(filePath).map((row, index) => {
    const interfere = workInterfereMap[row.work_interfere] || 4;
    const anxiety = row.family_history === "Yes" ? 7 : 4;
    const fatigue = row.treatment === "Yes" ? 7 : 4;
    const overload = row.remote_work === "Yes" ? 5 : 4;
    const productivity = row.mental_vs_physical === "Yes" ? 6 : 4;
    const motivation = row.seek_help === "Yes" ? 6 : 4;
    const total = interfere + anxiety + fatigue + overload + productivity + motivation;
    const loadScore = clamp(Math.round((total / 60) * 100), 0, 100);

    return normalizeRecord({
      source: "mental_health_tech",
      sourceRecordId: `mental-tech-${index + 1}`,
      featureVector: {
        questionnaire_attention: interfere,
        questionnaire_mental_fatigue: fatigue,
        questionnaire_cognitive_overload: overload,
        questionnaire_productivity_perception: productivity,
        questionnaire_motivation: motivation,
        questionnaire_anxiety_tendency: anxiety,
        questionnaire_total: total
      },
      cognitiveLoadScore: loadScore,
      labelMethod: "mental-health-survey-heuristic",
      provenance: { file_path: filePath, row_number: index + 1, country: row.Country },
      notes: "Mapped from workplace mental health survey indicators into cognitive-load proxy features."
    });
  });
};

const summarizeEegFile = async (filePath) => {
  const stream = fs.createReadStream(filePath, "utf8");
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let samples = 0;
  let sum = 0;
  let maxValue = 0;

  for await (const line of rl) {
    const parts = line
      .split(",")
      .slice(1, 9)
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value));

    if (!parts.length) continue;
    const rowMean = mean(parts.map((value) => Math.abs(value)));
    sum += rowMean;
    maxValue = Math.max(maxValue, ...parts.map((value) => Math.abs(value)));
    samples += 1;
  }

  return {
    meanAmplitude: samples ? sum / samples : 0,
    maxAmplitude: maxValue,
    samples
  };
};

const importEegDirectory = async (directoryPath, source, baseScore) => {
  if (!directoryPath || !fs.existsSync(directoryPath)) return [];

  const files = fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".txt"))
    .sort();

  const records = [];

  for (const fileName of files) {
    const filePath = path.join(directoryPath, fileName);
    const summary = await summarizeEegFile(filePath);
    const loadScore = clamp(Math.round(baseScore + Math.min(summary.meanAmplitude / 5000, 25)), 0, 100);

    records.push(
      normalizeRecord({
        source,
        sourceRecordId: `${source}-${fileName}`,
        featureVector: {
          stroop_interference_score: Number(Math.min(summary.meanAmplitude / 600, 100).toFixed(2)),
          stroop_response_time: Number(Math.min(summary.maxAmplitude / 1000, 1200).toFixed(2))
        },
        cognitiveLoadScore: loadScore,
        labelMethod: "eeg-task-heuristic",
        provenance: { file_path: filePath, samples: summary.samples },
        notes: "Derived from raw EEG channel amplitude summaries."
      })
    );
  }

  return records;
};

const importOptionalFigshareDirectory = (directoryPath) => {
  if (!directoryPath || !fs.existsSync(directoryPath)) return [];

  const csvFiles = fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
    .map((fileName) => path.join(directoryPath, fileName));

  const records = [];

  csvFiles.forEach((filePath) => {
    const rows = readCsv(filePath);
    rows.forEach((row, index) => {
      const reaction = Number(row.reaction_time || row.response_time || row.reactionTime);
      const accuracy = Number(row.accuracy || row.reading_accuracy || row.performance_accuracy);
      const workload = Number(
        row.cognitive_workload_score || row.workload_score || row.mental_workload_score
      );

      const derivedScore = Number.isNaN(workload)
        ? clamp(Math.round((((reaction || 250) - 180) / 520) * 50 + (100 - (accuracy || 75)) * 0.5), 0, 100)
        : clamp(Math.round(workload), 0, 100);

      records.push(
        normalizeRecord({
          source: "figshare_attention_workload",
          sourceRecordId: `figshare-${path.basename(filePath)}-${index + 1}`,
          featureVector: {
            reaction_time_mean: Number.isNaN(reaction) ? undefined : reaction,
            reading_accuracy: Number.isNaN(accuracy) ? undefined : accuracy
          },
          cognitiveLoadScore: derivedScore,
          labelMethod: Number.isNaN(workload) ? "figshare-column-heuristic" : "figshare-native-score",
          provenance: { file_path: filePath, row_number: index + 1 },
          notes: "Optional parser for downloaded figshare CSV exports."
        })
      );
    });
  });

  return records;
};

const flattenRecord = (record) => ({
  source: record.source,
  source_record_id: record.source_record_id,
  target_label: record.target_label,
  reaction_time_mean: record.feature_vector.reaction_time_mean,
  reaction_time_variance: record.feature_vector.reaction_time_variance,
  missed_clicks: record.feature_vector.missed_clicks,
  nback_accuracy: record.feature_vector.nback_accuracy,
  nback_false_positives: record.feature_vector.nback_false_positives,
  nback_response_time: record.feature_vector.nback_response_time,
  memory_span: record.feature_vector.memory_span,
  recall_accuracy: record.feature_vector.recall_accuracy,
  reverse_recall_accuracy: record.feature_vector.reverse_recall_accuracy,
  reading_accuracy: record.feature_vector.reading_accuracy,
  reading_time: record.feature_vector.reading_time,
  stroop_response_time: record.feature_vector.stroop_response_time,
  stroop_interference_score: record.feature_vector.stroop_interference_score,
  questionnaire_attention: record.feature_vector.questionnaire_attention,
  questionnaire_mental_fatigue: record.feature_vector.questionnaire_mental_fatigue,
  questionnaire_cognitive_overload: record.feature_vector.questionnaire_cognitive_overload,
  questionnaire_productivity_perception: record.feature_vector.questionnaire_productivity_perception,
  questionnaire_motivation: record.feature_vector.questionnaire_motivation,
  questionnaire_anxiety_tendency: record.feature_vector.questionnaire_anxiety_tendency,
  questionnaire_total: record.feature_vector.questionnaire_total,
  cognitive_load_score: record.cognitive_load_score,
  train_target_tests: record.train_target_tests.join("|")
});

const exportReferenceCsv = (records) => {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });

  const flatRecords = records.map(flattenRecord);

  fs.writeFileSync(EXPORT_PATH, stringify(flatRecords, { header: true }));
};

const exportLabeledTrainingDatasets = (records) => {
  fs.mkdirSync(LABELED_EXPORT_DIR, { recursive: true });

  const flatRecords = records.map(flattenRecord);
  const manifest = {};

  Object.entries(TEST_DATASET_CONFIG).forEach(([datasetKey, config]) => {
    const labeledRows = flatRecords
      .filter((record) => record.train_target_tests.split("|").includes(datasetKey))
      .map((record) => {
        const row = { train_target_test: datasetKey };
        config.columns.forEach((column) => {
          if (column === "train_target_test") {
            row[column] = datasetKey;
          } else {
            row[column] = record[column];
          }
        });
        return row;
      });

    const exportPath = path.join(LABELED_EXPORT_DIR, config.fileName);
    fs.writeFileSync(exportPath, stringify(labeledRows, { header: true }));

    manifest[datasetKey] = {
      file_path: exportPath,
      records: labeledRows.length,
      columns: config.columns
    };
  });

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
};

const upsertRecords = async (records) => {
  if (!records.length) return;

  await BenchmarkRecord.bulkWrite(
    records.map((record) => ({
      updateOne: {
        filter: { source_record_id: record.source_record_id },
        update: record,
        upsert: true
      }
    }))
  );
};

const run = async () => {
  await connectDB();

  const importedRecords = [
    ...importReactionDataset(DEFAULT_PATHS.reactionCsv),
    ...importDigitalBehavior(DEFAULT_PATHS.digitalBehaviorCsv),
    ...importMentalHealthTech(DEFAULT_PATHS.mentalHealthCsv),
    ...(await importEegDirectory(DEFAULT_PATHS.arithmeticDir, "eeg_arithmetic", 65)),
    ...(await importEegDirectory(DEFAULT_PATHS.stroopDir, "eeg_stroop", 52)),
    ...importOptionalFigshareDirectory(DEFAULT_PATHS.figshareDir)
  ];

  await upsertRecords(importedRecords);
  exportReferenceCsv(importedRecords);
  exportLabeledTrainingDatasets(importedRecords);

  console.log(`Imported benchmark records: ${importedRecords.length}`);
  console.log(`Exported training CSV: ${EXPORT_PATH}`);
  console.log(`Exported labeled training datasets: ${LABELED_EXPORT_DIR}`);

  await mongoose.connection.close();
};

run().catch((error) => {
  console.error("Reference data import failed:", error);
  process.exit(1);
});
