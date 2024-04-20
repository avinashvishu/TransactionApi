const Product = require("../Model/Product");

const Pagination = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const month = req.query.month && parseInt(req.query.month);
  const searchQuery = req.query.search;
  const limit = 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  let count;
  if (searchQuery) {
    if (!isNaN(searchQuery)) {
      count = await Product.aggregate([
        {
          $match: {
            price: {
              $gte: parseInt(searchQuery) - 1,
              $lte: parseInt(searchQuery) + 1,
            },
          },
        },
        { $addFields: { month: { $month: "$dateOfSale" } } },
        { $match: { month: month } },
        { $project: { month: 0 } },
      ]).exec();
      if (endIndex < count.length) {
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
          {
            $match: {
              price: {
                $gte: parseInt(searchQuery) - 1,
                $lte: parseInt(searchQuery) + 1,
              },
            },
          },
          { $addFields: { month: { $month: "$dateOfSale" } } },
          { $match: { month: month || 3 } },
          { $project: { month: 0 } },
        ])
          .limit(limit)
          .skip(startIndex)
          .exec();
        req.body.paginatedResults = results;
        next();
      } catch (e) {
        res.status(500).json({ message: e.message });
      }
    } else {
      count = await Product.aggregate([
        { $match: { $text: { $search: searchQuery } } },
        { $addFields: { month: { $month: "$dateOfSale" } } },
        { $match: { month: month } },
        { $project: { month: 0 } },
      ]).exec();
      if (endIndex < count.length) {
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
          { $match: { $text: { $search: searchQuery } } },
          { $addFields: { month: { $month: "$dateOfSale" } } },
          { $match: { month: month || 3 } },
          { $project: { month: 0 } },
        ])
          .limit(limit)
          .skip(startIndex)
          .exec();
        req.body.paginatedResults = results;
        next();
      } catch (e) {
        res.status(500).json({ message: e.message });
      }
    }
  }

  //If user not provide any search queries
  count = await Product.aggregate([
    { $addFields: { month: { $month: "$dateOfSale" } } },
    { $match: { month: month } },
    { $project: { month: 0 } },
  ]).exec();
  if (endIndex < count.length) {
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
      { $match: { month: month || 3 } },
      { $project: { month: 0 } },
    ])
      .limit(limit)
      .skip(startIndex)
      .exec();
    req.body.paginatedResults = results;
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = Pagination;
