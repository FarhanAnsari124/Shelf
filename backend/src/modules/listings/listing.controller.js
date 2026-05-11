const Listing = require("./listing.model");
const cloudinary = require("../../utils/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "shelf_listings" }, (err, res) => err ? reject(err) : resolve(res));
    stream.end(buffer);
  });
};

exports.createListing = async (req, res, next) => {
  try {
    const { title, description, category, condition, price, isPriceNegotiable, location, tags } = req.body;
    const images = [];
    
    if (req.files) {
      for (const f of req.files) {
        const res = await uploadToCloudinary(f.buffer);
        images.push(res.secure_url);
      }
    }

    const listing = await Listing.create({
      sellerId: req.user.id,
      title, description, category, condition,
      price: price || 0,
      isPriceNegotiable: isPriceNegotiable === "true" || isPriceNegotiable === true,
      images, location,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
    });

    res.status(201).json({ success: true, data: listing });
  } catch (e) { next(e); }
};

exports.getListings = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, condition, sort } = req.query;
    const query = { status: "active" };

    if (search) {
      query.$or = ["title", "description", "tags", "category"].map(f => ({ [f]: { $regex: search, $options: "i" } }));
    }
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOpt = sort === "price_asc" ? "price" : sort === "price_desc" ? "-price" : "-createdAt";
    const data = await Listing.find(query).populate("sellerId", "name avatarUrl trustScore role avgRating").sort(sortOpt);

    res.json({ success: true, count: data.length, data });
  } catch (e) { next(e); }
};

exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("sellerId", "name avatarUrl trustScore role avgRating department yearOfStudy hostel whatsapp")
      .populate("reports");

    if (!listing) return res.status(404).json({ success: false });

    listing.viewCount += 1;
    await listing.save();
    res.json({ success: true, data: listing });
  } catch (e) { next(e); }
};

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false });

    if (listing.sellerId.toString() !== req.user.id && req.user.role !== "college_admin") {
      return res.status(403).json({ success: false });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false });

    if (listing.sellerId.toString() !== req.user.id && req.user.role !== "college_admin") {
      return res.status(403).json({ success: false });
    }

    await listing.deleteOne();
    res.json({ success: true, data: {} });
  } catch (e) { next(e); }
};
