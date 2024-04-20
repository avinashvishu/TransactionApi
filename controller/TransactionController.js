const AllTransaction = async (req, res) => {
  try {
    const response = req.body.paginatedResults.results;
    console.log(response);
    if (response.length == 0) {
      return res.status(404).json({ message: "No transaction found" });
    }
    res.status(200).json({ response, count: req.body.paginatedResults.count });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { AllTransaction };
