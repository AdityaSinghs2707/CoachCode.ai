const compilerService = require("../services/compilerService");
const { QuestionAttempt } = require("../models");

exports.execute = async (req, res) => {
  try {
    const { code, language, stdin, questionId } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: "code and language are required" });
    }
    const result = await compilerService.createSubmission(code, language, stdin || "");

    const statusMap = {
      3: "accepted",
      4: "wrong",
      5: "wrong",
      6: "error",
      7: "error",
      8: "error",
      9: "error",
      10: "error",
    };
    const status = statusMap[result.status?.id] || "pending";

    if (req.user && questionId) {
      await QuestionAttempt.create({
        userId: req.user.id,
        questionId,
        code,
        language,
        status,
        score: status === "accepted" ? 100 : 0,
      });
    }

    return res.json({
      success: true,
      data: {
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        compile_output: result.compile_output || "",
        time: result.time,
        memory: result.memory,
        status: result.status?.description || "Unknown",
        exit_code: result.exit_code,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.response?.data?.message || err.message || "Execution failed" });
  }
};

exports.languages = (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 54, name: "C++" },
      { id: 50, name: "C" },
      { id: 71, name: "Python" },
      { id: 62, name: "Java" },
      { id: 63, name: "JavaScript" },
    ],
  });
};
