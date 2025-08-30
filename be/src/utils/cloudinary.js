import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload ke cloudinary
export const uploadToCloudinary = async (fileBuffer, folder = "imgProfile") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder, // defailt imgProfile folder -> bisa diubah saat dipanggil
        resource_type: "image",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "limit",
          },
        ],
        unique_filename: true,
        use_filename: false,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(new Error("Failed to upload image"));
        }
        return resolve(result.secure_url);
      }
    );

    // proteksi DoS (timeout)
    const timeout = setTimeout(() => {
      uploadStream.destroy();
      reject(new Error("Request timeout"));
    }, 20_000);

    uploadStream.on("finish", () => clearTimeout(timeout));
    uploadStream.end(fileBuffer);
  });
};
