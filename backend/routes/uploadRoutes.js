import express from "express";
import multer from "multer";
import path, { extname } from "path";

const router = express.Router();

/* MULTER STORAGE CONFIG 
  Ref -> https://www.npmjs.com/package/multer
*/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    // take the current filename and add the current date to it with the extension name of the file
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

/* MULTER UPDATE CONFIG */
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

/* 
Mutler check file type ref -> https://stackoverflow.com/questions/60408575/how-to-validate-file-extension-with-multer-middleware
*/

function checkFileType(file, cb) {
  // allowed extension names
  const fileTypes = /jpg|jpeg|png/;
  // check if current file matches the extension
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimeType);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb("images only");
  }
}

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
