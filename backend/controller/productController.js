const Product = require("../model/Product");

const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      category_id,
      cost_price,
      sell_price,
      stock_quantity,
      store_id,
    } = req.body;
    
    const product = new Product({
      product_name,
      category_id,
      cost_price,
      sell_price,
      stock_quantity,
      store_id,
    });

    await product.save(); // Fixed: changed Product.save() to product.save()

    res.status(200).json({
      success: true,
      message: "tapaiko safalta purbal naya Product baneko xa",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find()
      .populate("category_id")
      .populate("store_id");

    res.status(200).json({
      success: true, // Fixed: changed false to true
      message: "tapaiko product hary yesh prakar ko raheko xa",
      data: product,
      count: product.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false, // Fixed: changed sucess to success
      error: err.message,
    });
  }
};

const getProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category_id")
      .populate("store_id");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "tapaiko yo id ma kunei pani product xoina",
      });
    }

    res.status(200).json({
      success: true,
      message: "tapaiko product ko id yes prakar raheko xa ",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      product_name,
      category_id,
      cost_price,
      sell_price,
      stock_quantity,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        product_name,
        category_id,
        cost_price,
        sell_price,
        stock_quantity,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "tapaiko yo id ma kunei pani product xaina ",
      });
    }

    res.status(200).json({
      success: true, // Fixed: changed false to true
      message: "tapaiko successfulyy product update vayo nih",
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this ID", // Fixed: removed err.message
      });
    }

    // Removed: await Product.deleteOne(); - This was extra/incorrect

    res.status(200).json({
      success: true,
      message: "tapaiko product successfully delete vayo !!!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ✅ Module exports at the END of file, outside all functions
module.exports = {
  createProduct,
  getAllProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
};