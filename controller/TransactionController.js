const Product = require("../Model/Product");

const AllTransaction = async (req, res) => {
  try {
    const response = req.body.paginatedResults.results;
    console.log(req.body.paginatedResults);
    if (response.length == 0) {
      return res.status(404).json({ message: "No transaction found" });
    }
    res.status(200).json({ response, result: req.body.paginatedResults });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Statistics = async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    const TotalSaleAmount = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
          sold: true,
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Product.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
      sold: true,
    });

    const totalNotSoldItems = await Product.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
      sold: false,
    });

    const stat = {
      totalSaleAmount:
        TotalSaleAmount.length > 0 ? TotalSaleAmount[0].totalAmount : 0,
      totalSoldItems: totalSoldItems,
      totalNotSoldItems: totalNotSoldItems,
    };
    return stat;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const PriceRangeData = async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    const priceRanges = [
      { range: "0 - 100", min: 0, max: 100 },
      { range: "101 - 200", min: 101, max: 200 },
      { range: "201 - 300", min: 201, max: 300 },
      { range: "301 - 400", min: 301, max: 400 },
      { range: "401 - 500", min: 401, max: 500 },
      { range: "501 - 600", min: 501, max: 600 },
      { range: "601 - 700", min: 601, max: 700 },
      { range: "701 - 800", min: 701, max: 800 },
      { range: "801 - 900", min: 801, max: 900 },
      { range: "901 - above", min: 901, max: Infinity },
    ];

    const priceRangeCounts = {};

    for (const range of priceRanges) {
      const count = await Product.countDocuments({
        $expr: {
          $and: [
            { $eq: [{ $month: "$dateOfSale" }, month] },
            { $gte: ["$price", range.min] },
            { $lte: ["$price", range.max] },
          ],
        },
      });
      priceRangeCounts[range.range] = count;
    }

    // const totalCount = Object.values(priceRangeCounts).reduce(
    //   (total, count) => total + count,
    //   0
    // );

    // const priceRangePercentage = {};
    // for (const range in priceRangeCounts) {
    //   priceRangePercentage[range] =
    //     (priceRangeCounts[range] / totalCount) * 100;
    // }

    // console.log(priceRangePercentage);

    return priceRangeCounts;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const CatagoryData = async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    const CatagoryCounts = await Product.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const pieChartData = {};
    CatagoryCounts.forEach((category) => {
      pieChartData[category._id] = category.count;
    });
    console.log(pieChartData);
    return pieChartData;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const FetchAllData = async (req, res) => {
  try {
    const stats = await Statistics(req, res);
    const priceRange = await PriceRangeData(req, res);
    const PieCatagoryData = await CatagoryData(req, res);
    res.status(200).json({ stats, priceRange, PieCatagoryData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { AllTransaction, FetchAllData };
