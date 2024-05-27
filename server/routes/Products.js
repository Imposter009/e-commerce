const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
const multer = require('multer');
const router = express.Router();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

if (!fs.existsSync("public/uploads/")) {
  fs.mkdirSync(`public/uploads/`);
}
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// /products is already added in base path
router.post('/', upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'image3', maxCount: 1 }
    ]), createProduct)
  .get('/', fetchAllProducts)
  .get('/:id', fetchProductById)
  .patch('/:id', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 3 }]), updateProduct);

exports.router = router;
