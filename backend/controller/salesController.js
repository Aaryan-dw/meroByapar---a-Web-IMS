const Sale = require('../model/Sale');
const SaleItem = require('../model/SaleItem');
const Product = require('../model/Product');
const User = require('../model/User');
const Store = require('../model/Store');

const createSale = async (req, res) => {
  try {
    const { cashier_id, store_id, discount, payment_method } = req.body;

    // Validate cashier
    const cashier = await User.findById(cashier_id);
    if (!cashier) return res.status(404).json({ success: false, message: "Cashier not found" });

    // Validate store
    const store = await Store.findById(store_id);
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    const sale = new Sale({
      cashier_id,
      store_id,
      discount: discount || 0,
      payment_method
    });

    await sale.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('cashier_id', 'name')
      .populate('store_id', 'store_name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashier_id', 'name')
      .populate('store_id', 'store_name');

    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" });

    // Get sale items
    const items = await SaleItem.find({ sale_id: sale._id })
      .populate('product_id', 'product_name price');

    // Calculate sum_total
    const sum_total = items.reduce((sum, item) => sum + item.subtotal, 0);
    sale.sum_total = sum_total - (sale.discount || 0);
    await sale.save();

    res.status(200).json({
      success: true,
      data: { sale, items }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" });

    // Delete related SaleItems and restore stock
    const items = await SaleItem.find({ sale_id: sale._id });
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        product.stock_quantity += item.quantity;
        await product.save();
      }
    }
    await SaleItem.deleteMany({ sale_id: sale._id });
    await Sale.findByIdAndDelete(sale._id);

    res.status(200).json({ success: true, message: "Sale and its items deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {deleteSale,getSaleById,getAllSales,createSale};