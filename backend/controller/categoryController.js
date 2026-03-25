const Category = require("../model/Category");

const createCategory = async (req, res) => {
  try {
    const { category_name, description, image, store_id } = req.body;

    const existingCategory = await Category.findOne({
      category_name,
      store_id,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists in this store",
      });
    }

    const category = new Category({
      category_name,
      description,
      image,
      store_id,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find().populate("store_id");

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      count: categories.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("store_id");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_name, description, image } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { category_name, description, image },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // fixed: removed extra Category.deleteOne() that was deleting a random category
    // fixed: changed .jsom() typo to .json() in catch block

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ // fixed: was .jsom() which crashed Node
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
};
