const axios = require("axios");
const env = require("../config/env");

const predictCognitiveState = async (payload) => {
  try {
    const response = await axios.post(`${env.mlServiceUrl}/predict`, payload, {
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    return {
      label: "Moderate Load",
      model: "rule-fallback",
      probabilities: {},
      warning: "ML service unavailable. Returned fallback prediction."
    };
  }
};

module.exports = { predictCognitiveState };

