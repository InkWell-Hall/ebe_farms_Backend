import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Ebe_Farms", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }] // optional
  },
});

// Middleware for handling up to 5 images with field name "images"
export const multipleImages = multer({ storage }).array("images", 5);