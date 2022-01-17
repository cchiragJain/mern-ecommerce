import express from "express";
import path from "path";
import multer from "multer";

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
Mutler check file type 
Ref -> https://stackoverflow.com/questions/60408575/how-to-validate-file-extension-with-multer-middleware
*/
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

// single route no need to make a controller
router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
