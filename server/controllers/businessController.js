// server/controllers/businessController.js
const Business = require("../models/Business");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/**
 * REGISTER BUSINESS
 *
 * Supports TWO kinds of payload:
 *
 * 1) OLD STYLE (auth + owner)
 * 2) NEW WIZARD STYLE (your multi-step registration with image)
 */
const registerBusiness = async (req, res) => {
  try {
    console.log("🔥 registerBusiness called");
    console.log("Raw req.body:", req.body);
    console.log("Has file?", !!req.file);

    // ---------- 1. Helper to parse possible JSON strings ----------
    const parseMaybeJson = (value, fallback) => {
      if (!value) return fallback;
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.warn("Failed to parse JSON field:", value);
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

    // ---------- 2. Image handling ----------
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log("✅ Image uploaded:", imageUrl);
    }

    // ---------- 3. NEW WIZARD FLOW ----------
    if (isWizardPayload) {
      console.log("🧙 Using NEW wizard payload");

      const {
        name,
        type,
        email,
        phone,
        address,
        city,
        about,
      } = businessInfo;

      // Map staff into your schema
      const mappedStaff = (wizardStaffRaw || [])
        .filter(
          (member) =>
            member?.name ||
            member?.fullName ||
            member?.email ||
            member?.phone ||
            member?.role
        )
        .map((member) => ({
          fullName: member.fullName || member.name || "",
          role: member.role || "",
          email: member.email || "",
          phone: member.phone || "",
        }));

      if (!email || !name || !type || !address || !city) {
        return res.status(400).json({
          message: "Missing required fields (name, type, email, address, city)",
        });
      }

      const existing = await Business.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const business = await Business.create({
        // no owner/password for wizard flow
        email,
        phone,
        businessName: name,
        businessType: type,
        address,
        city,
        description: about,
        operatingHours: wizardOperatingHours,
        staff: mappedStaff,
        socialLinks: wizardSocialLinks,
        imageUrl, // ✅ cover image
        services: [],
      });

      console.log("✅ Saved wizard business to DB:", {
        id: business._id,
        businessName: business.businessName,
        email: business.email,
      });

      // ✅ IMPORTANT: RETURN TOKEN HERE TOO
      return res.status(201).json({
        message: "Business registered successfully",
        token: generateToken(business._id),
        business,
      });
    }

    // ---------- 4. OLD AUTH-STYLE FLOW ----------
    console.log("📦 Using OLD auth-style payload");

    let {
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
    } = req.body || {};

    if (!email || !businessName || !businessType || !address || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ownerFirstName || !ownerLastName || !password) {
      return res
        .status(400)
        .json({ message: "Owner name and password are required" });
    }

    const existing = await Business.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);
    const finalStaff = Array.isArray(staff) ? staff : [];

    const business = await Business.create({
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
      staff: finalStaff,
      socialLinks,
      imageUrl,
      services: [],
    });

    console.log("✅ Saved old-flow business to DB:", {
      id: business._id,
      businessName: business.businessName,
      email: business.email,
    });

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

// LOGIN
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

// GET MY BUSINESS PROFILE
const getMyBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.business._id).populate(
      "services"
    );
    res.json(business);
  } catch (err) {
    console.error("Error in getMyBusinessProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE MY BUSINESS PROFILE
const updateMyBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updated = await Business.findByIdAndUpdate(
      req.business._id,
      updates,
      { new: true }
    ).populate("services");

    res.json({ message: "Business updated", business: updated });
  } catch (err) {
    console.error("Error in updateMyBusinessProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
};
