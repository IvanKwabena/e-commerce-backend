const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const uploadOptions = require('../helpers/multer');
const { isAdmin } = require('../helpers/jwt');

const router = express.Router();

// Get Product
router.get('/', async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }

  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// Get a Single Product
router.get('/:id', async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).send('Invalid ID passed by user URL');
  }

  // console.log();

  const product = await Product.findById(productId).populate('category');

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

// Get the count of all Product
router.get('/get/count', async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

// Get featured Products
router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

// Post a Product
router.post('/', isAdmin, uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const { file } = req;
  if (!file) return res.status(400).send('No image in the request');

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send('The product cannot be created');

  res.send(product);
});

// Update a Product
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send('Invalid Product!');

  const { file } = req;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(500).send('the product cannot be updated!');
  }

  res.send(updatedProduct);
});

// Delete a Product
router.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: 'the product is deleted!',
        });
      }
      return res
        .status(404)
        .json({ success: false, message: 'product not found!' });
    })
    .catch((err) => res.status(500).json({ success: false, error: err }));
});

// Upload multiple Images
router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Product Id');
    }

    const { files } = req;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send('the gallery cannot be updated!');

    res.send(product);
  }
);

module.exports = router;
