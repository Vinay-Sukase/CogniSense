const { calculateCognitiveLoadScore } = require("../services/cognitiveScoreService");

describe("cognitiveScoreService", () => {
  it("returns a bounded score and classification", () => {
    const result = calculateCognitiveLoadScore({
      testMetrics: {
        reaction_time_mean: 800,
        nback_accuracy: 55,
        reading_accuracy: 72,
        stroop_interference_score: 63
      },
      questionnaireScores: {
        total: 38
      }
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.classification).toBeDefined();
  });
});

