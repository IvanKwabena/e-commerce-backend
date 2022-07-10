const express = require('express');

const Category = require('../models/category');

router = express.Router();

// Get a Category
router.get('/', async (req, res) => {
  const category = await Category.find();
  if (!category) {
    res.status(500).json({ success: false });
  }

  res.status(200).json({ category });
});

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({ success: false });
  }

  res.status(200).send(category);
});

// Post a category
router.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) {
    res.status(400).send('Category could not be created');
  }

  res.status(200).send(category);
});

// Update request
router.put('/:id', async (req, res) => {
  const reqID = req.params.id;
  const category = await Category.findByIdAndUpdate(
    reqID,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true },
  );

  if (!category) {
    res.status(400).send('Category could not be updated');
  }

  res.status(200).send(category);
});

// delete a Category
router.delete('/:id', async (req, res) => {
  const deleteCategory = req.params.id;
  const category = await Category.findByIdAndRemove(deleteCategory);

  try {
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Category successfully deleted' });
  } catch (error) {
    return res.status(400).json({ success: false, errorFound: error });
  }
});

module.exports = router;
