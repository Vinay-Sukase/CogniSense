const BenchmarkRecord = require("../models/BenchmarkRecord");

const METRIC_DIRECTIONS = {
  reaction_time_mean: "lower",
  nback_accuracy: "higher",
  recall_accuracy: "higher",
  reading_accuracy: "higher",
  stroop_interference_score: "lower"
};

const compareMetric = (metric, currentValue, benchmarkAverage) => {
  if (currentValue === undefined || currentValue === null || benchmarkAverage === null) {
    return null;
  }

  const direction = METRIC_DIRECTIONS[metric];
  const difference = Number((currentValue - benchmarkAverage).toFixed(2));

  if (direction === "lower") {
    if (difference > 0) return "above_benchmark_load";
    if (difference < 0) return "below_benchmark_load";
  } else {
    if (difference < 0) return "above_benchmark_load";
    if (difference > 0) return "below_benchmark_load";
  }

  return "near_benchmark";
};

const compareAgainstBenchmarks = async (testMetrics) => {
  const aggregate = await BenchmarkRecord.aggregate([
    {
      $group: {
        _id: null,
        reaction_time_mean: { $avg: "$feature_vector.reaction_time_mean" },
        nback_accuracy: { $avg: "$feature_vector.nback_accuracy" },
        recall_accuracy: { $avg: "$feature_vector.recall_accuracy" },
        reading_accuracy: { $avg: "$feature_vector.reading_accuracy" },
        stroop_interference_score: { $avg: "$feature_vector.stroop_interference_score" },
        sample_size: { $sum: 1 }
      }
    }
  ]);

  const stats = aggregate[0];
  if (!stats) {
    return {
      sample_size: 0,
      metrics: {}
    };
  }

  const metrics = {};

  Object.keys(METRIC_DIRECTIONS).forEach((metric) => {
    const benchmarkAverage = stats[metric] ?? null;
    const currentValue = testMetrics[metric];

    metrics[metric] = {
      current_value: currentValue ?? null,
      benchmark_average: benchmarkAverage !== null ? Number(benchmarkAverage.toFixed(2)) : null,
      comparison: compareMetric(metric, currentValue, benchmarkAverage)
    };
  });

  return {
    sample_size: stats.sample_size,
    metrics
  };
};

module.exports = { compareAgainstBenchmarks };
