const { stringify } = require("csv-stringify/sync");
const User = require("../models/User");
const Session = require("../models/Session");

const getDashboardStats = async (req, res, next) => {
  try {
    const [userCount, sessionCount, latestSessions] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Session.countDocuments(),
      Session.find().sort({ timestamp: -1 }).limit(5).populate("user_id", "name email")
    ]);

    const aggregate = await Session.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$cognitive_load_score" },
          maxScore: { $max: "$cognitive_load_score" },
          severeCases: {
            $sum: {
              $cond: [{ $gte: ["$cognitive_load_score", 76] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      stats: {
        users: userCount,
        sessions: sessionCount,
        averageScore: Math.round(aggregate[0]?.avgScore || 0),
        highestScore: aggregate[0]?.maxScore || 0,
        severeCases: aggregate[0]?.severeCases || 0
      },
      latestSessions
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ created_at: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find()
      .sort({ timestamp: -1 })
      .populate("user_id", "name email role");
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Session.deleteMany({ user_id: user._id });
    await user.deleteOne();

    res.json({ message: "User and related sessions deleted." });
  } catch (error) {
    next(error);
  }
};

const exportDataset = async (req, res, next) => {
  try {
    const sessions = await Session.find().populate("user_id", "email role");
    const rows = sessions.map((session) => ({
      session_id: session.session_id,
      user_email: session.user_id?.email,
      user_role: session.user_id?.role,
      timestamp: session.timestamp.toISOString(),
      reaction_time_mean: session.test_metrics.reaction_time_mean,
      reaction_time_variance: session.test_metrics.reaction_time_variance,
      nback_accuracy: session.test_metrics.nback_accuracy,
      memory_span: session.test_metrics.memory_span,
      reading_accuracy: session.test_metrics.reading_accuracy,
      reading_time: session.test_metrics.reading_time,
      stroop_interference_score: session.test_metrics.stroop_interference_score,
      questionnaire_total: session.questionnaire_scores.total,
      cognitive_load_score: session.cognitive_load_score,
      ml_prediction: session.ml_prediction?.label
    }));

    const csv = stringify(rows, { header: true });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=dataset.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ session_id: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    await session.deleteOne();
    res.json({ message: "Session deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllSessions,
  deleteUser,
  exportDataset,
  deleteSession
};
