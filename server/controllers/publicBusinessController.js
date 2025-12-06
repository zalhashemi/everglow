const Business = require("../models/Business");
const Service = require("../models/Service");
const Offer = require("../models/Offer");
const Review = require("../models/Review");
const Booking = require("../models/Booking");

async function attachRatings(businesses) {
  if (!businesses || businesses.length === 0) return [];

  const businessIds = businesses.map((b) => b._id);

  const ratingStats = await Review.aggregate([
    { $match: { business: { $in: businessIds } } },
    {
      $group: {
        _id: "$business",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const ratingMap = new Map();
  ratingStats.forEach((stat) => {
    ratingMap.set(String(stat._id), {
      averageRating: stat.averageRating,
      reviewCount: stat.reviewCount,
    });
  });

  return businesses.map((b) => {
    const stats = ratingMap.get(String(b._id)) || {};
    const averageRating = stats.averageRating || 0;
    const reviewCount = stats.reviewCount || 0;

    return {
      ...b,
      averageRating: Number(averageRating.toFixed(1)) || 0,
      reviewCount,
    };
  });
}

const getAllBusinesses = async (req, res) => {
  try {
    let businesses = await Business.find().lean();
    businesses = await attachRatings(businesses);

    res.json(businesses);
  } catch (err) {
    console.error("Error loading businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBusinessDetails = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .select(
        "businessName businessType address city description operatingHours socialLinks staff imageUrl location"
      )
      .lean();

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const services = await Service.find({ business: business._id });
    const offers = await Offer.find({
      business: business._id,
      validTo: { $gte: new Date() },
    });

    
    const [withRating] = await attachRatings([business]);

    res.json({
      business: withRating,
      services,
      offers,
    });
  } catch (err) {
    console.error("Error loading business details:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getHighestRatedBusinesses = async (req, res) => {
  try {
    let businesses = await Business.find().lean();
    businesses = await attachRatings(businesses);

    businesses.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

    res.json(businesses.slice(0, 13));
  } catch (err) {
    console.error("Error loading highest rated:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTrendingBusinesses = async (req, res) => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const bookingAgg = await Booking.aggregate([
      {
        $match: {
          startTime: { $gte: oneMonthAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: "$business",
          bookingsCount: { $sum: 1 },
        },
      },
      { $sort: { bookingsCount: -1 } },
      { $limit: 13 },
    ]);

    if (bookingAgg.length === 0) return res.json([]);

    const ids = bookingAgg.map((b) => b._id);
    let businesses = await Business.find({ _id: { $in: ids } }).lean();

    const bookingsMap = new Map();
    bookingAgg.forEach((b) => {
      bookingsMap.set(String(b._id), b.bookingsCount);
    });

    businesses = await attachRatings(businesses);

    const final = businesses
      .map((b) => ({
        ...b,
        bookingsCount: bookingsMap.get(String(b._id)) || 0,
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount);

    res.json(final);
  } catch (err) {
    console.error("Error loading trending:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessDetails,
  getTrendingBusinesses,
  getHighestRatedBusinesses,
};
