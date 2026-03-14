const buildSuggestions = ({
  score,
  classification,
  questionnaireScores,
  mlPrediction,
  testMetrics,
  benchmarkComparison
}) => {
  const suggestions = [];

  if (score >= 76 || /fatigue/i.test(mlPrediction?.label || "")) {
    suggestions.push("Pause for 10 to 15 minutes before starting another demanding task.");
    suggestions.push("Drink water and do light stretching to reset mental fatigue.");
  }

  if (questionnaireScores.anxiety_tendency >= 7 || /anxiety/i.test(mlPrediction?.label || "")) {
    suggestions.push("Try a 2-minute breathing exercise before resuming work.");
    suggestions.push("Start the next study block with one simple task to reduce pressure.");
  }

  if (testMetrics.reaction_time_mean >= 650 || testMetrics.stroop_interference_score >= 55) {
    suggestions.push("Use one full-screen task at a time and silence notifications for the next session.");
    suggestions.push("Take a 60-second focus reset before switching to another subject.");
  }

  if (testMetrics.nback_accuracy <= 60 || testMetrics.recall_accuracy <= 65) {
    suggestions.push("Use chunking or short handwritten notes to reduce working-memory strain.");
    suggestions.push("Review key points with active recall instead of rereading continuously.");
  }

  if (testMetrics.reading_accuracy <= 70) {
    suggestions.push("Slow down slightly when reading dense material and summarize each paragraph in one sentence.");
  }

  if (testMetrics.reading_time >= 100) {
    suggestions.push("Break long reading tasks into shorter sections with quick comprehension checks.");
  }

  if (questionnaireScores.attention >= 7 || classification !== "Low Cognitive Load") {
    suggestions.push("Use a Pomodoro cycle with a short break after each focused block.");
  }

  if (questionnaireScores.motivation <= 4) {
    suggestions.push("Break the next task into a smaller, clearly-defined milestone you can finish in 20 minutes.");
  }

  if (benchmarkComparison?.metrics?.reaction_time_mean?.comparison === "above_benchmark_load") {
    suggestions.push("Your reaction speed is slower than the benchmark average, so begin with a short warm-up task before difficult work.");
  }

  if (benchmarkComparison?.metrics?.nback_accuracy?.comparison === "above_benchmark_load") {
    suggestions.push("Your working-memory score is below the benchmark average, so keep fewer items in mind at once and externalize key points.");
  }

  if (benchmarkComparison?.metrics?.reading_accuracy?.comparison === "above_benchmark_load") {
    suggestions.push("Your reading comprehension is below the benchmark average, so pause after each section and restate the main idea in your own words.");
  }

  if (!suggestions.length) {
    suggestions.push("Maintain your current pace and keep using short, scheduled breaks.");
  }

  return [...new Set(suggestions)];
};

module.exports = { buildSuggestions };
