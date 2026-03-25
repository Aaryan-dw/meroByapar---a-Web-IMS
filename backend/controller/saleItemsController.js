const SaleItem = require("../model/SaleItem");
const Sale = require("../model/Sale");
const Product = require("../model/Product");

const createSaleItem = async (req, res) => {
  try {
    const { sale_id, product_id, quantity, price, discount } = req.body;

    // Check if sale exists
    const sale = await Sale.findById(sale_id);
    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const saleItem = new SaleItem({
      sale_id,
      product_id,
      quantity,
      price,
      discount: discount || 0,
    });

    await saleItem.save();

    // Update product stock (reduce stock on sale)
    product.stock_quantity -= quantity;
    if (product.stock_quantity < 0) product.stock_quantity = 0; // prevent negative stock
    await product.save();

    await saleItem.populate("product_id", "product_name");

    res.status(201).json({
      success: true,
      message: "Sale item created successfully",
      data: saleItem,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getItemsBySaleId = async (req, res) => {
  try {
    const saleItems = await SaleItem.find({
      sale_id: req.params.saleId,
    }).populate("product_id", "product_name price");

    res.status(200).json({
      success: true,
      count: saleItems.length,
      data: saleItems,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateSaleItem = async (req, res) => {
  try {
    const { quantity, price, discount } = req.body;

    const item = await SaleItem.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Sale item not found" });

    // Update stock quantity correctly
    const product = await Product.findById(item.product_id);
    if (product) {
      // Reverse old quantity first
      product.stock_quantity += item.quantity;
      // Apply new quantity
      if (quantity) product.stock_quantity -= quantity;
      if (product.stock_quantity < 0) product.stock_quantity = 0;
      await product.save();
    }

    if (quantity) item.quantity = quantity;
    if (price) item.price = price;
    if (discount !== undefined) item.discount = discount;

    await item.save();
    await item.populate("product_id", "product_name");

    res.status(200).json({
      success: true,
      message: "Sale item updated",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteSaleItem = async (req, res) => {
  try {
    const item = await SaleItem.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Sale item not found" });

    // Reverse stock
    const product = await Product.findById(item.product_id);
    if (product) {
      product.stock_quantity += item.quantity;
      await product.save();
    }

    await SaleItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Sale item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const bulkCreateSaleItems = async (req, res) => {
  try {
    const { sale_id, items } = req.body;

    const sale = await Sale.findById(sale_id);
    if (!sale)
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });

    const createdItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) continue;

      const saleItem = new SaleItem({
        sale_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
      });

      await saleItem.save();

      // Update stock
      product.stock_quantity -= item.quantity;
      if (product.stock_quantity < 0) product.stock_quantity = 0;
      await product.save();

      createdItems.push(saleItem);
    }

    res.status(201).json({
      success: true,
      message: "Bulk sale items created",
      count: createdItems.length,
      data: createdItems,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  bulkCreateSaleItems,
  deleteSaleItem,
  updateSaleItem,
  getItemsBySaleId,
  createSaleItem,
};
