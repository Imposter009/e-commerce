
const multer  = require('multer')
const express = require('express');
const router = express.Router();
const path = require('path');

const { Product } = require('../model/Product');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, discountPercentage, stock, brand, category } = req.body;
    const thumbnail = req.files['thumbnail'][0].filename;
    const images = req.files['images'].map(file => file.filename);

    const product = new Product({
      title,
      description,
      price,
      discountPercentage,
      stock,
      brand,
      category,
      thumbnail,
      images,
    });

    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(4000).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    let updateData = req.body;
    if (req.files['thumbnail']) {
      updateData.thumbnail = req.files['thumbnail'][0].filename;
    }
    if (req.files['images']) {
      updateData.images = req.files['images'].map(file => file.filename);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
