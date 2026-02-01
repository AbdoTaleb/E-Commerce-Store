import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    // Logic to get all products from the database
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // Logic to get featured products from the database
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts));
    }
    // .lean() to get plain JS objects instead of Mongoose documents
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis cache for future requests
    await redis.set("featuredProducts", JSON.stringify(featuredProducts), { EX: 3600 });
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }
    const product = new Product.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
    });

    //const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
    await product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    // Logic to get recommended products from the database
    const products = await Product.aggregate([{ $sample: { size: 3 }, $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } }]);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    // Logic to get products by category from the database
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      // update redis cache
      await updateFeaturedProductsCache();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error toggling featured product:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    // .lean() to get plain JS objects instead of Mongoose documents
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts), { EX: 3600 });
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
};
