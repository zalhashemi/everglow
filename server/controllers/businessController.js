const Business = require("../models/Business");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Loyalty = require("../models/loyalty"); 
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


const geocodeAddressWithMapbox = async (fullAddress) => {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token || !fullAddress) {
    console.warn("Mapbox token or address missing, skipping geocode");
    return null;
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      fullAddress
    )}.json`;

    const response = await axios.get(url, {
      params: { access_token: token, limit: 1 },
    });

    const features = response.data?.features || [];
    if (!features.length) return null;

    const [lng, lat] = features[0].center;
    return { lat, lng };
  } catch (err) {
    console.error("Error geocoding address with Mapbox:", err.message);
    return null;
  }
};

const createDefaultLoyaltyForBusiness = async (businessId) => {
  try {
    const existing = await Loyalty.findOne({ business: businessId });
    if (!existing) {
      await Loyalty.create({
        business: businessId,
        enabled: false,
        type: "points",
        pointsPerBooking: 1,
        rewardThreshold: 5,
        rewardDescription: "",
        expiryMonths: 0,
        rewards: [],
      });
    }

    await Business.findByIdAndUpdate(
      businessId,
      {
        $set: {
          "loyalty.enabled": false,
          "loyalty.type": "points",
          "loyalty.pointsPerBooking": 1,
          "loyalty.rewardThreshold": 5,
          "loyalty.rewardDescription": "",
          "loyalty.expiryMonths": 0,
          "loyalty.rewards": [],
          loyaltyEnabled: false,
        },
      },
      { new: true }
    );
  } catch (err) {
    console.error("Error creating default loyalty for business:", err);
  }
};

const registerBusiness = async (req, res) => {
  try {
    console.log("registerBusiness called");

    const parseMaybeJson = (value, fallback) => {
      if (!value) return fallback;
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return fallback;
        }
      }
      return value;
    };

    const businessInfo = parseMaybeJson(req.body?.businessInfo, {});
    const wizardOperatingHours = parseMaybeJson(req.body?.operatingHours, {});
    const wizardSocialLinks = parseMaybeJson(req.body?.socialLinks, {});
    const wizardStaffRaw = parseMaybeJson(req.body?.staff, []);

    const isWizardPayload = Object.keys(businessInfo).length > 0;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }


    if (isWizardPayload) {
      const {
        name,
        type,
        email,
        phone,
        about,
        locationLat,
        locationLng,
        genderTag,
        address,
        city,
      } = businessInfo;

      const mappedStaff = (wizardStaffRaw || [])
  .filter((m) => m?.name || m?.email || m?.role)
  .map((m) => ({
    fullName: m.fullName || m.name || "",
    role: m.role || "",
    email: m.email || "",
    phone: m.phone || "",
    schedule: m.schedule || {}, 
  }));

     
      if (!email || !name || !type || !phone || !genderTag) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const hasLocation =
        typeof locationLat === "number" &&
        typeof locationLng === "number" &&
        !Number.isNaN(locationLat) &&
        !Number.isNaN(locationLng);

      if (!hasLocation) {
        return res
          .status(400)
          .json({ message: "Location is required for business registration" });
      }

      const existing = await Business.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const rawPassword = req.body.password;
      if (!rawPassword) {
        return res
          .status(400)
          .json({ message: "Password is required for business login" });
      }

      const passwordHash = await bcryptjs.hash(rawPassword, 10);

      const businessData = {
        email,
        phone,
        businessName: name,
        businessType: type,
        address: address || "N/A",
        city: city || "N/A",
        description: about,
        operatingHours: wizardOperatingHours,
        staff: mappedStaff,
        socialLinks: wizardSocialLinks,
        imageUrl,
        passwordHash,
        genderTag, 
      };

      let coords = null;

      if (hasLocation) {
        coords = { lat: locationLat, lng: locationLng };
      } else if (address && city) {
        const fullAddress = `${address}, ${city}`;
        try {
          coords = await geocodeAddressWithMapbox(fullAddress);
        } catch (err) {
          console.error("Geocode error:", err);
        }
      }

      if (
        coords &&
        typeof coords.lng === "number" &&
        typeof coords.lat === "number"
      ) {
        businessData.location = {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        };
      }

      const business = await Business.create(businessData);
      await createDefaultLoyaltyForBusiness(business._id);

      return res.status(201).json({
        message: "Business registered successfully",
        token: generateToken(business._id),
        business,
      });
    }

    const {
      ownerFirstName,
      ownerLastName,
      email,
      password,
      phone,
      businessName,
      businessType,
      address,
      city,
      description,
      operatingHours,
      staff,
      socialLinks,
    } = req.body;

    if (!email || !businessName || !businessType || !address || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ownerFirstName || !ownerLastName || !password) {
      return res
        .status(400)
        .json({ message: "Owner name and password required" });
    }

    const existing = await Business.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const businessData = {
      ownerFirstName,
      ownerLastName,
      email,
      passwordHash,
      phone,
      businessName,
      businessType,
      address,
      city,
      description,
      operatingHours,
      staff: Array.isArray(staff) ? staff : [],
      socialLinks,
      imageUrl,
    };

    const fullAddress = `${address}, ${city}`;
    let coords = null;
    try {
      coords = await geocodeAddressWithMapbox(fullAddress);
    } catch {}

    if (
      coords &&
      typeof coords.lng === "number" &&
      typeof coords.lat === "number"
    ) {
      businessData.location = {
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      };
    }

    const business = await Business.create(businessData);
    await createDefaultLoyaltyForBusiness(business._id);

    return res.status(201).json({
      message: "Business registered successfully",
      token: generateToken(business._id),
      business,
    });
  } catch (err) {
    console.error("Error in registerBusiness:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcryptjs.compare(password, business.passwordHash || "");
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(business._id),
      business,
    });
  } catch (err) {
    console.error("Error in loginBusiness:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.business._id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(business);
  } catch (err) {
    console.error("Error in getMyBusinessProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMyBusinessProfile = async (req, res) => {
  try {
    const parseMaybeJson = (value, fallback) => {
      if (!value) return fallback;
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return fallback;
        }
      }
      return value;
    };

    const body = req.body;
    const updates = {};
    const businessInfo = parseMaybeJson(body.businessInfo, null);
    const wizardOperatingHours = parseMaybeJson(body.operatingHours, null);
    const wizardSocialLinks = parseMaybeJson(body.socialLinks, null);
    const wizardStaffRaw = parseMaybeJson(body.staff, null);

    if (businessInfo) {
      const {
        name,
        type,
        email,
        phone,
        address,
        city,
        about,
        imageUrl,
        genderTag,
      } = businessInfo;

      if (email !== undefined) updates.email = email;
      if (phone !== undefined) updates.phone = phone;
      if (name !== undefined) updates.businessName = name;
      if (type !== undefined) updates.businessType = type;
      if (address !== undefined) updates.address = address;
      if (city !== undefined) updates.city = city;
      if (about !== undefined) updates.description = about;
      if (imageUrl !== undefined) updates.imageUrl = imageUrl;
      if (genderTag !== undefined) updates.genderTag = genderTag;
    }

    if (wizardOperatingHours) {
      updates.operatingHours = wizardOperatingHours;
    }

    if (wizardSocialLinks) {
      updates.socialLinks = wizardSocialLinks;
    }

    if (Array.isArray(wizardStaffRaw)) {
      updates.staff = wizardStaffRaw
        .filter((m) => m && (m.name || m.fullName || m.role))
        .map((m) => ({
          fullName: m.fullName || m.name || "",
          role: m.role || "",
          email: m.email || "",
          phone: m.phone || "",
          schedule: m.schedule || {},
        }));
    }

    if (body.businessName !== undefined) updates.businessName = body.businessName;
    if (body.businessType !== undefined) updates.businessType = body.businessType;
    if (body.description !== undefined) updates.description = body.description;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.address !== undefined) updates.address = body.address;
    if (body.city !== undefined) updates.city = body.city;
    if (body.email !== undefined) updates.email = body.email;
    if (body.operatingHours !== undefined && !wizardOperatingHours) {
      updates.operatingHours = body.operatingHours;
    }
    if (body.socialLinks !== undefined && !wizardSocialLinks) {
      updates.socialLinks = body.socialLinks;
    }
    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl;
    }
    if (body.genderTag !== undefined) {
      updates.genderTag = body.genderTag;
    }

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updated = await Business.findByIdAndUpdate(
      req.business._id,
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ message: "Business updated", business: updated });
  } catch (err) {
    console.error("Error in updateMyBusinessProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getNearbyBusinesses = async (req, res) => {
  try {
    let { lat, lng, radiusKm, search } = req.query;
    const textFilter = search
      ? {
          $or: [
            { businessName: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const latitude = lat !== undefined ? parseFloat(lat) : NaN;
    const longitude = lng !== undefined ? parseFloat(lng) : NaN;
    const radius = radiusKm ? parseFloat(radiusKm) : 200; 

    let geoFilter = {};
    if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
      geoFilter = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], 
            },
            $maxDistance: radius * 1000, 
          },
        },
      };
    } else {
      geoFilter = {
        "location.coordinates": { $exists: true, $ne: [] },
      };
    }

    const businesses = await Business.find({
      ...textFilter,
      ...geoFilter,
    }).select(
      "businessName businessType address city description imageUrl location genderTag"
    );

    res.json(businesses);
  } catch (err) {
    console.error("Error in getNearbyBusinesses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBusinessProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const updated = await Business.findByIdAndUpdate(
      req.business._id,
      { $set: { imageUrl } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({
      message: "Profile image updated",
      imageUrl,
      business: updated,
    });
  } catch (err) {
    console.error("Error in updateBusinessProfileImage:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBusinessDashboardStats = async (req, res) => {
  try {
    const businessId = req.business._id;

    const business = await Business.findById(businessId).select("staff");
    const staffMembers = business?.staff?.length || 0;

    const distinctCustomers = await Booking.distinct("customer", {
      business: businessId,
    });
    const totalClients = Array.isArray(distinctCustomers)
      ? distinctCustomers.length
      : 0;

    const ratingAgg = await Review.aggregate([
      { $match: { business: businessId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    let avgRating = 0;
    let reviewCount = 0;

    if (ratingAgg && ratingAgg.length) {
      avgRating = ratingAgg[0].avgRating || 0;
      reviewCount = ratingAgg[0].count || 0;
    }

    res.json({
      staffMembers,
      totalClients,
      avgRating,
      reviewCount,
    });
  } catch (err) {
    console.error("Error in getBusinessDashboardStats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
  getNearbyBusinesses,
  updateBusinessProfileImage,
  getBusinessDashboardStats,
};
