const AllTransaction = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { AllTransaction };
