const Product = require("../Model/Product");
const Pagination = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const month = parseInt(req.query.month);
  const searchQuery = req.query.search;
  const limit = 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (searchQuery) {
    if (!isNaN(searchQuery)) {
    } else {
      filter.$or = [{ $text: { $search: searchQuery } }];
    }
  }

  if (
    endIndex <
    (await Product.aggregate([
      { $addFields: { month: { $month: "$dateOfSale" } } },
      { $match: { month: month } },
      { $project: { month: 0 } },
    ])
      .countDocuments()
      .exec())
  ) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  try {
    results.results = await Product.aggregate([
      { $addFields: { month: { $month: "$dateOfSale" } } },
      { $match: { month: month } },
      { $project: { month: 0 } },
    ])
      .limit(limit)
      .skip(startIndex)
      .exec();
    res.paginatedResults = results;
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = Pagination;
