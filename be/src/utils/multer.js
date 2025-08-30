import multer from "multer";
import path from "path";

const imageMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
const vallidExtensions = [".jpg", ".jpeg", ".png"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLocaleLowerCase();
  if (
    !imageMimeTypes.includes(file.mimetype) ||
    !vallidExtensions.includes(ext)
  ) {
    return cb(new Error("Invalid image file type"));
  }
  cb(null, true);
};

const storage = multer.memoryStorage(); //simpan file di buffer

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // max 5mb
  },
}).single("imgProfile");
